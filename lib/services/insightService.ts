/**
 * Arabia Khaleej — Insights Business Service Layer
 * Coordinates validation, filtering, sorting, and retrieval policies for insights.
 */

import { InsightItem } from '@/lib/types';
import { IInsightRepository, getInsightRepository, normalizeArticle } from '../database/repositories/insightRepository';

/**
 * 2. Interface for Validation (Single Responsibility Principle - SRP & Open/Closed Principle - OCP)
 * Why this particular is used: By decoupling validation into its own interface, we can swap or extend the validation rules
 * (e.g. strict format validation, safety/policy filters) without changing the database access or UI code.
 */
export interface IInsightValidator {
  isValid(item: InsightItem): boolean;
}

/**
 * Standard Validator implementation
 * Why this particular is used: Handles strict date checking and structural validation to prevent fatal UI crashes during SSR.
 */
export class StandardInsightValidator implements IInsightValidator {
  isValid(item: InsightItem): boolean {
    if (!item || typeof item !== 'object') return false;
    if (item.status === 'draft') return false;
    if (!item.slug || !item.title) return false;
    
    // Strict date validation to prevent `RangeError: Invalid time value` in SSR
    if (!item.pubDate) return false;
    const d = new Date(item.pubDate);
    if (isNaN(d.getTime())) return false;
    
    return true;
  }
}

/**
 * 3. Interface for Post-processing Filters (Open/Closed Principle - OCP & Liskov Substitution - LSP)
 * Why this particular is used: Implementing the pipeline pattern where each step implements IInsightProcessor.
 * If we need a new feature (like geotargeting or keyword blacklisting), we just implement a new
 * IInsightProcessor class and add it to the pipeline without modifying existing classes.
 */
export interface IInsightProcessor {
  process(items: InsightItem[]): InsightItem[];
}

/**
 * Deduplicate Processor
 * Why this particular is used: Eliminates duplicate articles by slug arising from separate sync cycles.
 */
export class DeduplicateProcessor implements IInsightProcessor {
  process(items: InsightItem[]): InsightItem[] {
    const allMap = new Map<string, InsightItem>();
    items.forEach(item => allMap.set(item.slug.toLowerCase(), item));
    return Array.from(allMap.values());
  }
}

/**
 * Date Sorter Processor
 * Why this particular is used: Ensures insights are sorted chronologically, newest-first.
 */
export class SortByDateDescendingProcessor implements IInsightProcessor {
  process(items: InsightItem[]): InsightItem[] {
    return [...items].sort((a, b) => new Date(b.pubDate).getTime() - new Date(a.pubDate).getTime());
  }
}

/**
 * Category Filter Processor
 * Why this particular is used: Filters articles by matching the category tag, title, or description.
 */
export class CategoryFilterProcessor implements IInsightProcessor {
  constructor(private category: string | null | undefined) {}
  
  process(items: InsightItem[]): InsightItem[] {
    if (!this.category) return items;
    const catLower = this.category.toLowerCase();
    return items.filter(n => {
      return n.tags?.some(t => t.toLowerCase() === catLower) ||
             n.title.toLowerCase().includes(catLower) ||
             (n.description || "").toLowerCase().includes(catLower);
    });
  }
}

/**
 * 4. Coordinate Service Class (Dependency Inversion Principle - DIP)
 * Why this particular is used: InsightService orchestrates IInsightRepository, IInsightValidator, and IInsightProcessor pipelines.
 * It is completely decoupled from any concrete database implementation, making it extremely robust and unit-testable.
 */
export class InsightService {
  constructor(
    private repository: IInsightRepository,
    private validator: IInsightValidator,
    private processors: IInsightProcessor[] = []
  ) {}

  async getInsights(lang: 'en' | 'ar'): Promise<InsightItem[]> {
    const raw = await this.repository.getRawInsights(lang);
    const validated = raw.filter(item => this.validator.isValid(item));
    
    let processed = validated;
    for (const processor of this.processors) {
      processed = processor.process(processed);
    }
    
    return processed;
  }

  async getArticle(slug: string, lang: 'en' | 'ar'): Promise<InsightItem | null> {
    const normalized = slug.toLowerCase();
    
    // Attempt standard direct fetch
    const article = await this.repository.getRawArticle(normalized);
    if (article) return normalizeArticle(article, lang);

    // Fallback to fuzzy slug search on the list
    const list = await this.getInsights(lang);
    const fuzzyMatch = list.find(p => {
      const pSlug = p.slug.toLowerCase();
      if (pSlug === normalized) return true;
      // Match base slug for variant URLs (e.g., article-title-2 -> article-title)
      const basePart = normalized.includes('-') ? normalized.split('-').slice(0, -1).join('-') : normalized;
      return pSlug === basePart || pSlug.startsWith(basePart + '-');
    });

    if (fuzzyMatch) {
      const fullArticle = await this.repository.getRawArticle(fuzzyMatch.slug);
      if (fullArticle) return normalizeArticle(fullArticle, lang);
      if (fuzzyMatch.content) return normalizeArticle(fuzzyMatch, lang);
    }

    // Secondary fallback check
    const otherArticle = await this.repository.getRawArticle(normalized);
    if (otherArticle) return normalizeArticle(otherArticle, lang);

    return null;
  }
}

// ============================================================================
// Backward-Compatible Facade Layer
// ============================================================================

/**
 * getUnifiedInsights Facade
 * Why this particular is used: Preserves exact signature to support existing components and API routes.
 * Internally instantiates the SOLID classes and delegates execution.
 */
export async function getUnifiedInsights(options: {
  lang: 'en' | 'ar';
  category?: string | null;
  limit?: number;
}): Promise<InsightItem[]> {
  const { lang, category, limit = 100 } = options;

  const repository = getInsightRepository();
  const validator = new StandardInsightValidator();
  
  const processors: IInsightProcessor[] = [
    new DeduplicateProcessor(),
    new SortByDateDescendingProcessor(),
  ];

  if (category) {
    processors.push(new CategoryFilterProcessor(category));
  }

  const service = new InsightService(repository, validator, processors);
  const items = await service.getInsights(lang);
  
  return items.slice(0, limit);
}

/**
 * getArticleBySlug Facade
 * Why this particular is used: Preserves exact signature. Delegates slug resolving to InsightService.
 */
export async function getArticleBySlug(slug: string, lang: 'en' | 'ar'): Promise<InsightItem | null> {
  const repository = getInsightRepository();
  const validator = new StandardInsightValidator();
  
  const service = new InsightService(repository, validator, [
    new DeduplicateProcessor(),
    new SortByDateDescendingProcessor(),
  ]);

  return await service.getArticle(slug, lang);
}

/**
 * getAllInsightSlugs Facade
 * Why this particular is used: Preserves slug generation for static site routing.
 */
export async function getAllInsightSlugs(): Promise<{ slug: string; lang: 'en' | 'ar'; pubDate: string }[]> {
  const enItems = await getUnifiedInsights({ lang: 'en', limit: 1000 });
  const arItems = await getUnifiedInsights({ lang: 'ar', limit: 1000 });

  const enSlugs = enItems.map(n => ({ slug: n.slug, lang: 'en' as const, pubDate: n.pubDate }));
  const arSlugs = arItems.map(n => ({ slug: n.slug, lang: 'ar' as const, pubDate: n.pubDate }));

  return [...enSlugs, ...arSlugs];
}
