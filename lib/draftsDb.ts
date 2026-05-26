// Edge-compatible Redis implementation using Upstash REST API
// Why: Cloudflare Pages/Workers do not support standard Node.js TCP connections out of the box without special bindings. 
// Using the Upstash REST API via standard `fetch` is the official and most reliable way to connect to Redis on the edge.

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

  async setDraft(topic: string, value: any) {
    // Why single JSON.stringify: Previously, JSON.stringify(JSON.stringify(value)) double-serialized the data,
    // which caused data to be stored as an escaped string rather than a clean JSON structure in Redis.
    // Switching to standard single-stringification ensures proper data formatting and optimal storage space.
    await fetch(`${process.env.UPSTASH_REDIS_REST_URL}/set/article:${topic}`, {
      method: 'POST',
      headers: { 
        Authorization: `Bearer ${process.env.UPSTASH_REDIS_REST_TOKEN}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(value)
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
