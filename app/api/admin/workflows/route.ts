// Admin Workflows API - Simplified for External Agent Workflow
// WHY: Removed workflow monitoring (init/trending/generate/policy/score steps)
// The external agent handles article generation; this API only manages drafts
// - GET: Fetch drafts or published articles for human verification
// - POST: Approve (draft→published), reject, or delete articles
import { NextRequest, NextResponse } from 'next/server';
import { redis, getWithCompression, setWithCompression } from '@/lib/redis';

const CACHE_TIMES = {
  INSIGHTS_ARCHIVE: 2592000,
};

async function loadDrafts(lang: 'en' | 'ar') {
  const raw = await getWithCompression<any[]>(`insights:drafts:${lang}`);
  if (!raw || !Array.isArray(raw)) return [];
  const articles = await Promise.all(
    raw.map(async (entry) => {
      const slug = entry.slug;
      if (!slug) return null;
      const body = await getWithCompression<any>(`insights:draft:article:${slug}`).catch(() => null);
      return {
        slug,
        title: body?.title ?? entry.title ?? slug,
        description: body?.description ?? entry.description ?? '',
        language: lang,
        status: body?.status ?? entry.status ?? 'pending',
        qualityScore: body?.qualityScore,
        wordCount: body?.wordCount,
        content: body?.content ?? '',
      };
    })
  );
  return articles.filter(Boolean);
}

async function loadPublished(lang: 'en' | 'ar') {
  const raw = await getWithCompression<any[]>(`insights:list:${lang}`);
  if (!raw || !Array.isArray(raw)) return [];
  const articles = await Promise.all(
    raw.map(async (entry) => {
      const slug = entry.slug;
      if (!slug) return null;
      const body = await getWithCompression<any>(`insights:article:${slug}`).catch(() => null);
      if (!body || body.status !== 'published') return null;
      return {
        slug,
        title: body.title ?? entry.title ?? slug,
        description: body.description ?? entry.description ?? '',
        language: lang,
        status: 'published',
        qualityScore: body.qualityScore,
        wordCount: body.wordCount,
        content: body.content ?? '',
      };
    })
  );
  return articles.filter(Boolean);
}

export const runtime = 'edge';
export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const secret = searchParams.get('secret');
  const tab = searchParams.get('tab') || 'drafts';
  const ADMIN_SECRET = process.env.ADMIN_SECRET!;

  if (secret !== ADMIN_SECRET) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const drafts = await loadDrafts('en');
    const draftsAr = await loadDrafts('ar');
    const published = await loadPublished('en');
    const publishedAr = await loadPublished('ar');

    if (tab === 'drafts') {
      return NextResponse.json({ articles: [...drafts, ...draftsAr] });
    }
    if (tab === 'published') {
      return NextResponse.json({ articles: [...published, ...publishedAr] });
    }
    return NextResponse.json({ articles: [] });
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const secret = searchParams.get('secret');
  const ADMIN_SECRET = process.env.ADMIN_SECRET!;

  if (secret !== ADMIN_SECRET) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { slug, lang, action, title, content } = await request.json();

  if (!slug || !lang || !action) {
    return NextResponse.json({ error: 'Missing parameters' }, { status: 400 });
  }

  try {
    if (action === 'approve') {
      const draftKey = `insights:draft:article:${slug}`;
      const article = await getWithCompression<any>(draftKey);
      if (!article) return NextResponse.json({ error: 'Not found' }, { status: 404 });

      if (content !== undefined) article.content = content;
      if (title !== undefined) article.title = title;
      article.status = 'published';

      await setWithCompression(`insights:article:${slug}`, article, { ex: CACHE_TIMES.INSIGHTS_ARCHIVE });

      const listKey = `insights:list:${lang}`;
      const current = await getWithCompression<any[]>(listKey) ?? [];
      await setWithCompression(listKey, [article, ...current].slice(0, 1000), { ex: CACHE_TIMES.INSIGHTS_ARCHIVE });

      for (const l of ['en', 'ar'] as const) {
        const dl = await getWithCompression<any[]>(`insights:drafts:${l}`) ?? [];
        await setWithCompression(`insights:drafts:${l}`, dl.filter((d: any) => d.slug !== slug), { ex: CACHE_TIMES.INSIGHTS_ARCHIVE });
      }

      await redis.del(draftKey).catch(() => {});
      return NextResponse.json({ success: true });
    }

    if (action === 'reject') {
      const draftKey = `insights:draft:article:${slug}`;
      await redis.del(draftKey).catch(() => {});

      for (const l of ['en', 'ar'] as const) {
        const dl = await getWithCompression<any[]>(`insights:drafts:${l}`) ?? [];
        await setWithCompression(`insights:drafts:${l}`, dl.filter((d: any) => d.slug !== slug), { ex: CACHE_TIMES.INSIGHTS_ARCHIVE });
      }
      return NextResponse.json({ success: true });
    }

    if (action === 'delete') {
      const articleKey = `insights:article:${slug}`;
      const article = await getWithCompression<any>(articleKey);
      if (article) {
        const listKey = `insights:list:${lang}`;
        const current = await getWithCompression<any[]>(listKey) ?? [];
        await setWithCompression(listKey, current.filter((a: any) => a.slug !== slug), { ex: CACHE_TIMES.INSIGHTS_ARCHIVE });
        await redis.del(articleKey).catch(() => {});
      }
      return NextResponse.json({ success: true });
    }

    return NextResponse.json({ error: 'Unknown action' }, { status: 400 });
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}