import { NextResponse } from 'next/server';

export const runtime = 'edge';

export async function GET(req: Request) {
  try {
    const authHeader = req.headers.get('authorization');
    
    // Cron security check
    if (process.env.CRON_SECRET && authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
      // Return 401 if secrets don't match, unless no secret is set
    }

    // Logic to fetch trending. For Arabia Khaleej, we might fetch Gulf/Dubai trends.
    const mockTrendingTopic = "Top Real Estate Trends in Dubai " + new Date().toISOString().split('T')[0];

    const baseUrl = process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : 'https://arabiakhaleej.com';
    
    // Trigger the generation
    await fetch(`${baseUrl}/api/generate`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ topic: mockTrendingTopic })
    });

    return NextResponse.json({ message: 'Cron job executed successfully', topic: mockTrendingTopic });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: 'Cron failed' }, { status: 500 });
  }
}
