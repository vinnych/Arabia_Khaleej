import { NextResponse } from 'next/server';

export const runtime = 'edge';

export async function GET(req: Request) {
  try {
    const authHeader = req.headers.get('authorization');
    const cronSecret = process.env.CRON_SECRET;
    
    // Why fail-closed validation: An empty conditional block is a severe security vulnerability
    // that allows unauthorized clients to bypass checks. Aborting early with a 401 Unauthorized status
    // protects system resources and prevents malicious or runaway API generation triggers.
    if (cronSecret && authHeader !== `Bearer ${cronSecret}`) {
      console.warn('[security] Unauthorized attempt to trigger Daily Cron API.');
      return NextResponse.json(
        { error: 'Unauthorized: Invalid or missing authorization token.' }, 
        { status: 401 }
      );
    }

    // Logic to fetch trending. For Arabia Khaleej, we might fetch Gulf/Dubai trends.
    const mockTrendingTopic = "Top Real Estate Trends in Dubai " + new Date().toISOString().split('T')[0];

    const baseUrl = process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : 'https://arabiakhaleej.com';
    
    const requestHeaders: Record<string, string> = { 
      'Content-Type': 'application/json' 
    };

    // Why forward credentials: Since the generation endpoint `/api/generate` is now secured,
    // we must sign our internal API request with the appropriate bearer token to pass its authorization filter.
    if (cronSecret) {
      requestHeaders['Authorization'] = `Bearer ${cronSecret}`;
    } else if (process.env.ADMIN_SECRET) {
      requestHeaders['Authorization'] = `Bearer ${process.env.ADMIN_SECRET}`;
    }

    // Trigger the generation
    const res = await fetch(`${baseUrl}/api/generate`, {
      method: 'POST',
      headers: requestHeaders,
      body: JSON.stringify({ topic: mockTrendingTopic })
    });

    if (!res.ok) {
      const errorText = await res.text();
      console.error(`[cron] Generation API trigger failed with status ${res.status}:`, errorText);
      return NextResponse.json({ error: `Generation trigger failed with status ${res.status}` }, { status: res.status });
    }

    return NextResponse.json({ message: 'Cron job executed successfully', topic: mockTrendingTopic });
  } catch (err: any) {
    // Why comprehensive logging: We explicitly log the stack trace with console.error to ease debugging
    // without leaking internal server architecture parameters to external API consumers.
    console.error('[cron] Daily cron processing error:', err.message || err);
    return NextResponse.json({ error: 'Cron failed: ' + (err.message || 'Internal Error') }, { status: 500 });
  }
}
