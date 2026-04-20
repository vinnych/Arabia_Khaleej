import { NextResponse } from 'next/server';
import { redis, CACHE_TIMES } from '@/lib/redis';

interface NewsItem {
  id: string;
  slug: string;
  title: string;
  description: string;
  link: string;
  pubDate: string;
  source: string;
  category: 'gcc' | 'expat';
  language: 'en' | 'ar' | 'regional';
  image?: string;
}

const CATEGORY_IMAGES: Record<string, string> = {
  QNA: 'https://images.unsplash.com/photo-1590059397633-875f68480356?q=80&w=800&auto=format&fit=crop',
  WAM: 'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?q=80&w=800&auto=format&fit=crop',
  SPA: 'https://images.unsplash.com/photo-1580674285054-bed31e145f59?q=80&w=800&auto=format&fit=crop',
  BNA: 'https://images.unsplash.com/photo-1549944850-84e00be4203b?q=80&w=800&auto=format&fit=crop',
  ONA: 'https://images.unsplash.com/photo-1578330132822-01869bb9c1a1?q=80&w=800&auto=format&fit=crop',
  INDIA: 'https://images.unsplash.com/photo-1524492707947-28a0ff99d1f3?q=80&w=800&auto=format&fit=crop',
  PAKISTAN: 'https://images.unsplash.com/photo-1527359443443-84a18a1a7410?q=80&w=800&auto=format&fit=crop',
  BANGLADESH: 'https://images.unsplash.com/photo-1585123334904-845d60e97b29?q=80&w=800&auto=format&fit=crop',
  PHILIPPINES: 'https://images.unsplash.com/photo-1518509562904-e7ef99cdcc86?q=80&w=800&auto=format&fit=crop',
};

const SMART_KEYWORDS: Record<string, string> = {
  finance: 'https://images.unsplash.com/photo-1611974714013-3c834927c390?q=80&w=800&auto=format&fit=crop',
  oil: 'https://images.unsplash.com/photo-1576085898323-2183ba9b2203?q=80&w=800&auto=format&fit=crop',
  gold: 'https://images.unsplash.com/photo-1610375461246-83df859d849d?q=80&w=800&auto=format&fit=crop',
  diplomacy: 'https://images.unsplash.com/photo-1521791136366-3e9964f62d4b?q=80&w=800&auto=format&fit=crop',
  tech: 'https://images.unsplash.com/photo-1518770660439-4636190af475?q=80&w=800&auto=format&fit=crop',
  sports: 'https://images.unsplash.com/photo-1508098682722-e99c43a406b2?q=80&w=800&auto=format&fit=crop',
  construction: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=800&auto=format&fit=crop',
  aviation: 'https://images.unsplash.com/photo-1436491865332-7a61a109c0f2?q=80&w=800&auto=format&fit=crop',
  medical: 'https://images.unsplash.com/photo-1505751172876-fa1923c5c528?q=80&w=800&auto=format&fit=crop',
};

const GCC_FEEDS = {
  QNA: {
    en: 'https://qna.org.qa/en/Pages/RSS-Feeds/General',
    ar: 'https://qna.org.qa/ar/Pages/RSS-Feeds/General',
  },
  WAM: {
    en: 'https://www.wam.ae/en/rss/general',
    ar: 'https://www.wam.ae/ar/rss/general',
  },
  SPA: {
    en: 'https://www.spa.gov.sa/en/rss/general',
    ar: 'https://www.spa.gov.sa/ar/rss/general',
  },
  BNA: {
    en: 'https://www.bna.bh/en/GenerateRssFeed.aspx?categoryId=153',
    ar: 'https://www.bna.bh/GenerateRssFeed.aspx?categoryId=153',
  },
  ONA: {
    en: 'https://omannews.gov.om/rss.ona',
    ar: 'https://omannews.gov.om/rss.ona',
  }
};

const EXPAT_FEEDS = {
  INDIA: {
    en: 'https://www.aninews.in/rss/feed/category/national.xml',
    regional: 'https://www.amarujala.com/rss/india-news.xml', // Hindi
  },
  PAKISTAN: {
    en: 'https://www.app.com.pk/feed/',
    regional: 'http://feeds.bbci.co.uk/urdu/rss.xml', // Urdu
  },
  BANGLADESH: {
    en: 'https://www.thedailystar.net/rss.xml',
    regional: 'https://www.prothomalo.com/feed/', // Bengali
  },
  PHILIPPINES: {
    en: 'https://www.pna.gov.ph/rss/national.xml',
    regional: 'https://news.abs-cbn.com/feed', // Filipino
  }
};

function parseRSS(xml: string, source: string, category: 'gcc' | 'expat', language: 'en' | 'ar' | 'regional'): NewsItem[] {
  const items: NewsItem[] = [];
  const itemRegex = /<item>([\s\S]*?)<\/item>/g;
  let match;

  while ((match = itemRegex.exec(xml)) !== null) {
    const content = match[1];
    
    const title = content.match(/<title>([\s\S]*?)<\/title>/)?.[1]?.replace(/<!\[CDATA\[([\s\S]*?)\]\]>/g, '$1').trim() || '';
    const description = content.match(/<description>([\s\S]*?)<\/description>/)?.[1]?.replace(/<!\[CDATA\[([\s\S]*?)\]\]>/g, '$1').trim() || '';
    const link = content.match(/<link>([\s\S]*?)<\/link>/)?.[1]?.replace(/<!\[CDATA\[([\s\S]*?)\]\]>/g, '$1').trim() || '';
    const pubDateRaw = content.match(/<pubDate>([\s\S]*?)<\/pubDate>/)?.[1]?.trim() || '';
    
    // Robust Date Normalization
    const normalizeDate = (rawDate: string) => {
      if (!rawDate) return new Date().toISOString();
      if (/[\u0600-\u06FF]/.test(rawDate)) {
        const monthsAr: Record<string, string> = {
          'يناير': 'Jan', 'فبراير': 'Feb', 'مارس': 'Mar', 'أبريل': 'Apr', 
          'مايو': 'May', 'يونيو': 'Jun', 'يوليو': 'Jul', 'أغسطس': 'Aug', 
          'سبتمبر': 'Sep', 'أكتوبر': 'Oct', 'نوفمبر': 'Nov', 'ديسمبر': 'Dec'
        };
        let normalized = rawDate;
        normalized = normalized.replace(/^(?:الأحد|الاثنين|الثلاثاء|الأربعاء|الخميس|الجمعة|السبت)،?\s*/, '');
        Object.keys(monthsAr).forEach(ar => { normalized = normalized.replace(ar, monthsAr[ar]); });
        const d = new Date(normalized);
        if (!isNaN(d.getTime())) return d.toISOString();
      }
      const d = new Date(rawDate);
      return !isNaN(d.getTime()) ? d.toISOString() : new Date().toISOString();
    };

    const finalPubDate = normalizeDate(pubDateRaw);
    const id = content.match(/<guid[\s\S]*?>([\s\S]*?)<\/guid>/)?.[1]?.trim() || link;

    // Smart Keyword Detection
    const lowerTitle = title.toLowerCase();
    let smartImage = null;
    if (lowerTitle.includes('gold')) smartImage = SMART_KEYWORDS.gold;
    else if (lowerTitle.includes('oil') || lowerTitle.includes('energy') || lowerTitle.includes('gas')) smartImage = SMART_KEYWORDS.oil;
    else if (lowerTitle.includes('market') || lowerTitle.includes('stock') || lowerTitle.includes('finance') || lowerTitle.includes('bank')) smartImage = SMART_KEYWORDS.finance;
    else if (lowerTitle.includes('meeting') || lowerTitle.includes('minister') || lowerTitle.includes('summit') || lowerTitle.includes('diplomacy')) smartImage = SMART_KEYWORDS.diplomacy;
    else if (lowerTitle.includes('football') || lowerTitle.includes('cricket') || lowerTitle.includes('sport') || lowerTitle.includes('stadium')) smartImage = SMART_KEYWORDS.sports;
    else if (lowerTitle.includes('tech') || lowerTitle.includes('ai') || lowerTitle.includes('space') || lowerTitle.includes('launch')) smartImage = SMART_KEYWORDS.tech;
    else if (lowerTitle.includes('build') || lowerTitle.includes('project') || lowerTitle.includes('construction') || lowerTitle.includes('city')) smartImage = SMART_KEYWORDS.construction;
    else if (lowerTitle.includes('flight') || lowerTitle.includes('aviation') || lowerTitle.includes('airport')) smartImage = SMART_KEYWORDS.aviation;
    else if (lowerTitle.includes('health') || lowerTitle.includes('medical') || lowerTitle.includes('hospital')) smartImage = SMART_KEYWORDS.medical;

    // Extract image from enclosure, media:content, or img tag
    let image = content.match(/<enclosure[\s\S]*?url=["']([\s\S]*?)["']/)?.[1] || 
                content.match(/<media:content[\s\S]*?url=["']([\s\S]*?)["']/)?.[1] ||
                content.match(/<img[\s\S]*?src=["']([\s\S]*?)["']/)?.[1];

    if (!image && description.includes('<img')) {
      image = description.match(/<img[\s\S]*?src=["']([\s\S]*?)["']/)?.[1];
    }

    if (title && link) {
      // Create a deterministic slug from the link (URL-safe)
      const slug = link.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0).toString(16) + 
                   Buffer.from(link).toString('hex').substring(0, 8);

      items.push({
        id,
        slug,
        title: title.substring(0, 150),
        description: description
          .replace(/<[^>]*>?/gm, '')
          .replace(/&amp;nbsp;/g, ' ')
          .replace(/&nbsp;/g, ' ')
          .replace(/&amp;quot;/g, '"')
          .replace(/&quot;/g, '"')
          .replace(/&amp;amp;/g, '&')
          .replace(/&amp;/g, '&')
          .trim()
          .substring(0, 400) + '...',
        link,
        pubDate: finalPubDate,
        source,
        category,
        language,
        image: image || smartImage || CATEGORY_IMAGES[source] || 'https://images.unsplash.com/photo-1495020689067-958852a7765e?q=80&w=800&auto=format&fit=crop',
      });
    }
  }

  return items;
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const lang = (searchParams.get('lang') || 'en') as 'en' | 'ar';
  const slug = searchParams.get('slug');
  const cacheKey = `news_unified_${lang}`;

  try {
    // 1. Try to fetch from Redis Cache
    const cachedData = await redis.get(cacheKey) as NewsItem[] | null;
    
    if (cachedData) {
      if (slug) {
        const item = cachedData.find(n => n.slug === slug);
        if (item) {
          return NextResponse.json({ status: 'success', news: [item] });
        }
      } else {
        return NextResponse.json({
          status: 'success',
          count: cachedData.length,
          news: cachedData,
          source: 'cache'
        });
      }
    }

    // 2. If not in cache, fetch fresh from RSS
    const gccResults = await Promise.allSettled(
      Object.entries(GCC_FEEDS).map(async ([key, urls]) => {
        try {
          const url = urls[lang as keyof typeof urls];
          console.log(`Fetching GCC news from ${key}: ${url}`);
          const controller = new AbortController();
          const timeoutId = setTimeout(() => controller.abort(), 5000);
          
          const res = await fetch(url, { 
            next: { revalidate: 3600 },
            headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36' },
            signal: controller.signal
          });
          clearTimeout(timeoutId);
          
          if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
          const xml = await res.text();
          const parsed = parseRSS(xml, key, 'gcc', lang);
          console.log(`Parsed ${parsed.length} items from ${key}`);
          return parsed;
        } catch (e) {
          console.error(`Error fetching GCC news from ${key}:`, e);
          return [];
        }
      })
    );


    const expatResults = await Promise.allSettled(
      Object.entries(EXPAT_FEEDS).map(async ([key, urls]) => {
        try {
          console.log(`Fetching Expat news for ${key}`);
          const controller = new AbortController();
          const timeoutId = setTimeout(() => controller.abort(), 5000);

          const [enRes, regRes] = await Promise.all([
            fetch(urls.en, { 
              next: { revalidate: 3600 }, 
              headers: { 'User-Agent': 'Mozilla/5.0' },
              signal: controller.signal 
            }),
            fetch(urls.regional, { 
              next: { revalidate: 3600 }, 
              headers: { 'User-Agent': 'Mozilla/5.0' },
              signal: controller.signal
            })
          ]);
          clearTimeout(timeoutId);
          
          const [enXml, regXml] = await Promise.all([
            enRes.ok ? enRes.text() : Promise.resolve(''),
            regRes.ok ? regRes.text() : Promise.resolve('')
          ]);
          
          const enItems = enXml ? parseRSS(enXml, key, 'expat', 'en') : [];
          const regItems = regXml ? parseRSS(regXml, key, 'expat', 'regional') : [];
          
          console.log(`Parsed ${enItems.length} EN and ${regItems.length} REG items for ${key}`);
          return [...enItems.slice(0, 5), ...regItems.slice(0, 5)];
        } catch (e) {
          console.error(`Error fetching Expat news for ${key}:`, e);
          return [];
        }
      })
    );


    const allNews = [
      ...gccResults.filter((r): r is PromiseFulfilledResult<NewsItem[]> => r.status === 'fulfilled').flatMap(r => r.value),
      ...expatResults.filter((r): r is PromiseFulfilledResult<NewsItem[]> => r.status === 'fulfilled').flatMap(r => r.value)
    ].sort((a, b) => {
      const dateA = new Date(a.pubDate).getTime();
      const dateB = new Date(b.pubDate).getTime();
      return (isNaN(dateB) ? 0 : dateB) - (isNaN(dateA) ? 0 : dateA);
    });

    console.log(`Total news items collected: ${allNews.length}`);

    // 3. Save to Redis Cache (Transient storage)
    if (allNews.length > 0) {
      try {
        await redis.set(cacheKey, allNews, { ex: CACHE_TIMES.NEWS });
      } catch (redisError) {
        console.error('Redis cache set error:', redisError);
      }
    }

    return NextResponse.json({
      status: 'success',
      count: allNews.length,
      news: allNews,
      source: 'fresh'
    });
  } catch (error) {
    console.error('Unified news fetch error:', error);
    return NextResponse.json({ 
      status: 'error', 
      message: error instanceof Error ? error.message : 'Failed to fetch news',
      news: [] 
    }, { status: 500 });
  }

}
