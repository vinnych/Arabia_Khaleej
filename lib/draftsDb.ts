// Edge-compatible Redis implementation using Upstash REST API
// Why: Cloudflare Pages/Workers do not support standard Node.js TCP connections out of the box without special bindings. 
// Using the Upstash REST API via standard `fetch` is the official and most reliable way to connect to Redis on the edge.

export const draftDb = {
  async getDraft(topic: string) {
    const res = await fetch(`${process.env.UPSTASH_REDIS_REST_URL}/get/article:${topic}`, {
      headers: { Authorization: `Bearer ${process.env.UPSTASH_REDIS_REST_TOKEN}` },
      cache: 'no-store'
    });
    const data = await res.json();
    return data.result ? JSON.parse(data.result) : null;
  },

  async setDraft(topic: string, value: any) {
    await fetch(`${process.env.UPSTASH_REDIS_REST_URL}/set/article:${topic}`, {
      method: 'POST',
      headers: { 
        Authorization: `Bearer ${process.env.UPSTASH_REDIS_REST_TOKEN}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(JSON.stringify(value))
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
    
    const drafts = [];
    for (const key of keys) {
      const topic = key.replace('article:', '');
      const draft = await this.getDraft(topic);
      if (draft) drafts.push(draft);
    }
    return drafts.sort((a, b) => (b.timestamp || 0) - (a.timestamp || 0));
  }
};
