import { Redis } from '@upstash/redis';
import * as zlib from 'fflate';

/**
 * Compression Helpers for Edge Runtime (Cloudflare/Vercel)
 * Uses fflate for gzip compression/decompression compatible with Edge Runtime.
 */

/** Arabia Khaleej Redis Client

 * Used for transient data storage and performance caching.
 */
const redisUrl = process.env.UPSTASH_REDIS_REST_URL;
const redisToken = process.env.UPSTASH_REDIS_REST_TOKEN;

// Memory cache fallback for local development or when Redis is not configured
// WARNING: In-memory cache has no persistence - restarts clear all data
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

/**
 * Enhanced Redis methods with transparent compression support.
 */

/** Decompress a value produced by {@link compress}. */
async function decompress(compressedStr: string): Promise<string> {
  if (!compressedStr.startsWith('compressed:')) return compressedStr;
  const base64 = compressedStr.replace('compressed:', '');
  const binary = atob(base64);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) {
    bytes[i] = binary.charCodeAt(i);
  }
  const decompressed = zlib.gunzipSync(bytes);
  return new TextDecoder().decode(decompressed);
}

/** Compress a string; returns `'compressed:' + base64(gzip(data))`. */
async function compress(data: string): Promise<string> {
  const uint8Array = new TextEncoder().encode(data);
  const compressed = zlib.gzipSync(uint8Array);
  let binary = '';
  const bytes = new Uint8Array(compressed);
  for (let i = 0; i < bytes.byteLength; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return 'compressed:' + btoa(binary);
}

export async function getWithCompression<T>(key: string): Promise<T | null> {
  let raw: string | null = null;
  let rawType = 'null';
  let rawLen = 0;
  try {
    raw = await redis.get(key) as string | null;
    rawType = typeof raw;
    rawLen = raw ? raw.length : 0;
    if (!raw) return null;

    if (typeof raw === 'string' && raw.startsWith('compressed:')) {
      const decompressed = await decompress(raw);
      return JSON.parse(decompressed) as T;
    }

    return (typeof raw === 'string' ? JSON.parse(raw) : raw) as T;
  } catch (e) {
    console.error(`Redis Get/Decompress Error [${key}] rawType=${rawType} rawLen=${rawLen}:`, e);
    return null;
  }
}

export async function setWithCompression(key: string, value: any, options?: { ex?: number }): Promise<string> {
  try {
    const json = JSON.stringify(value);
    const redisOptions = options?.ex ? { ex: options.ex } as const : undefined;
    
    if (json.length > 1024) {
      const compressed = await compress(json);
      return await redis.set(key, compressed, redisOptions as any) as string;
    }
    
    return await redis.set(key, json, redisOptions as any) as string;
  } catch (e) {
    console.error(`Redis Set/Compress Error [${key}]:`, e);
    const redisOptions = options?.ex ? { ex: options.ex } as const : undefined;
    return await redis.set(key, value, redisOptions as any) as string;
  }
}


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
