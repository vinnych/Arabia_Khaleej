import { NextResponse } from 'next/server';
import { draftDb } from '@/lib/draftsDb';

export const runtime = 'edge';

const AGENT_URL = process.env.AGENT_URL || 'https://article-agent-zk00.onrender.com';
const CALLBACK_URL = process.env.DASHBOARD_CALLBACK_URL || 'https://arabiakhaleej.com/api/webhook?secret=sherly';

export async function POST(req: Request) {
  try {
    const { topic } = await req.json();
    
    // Create initial tracking draft
    await draftDb.setDraft(topic, {
      topic,
      status: 'generating',
      timestamp: Date.now()
    });

    // Forward the request to the Python generation agent
    const res = await fetch(`${AGENT_URL}/v1/generate`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        topic,
        callback_url: CALLBACK_URL
      })
    });

    if (!res.ok) {
      await draftDb.setDraft(topic, { topic, status: 'error', timestamp: Date.now() });
      return NextResponse.json({ error: 'Agent rejected request' }, { status: 500 });
    }

    return NextResponse.json({ message: 'Generation started', topic });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
