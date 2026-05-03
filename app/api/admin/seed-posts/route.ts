import { NextResponse } from 'next/server';
import { generateGCCInsight } from '@/lib/ai';
import { redis, CACHE_TIMES } from '@/lib/redis';
import { toSlug } from '@/lib/utils';
import { InsightItem } from '@/lib/insights';
import { getRelevantImage } from '@/lib/images';

// Node.js runtime — 60s Vercel Hobby timeout (not Edge's 30s)
export const dynamic = 'force-dynamic';

function cleanAIContent(content: string): string {
  return content
    .replace(/^(Here is|Sure|Certainly|I've|This article|As requested).*\n+/i, '')
    .trim();
}

function extractDescription(content: string): string {
  const cleaned = cleanAIContent(content);
  const lines = cleaned.split('\n').map((l) => l.trim()).filter(Boolean);
  const paragraph = lines.find((l) => !l.startsWith('#') && l.length > 80);
  if (!paragraph) return lines[0]?.replace(/[#*_]/g, '').trim().substring(0, 180) + '...' || '';
  return paragraph.replace(/[#*_]/g, '').trim().substring(0, 180) + '...';
}

const SEED_TOPICS = [
  { country: 'Saudi Arabia', topic: 'Vision 2030 Midpoint Review Economic Transformation Progress' },
  { country: 'UAE',          topic: 'Dubai AI Economy Sovereign Infrastructure Global Leadership' },
  { country: 'Qatar',        topic: 'Post World Cup Legacy Sport Tourism Economic Diversification' },
  { country: 'UAE',          topic: 'Abu Dhabi Sovereign Wealth ADNOC Mubadala Global Strategy' },
  { country: 'Saudi Arabia', topic: 'NEOM Construction Milestones The Line Sindalah Progress 2026' },
];

export async function GET(request: Request) {
  const authHeader = request.headers.get('authorization');
  const { searchParams } = new URL(request.url);
  const cronSecret = searchParams.get('secret');
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}` && cronSecret !== process.env.CRON_SECRET) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const generated: InsightItem[] = [];
  const errors: string[] = [];

  for (const { country, topic } of SEED_TOPICS) {
    try {
      const rawContent = await generateGCCInsight(country, topic, 'en', 'llama-3.1-8b-instant');
      const content = cleanAIContent(rawContent);

      if (!content || content.length < 300) {
        errors.push(`${topic}: content too short`);
        continue;
      }

      const firstLine = content.split('\n')[0].replace(/[#*]/g, '').trim();
      const title = firstLine.length > 10 ? firstLine : `${country}: ${topic}`;
      // Stable slug — same topic always gets same slug, dedup works across re-runs
      const slug = toSlug(topic, `seed-${topic.slice(0, 16)}`);
      const imageUrl = await getRelevantImage(`${topic} ${country}`, slug);

      generated.push({
        id: `seed-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`,
        slug,
        title,
        description: extractDescription(content),
        content,
        link: `/insights/${slug}`,
        pubDate: new Date().toISOString(),
        source: 'Arabia Khaleej Editorial',
        category: 'gcc',
        language: 'en',
        tags: ['gcc', 'trending', 'premium'],
        image: imageUrl,
      });
    } catch (err: any) {
      errors.push(`${topic}: ${err.message}`);
    }
  }

  const archiveKey = 'insights_archive_en';
  const current = ((await redis.get(archiveKey)) as InsightItem[] | null) || [];
  const existingSlugs = new Set(current.map((a) => a.slug));
  const unique = generated.filter((g) => !existingSlugs.has(g.slug));
  const updated = [...unique, ...current].slice(0, 1500);
  await redis.set(archiveKey, updated, { ex: CACHE_TIMES.INSIGHTS_ARCHIVE });

  return NextResponse.json({
    success: true,
    generated: unique.length,
    skipped: generated.length - unique.length,
    errors,
    slugs: unique.map((a) => a.slug),
  });
}
