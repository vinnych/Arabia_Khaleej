// Admin Workflows API - Simplified for External Agent Workflow
// WHY: This API manages the review drafts and published insights list.
// It is fully refactored to support the Unified Bilingual Document Model:
// - GET: Returns normalized articles localized to the requested tab/language.
// - POST: Approves (generates updated translations if human edits are present, then publishes to both EN & AR feeds), rejects, deletes, or updates live content bilingually.
import { NextRequest, NextResponse } from 'next/server';
import { redis, getWithCompression, setWithCompression } from '@/lib/redis';
import { translateMarkdown } from '@/lib/translate';

const CACHE_TIMES = {
  INSIGHTS_ARCHIVE: 2592000,
};

// Why local normalization is used:
// Keeps the dashboard and list databases fully backward-compatible by flinging
// localized properties dynamically on retrieval.
function normalizeArticle(item: any, lang: 'en' | 'ar'): any {
  if (!item) return null;
  const title = typeof item.title === 'string' ? item.title : (item.title?.[lang] || item.title?.en || '');
  const description = typeof item.description === 'string' ? item.description : (item.description?.[lang] || item.description?.en || '');
  const content = typeof item.content === 'string' ? item.content : (item.content?.[lang] || item.content?.en || '');
  
  let author = item.author;
  if (author) {
    author = {
      ...author,
      name: typeof author.name === 'string' ? author.name : (author.name?.[lang] || author.name?.en || ''),
      role: typeof author.role === 'string' ? author.role : (author.role?.[lang] || author.role?.en || '')
    };
  }

  return {
    ...item,
    title,
    description,
    content,
    language: lang,
    author
  };
}

async function loadDrafts(lang: 'en' | 'ar') {
  const raw = await getWithCompression<any[]>(`insights:drafts:${lang}`);
  if (!raw || !Array.isArray(raw)) return [];
  
  // FIX: Avoid running Promise.all to fetch full draft bodies.
  // Return the metadata array directly to save Edge CPU limits.
  return raw.map((entry) => {
    return {
      slug: entry.slug,
      title: entry.title ?? entry.slug,
      description: entry.description ?? '',
      language: lang,
      status: entry.status ?? 'pending',
      qualityScore: entry.qualityScore,
      wordCount: entry.wordCount,
      content: 'Content omitted from dashboard for performance.',
    };
  }).filter(Boolean);
}

async function loadPublished(lang: 'en' | 'ar') {
  const raw = await getWithCompression<any[]>(`insights:list:${lang}`);
  if (!raw || !Array.isArray(raw)) return [];
  
  // FIX: Avoid running Promise.all over hundreds of items to fetch individual full bodies.
  // This exhausted the Edge CPU limits. Just return the cached metadata array directly.
  return raw.map((entry) => {
    return {
      slug: entry.slug,
      lang,
      title: entry.title ?? entry.slug,
      description: entry.description ?? '',
      language: lang,
      status: entry.status || 'published',
      qualityScore: entry.qualityScore,
      wordCount: entry.wordCount || 0,
      content: 'Content omitted from dashboard for performance. Please view live article.',
      image: entry.image ?? entry.image_url ?? null,
      topic: entry.topic ?? entry.title ?? entry.slug,
    };
  }).filter(Boolean);
}

export const runtime = 'edge';
export const dynamic = 'force-dynamic';
export const fetchCache = 'force-no-store';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const tab = searchParams.get('tab') || 'drafts';
  const slug = searchParams.get('slug');
  const ADMIN_SECRET = process.env.ADMIN_SECRET!;

  // Why Authorization header: secrets in URL query params appear in Cloudflare
  // access logs, browser history, and address bars. Headers are never logged by CDNs.
  const authHeader = request.headers.get('authorization');
  if (!ADMIN_SECRET || authHeader !== `Bearer ${ADMIN_SECRET}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    if (slug) {
      // If a specific slug is requested, return the full uncompressed document.
      // This allows the admin dashboard to load the full bilingual content for editing.
      const article = await getWithCompression(`insights:article:${slug}`);
      if (!article) return NextResponse.json({ error: 'Not found' }, { status: 404 });
      return NextResponse.json({ article });
    }

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
  const ADMIN_SECRET = process.env.ADMIN_SECRET!;

  // Why Authorization header: same reasoning as GET — keeps secret out of logs.
  const authHeader = request.headers.get('authorization');
  if (!ADMIN_SECRET || authHeader !== `Bearer ${ADMIN_SECRET}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { slug, lang, action, title, content, contentEn, contentAr } = await request.json();

  if (!slug || !lang || !action) {
    return NextResponse.json({ error: 'Missing parameters' }, { status: 400 });
  }

  try {
    if (action === 'approve') {
      const draftKey = `insights:draft:article:${slug}`;
      const article = await getWithCompression<any>(draftKey);
      if (!article) return NextResponse.json({ error: 'Not found' }, { status: 404 });

      // Handle edits and re-translation if human editor adjusted the English text
      // Why: Re-translating ensures that manually corrected content propagates to Arabic.
      // This is done before acquiring the Redis lock to minimize lock contention duration.
      if (title !== undefined) {
        if (typeof article.title === 'string') {
          article.title = { en: title, ar: await translateMarkdown(title, 'en', 'ar') };
        } else {
          article.title.en = title;
          article.title.ar = await translateMarkdown(title, 'en', 'ar');
        }
      }
      
      if (content !== undefined) {
        if (typeof article.content === 'string') {
          article.content = { en: content, ar: await translateMarkdown(content, 'en', 'ar') };
        } else {
          article.content.en = content;
          article.content.ar = await translateMarkdown(content, 'en', 'ar');
        }
      }

      article.status = 'published';
      // Unify author object dynamically to match the primary generation queue output
      article.author = {
        id: "arabia-khaleej-editorial",
        name: { en: "Arabia Khaleej Editorial Team", ar: "هيئة تحرير عربية خليج" },
        role: { en: "Editorial Board", ar: "هيئة التحرير" }
      };

      const lockKey = `lock:insights:list`;
      const lock = await redis.set(lockKey, '1', { nx: true, ex: 15 });
      if (!lock) return NextResponse.json({ error: 'System is busy updating the feed. Please try again.' }, { status: 409 });

      try {
        // 1. Commit the bilingual document to Redis (insights:article:${slug})
        await setWithCompression(`insights:article:${slug}`, article, { ex: CACHE_TIMES.INSIGHTS_ARCHIVE });

        // 2. Pre-normalize copies and prepend to English and Arabic main feeds
        const liveArticleEn = normalizeArticle(article, 'en');
        const liveArticleAr = normalizeArticle(article, 'ar');
        
        // FIX: Strip heavy content payloads
        delete liveArticleEn.content;
        delete liveArticleAr.content;

        const listKeyEn = `insights:list:en`;
        const currentEn = await getWithCompression<any[]>(listKeyEn) ?? [];
        await setWithCompression(listKeyEn, [liveArticleEn, ...currentEn.filter((a: any) => a.slug !== slug)].slice(0, 1000), { ex: CACHE_TIMES.INSIGHTS_ARCHIVE });

        const listKeyAr = `insights:list:ar`;
        const currentAr = await getWithCompression<any[]>(listKeyAr) ?? [];
        await setWithCompression(listKeyAr, [liveArticleAr, ...currentAr.filter((a: any) => a.slug !== slug)].slice(0, 1000), { ex: CACHE_TIMES.INSIGHTS_ARCHIVE });

        // 3. Delete drafts from queue lists
        for (const l of ['en', 'ar'] as const) {
          const dl = await getWithCompression<any[]>(`insights:drafts:${l}`) ?? [];
          await setWithCompression(`insights:drafts:${l}`, dl.filter((d: any) => d.slug !== slug), { ex: CACHE_TIMES.INSIGHTS_ARCHIVE });
        }

        await redis.del(draftKey).catch(() => {});
        console.log(`[admin] Approved and bilingual-published article: "${slug}"`);
      } finally {
        await redis.del(lockKey);
      }
      return NextResponse.json({ success: true });
    }

    if (action === 'update_live') {
      const articleKey = `insights:article:${slug}`;
      const article = await getWithCompression<any>(articleKey);
      if (!article) return NextResponse.json({ error: 'Not found' }, { status: 404 });

      // Apply granular bilingual updates natively.
      // Crucial: We do NOT re-run translateMarkdown() here, completely avoiding the
      // Arabic Override destruction bug. Manual edits are perfectly preserved.
      if (contentEn !== undefined) {
        if (typeof article.content === 'string') {
          article.content = { en: contentEn, ar: article.content };
        } else {
          article.content.en = contentEn;
        }
      }
      if (contentAr !== undefined) {
        if (typeof article.content === 'string') {
          article.content = { en: article.content, ar: contentAr };
        } else {
          article.content.ar = contentAr;
        }
      }

      const lockKey = `lock:insights:list`;
      const lock = await redis.set(lockKey, '1', { nx: true, ex: 15 });
      if (!lock) return NextResponse.json({ error: 'System is busy updating the feed. Please try again.' }, { status: 409 });

      try {
        await setWithCompression(articleKey, article, { ex: CACHE_TIMES.INSIGHTS_ARCHIVE });
        
        const liveArticleEn = normalizeArticle(article, 'en');
        const liveArticleAr = normalizeArticle(article, 'ar');
        delete liveArticleEn.content;
        delete liveArticleAr.content;

        const listKeyEn = `insights:list:en`;
        const currentEn = await getWithCompression<any[]>(listKeyEn) ?? [];
        await setWithCompression(listKeyEn, [liveArticleEn, ...currentEn.filter((a: any) => a.slug !== slug)].slice(0, 1000), { ex: CACHE_TIMES.INSIGHTS_ARCHIVE });

        const listKeyAr = `insights:list:ar`;
        const currentAr = await getWithCompression<any[]>(listKeyAr) ?? [];
        await setWithCompression(listKeyAr, [liveArticleAr, ...currentAr.filter((a: any) => a.slug !== slug)].slice(0, 1000), { ex: CACHE_TIMES.INSIGHTS_ARCHIVE });
        
        console.log(`[admin] Live bilingual content updated for article: "${slug}"`);
      } finally {
        await redis.del(lockKey);
      }
      return NextResponse.json({ success: true });
    }

    if (action === 'reject') {
      const draftKey = `insights:draft:article:${slug}`;
      const lockKey = `lock:insights:list`;
      const lock = await redis.set(lockKey, '1', { nx: true, ex: 15 });
      if (!lock) return NextResponse.json({ error: 'System is busy updating the feed. Please try again.' }, { status: 409 });

      try {
        await redis.del(draftKey).catch(() => {});
        for (const l of ['en', 'ar'] as const) {
          const dl = await getWithCompression<any[]>(`insights:drafts:${l}`) ?? [];
          await setWithCompression(`insights:drafts:${l}`, dl.filter((d: any) => d.slug !== slug), { ex: CACHE_TIMES.INSIGHTS_ARCHIVE });
        }
      } finally {
        await redis.del(lockKey);
      }
      return NextResponse.json({ success: true });
    }

    if (action === 'delete') {
      const articleKey = `insights:article:${slug}`;
      const lockKey = `lock:insights:list`;
      const lock = await redis.set(lockKey, '1', { nx: true, ex: 15 });
      if (!lock) return NextResponse.json({ error: 'System is busy updating the feed. Please try again.' }, { status: 409 });

      try {
        // Remove from BOTH language listing caches regardless of which lang was provided.
        for (const l of ['en', 'ar'] as const) {
          const listKey = `insights:list:${l}`;
          const current = await getWithCompression<any[]>(listKey) ?? [];
          const filtered = current.filter((a: any) => a.slug !== slug);
          if (filtered.length !== current.length) {
            await setWithCompression(listKey, filtered, { ex: CACHE_TIMES.INSIGHTS_ARCHIVE });
          }
        }
        // Delete the full article detail key.
        await redis.del(articleKey).catch(() => {});
        console.log(`[admin] Permanently deleted article details: "${slug}"`);
      } finally {
        await redis.del(lockKey);
      }
      return NextResponse.json({ success: true });
    }

    return NextResponse.json({ error: 'Unknown action' }, { status: 400 });
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}