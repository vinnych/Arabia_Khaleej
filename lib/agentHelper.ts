import { draftDb } from '@/lib/draftsDb';

const AGENT_URL = process.env.AGENT_URL || 'https://article-agent-zk00.onrender.com';
const CALLBACK_URL = process.env.DASHBOARD_CALLBACK_URL || 'https://arabiakhaleej.com/api/webhook?secret=sherly';

/**
 * Shared helper to trigger the external article generation agent.
 * This ensures the topic is added to the Redis draft queue before calling the agent,
 * and updates the status to 'error' if the external agent fails immediately.
 * 
 * @param topic The trending or manually inputted topic to generate an article for.
 */
export async function triggerAgentGeneration(topic: string) {
  // Create initial tracking draft
  await draftDb.setDraft(topic, {
    topic,
    status: 'generating',
    timestamp: Date.now()
  });

  // Forward the request to the Python generation agent
  const res = await fetch(`${AGENT_URL}/v1/generate`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      topic,
      callback_url: CALLBACK_URL
    })
  });

  if (!res.ok) {
    // Why self-healing state: If the Python agent rejects our request, we immediately update
    // the status of the topic in Redis to 'error' to avoid leaving the dashboard in a perpetual 'generating' state.
    console.error(`[generate] External article agent rejected generation for: "${topic}". Status: ${res.status}`);
    await draftDb.setDraft(topic, { 
      topic, 
      status: 'error', 
      error: `Agent rejected with status: ${res.status}`, 
      timestamp: Date.now() 
    });
    throw new Error(`Agent rejected request with status: ${res.status}`);
  }
}
