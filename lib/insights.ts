import { redis } from './redis';

export interface InsightItem {
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
  content?: string;
}

/**
 * Hardcoded Base Articles
 */
export const PREMIUM_ARTICLES: Record<string, InsightItem[]> = {
  en: [
    {
      id: "prem-1",
      slug: "cinema-excellence-women",
      title: "The Art of Performance: Leading Movie Actresses of the GCC",
      description: "A refined look at the iconic movie actresses shaping the regional film industry with grace and artistic depth.",
      link: "/insights/cinema-excellence-women",
      pubDate: "2026-04-30T10:00:00Z",
      source: "Arabia Khaleej Premium",
      category: "gcc",
      language: "en",
      image: "/images/insights/cinema-actress.png",
      tags: ["entertainment", "women", "cinema", "lifestyle"],
      content: `# The Art of Performance: Leading Movie Actresses of the GCC\n\n[... content truncated for brevity ...]`
    },
    {
      id: "prem-2",
      slug: "saudi-vision-2030-neom",
      title: "The Line: Redefining Urban Living in the Heart of Tabuk",
      description: "How Saudi Arabia's $500 billion mega-city NEOM is setting a new global standard for sustainable urbanism and cognitive technology.",
      link: "/insights/saudi-vision-2030-neom",
      pubDate: "2026-04-29T14:30:00Z",
      source: "Arabia Khaleej Premium",
      category: "gcc",
      language: "en",
      image: "/images/insights/neom.png",
      tags: ["economy", "vision2030", "technology", "sustainability"],
      content: `# The Line: Redefining Urban Living\n\nNEOM is not just a city; it is a blueprint for how people and planet can coexist in harmony. At its heart lies 'The Line' — a 170km long cognitive city that operates on 100% renewable energy and preserves 95% of the surrounding nature...`
    },
    {
      id: "prem-3",
      slug: "uae-mars-mission-legacy",
      title: "Beyond the Horizon: The UAE's Journey to the Red Planet",
      description: "Celebrating the success of the Hope Probe and the Emirates Mars Mission as it continues to provide groundbreaking data to the global scientific community.",
      link: "/insights/uae-mars-mission-legacy",
      pubDate: "2026-04-28T09:00:00Z",
      source: "Arabia Khaleej Premium",
      category: "gcc",
      language: "en",
      image: "/images/insights/uae-mars.png",
      tags: ["technology", "space", "innovation"],
      content: `# Beyond the Horizon: The Emirates Mars Mission\n\nThe Hope Probe has been orbiting Mars since early 2021, providing the first complete picture of the Martian atmosphere. This mission marks a historic milestone for the Arab world, proving that ambition and scientific excellence know no boundaries...`
    },
    {
      id: "prem-4",
      slug: "qatar-sports-legacy-hub",
      title: "The Sports Capital: Qatar's Evolution Post-2022",
      description: "Exploring how Qatar has leveraged its World Cup infrastructure to become the world's premier destination for high-performance training and international athletics.",
      link: "/insights/qatar-sports-legacy-hub",
      pubDate: "2026-04-27T11:20:00Z",
      source: "Arabia Khaleej Premium",
      category: "gcc",
      language: "en",
      image: "/images/insights/qatar-sports.png",
      tags: ["sports", "legacy", "tourism"],
      content: `# The Sports Capital: Qatar's Legacy\n\nFollowing the success of the FIFA World Cup 2022, Qatar has transformed its state-of-the-art stadiums and facilities into a sustainable sports ecosystem. From Aspire Zone to the Lusail Circuit, the nation is now a global hub for sports diplomacy...`
    },
  ],
  ar: [
    {
      id: "prem-1-ar",
      slug: "cinema-excellence-women",
      title: "فن الأداء: أبرز ممثلات السينما في دول الخليج",
      description: "نظرة راقية على ممثلات السينما اللواتي يشكلن صناعة الأفلام الإقليمية بالنعمة والعمق الفني.",
      link: "/insights/cinema-excellence-women",
      pubDate: "2026-04-30T10:00:00Z",
      source: "عربية خليج بريميوم",
      category: "gcc",
      language: "ar",
      image: "/images/insights/cinema-actress.png",
      tags: ["entertainment", "women", "cinema", "lifestyle"],
      content: `# فن الأداء: أبرز ممثلات السينما في دول مجلس التعاون الخليجي\n\n[... content truncated ...]`
    },
    {
      id: "prem-2-ar",
      slug: "saudi-vision-2030-neom",
      title: "ذا لاين: إعادة تعريف الحياة الحضرية في قلب تبوك",
      description: "كيف تضع مدينة نيوم العملاقة بقيمة 500 مليار دولار معياراً عالمياً جديداً للتحضر المستدام والتكنولوجيا الإدراكية.",
      link: "/insights/saudi-vision-2030-neom",
      pubDate: "2026-04-29T14:30:00Z",
      source: "عربية خليج بريميوم",
      category: "gcc",
      language: "ar",
      image: "/images/insights/neom.png",
      tags: ["economy", "vision2030", "technology", "sustainability"],
      content: `# ذا لاين: إعادة تعريف الحياة الحضرية\n\nنيوم ليست مجرد مدينة؛ إنها مخطط لكيفية تعايش الناس والكوكب في وئام. في قلبها يكمن 'ذا لاين' — وهي مدينة إدراكية بطول 170 كم تعمل بطاقة متجددة بنسبة 100٪...`
    },
    {
      id: "prem-3-ar",
      slug: "uae-mars-mission-legacy",
      title: "ما وراء الأفق: رحلة الإمارات إلى الكوكب الأحمر",
      description: "الاحتفاء بنجاح مسبار الأمل ومهمة الإمارات لاستكشاف المريخ وهي تواصل تقديم بيانات رائدة للمجتمع العلمي العالمي.",
      link: "/insights/uae-mars-mission-legacy",
      pubDate: "2026-04-28T09:00:00Z",
      source: "عربية خليج بريميوم",
      category: "gcc",
      language: "ar",
      image: "/images/insights/uae-mars.png",
      tags: ["technology", "space", "innovation"],
      content: `# ما وراء الأفق: مهمة الإمارات لاستكشاف المريخ\n\nيدور مسبار الأمل حول المريخ منذ أوائل عام 2021، حيث يقدم أول صورة كاملة للغلاف الجوي للمريخ. تمثل هذه المهمة علامة تاريخية للعالم العربي...`
    },
    {
      id: "prem-4-ar",
      slug: "qatar-sports-legacy-hub",
      title: "عاصمة الرياضة: تطور قطر ما بعد 2022",
      description: "استكشاف كيف استفادت قطر من البنية التحتية لكأس العالم لتصبح الوجهة الأولى في العالم للتدريب عالي الأداء وألعاب القوى الدولية.",
      link: "/insights/qatar-sports-legacy-hub",
      pubDate: "2026-04-27T11:20:00Z",
      source: "عربية خليج بريميوم",
      category: "gcc",
      language: "ar",
      image: "/images/insights/qatar-sports.png",
      tags: ["sports", "legacy", "tourism"],
      content: `# عاصمة الرياضة: إرث قطر\n\nبعد نجاح كأس العالم فيفا 2022، حولت قطر ملاعبها ومنشآتها المتطورة إلى نظام رياضي مستدام. من منطقة أسباير إلى حلبة لوسيل، أصبحت الدولة الآن مركزاً عالمياً للدبلوماسية الرياضية...`
    },
  ]
};

/**
 * Unified fetcher that merges hardcoded and Redis-stored dynamic insights.
 */
export async function getUnifiedInsights(options: { 
  lang: 'en' | 'ar', 
  category?: string | null,
  limit?: number 
}): Promise<InsightItem[]> {
  const { lang, category, limit = 100 } = options;
  
  // 1. Get hardcoded base
  const baseItems = PREMIUM_ARTICLES[lang] || [];
  
  // 2. Get dynamic archive from Redis
  let dynamicItems: InsightItem[] = [];
  try {
    const archiveKey = `insights_archive_${lang}`;
    const stored = await redis.get(archiveKey) as InsightItem[] | null;
    if (stored && Array.isArray(stored)) {
      dynamicItems = stored;
    }
  } catch (e) {
    console.error("Failed to fetch dynamic insights from Redis:", e);
  }

  // 3. Merge, Deduplicate and Sort
  // Use a Map for O(N) deduplication by slug
  const allMap = new Map<string, InsightItem>();
  
  // Add base items first (so they can be overwritten by newer dynamic items if slug matches)
  baseItems.forEach(item => allMap.set(item.slug, item));
  // Add dynamic items (overwrite base if slug matches, assuming dynamic is newer)
  dynamicItems.forEach(item => allMap.set(item.slug, item));

  let allItems = Array.from(allMap.values());

  // Sort by date descending
  allItems.sort((a, b) => new Date(b.pubDate).getTime() - new Date(a.pubDate).getTime());

  // 4. Filter by category if needed
  if (category) {
    const catLower = category.toLowerCase();
    allItems = allItems.filter(n => {
      return n.tags?.some(t => t.toLowerCase() === catLower) || 
             n.title.toLowerCase().includes(catLower) || 
             (n.description || "").toLowerCase().includes(catLower);
    });
  }

  return allItems.slice(0, limit);
}

export async function getArticleBySlug(slug: string, lang: 'en' | 'ar'): Promise<InsightItem | null> {
  const allInsights = await getUnifiedInsights({ lang, limit: 1000 });
  const article = allInsights.find(p => p.slug === slug);
  if (article) return article;

  // Check other language as fallback
  const otherLang = lang === 'en' ? 'ar' : 'en';
  const allOther = await getUnifiedInsights({ lang: otherLang, limit: 1000 });
  return allOther.find(p => p.slug === slug) || null;
}

export async function getAllInsightSlugs(): Promise<{ slug: string, lang: 'en' | 'ar', pubDate: string }[]> {
  const enItems = await getUnifiedInsights({ lang: 'en', limit: 1000 });
  const arItems = await getUnifiedInsights({ lang: 'ar', limit: 1000 });

  const enSlugs = enItems.map(n => ({ slug: n.slug, lang: 'en' as const, pubDate: n.pubDate }));
  const arSlugs = arItems.map(n => ({ slug: n.slug, lang: 'ar' as const, pubDate: n.pubDate }));

  return [...enSlugs, ...arSlugs];
}
