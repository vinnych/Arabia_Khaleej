/**
 * @file lib/redis.ts
 * @module Redis
 * @description Arabia Khaleej — Redis Cache Layer (Edge-safe)
 *
 * ## Provider modes
 *
 * | Mode | Env | Target |
 * |------|-----|--------|
 * | Upstash REST | no `REDIS_URL` | Cloudflare / Edge |
 * | Standalone   | `REDIS_URL` set | Node.js (serverless) |
 * | Memory       | nothing else | any |
 *
 * **Standalone (Node.js):** When `REDIS_URL=redis://localhost:6379` this module
 * imports `lib/redis-node.ts` which in turn `require('ioredis')`.  Because
 * `ioredis` depends on Node.js builtins (`net`, `tls`) it is **never bundled
 * for the Edge build** — webpack never sees a direct import of `ioredis` from
 * any Edge-targeted module and `require('./redis-node')` only fires on Node.js.
 */

// ---------------------------------------------------------------------------
// Compressed-value helpers (pure JS, safe everywhere)
// ---------------------------------------------------------------------------

import * as zlib from 'fflate';

/** Decompress a string produced by {@link compress}. */
async function decompress(compressedStr: string): Promise<string> {
  if (!compressedStr.startsWith('compressed:')) return compressedStr;
  const base64 = compressedStr.replace('compressed:', '');
  const binary = atob(base64);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i);
  return new TextDecoder().decode(zlib.gunzipSync(bytes));
}

/** Compress a string → `compressed:<base64(gzip)>` */
async function compress(data: string): Promise<string> {
  const uint8Array = new TextEncoder().encode(data);
  const gzipped    = zlib.gzipSync(uint8Array);
  let binary = '';
  const bytes = new Uint8Array(gzipped);
  for (let i = 0; i < bytes.byteLength; i++) binary += String.fromCharCode(bytes[i]);
  return 'compressed:' + btoa(binary);
}

// ---------------------------------------------------------------------------
// Redis provider auto-detection
// ---------------------------------------------------------------------------

type Backend = 'upstash' | 'standalone' | 'memory';

const BACKEND: Backend = (() => {
  if (process.env.REDIS_URL) return 'standalone';
  if (process.env.UPSTASH_REDIS_REST_URL && process.env.UPSTASH_REDIS_REST_TOKEN) return 'upstash';
  return 'memory';
})();

console.log('[redis] Backend:', BACKEND,
  BACKEND === 'standalone' ? `(${process.env.REDIS_URL})` :
  BACKEND === 'upstash'   ? '(Upstash REST)' : '(in-memory)');

// ---------------------------------------------------------------------------
// Minimal interface shared by all providers
// ---------------------------------------------------------------------------

interface RedisLike {
  get(key: string):      Promise<string | null>;
  set(key: string, value: any, options?: { ex?: number }): Promise<string>;
  del(key: string):      Promise<number>;
  keys(pattern: string): Promise<string[]>;
  incr(key: string):     Promise<number>;
  expire(key: string, seconds: number): Promise<number>;
}

// ---------------------------------------------------------------------------
// In-memory fallback  (always available)
// ---------------------------------------------------------------------------

const memoryCache: Record<string, { value: any; expiresAt: number }> = {};

const memoryClient: RedisLike = {
  async get(key: string) {
    const c = memoryCache[key];
    return (c && c.expiresAt > Date.now()) ? c.value : null;
  },
  async set(key: string, value: any, options?: { ex?: number }) {
    memoryCache[key] = { value, expiresAt: Date.now() + ((options?.ex || 3600) * 1000) };
    return 'OK';
  },
  async del(key: string)    { delete memoryCache[key]; return 1; },
  async keys(_p: string)    { return Object.keys(memoryCache); },
  async incr(key: string)   {
    const c = memoryCache[key] ?? { value: 0, expiresAt: Date.now() + 60000 };
    c.value++;
    memoryCache[key] = c;
    return c.value;
  },
  async expire(key: string, s: number) {
    if (memoryCache[key]) memoryCache[key].expiresAt = Date.now() + s * 1000;
    return 1;
  },
};

// ---------------------------------------------------------------------------
// Upstash REST  (Edge-safe, no Node.js deps)
// ---------------------------------------------------------------------------

import { Redis as UpstashRedisClient } from '@upstash/redis';

const upstashClient: RedisLike | null = (
  process.env.UPSTASH_REDIS_REST_URL && process.env.UPSTASH_REDIS_REST_TOKEN
) ? new UpstashRedisClient({
    url:    process.env.UPSTASH_REDIS_REST_URL,
    token:  process.env.UPSTASH_REDIS_REST_TOKEN,
  }) : null;

// ---------------------------------------------------------------------------
// Standalone (Node.js)
//
// We store a *stub* that gets replaced at load time by the real instance.
// The stub is an object that forwards every call to the actively-selected
// provider, stashing helpers inside a closure so the Node.js helpers defined
// higher up (in redis-node.ts) get substituted correctly.
// ---------------------------------------------------------------------------

// The Node.js target's concrete helpers — set by _patchRedisModule()
type NodeHelpers = {
  redis: RedisLike;
  getWithCompression: <T>(k: string) => Promise<T | null>;
  setWithCompression: (k: string, v: any, o?: { ex?: number }) => Promise<string>;
  compressValue:  (d: unknown) => string;
  decompressValue: (s: string) => unknown;
  rateLimit: (ip: string, limit?: number, ws?: number, r?: string) => Promise<{ success: boolean; current: number; limit: number }>;
  deleteWorkflow: (wid: string) => Promise<void>;
  saveWorkflowState: (wid: string, s: any) => Promise<string | null>;
  bumpTtl: (wid: string) => Promise<void>;
};

let nodeHelpers: NodeHelpers | null = null;

/** Called once at startup by `lib/redis-node.ts` */
export function _patchRedisModule(helpers: NodeHelpers) {
  nodeHelpers = helpers;
  console.log('[redis-node] Node.js helpers patched');
}

/** The Node.js-backed provider — undefined until `lib/redis-node.ts` loads (Node.js only) */
function getStandaloneRedis(): RedisLike | undefined {
  return nodeHelpers?.redis;
}

// ---------------------------------------------------------------------------
// resolveRedis() — called on every access; picks up the hot-swapped helpers
// ---------------------------------------------------------------------------

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

// ---------------------------------------------------------------------------
// Public singleton — proxy so we can pick up the hot-swap without needing
// a separate re-export statement.
// ---------------------------------------------------------------------------

/** Arabia Khaleej Redis singleton — safe for both Edge and Node.js targets. */
export const redis = new Proxy({} as RedisLike, {
  get(_t, prop: string) {
    return resolveRedis()[prop as keyof RedisLike];
  },
}) as RedisLike;

// ---------------------------------------------------------------------------
// Compression helpers  (edge-safe by themselves; use the proxy when compression
// requires reading from / writing to Redis — i.e. getWithCompression / setWithCompression)
// ---------------------------------------------------------------------------

function compressSame(data: string): Promise<string> { return compress(data); }
function decompressSame(str: string): Promise<string> { return decompress(str); }

export async function getWithCompression<T>(key: string): Promise<T | null> {
  try {
    const raw = await redis.get(key);
    if (!raw) return null;
    if (typeof raw === 'string' && raw.startsWith('compressed:')) {
      return JSON.parse(await decompressSame(raw)) as T;
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
  options?: { ex?: number }
): Promise<string> {
  try {
    const json = JSON.stringify(value);
    if (json.length > 1024) {
      return await redis.set(key, await compressSame(json), options);
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

// ---------------------------------------------------------------------------
// Rate limiter
// ---------------------------------------------------------------------------

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

// ---------------------------------------------------------------------------
// Cache durations
// ---------------------------------------------------------------------------

export const CACHE_TIMES = {
  INSIGHTS: 3600,
  INSIGHTS_ARCHIVE: 2592000,
  MARKET: 1800,
  FX: 1800,
};

export default redis;
