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

    const data = {
      topic: payload.topic,
      status: payload.status === 'success' ? 'pending_review' : 'error',
      error: payload.error || '',
      content: payload.article || '',
      word_count: payload.word_count?.toString() || '0',
      image_url: payload.image_url || '',
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
