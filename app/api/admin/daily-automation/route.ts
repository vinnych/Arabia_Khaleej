import { NextResponse } from 'next/server';
import { generateGCCInsight, generateTrendingTopics } from '@/lib/ai';
import { redis, CACHE_TIMES } from '@/lib/redis';
import { toSlug } from '@/lib/utils';
import { InsightItem } from '@/lib/insights';
import { getRelevantImage } from '@/lib/images';

function cleanAIContent(content: string): string {
  // Remove common AI preambles like "Here is the article:", "Sure, I can write that..."
  return content
    .replace(/^(Here is|Sure|Certainly|I've|This article|As requested).*\n+/i, '')
    .trim();
}

function extractDescription(content: string): string {
  const cleaned = cleanAIContent(content);
  const lines = cleaned.split('\n').map(l => l.trim()).filter(Boolean);
  // Find first real paragraph that isn't a heading
  const paragraph = lines.find(l => !l.startsWith('#') && l.length > 80);
  if (!paragraph) return lines[0]?.replace(/[#*_]/g, '').trim().substring(0, 180) + '...' || '';
  return paragraph.replace(/[#*_]/g, '').trim().substring(0, 180) + '...';
}

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';
export const maxDuration = 60; // Extend for batch-10 processing

/**
 * Enhanced generation logic that balances quality and free-tier token limits.
 */
async function generateSingleArticle(
  lang: 'en' | 'ar', 
  type: 'gcc' | 'international', 
  item: { country: string, topic: string }
): Promise<InsightItem | null> {
  try {
    // Use Llama 70B for GCC (Premium) and Llama 8B for International (Efficiency)
    const model = type === 'gcc' ? "llama-3.3-70b-versatile" : "llama-3.1-8b-instant";
    
    const rawContent = await generateGCCInsight(item.country, item.topic, lang, model);
    const content = cleanAIContent(rawContent);
    
    if (!content || content.length < 500) {
      console.warn(`Content for ${item.topic} too short or empty, skipping.`);
      return null;
    }

    const firstLine = content.split('\n')[0].replace(/[#*]/g, '').trim();
    const title = firstLine.length > 10 ? firstLine : `${item.country}: ${item.topic}`;
    
    const slugBase = item.topic;
    const slug = toSlug(slugBase, `${type === 'gcc' ? 'v' : 'int'}-${new Date().getUTCDate()}-${new Date().getUTCMonth()}`);

    // Pexels search query
    const imageSearchQuery = `${item.topic} ${item.country}`;
    const imageUrl = await getRelevantImage(imageSearchQuery, slug);

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

/**
 * Original generation logic preserved for compatibility
 */
async function generateBatch(lang: 'en' | 'ar', type: 'gcc' | 'international', topicIndex: number = 0) {
  console.log(`Starting ${type.toUpperCase()} Batch for ${lang} (Topic Index: ${topicIndex})...`);
  const topics = await generateTrendingTopics(lang, type);
  if (!topics || topics.length === 0) return 0;

  const targetTopic = topics[topicIndex % topics.length];
  const insight = await generateSingleArticle(lang, type, targetTopic);
  
  if (!insight) return 0;

  const archiveKey = `insights_archive_${lang}`;
  const currentArchive = (await redis.get(archiveKey) as InsightItem[] | null) || [];
  
  const existingSlugs = new Set(currentArchive.map(a => a.slug));
  if (existingSlugs.has(insight.slug)) return 0;

  const updatedArchive = [insight, ...currentArchive].slice(0, 1500);
  await redis.set(archiveKey, updatedArchive, { ex: CACHE_TIMES.INSIGHTS_ARCHIVE });

  return 1;
}

export async function GET(request: Request) {
  const authHeader = request.headers.get('authorization');
  const { searchParams } = new URL(request.url);
  const cronSecret = searchParams.get('secret');
  
  // New: Targeted batch parameters
  const targetType = searchParams.get('type') as 'gcc' | 'international' | null;
  const targetLang = searchParams.get('lang') as 'en' | 'ar' | null;

  if (authHeader !== `Bearer ${process.env.CRON_SECRET}` && cronSecret !== process.env.CRON_SECRET) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const startTime = Date.now();
  console.log(`Starting Daily Automation [${targetType || 'all'}:${targetLang || 'all'}]...`);

  try {

    // 2. Batch 10 Generation (Vercel Cron Trigger)
    if (searchParams.get('action') === 'batch-10' || searchParams.get('action') === 'master-digest') {
      console.log("Executing Batch-10 Automation...");
      
      // Fetch 10 topics for GCC (used for both EN and AR to maintain consistency)
      const topics = await generateTrendingTopics('en', 'gcc');
      if (!topics || topics.length === 0) throw new Error("No topics generated");

      // Take first 5 topics for EN and 5 for AR (or any distribution)
      // Here we generate 5 EN and 5 AR articles from the top 10 topics
      const enJobs = topics.slice(0, 5).map(topic => generateSingleArticle('en', 'gcc', topic));
      const arJobs = topics.slice(5, 10).map(topic => generateSingleArticle('ar', 'gcc', topic));

      const allResults = await Promise.allSettled([...enJobs, ...arJobs]);
      
      const generatedEn: InsightItem[] = [];
      const generatedAr: InsightItem[] = [];

      allResults.forEach((res, idx) => {
        if (res.status === 'fulfilled' && res.value) {
          if (idx < 5) generatedEn.push(res.value);
          else generatedAr.push(res.value);
        }
      });

      // Save to Redis
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

      return NextResponse.json({
        success: true,
        action: 'batch-10-completed',
        generated: {
          en: generatedEn.length,
          ar: generatedAr.length
        }
      });
    }

    const results = {
      gcc: { en: 0, ar: 0 },
      international: { en: 0, ar: 0 }
    };

    // 3. Conditional Batch Execution
    const topicIndex = parseInt(searchParams.get('index') || '0');
    
    if (targetType && targetLang) {
      results[targetType][targetLang] = await generateBatch(targetLang, targetType, topicIndex);
    } else {
      // Manual/Fallback
      results.gcc.en = await generateBatch('en', 'gcc', 0);
    }

    const duration = Math.floor((Date.now() - startTime) / 1000);
    console.log(`Daily Automation Completed in ${duration}s`);

    return NextResponse.json({ 
      success: true, 
      automated: true,
      duration: `${duration}s`,
      counts: results,
      batch: targetType ? `${targetType}:${targetLang}` : 'default'
    });
  } catch (error: any) {
    console.error("Daily Automation Failed:", error.message);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

