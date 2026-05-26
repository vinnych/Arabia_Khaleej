/**
 * Arabia Khaleej — Daily Automation Cron Trigger Worker
 * Automated scheduler that invokes the Next.js cron API to fetch and generate GCC trends.
 *
 * Why this particular is used:
 * - Running within Cloudflare's serverless Worker ecosystem provides maximum availability and reliability
 *   without incurring the running cost or maintenance overhead of a virtual machine.
 * - Supporting both "scheduled" and "fetch" event interfaces allows the automation to be triggered 
 *   transparently by Cloudflare's native cron scheduler as well as manual webhook calls from the dashboard.
 */

export default {
  // Handler invoked by Cloudflare Cron Trigger schedules
  async scheduled(event, env, ctx) {
    ctx.waitUntil(triggerCron(env));
  },

  // Handler invoked by direct HTTP requests (for manual triggers/testing)
  async fetch(request, env, ctx) {
    const res = await triggerCron(env);
    return new Response(JSON.stringify({ 
      success: res, 
      message: res ? "Cron API triggered successfully." : "Failed to trigger Cron API. See logs."
    }), {
      status: res ? 200 : 500,
      headers: { 
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*"
      }
    });
  }
};

/**
 * Invokes the Next.js endpoint `/api/cron` with the authorized bearer header.
 * Why this approach is used instead of direct LangGraph calls:
 * - Decoupling the worker scheduling from the heavy AI generation graph maintains a lightweight worker runtime.
 * - Delegating the generation execution directly to the Next.js server utilizes Next's built-in Edge/Node route support
 *   and environment variable context safely.
 */
async function triggerCron(env) {
  // Leverage either an environment variable URL or default to the production host
  const baseUrl = env.CRON_TARGET_URL || "https://arabiakhaleej.com";
  const url = `${baseUrl.replace(/\/$/, '')}/api/cron`;
  const secret = env.CRON_SECRET;

  if (!secret) {
    console.error("[cron-worker] Configuration Error: CRON_SECRET is undefined in environment variables.");
    return false;
  }

  try {
    console.log(`[cron-worker] Dispatching GET request to: ${url}`);
    
    const res = await fetch(url, {
      method: "GET",
      headers: {
        "Authorization": `Bearer ${secret}`,
        "User-Agent": "Arabia-Khaleej-Automation-Worker"
      }
    });

    if (!res.ok) {
      const errorText = await res.text().catch(() => "Unknown");
      console.error(`[cron-worker] Generation endpoint rejected trigger. Status: ${res.status} | Output: ${errorText}`);
      return false;
    }

    console.log("[cron-worker] Success: Generation cron pipeline successfully initiated.");
    return true;
  } catch (err) {
    console.error("[cron-worker] Unhandled connection exception encountered:", err);
    return false;
  }
}
