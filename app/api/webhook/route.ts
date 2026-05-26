import { NextResponse } from 'next/server';
import { draftDb } from '@/lib/draftsDb';

export const runtime = 'edge';

export async function POST(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const secret = searchParams.get('secret');

    // Secure webhook with secret as specified by the user
    if (secret !== 'sherly') {
      return new NextResponse('Unauthorized', { status: 403 });
    }

    const payload = await req.json();
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
    return NextResponse.json({ message: 'Callback received and saved as draft' });
  } catch (err) {
    console.error(err);
    return new NextResponse('Internal Error', { status: 500 });
  }
}
