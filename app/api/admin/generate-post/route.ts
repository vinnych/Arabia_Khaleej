import { NextResponse } from 'next/server';
import { generateGCCInsight } from '@/lib/ai';
import { redis } from '@/lib/redis';
import { toSlug } from '@/lib/utils';
import { NewsItem } from '@/lib/insights';

export const dynamic = 'force-dynamic';

/**
 * Admin API to generate dedicated GCC Insight posts.
 * Can be triggered manually or via a cron job.
 */
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { country, topic, lang = 'en', secret } = body;

    // Basic security check
    if (secret !== process.env.ADMIN_SECRET) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    if (!country || !topic) {
      return NextResponse.json({ error: 'Country and topic are required' }, { status: 400 });
    }

    console.log(`Generating dedicated post for ${country} - ${topic} (${lang})...`);
    
    const content = await generateGCCInsight(country, topic, lang as 'en' | 'ar');
    
    // Extract title from content (first line usually) or use a default
    const firstLine = content.split('\n')[0].replace(/[#*]/g, '').trim();
    const title = firstLine || `${country}: ${topic}`;
    const slug = toSlug(title, `dedicated-${Date.now()}`);

    const dedicatedPost: NewsItem = {
      id: `dedicated-${Date.now()}`,
      slug,
      title,
      description: content.substring(0, 300) + '...',
      content,
      link: `/insights/${slug}`,
      pubDate: new Date().toISOString(),
      source: "Arabia Khaleej Original",
      category: "gcc",
      language: lang as 'en' | 'ar',
      isPremium: true,
      tags: ['insight', country.toLowerCase(), topic.toLowerCase()],
      image: `https://images.unsplash.com/photo-1512453979798-5ea266f8880c?q=80&w=800&auto=format&fit=crop`, // Default GCC image
    };

    // Store in the news archive for the specific language
    const archiveKey = `news_archive_${lang}`;
    const currentNews = (await redis.get(archiveKey) as NewsItem[] | null) || [];
    
    // Add to the top of the archive
    const updatedNews = [dedicatedPost, ...currentNews].slice(0, 100);
    await redis.set(archiveKey, updatedNews);

    return NextResponse.json({ 
      success: true, 
      slug,
      title,
      wordCount: content.split(/\s+/).length 
    });

  } catch (error: any) {
    console.error('Generation API Error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
