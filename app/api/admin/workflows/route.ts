// Admin Workflows API - Simplified and Unified
// WHY: This API manages the review drafts and published insights list.
// It is fully refactored to support the Unified Bilingual Document Model and dynamic
// D1 / Upstash Redis database storage routing.
import { NextRequest, NextResponse } from 'next/server';
import { translateMarkdown } from '@/lib/i18n/translate';
import { getInsightRepository, getUnifiedInsights } from '@/lib/database/insights';
import { draftDb } from '@/lib/database/draftsDb';
import { toSlug } from '@/lib/core/utils';
import { getWithCompression, setWithCompression, redis } from '@/lib/database/redis';

// NOTE: runtime declaration removed - on Cloudflare Workers with nodejs_compat all routes
// run in the Node.js-compatible Workers runtime, making 'edge' declaration both unnecessary
// and incompatible with @opennextjs/cloudflare (which requires edge routes in separate functions).
export const dynamic = 'force-dynamic';
export const fetchCache = 'force-no-store';

// Helper to normalize bilingual items
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
  // Why draftDb: Standardized drafts retrieval, supporting D1 database and Redis fallback
  const raw = await draftDb.getAllDrafts();
  return raw.map((entry: any) => {
    return {
      slug: entry.slug || toSlug(entry.topic || ''),
      title: entry.title ?? entry.topic ?? entry.slug,
      description: entry.description ?? '',
      language: lang,
      status: entry.status ?? 'pending',
      qualityScore: entry.qualityScore,
      wordCount: entry.wordCount || entry.word_count || 0,
      content: 'Content omitted from dashboard for performance.',
      topic: entry.topic || entry.title || entry.slug
    };
  });
}

async function loadPublished(lang: 'en' | 'ar') {
  // Why getUnifiedInsights: Relies on the active repository (D1 or Redis) to load published metadata
  const raw = await getUnifiedInsights({ lang, limit: 1000 });
  return raw.map((entry: any) => {
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
      image: entry.image ?? null,
      topic: entry.topic ?? entry.title ?? entry.slug,
    };
  });
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const tab = searchParams.get('tab') || 'drafts';
  const slug = searchParams.get('slug');
  const ADMIN_SECRET = process.env.ADMIN_SECRET!;

  const authHeader = request.headers.get('authorization');
  if (!ADMIN_SECRET || authHeader !== `Bearer ${ADMIN_SECRET}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    if (slug) {
      // Fetch the raw bilingual article structure directly from the active Repository
      const repository = getInsightRepository();
      const article = await repository.getRawArticle(slug);
      if (!article) return NextResponse.json({ error: 'Not found' }, { status: 404 });
      return NextResponse.json({ article });
    }

    const drafts = await loadDrafts('en');
    const published = await loadPublished('en');

    if (tab === 'drafts') {
      return NextResponse.json({ articles: drafts });
    }
    if (tab === 'published') {
      return NextResponse.json({ articles: published });
    }
    return NextResponse.json({ articles: [] });
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  const ADMIN_SECRET = process.env.ADMIN_SECRET!;

  const authHeader = request.headers.get('authorization');
  if (!ADMIN_SECRET || authHeader !== `Bearer ${ADMIN_SECRET}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { slug, lang, action, title, content, contentEn, contentAr } = await request.json();

  if (!slug || !lang || !action) {
    return NextResponse.json({ error: 'Missing parameters' }, { status: 400 });
  }

  const repository = getInsightRepository();

  try {
    if (action === 'approve') {
      // 1. Fetch draft. Try both topic slug and topic name to cover all formats, plus legacy Redis keys
      let article = await draftDb.getDraft(slug);
      let isLegacyRedis = false;
      const legacyDraftKey = `insights:draft:article:${slug}`;

      if (!article) {
        // Fallback: Check standard draft key format in Redis
        article = await getWithCompression<any>(legacyDraftKey);
        if (article) isLegacyRedis = true;
      }

      if (!article) {
        return NextResponse.json({ error: 'Draft article not found' }, { status: 404 });
      }

      const titleEn = typeof article.title === 'string' ? article.title : (article.title?.en || '');
      const topicName = article.topic || titleEn || slug;

      // Translate manual draft modifications on publication if the admin adjusted them
      if (title !== undefined) {
        if (typeof article.title === 'string') {
          article.title = { en: title, ar: await translateMarkdown(title, 'en', 'ar') };
        } else {
          article.title = {
            en: title,
            ar: await translateMarkdown(title, 'en', 'ar')
          };
        }
      }
      
      if (content !== undefined) {
        if (typeof article.content === 'string') {
          article.content = { en: content, ar: await translateMarkdown(content, 'en', 'ar') };
        } else {
          article.content = {
            en: content,
            ar: await translateMarkdown(content, 'en', 'ar')
          };
        }
      }

      // Add default metadata fields
      const liveArticle = {
        id: article.id || `insight-${Math.random().toString(36).substring(2, 11)}`,
        slug: slug,
        title: article.title,
        description: article.description || {
          en: typeof article.content === 'string' ? article.content.substring(0, 150) + '...' : article.content?.en?.substring(0, 150) + '...',
          ar: typeof article.content === 'string' ? '' : article.content?.ar?.substring(0, 150) + '...',
        },
        link: `/insights/${slug}`,
        pubDate: new Date().toISOString(),
        source: "Arabia Khaleej",
        category: "gcc",
        language: "en",
        image: article.image || article.image_url || "/images/insights/default.png",
        tags: Array.isArray(article.tags) ? article.tags : ["gcc", "intelligence"],
        content: article.content,
        status: "published",
        author: {
          id: "arabia-khaleej-editorial",
          name: { en: "Arabia Khaleej Editorial Team", ar: "هيئة تحرير عربية خليج" },
          role: { en: "Editorial Board", ar: "هيئة التحرير" }
        },
        wordCount: article.wordCount || article.word_count || 0
      };

      // 2. Save live bilingual article via Repository (D1 or Redis)
      await repository.saveArticle(liveArticle);

      // 3. Cleanup draft
      await draftDb.delDraft(topicName);
      if (isLegacyRedis) {
        await redis.del(legacyDraftKey).catch(() => {});
        for (const l of ['en', 'ar'] as const) {
          const listKey = `insights:drafts:${l}`;
          const currentList = await getWithCompression<any[]>(listKey) ?? [];
          await setWithCompression(listKey, currentList.filter((d: any) => d.slug !== slug));
        }
      }

      console.log(`[admin] Approved and published article: "${slug}"`);
      return NextResponse.json({ success: true });
    }

    if (action === 'update_live') {
      const article = await repository.getRawArticle(slug) as any;
      if (!article) return NextResponse.json({ error: 'Live article not found' }, { status: 404 });

      // Apply bilingual manual edits directly (avoiding automated translations)
      if (contentEn !== undefined) {
        if (typeof article.content === 'string') {
          article.content = { en: contentEn, ar: article.content };
        } else {
          (article.content as any).en = contentEn;
        }
      }
      if (contentAr !== undefined) {
        if (typeof article.content === 'string') {
          article.content = { en: article.content, ar: contentAr };
        } else {
          (article.content as any).ar = contentAr;
        }
      }

      // Save live bilingual changes
      await repository.saveArticle(article);
      console.log(`[admin] Live bilingual content updated for article: "${slug}"`);
      return NextResponse.json({ success: true });
    }

    if (action === 'reject') {
      let article = await draftDb.getDraft(slug);
      let isLegacyRedis = false;
      const legacyDraftKey = `insights:draft:article:${slug}`;

      if (!article) {
        article = await getWithCompression<any>(legacyDraftKey);
        if (article) isLegacyRedis = true;
      }

      if (article) {
        const titleEn = typeof article.title === 'string' ? article.title : (article.title?.en || '');
        const topicName = article.topic || titleEn || slug;
        await draftDb.delDraft(topicName);
      }

      if (isLegacyRedis) {
        await redis.del(legacyDraftKey).catch(() => {});
        for (const l of ['en', 'ar'] as const) {
          const listKey = `insights:drafts:${l}`;
          const currentList = await getWithCompression<any[]>(listKey) ?? [];
          await setWithCompression(listKey, currentList.filter((d: any) => d.slug !== slug));
        }
      }

      console.log(`[admin] Rejected draft for: "${slug}"`);
      return NextResponse.json({ success: true });
    }

    if (action === 'delete') {
      // Permanently remove article from listings and details
      await repository.deleteArticle(slug);
      console.log(`[admin] Permanently deleted live article: "${slug}"`);
      return NextResponse.json({ success: true });
    }

    return NextResponse.json({ error: 'Unknown action' }, { status: 400 });
  } catch (e: any) {
    console.error('Workflows API Error:', e);
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}
