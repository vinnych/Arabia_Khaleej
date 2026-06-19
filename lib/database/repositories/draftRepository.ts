/**
 * Arabia Khaleej — Drafts Database Repository
 * Provides D1 (SQLite) and Redis storage adapters for article generation drafts.
 */

import { DraftItem, SetDraftOptions } from '@/lib/types';
import { toSlug } from '../../core/utils';

export interface IDraftRepository {
  getDraft(topicOrSlug: string, dbOverride?: any): Promise<DraftItem | null>;
  setDraft(topic: string, value: DraftItem, options?: SetDraftOptions, dbOverride?: any): Promise<void>;
  delDraft(topic: string, dbOverride?: any): Promise<void>;
  updateDraftIfExist(topic: string, value: DraftItem, dbOverride?: any): Promise<boolean>;
  getAllDrafts(dbOverride?: any): Promise<DraftItem[]>;
}

export class D1DraftRepository implements IDraftRepository {
  private async getDb(dbOverride?: any) {
    if (dbOverride) return dbOverride;
    try {
      const { getCloudflareContext } = await import('@opennextjs/cloudflare');
      const { env } = await getCloudflareContext({ async: true });
      return (env as any).DB || null;
    } catch {
      return null;
    }
  }

  async getDraft(topicOrSlug: string, dbOverride?: any): Promise<DraftItem | null> {
    const db = await this.getDb(dbOverride);
    if (!db) return null;
    try {
      // 1. Try lookup by exact topic name
      let row = await db.prepare("SELECT * FROM drafts WHERE topic = ?").bind(topicOrSlug).first();
      if (!row) {
        // 2. Fallback: Search all drafts by matching slug
        const { results } = await db.prepare("SELECT * FROM drafts").all();
        if (results) {
          const targetSlug = toSlug(topicOrSlug);
          const found = results.find((r: any) => {
            const entrySlug = r.slug || toSlug(r.topic || '');
            return entrySlug === targetSlug;
          });
          if (found) row = found;
        }
      }
      if (!row) return null;

      let parsedContent = row.content;
      if (row.content) {
        try {
          parsedContent = JSON.parse(row.content);
        } catch (e) {}
      }

      let parsedDesc = row.description;
      if (row.description) {
        try {
          parsedDesc = JSON.parse(row.description);
        } catch (e) {}
      }

      let parsedTitle = row.title;
      if (row.title) {
        try {
          parsedTitle = JSON.parse(row.title);
        } catch (e) {}
      }

      return {
        topic: row.topic,
        status: row.status,
        word_count: row.word_count,
        content: parsedContent,
        image_url: row.image_url,
        error: row.error,
        description: parsedDesc,
        tags: row.tags ? JSON.parse(row.tags) : [],
        timestamp: row.timestamp,
        qualityScore: row.quality_score || 6,
        title: parsedTitle
      };
    } catch (err) {
      console.error('Failed to get draft from D1:', topicOrSlug, err);
      return null;
    }
  }

  async setDraft(topic: string, value: DraftItem, options?: SetDraftOptions, dbOverride?: any): Promise<void> {
    const db = await this.getDb(dbOverride);
    if (!db) throw new Error("D1 database is not active");
    try {
      const sql = `
        INSERT INTO drafts (topic, status, word_count, title, content, image_url, error, description, tags, timestamp, quality_score)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        ON CONFLICT(topic) DO UPDATE SET
          status=excluded.status,
          word_count=excluded.word_count,
          title=excluded.title,
          content=excluded.content,
          image_url=excluded.image_url,
          error=excluded.error,
          description=excluded.description,
          tags=excluded.tags,
          timestamp=excluded.timestamp,
          quality_score=excluded.quality_score
      `;
      
      const titleStr = value.title && typeof value.title === 'object'
        ? JSON.stringify(value.title)
        : (value.title !== undefined ? value.title : null);

      const contentStr = value.content && typeof value.content === 'object'
        ? JSON.stringify(value.content)
        : (value.content !== undefined ? value.content : null);

      const descriptionStr = value.description && typeof value.description === 'object'
        ? JSON.stringify(value.description)
        : (value.description !== undefined ? value.description : null);

      await db.prepare(sql).bind(
        topic,
        value.status,
        value.word_count !== undefined ? value.word_count : null,
        titleStr,
        contentStr,
        value.image_url !== undefined ? value.image_url : null,
        value.error !== undefined ? value.error : null,
        descriptionStr,
        JSON.stringify(value.tags || []),
        value.timestamp || Date.now(),
        value.qualityScore !== undefined ? value.qualityScore : 6
      ).run();
    } catch (err) {
      console.error('Failed to set draft in D1:', topic, err);
      throw err;
    }
  }

  async delDraft(topic: string, dbOverride?: any): Promise<void> {
    const db = await this.getDb(dbOverride);
    if (!db) throw new Error("D1 database is not active");
    try {
      await db.prepare("DELETE FROM drafts WHERE topic = ?").bind(topic).run();
    } catch (err) {
      console.error('Failed to delete draft from D1:', topic, err);
      throw err;
    }
  }

  async updateDraftIfExist(topic: string, value: DraftItem, dbOverride?: any): Promise<boolean> {
    const db = await this.getDb(dbOverride);
    if (!db) return false;
    try {
      const sql = `
        UPDATE drafts SET 
          status = ?, word_count = ?, title = ?, content = ?, image_url = ?, error = ?, description = ?, tags = ?, timestamp = ?, quality_score = ?
        WHERE topic = ? AND status = 'generating'
      `;
      
      const titleStr = value.title && typeof value.title === 'object'
        ? JSON.stringify(value.title)
        : (value.title !== undefined ? value.title : null);

      const contentStr = value.content && typeof value.content === 'object'
        ? JSON.stringify(value.content)
        : (value.content !== undefined ? value.content : null);

      const descriptionStr = value.description && typeof value.description === 'object'
        ? JSON.stringify(value.description)
        : (value.description !== undefined ? value.description : null);

      const result = await db.prepare(sql).bind(
        value.status,
        value.word_count !== undefined ? value.word_count : null,
        titleStr,
        contentStr,
        value.image_url !== undefined ? value.image_url : null,
        value.error !== undefined ? value.error : null,
        descriptionStr,
        JSON.stringify(value.tags || []),
        value.timestamp || Date.now(),
        value.qualityScore !== undefined ? value.qualityScore : 6,
        topic
      ).run();
      
      return result.success && result.meta?.changes === 1;
    } catch (err) {
      console.error('Failed to update draft in D1:', topic, err);
      return false;
    }
  }

  async getAllDrafts(dbOverride?: any): Promise<DraftItem[]> {
    const db = await this.getDb(dbOverride);
    if (!db) return [];
    try {
      const { results } = await db.prepare("SELECT * FROM drafts ORDER BY timestamp DESC").all();
      if (!results || !Array.isArray(results)) return [];
      return results.map((row: any) => {
        let parsedContent = row.content;
        if (row.content) {
          try {
            parsedContent = JSON.parse(row.content);
          } catch (e) {}
        }

        let parsedDesc = row.description;
        if (row.description) {
          try {
            parsedDesc = JSON.parse(row.description);
          } catch (e) {}
        }

        let parsedTitle = row.title;
        if (row.title) {
          try {
            parsedTitle = JSON.parse(row.title);
          } catch (e) {}
        }

        return {
          topic: row.topic,
          status: row.status,
          word_count: row.word_count,
          content: parsedContent,
          image_url: row.image_url,
          error: row.error,
          description: parsedDesc,
          tags: row.tags ? JSON.parse(row.tags) : [],
          timestamp: row.timestamp,
          qualityScore: row.quality_score || 6,
          title: parsedTitle
        };
      });
    } catch (err) {
      console.error('Failed to fetch drafts list from D1:', err);
      return [];
    }
  }
}

export class RedisDraftRepository implements IDraftRepository {
  async getDraft(topicOrSlug: string): Promise<DraftItem | null> {
    const key = `article:${topicOrSlug}`;
    const res = await fetch(`${process.env.UPSTASH_REDIS_REST_URL}/`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${process.env.UPSTASH_REDIS_REST_TOKEN}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(["GET", key]),
      cache: 'no-store'
    });
    const data = await res.json();
    if (!data.result) return null;

    try {
      let parsed = JSON.parse(data.result);
      if (typeof parsed === 'string') {
        parsed = JSON.parse(parsed);
      }
      return parsed;
    } catch (err) {
      console.error('Failed to parse Redis draft:', topicOrSlug, err);
      return null;
    }
  }

  async setDraft(topic: string, value: DraftItem, options?: SetDraftOptions): Promise<void> {
    const key = `article:${topic}`;
    const body = JSON.stringify(value);
    const command = options?.ttlSeconds
      ? ["SETEX", key, options.ttlSeconds.toString(), body]
      : ["SET", key, body];

    await fetch(`${process.env.UPSTASH_REDIS_REST_URL}/`, {
      method: 'POST',
      headers: { 
        Authorization: `Bearer ${process.env.UPSTASH_REDIS_REST_TOKEN}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(command)
    });
  }

  async delDraft(topic: string): Promise<void> {
    const key = `article:${topic}`;
    await fetch(`${process.env.UPSTASH_REDIS_REST_URL}/`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${process.env.UPSTASH_REDIS_REST_TOKEN}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(["DEL", key])
    });
  }

  async updateDraftIfExist(topic: string, value: DraftItem): Promise<boolean> {
    const key = `article:${topic}`;
    const body = JSON.stringify(value);
    const script = `
      local val = redis.call('GET', KEYS[1])
      if val == false then return 0 end
      if string.find(val, '"status":"generating"') then
        redis.call('SET', KEYS[1], ARGV[1])
        return 1
      end
      return 0
    `;

    const res = await fetch(`${process.env.UPSTASH_REDIS_REST_URL}/`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${process.env.UPSTASH_REDIS_REST_TOKEN}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(["EVAL", script, "1", key, body])
    });

    const data = await res.json();
    return data.result === 1;
  }

  async getAllDrafts(): Promise<DraftItem[]> {
    const res = await fetch(`${process.env.UPSTASH_REDIS_REST_URL}/keys/article:*`, {
      headers: { Authorization: `Bearer ${process.env.UPSTASH_REDIS_REST_TOKEN}` },
      cache: 'no-store'
    });
    const data = await res.json();
    const keys = data.result || [];
    
    if (keys.length === 0) return [];

    const resMget = await fetch(`${process.env.UPSTASH_REDIS_REST_URL}/`, {
      method: 'POST',
      headers: { 
        Authorization: `Bearer ${process.env.UPSTASH_REDIS_REST_TOKEN}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(["MGET", ...keys]),
      cache: 'no-store'
    });

    const mgetData = await resMget.json();
    const rawValues = mgetData.result || [];

    const drafts = rawValues.map((val: any) => {
      if (!val) return null;
      try {
        let parsed = JSON.parse(val);
        if (typeof parsed === 'string') {
          parsed = JSON.parse(parsed);
        }
        return parsed;
      } catch (err) {
        return null;
      }
    });
    
    return drafts
      .filter(Boolean)
      .sort((a: any, b: any) => (b.timestamp || 0) - (a.timestamp || 0));
  }
}

export class DynamicDraftRepository implements IDraftRepository {
  private d1Repo = new D1DraftRepository();
  private redisRepo = new RedisDraftRepository();

  private async isD1Active(dbOverride?: any): Promise<boolean> {
    if (dbOverride) return true;
    try {
      const { getCloudflareContext } = await import('@opennextjs/cloudflare');
      const { env } = await getCloudflareContext({ async: true });
      return !!(env as any).DB;
    } catch {
      return false;
    }
  }

  async getDraft(topicOrSlug: string, dbOverride?: any): Promise<DraftItem | null> {
    if (await this.isD1Active(dbOverride)) {
      return this.d1Repo.getDraft(topicOrSlug, dbOverride);
    }
    return this.redisRepo.getDraft(topicOrSlug);
  }

  async setDraft(topic: string, value: DraftItem, options?: SetDraftOptions, dbOverride?: any): Promise<void> {
    if (await this.isD1Active(dbOverride)) {
      return this.d1Repo.setDraft(topic, value, options, dbOverride);
    }
    return this.redisRepo.setDraft(topic, value, options);
  }

  async delDraft(topic: string, dbOverride?: any): Promise<void> {
    if (await this.isD1Active(dbOverride)) {
      return this.d1Repo.delDraft(topic, dbOverride);
    }
    return this.redisRepo.delDraft(topic);
  }

  async updateDraftIfExist(topic: string, value: DraftItem, dbOverride?: any): Promise<boolean> {
    if (await this.isD1Active(dbOverride)) {
      return this.d1Repo.updateDraftIfExist(topic, value, dbOverride);
    }
    return this.redisRepo.updateDraftIfExist(topic, value);
  }

  async getAllDrafts(dbOverride?: any): Promise<DraftItem[]> {
    if (await this.isD1Active(dbOverride)) {
      return this.d1Repo.getAllDrafts(dbOverride);
    }
    return this.redisRepo.getAllDrafts();
  }
}

export function getDraftRepository(dbOverride?: any): IDraftRepository {
  return new DynamicDraftRepository();
}
