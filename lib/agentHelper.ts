import { draftDb } from '@/lib/draftsDb';

const AGENT_URL = process.env.AGENT_URL || 'https://article-agent-zk00.onrender.com';

/**
 * Why build CALLBACK_URL from env instead of hardcoding:
 * A hardcoded secret (like '?secret=sherly') is committed to the repository and visible
 * to anyone with git access. Using WEBHOOK_SECRET / ADMIN_SECRET from env vars ensures
 * the secret is never stored in source control and can be rotated without a code deploy.
 *
 * Why WEBHOOK_SECRET falls back to ADMIN_SECRET:
 * Both guard the same webhook endpoint. Keeping a single secret for both avoids
 * secret sprawl while still allowing a dedicated WEBHOOK_SECRET when needed.
 *
 * Why we throw instead of silently falling back:
 * A misconfigured callback URL causes the Python agent to fire results into a broken
 * endpoint, leaving articles stuck in 'generating' forever with no error. Failing loudly
 * at call-time surfaces the misconfiguration immediately.
 */
function buildCallbackUrl(): string {
  // 1. Prefer an explicitly configured full callback URL (easiest override in production).
  if (process.env.DASHBOARD_CALLBACK_URL) {
    return process.env.DASHBOARD_CALLBACK_URL;
  }

  // 2. Build from base site URL + whichever secret is configured.
  const webhookSecret = process.env.WEBHOOK_SECRET || process.env.ADMIN_SECRET;
  if (!webhookSecret) {
    // Fail-closed: do not call the agent without a valid callback URL.
    throw new Error(
      '[agentHelper] Configuration Error: WEBHOOK_SECRET (or ADMIN_SECRET) must be set. ' +
      'The agent callback URL cannot be built without a secret.'
    );
  }

  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://arabiakhaleej.com';
  return `${baseUrl}/api/webhook?secret=${encodeURIComponent(webhookSecret)}`;
}

/**
 * Shared helper to trigger the external article generation agent.
 * This ensures the topic is added to the Redis draft queue before calling the agent,
 * and updates the status to 'error' if the external agent fails immediately.
 * 
 * @param topic The trending or manually inputted topic to generate an article for.
 */
export async function triggerAgentGeneration(topic: string) {
  // Build the callback URL dynamically (throws if secrets are not configured)
  const callbackUrl = buildCallbackUrl();

  // Create initial tracking draft with a 7-day TTL so orphaned 'generating' entries
  // do not accumulate forever if the agent never responds or errors silently.
  // Why 7 days: enough runway for any delayed agent run while preventing perpetual Redis pollution.
  await draftDb.setDraft(topic, {
    topic,
    status: 'generating',
    timestamp: Date.now()
  }, { ttlSeconds: 60 * 60 * 24 * 7 }); // 7 days

  // Forward the request to the Python generation agent
  const res = await fetch(`${AGENT_URL}/v1/generate`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      topic,
      callback_url: callbackUrl
    })
  });

  if (!res.ok) {
    // Why self-healing state: If the Python agent rejects our request, we immediately update
    // the status of the topic in Redis to 'error' to avoid leaving the dashboard in a perpetual 'generating' state.
    console.error(`[generate] External article agent rejected generation for: "${topic}". Status: ${res.status}`);
    // Keep errored drafts for 2 days so admins can investigate, then auto-clean.
    // Why 2 days instead of 7: error drafts have no useful content to review or publish;
    // shorter TTL avoids dashboard clutter from stale failures.
    await draftDb.setDraft(topic, { 
      topic, 
      status: 'error', 
      error: `Agent rejected with status: ${res.status}`, 
      timestamp: Date.now() 
    }, { ttlSeconds: 60 * 60 * 24 * 2 }); // 2 days
    throw new Error(`Agent rejected request with status: ${res.status}`);
  }
}
