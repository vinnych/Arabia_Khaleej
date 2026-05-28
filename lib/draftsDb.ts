// Edge-compatible Redis implementation using Upstash REST API
// Why: Cloudflare Pages/Workers do not support standard Node.js TCP connections out of the box without special bindings. 
// Using the Upstash REST API via standard `fetch` is the official and most reliable way to connect to Redis on the edge.

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
  async getDraft(topic: string) {
    // Why standard fetch instead of Redis TCP: Cloudflare Pages / Workers do not support TCP connections out-of-the-box
    // without specialized configurations. The Upstash REST API is highly optimized for serverless environments.
    const res = await fetch(`${process.env.UPSTASH_REDIS_REST_URL}/get/article:${topic}`, {
      headers: { Authorization: `Bearer ${process.env.UPSTASH_REDIS_REST_TOKEN}` },
      cache: 'no-store'
    });
    const data = await res.json();
    if (!data.result) return null;

    try {
      // First parse: decodes the top-level string returned from the Upstash REST endpoint
      let parsed = JSON.parse(data.result);
      
      // Self-healing check: if the data was stored as a double-serialized string (a known bug
      // where JSON.stringify was called twice), parsed will still be a string. We parse it once more
      // to extract the actual Article object, ensuring backward compatibility with existing Redis keys.
      if (typeof parsed === 'string') {
        parsed = JSON.parse(parsed);
      }
      return parsed;
    } catch (err) {
      // Log parsing errors without crashing the entire dashboard rendering flow
      console.error('Failed to parse draft for topic:', topic, err);
      return null;
    }
  },

  async setDraft(topic: string, value: any, options?: SetDraftOptions) {
    // Why single JSON.stringify: Previously, JSON.stringify(JSON.stringify(value)) double-serialized the data,
    // which caused data to be stored as an escaped string rather than a clean JSON structure in Redis.
    // Switching to standard single-stringification ensures proper data formatting and optimal storage space.
    const body = JSON.stringify(value);

    // Why conditional setex vs set:
    // Upstash REST API exposes two distinct commands:
    //   /set/{key}           → sets the key without expiry (persists until explicitly deleted)
    //   /setex/{key}/{ttl}   → sets the key with an expiry in seconds (auto-cleaned by Redis)
    // Using /setex for transient statuses ('generating', 'error') prevents orphaned keys
    // from accumulating; using plain /set for 'pending_review' ensures admin-approved
    // articles are not silently deleted before the editorial team publishes them.
    const url = options?.ttlSeconds
      ? `${process.env.UPSTASH_REDIS_REST_URL}/setex/article:${encodeURIComponent(topic)}/${options.ttlSeconds}`
      : `${process.env.UPSTASH_REDIS_REST_URL}/set/article:${encodeURIComponent(topic)}`;

    await fetch(url, {
      method: 'POST',
      headers: { 
        Authorization: `Bearer ${process.env.UPSTASH_REDIS_REST_TOKEN}`,
        'Content-Type': 'application/json'
      },
      body
    });
  },

  async delDraft(topic: string) {
    await fetch(`${process.env.UPSTASH_REDIS_REST_URL}/del/article:${topic}`, {
      headers: { Authorization: `Bearer ${process.env.UPSTASH_REDIS_REST_TOKEN}` }
    });
  },

  async getAllDrafts() {
    const res = await fetch(`${process.env.UPSTASH_REDIS_REST_URL}/keys/article:*`, {
      headers: { Authorization: `Bearer ${process.env.UPSTASH_REDIS_REST_TOKEN}` },
      cache: 'no-store'
    });
    const data = await res.json();
    const keys = data.result || [];
    
    // Concurrently fetch all drafts from Redis in parallel using Promise.all
    // Why Promise.all is used instead of a sequential for-of loop:
    // - A sequential loop does O(N) sequential HTTP calls, causing high network latency.
    // - Promise.all runs all fetch requests in parallel, reducing the retrieval time to a single concurrent roundtrip.
    const drafts = await Promise.all(
      keys.map(async (key: string) => {
        const topic = key.replace('article:', '');
        return await this.getDraft(topic);
      })
    );
    
    // Filter out empty results and sort by timestamp descending
    return drafts
      .filter(Boolean)
      .sort((a, b) => (b.timestamp || 0) - (a.timestamp || 0));
  }
};
