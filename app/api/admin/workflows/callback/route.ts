// Webhook Callback for Render LangGraph Agent
// WHY: This endpoint receives the finished article from the external Python agent running on Render.
// It securely stores the generated article directly into Upstash Redis so it appears instantly 
// in the existing Arabia Khaleej human verification dashboard (/admin/review).
import { NextRequest, NextResponse } from 'next/server';
import { getWithCompression, setWithCompression } from '@/lib/redis';
import { translateMarkdown } from '@/lib/translate';

const CACHE_TIMES = {
  INSIGHTS_ARCHIVE: 2592000, // 30 days
};

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
    const { topic, status, article, word_count, language = 'en' } = payload;

    if (!topic || !article) {
      return NextResponse.json({ error: 'Missing topic or article content' }, { status: 400 });
    }

    // Generate a URL-friendly slug from the topic
    const slug = topic
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)+/g, '');

    console.log(`[webhook] Starting automated Edge-native translation to Arabic for topic: "${topic}"`);

    // Perform high-fidelity automated translation of both topic and article body
    // Why: Translating at write-time shields users from page load latency, making the website blazing fast.
    const titleAr = await translateMarkdown(topic, 'en', 'ar');
    const articleAr = await translateMarkdown(article, 'en', 'ar');

    // Construct the bilingual article object
    // Why: Storing both languages under a single document avoids data synchronization drift.
    const draftArticle = {
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
      wordCount: word_count,
      language: 'en', // Base source language is English
    };

    // Save the detailed bilingual article body to Redis
    const draftKey = `insights:draft:article:${slug}`;
    await setWithCompression(draftKey, draftArticle, { ex: CACHE_TIMES.INSIGHTS_ARCHIVE });

    // Update the master queue list so it appears in the dashboard UI
    // Why: Save to both english drafts queue so they are visible under one main review tab.
    const listKey = `insights:drafts:en`;
    const currentDrafts = await getWithCompression<any[]>(listKey) ?? [];
    
    // Check if it already exists to avoid duplicates
    const exists = currentDrafts.find((d: any) => d.slug === slug);
    if (!exists) {
      await setWithCompression(listKey, [{ slug, title: topic, status: 'pending' }, ...currentDrafts], { ex: CACHE_TIMES.INSIGHTS_ARCHIVE });
    }

    console.log(`[webhook] Successfully saved unified bilingual draft for slug: "${slug}"`);
    return NextResponse.json({ success: true, message: 'Bilingual draft successfully saved to dashboard' });
  } catch (error: any) {
    console.error('Callback Webhook Error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
