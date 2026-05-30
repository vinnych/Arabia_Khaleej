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

      // ── Pre-flight Wake-up Ping for Render Agent ───────────────────
      // Why: Render's free tier automatically spins down the Python article-agent container after 15 minutes of inactivity.
      // Waking up the container (a "cold start") can take 30-50 seconds.
      // If we directly trigger the Next.js generation route, it will fetch the Render agent and block waiting for it.
      // Since the Next.js route runs in an Edge function, it has a strict 25-second execution limit and will time out (504 Gateway Timeout).
      // By sending a direct, pre-flight wake-up ping from the Cloudflare Worker first, we can leverage the Worker's very generous
      // scheduled-event execution time limit (up to 15 minutes) to wait for the cold start.
      // Once the ping completes, the Render agent is warm, and the subsequent Next.js route call will succeed instantly (< 1s).
      const agentHealthUrl = env.AGENT_URL ? `${env.AGENT_URL}/` : AGENT_HEALTH_URL;
      console.log(`[automation] Sending pre-flight wake-up ping to Render agent at ${agentHealthUrl} ...`);
      try {
        const pingStartTime = Date.now();
        const pingRes = await fetch(agentHealthUrl, {
          method: 'GET',
          headers: {
            'User-Agent': 'ArabiaKhaleej-AutomationWorker/1.0',
          },
          // Why 60 seconds: Waking up a cold Render container can take 30-50 seconds.
          // A 60s timeout provides ample runway to handle the slow spin-up.
          signal: AbortSignal.timeout(60_000),
        });
        const duration = ((Date.now() - pingStartTime) / 1000).toFixed(2);
        console.log(`[automation] Render agent wake-up ping responded with status ${pingRes.status} in ${duration}s.`);
      } catch (pingErr) {
        // Why we catch and warn instead of throwing:
        // Even if the ping fails due to a temporary network blip or DNS resolution issue, we still want to attempt
        // to call the generation endpoint to ensure the system is self-healing and has the best chance to succeed.
        console.warn(`[automation] Warning: Render agent wake-up ping failed or timed out: ${pingErr?.message || pingErr}. Proceeding with generation call anyway.`);
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
