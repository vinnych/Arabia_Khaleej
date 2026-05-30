/**
 * Arabia Khaleej — Cloudflare Automation Worker
 *
 * Responsibilities:
 *   1. Every ~15 min  → Call /api/cron/generate to trigger one article generation.
 *   
 *   WHY 15 MINUTES IS THE IDEAL INTERVAL:
 *   Because Render's free tier inactivity timeout is exactly 15 minutes, triggering 
 *   an article generation every 15 minutes ensures the Render agent naturally stays 
 *   warm 24/7. This completely eliminates cold starts without requiring separate 
 *   keep-alive triggers.
 *
 * Why we no longer use event.cron string matching:
 *   Cloudflare delivers the cron expression to `event.cron` but the exact string format
 *   (whitespace, normalisation) is not guaranteed to match what's in wrangler-automation.toml.
 *   A mismatch causes the if/else if to fall through to the no-op fallback block, silently
 *   skipping all work. Instead, we derive intent from `Date.now()` — if the current minute
 *   is divisible by 15 we generate; otherwise we just ping Render. This makes the worker
 *   resilient to any cron string normalisation Cloudflare may apply.
 *
 * Why both tasks run on the 15-min tick:
 *   The Render ping is cheap (< 1 s, no side-effects) so we always run it first as a sanity check.
 *   Generation is triggered every 15 min.
 */

const AGENT_HEALTH_URL = 'https://article-agent-zk00.onrender.com/';
const GENERATE_URL = 'https://arabiakhaleej.com/api/cron/generate';

export default {
  // Simple health-check handler so visiting the Worker URL in a browser works.
  async fetch(request, env, ctx) {
    return new Response(
      JSON.stringify({
        status: 'ok',
        worker: 'arabiakhaleej-automation',
        message: 'Automation Worker is active and running on a cron schedule.',
        cron_secret_configured: !!env.CRON_SECRET,
      }),
      {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      }
    );
  },

  async scheduled(event, env, ctx) {
    console.log(`[automation] Cron fired. event.cron="${event.cron}" scheduledTime=${new Date(event.scheduledTime).toISOString()}`);

    if (!env.CRON_SECRET) {
      console.error(
        '[automation] CRITICAL: CRON_SECRET is not set on this Worker. ' +
        'Run: npx wrangler secret put CRON_SECRET --config worker/wrangler-automation.toml'
      );
    }

    // Route logic based on the cron expression that triggered the event.
    // Cloudflare normalizes the cron string to remove extra whitespace.
    const isGenerationTick = event.cron === "*/15 * * * *";

    if (isGenerationTick) {
      // ── Generation Trigger ───────────────────
      if (!env.CRON_SECRET) {
        console.error('[automation] Skipping generation: CRON_SECRET is undefined. Set it via wrangler secret.');
        return;
      }

      console.log(`[automation] Generation tick at ${new Date(event.scheduledTime).toISOString()}. Calling ${GENERATE_URL} ...`);
      try {
        const genRes = await fetch(GENERATE_URL, {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${env.CRON_SECRET}`,
            'User-Agent': 'ArabiaKhaleej-AutomationWorker/1.0',
          },
          signal: AbortSignal.timeout(25_000),
        });

        const body = await genRes.json().catch(() => ({ _raw: 'non-JSON response' }));
        console.log(`[automation] Generation trigger result: HTTP ${genRes.status}`, JSON.stringify(body));

        if (!genRes.ok) {
          console.error(`[automation] Generation endpoint returned error status ${genRes.status}. Check /api/cron/generate logs.`);
        }
      } catch (err) {
        console.error('[automation] Generation fetch failed:', err?.message || err);
      }
    } else {
      console.log(`[automation] Unrecognized cron tick: ${event.cron}`);
    }
  },
};
