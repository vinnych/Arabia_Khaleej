import { NextRequest, NextResponse } from 'next/server';
import { redis } from '@/lib/redis';
import { loadWorkflowState, saveWorkflowState } from '@/lib/workflow/utils';
import { TRENDING_PROMPT } from '@/lib/workflow/prompts';
import { NodeResponse, WorkflowState } from '@/lib/workflow/types';

export const runtime = 'edge';

function ok(step: string, state: Partial<WorkflowState>, nextAction?: any, summary = '') {
  return { ok: true, step, nextAction, summary, state } as NodeResponse;
}
function fail(step: string, error: string, state: Partial<WorkflowState> = {}) {
  return { ok: false, step, summary: error, error, state } as NodeResponse;
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const wid = searchParams.get('wid');
  const idx = parseInt(searchParams.get('idx') || '0');

  if (!wid) return NextResponse.json<NodeResponse>(
    fail('error', 'Missing workflow ID', {})
  );

  const state = await loadWorkflowState(wid).catch(() => null);
  if (!state) return NextResponse.json<NodeResponse>(
    fail('error', 'Workflow not found: ' + wid, { workflowId: wid })
  );

  if (!state.hasGroqApiKey) return NextResponse.json<NodeResponse>(
    fail('error', 'GROQ_API_KEY not configured', state)
  );

// 1. Fetch RSS context (with caching to reduce external calls)
   let rssContext = 'GCC regional development and economic trends';
   try {
     // Try to get cached RSS from Redis first
     const cached = await redis.get('wf:rss-cache:latest').catch(() => null);
     if (cached) {
       rssContext = cached as string;
     } else {
       const rssRes = await fetch(
         'https://news.google.com/rss/search?q=GCC+business+economy+technology&hl=en-US&gl=US&ceid=US:en'
       );
       const xml = await rssRes.text();
       const titles = Array.from(xml.matchAll(/<title>(.*?)<\/title>/g)).map(m => m[1]).slice(1, 15);
       rssContext = titles.join('\n');
       // Cache for 30 minutes
       await redis.set('wf:rss-cache:latest', rssContext, { ex: 1800 }).catch(() => {});
     }
   } catch { /* fallback */ }

  // 2. Call Groq for trending topics + AdSense scores
  const apiKey = process.env.GROQ_API_KEY;
  const prompt = TRENDING_PROMPT(rssContext);
  const groqRes = await fetch('https://api.groq.com/openai/v1/chat/completions', {
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
    return NextResponse.json<NodeResponse>(
      fail('error', 'Failed to call Groq for trending topics: HTTP ' + groqRes.status, state)
    );
  }

  const groqData = await groqRes.json();
  const raw = groqData.choices[0].message.content;
  const cleaned = raw.replace(/`json?\n?/gi, '').replace(/`$/, '').trim();
  const topicsJson = JSON.parse(cleaned);
  let topics = topicsJson.topics || topicsJson;
  if (!Array.isArray(topics)) topics = [];

  // 3. Sort by AdSense score descending, fill the article state
  topics.sort((a: any, b: any) => (b.adsenseScore || 0) - (a.adsenseScore || 0));
  state.trendingTopics = topics;
  state.articles[idx].country = topics[0]?.country || '';
  state.articles[idx].topic   = topics[0]?.topic   || '';
  state.articles[idx].lang    = 'en';
  state.step = 'generate';
  state.updatedAt = new Date().toISOString();
  await saveWorkflowState(wid, state).catch(() => {});

  return NextResponse.json<NodeResponse>(
    ok('generate', state,
      { type: 'fetch', method: 'GET',
        url: '/api/workflow/generate/' + idx + '?wid=' + wid + '&idx=' + idx },
      'Trending: ' + topics.length + ' topics scored. Top: ' + (topics[0]?.topic || 'none') +
      ' (score:' + (topics[0]?.adsenseScore || 'n/a') + '). Chaining to generate article.'
    )
  );
}
