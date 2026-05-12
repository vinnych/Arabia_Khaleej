/**
 * Arabia Khaleej — Daily Automation Service
 * 
 * Orchestrates the automated generation of regional insights.
 * Optimized for Edge Runtime with structured AI metadata.
 */

import { NextResponse } from 'next/server';
import { generateGCCInsight, generateTrendingTopics } from '@/lib/ai';
import { redis, CACHE_TIMES, getWithCompression, setWithCompression } from '@/lib/redis';
import { toSlug } from '@/lib/utils';
import { InsightItem } from '@/lib/insights';
import { getRelevantImage } from '@/lib/images';

export const runtime = 'edge';
export const dynamic = 'force-dynamic';
export const maxDuration = 300;

async function generateSingleArticle(
  lang: 'en' | 'ar', 
  type: 'gcc' | 'international', 
  item: { country: string, topic: string }
): Promise<InsightItem | null> {
  try {
    const model = type === 'gcc' ? "llama-3.3-70b-versatile" : "llama-3.1-8b-instant";
    
    // Fetch structured data from AI
    const aiData = await generateGCCInsight(item.country, item.topic, lang, model);
    
    if (!aiData.content || aiData.content.length < 500) {
      console.warn(`Content for ${item.topic} too short or empty, skipping.`);
      return null;
    }

    const title = aiData.title;
    const slug = toSlug(title, `${type}-${item.topic}`);
    const imageUrl = await getRelevantImage(`${item.topic} ${item.country}`, slug);

    return {
      id: `daily-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`,
      slug,
      title,
      description: aiData.summary,
      content: aiData.content,
      link: `/insights/${slug}`,
      pubDate: new Date().toISOString(),
      source: aiData.author.name, // Use AI-generated author
      category: aiData.category as any, // Use AI-generated category
      language: lang,
      tags: [type, aiData.category.toLowerCase(), 'intelligence'],
      image: imageUrl,
    };
  } catch (err) {
    console.error(`Failed to generate ${type} article:`, err);
    return null;
  }
}

export async function GET(request: Request) {
  // Secure the route with CRON_SECRET
  const authHeader = request.headers.get('authorization');
  const cronSecret = process.env.CRON_SECRET;
  
  if (cronSecret && authHeader !== `Bearer ${cronSecret}`) {
    console.warn("Unauthorized attempt to trigger daily automation.");
    return new Response('Unauthorized', { status: 401 });
  }

  const startTime = Date.now();
  console.log(`Starting Daily Automation (5 Articles: 3 EN, 2 AR)...`);

  try {
    const topics = await generateTrendingTopics('en', 'gcc');
    if (!topics || topics.length === 0) throw new Error("No topics generated");

    const generatedEn: InsightItem[] = [];
    const generatedAr: InsightItem[] = [];

    // Generate 3 English Articles
    for (let i = 0; i < 3; i++) {
      if (topics[i]) {
        console.log(`Generating EN Article ${i+1}/3: ${topics[i].topic}`);
        const res = await generateSingleArticle('en', 'gcc', topics[i]);
        if (res) generatedEn.push(res);
      }
    }

    // Generate 2 Arabic Articles
    for (let i = 3; i < 5; i++) {
      if (topics[i]) {
        console.log(`Generating AR Article ${i-2}/2: ${topics[i].topic}`);
        const res = await generateSingleArticle('ar', 'gcc', topics[i]);
        if (res) generatedAr.push(res);
      }
    }

    // Save to Redis
    for (const lang of ['en', 'ar'] as const) {
      const batch = lang === 'en' ? generatedEn : generatedAr;
      if (batch.length === 0) continue;

      const archiveKey = `insights_archive_${lang}`;
      const currentArchive = (await getWithCompression<InsightItem[]>(archiveKey)) || [];
      const existingSlugs = new Set(currentArchive.map(a => a.slug));
      const uniqueBatch = batch.filter(g => !existingSlugs.has(g.slug));

      if (uniqueBatch.length > 0) {
        const updatedArchive = [...uniqueBatch, ...currentArchive].slice(0, 1500);
        await setWithCompression(archiveKey, updatedArchive, { ex: CACHE_TIMES.INSIGHTS_ARCHIVE });
      }
    }

    const duration = Math.floor((Date.now() - startTime) / 1000);
    console.log(`Daily Automation Completed in ${duration}s`);

    return NextResponse.json({
      success: true,
      duration: `${duration}s`,
      generated: {
        en: generatedEn.length,
        ar: generatedAr.length
      }
    });
  } catch (error: any) {
    console.error("Daily Automation Failed:", error.message);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
