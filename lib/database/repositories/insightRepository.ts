/**
 * Arabia Khaleej — Insights Database Repository
 * Provides D1 (SQLite) and Redis storage adapters for insight articles.
 */

import { InsightItem } from '@/lib/types';
import { redis, getWithCompression, setWithCompression, MAX_PUBLISHED_ARTICLES, MAX_REDIS_KEYS_THRESHOLD } from '../redis';

/**
 * Normalizes a bilingual database article into a specific language version (plain strings)
 * so that it is perfectly backward-compatible with all React client views.
 * 
 * Why this particular helper is used:
 * Keeps the database representation unified in a single document while completely 
 * shielding the client layout code from bilingual object parsing complexity.
 */
export function normalizeArticle(item: any, lang: 'en' | 'ar'): InsightItem {
  if (!item) return null as any;
  
  const title = typeof item.title === 'string' ? item.title : (item.title?.[lang] || item.title?.en || '');
  const description = typeof item.description === 'string' ? item.description : (item.description?.[lang] || item.description?.en || '');
  const content = typeof item.content === 'string' ? item.content : (item.content?.[lang] || item.content?.en || '');
  
  let author = item.author;
  if (author) {
    author = {
      id: author.id,
      name: typeof author.name === 'string' ? author.name : (author.name?.[lang] || author.name?.en || ''),
      role: typeof author.role === 'string' ? author.role : (author.role?.[lang] || author.role?.en || '')
    };
  }

  return {
    ...item,
    title,
    description,
    content,
    language: lang,
    author
  };
}

/**
 * 1. Interface for Data Retrieval Repository (Dependency Inversion Principle - DIP)
 * Why this particular is used: High-level modules (InsightService) should not depend directly on concrete low-level
 * modules like 'redis.ts'. By depending on this IInsightRepository interface, we can easily swap 
 * the Redis storage for a relational database, memory cache, or Mock repository in tests 
 * without modifying any service or domain code.
 */
export interface IInsightRepository {
  getRawInsights(lang: 'en' | 'ar'): Promise<InsightItem[]>;
  getRawArticle(slug: string): Promise<InsightItem | null>;
  saveArticle(article: any): Promise<void>;
  deleteArticle(slug: string): Promise<void>;
}

/**
 * Concrete implementation of the Repository using Redis (Single Responsibility Principle - SRP)
 * Why this particular is used: Handles reading and writing to Upstash Redis cache including compression
 * and the free-tier FIFO eviction rules, completely decoupled from controllers.
 */
export class RedisInsightRepository implements IInsightRepository {
  async getRawInsights(lang: 'en' | 'ar'): Promise<InsightItem[]> {
    try {
      const stored = await getWithCompression<InsightItem[]>(`insights:list:${lang}`);
      if (stored && Array.isArray(stored)) {
        return stored.map(item => normalizeArticle(item, lang));
      }
    } catch (e) {
      console.error("Failed to fetch insights list from Redis:", e);
    }
    return [];
  }

  async getRawArticle(slug: string): Promise<InsightItem | null> {
    try {
      return await getWithCompression<InsightItem>(`insights:article:${slug}`);
    } catch (e) {
      return null;
    }
  }

  async saveArticle(article: any): Promise<void> {
    const slug = article.slug;
    
    // 1. Commit full bilingual document
    await setWithCompression(`insights:article:${slug}`, article);

    // 2. Pre-normalize copies and prepend to English and Arabic main feeds
    const liveEn = normalizeArticle(article, 'en');
    const liveAr = normalizeArticle(article, 'ar');

    delete (liveEn as any).content;
    delete (liveAr as any).content;

    // Concurrency lock to prevent simultaneous updates from overlapping
    const lockKey = `lock:insights:list`;
    const lock = await redis.set(lockKey, '1', { nx: true, ex: 15 });
    if (!lock) {
      throw new Error('System is busy updating the feed. Please try again.');
    }

    try {
      const listKeyEn = `insights:list:en`;
      const currentListEn = await getWithCompression<any[]>(listKeyEn) ?? [];
      const filteredListEn = currentListEn.filter((item: any) => item.slug !== slug);
      let updatedListEn = [liveEn, ...filteredListEn];
      
      const currentDbSize = await redis.dbsize().catch(() => 0);
      const needsEvictionEn = currentDbSize >= MAX_REDIS_KEYS_THRESHOLD || updatedListEn.length > MAX_PUBLISHED_ARTICLES;

      if (needsEvictionEn) {
        const targetSize = currentDbSize >= MAX_REDIS_KEYS_THRESHOLD
          ? Math.max(10, updatedListEn.length - 10)
          : MAX_PUBLISHED_ARTICLES;

        const evicted = updatedListEn.slice(targetSize);
        for (const item of evicted) {
          await redis.del(`insights:article:${item.slug}`).catch(() => {});
          console.log(`[eviction] Evicted oldest English article from Redis: "${item.slug}" (DB Size: ${currentDbSize} keys)`);
        }
        updatedListEn = updatedListEn.slice(0, targetSize);
      }
      await setWithCompression(listKeyEn, updatedListEn);

      const listKeyAr = `insights:list:ar`;
      const currentListAr = await getWithCompression<any[]>(listKeyAr) ?? [];
      const filteredListAr = currentListAr.filter((item: any) => item.slug !== slug);
      let updatedListAr = [liveAr, ...filteredListAr];
      
      const needsEvictionAr = currentDbSize >= MAX_REDIS_KEYS_THRESHOLD || updatedListAr.length > MAX_PUBLISHED_ARTICLES;

      if (needsEvictionAr) {
        const targetSize = currentDbSize >= MAX_REDIS_KEYS_THRESHOLD
          ? Math.max(10, updatedListAr.length - 10)
          : MAX_PUBLISHED_ARTICLES;

        const evicted = updatedListAr.slice(targetSize);
        for (const item of evicted) {
          await redis.del(`insights:article:${item.slug}`).catch(() => {});
          console.log(`[eviction] Evicted oldest Arabic article from Redis: "${item.slug}" (DB Size: ${currentDbSize} keys)`);
        }
        updatedListAr = updatedListAr.slice(0, targetSize);
      }
      await setWithCompression(listKeyAr, updatedListAr);
    } finally {
      await redis.del(lockKey);
    }
  }

  async deleteArticle(slug: string): Promise<void> {
    const lockKey = `lock:insights:list`;
    const lock = await redis.set(lockKey, '1', { nx: true, ex: 15 });
    if (!lock) {
      throw new Error('System is busy updating the feed. Please try again.');
    }

    try {
      const articleKey = `insights:article:${slug}`;
      await redis.del(articleKey);

      for (const lang of ['en', 'ar']) {
        const listKey = `insights:list:${lang}`;
        const currentList = await getWithCompression<any[]>(listKey);
        if (currentList && Array.isArray(currentList)) {
          const updatedList = currentList.filter((item: any) => item.slug !== slug);
          if (updatedList.length !== currentList.length) {
            await setWithCompression(listKey, updatedList);
          }
        }
      }
    } finally {
      await redis.del(lockKey);
    }
  }
}

/**
 * Concrete D1 Insight Repository using Cloudflare D1 SQL bindings
 * Why this particular is used: Handles Edge-native SQLite queries, preventing Redis eviction and scale limitations.
 */
export class D1InsightRepository implements IInsightRepository {
  private async getDb() {
    try {
      // Dynamic import to avoid bundling issues in non-Cloudflare environments
      const { getCloudflareContext } = await import('@opennextjs/cloudflare');
      const { env } = await getCloudflareContext({ async: true });
      const db = (env as any).DB;
      if (!db) {
        throw new Error("D1 database binding 'DB' is not configured in wrangler.toml.");
      }
      return db;
    } catch (e: any) {
      throw new Error(`Failed to access Cloudflare context: ${e.message}`);
    }
  }

  async getRawInsights(lang: 'en' | 'ar'): Promise<InsightItem[]> {
    try {
      const db = await this.getDb();
      const { results } = await db.prepare("SELECT * FROM articles ORDER BY pubDate DESC LIMIT 1000").all();
      if (!results || !Array.isArray(results)) return [];

      return results.map((row: any) => {
        const bilingualArticle = {
          id: row.id,
          slug: row.slug,
          title: { en: row.title_en, ar: row.title_ar },
          description: { en: row.description_en, ar: row.description_ar },
          link: `/insights/${row.slug}`,
          pubDate: row.pubDate,
          source: row.source,
          category: row.category,
          language: 'regional',
          image: row.image,
          tags: row.tags ? JSON.parse(row.tags) : [],
          author: {
            id: row.author_id,
            name: { en: row.author_name_en, ar: row.author_name_ar },
            role: { en: row.author_role_en, ar: row.author_role_ar },
          },
          content: { en: row.content_en, ar: row.content_ar },
          wordCount: row.wordCount,
          qualityScore: row.qualityScore || 6,
          status: 'published'
        };
        return normalizeArticle(bilingualArticle, lang);
      });
    } catch (e) {
      console.error("Failed to fetch insights from D1 Database:", e);
      return [];
    }
  }

  async getRawArticle(slug: string): Promise<InsightItem | null> {
    try {
      const db = await this.getDb();
      const row = await db.prepare("SELECT * FROM articles WHERE slug = ?").bind(slug).first();
      if (!row) return null;

      return {
        id: row.id,
        slug: row.slug,
        title: { en: row.title_en, ar: row.title_ar },
        description: { en: row.description_en, ar: row.description_ar },
        link: `/insights/${row.slug}`,
        pubDate: row.pubDate,
        source: row.source,
        category: row.category,
        language: 'regional',
        image: row.image,
        tags: row.tags ? JSON.parse(row.tags) : [],
        author: {
          id: row.author_id,
          name: { en: row.author_name_en, ar: row.author_name_ar },
          role: { en: row.author_role_en, ar: row.author_role_ar },
        },
        content: { en: row.content_en, ar: row.content_ar },
        wordCount: row.wordCount,
        qualityScore: row.qualityScore || 6,
        status: 'published'
      } as any;
    } catch (e) {
      console.error(`Failed to fetch article slug '${slug}' from D1 Database:`, e);
      return null;
    }
  }

  async saveArticle(article: any): Promise<void> {
    const db = await this.getDb();
    const sql = `
      INSERT INTO articles (
        id, slug, title_en, title_ar, description_en, description_ar, 
        pubDate, source, category, image, tags, 
        author_id, author_name_en, author_name_ar, author_role_en, author_role_ar, 
        content_en, content_ar, wordCount, qualityScore
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      ON CONFLICT(slug) DO UPDATE SET
        title_en=excluded.title_en,
        title_ar=excluded.title_ar,
        description_en=excluded.description_en,
        description_ar=excluded.description_ar,
        pubDate=excluded.pubDate,
        source=excluded.source,
        category=excluded.category,
        image=excluded.image,
        tags=excluded.tags,
        author_id=excluded.author_id,
        author_name_en=excluded.author_name_en,
        author_name_ar=excluded.author_name_ar,
        author_role_en=excluded.author_role_en,
        author_role_ar=excluded.author_role_ar,
        content_en=excluded.content_en,
        content_ar=excluded.content_ar,
        wordCount=excluded.wordCount,
        qualityScore=excluded.qualityScore
    `;

    await db.prepare(sql).bind(
      article.id,
      article.slug,
      article.title.en,
      article.title.ar,
      article.description.en,
      article.description.ar,
      article.pubDate,
      article.source,
      article.category,
      article.image || null,
      JSON.stringify(article.tags || []),
      article.author?.id || null,
      article.author?.name?.en || null,
      article.author?.name?.ar || null,
      article.author?.role?.en || null,
      article.author?.role?.ar || null,
      article.content.en,
      article.content.ar,
      article.wordCount || 0,
      article.qualityScore !== undefined ? article.qualityScore : 6
    ).run();
  }

  async deleteArticle(slug: string): Promise<void> {
    const db = await this.getDb();
    await db.prepare("DELETE FROM articles WHERE slug = ?").bind(slug).run();
  }
}

/**
 * Factory to resolve the active insight repository.
 * Why this particular is used: Dynamically detects whether we're running in a Cloudflare
 * Workers context (where D1 binding 'DB' exists in the Cloudflare env) and uses D1;
 * falls back to the Redis implementation for local development or non-Cloudflare deploys.
 */
export function getInsightRepository(): IInsightRepository {
  const isCloudflareWorker = 
    process.env.CLOUDFLARE_WORKER === 'true' ||
    (typeof globalThis !== 'undefined' && !!(globalThis as any).__CLOUDFLARE_WORKER__);
  
  if (isCloudflareWorker) {
    return new D1InsightRepository();
  }
  return new RedisInsightRepository();
}
