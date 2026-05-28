import { NextResponse } from 'next/server';
import { triggerAgentGeneration } from '@/lib/agentHelper';

export const runtime = 'edge';

// Disable caching for this route so it fetches fresh RSS data each time
export const dynamic = 'force-dynamic';

export async function GET(req: Request) {
  try {
    const authHeader = req.headers.get('authorization');
    const cronSecret = process.env.CRON_SECRET;

    // Why secure cron route: To prevent malicious actors from triggering generation 
    // loops that deplete API limits or Upstash quota, we enforce CRON_SECRET validation.
    if (!cronSecret || authHeader !== `Bearer ${cronSecret}`) {
      // In Vercel, cron jobs might pass the secret in the Authorization header.
      // Alternatively, we check searchParams for flexibility with different cron providers (like cron-job.org).
      const { searchParams } = new URL(req.url);
      const urlSecret = searchParams.get('secret');
      
      if (!cronSecret || urlSecret !== cronSecret) {
         console.warn('[security] Unauthorized access attempt blocked on /api/cron/generate.');
         return NextResponse.json(
           { error: 'Unauthorized: Invalid or missing cron secret.' }, 
           { status: 401 }
         );
      }
    }

    // 1. Fetch UAE Trending Topics from Google News RSS (last 24 hours)
    // WHY: Google News RSS provides high-quality, up-to-date headlines relevant to the UAE, 
    // eliminating the need for paid APIs while staying highly contextual to Arabia Khaleej's audience.
    // NOTE: Direct requests from Edge/Cloudflare IPs are blocked by Google News (403 Forbidden).
    // To bypass this, we proxy the request through api.rss2json.com which safely fetches it 
    // and conveniently returns JSON instead of XML.
    //
    // Why we use RSS2JSON_API_KEY: Without an API key, rss2json.com rate-limits requests by IP.
    // Because Cloudflare Pages share outgoing IP ranges, we easily hit the "429 Too Many Requests"
    // limit due to other people's traffic. Adding our own free API key isolates our quota (10k/day).
    const googleNewsUrl = 'https://news.google.com/rss/search?q=UAE+when:24h&hl=en-US&gl=US&ceid=US:en';
    const apiKey = process.env.RSS2JSON_API_KEY;
    const rssUrl = apiKey
      ? `https://api.rss2json.com/v1/api.json?rss_url=${encodeURIComponent(googleNewsUrl)}&api_key=${apiKey}`
      : `https://api.rss2json.com/v1/api.json?rss_url=${encodeURIComponent(googleNewsUrl)}`;

    const rssRes = await fetch(rssUrl, { cache: 'no-store' });
    
    if (!rssRes.ok) {
      throw new Error(`Failed to fetch RSS feed via proxy. Status: ${rssRes.status}`);
    }
    
    const data = await rssRes.json();
    
    // 2. Extract up to 15 headlines and pick one randomly
    const items = data.items || [];
    const headlines: string[] = items.slice(0, 15).map((item: any) => item.title).filter(Boolean);

    if (headlines.length === 0) {
      throw new Error('Failed to parse any articles from the RSS feed.');
    }
    
    // Pick a random headline from the extracted array
    let rawHeadline = headlines[Math.floor(Math.random() * headlines.length)];
    
    // 3. Clean up the headline
    // Google News appends the publisher to the end of the title (e.g. "Dubai property market booms - Khaleej Times")
    // We strip off the publisher to leave just the pure topic.
    rawHeadline = rawHeadline.replace(/\s-\s[^<]+$/, '').trim();
    
    // Decode HTML entities if any (like &apos;, &quot;, &amp;)
    rawHeadline = rawHeadline
      .replace(/&amp;/g, '&')
      .replace(/&quot;/g, '"')
      .replace(/&apos;/g, "'")
      .replace(/&#39;/g, "'")
      .replace(/&lt;/g, '<')
      .replace(/&gt;/g, '>');

    console.log(`[cron] Fetched trending topic: "${rawHeadline}"`);

    // 4. Trigger the generation
    await triggerAgentGeneration(rawHeadline);

    return NextResponse.json({ 
      success: true, 
      message: 'Automated generation triggered successfully.',
      topic: rawHeadline
    });

  } catch (err: any) {
    console.error('[cron] Automated generation dispatch failed:', err.message || err);
    return NextResponse.json(
      { error: 'Internal server error: ' + (err.message || 'Unknown Error') }, 
      { status: 500 }
    );
  }
}
