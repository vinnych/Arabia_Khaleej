import { Redis } from '@upstash/redis';

/**
 * Arabia Khaleej Redis Client
 * Used for transient caching of news and market data.
 * This aligns with our 'No Permanent Database' legal strategy.
 */
const redisUrl = process.env.UPSTASH_REDIS_REST_URL;
const redisToken = process.env.UPSTASH_REDIS_REST_TOKEN;

export const redis = redisUrl && redisToken 
  ? new Redis({ url: redisUrl, token: redisToken })
  : {
      get: async () => null,
      set: async () => null,
      del: async () => null,
    } as unknown as Redis;


// Cache durations (in seconds)
export const CACHE_TIMES = {
  NEWS: 3600, // 1 hour
  MARKET: 1800, // 30 minutes
  FX: 1800, // 30 minutes
};
