import { NextRequest, NextResponse } from 'next/server';
import { redis } from '@/lib/redis';
import { loadWorkflowState, saveWorkflowState } from '@/lib/workflow/utils';
import { NextAction, NodeResponse, WorkflowState } from '@/lib/workflow/types';
import { GROQ_API_URL, GOOGLE_NEWS_RSS_URL } from '@/lib/constants/api';
import { ok, fail } from '@/lib/workflow/response';

export const runtime = 'edge';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const wid = searchParams.get('wid');
  const idx = parseInt(searchParams.get('idx') || '0');
  const stepLabel = 'trending[' + idx + ']';

  if (!wid) return NextResponse.json(fail('error', 'Missing workflow ID', {}));
  console.log('[WF ' + stepLabel + '] wid=' + wid + ' idx=' + idx);

  const state = await loadWorkflowState(wid);
  if (!state) return NextResponse.json(fail('error', 'Workflow not found: ' + wid, { workflowId: wid }));

  if (!state.hasGroqApiKey) return NextResponse.json(fail('error', 'GROQ_API_KEY not configured', state));

  const apiKey = process.env.GROQ_API_KEY;
  console.log('[WF ' + stepLabel + '] Fetching RSS + Groq trending topics...');

  // 1. Check RSS cache FIRST to avoid unnecessary Groq calls
  let rssContext = 'GCC regional development and economic trends';
  try {
    // Try to get cached RSS from Redis first
    const cached = await redis.get('wf:rss-cache:latest').catch(() => null);
    if (cached) {
      rssContext = cached as string;
    } else {
      // Fetch fresh RSS only if cache is empty/stale
      const rssRes = await fetch(GOOGLE_NEWS_RSS_URL);
      const xml = await rssRes.text();
      const titles = Array.from(xml.matchAll(/<title>(.*?)<\/title>/g)).map(m => m[1]).slice(1, 15);
      rssContext = titles.join('\n');
      // Cache for 30 minutes
      await redis.set('wf:rss-cache:latest', rssContext, { ex: 1800 }).catch((err) => {
        console.warn('Failed to cache RSS context:', err);
      });
    }
  } catch { /* fallback */ }

  // 2. Call Groq for trending topics + AdSense scores
  // Use inline prompt instead of importing unused TRENDING_PROMPT to avoid unused import warning
  const prompt = `You are a GCC editorial strategist. Based on the following RSS headlines
for GCC business/economy/tech, generate exactly 10 strategic article topics.

CONTEXT (headlines):
${rssContext}

ADSENSE CONTENT REQUIREMENTS (non-negotiable — follow exactly):
1. NO scraped, copied, or copyrighted third-party content. Every word must be original.
2. NO unqualified medical claims, financial investment advice, or legal guidance.
3. NO hate speech, harassment, adult content, or graphic violence.
4. NO deceptive, misleading, or factually inaccurate information.
5. NO thin / placeholder content — articles must contain genuine original analysis.
6. NO gambling, crypto speculation, or promotion of regulated / illegal substances.
7. NO instructions for circumventing AdSense or advertising policies.
8. All statistics and quoted figures must be attributed to a named official source with a date.
9. If a statistic cannot be reliably attributed within the article, replace the attempted citation
   with a verifiable regional example or omit the claim entirely — never fabricate a source.

Return ONLY valid JSON — no markdown fences, no prose.
Shape: { "topics": [{ "country": "Saudi Arabia", "topic": "...", "adsenseScore": 85,
"diversityLabel": "high-utility" | "specialized-women", "isSafe": true,
"reasons": ["reason1"] }] }

RULES: 9 high-utility + 1 specialized-women. Score 80+ preferred.
isSafe=false for: crypto, gambling, medical claims, adult content.`;

  const groqRes = await fetch(GROQ_API_URL, {
    method: 'POST',
    headers: {
      'Authorization': 'Bearer ' + apiKey,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: 'llama-3.1-8b-instant',
      messages: [
        { role: 'system', content: 'Return ONLY valid JSON matching the requested shape for this request.' },
        { role: 'user', content: prompt },
      ],
      temperature: 0.6,
      max_tokens: 2048,
    }),
  });

  if (!groqRes.ok) {
    return NextResponse.json(fail('error', 'Failed to call Groq for trending topics: HTTP ' + groqRes.status, state));
  }

  const groqData = await groqRes.json();
  const raw = groqData.choices[0].message.content;
  const cleaned = raw.replace(/`json?\n?/gi, '').replace(/`+$/, '').trim();
  const topicsJson = JSON.parse(cleaned);
  let topics = topicsJson.topics || topicsJson;
  if (!Array.isArray(topics)) topics = [];

  // 3. Sort by AdSense score descending, fill the article state
  topics.sort((a: any, b: any) => (b.adsenseScore || 0) - (a.adsenseScore || 0));
  state.trendingTopics = topics;
  state.articles[idx].country = topics[0]?.country || '';
  state.articles[idx].topic = topics[0]?.topic || '';
  state.articles[idx].lang = 'en';
  state.step = 'generate';
  state.updatedAt = new Date().toISOString();

  await saveWorkflowState(wid, state).catch((err) => {
    console.error('Failed to save workflow state in trending:', err);
    // Fail explicitly so the cron worker retries
    throw err;
  });

  console.log('[WF ' + stepLabel + '] Topics=' + topics.length + ' top=' + (topics[0]?.topic || 'none') + ' score=' + (topics[0]?.adsenseScore || 'n/a') + ' | next=generate');

  return NextResponse.json(
    ok('generate', state,
      { type: 'fetch', method: 'GET',
        url: '/api/workflow/generate/' + idx + '?wid=' + wid + '&idx=' + idx },
      'Trending: ' + topics.length + ' topics scored. Top: ' + (topics[0]?.topic || 'none') +
      ' (score:' + (topics[0]?.adsenseScore || 'n/a') + '). Chaining to generate article.'
    )
  );
}