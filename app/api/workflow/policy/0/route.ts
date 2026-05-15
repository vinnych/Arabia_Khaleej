import { NextRequest, NextResponse } from 'next/server';
import { redis } from '@/lib/redis';
import { loadWorkflowState, saveWorkflowState, deleteWorkflow } from '@/lib/workflow/utils';
import { POLICY_JUDGE_PROMPT } from '@/lib/workflow/prompts';
import { NodeResponse, WorkflowState } from '@/lib/workflow/types';

export const runtime = 'edge';
export const dynamic = 'force-dynamic';

function ok(step: string, state: Partial<WorkflowState>, nextAction?: any, summary = '') {
  return { ok: true, step, nextAction, summary, state } as NodeResponse;
}
function fail(step: string, error: string, state: Partial<WorkflowState> = {}) {
  return { ok: false, step, summary: error, error, state } as NodeResponse;
}

async function fetchArticleBody(slug: string, fallback: string): Promise<string> {
  try {
    const raw = await redis.get('insights:draft:article:' + slug);
    if (!raw) return fallback || '';

    // `raw` may be a plain string (Redis REST response) or an already-deserialised
    // object (if the @upstash/redis client auto-parses the stored value).
    // Only JSON.parse when it is actually a string.
    if (typeof raw === 'string') {
      try { return JSON.parse(raw)?.content || fallback || ''; } catch { /* malformed – fall through */ }
      return fallback || '';
    }

    if (typeof raw === 'object' && raw !== null) {
      return (raw as any).content || fallback || '';
    }

    return fallback || '';
  } catch { /* ignore */ }
  return fallback || '';
}

async function judgeArticle(apiKey: string, article: any): Promise<{ verdict: 'pass' | 'fail' | 'delete'; violations: any[]; actions: string[] }> {
  const content = await fetchArticleBody(article.slug, article.content);
  const trunc = content.length > 8000 ? content.substring(0, 8000) + ' [...TRUNCATED...]' : content;
  const prompt = POLICY_JUDGE_PROMPT(article.title || '', article.country || '', trunc);

  const groqRes = await fetch('https://api.groq.com/openai/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Authorization': 'Bearer ' + apiKey,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: 'llama-3.1-8b-instant',
      messages: [
        { role: 'system', content: 'You are an AdSense policy compliance auditor.' },
        { role: 'user', content: prompt },
      ],
      temperature: 0.1,
      max_tokens: 1024,
    }),
  });

  if (!groqRes.ok) {
    return { verdict: 'pass', violations: [], actions: ['(LLM call failed, defaulting to pass)'] };
  }

  const groqData = await groqRes.json();
  const raw = groqData.choices[0].message.content;
  const cleaned = raw.replace(/\x60+json?\n?/gi, '').replace(/\x60+$/, '').trim();
  return JSON.parse(cleaned);
}

export async function GET(request: NextRequest): Promise<NextResponse<NodeResponse>> {
  const { searchParams } = new URL(request.url);
  const wid = searchParams.get('wid');
  const idx = parseInt(searchParams.get('idx') || '0');

  if (!wid) return NextResponse.json(fail('error', 'Missing workflow ID', {}));

  const state = await loadWorkflowState(wid).catch(() => null);
  if (!state) return NextResponse.json(fail('error', 'Workflow not found: ' + wid, { workflowId: wid }));

  const article = state.articles[idx];
  if (!article) return NextResponse.json(fail('error', 'Article ' + idx + ' not found in workflow', state));

  if (!process.env.GROQ_API_KEY) return NextResponse.json(fail('error', 'GROQ_API_KEY missing', state));

  const { verdict, violations } = await judgeArticle(process.env.GROQ_API_KEY, article);

  article.policyResult     = verdict;
  article.policyViolations  = violations;
  article.policyCheckedAt   = new Date().toISOString();

  if (verdict === 'fail' && article.retryCount < article.maxRetries) {
    article.retryCount++;
    state.step = 'generate';
    state.articles[idx].regenerateContext = {
      violations: violations.map(v => v.category + ': ' + v.reason).join('; '),
      actions: violations.map(v => v.category === 'stats' ? 'Add proper citations' : v.category === 'sources' ? 'Verify all sources' : 'Review content').join('; ')
    };
    state.updatedAt = new Date().toISOString();
    await saveWorkflowState(wid, state).catch(() => {});

    return NextResponse.json(
      ok('generate', state,
        { type: 'fetch', method: 'GET', url: '/api/workflow/generate/' + idx + '?wid=' + wid + '&idx=' + idx },
        'Policy FAIL — "' + article.title + '" violation: ' + (violations[0]?.category || 'unspecified')
        + '. Retry ' + article.retryCount + '/1. Rewriting with corrections.'
      )
    );
  }

  if (verdict === 'fail' && article.retryCount >= article.maxRetries) {
    article.status = 'deleted';
    article.policyResult = 'delete';
    state.step = 'score';
    state.updatedAt = new Date().toISOString();
    await saveWorkflowState(wid, state).catch(() => {});

    return NextResponse.json(
      ok('score', state,
        { type: 'fetch', method: 'GET', url: '/api/workflow/score/' + idx + '?wid=' + wid + '&idx=' + idx },
        'Policy FAIL after retry — Article DELETED: ' + article.title
      )
    );
  }

  article.policyResult = 'pass';
  state.step = 'score';
  state.updatedAt = new Date().toISOString();
  await saveWorkflowState(wid, state).catch(() => {});

  return NextResponse.json(
    ok('score', state,
      { type: 'fetch', method: 'GET', url: '/api/workflow/score/' + idx + '?wid=' + wid + '&idx=' + idx },
      'Policy PASS: ' + article.title
    )
  );
}
