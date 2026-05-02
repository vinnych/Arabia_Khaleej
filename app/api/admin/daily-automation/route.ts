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

export const runtime = 'edge';
export const dynamic = 'force-dynamic';

/**
 * Enhanced generation logic that balances quality and free-tier token limits.
 */
async function generateBatch(lang: 'en' | 'ar', type: 'gcc' | 'international', topicIndex: number = 0) {
  console.log(`Starting ${type.toUpperCase()} Batch for ${lang} (Topic Index: ${topicIndex})...`);
  
  // Use specialized topic generation based on type
  const topics = await generateTrendingTopics(lang, type);
  if (!topics || topics.length === 0) return 0;

  const generatedInsights: InsightItem[] = [];

  const targetTopic = topics[topicIndex % topics.length];

  const item = targetTopic;
  try {
      // Use Llama 70B for GCC (Premium) and Llama 8B for International (Efficiency) to save tokens
      const model = type === 'gcc' ? "llama-3.3-70b-versatile" : "llama-3.1-8b-instant";
      
      const rawContent = await generateGCCInsight(item.country, item.topic, lang, model);
      const content = cleanAIContent(rawContent);
      
      if (!content || content.length < 500) {
        console.warn(`Content for ${item.topic} too short or empty, skipping.`);
        return 0;
      }

      const firstLine = content.split('\n')[0].replace(/[#*]/g, '').trim();
      const title = firstLine.length > 10 ? firstLine : `${item.country}: ${item.topic}`;
      
      // Use the English topic for the slug base to ensure EN and AR versions share the same slug
      // This fixes the 404 issue when switching languages
      const slugBase = item.topic;
      const slug = toSlug(slugBase, `${type === 'gcc' ? 'v' : 'int'}-${new Date().getUTCDate()}-${new Date().getUTCMonth()}`);

      // Fetch a relevant image from Pexels (with Unsplash/fallback chain) based on the topic
      const imageSearchQuery = `${item.topic} ${item.country}`;
      const imageUrl = await getRelevantImage(imageSearchQuery, slug);

      const newInsight: InsightItem = {
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

      generatedInsights.push(newInsight);
      
    } catch (err) {
      console.error(`Failed to generate ${type} article:`, err);
    }

  const archiveKey = `insights_archive_${lang}`;
  const currentArchive = (await redis.get(archiveKey) as InsightItem[] | null) || [];
  
  // Prevent duplicate generation (check if slug already exists in archive)
  const existingSlugs = new Set(currentArchive.map(a => a.slug));
  const uniqueGenerated = generatedInsights.filter(g => !existingSlugs.has(g.slug));

  const updatedArchive = [...uniqueGenerated, ...currentArchive].slice(0, 1500);
  await redis.set(archiveKey, updatedArchive, { ex: CACHE_TIMES.INSIGHTS_ARCHIVE });

  return uniqueGenerated.length;
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

    // 2. Master Digest — Optimized for Vercel Hobby 10s limit
    // Instead of doing both sequentially, we pick one based on the hour or a param
    if (searchParams.get('action') === 'master-digest') {
      const providedIndex = searchParams.get('index');
      const hourIndex = new Date().getUTCHours();
      const topicIndex = providedIndex ? parseInt(providedIndex) : hourIndex;
      
      // Toggle language based on parity of the hour to ensure both are generated over time
      // or allow explicit override
      const lang = (searchParams.get('lang') as 'en' | 'ar') || (hourIndex % 2 === 0 ? 'en' : 'ar');
      const type = (searchParams.get('type') as 'gcc' | 'international') || 'gcc';

      console.log(`Executing Master Digest for [${lang}:${type}] Topic Index: ${topicIndex}`);

      const count = await generateBatch(lang, type, topicIndex);

      return NextResponse.json({
        success: true,
        action: 'master-digest-task-completed',
        batch: `${type}:${lang}`,
        generated: count
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

