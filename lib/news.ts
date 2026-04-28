import { redis } from './redis';

export interface NewsItem {
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
  isPremium?: boolean;
}

/**
 * Hardcoded Premium Articles
 * These are high-quality, long-form pieces that are injected into the news feed.
 */
export const PREMIUM_ARTICLES: Record<string, NewsItem[]> = {
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
    },
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

/**
 * Get news from the Redis archive.
 */
export async function getNewsFromArchive(lang: 'en' | 'ar'): Promise<NewsItem[]> {
  const archiveKey = `news_archive_${lang}`;
  const data = await redis.get(archiveKey);
  return (data as NewsItem[]) || [];
}

/**
 * Get a specific article by its slug.
 */
export async function getArticleBySlug(slug: string, lang: 'en' | 'ar'): Promise<NewsItem | null> {
  // Check premium articles first
  const premium = (PREMIUM_ARTICLES[lang] || []).find(p => p.slug === slug);
  if (premium) return { ...premium, isPremium: true };

  const allNews = await getNewsFromArchive(lang);
  let article = allNews.find(item => item.slug === slug);
  
  if (!article) {
    const otherLang = lang === 'en' ? 'ar' : 'en';
    // Fallback to other language
    const premiumOther = (PREMIUM_ARTICLES[otherLang] || []).find(p => p.slug === slug);
    if (premiumOther) return { ...premiumOther, isPremium: true };

    const otherNews = await getNewsFromArchive(otherLang);
    article = otherNews.find(item => item.slug === slug);
  }
  
  return article || null;
}

/**
 * Get all news slugs for the sitemap.
 */
export async function getAllNewsSlugs(): Promise<{ slug: string, lang: 'en' | 'ar', pubDate: string }[]> {
  const [enNews, arNews] = await Promise.all([
    getNewsFromArchive('en'),
    getNewsFromArchive('ar')
  ]);
  
  const enSlugs = enNews.map(n => ({ slug: n.slug, lang: 'en' as const, pubDate: n.pubDate }));
  const arSlugs = arNews.map(n => ({ slug: n.slug, lang: 'ar' as const, pubDate: n.pubDate }));
  
  // Add premium slugs
  const premiumEn = (PREMIUM_ARTICLES.en || []).map(n => ({ slug: n.slug, lang: 'en' as const, pubDate: n.pubDate }));
  const premiumAr = (PREMIUM_ARTICLES.ar || []).map(n => ({ slug: n.slug, lang: 'ar' as const, pubDate: n.pubDate }));

  return [...premiumEn, ...enSlugs, ...premiumAr, ...arSlugs];
}

/**
 * Get unified news with premium items interleaved.
 */
export async function getUnifiedNews(options: { 
  lang: 'en' | 'ar', 
  category?: string | null,
  limit?: number 
}): Promise<NewsItem[]> {
  const { lang, category, limit = 100 } = options;
  const allNews = await getNewsFromArchive(lang);
  const premiumItems = (PREMIUM_ARTICLES[lang] || []).map(item => ({ ...item, isPremium: true }));

  let filteredNews = allNews;
  if (category) {
    filteredNews = allNews.filter(n => {
      const text = (n.title + (n.description || "")).toLowerCase();
      return n.tags?.includes(category.toLowerCase()) || text.includes(category.toLowerCase());
    });
  }

  const finalNews: NewsItem[] = [];
  let premiumIdx = 0;

  for (let i = 0; i < filteredNews.length; i++) {
    if (i > 0 && i % 5 === 0 && premiumItems.length > 0) {
      finalNews.push(premiumItems[premiumIdx % premiumItems.length]);
      premiumIdx++;
    }
    finalNews.push(filteredNews[i]);
  }

  if (finalNews.length === 0 && premiumItems.length > 0) {
    return premiumItems.slice(0, limit);
  }

  return finalNews.slice(0, limit);
}
