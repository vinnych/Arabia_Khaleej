/**
 * @file lib/redis-node.ts
 * @module Redis · Node.js Standalone Provider
 * @description Arabia Khaleej — ioredis factory for Node.js-only targets.
 *
 * NEVER import this file from any Edge runtime route.
 * It is only imported into Node.js-targeted API routes; `require('ioredis')`
 * will fail on Edge / Cloudflare Workers.
 *
 * Marked `serverExternalPackages: ['ioredis']` in next.config.ts so that
 * Next.js leaves the package external — it is resolved at runtime, not at
 * build time.
 *
 * ## Hot-swap contract
 *
 * This module MUST call `_patchRedisModule(this)` at module evaluation time
 * so that `lib/redis.ts`'s edge-safe shim is replaced with the real
 * Node.js implementation before any API handler code runs.
 */

// ---------------------------------------------------------------------------
// Implementation interface (mirrors lib/redis.ts StandaloneNode)
// ---------------------------------------------------------------------------

interface StandaloneNode {
  getStandaloneRedis(): any;
  getWithCompression<T>(key: string): Promise<T | null>;
  setWithCompression(key: string, value: any, options?: { ex?: number }): Promise<string>;
  compressValue(data: unknown): string;
  decompressValue(str: string): unknown;
  rateLimit(ip: string, limit?: number, windowSeconds?: number, route?: string): Promise<{ success: boolean; current: number; limit: number }>;

  // workflow helpers (forwarded from lib/workflow/utils)
  loadWorkflowState(wid: string): Promise<any>;
  saveWorkflowState(wid: string, state: any): Promise<string | null>;
  deleteWorkflow(wid: string): Promise<void>;
  bumpTtl(wid: string): Promise<void>;
}

// ---------------------------------------------------------------------------
// Singleton implementation  (initialised exactly once)
// ---------------------------------------------------------------------------

// Will be the real ioredis instance once `getStandaloneRedisNode()` succeeds
let _rawRedis: any = null;

// The real Redis singleton this module owns (used directly by module-level
// workflow helpers below, bypassing the lib/redis.ts proxy entirely)
let _redisNode: StandaloneNode | null = null;

/** The shared `redis` object that lib/redis.ts will swap its proxy to forward to */
let _realRedis: any = null;

/** Direct RedisLike instance used by this module (avoids proxy round-trips) */
let _redisDirect: any = null;

// ---------------------------------------------------------------------------
// ioredis connection
// ---------------------------------------------------------------------------

export function getStandaloneRedisNode(): any {
  if (_rawRedis) return _rawRedis;

  // `require('ioredis')` — dynamic so webpack does not statically resolve Node.js builtins
  const Redis = require('ioredis');
  const url = process.env.REDIS_URL || 'redis://localhost:6379';

  _rawRedis = new Redis(url, {
    lazyConnect: true,
    connectTimeout: 5000,
    commandTimeout: 5000,
    maxRetriesPerRequest: 2,
    retryStrategy(times: number) { return Math.min(times * 500, 5000); },
  });

  _rawRedis.on('error', (err: Error) => {
    console.warn('[redis-node] Connection error:', err.message);
  });

  _rawRedis.on('connect', () => {
    console.log('[redis-node] Connected to', url);
  });

  _rawRedis.connect().catch((err: Error) => {
    console.warn('[redis-node] Connect failed (will retry):', err.message);
  });

  return _rawRedis;
}

// ---------------------------------------------------------------------------
// Compiled helpers
// ---------------------------------------------------------------------------

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
  const compressed = zlib.gzipSync(uint8Array);
  let binary = '';
  const bytes = new Uint8Array(compressed);
  for (let i = 0; i < bytes.byteLength; i++) binary += String.fromCharCode(bytes[i]);
  return 'compressed:' + btoa(binary);
}

// ---------------------------------------------------------------------------
// Compression helpers
// ---------------------------------------------------------------------------

export async function getWithCompression<T>(key: string): Promise<T | null> {
  try {
    const raw = await _redisDirect!.get(key);
    if (!raw) return null;
    if (typeof raw === 'string' && raw.startsWith('compressed:')) {
      return JSON.parse(await decompress(raw)) as T;
    }
    return (typeof raw === 'string' ? JSON.parse(raw) : raw) as T;
  } catch (e) {
    console.error(`[redis-node] Get Error [${key}]:`, e);
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
      return await _redisDirect!.set(key, await compress(json), options);
    }
    return await _redisDirect!.set(key, json, options);
  } catch (e) {
    console.error(`[redis-node] Set Error [${key}]:`, e);
    return await _redisDirect!.set(key, value, options);
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
  const r = _redisDirect ?? getStandaloneRedisNode();
  const key = `ratelimit:${route}:${ip}`;
  const current = await r.incr(key);
  if (current === 1) await r.expire(key, windowSeconds);
  return { success: current <= limit, current, limit };
}

// ---------------------------------------------------------------------------
// Workflow helpers (re-exported from lib/workflow/utils but using _redisDirect)
// ---------------------------------------------------------------------------

interface WorkflowState {
  workflowId: string;
  step: string;
  workflowStatus: string;
  createdAt: string;
  updatedAt: string;
  currentIndex: number;
  articles: any[];
  trendingTopics: any[];
  errors: string[];
  hasGroqApiKey: boolean;
  runCount: number;
  adminSecret: string;
}

const PREFIX = 'wf:';
const TTL = parseInt(process.env.WORKFLOW_TTL || '21600', 10);

export async function loadWorkflowState(wid: string): Promise<WorkflowState | null> {
  const raw = await (getWithCompression as any)(PREFIX + wid);
  if (!raw) return null;
  return raw as WorkflowState;
}

export async function saveWorkflowState(wid: string, state: WorkflowState): Promise<string | null> {
  try {
    return await setWithCompression(PREFIX + wid, state, { ex: TTL });
  } catch (err) {
    console.error('Failed to save workflow state ' + wid + ':', err);
    throw err;
  }
}

export async function bumpTtl(wid: string): Promise<void> {
  try { await _redisDirect!.expire(PREFIX + wid, TTL); } catch (err) {
    console.warn('Failed to bump TTL for workflow ' + wid + ':', err);
  }
}

export async function deleteWorkflow(wid: string): Promise<void> {
  try { await _redisDirect!.del(PREFIX + wid); } catch (err) {
    console.error('Failed to delete workflow ' + wid + ':', err);
  }
}

// ---------------------------------------------------------------------------
// Bootstrap — run at module load time (Node.js only)
// ---------------------------------------------------------------------------

/** Pre-initialise the ioredis connection so all helpers are ready immediately */
getStandaloneRedisNode().then((_conn: any) => {
  _rawRedis   = _conn;
  _redisDirect = _conn;
  _realRedis  = _conn;
  console.log('[redis-node] Connection initialised ✓');
}).catch((err: Error) => {
  console.warn('[redis-node] Async connect error:', err.message);
});

// ---------------------------------------------------------------------------
// Module-level export consumed fully by callers
// ---------------------------------------------------------------------------

const _fns: StandaloneNode = {
  getStandaloneRedis:    getStandaloneRedisNode,
  getWithCompression,
  setWithCompression,
  compressValue,
  decompressValue,
  rateLimit,
  loadWorkflowState:     loadWorkflowState,
  saveWorkflowState,
  deleteWorkflow,
  bumpTtl,
};

/** Hot-swap call: patches lib/redis.ts when this module is first required. */
// @ts-expect-error — _patchRedisModule is injected by lib/redis.ts at startup
_patchRedisModule?.(_fns);

export default _fns;
