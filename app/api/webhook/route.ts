import { NextResponse } from 'next/server';
import { draftDb } from '@/lib/draftsDb';
import { z } from 'zod';
import { sanitizeAgentMarkdown } from '@/lib/agentHelper';

// NOTE: runtime declaration removed - on Cloudflare Workers with nodejs_compat all routes
// run in the Node.js-compatible Workers runtime, making 'edge' declaration both unnecessary
// and incompatible with @opennextjs/cloudflare (which requires edge routes in separate functions).

// Define strict schema for incoming Python agent payload.
// Why Zod schema validation: We must not blindly trust external agent payloads.
// Zod enforces a strict data contract, ensuring types are correct (e.g. word_count is a number)
// and throwing detailed validation errors if the external agent breaks the contract.
const WebhookPayloadSchema = z.object({
  topic: z.string().min(1),
  // Why 'discarded' is included: The Python agent sends this terminal state when an article
  // fails AdSense compliance checks 3 times. Without it, Zod returns 400, causing tenacity
  // to retry the callback 5 times on an endpoint that will never accept the payload.
  status: z.enum(['success', 'error', 'discarded']),
  error: z.string().optional().default(''),
  article: z.string().optional().default(''),
  word_count: z.preprocess((val) => parseInt(String(val), 10) || 0, z.number().min(0)),
  image_url: z.string().optional().default(''),
  // Why description is included: The Python agent generates a clean meta description from the
  // article content. This field was previously silently dropped, leaving published articles
  // with no SEO description. Now it is stored in Redis and used during the publish flow.
  description: z.string().optional().default(''),
  tags: z.array(z.string()).optional().default([]),
  quality_score: z.preprocess((val) => parseInt(String(val), 10) || 6, z.number().min(1).max(10)).optional().default(6),
});

export async function POST(req: Request) {
  try {
    const authHeader = req.headers.get('authorization');
    const webhookSecret = process.env.WEBHOOK_SECRET || process.env.ADMIN_SECRET;

    if (!webhookSecret) {
      console.error('[security] Server Configuration Error: WEBHOOK_SECRET or ADMIN_SECRET is not configured.');
      return new NextResponse('Configuration Error: Server secret credentials not found.', { status: 500 });
    }

    // Security: Strictly check HTTP Authorization header only.
    // The insecure URL query parameter is fully deprecated and no longer accepted.
    if (authHeader !== `Bearer ${webhookSecret}`) {
      console.warn('[security] Unauthorized attempt to invoke article callback webhook.');
      return new NextResponse('Unauthorized: Invalid webhook credential.', { status: 403 });
    }

    // Safely parse JSON
    const rawPayload = await req.json().catch(() => null);
    if (!rawPayload) {
      return new NextResponse('Bad Request: Invalid JSON payload.', { status: 400 });
    }

    // Validate using Zod schema
    const validationResult = WebhookPayloadSchema.safeParse(rawPayload);
    if (!validationResult.success) {
      console.error('[webhook] Payload validation failed:', validationResult.error.format());
      return NextResponse.json(
        { error: 'Validation failed', details: validationResult.error.format() },
        { status: 400 }
      );
    }

    const payload = validationResult.data;

    // Why handle 'discarded' separately with 200 OK:
    // A discarded article means the Python agent ran compliance checks 3 times and gave up.
    // The original Redis draft key (status: generating) will auto-expire in 7 days.
    // There is nothing to save. We just acknowledge cleanly so tenacity stops retrying.
    if (payload.status === 'discarded') {
      console.warn(`[webhook] Article discarded by agent for topic: "${payload.topic}". Reason: ${payload.error || 'Compliance failure.'}`);
      return NextResponse.json({ message: 'Discarded callback acknowledged. Draft will auto-expire.' });
    }

    const data = {
      topic: payload.topic,
      status: payload.status === 'success' ? 'pending_review' : 'error',
      error: payload.error,
      content: sanitizeAgentMarkdown(payload.article),
      word_count: payload.word_count,
      image_url: payload.image_url,
      // Why description is saved here: Required for SEO meta tags at publish time.
      // The Python agent extracts a clean 1-2 sentence description from the article body.
      description: payload.description,
      tags: payload.tags,
      qualityScore: payload.quality_score,
      timestamp: Date.now()
    };

    // Why Atomic Idempotent Update (updateDraftIfExist):
    // The Lua script atomically checks BOTH: (1) the draft key exists AND (2) its status
    // is still 'generating'. This prevents a second callback retry from wiping admin edits
    // if an article was already received and moved to pending_review.
    const updated = await draftDb.updateDraftIfExist(payload.topic, data);

    if (!updated) {
      console.warn(`[webhook] Discarding callback for "${payload.topic}": draft was deleted or already processed.`);
      return NextResponse.json({ message: 'Callback discarded: draft was deleted or already updated.' });
    }

    console.log(`[webhook] Successfully saved draft for: "${payload.topic}" → status: "${data.status}"`);
    return NextResponse.json({ message: 'Callback received and saved as draft' });

  } catch (err: any) {
    console.error('[webhook] Callback processing failed:', err.message || err);
    return new NextResponse('Internal Server Error: ' + (err.message || 'Unknown Error'), { status: 500 });
  }
}

