/**
 * Arabia Khaleej — Redis Cache Layer (Edge-safe)
 * Auto-detects provider: Upstash REST, Standalone, or Memory.
 */

import * as zlib from 'fflate';

async function decompress(compressedStr: string): Promise<string> {
  if (!compressedStr.startsWith('compressed:')) return compressedStr;
  const base64 = compressedStr.replace('compressed:', '');
  const binary = atob(base64);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i);
  return new TextDecoder().decode(zlib.gunzipSync(bytes));
}

async function compress(data: string): Promise<string> {
  const uint8Array = new TextEncoder().encode(data);
  const gzipped    = zlib.gzipSync(uint8Array);
  let binary = '';
  const bytes = new Uint8Array(gzipped);
  for (let i = 0; i < bytes.byteLength; i++) binary += String.fromCharCode(bytes[i]);
  return 'compressed:' + btoa(binary);
}

type Backend = 'upstash' | 'standalone' | 'memory';

const BACKEND: Backend = (() => {
  if (process.env.REDIS_URL) return 'standalone';
  if (process.env.UPSTASH_REDIS_REST_URL && process.env.UPSTASH_REDIS_REST_TOKEN) return 'upstash';
  return 'memory';
})();

interface RedisLike {
  get(key: string): Promise<string | null>;
  set(key: string, value: any, options?: { ex?: number; nx?: boolean }): Promise<string | null>;
  del(key: string): Promise<number>;
  keys(pattern: string): Promise<string[]>;
  incr(key: string): Promise<number>;
  expire(key: string, seconds: number): Promise<number>;
  lrange(key: string, start: number, stop: number): Promise<string[] | null>;
  lpush(key: string, value: string): Promise<number>;
}

const memoryCache: Record<string, { value: any; expiresAt: number }> = {};

const memoryClient: RedisLike = {
  async get(key: string) {
    const c = memoryCache[key];
    return (c && c.expiresAt > Date.now()) ? c.value : null;
  },
  async set(key: string, value: any, options?: { ex?: number; nx?: boolean }) {
    if (options?.nx && memoryCache[key] && memoryCache[key].expiresAt > Date.now()) {
      return null;
    }
    memoryCache[key] = { value, expiresAt: Date.now() + ((options?.ex || 3600) * 1000) };
    return 'OK';
  },
  async del(key: string) { delete memoryCache[key]; return 1; },
  async keys(_p: string) { return Object.keys(memoryCache); },
  async incr(key: string) {
    const c = memoryCache[key] ?? { value: 0, expiresAt: Date.now() + 60000 };
    c.value++;
    memoryCache[key] = c;
    return c.value;
  },
  async expire(key: string, s: number) {
    if (memoryCache[key]) memoryCache[key].expiresAt = Date.now() + s * 1000;
    return 1;
  },
  async lrange(key: string, start: number, stop: number) {
    const c = memoryCache[key];
    if (!c || !Array.isArray(c.value)) return [];
    return c.value.slice(start, stop + 1);
  },
  async lpush(key: string, value: string) {
    const c = memoryCache[key] ?? { value: [], expiresAt: Date.now() + 60000 };
    if (!Array.isArray(c.value)) c.value = [];
    c.value.unshift(value);
    memoryCache[key] = c;
    return c.value.length;
  },
};

import { Redis as UpstashRedisClient } from '@upstash/redis';

const upstashClient: RedisLike | null = (
  process.env.UPSTASH_REDIS_REST_URL && process.env.UPSTASH_REDIS_REST_TOKEN
) ? new UpstashRedisClient({
    url:    process.env.UPSTASH_REDIS_REST_URL,
    token:  process.env.UPSTASH_REDIS_REST_TOKEN,
    // fetch override is supported at runtime by the internal requester
    fetch: (url: any, init: any) => fetch(url, { ...init, cache: 'no-store' })
  } as any) : null;

type NodeHelpers = {
  redis: RedisLike;
  getWithCompression: <T>(k: string) => Promise<T | null>;
  setWithCompression: (k: string, v: any, o?: { ex?: number; nx?: boolean }) => Promise<string | null>;
  compressValue:  (d: unknown) => string;
  decompressValue: (s: string) => unknown;
  rateLimit: (ip: string, limit?: number, ws?: number, r?: string) => Promise<{ success: boolean; current: number; limit: number }>;
};

let nodeHelpers: NodeHelpers | null = null;

// Silent patching: Node.js helpers are injected at startup by lib/redis-node.ts.
// No logging on success to keep production logs clean.
export function _patchRedisModule(helpers: NodeHelpers) {
  nodeHelpers = helpers;
}

// Why dynamic import instead of static: Next.js Edge Runtime compiles files statically and will crash if a file
// directly or indirectly imports Node.js-only packages like 'ioredis' (which relies on 'net' and 'tls' libraries).
// Dynamically importing './redis-node' conditionally at runtime ensures 'ioredis' is only loaded in traditional Node.js
// environments where those builtins are supported, preserving seamless Edge compilation.
if (BACKEND === 'standalone' && typeof window === 'undefined') {
  import('./redis-node').catch((err) => {
    console.error('[redis] Standalone Redis provider initialization failed:', err);
  });
}

function getStandaloneRedis(): RedisLike | undefined {
  return nodeHelpers?.redis;
}

function resolveRedis(): RedisLike {
  if (BACKEND === 'standalone') {
    const r = getStandaloneRedis();
    if (r) return r;
    console.warn('[redis] Standalone backend requested but Node.js helpers not loaded. ' +
      'Falling back to memory.  REDIS_URL:', process.env.REDIS_URL ?? '(unset)');
  }
  if (BACKEND === 'upstash' && upstashClient) return upstashClient;
  return memoryClient;
}

export const redis = new Proxy({} as RedisLike, {
  get(_t, prop: string) {
    return resolveRedis()[prop as keyof RedisLike];
  },
}) as RedisLike;

export async function getWithCompression<T>(key: string): Promise<T | null> {
  try {
    const raw = await redis.get(key);
    if (!raw) return null;
    if (typeof raw === 'string' && raw.startsWith('compressed:')) {
      return JSON.parse(await decompress(raw)) as T;
    }
    return (typeof raw === 'string' ? JSON.parse(raw) : raw) as T;
  } catch (e) {
    console.error(`[redis] Get Error [${key}]:`, e);
    return null;
  }
}

export async function setWithCompression(
  key: string,
  value: any,
  options?: { ex?: number; nx?: boolean }
): Promise<string | null> {
  try {
    const json = JSON.stringify(value);
    if (json.length > 1024) {
      return await redis.set(key, await compress(json), options);
    }
    return await redis.set(key, json, options);
  } catch (e) {
    console.error(`[redis] Set Error [${key}]:`, e);
    return await redis.set(key, value, options);
  }
}

export function compressValue(data: unknown): string {
  const json = JSON.stringify(data);
  if (json.length < 1024) return json;
  const uint8Array = new TextEncoder().encode(json);
  const compressed = zlib.gzipSync(uint8Array);
  let binary = '';
  const bytes = new Uint8Array(compressed);
  for (let i = 0; i < bytes.byteLength; i++) binary += String.fromCharCode(bytes[i]);
  return 'compressed:' + btoa(binary);
}

export function decompressValue(str: string): unknown {
  if (typeof str !== 'string') return str;
  if (str.startsWith('compressed:')) {
    const base64 = str.replace('compressed:', '');
    const binary = atob(base64);
    const bytes = new Uint8Array(binary.length);
    for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i);
    return JSON.parse(new TextDecoder().decode(zlib.gunzipSync(bytes)));
  }
  return JSON.parse(str);
}

export async function rateLimit(
  ip: string,
  limit: number = 10,
  windowSeconds: number = 60,
  route = 'global'
) {
  const key = `ratelimit:${route}:${ip}`;
  const current = await redis.incr(key);
  if (current === 1) await redis.expire(key, windowSeconds);
  return { success: current <= limit, current, limit };
}

export const CACHE_TIMES = {
  INSIGHTS: 3600,
  INSIGHTS_ARCHIVE: 2592000,
  MARKET: 1800,
  FX: 1800,
};

export default redis;
