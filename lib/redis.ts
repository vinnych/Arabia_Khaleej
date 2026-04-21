import { Redis } from '@upstash/redis';

/**
 * Arabia Khaleej Redis Client
 * Used for transient caching of news and market data.
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
    } as unknown as Redis;


// Cache durations (in seconds)
export const CACHE_TIMES = {
  NEWS: 3600, // 1 hour
  NEWS_ARCHIVE: 2592000, // 30 days
  MARKET: 1800, // 30 minutes
  FX: 1800, // 30 minutes
};
