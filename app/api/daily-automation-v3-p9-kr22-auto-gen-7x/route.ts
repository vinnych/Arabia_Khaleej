import { NextResponse } from 'next/server';
import { generateGCCInsight, generateTrendingTopics } from '@/lib/ai';
import { redis, CACHE_TIMES } from '@/lib/redis';
import { toSlug } from '@/lib/utils';
import { InsightItem } from '@/lib/insights';
import { getRelevantImage } from '@/lib/images';

function cleanAIContent(content: string): string {
  return content
    .replace(/^(Here is|Sure|Certainly|I've|This article|As requested|Title:|Article:).*\n+/i, '')
    .replace(/^(I will write|I can help with).*\n+/i, '')
    .replace(/\n+(I hope this helps|Let me know if you need anything else).*$/i, '')
    .trim();
}

function extractDescription(content: string): string {
  const cleaned = cleanAIContent(content);
  const lines = cleaned.split('\n').map(l => l.trim()).filter(Boolean);
  const paragraph = lines.find(l => !l.startsWith('#') && l.length > 80);
  if (!paragraph) {
    const firstLine = lines[0] || '';
    return firstLine.replace(/[#*_]/g, '').trim().substring(0, 180) + (firstLine ? '...' : '');
  }
  return paragraph.replace(/[#*_]/g, '').trim().substring(0, 180) + '...';
}

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';
export const maxDuration = 300; 

async function generateSingleArticle(
  lang: 'en' | 'ar', 
  type: 'gcc' | 'international', 
  item: { country: string, topic: string }
): Promise<InsightItem | null> {
  try {
    const model = type === 'gcc' ? "llama-3.3-70b-versatile" : "llama-3.1-8b-instant";
    const rawContent = await generateGCCInsight(item.country, item.topic, lang, model);
    const content = cleanAIContent(rawContent);
    
    if (!content || content.length < 500) {
      console.warn(`Content for ${item.topic} too short or empty, skipping.`);
      return null;
    }

    const firstLine = content.split('\n')[0].replace(/[#*]/g, '').trim();
    const title = firstLine.length > 10 ? firstLine : `${item.country}: ${item.topic}`;
    const slug = toSlug(item.topic, `${type === 'gcc' ? 'v' : 'int'}-${new Date().getUTCDate()}-${new Date().getUTCMonth()}`);
    const imageUrl = await getRelevantImage(`${item.topic} ${item.country}`, slug);

    return {
      id: `daily-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`,
      slug,
      title,
      description: extractDescription(content),
      content,
      link: `/insights/${slug}`,
      pubDate: new Date().toISOString(),
      source: type === 'gcc' ? "Arabia Khaleej Editorial" : "Global Insights Hub",
      category: "gcc",
      language: lang,
      tags: [type, 'trending', 'premium'],
      image: imageUrl,
    };
  } catch (err) {
    console.error(`Failed to generate ${type} article:`, err);
    return null;
  }
}

export async function GET(request: Request) {
  // 1. Secure the route with CRON_SECRET if configured
  const authHeader = request.headers.get('authorization');
  const cronSecret = process.env.CRON_SECRET;
  
  if (cronSecret && authHeader !== `Bearer ${cronSecret}`) {
    console.warn("Unauthorized attempt to trigger daily automation.");
    return new Response('Unauthorized', { status: 401 });
  }

  const { searchParams } = new URL(request.url);

  const startTime = Date.now();
  console.log(`Starting Daily Automation (5 Articles: 3 EN, 2 AR)...`);

  try {
    // 2. Fetch 10 topics (use top 5)
    const topics = await generateTrendingTopics('en', 'gcc');
    if (!topics || topics.length === 0) throw new Error("No topics generated");

    const generatedEn: InsightItem[] = [];
    const generatedAr: InsightItem[] = [];

    // 3. Generate 3 English Articles
    for (let i = 0; i < 3; i++) {
      if (topics[i]) {
        console.log(`Generating EN Article ${i+1}/3: ${topics[i].topic}`);
        const res = await generateSingleArticle('en', 'gcc', topics[i]);
        if (res) generatedEn.push(res);
      }
    }

    // 4. Generate 2 Arabic Articles
    for (let i = 3; i < 5; i++) {
      if (topics[i]) {
        console.log(`Generating AR Article ${i-2}/2: ${topics[i].topic}`);
        const res = await generateSingleArticle('ar', 'gcc', topics[i]);
        if (res) generatedAr.push(res);
      }
    }

    // 5. Save to Redis
    for (const lang of ['en', 'ar'] as const) {
      const batch = lang === 'en' ? generatedEn : generatedAr;
      if (batch.length === 0) continue;

      const archiveKey = `insights_archive_${lang}`;
      const currentArchive = (await redis.get(archiveKey) as InsightItem[] | null) || [];
      const existingSlugs = new Set(currentArchive.map(a => a.slug));
      const uniqueBatch = batch.filter(g => !existingSlugs.has(g.slug));

      if (uniqueBatch.length > 0) {
        const updatedArchive = [...uniqueBatch, ...currentArchive].slice(0, 1500);
        await redis.set(archiveKey, updatedArchive, { ex: CACHE_TIMES.INSIGHTS_ARCHIVE });
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
