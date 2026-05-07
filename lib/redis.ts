import { Redis } from '@upstash/redis';

/**
 * Compression Helpers for Edge Runtime (Cloudflare/Vercel)
 * Uses native CompressionStream/DecompressionStream APIs.
 */
async function compress(data: string): Promise<string> {
  const encoder = new TextEncoder();
  const uint8 = encoder.encode(data);
  const stream = new ReadableStream({
    start(controller) {
      controller.enqueue(uint8);
      controller.close();
    },
  }).pipeThrough(new CompressionStream('gzip'));

  const response = new Response(stream);
  const buffer = await response.arrayBuffer();
  
  // Convert ArrayBuffer to Base64
  let binary = '';
  const bytes = new Uint8Array(buffer);
  const len = bytes.byteLength;
  for (let i = 0; i < len; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return 'compressed:' + btoa(binary);
}

async function decompress(compressedStr: string): Promise<string> {
  if (!compressedStr.startsWith('compressed:')) return compressedStr;
  
  const base64 = compressedStr.replace('compressed:', '');
  const binary = atob(base64);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) {
    bytes[i] = binary.charCodeAt(i);
  }

  const stream = new ReadableStream({
    start(controller) {
      controller.enqueue(bytes);
      controller.close();
    },
  }).pipeThrough(new DecompressionStream('gzip'));

  const response = new Response(stream);
  return await response.text();
}


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

/**
 * Enhanced Redis methods with transparent compression support.
 * Use these for large payloads like article archives.
 */
export async function getWithCompression<T>(key: string): Promise<T | null> {
  try {
    const raw = await redis.get(key) as string | null;
    if (!raw) return null;
    
    // If it starts with our prefix, decompress
    if (typeof raw === 'string' && raw.startsWith('compressed:')) {
      const decompressed = await decompress(raw);
      return JSON.parse(decompressed) as T;
    }
    
    // Fallback: It might be raw JSON (uncompressed)
    return (typeof raw === 'string' ? JSON.parse(raw) : raw) as T;
  } catch (e) {
    console.error(`Redis Get/Decompress Error [${key}]:`, e);
    return null;
  }
}

export async function setWithCompression(key: string, value: any, options?: { ex?: number }): Promise<string> {
  try {
    const json = JSON.stringify(value);
    const redisOptions = options?.ex ? { ex: options.ex } as const : undefined;
    
    // Only compress if payload is significant (> 1KB)
    if (json.length > 1024) {
      const compressed = await compress(json);
      return await redis.set(key, compressed, redisOptions as any) as string;
    }
    
    return await redis.set(key, json, redisOptions as any) as string;
  } catch (e) {
    console.error(`Redis Set/Compress Error [${key}]:`, e);
    const redisOptions = options?.ex ? { ex: options.ex } as const : undefined;
    // Fallback to uncompressed if possible, or throw
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
