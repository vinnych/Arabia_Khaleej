/**
 * Arabia Khaleej — Redis Node.js Provider
 * ioredis factory for Node.js-only targets. NEVER import from Edge runtime.
 */

interface StandaloneNode {
  getStandaloneRedis(): any;
  getWithCompression<T>(key: string): Promise<T | null>;
  setWithCompression(key: string, value: any, options?: { ex?: number }): Promise<string>;
  compressValue(data: unknown): string;
  decompressValue(str: string): unknown;
  rateLimit(ip: string, limit?: number, windowSeconds?: number, route?: string): Promise<{ success: boolean; current: number; limit: number }>;
  loadWorkflowState(wid: string): Promise<any>;
  saveWorkflowState(wid: string, state: any): Promise<string | null>;
  deleteWorkflow(wid: string): Promise<void>;
  bumpTtl(wid: string): Promise<void>;
}

let _rawRedis: any = null;
let _realRedis: any = null;
let _redisDirect: any = null;

export function getStandaloneRedisNode(): any {
  if (_rawRedis) return _rawRedis;

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

interface ArticleData {
  workflowId?: string;
  step?: string;
  workflowStatus?: string;
  createdAt?: string;
  updatedAt?: string;
  currentIndex?: number;
  articles?: any[];
  trendingTopics?: any[];
  errors?: string[];
  hasGroqApiKey?: boolean;
  runCount?: number;
  adminSecret?: string;
}

const PREFIX = 'wf:';
const TTL = parseInt(process.env.WORKFLOW_TTL || '21600', 10);

export async function loadWorkflowState(wid: string): Promise<ArticleData | null> {
  const raw = await (getWithCompression as any)(PREFIX + wid);
  if (!raw) return null;
  return raw as ArticleData;
}

export async function saveWorkflowState(wid: string, state: ArticleData): Promise<string | null> {
  try {
    return await setWithCompression(PREFIX + wid, state, { ex: TTL });
  } catch (err) {
    console.error('Failed to save article draft ' + wid + ':', err);
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

// Initialize redis connection synchronously at module load time.
// We assign to both _redisDirect and _rawRedis to ensure getWithCompression
// and other functions have immediate access without waiting for async init.
const conn = getStandaloneRedisNode();
_redisDirect = conn;
_rawRedis = conn;

const _fns: StandaloneNode = {
  getStandaloneRedis: getStandaloneRedisNode,
  getWithCompression,
  setWithCompression,
  compressValue,
  decompressValue,
  rateLimit,
  loadWorkflowState,
  saveWorkflowState,
  deleteWorkflow,
  bumpTtl,
};

// @ts-expect-error — _patchRedisModule is injected by lib/redis.ts at startup
_patchRedisModule?.(_fns);

export default _fns;
