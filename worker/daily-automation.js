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
    // Log the raw cron string Cloudflare sends — useful for debugging normalisation issues.
    console.log(`[automation] Cron fired. event.cron="${event.cron}" scheduledTime=${new Date(event.scheduledTime).toISOString()}`);

    // Why CRON_SECRET guard here: if the secret is missing the /api/cron/generate call
    // will return 401 and we waste a Render cold-start ping. Fail fast with a clear log.
    if (!env.CRON_SECRET) {
      console.error(
        '[automation] CRITICAL: CRON_SECRET is not set on this Worker. ' +
        'Run: npx wrangler secret put CRON_SECRET --config worker/wrangler-automation.toml'
      );
      // Still ping Render even without the secret — keeps the agent warm for manual triggers.
    }

    // ── Step 1: Always ping Render to keep the Python agent warm ──────────────
    // Why always, not just on 14-min ticks: the ping is instant and costs nothing.
    // Skipping it on 30-min ticks meant the agent could go cold between generation calls.
    try {
      console.log('[automation] Pinging Render agent health endpoint...');
      const renderRes = await fetch(AGENT_HEALTH_URL, {
        // Why signal/timeout: without a timeout, a hung Render instance could stall
        // the entire Worker execution for up to 30 s, eating into CPU quota.
        signal: AbortSignal.timeout(10_000), // 10 s max
      });
      console.log(`[automation] Render ping responded: HTTP ${renderRes.status}`);
    } catch (err) {
      // Non-fatal — log and continue to the generation step.
      console.error('[automation] Render ping failed (non-fatal):', err?.message || err);
    }

    // ── Step 2: Trigger article generation every 15 minutes ───────────────────
    // Why minute-based check instead of cron string matching:
    //   event.cron is not guaranteed to exactly match the wrangler TOML string after
    //   Cloudflare normalisation. We derive the 15-min boundary from wall-clock time,
    //   which is always reliable.
    //
    // WHY MODULO 15: 
    //   We trigger article generation every 15 minutes (at minutes :00, :15, :30, and :45).
    //   This provides 4 articles per hour while naturally keeping the Render instance warm.
    const minuteOfHour = new Date(event.scheduledTime).getUTCMinutes();
    const isGenerationTick = minuteOfHour % 15 === 0; // true at :00, :15, :30, and :45

    if (isGenerationTick) {
      if (!env.CRON_SECRET) {
        console.error('[automation] Skipping generation: CRON_SECRET is undefined. Set it via wrangler secret.');
        return;
      }

      console.log(`[automation] Generation tick at minute :${minuteOfHour}. Calling ${GENERATE_URL} ...`);
      try {
        const genRes = await fetch(GENERATE_URL, {
          method: 'GET',
          headers: {
            // Why Authorization header instead of query param: the header is not logged
            // in Cloudflare access logs or browser history, making it safer than ?secret=...
            'Authorization': `Bearer ${env.CRON_SECRET}`,
            'User-Agent': 'ArabiaKhaleej-AutomationWorker/1.0',
          },
          signal: AbortSignal.timeout(25_000), // 25 s — RSS fetch + agent dispatch must finish
        });

        // Why parse JSON safely: if the Next.js edge function returns HTML (e.g. 500 error page)
        // calling .json() would throw. We catch silently so the log always shows the raw status.
        const body = await genRes.json().catch(() => ({ _raw: 'non-JSON response' }));
        console.log(`[automation] Generation trigger result: HTTP ${genRes.status}`, JSON.stringify(body));

        if (!genRes.ok) {
          console.error(`[automation] Generation endpoint returned error status ${genRes.status}. Check /api/cron/generate logs.`);
        }
      } catch (err) {
        console.error('[automation] Generation fetch failed:', err?.message || err);
      }
    } else {
      // Non-generation tick — Render ping above is all we needed.
      console.log(`[automation] Keep-alive tick at minute :${minuteOfHour}. No generation this tick.`);
    }
  },
};
