import { NextResponse } from 'next/server';
import { draftDb } from '@/lib/draftsDb';
import { toSlug } from '@/lib/utils';
import { redis, getWithCompression, setWithCompression, MAX_PUBLISHED_ARTICLES, MAX_REDIS_KEYS_THRESHOLD } from '@/lib/redis';
import { translateMarkdown } from '@/lib/translate';

export const runtime = 'edge';
export const dynamic = 'force-dynamic';

function getAdminSecret(): string | null {
  const adminSecret = process.env.ADMIN_SECRET;
  if (!adminSecret) {
    console.error('[security] Server Configuration Error: ADMIN_SECRET environment variable is missing.');
    return null;
  }
  return adminSecret;
}

function isAuthorized(req: Request): boolean {
  const adminSecret = getAdminSecret();
  if (!adminSecret) return false;
  
  // Why Authorization header instead of query param:
  // Passing secrets via ?secret=... leaks them into Cloudflare access logs, browser history,
  // and screen-shareable address bars. HTTP headers are not logged by proxies or CDNs.
  const authHeader = req.headers.get('authorization');
  return authHeader === `Bearer ${adminSecret}`;
}

// Local helper to normalize bilingual items
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

// DELETE an article (Authorized)
export async function DELETE(req: Request) {
  try {
    if (!isAuthorized(req)) {
      console.warn('[security] Unauthorized DELETE access attempt to /api/article.');
      return NextResponse.json({ error: 'Unauthorized: Invalid administrative credentials.' }, { status: 401 });
    }
    
    const body = await req.json().catch(() => null);
    if (!body || !body.topic || typeof body.topic !== 'string') {
      return NextResponse.json({ error: 'Bad Request: "topic" string parameter required.' }, { status: 400 });
    }

    const topic = body.topic;
    const slug = toSlug(topic);

    // Why Redis Lock: Deleting from the lists requires reading the array, filtering, and writing back.
    // A mutex lock prevents a race condition where simultaneous actions overwrite the array.
    const lockKey = `lock:insights:list`;
    const lock = await redis.set(lockKey, '1', { nx: true, ex: 15 });
    if (!lock) {
      return NextResponse.json({ error: 'System is busy updating the feed. Please try again in a few seconds.' }, { status: 409 });
    }

    try {
      // 1. Delete draft key from the queue (article:${topic})
      await draftDb.delDraft(topic);
      console.log(`[admin] Permanently deleted draft article key for topic: "${topic}"`);

      // 2. Delete live compressed article detail key (insights:article:${slug})
      const articleKey = `insights:article:${slug}`;
      await redis.del(articleKey);
      console.log(`[admin] Deleted live article details key: "${articleKey}"`);

      // 3. Filter and remove from localized listings lists (insights:list:en & insights:list:ar)
      for (const lang of ['en', 'ar']) {
        const listKey = `insights:list:${lang}`;
        const currentList = await getWithCompression<any[]>(listKey);
        if (currentList && Array.isArray(currentList)) {
          const updatedList = currentList.filter((item: any) => item.slug !== slug);
          if (updatedList.length !== currentList.length) {
            // Why no TTL: Published lists are stored indefinitely to prevent loss of content feed index
            await setWithCompression(listKey, updatedList);
            console.log(`[admin] Successfully removed article from listing: "${listKey}"`);
          }
        }
      }
    } finally {
      await redis.del(lockKey);
    }

    return NextResponse.json({ success: true });
  } catch (err: any) {
    console.error('[article API] DELETE draft/article error:', err.message || err);
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
        const slug = toSlug(topic);
        
        let title = topic;
        if (draft.content) {
          const match = draft.content.match(/^#\s+(.+)$/m);
          if (match && match[1]) {
            title = match[1].trim();
          }
        }

        console.log(`[admin] Publishing manually generated draft: "${topic}". Starting automated translations.`);

        // Translate manual draft dynamically on publication
        // This is done BEFORE acquiring the lock to keep the critical section extremely short (<50ms).
        const titleAr = await translateMarkdown(title, 'en', 'ar');
        const contentAr = await translateMarkdown(draft.content || '', 'en', 'ar');

        const author = {
          id: "arabia-khaleej-editorial",
          name: { en: "Arabia Khaleej Editorial Team", ar: "هيئة تحرير عربية خليج" },
          role: { en: "Editorial Board", ar: "هيئة التحرير" }
        };

        const liveArticle = {
          id: `insight-${Math.random().toString(36).substring(2, 11)}`,
          slug: slug,
          title: {
            en: title,
            ar: titleAr,
          },
          description: {
            // Why draft.description is preferred over substring:
            // The Python agent generates a clean 1-2 sentence meta description from the article body.
            // Slicing raw markdown often captures headers (# Title) or image tags (![](...)) 
            // which corrupt the SEO <meta description> shown in Google search results.
            // draft.description is already clean plain text, optimised for SEO.
            en: draft.description || (draft.content ? draft.content.substring(0, 160).replace(/[#*_`]/g, '').trim() + '...' : topic),
            ar: contentAr ? contentAr.substring(0, 160).replace(/[#*_`]/g, '').trim() + '...' : titleAr,
          },
          link: `/insights/${slug}`,
          pubDate: new Date().toISOString(),
          source: "Arabia Khaleej",
          category: "gcc",
          language: "en",
          image: draft.image_url || "/images/insights/default.png",
          // WHY: Prefer agent-supplied tags saved in the draft over the old hardcoded
          // fallback. This allows AI-generated articles to carry meaningful semantic tags
          // (e.g. ["uae", "oil", "economy"]) that the Python agent derived from content.
          // The fallback ["gcc", "intelligence"] is kept so manually-published drafts
          // (which never have tags in the draft) still display something sensible.
          tags: (Array.isArray(draft.tags) && draft.tags.length > 0)
            ? draft.tags
            : ["gcc", "intelligence"],
          content: {
            en: draft.content || "",
            ar: contentAr,
          },
          status: "published",
          author: author,
          wordCount: draft.content ? draft.content.split(/\s+/).length : 0
        };

        // Why Redis Lock: We must lock before doing read-modify-write on the feed array lists.
        const lockKey = `lock:insights:list`;
        const lock = await redis.set(lockKey, '1', { nx: true, ex: 15 });
        if (!lock) {
          return NextResponse.json({ error: 'System is busy updating the feed. Please try again in a few seconds.' }, { status: 409 });
        }

        try {
          // 1. Commit full bilingual document (insights:article:${slug})
          // Why no TTL: Published articles persist permanently in Redis for infinite digital archiving
          await setWithCompression(`insights:article:${slug}`, liveArticle);

          // 2. Pre-normalize copies and prepend to English and Arabic main feeds
          const liveEn = normalizeArticle(liveArticle, 'en');
          const liveAr = normalizeArticle(liveArticle, 'ar');

          // FIX: Strip heavy content payloads from the list arrays to prevent Edge CPU exhaustion
          delete liveEn.content;
          delete liveAr.content;

          const listKeyEn = `insights:list:en`;
          const currentListEn = await getWithCompression<any[]>(listKeyEn) ?? [];
          const filteredListEn = currentListEn.filter((item: any) => item.slug !== slug);
          let updatedListEn = [liveEn, ...filteredListEn];
          
          // Dynamic Cache Eviction: 
          // 1. Check current database key count size.
          // 2. If close to Upstash Free Tier limit (9500 keys) or feed length exceeds generous cap (3000), 
          //    evict the oldest articles to free up storage space.
          const currentDbSize = await redis.dbsize().catch(() => 0);
          const needsEvictionEn = currentDbSize >= MAX_REDIS_KEYS_THRESHOLD || updatedListEn.length > MAX_PUBLISHED_ARTICLES;

          if (needsEvictionEn) {
            // If the database is full, evict a batch of 10 oldest articles to create a safe buffer
            const targetSize = currentDbSize >= MAX_REDIS_KEYS_THRESHOLD
              ? Math.max(10, updatedListEn.length - 10)
              : MAX_PUBLISHED_ARTICLES;

            const evicted = updatedListEn.slice(targetSize);
            for (const item of evicted) {
              await redis.del(`insights:article:${item.slug}`).catch(() => {});
              console.log(`[eviction] Evicted oldest English article from Redis: "${item.slug}" (DB Size: ${currentDbSize} keys)`);
            }
            updatedListEn = updatedListEn.slice(0, targetSize);
          }
          // Why no TTL: Live listing feeds persist indefinitely for long-term SEO preservation
          await setWithCompression(listKeyEn, updatedListEn);

          const listKeyAr = `insights:list:ar`;
          const currentListAr = await getWithCompression<any[]>(listKeyAr) ?? [];
          const filteredListAr = currentListAr.filter((item: any) => item.slug !== slug);
          let updatedListAr = [liveAr, ...filteredListAr];
          
          // Dynamic Cache Eviction: Apply identical safety checks for the Arabic feed
          const needsEvictionAr = currentDbSize >= MAX_REDIS_KEYS_THRESHOLD || updatedListAr.length > MAX_PUBLISHED_ARTICLES;

          if (needsEvictionAr) {
            const targetSize = currentDbSize >= MAX_REDIS_KEYS_THRESHOLD
              ? Math.max(10, updatedListAr.length - 10)
              : MAX_PUBLISHED_ARTICLES;

            const evicted = updatedListAr.slice(targetSize);
            for (const item of evicted) {
              await redis.del(`insights:article:${item.slug}`).catch(() => {});
              console.log(`[eviction] Evicted oldest Arabic article from Redis: "${item.slug}" (DB Size: ${currentDbSize} keys)`);
            }
            updatedListAr = updatedListAr.slice(0, targetSize);
          }
          // Why no TTL: Live listing feeds persist indefinitely for long-term SEO preservation
          await setWithCompression(listKeyAr, updatedListAr);
        } finally {
          await redis.del(lockKey);
        }
      } else if (action === 'edit' && content) {
        draft.content = content;
      }
      await draftDb.setDraft(topic, draft);
      console.log(`[admin] Updated manual draft for "${topic}" | Action: "${action}"`);
    } else {
      console.warn(`[admin] Attempted manual draft update for non-existent topic: "${topic}"`);
      return NextResponse.json({ error: 'Not Found' }, { status: 404 });
    }
    
    return NextResponse.json({ success: true });
  } catch (err: any) {
    console.error('[article API] PUT update error:', err.message || err);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

