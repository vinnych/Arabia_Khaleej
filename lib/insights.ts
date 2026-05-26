/**
 * Arabia Khaleej — Insights Data Access Layer
 * Provides read access to editorial insight articles stored in Upstash Redis.
 * 
 * WHY use Redis caching: Articles are expensive to generate (LLM calls), so caching
 * avoids regenerating the same content. The 5-minute max-age balances freshness with
 * cost efficiency - users see new articles within a minute of publication.
 */
import { redis, getWithCompression } from './redis';

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
  status?: 'draft' | 'pending' | 'published' | 'rejected' | 'deleted' | 'failed';
  author?: {
    id: string;
    name: string;
    role: string;
  };
  humanEdited?: boolean;
  editedAt?: string;
  qualityScore?: number;
  policyResult?: 'pass' | 'fail' | 'delete';
  policyViolations?: { category: string; reason: string; severity: 'critical' | 'warning' | 'info'; location?: string }[];
  wordCount?: number;
  retryCount?: number;
  maxRetries?: number;
  country?: string;
  topic?: string;
  persistError?: string;
}

export async function getUnifiedInsights(options: {
  lang: 'en' | 'ar';
  category?: string | null;
  limit?: number;
}): Promise<InsightItem[]> {
  const { lang, category, limit = 100 } = options;

  let allItems: InsightItem[] = [];
  try {
    const stored = await getWithCompression<InsightItem[]>(`insights:list:${lang}`);
    if (stored && Array.isArray(stored)) {
      allItems = stored;
    }
  } catch (e) {
    console.error("Failed to fetch insights list from Redis:", e);
  }

  // Exclude drafts and malformed data to prevent fatal UI crashes
  allItems = allItems.filter(item => {
    if (!item || typeof item !== 'object') return false;
    if (item.status === 'draft') return false;
    if (!item.slug || !item.title) return false;
    
    // Strict date validation to prevent `RangeError: Invalid time value` in SSR
    if (!item.pubDate) return false;
    const d = new Date(item.pubDate);
    if (isNaN(d.getTime())) return false;
    
    return true;
  });
  // Deduplicate by slug using Map because the same slug can appear in both
  // the main list and the extended list from different sync cycles
  const allMap = new Map<string, InsightItem>();
  allItems.forEach(item => allMap.set(item.slug, item));
  allItems = Array.from(allMap.values());
  // Sort by pubDate descending for newest-first display
  allItems.sort((a, b) => new Date(b.pubDate).getTime() - new Date(a.pubDate).getTime());

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
  const normalized = slug.toLowerCase();

  try {
    const article = await getWithCompression<InsightItem>(`insights:article:${normalized}`);
    if (article) return article;
  } catch (e) {}

  // Fallback to list search for SEO-friendly URL variations
  // Fuzzy matching handles cases where URL slug was regenerated after publish
  const list = await getUnifiedInsights({ lang, limit: 1000 });
  const fuzzyMatch = list.find(p => {
    const pSlug = p.slug.toLowerCase();
    if (pSlug === normalized) return true;
    // Match base slug for variant URLs (e.g., article-title-2 -> article-title)
    const basePart = normalized.includes('-') ? normalized.split('-').slice(0, -1).join('-') : normalized;
    return pSlug.startsWith(basePart + '-');
  });

  if (fuzzyMatch) {
    try {
      const fullArticle = await getWithCompression<InsightItem>(`insights:article:${fuzzyMatch.slug}`);
      if (fullArticle) return fullArticle;
    } catch (e) {}
    if (fuzzyMatch.content) return fuzzyMatch;
  }

  try {
    const otherArticle = await getWithCompression<InsightItem>(`insights:article:${normalized}`);
    if (otherArticle) return otherArticle;
  } catch (e) {}

  return null;
}

/**
 * Returns all insight slugs for static site generation (ISR).
 * Both languages are fetched because each translation is a separate article
 * with its own URL (e.g., /insights/slug and /insights/slug?lang=ar).
 */
export async function getAllInsightSlugs(): Promise<{ slug: string; lang: 'en' | 'ar'; pubDate: string }[]> {
  const enItems = await getUnifiedInsights({ lang: 'en', limit: 1000 });
  const arItems = await getUnifiedInsights({ lang: 'ar', limit: 1000 });

  const enSlugs = enItems.map(n => ({ slug: n.slug, lang: 'en' as const, pubDate: n.pubDate }));
  const arSlugs = arItems.map(n => ({ slug: n.slug, lang: 'ar' as const, pubDate: n.pubDate }));

  return [...enSlugs, ...arSlugs];
}
