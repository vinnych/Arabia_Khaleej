import { NextResponse } from 'next/server';
import { draftDb } from '@/lib/draftsDb';
import { toSlug } from '@/lib/utils';
import { redis, getWithCompression, setWithCompression } from '@/lib/redis';
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
  const { searchParams } = new URL(req.url);
  const secret = searchParams.get('secret');
  const adminSecret = getAdminSecret();
  
  if (!adminSecret) return false;
  return secret === adminSecret;
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
          await setWithCompression(listKey, updatedList, { ex: 2592000 });
          console.log(`[admin] Successfully removed article from listing: "${listKey}"`);
        }
      }
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
            en: draft.content ? draft.content.substring(0, 160).replace(/[#*_`]/g, '').trim() + '...' : topic,
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

        // 1. Commit full bilingual document (insights:article:${slug})
        await setWithCompression(`insights:article:${slug}`, liveArticle, { ex: 2592000 });

        // 2. Pre-normalize and prepend to EN and AR main listings
        const liveEn = normalizeArticle(liveArticle, 'en');
        const liveAr = normalizeArticle(liveArticle, 'ar');

        const listKeyEn = `insights:list:en`;
        const currentListEn = await getWithCompression<any[]>(listKeyEn) ?? [];
        const updatedListEn = [liveEn, ...currentListEn.filter((item: any) => item.slug !== slug)].slice(0, 1000);
        await setWithCompression(listKeyEn, updatedListEn, { ex: 2592000 });

        const listKeyAr = `insights:list:ar`;
        const currentListAr = await getWithCompression<any[]>(listKeyAr) ?? [];
        const updatedListAr = [liveAr, ...currentListAr.filter((item: any) => item.slug !== slug)].slice(0, 1000);
        await setWithCompression(listKeyAr, updatedListAr, { ex: 2592000 });
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
