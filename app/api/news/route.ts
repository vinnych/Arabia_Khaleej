import { NextResponse } from 'next/server';
import { redis, CACHE_TIMES } from '@/lib/redis';
import { getDeterministicFallback } from '@/lib/fallbacks';
import { toSlug } from '@/lib/utils';
import { XMLParser } from 'fast-xml-parser';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

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
  tags?: string[];
}

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

const PREMIUM_ARTICLES: Record<string, NewsItem[]> = {
  en: [
    {
      id: "prem-1",
      slug: "cinema-excellence-women",
      title: "The Art of Performance: Leading Movie Actresses of the GCC",
      description: "A refined look at the iconic movie actresses shaping the regional film industry with grace and artistic depth.",
      link: "/news/cinema-excellence-women",
      pubDate: new Date().toISOString(),
      source: "Arabia Khaleej Premium",
      category: "gcc",
      language: "en",
      image: "https://images.unsplash.com/photo-1543128939-6dd65562713a?q=80&w=800&auto=format&fit=crop",
      tags: ["entertainment", "women", "cinema", "lifestyle"]
    },
    {
      id: "prem-8",
      slug: "female-leadership-tech",
      title: "Visionary Minds: Female Tech Leaders Redefining the Gulf",
      description: "Celebrating the women at the forefront of the GCC's technological revolution, from AI to sustainable energy.",
      link: "/news/female-leadership-tech",
      pubDate: new Date().toISOString(),
      source: "Arabia Khaleej Tech",
      category: "gcc",
      language: "en",
      image: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=800&auto=format&fit=crop",
      tags: ["tech", "women", "leadership"]
    },
    {
      id: "prem-5",
      slug: "elegant-horology-dubai",
      title: "The Art of Elegance: High Horology in Dubai",
      description: "A look into the exclusive world of luxury watchmaking and the growing community of female collectors in the Gulf.",
      link: "/news/elegant-horology-dubai",
      pubDate: new Date().toISOString(),
      source: "Arabia Khaleej Lifestyle",
      category: "gcc",
      language: "en",
      image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?q=80&w=800&auto=format&fit=crop",
      tags: ["lifestyle", "entertainment", "women"]
    },
    {
      id: "prem-9",
      slug: "desert-blooms-art",
      title: "Desert Blooms: The New Wave of Female Artists in the UAE",
      description: "Exploring the vibrant contemporary art scene through the eyes of emerging Emirati female painters and sculptors.",
      link: "/news/desert-blooms-art",
      pubDate: new Date().toISOString(),
      source: "Arabia Khaleej Arts",
      category: "gcc",
      language: "en",
      image: "https://images.unsplash.com/photo-1460661419201-fd4ce18a8024?q=80&w=800&auto=format&fit=crop",
      tags: ["lifestyle", "women", "arts"]
    },
    {
      id: "prem-6",
      slug: "haute-couture-riyadh",
      title: "Modern Majesty: The Rise of Haute Couture in Riyadh",
      description: "How Saudi designers are redefining global fashion standards through cultural heritage and contemporary vision.",
      link: "/news/haute-couture-riyadh",
      pubDate: new Date().toISOString(),
      source: "Arabia Khaleej Fashion",
      category: "gcc",
      language: "en",
      image: "https://images.unsplash.com/photo-1539109136881-3be0616acf4b?q=80&w=800&auto=format&fit=crop",
      tags: ["lifestyle", "women", "fashion"]
    },
    {
      id: "prem-7",
      slug: "film-festival-stars",
      title: "Red Carpet Brilliance: GCC Stars at International Film Festivals",
      description: "Celebrating the regional talent making waves on the global stage, from Cannes to Venice.",
      link: "/news/film-festival-stars",
      pubDate: new Date().toISOString(),
      source: "Arabia Khaleej Cinema",
      category: "gcc",
      language: "en",
      image: "https://images.unsplash.com/photo-1485846234645-a62644f84728?q=80&w=800&auto=format&fit=crop",
      tags: ["entertainment", "women", "cinema"]
    },
    {
      id: "prem-2",
      slug: "sustainable-luxury",
      title: "Sustainable Luxury: The New Era of Tourism",
      description: "Exploration of high-end eco-tourism projects across the Red Sea and beyond.",
      link: "/news/sustainable-luxury",
      pubDate: new Date().toISOString(),
      source: "Arabia Khaleej Premium",
      category: "gcc",
      language: "en",
      image: "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?q=80&w=800&auto=format&fit=crop",
      tags: ["entertainment", "lifestyle", "tourism"]
    }
,
    {
      id: "prem-3",
      slug: "defense-diplomacy",
      title: "Strategic Vision: GCC Defense Diplomacy 2026",
      description: "Analysis of the new security frameworks strengthening regional cooperation.",
      link: "/news/defense-diplomacy",
      pubDate: new Date().toISOString(),
      source: "Arabia Khaleej Premium",
      category: "gcc",
      language: "en",
      image: "https://images.unsplash.com/photo-1521791136366-3e9964f62d4b?q=80&w=800&auto=format&fit=crop",
      tags: ["politics", "diplomacy"]
    },
    {
      id: "prem-4",
      slug: "future-sports",
      title: "Future of Sports: GCC Stadiums as Tech Hubs",
      description: "How next-gen arenas are integrating AI to enhance fan experience and athletic performance.",
      link: "/news/future-sports",
      pubDate: new Date().toISOString(),
      source: "Arabia Khaleej Premium",
      category: "gcc",
      language: "en",
      image: "https://images.unsplash.com/photo-1508098682722-e99c43a406b2?q=80&w=800&auto=format&fit=crop",
      tags: ["sports", "tech", "entertainment"]
    }
  ],
  ar: [
    {
      id: "prem-1-ar",
      slug: "cinema-excellence-women",
      title: "فن الأداء: أبرز ممثلات السينما في دول الخليج",
      description: "نظرة راقية على ممثلات السينما اللواتي يشكلن صناعة الأفلام الإقليمية بالنعمة والعمق الفني.",
      link: "/news/cinema-excellence-women",
      pubDate: new Date().toISOString(),
      source: "عربية خليج بريميوم",
      category: "gcc",
      language: "ar",
      image: "https://images.unsplash.com/photo-1543128939-6dd65562713a?q=80&w=800&auto=format&fit=crop",
      tags: ["entertainment", "women", "cinema", "lifestyle"]
    },
    {
      id: "prem-8-ar",
      slug: "female-leadership-tech",
      title: "عقول مبدعة: قائدات التكنولوجيا يعيدن تعريف الخليج",
      description: "الاحتفاء بالنساء اللواتي يتصدرن الثورة التكنولوجية في دول مجلس التعاون الخليجي، من الذكاء الاصطناعي إلى الطاقة المستدامة.",
      link: "/news/female-leadership-tech",
      pubDate: new Date().toISOString(),
      source: "عربية خليج تكنولوجيا",
      category: "gcc",
      language: "ar",
      image: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=800&auto=format&fit=crop",
      tags: ["tech", "women", "leadership"]
    },
    {
      id: "prem-5-ar",
      slug: "elegant-horology-dubai",
      title: "فن الأناقة: الساعات الراقية في دبي",
      description: "نظرة على العالم الحصري لصناعة الساعات الفاخرة والمجتمع المتنامي للمقتنيات في الخليج.",
      link: "/news/elegant-horology-dubai",
      pubDate: new Date().toISOString(),
      source: "عربية خليج لايف ستايل",
      category: "gcc",
      language: "ar",
      image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?q=80&w=800&auto=format&fit=crop",
      tags: ["lifestyle", "entertainment", "women"]
    },
    {
      id: "prem-9-ar",
      slug: "desert-blooms-art",
      title: "زهور الصحراء: الموجة الجديدة من الفنانات في الإمارات",
      description: "استكشاف مشهد الفن المعاصر النابض بالحياة من خلال عيون الرسامين والنحاتين الإماراتيين الصاعدين.",
      link: "/news/desert-blooms-art",
      pubDate: new Date().toISOString(),
      source: "عربية خليج للفنون",
      category: "gcc",
      language: "ar",
      image: "https://images.unsplash.com/photo-1460661419201-fd4ce18a8024?q=80&w=800&auto=format&fit=crop",
      tags: ["lifestyle", "women", "arts"]
    },
    {
      id: "prem-6-ar",
      slug: "haute-couture-riyadh",
      title: "فخامة عصرية: صعود الأزياء الراقية في الرياض",
      description: "كيف يعيد المصممون السعوديون تعريف معايير الموضة العالمية من خلال التراث الثقافي والرؤية المعاصرة.",
      link: "/news/haute-couture-riyadh",
      pubDate: new Date().toISOString(),
      source: "عربية خليج للموضة",
      category: "gcc",
      language: "ar",
      image: "https://images.unsplash.com/photo-1539109136881-3be0616acf4b?q=80&w=800&auto=format&fit=crop",
      tags: ["lifestyle", "women", "fashion"]
    },
    {
      id: "prem-7-ar",
      slug: "film-festival-stars",
      title: "تألق السجادة الحمراء: نجوم الخليج في مهرجانات السينما الدولية",
      description: "الاحتفاء بالمواهب الإقليمية التي تحقق نجاحات على الساحة العالمية، من كان إلى البندقية.",
      link: "/news/film-festival-stars",
      pubDate: new Date().toISOString(),
      source: "عربية خليج للسينما",
      category: "gcc",
      language: "ar",
      image: "https://images.unsplash.com/photo-1485846234645-a62644f84728?q=80&w=800&auto=format&fit=crop",
      tags: ["entertainment", "women", "cinema"]
    },
    {
      id: "prem-2-ar",
      slug: "sustainable-luxury",
      title: "الفخامة المستدامة: العصر الجديد للسياحة",
      description: "استكشاف مشاريع السياحة البيئية الراقية عبر البحر الأحمر وما وراءه.",
      link: "/news/sustainable-luxury",
      pubDate: new Date().toISOString(),
      source: "عربية خليج بريميوم",
      category: "gcc",
      language: "ar",
      image: "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?q=80&w=800&auto=format&fit=crop",
      tags: ["entertainment", "lifestyle", "tourism"]
    }
  ]
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
        image: image || smartImage || getDeterministicFallback(slug),
      };
    }).filter((item: any) => item.title && item.link);
  } catch (e) { return []; }
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const lang = (searchParams.get('lang') || 'en') as 'en' | 'ar';
  const slug = searchParams.get('slug');
  const category = searchParams.get('category');
  const cacheKey = `news_unified_${lang}`;

  try {
    const isStale = !(await redis.get(cacheKey));
    const archiveKey = `news_archive_${lang}`;
    let allNews = (await redis.get(archiveKey) as NewsItem[] | null) || [];
    
    if (isStale || allNews.length === 0) {
      const fetchWithTimeout = async (url: string) => {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 5000);
        try {
          const res = await fetch(url, { 
            next: { revalidate: 3600 },
            headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36' },
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
        await redis.set(archiveKey, allNews, { ex: 2592000 });
        await redis.set(cacheKey, 'true', { ex: CACHE_TIMES.NEWS });
      }
    }

    const premiumItems = (PREMIUM_ARTICLES[lang] || []).map(item => ({ ...item, isPremium: true }));
    let finalNews: NewsItem[] = [];
    
    // Naturally inject premium items every 6th position
    if (slug) {
      const allMerged = [...premiumItems, ...allNews];
      const item = allMerged.find(n => n.slug === slug);
      return item ? NextResponse.json({ status: 'success', news: [item] }) : NextResponse.json({ status: 'error' }, { status: 404 });
    }

    let filteredNews = allNews;
    if (category) {
      filteredNews = allNews.filter(n => {
        const text = (n.title + (n.description || "")).toLowerCase();
        return n.tags?.includes(category.toLowerCase()) || text.includes(category.toLowerCase());
      });
    }

    // Interleave premium content
    let premiumIdx = 0;
    for (let i = 0; i < filteredNews.length; i++) {
      if (i > 0 && i % 5 === 0 && premiumItems.length > 0) {
        // Cycle through premium items if we run out
        finalNews.push(premiumItems[premiumIdx % premiumItems.length]);
        premiumIdx++;
      }
      finalNews.push(filteredNews[i]);
    }

    // If no filtered news but have premium, show premium
    if (finalNews.length === 0 && premiumItems.length > 0) {
      finalNews = premiumItems;
    }

    return NextResponse.json({ status: 'success', count: finalNews.length, news: finalNews.slice(0, 100) });
  } catch (error) {
    return NextResponse.json({ status: 'error', news: [] }, { status: 500 });
  }
}
