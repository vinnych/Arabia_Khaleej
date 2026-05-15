/**
 * Arabia Khaleej — Daily Automation Worker (Cloudflare)
 * Drives the agentic workflow by calling /api/workflow/daily.
 * All logic lives in the Next.js edge API routes.
 * This Worker is a lightweight cron trigger — it POSTs to the
 * workflow runner and returns the isolated result.
 */
export default {
  async scheduled(event, env, ctx) {
    ctx.waitUntil(handleAutomation(env));
  },

  async fetch(request, env) {
    const { searchParams } = new URL(request.url);
    if (searchParams.get('secret') !== env.CRON_SECRET) {
      return new Response('Unauthorized', { status: 401 });
    }
    return new Response(JSON.stringify(await handleAutomation(env)), {
      headers: { 'Content-Type': 'application/json' },
    });
  },
};

/**
 * Workflow Base URL — points to the Cloudflare Pages origin that
 * serves the Next.js app (including /api/workflow/* routes).
 *
 * Default: the Cloudflare Worker's own Upstash env vars.
 * Production: set WORKFLOW_BASE_URL env in wrangler.toml or CF secrets.
 */
function getWorkflowBaseUrl(env) {
  const explicit = env.WORKFLOW_BASE_URL || 'https://arabiakhaleej.pages.dev';
  return String(explicit).replace(/\/+$/, '');
}

async function handleAutomation(env) {
  const startTime = Date.now();
  const baseUrl = getWorkflowBaseUrl(env);
  const cronSecret = env.CRON_SECRET;
  const adminSecret = env.ADMIN_SECRET;
  const workflowUrl = baseUrl + '/api/workflow/daily';

  console.log('[Workflow] Starting Arabia Khaleej daily automation');
  console.log('[Workflow] Base URL:' + baseUrl);
  console.log('[Workflow] Triggering POST to' + workflowUrl);

try {
    const triggerRes = await fetch(workflowUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + cronSecret,
        'X-Workflow-Source': 'cron-worker',
      },
      body: JSON.stringify({
        articleCount: 3,
        maxRetries: 1,
        adminSecret: adminSecret,
      }),
    });

    if (!triggerRes.ok) {
      const errText = await triggerRes.text().catch(() => 'unknown error');
      throw new Error(
        'Workflow trigger HTTP ' + triggerRes.status + ': ' + errText
      );
    }

    const triggerData = await triggerRes.json();
    console.log('[Workflow] Step 1 (init):', JSON.stringify(triggerData));

// -- Drive node chain until complete ---------------------------
    let current = triggerData;
    const steps = [];
    const MAX_STEPS = 20; // Reduced from 60: 4 steps per article × 5 articles max

    while (current.nextAction?.type === 'fetch' && steps.length < MAX_STEPS) {
      const action = current.nextAction;
      steps.push(action.url);

      console.log('[Workflow] Fetching node:', action.url);
      try {
        const nodeRes = await fetch(action.url, {
          method: action.method || 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + cronSecret,
          },
          body: action.body ? JSON.stringify(action.body) : undefined,
        });

        if (!nodeRes.ok) {
          const errText = await nodeRes.text().catch(() => 'unknown');
          throw new Error(
            'Node ' + action.url + ' HTTP ' + nodeRes.status + ': ' + errText
          );
        }

        current = await nodeRes.json();
        console.log('[Workflow] Next step:', current.step, '|', current.summary);
      } catch (nodeErr) {
        console.error('[Workflow] Node failed:', action.url, nodeErr.message);
        break;
      }
    }

    const duration = Math.floor((Date.now() - startTime) / 1000);
    console.log('[Workflow] Completed in ' + duration + 's | steps:', steps.length);

    return {
      success: true,
      duration: duration + 's',
      workflowId: (current.state && current.state.workflowId) || triggerData.workflowId,
      stepsRun: steps.length,
      nodePath: steps,
      finalStep: current.step,
      summaries: [triggerData.summary, ...steps.slice(1).map((_, i) => (current.summary || '')).filter(Boolean)],
      articles: (current.state && current.state.articles)
        ? current.state.articles.map(a => ({
            id: a.id,
            title: a.title,
            lang: a.lang,
            policy: a.policyResult,
            score: a.qualityScore,
            status: a.status,
          }))
        : [],
    };
  } catch (error) {
    console.error('[Workflow] Failed:', error.message);
    return { success: false, error: error.message };
  }
}


