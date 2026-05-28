import { NextResponse } from 'next/server';
import { triggerAgentGeneration } from '@/lib/agentHelper';

export const runtime = 'edge';

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
    
    // Use the shared helper to trigger agent and save initial draft state
    try {
      await triggerAgentGeneration(topic);
    } catch (agentErr: any) {
      return NextResponse.json({ error: agentErr.message || 'Agent rejected request' }, { status: 500 });
    }

    return NextResponse.json({ message: 'Generation started', topic });
  } catch (err: any) {
    console.error('[generate] Unhandled error during generation dispatch:', err.message || err);
    return NextResponse.json(
      { error: 'Internal server error: ' + (err.message || 'Unknown Error') }, 
      { status: 500 }
    );
  }
}
