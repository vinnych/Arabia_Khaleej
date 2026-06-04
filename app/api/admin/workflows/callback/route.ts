// Webhook Callback for Render LangGraph Agent
// WHY: This endpoint receives the finished article from the external Python agent running on Render.
// It securely stores the generated article via draftDb so it appears instantly 
// in the existing Arabia Khaleej human verification dashboard (/admin/review).
import { NextRequest, NextResponse } from 'next/server';
import { getWithCompression, setWithCompression } from '@/lib/redis';
import { translateMarkdown } from '@/lib/translate';
import { draftDb } from '@/lib/draftsDb';

export const runtime = 'edge';
export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const secret = searchParams.get('secret');
  const ADMIN_SECRET = process.env.ADMIN_SECRET!;

  // Security check: Only accept callbacks from our own trusted Render agent
  if (secret !== ADMIN_SECRET) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const payload = await request.json();
    const {
      topic,
      status,
      article,
      word_count,
      language = 'en',
      titleAr: payloadTitleAr,
      title_ar: payloadTitleAr2,
      articleAr: payloadArticleAr,
      article_ar: payloadArticleAr2,
      contentAr: payloadContentAr,
      content_ar: payloadContentAr2
    } = payload;

    if (!topic || !article) {
      return NextResponse.json({ error: 'Missing topic or article content' }, { status: 400 });
    }

    // Generate a URL-friendly slug from the topic
    const slug = topic
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)+/g, '');

    // Resolve pre-translated content or fallback to edge-based translation
    let titleAr = payloadTitleAr || payloadTitleAr2;
    let articleAr = payloadArticleAr || payloadArticleAr2 || payloadContentAr || payloadContentAr2;

    if (!titleAr) {
      console.log(`[webhook] No pre-translated title provided. Starting automated Edge-native translation for: "${topic}"`);
      titleAr = await translateMarkdown(topic, 'en', 'ar');
    } else {
      console.log(`[webhook] Using pre-translated title for: "${topic}"`);
    }

    if (!articleAr) {
      console.log(`[webhook] No pre-translated content provided. Starting automated Edge-native translation for: "${topic}"`);
      articleAr = await translateMarkdown(article, 'en', 'ar');
    } else {
      console.log(`[webhook] Using pre-translated content for: "${topic}"`);
    }

    // Construct the bilingual article object
    // Why: Storing both languages under a single document avoids data synchronization drift.
    const draftArticle = {
      topic,
      slug,
      title: {
        en: topic,
        ar: titleAr,
      },
      description: {
        en: article.substring(0, 150) + '...',
        ar: articleAr.substring(0, 150) + '...',
      },
      status: 'pending',
      content: {
        en: article,
        ar: articleAr,
      },
      word_count: word_count,
      timestamp: Date.now()
    };

    // Save the detailed bilingual article body via draftDb (handles D1 and Redis automatically)
    await draftDb.setDraft(topic, draftArticle);

    // If D1 is not active (we are in Redis mode), we also write legacy keys for backward-compatibility
    if (!draftDb.isD1Active()) {
      const draftKey = `insights:draft:article:${slug}`;
      await setWithCompression(draftKey, draftArticle);

      const listKey = `insights:drafts:en`;
      const currentDrafts = await getWithCompression<any[]>(listKey) ?? [];
      
      // Check if it already exists to avoid duplicates
      const exists = currentDrafts.find((d: any) => d.slug === slug);
      if (!exists) {
        await setWithCompression(listKey, [{ slug, title: topic, status: 'pending' }, ...currentDrafts]);
      }
    }

    console.log(`[webhook] Successfully saved unified bilingual draft for slug: "${slug}"`);
    return NextResponse.json({ success: true, message: 'Bilingual draft successfully saved to database' });
  } catch (error: any) {
    console.error('Callback Webhook Error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
