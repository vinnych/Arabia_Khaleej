import { NextResponse } from 'next/server';
import { triggerAgentGeneration } from '@/lib/agentHelper';
import { XMLParser } from 'fast-xml-parser';
import { getUnifiedInsights } from '@/lib/insights';
import { draftDb } from '@/lib/draftsDb';

export const runtime = 'edge';

// Disable caching for this route so it fetches fresh RSS data each time
export const dynamic = 'force-dynamic';

// Helper: Extract normalized, meaningful words (>= 3 chars) from a text string
// Why: Removing punctuation and short words (like "a", "an", "the") ensures we only compare the core meaning of the headline.
function getWords(text: string): Set<string> {
  return new Set(
    text
      .toLowerCase()
      .replace(/[^a-z0-9]/g, ' ')
      .split(/\s+/)
      .filter((w) => w.length > 2)
  );
}

// Helper: Calculate Jaccard similarity between two texts
// Why Jaccard: It measures overlap between two sets of words, making it invariant to word reordering
// (e.g., "Dubai Real Estate" == "Real Estate Dubai"). It's also computationally O(N), perfect for Edge runtimes.
function calculateSimilarity(text1: string, text2: string): number {
  const set1 = getWords(text1);
  const set2 = getWords(text2);
  let intersection = 0;
  for (const word of set1) {
    if (set2.has(word)) intersection++;
  }
  const union = set1.size + set2.size - intersection;
  return union === 0 ? 0 : intersection / union;
}


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

    // 1. Fetch UAE Trending Topics
    let headlines: string[] = [];
    const bingNewsUrl = 'https://www.bing.com/news/search?q=UAE&format=rss';

    try {
      // Primary: Bing News RSS via rss2json
      // Why rss2json: It provides a clean, easy-to-use JSON API proxy for RSS feeds, reducing parsing complexity.
      // We removed Google News as it aggressively blocks cloud IPs resulting in 503 errors.
      const rss2jsonUrl = `https://api.rss2json.com/v1/api.json?rss_url=${encodeURIComponent(bingNewsUrl)}`;
      
      const rssRes = await fetch(rss2jsonUrl, { cache: 'no-store' });
      
      if (!rssRes.ok) throw new Error(`Status: ${rssRes.status}`);
      const data = await rssRes.json();
      if (data.status !== 'ok') throw new Error(`API Error: ${data.message}`);
      
      const itemsArray = data.items || [];
      headlines = itemsArray.map((item: any) => item.title).filter(Boolean);
      
      if (headlines.length === 0) throw new Error('rss2json returned empty items.');

    } catch (error: any) {
      console.warn(`[cron] Bing News via rss2json failed (${error.message}). Falling back to Bing News natively...`);
      
      // Fallback: Bing News RSS natively
      // Why Bing News fallback: In case rss2json API goes down or hits rate limits, we fetch the XML feed directly.
      // Bing News is highly reliable and does not aggressively block datacenter IPs.
      const bingRes = await fetch(bingNewsUrl, { 
        cache: 'no-store',
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
        }
      });
      
      if (!bingRes.ok) {
        throw new Error(`Fallback failed: Bing News returned status ${bingRes.status}`);
      }
      
      const xmlText = await bingRes.text();
      const parser = new XMLParser();
      const data = parser.parse(xmlText);
      
      const items = data.rss?.channel?.item || [];
      const itemsArray = Array.isArray(items) ? items : [items];
      headlines = itemsArray.map((item: any) => item.title).filter(Boolean);
    }

    if (headlines.length === 0) {
      throw new Error('Failed to parse any articles from the RSS feed.');
    }

    // 3. Clean up the headlines
    const cleanedHeadlines = headlines.map(headline => {
      let clean = headline.replace(/\s-\s[^<]+$/, '').trim();
      // Decode HTML entities
      // Why we use regex here instead of an external library like 'he':
      // It keeps the edge function lightweight and avoids adding dependencies.
      // This specifically fixes numeric entities (e.g. &#233; for é) common in French/Portuguese RSS titles.
      clean = clean
        .replace(/&amp;/g, '&')
        .replace(/&quot;/g, '"')
        .replace(/&apos;/g, "'")
        .replace(/&#39;/g, "'")
        .replace(/&lt;/g, '<')
        .replace(/&gt;/g, '>')
        .replace(/&#(\d+);/g, (match, dec) => String.fromCharCode(Number(dec)))
        .replace(/&#x([0-9a-f]+);/gi, (match, hex) => String.fromCharCode(parseInt(hex, 16)));
      return clean;
    });

    // 4. Implement Deduplication (Jaccard Similarity)
    // Fetch recent insights and drafts to ensure we don't generate the same topic twice
    const recentInsights = await getUnifiedInsights({ lang: 'en', limit: 30 });
    const activeDrafts = await draftDb.getAllDrafts();
    
    // Combine all existing titles into one array for comparison
    const existingTopics: string[] = [
      ...recentInsights.map(insight => insight.title),
      ...activeDrafts.map((draft: any) => draft.topic)
    ];

    // Filter out headlines that share 60% or more vocabulary with any existing topic
    // Why 0.6 threshold: It provides a strong balance between catching slightly rephrased headlines 
    // while not aggressively blocking completely different topics that happen to share a few keywords.
    const unseenHeadlines = cleanedHeadlines.filter(h => {
      const isDuplicate = existingTopics.some(existingTopic => calculateSimilarity(h, existingTopic) >= 0.6);
      if (isDuplicate) {
        console.log(`[cron] Filtered duplicate headline: "${h}" (Too similar to an existing topic)`);
      }
      return !isDuplicate;
    });

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
