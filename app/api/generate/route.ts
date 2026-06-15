import { NextResponse, after } from 'next/server';
import { triggerAgentGeneration } from '@/lib/services/agentHelper';

// NOTE: runtime declaration removed - on Cloudflare Workers with nodejs_compat all routes
// run in the Node.js-compatible Workers runtime, making 'edge' declaration both unnecessary
// and incompatible with @opennextjs/cloudflare (which requires edge routes in separate functions).

export async function POST(req: Request) {
  try {
    const authHeader = req.headers.get('authorization');
    const cronSecret = process.env.CRON_SECRET;
    const adminSecret = process.env.ADMIN_SECRET;

    // Why secure generate route: Without auth checks, anyone could POST random topics,
    // which floods Upstash Redis and calls the external Python generation agent endlessly.
    // Validating against both CRON_SECRET and ADMIN_SECRET allows both the automated cron worker 
    // and administrators (from the dashboard) to securely initiate generation.
    const isCronAuthorized = cronSecret && authHeader === `Bearer ${cronSecret}`;
    const isAdminAuthorized = adminSecret && authHeader === `Bearer ${adminSecret}`;

    if (!isCronAuthorized && !isAdminAuthorized) {
      // Enforce authorization if at least one secret is set in the environment variables (fail-closed in prod)
      if (cronSecret || adminSecret) {
        console.warn('[security] Unauthorized access attempt blocked on /api/generate.');
        return NextResponse.json(
          { error: 'Unauthorized: Invalid or missing bearer token.' }, 
          { status: 401 }
        );
      }
    }

    // Why payload validation: Parsing the JSON body inside a try-catch ensures that
    // malformed or empty payloads do not trigger unhandled internal server exceptions.
    const body = await req.json().catch(() => null);
    if (!body || !body.topic || typeof body.topic !== 'string' || body.topic.trim() === '') {
      return NextResponse.json(
        { error: 'Bad Request: "topic" must be a non-empty string.' }, 
        { status: 400 }
      );
    }
    const topic = body.topic.trim();
    
    // Why unstable_after: Next.js 15 after() executes the agent trigger asynchronously
    // after the response has been sent, preventing Cloudflare Edge Runtime 25-second timeouts
    // when waking up a cold Render Python agent.
    after(async () => {
      try {
        await triggerAgentGeneration(topic);
        console.log(`[generate] Asynchronously triggered agent for topic: "${topic}"`);
      } catch (agentErr: any) {
        console.error(`[generate] Background agent trigger failed for topic "${topic}":`, agentErr.message || agentErr);
      }
    });

    return NextResponse.json({ message: 'Generation started', topic }, { status: 202 });
  } catch (err: any) {
    console.error('[generate] Unhandled error during generation dispatch:', err.message || err);
    return NextResponse.json(
      { error: 'Internal server error: ' + (err.message || 'Unknown Error') }, 
      { status: 500 }
    );
  }
}

