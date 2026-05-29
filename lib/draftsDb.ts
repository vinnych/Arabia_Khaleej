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
    // Why encodeURIComponent: setDraft uses encodeURIComponent when writing keys.
    // getDraft must use the same encoding so topics with spaces or special chars
    // (e.g. "Dubai Real Estate" → "Dubai%20Real%20Estate") resolve to the same key.
    const res = await fetch(`${process.env.UPSTASH_REDIS_REST_URL}/get/article:${encodeURIComponent(topic)}`, {
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
    // Why encodeURIComponent: Must match the encoded key that setDraft wrote.
    // Without this, deleting a topic like "Dubai Real Estate" targets the wrong Redis key
    // and the draft stays stuck in the dashboard forever.
    await fetch(`${process.env.UPSTASH_REDIS_REST_URL}/del/article:${encodeURIComponent(topic)}`, {
      headers: { Authorization: `Bearer ${process.env.UPSTASH_REDIS_REST_TOKEN}` }
    });
  },

  async updateDraftIfExist(topic: string, value: any): Promise<boolean> {
    const key = `article:${encodeURIComponent(topic)}`;
    const body = JSON.stringify(value);
    
    // Why Idempotent Lua Script (EVAL):
    // We check TWO conditions atomically before writing:
    //   1. The key EXISTS (admin didn't delete the draft while it was generating).
    //   2. The stored JSON contains '"status":"generating"' (the draft hasn't already been
    //      received and written to pending_review by a previous callback attempt).
    // Why string.find instead of JSON parsing inside Lua:
    //   Redis Lua has limited JSON support. Using string.find on the raw stored value to
    //   check for the status substring is simple, zero-dependency, and 100% reliable
    //   since we always serialize the status as a JSON string key.
    // This guarantees that a second tenacity retry can never overwrite admin edits.
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
      // Upstash REST syntax: ["COMMAND", "ARG1", "ARG2", ...]
      body: JSON.stringify(["EVAL", script, "1", key, body])
    });

    const data = await res.json();
    return data.result === 1; // 1 if updated, 0 if deleted or already processed
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
        // Why we NO LONGER use decodeURIComponent: The Upstash REST API URL-decodes the path before
        // executing the Redis command. So the key stored in Redis is the raw, unencoded string 
        // (e.g., "article:Dubai Real Estate" or "article:... 42.1%"). If we call decodeURIComponent
        // on a raw string containing a '%' symbol (like 42.1%), it throws a fatal URIError and 
        // crashes the entire drafts dashboard. We just strip the prefix to get the raw topic.
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
