import { Redis } from '@upstash/redis';

/**
 * Arabia Khaleej Redis Client
 * Used for transient caching of insights and market data.
 * This aligns with our 'No Permanent Database' legal strategy.
 */
const redisUrl = process.env.UPSTASH_REDIS_REST_URL;
const redisToken = process.env.UPSTASH_REDIS_REST_TOKEN;

// Memory cache fallback for local development or when Redis is not configured
const memoryCache: Record<string, { value: any, expiresAt: number }> = {};

export const redis = redisUrl && redisToken 
  ? new Redis({ url: redisUrl, token: redisToken })
  : {
      get: async (key: string) => {
        const cached = memoryCache[key];
        if (cached && cached.expiresAt > Date.now()) return cached.value;
        return null;
      },
      set: async (key: string, value: any, options?: { ex?: number }) => {
        memoryCache[key] = {
          value,
          expiresAt: Date.now() + ((options?.ex || 3600) * 1000)
        };
        return 'OK';
      },
      del: async (key: string) => {
        delete memoryCache[key];
        return 1;
      },
      incr: async (key: string) => {
        const cached = memoryCache[key] || { value: 0, expiresAt: Date.now() + 60000 };
        cached.value++;
        memoryCache[key] = cached;
        return cached.value;
      },
      expire: async (key: string, seconds: number) => {
        if (memoryCache[key]) {
          memoryCache[key].expiresAt = Date.now() + (seconds * 1000);
        }
        return 1;
      }
    } as unknown as Redis;

export async function rateLimit(ip: string, limit: number = 10, windowSeconds: number = 60, route = 'global') {
  const key = `ratelimit:${route}:${ip}`;
  const current = await redis.incr(key);
  if (current === 1) {
    await redis.expire(key, windowSeconds);
  }
  return {
    success: current <= limit,
    current,
    limit
  };
}


// Cache durations (in seconds)
export const CACHE_TIMES = {
  INSIGHTS: 3600, // 1 hour
  INSIGHTS_ARCHIVE: 2592000, // 30 days
  MARKET: 1800, // 30 minutes
  FX: 1800, // 30 minutes
};
