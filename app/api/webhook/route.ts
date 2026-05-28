import { NextResponse } from 'next/server';
import { draftDb } from '@/lib/draftsDb';

export const runtime = 'edge';

export async function POST(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const secret = searchParams.get('secret');
    const webhookSecret = process.env.WEBHOOK_SECRET || process.env.ADMIN_SECRET;

    // Why environment variables & fail-closed check: Hardcoding secret tokens (like 'sherly') directly 
    // inside the repository is a high-risk security vulnerability. Moving the secret to process.env and
    // throwing an internal configuration error if both secrets are undefined ensures a "fail-closed" security
    // posture where the endpoint cannot be triggered if not configured properly.
    if (!webhookSecret) {
      console.error('[security] Server Configuration Error: WEBHOOK_SECRET or ADMIN_SECRET is not configured.');
      return new NextResponse('Configuration Error: Server secret credentials not found.', { status: 500 });
    }

    if (secret !== webhookSecret) {
      console.warn('[security] Unauthorized attempt to invoke article callback webhook.');
      return new NextResponse('Unauthorized: Invalid webhook credential.', { status: 403 });
    }

    // Why payload schema validation: Parsing incoming JSON inside try/catch blocks with structural checks
    // prevents crashing the server route if the external agent sends an empty or malformed payload.
    const payload = await req.json().catch(() => null);
    if (!payload || !payload.topic || typeof payload.topic !== 'string') {
      console.error('[webhook] Received invalid payload body: ', payload);
      return new NextResponse('Bad Request: Missing or invalid "topic" property.', { status: 400 });
    }

    // Why verify draft existence: If the user explicitly deleted this draft from the dashboard
    // while it was still in the 'generating' status, writing it back now would resurrect the
    // deleted draft and cause it to reappear unexpectedly. Discarding the callback preserves the user's action.
    const existingDraft = await draftDb.getDraft(payload.topic);
    if (!existingDraft) {
      console.warn(`[webhook] Discarding incoming agent callback for deleted draft: "${payload.topic}"`);
      return NextResponse.json({ message: 'Callback discarded because draft was deleted by user' });
    }

    const data = {
      topic: payload.topic,
      status: payload.status === 'success' ? 'pending_review' : 'error',
      error: payload.error || '',
      content: payload.article || '',
      // Why parseInt: word_count must be stored as a number so the dashboard can display it correctly.
      // Storing as a string ('0') causes truthy checks like (art.word_count || 0) to always resolve to
      // the string '0' instead of the actual numeric value from the agent payload.
      word_count: parseInt(payload.word_count, 10) || 0,
      image_url: payload.image_url || '',
      // WHY: Extract agent-supplied tags here so they survive into the draft and
      // eventually into the published article. Previously this field was never
      // mapped, so all AI-generated tags were silently dropped at this boundary.
      // We validate it is an array of strings; malformed values are discarded safely.
      tags: Array.isArray(payload.tags)
        ? payload.tags.filter((t: unknown) => typeof t === 'string')
        : undefined,
      timestamp: Date.now()
    };

    await draftDb.setDraft(payload.topic, data);
    console.log(`[webhook] Successfully saved draft callback for: "${payload.topic}" with status: "${data.status}"`);
    
    return NextResponse.json({ message: 'Callback received and saved as draft' });
  } catch (err: any) {
    console.error('[webhook] Callback processing failed:', err.message || err);
    return new NextResponse('Internal Server Error: ' + (err.message || 'Unknown Error'), { status: 500 });
  }
}
