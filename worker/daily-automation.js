/**
 * Arabia Khaleej — Daily Automation Worker (Cloudflare)
 * Drives the agentic workflow by calling /api/workflow/daily.
 * All logic lives in the Next.js edge API routes.
 * This Worker is a lightweight cron trigger — it POSTs to the
 * workflow runner and returns the isolated result.
 */
export default {
  async scheduled(event, env, ctx) {
    ctx.waitUntil(handleAutomation(env).catch((err) => {
      console.error('[Worker] handleAutomation fatal error:', err.message);
    }));
  },

  async fetch(request, env) {
    const { searchParams } = new URL(request.url);
    if (searchParams.get('secret') !== env.CRON_SECRET) {
      return new Response('Unauthorized', { status: 401 });
    }
    try {
      const result = await handleAutomation(env);
      return new Response(JSON.stringify(result), {
        headers: { 'Content-Type': 'application/json' },
      });
    } catch (err) {
      console.error('[Worker] handleAutomation threw:', err.message);
      return new Response(JSON.stringify({ success: false, error: err.message }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      });
    }
  },
};

/**
 * Workflow Base URL — points to the Cloudflare Pages origin that
 * serves the Next.js app (including /api/workflow/* routes).
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

  console.log('[Worker] ==== Workflow run START ====');
  console.log('[Worker] Base URL: ' + baseUrl);
  console.log('[Worker] Triggering POST to ' + workflowUrl);

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
      throw new Error('Workflow trigger HTTP ' + triggerRes.status + ': ' + errText);
    }

    const triggerData = await triggerRes.json();
    console.log('[Worker] Init step=' + triggerData.step +
      ' summary=' + (triggerData.summary || 'n/a') +
      ' wid=' + (triggerData.workflowId || 'n/a'));

    // -- Drive node chain until complete --
    let current = triggerData;
    const steps = [];
    const MAX_STEPS = 20;

    while (current.nextAction?.type === 'fetch' && steps.length < MAX_STEPS) {
      const action = current.nextAction;
      steps.push(action.url);

      console.log('[Worker] === Step ' + steps.length + ' ===');
      console.log('[Worker] From=' + current.step + ' To=' + action.url + ' method=' + (action.method || 'GET'));

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
          console.error('[Worker] Step failed HTTP=' + nodeRes.status + ' body=' + errText);
          throw new Error('Node ' + action.url + ' HTTP ' + nodeRes.status + ': ' + errText);
        }

        current = await nodeRes.json();
        console.log('[Worker] Step result: step=' + current.step +
          ' ok=' + current.ok +
          ' summary=' + (current.summary || 'n/a') +
          ' nextAction=' + (current.nextAction ? current.nextAction.type : 'DONE'));
      } catch (nodeErr) {
        console.error('[Worker] === chain FAILED at step ' + steps.length + ' ===');
        console.error('[Worker] Node error:', nodeErr.message);
        console.error('[Worker] Steps completed:', steps.length);
        break;
      }
    }

    const duration = Math.floor((Date.now() - startTime) / 1000);
    const finalOk = current.ok !== false;

    console.log('[Worker] ==== Workflow run END =======================');
    console.log('[Worker] Duration: ' + duration + 's | steps: ' + steps.length +
      ' | finalStep: ' + current.step + ' | ok: ' + finalOk);

    if (!finalOk) {
      console.error('[Worker] FAILED step=' + current.step + ' error=' + (current.error || current.summary || 'unknown'));
      return {
        success: false,
        error: current.error || current.summary || 'Unknown workflow error',
        duration: duration + 's',
        workflowId: (current.state && current.state.workflowId) || triggerData.workflowId,
        stepsRun: steps.length,
        finalStep: current.step,
        stepSummary: current.summary || 'failed',
      };
    }

    return {
      success: true,
      duration: duration + 's',
      workflowId: (current.state && current.state.workflowId) || triggerData.workflowId,
      stepsRun: steps.length,
      nodePath: steps,
      finalStep: current.step,
      summaries: [triggerData.summary, ...steps.slice(1).map((_, i) => (current.summary || '')).filter(Boolean)],
      articles: (current.state && current.state.articles)
        ? current.state.articles.map((a: { id: string; title: string; lang?: string; policyResult?: string; qualityScore?: number; status?: string }) => ({
            id: a.id,
            title: a.title,
            lang: a.lang || 'en',
            policy: a.policyResult,
            score: a.qualityScore,
            status: a.status,
          }))
        : [],
    };
  } catch (error) {
    console.error('[Worker] FATAL:', error.message);
    return { success: false, error: error.message };
  }
}
