// Edge-compatible Redis implementation using Upstash REST API
// Why: Cloudflare Pages/Workers do not support standard Node.js TCP connections out of the box without special bindings. 
// Using the Upstash REST API via standard `fetch` is the official and most reliable way to connect to Redis on the edge.

import { toSlug } from './utils';

/**
 * Options for setDraft.
 * ttlSeconds: if set, the Redis key will auto-expire after this many seconds.
 *   - Use for transient states: 'generating' (7 days), 'error' (2 days).
 *   - Omit (no TTL) for 'pending_review' drafts that must survive until admin action.
 * Why TTL matters: without it, orphaned draft keys accumulate in Redis forever,
 * cluttering the dashboard and wasting Upstash storage quota.
 */
export interface SetDraftOptions {
  ttlSeconds?: number;
}

export const draftDb = {
  // Helper to determine if Cloudflare D1 is bound and active
  isD1Active(): boolean {
    return typeof process !== 'undefined' && !!(process.env as any).DB;
  },

  async getDraft(topicOrSlug: string) {
    if (this.isD1Active()) {
      try {
        const db = (process.env as any).DB;
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

        return {
          topic: row.topic,
          status: row.status,
          word_count: row.word_count,
          content: parsedContent,
          image_url: row.image_url,
          error: row.error,
          description: parsedDesc,
          tags: row.tags ? JSON.parse(row.tags) : [],
          timestamp: row.timestamp
        };
      } catch (err) {
        console.error('Failed to get draft from D1:', topicOrSlug, err);
        return null;
      }
    }

    // Upstash Redis Fallback
    const key = `article:${topic}`;
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
      console.error('Failed to parse Redis draft:', topic, err);
      return null;
    }
  },

  async setDraft(topic: string, value: any, options?: SetDraftOptions) {
    if (this.isD1Active()) {
      try {
        const db = (process.env as any).DB;
        const sql = `
          INSERT INTO drafts (topic, status, word_count, content, image_url, error, description, tags, timestamp)
          VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
          ON CONFLICT(topic) DO UPDATE SET
            status=excluded.status,
            word_count=excluded.word_count,
            content=excluded.content,
            image_url=excluded.image_url,
            error=excluded.error,
            description=excluded.description,
            tags=excluded.tags,
            timestamp=excluded.timestamp
        `;
        
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
          contentStr,
          value.image_url !== undefined ? value.image_url : null,
          value.error !== undefined ? value.error : null,
          descriptionStr,
          JSON.stringify(value.tags || []),
          value.timestamp || Date.now()
        ).run();
        return;
      } catch (err) {
        console.error('Failed to set draft in D1:', topic, err);
      }
    }

    // Upstash Redis Fallback
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
  },

  async delDraft(topic: string) {
    if (this.isD1Active()) {
      try {
        const db = (process.env as any).DB;
        await db.prepare("DELETE FROM drafts WHERE topic = ?").bind(topic).run();
        return;
      } catch (err) {
        console.error('Failed to delete draft from D1:', topic, err);
      }
    }

    // Upstash Redis Fallback
    const key = `article:${topic}`;
    await fetch(`${process.env.UPSTASH_REDIS_REST_URL}/`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${process.env.UPSTASH_REDIS_REST_TOKEN}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(["DEL", key])
    });
  },

  async updateDraftIfExist(topic: string, value: any): Promise<boolean> {
    if (this.isD1Active()) {
      try {
        const db = (process.env as any).DB;
        const sql = `
          UPDATE drafts SET 
            status = ?, word_count = ?, content = ?, image_url = ?, error = ?, description = ?, tags = ?, timestamp = ?
          WHERE topic = ? AND status = 'generating'
        `;
        const result = await db.prepare(sql).bind(
          value.status,
          value.word_count !== undefined ? value.word_count : null,
          value.content !== undefined ? value.content : null,
          value.image_url !== undefined ? value.image_url : null,
          value.error !== undefined ? value.error : null,
          value.description !== undefined ? value.description : null,
          JSON.stringify(value.tags || []),
          value.timestamp || Date.now(),
          topic
        ).run();
        
        return result.success && result.meta?.changes === 1;
      } catch (err) {
        console.error('Failed to update draft in D1:', topic, err);
        return false;
      }
    }

    // Upstash Redis Fallback
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
  },

  async getAllDrafts() {
    if (this.isD1Active()) {
      try {
        const db = (process.env as any).DB;
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

          return {
            topic: row.topic,
            status: row.status,
            word_count: row.word_count,
            content: parsedContent,
            image_url: row.image_url,
            error: row.error,
            description: parsedDesc,
            tags: row.tags ? JSON.parse(row.tags) : [],
            timestamp: row.timestamp
          };
        });
      } catch (err) {
        console.error('Failed to fetch drafts list from D1:', err);
        return [];
      }
    }

    // Upstash Redis Fallback
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
};
