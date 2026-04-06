import { Redis } from "@upstash/redis";

// Returns null if Upstash is disabled or env vars are not set (local dev without Redis)
function getRedis(): Redis | null {
  if (process.env.ENABLE_UPSTASH === 'true') {
    return null;
  }
  if (!process.env.UPSTASH_REDIS_REST_URL || !process.env.UPSTASH_REDIS_REST_TOKEN) {
    return null;
  }
  try {
    return Redis.fromEnv();
  } catch (err) {
    console.error("[redis] init failed", err);
    return null;
  }
}

export const redis = getRedis();

export const KV_TTL = 60 * 60 * 24 * 30; // 30 days in seconds

/**
 * Returns true when MAINTENANCE_MODE=true is set in env vars.
 * All data-fetching services check this and return empty/null immediately,
 * keeping the page layout intact with graceful empty states.
 * Toggle: set MAINTENANCE_MODE=true in Vercel env vars → redeploy (or restart).
 */
export function isMaintenance(): boolean {
  return process.env.MAINTENANCE_MODE === "true";
}
