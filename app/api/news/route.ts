import { NextResponse } from 'next/server';
import { redis, CACHE_TIMES } from '@/lib/redis';
import { XMLParser } from 'fast-xml-parser';
import { toSlug } from '@/lib/utils';
import { getUnifiedNews, getArticleBySlug, NewsItem } from '@/lib/news';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

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
  lifestyle: 'https://images.unsplash.com/photo-1483985988355-763728e1935b?q=80&w=800&auto=format&fit=crop',
  entertainment: 'https://images.unsplash.com/photo-1603190287605-e6ade32fa852?q=80&w=800&auto=format&fit=crop',
};

const GCC_FEEDS = {
  QNA: { en: 'https://qna.org.qa/en/Pages/RSS-Feeds/General', ar: 'https://qna.org.qa/ar/Pages/RSS-Feeds/General' },
  WAM: { en: 'https://www.wam.ae/en/rss/general', ar: 'https://www.wam.ae/ar/rss/general' },
  SPA: { en: 'https://www.spa.gov.sa/en/rss/general', ar: 'https://www.spa.gov.sa/ar/rss/general' },
  BNA: { en: 'https://www.bna.bh/en/GenerateRssFeed.aspx?categoryId=153', ar: 'https://www.bna.bh/GenerateRssFeed.aspx?categoryId=153' },
  ONA: { en: 'https://omannews.gov.om/rss.ona', ar: 'https://omannews.gov.om/rss.ona' }
};

const EXPAT_FEEDS = {
  INDIA: { en: 'https://www.aninews.in/rss/feed/category/national.xml', regional: 'https://www.amarujala.com/rss/india-news.xml' },
  PAKISTAN: { en: 'https://www.app.com.pk/feed/', regional: 'http://feeds.bbci.co.uk/urdu/rss.xml' },
  BANGLADESH: { en: 'https://www.thedailystar.net/rss.xml', regional: 'https://www.prothomalo.com/feed/' },
  PHILIPPINES: { en: 'https://www.pna.gov.ph/rss/national.xml', regional: 'https://news.abs-cbn.com/feed' }
};

const parser = new XMLParser({
  ignoreAttributes: false,
  attributeNamePrefix: "@_",
  textNodeName: "#text"
});

function parseRSS(xml: string, source: string, category: 'gcc' | 'expat', language: 'en' | 'ar' | 'regional'): NewsItem[] {
  try {
    const jsonObj = parser.parse(xml);
    const channel = jsonObj.rss?.channel;
    if (!channel) return [];

    let rawItems = channel.item;
    if (!rawItems) return [];
    if (!Array.isArray(rawItems)) rawItems = [rawItems];

    return rawItems.map((item: any) => {
      const title = (typeof item.title === 'string' ? item.title : item.title?.['#text'] || '').trim();
      const description = (typeof item.description === 'string' ? item.description : item.description?.['#text'] || '').trim();
      const link = (typeof item.link === 'string' ? item.link : item.link?.['#text'] || '').trim();
      const pubDateRaw = (typeof item.pubDate === 'string' ? item.pubDate : item.pubDate?.['#text'] || '').trim();
      
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
      const slug = toSlug(title, link);
      const lowerTitle = title.toLowerCase();
      let smartImage = null;
      if (lowerTitle.includes('gold')) smartImage = SMART_KEYWORDS.gold;
      else if (lowerTitle.includes('oil')) smartImage = SMART_KEYWORDS.oil;
      else if (lowerTitle.includes('tech')) smartImage = SMART_KEYWORDS.tech;

      let image = item.enclosure?.['@_url'] || 
                  item['media:content']?.['@_url'] || 
                  item['media:thumbnail']?.['@_url'];

      if (!image && description.includes('<img')) {
        const imgMatch = description.match(/<img[\s\S]*?src=["']([\s\S]*?)["']/);
        image = imgMatch?.[1];
      }

      return {
        id: item.guid?.['#text'] || item.guid || link,
        slug,
        title: title.substring(0, 150),
        description: description.replace(/<[^>]*>?/gm, '').replace(/&amp;nbsp;/g, ' ').trim().substring(0, 400),
        link,
        pubDate: finalPubDate,
        source,
        category,
        language,
        image: image || smartImage, // Fallback handled in news details
      };
    }).filter((item: any) => item.title && item.link);
  } catch (e) { return []; }
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const lang = (searchParams.get('lang') || 'en') as 'en' | 'ar';
  const slug = searchParams.get('slug');
  const category = searchParams.get('category');
  const limit = parseInt(searchParams.get('limit') || '100');
  const cacheKey = `news_unified_${lang}`;

  try {
    // If slug is provided, return that article directly
    if (slug) {
      const article = await getArticleBySlug(slug, lang);
      return article 
        ? NextResponse.json({ status: 'success', news: [article] }) 
        : NextResponse.json({ status: 'error', message: 'Not found' }, { status: 404 });
    }

    const isStale = !(await redis.get(cacheKey));
    const archiveKey = `news_archive_${lang}`;
    let allNews = (await redis.get(archiveKey) as NewsItem[] | null) || [];
    
    // Background refresh logic
    if (isStale || allNews.length === 0) {
      const fetchWithTimeout = async (url: string) => {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 5000);
        try {
          const res = await fetch(url, { 
            next: { revalidate: 3600 },
            headers: { 'User-Agent': 'Mozilla/5.0' },
            signal: controller.signal
          });
          return await res.text();
        } finally {
          clearTimeout(timeoutId);
        }
      };

      const gccResults = await Promise.allSettled(Object.entries(GCC_FEEDS).map(async ([key, urls]) => {
        const url = urls[lang as keyof typeof urls];
        const xml = await fetchWithTimeout(url);
        return parseRSS(xml, key, 'gcc', lang);
      }));

      const expatResults = await Promise.allSettled(Object.entries(EXPAT_FEEDS).map(async ([key, urls]) => {
        const xmlEn = await fetchWithTimeout(urls.en);
        const xmlReg = await fetchWithTimeout(urls.regional);
        return [...parseRSS(xmlEn, key, 'expat', 'en'), ...parseRSS(xmlReg, key, 'expat', 'regional')];
      }));

      const freshNews = [
        ...gccResults.filter((r): r is PromiseFulfilledResult<NewsItem[]> => r.status === 'fulfilled').flatMap(r => r.value),
        ...expatResults.filter((r): r is PromiseFulfilledResult<NewsItem[]> => r.status === 'fulfilled').flatMap(r => r.value)
      ];

      if (freshNews.length > 0) {
        const mergedMap = new Map<string, NewsItem>();
        allNews.forEach(item => mergedMap.set(item.slug, item));
        freshNews.forEach(item => mergedMap.set(item.slug, item));
        allNews = Array.from(mergedMap.values()).sort((a, b) => new Date(b.pubDate).getTime() - new Date(a.pubDate).getTime()).slice(0, 3000);
        await redis.set(archiveKey, allNews, { ex: CACHE_TIMES.NEWS_ARCHIVE });
        await redis.set(cacheKey, 'true', { ex: CACHE_TIMES.NEWS });
      }
    }

    const finalNews = await getUnifiedNews({ lang, category, limit });
    return NextResponse.json({ status: 'success', count: finalNews.length, news: finalNews });
  } catch (error) {
    console.error('API Error:', error);
    return NextResponse.json({ status: 'error', news: [] }, { status: 500 });
  }
}
