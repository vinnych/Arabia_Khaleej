import { NextResponse } from 'next/server';
import { draftDb } from '@/lib/draftsDb';
import { toSlug } from '@/lib/utils';
import { getWithCompression, setWithCompression } from '@/lib/redis';

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
        
        // Generate a clean, deterministic, and URL-friendly slug from the topic name
        // Why toSlug is used: Ensures slugs are clean, safe, and do not contain special URI characters.
        const slug = toSlug(topic);
        
        // Auto-detect language by checking if the topic contains Arabic script characters
        // Why regex check is used: Provides lightweight, synchronous, and highly reliable language
        // classification without the overhead or latency of invoking an external LLM or translation API.
        const isArabic = /[\u0600-\u06FF]/.test(topic);
        const lang = isArabic ? 'ar' : 'en';

        // Extract a clean title from the markdown heading (e.g. # The UAE Economic Vision)
        // Why title extraction is used: Avoids duplicating the "#" prefix in listings, giving a premium visual feel.
        let title = topic;
        if (draft.content) {
          const match = draft.content.match(/^#\s+(.+)$/m);
          if (match && match[1]) {
            title = match[1].trim();
          }
        }

        // Establish editorial board author metadata to satisfy GSC and AdSense EEAT parameters
        // Why this particular is used: Satisfies search engine authority guidelines by attributing all
        // automatically generated content to our verified regional editorial board.
        const author = {
          id: "arabia-khaleej-editorial",
          name: isArabic ? "هيئة تحرير عربية خليج" : "Arabia Khaleej Editorial Team",
          role: isArabic ? "هيئة التحرير" : "Editorial Board"
        };

        // Construct standard InsightItem document matching lib/insights.ts schema
        const liveArticle = {
          id: `insight-${Math.random().toString(36).substring(2, 11)}`,
          slug: slug,
          title: title,
          description: draft.content ? draft.content.substring(0, 160).replace(/[#*_`]/g, '').trim() + '...' : topic,
          link: `/insights/${slug}`,
          pubDate: new Date().toISOString(),
          source: "Arabia Khaleej",
          category: "gcc",
          language: lang,
          image: draft.image_url || "/images/insights/default.png",
          tags: ["gcc", isArabic ? "تحليل" : "intelligence"],
          content: draft.content || "",
          status: "published",
          author: author,
          wordCount: draft.content ? draft.content.split(/\s+/).length : 0
        };

        // 1. Commit full article detail store (insights:article:${slug})
        // Why setWithCompression is used: Reduces storage footprint and mitigates Upstash free tier rate limits
        // by compressing long markdown strings into optimized compressed-base64 representations.
        await setWithCompression(`insights:article:${slug}`, liveArticle, { ex: 2592000 });

        // 2. Prepend live article to the localized main listings list (insights:list:${lang})
        // Why list prepending is used: Ensures newly published insights appear instantly at the top of the homepage 
        // and listing feeds chronologically without performing expensive re-queries or full cache invalidations.
        const listKey = `insights:list:${lang}`;
        const currentList = await getWithCompression<any[]>(listKey) ?? [];
        const updatedList = [liveArticle, ...currentList.filter((item: any) => item.slug !== slug)].slice(0, 1000);
        await setWithCompression(listKey, updatedList, { ex: 2592000 });
      } else if (action === 'edit' && content) {
        draft.content = content;
      }
      await draftDb.setDraft(topic, draft);
      console.log(`[admin] Updated and synchronized draft for "${topic}" | Action: "${action}"`);
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
