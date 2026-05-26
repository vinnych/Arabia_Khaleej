import { NextResponse } from 'next/server';
import { draftDb } from '@/lib/draftsDb';

export const runtime = 'edge';
export const dynamic = 'force-dynamic';

// GET all articles
export async function GET() {
  try {
    const articles = await draftDb.getAllDrafts();
    return NextResponse.json({ articles });
  } catch (err) {
    return NextResponse.json({ articles: [] }, { status: 500 });
  }
}

// DELETE a draft
export async function DELETE(req: Request) {
  try {
    const { topic } = await req.json();
    await draftDb.delDraft(topic);
    return NextResponse.json({ success: true });
  } catch (err) {
    return NextResponse.json({ error: 'Failed' }, { status: 500 });
  }
}

// PUT (Update status or edit content)
export async function PUT(req: Request) {
  try {
    const { topic, action, content } = await req.json();
    const draft = await draftDb.getDraft(topic);
    
    if (draft) {
      if (action === 'publish') {
        draft.status = 'published';
      } else if (action === 'edit' && content) {
        draft.content = content;
      }
      await draftDb.setDraft(topic, draft);
    }
    
    return NextResponse.json({ success: true });
  } catch (err) {
    return NextResponse.json({ error: 'Failed' }, { status: 500 });
  }
}
