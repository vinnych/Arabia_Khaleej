/**
 * Cloudflare Worker for Daily Automation
 * 
 * Responsibilities:
 * 1. Ping the external agent (Render) to keep it awake (prevent 50s cold starts).
 * 2. Ping the /api/cron/generate Next.js route to trigger article generation.
 */

export default {
  // Add a simple fetch handler so visiting the URL in a browser doesn't throw an error
  async fetch(request, env, ctx) {
    return new Response("Arabia Khaleej Automation Worker is active and running on a schedule.", { status: 200 });
  },

  async scheduled(event, env, ctx) {
    console.log(`Cron triggered: ${event.cron}`);

    // If the cron schedule is the 14-minute one, ping Render health to keep awake.
    if (event.cron === "*/14 * * * *") {
      console.log("Pinging Render to keep agent awake...");
      try {
        const res = await fetch("https://article-agent-zk00.onrender.com/");
        console.log(`Render responded with status: ${res.status}`);
      } catch (err) {
        console.error("Failed to ping Render:", err);
      }
    } 
    // If the cron schedule is the 30-minute one, trigger generation (2 articles an hour).
    else if (event.cron === "*/30 * * * *") {
      console.log("Triggering article generation...");
      try {
        // Construct URL with secret. 
        // Wait: The next.js route also checks authorization headers which is safer!
        const generateUrl = `https://arabiakhaleej.com/api/cron/generate`;
        const res = await fetch(generateUrl, {
          headers: {
            'Authorization': `Bearer ${env.CRON_SECRET}`
          }
        });
        const data = await res.json().catch(() => ({}));
        console.log(`Generation trigger status: ${res.status}`, data);
      } catch (err) {
        console.error("Failed to trigger generation:", err);
      }
    } 
    else {
      // Fallback if the cron string doesn't match perfectly
      console.log(`Fallback executing all tasks for cron: ${event.cron}`);
    }
  }
};
