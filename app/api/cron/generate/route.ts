import { NextResponse } from 'next/server';
import { triggerAgentGeneration } from '@/lib/agentHelper';
import { XMLParser } from 'fast-xml-parser';
import { getUnifiedInsights } from '@/lib/insights';
import { draftDb } from '@/lib/draftsDb';

export const runtime = 'edge';

// Disable caching for this route so it fetches fresh RSS data each time
export const dynamic = 'force-dynamic';

export async function GET(req: Request) {
  try {
    const authHeader = req.headers.get('authorization');
    const cronSecret = process.env.CRON_SECRET;

    // Why strictly use Bearer token authorization:
    // We enforce strictly HTTP Headers to secure the cron route.
    // Query parameters are routinely exposed in access logs, proxy logs, and analytics.
    // By failing closed if the header is missing, we ensure maximum security.
    if (!cronSecret || authHeader !== `Bearer ${cronSecret}`) {
       console.warn('[security] Unauthorized access attempt blocked on /api/cron/generate.');
       return NextResponse.json(
         { error: 'Unauthorized: Invalid or missing cron secret in Authorization header.' }, 
         { status: 401 }
       );
    }

    // 1. Fetch UAE Trending Topics from Google News RSS natively
    // Why native fetch vs. rss2json: Cloudflare Workers have vast IP pools that rarely get rate-limited.
    // We fetch the XML directly to remove an unstable third-party dependency, spoofing a realistic browser User-Agent
    // just in case Google checks for it.
    const googleNewsUrl = 'https://news.google.com/rss/search?q=UAE+when:24h&hl=en-US&gl=US&ceid=US:en';
    const rssRes = await fetch(googleNewsUrl, { 
      cache: 'no-store',
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
      }
    });
    
    if (!rssRes.ok) {
      throw new Error(`Failed to fetch RSS feed from Google. Status: ${rssRes.status}`);
    }
    
    const xmlText = await rssRes.text();
    const parser = new XMLParser();
    const data = parser.parse(xmlText);
    
    // 2. Extract headlines
    const items = data.rss?.channel?.item || [];
    // fast-xml-parser handles single item vs array automatically, but ensure array
    const itemsArray = Array.isArray(items) ? items : [items];
    const headlines: string[] = itemsArray.map((item: any) => item.title).filter(Boolean);

    if (headlines.length === 0) {
      throw new Error('Failed to parse any articles from the RSS feed.');
    }

    // 3. Clean up the headlines
    const cleanedHeadlines = headlines.map(headline => {
      let clean = headline.replace(/\s-\s[^<]+$/, '').trim();
      // Decode HTML entities
      clean = clean
        .replace(/&amp;/g, '&')
        .replace(/&quot;/g, '"')
        .replace(/&apos;/g, "'")
        .replace(/&#39;/g, "'")
        .replace(/&lt;/g, '<')
        .replace(/&gt;/g, '>');
      return clean;
    });

    // 4. Implement Deduplication
    // Fetch recent insights and drafts to ensure we don't generate the same topic twice
    const recentInsights = await getUnifiedInsights({ lang: 'en', limit: 30 });
    const activeDrafts = await draftDb.getAllDrafts();
    
    const seenTopics = new Set<string>();
    recentInsights.forEach(insight => seenTopics.add(insight.title.toLowerCase()));
    activeDrafts.forEach(draft => seenTopics.add(draft.topic.toLowerCase()));

    // Filter out headlines that have already been generated recently
    const unseenHeadlines = cleanedHeadlines.filter(h => !seenTopics.has(h.toLowerCase()));

    // If all headlines have been generated (rare), fallback to the full list to avoid failing
    const targetPool = unseenHeadlines.length > 0 ? unseenHeadlines : cleanedHeadlines;

    // Pick a random headline from the un-generated pool
    const rawHeadline = targetPool[Math.floor(Math.random() * targetPool.length)];

    console.log(`[cron] Fetched trending topic: "${rawHeadline}" (Pool size: ${targetPool.length})`);

    // 5. Trigger the generation
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
