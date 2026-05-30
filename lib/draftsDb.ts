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
    // Why NO encodeURIComponent here: 
    // Unlike get/set/del which pass the key in the URL path (which Upstash auto-decodes),
    // this command passes the key in a JSON body array for the EVAL command.
    // Upstash does NOT decode JSON body elements. If we encode here, Redis will look for the 
    // literal key "article:Tour%20UAE%202026" instead of "article:Tour UAE 2026", causing a miss.
    const key = `article:${topic}`;
    const body = JSON.stringify(value);
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
    
    if (keys.length === 0) return [];

    // Why MGET instead of Promise.all(keys.map(...getDraft)):
    // Cloudflare Workers have a hard limit of 50 subrequests per invocation.
    // If we have 50 drafts, Promise.all triggers 50 concurrent fetch requests, 
    // immediately crashing the worker with "Too many subrequests by single Worker invocation".
    // MGET fetches all keys in a single network request, reducing subrequests from (1 + N) to exactly 2.
    const resMget = await fetch(`${process.env.UPSTASH_REDIS_REST_URL}/`, {
      method: 'POST',
      headers: { 
        Authorization: `Bearer ${process.env.UPSTASH_REDIS_REST_TOKEN}`,
        'Content-Type': 'application/json'
      },
      // Upstash REST syntax: ["COMMAND", "ARG1", "ARG2", ...]
      body: JSON.stringify(["MGET", ...keys]),
      cache: 'no-store'
    });

    const mgetData = await resMget.json();
    const rawValues = mgetData.result || [];

    const drafts = rawValues.map((val: any) => {
      if (!val) return null;
      try {
        let parsed = JSON.parse(val);
        // Self-healing check for double-serialized strings (backward compatibility)
        if (typeof parsed === 'string') {
          parsed = JSON.parse(parsed);
        }
        return parsed;
      } catch (err) {
        return null;
      }
    });
    
    // Filter out empty results and sort by timestamp descending
    return drafts
      .filter(Boolean)
      .sort((a: any, b: any) => (b.timestamp || 0) - (a.timestamp || 0));
  }
};
