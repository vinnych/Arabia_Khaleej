import { NextResponse } from 'next/server';
import { draftDb } from '@/lib/draftsDb';

export const runtime = 'edge';
export const dynamic = 'force-dynamic';

function getAdminSecret(): string | null {
  const adminSecret = process.env.ADMIN_SECRET;
  
  // Why fail-closed: If the admin secret token is not configured on the environment,
  // we refuse to validate any credentials, protecting the administration pipeline.
  if (!adminSecret) {
    console.error('[security] Server Configuration Error: ADMIN_SECRET environment variable is missing.');
    return null;
  }
  return adminSecret;
}

function isAuthorized(req: Request): boolean {
  const { searchParams } = new URL(req.url);
  const secret = searchParams.get('secret');
  const adminSecret = getAdminSecret();
  
  if (!adminSecret) return false;
  return secret === adminSecret;
}

// GET all articles (Authorized)
export async function GET(req: Request) {
  try {
    if (!isAuthorized(req)) {
      console.warn('[security] Unauthorized GET access attempt to /api/article.');
      return NextResponse.json({ error: 'Unauthorized: Invalid administrative credentials.' }, { status: 401 });
    }
    const articles = await draftDb.getAllDrafts();
    return NextResponse.json({ articles });
  } catch (err: any) {
    console.error('[article API] GET drafts queue error:', err.message || err);
    return NextResponse.json({ articles: [], error: 'Internal Error' }, { status: 500 });
  }
}

// DELETE a draft (Authorized)
export async function DELETE(req: Request) {
  try {
    if (!isAuthorized(req)) {
      console.warn('[security] Unauthorized DELETE access attempt to /api/article.');
      return NextResponse.json({ error: 'Unauthorized: Invalid administrative credentials.' }, { status: 401 });
    }
    
    // Parse body payload securely inside a catch block to prevent syntax error crashing
    const body = await req.json().catch(() => null);
    if (!body || !body.topic || typeof body.topic !== 'string') {
      return NextResponse.json({ error: 'Bad Request: "topic" string parameter required.' }, { status: 400 });
    }

    await draftDb.delDraft(body.topic);
    console.log(`[admin] Permanently deleted draft article for topic: "${body.topic}"`);
    return NextResponse.json({ success: true });
  } catch (err: any) {
    console.error('[article API] DELETE draft error:', err.message || err);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

// PUT (Update status or edit content) (Authorized)
export async function PUT(req: Request) {
  try {
    if (!isAuthorized(req)) {
      console.warn('[security] Unauthorized PUT access attempt to /api/article.');
      return NextResponse.json({ error: 'Unauthorized: Invalid administrative credentials.' }, { status: 401 });
    }
    
    const body = await req.json().catch(() => null);
    if (!body || !body.topic || typeof body.topic !== 'string') {
      return NextResponse.json({ error: 'Bad Request: "topic" string parameter required.' }, { status: 400 });
    }

    const { topic, action, content } = body;
    const draft = await draftDb.getDraft(topic);
    
    if (draft) {
      if (action === 'publish') {
        draft.status = 'published';
      } else if (action === 'edit' && content) {
        draft.content = content;
      }
      await draftDb.setDraft(topic, draft);
      console.log(`[admin] Updated draft for "${topic}" | Action: "${action}"`);
    } else {
      console.warn(`[admin] Attempted to update non-existent draft for: "${topic}"`);
      return NextResponse.json({ error: 'Not Found' }, { status: 404 });
    }
    
    return NextResponse.json({ success: true });
  } catch (err: any) {
    console.error('[article API] PUT update error:', err.message || err);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
