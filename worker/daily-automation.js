/**
 * Arabia Khaleej — Cloudflare Automation Worker
 *
 * Responsibilities:
 *   1. Once every hour → Call /api/cron/generate to trigger one article generation.
 *   
 *   WHY ONCE EVERY HOUR:
 *   The cron schedule triggers every hour (0 * * * *) to keep the feed extremely fresh.
 *   Since the Render free-tier container spins down after 15 minutes of inactivity,
 *   it will be cold when this cron triggers. Our pre-flight wake-up ping is essential
 *   here to wake the Render container first.
 *
 * Why we check event.cron string matching:
 *   Cloudflare delivers the normalized cron expression to `event.cron`. Since we only
 *   have a single cron trigger "0 * * * *" registered in wrangler-automation.toml,
 *   we check if event.cron matches this exactly to confirm a generation tick.
 *
 * Why we run the pre-flight ping first:
 *   Waking up Render takes 30-50 seconds. Workers have generous execution limits (up to 15 min),
 *   allowing us to wait for the spin-up here. Next.js edge functions have a strict 25-second limit;
 *   pinging Render first ensures Next.js won't time out.
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
    // We check for "0 * * * *" since the cron schedule triggers once every hour.
    const isGenerationTick = event.cron === "0 * * * *";

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
        const duration = (Date.now() - pingStartTime) / 1000;
        console.log(`[automation] Render agent wake-up ping responded with status ${pingRes.status} in ${duration.toFixed(2)}s.`);

        // Why a 3-second delay for cold starts:
        // If the ping took more than 2 seconds, it indicates a cold start where Render is booting the container.
        // Even after the port is open and responds 200, the internal Python WSGI/ASGI application worker inside
        // may still be completing its worker boot sequence or experience initial CPU-throttling.
        // A 3-second breathing room guarantees the application is fully idle and ready for heavy POST requests.
        if (duration > 2.0) {
          console.log('[automation] Cold start detected. Giving the Render agent 3 seconds of breathing room...');
          await new Promise((resolve) => setTimeout(resolve, 3000));
        }
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
