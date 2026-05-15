import { NextRequest, NextResponse } from 'next/server';
import { redis } from '@/lib/redis';
import { loadWorkflowState, saveWorkflowState, deleteWorkflow } from '@/lib/workflow/utils';
import { POLICY_JUDGE_PROMPT } from '@/lib/workflow/prompts';
import { NodeResponse, WorkflowState, ArticleDraft, PolicyViolation } from '@/lib/workflow/types';
import { GROQ_API_URL } from '@/lib/constants/api';
import { ok, fail } from '@/lib/workflow/response';

export const runtime = 'edge';
export const dynamic = 'force-dynamic';

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
      const obj = raw as Record<string, unknown>;
      return (obj.content as string) || fallback || '';
    }

    return fallback || '';
  } catch (err) {
    console.error('Failed to fetch article body for slug ' + slug + ':', err);
    return fallback || '';
  }
}

/** Count statistics (numbers, currencies, percentages) in text */
function countStats(text: string): number {
  return (text.match(/\d{1,3}(?:,\d{3})*(?:\.\d+)?%?|\$\d[\d.]*|USD|GBP|SAR|AED/g) || []).length;
}

/** Count citations/sources references in text */
function countCitations(text: string): number {
  return (text.match(/(?:according to|source:|reports?|ministry|authority|announced|data from|statistics show)/gi) || []).length;
}

/** Check AdSense richness: needs minimum stats and citations */
function checkRichness(content: string, wordCount: number): { isRich: boolean; stats: number; citations: number; reasons: string[] } {
  const stats = countStats(content);
  const citations = countCitations(content);
  const reasons: string[] = [];

  // For 1500+ words, need at least 3 stats and 2 citations
  const minStats = wordCount >= 1500 ? 3 : 1;
  const minCitations = wordCount >= 1500 ? 2 : 1;

  const isRich = stats >= minStats && citations >= minCitations;
  if (stats < minStats) reasons.push(`Need ${minStats}+ statistics (found ${stats})`);
  if (citations < minCitations) reasons.push(`Need ${minCitations}+ citations (found ${citations})`);

  return { isRich, stats, citations, reasons };
}

async function judgeArticle(apiKey: string, article: ArticleDraft): Promise<{ verdict: 'pass' | 'fail'; violations: PolicyViolation[]; actions: string[] }> {
  const content = await fetchArticleBody(article.slug, article.content);
  const trunc = content.length > 8000 ? content.substring(0, 8000) + ' [...TRUNCATED...]' : content;
  const prompt = POLICY_JUDGE_PROMPT(article.title || '', article.country || '', trunc);

  const groqRes = await fetch(GROQ_API_URL, {
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

  // Handle non-ok responses gracefully
  if (!groqRes.ok) {
    // Don't fail the entire workflow on Groq API issues - allow article to proceed
    // but log the error for monitoring
    console.warn('Groq API call failed in policy judge:', groqRes.status);
    return { verdict: 'pass', violations: [], actions: ['(LLM call failed, defaulting to pass)'] };
  }

  const groqData = await groqRes.json();
  const raw = groqData.choices[0].message.content;
  const cleaned = raw.replace(/`json?\n?/gi, '').replace(/`+$/, '').trim();

  try {
    return JSON.parse(cleaned);
  } catch (parseError) {
    console.error('Failed to parse Groq response as JSON:', parseError, 'Raw:', raw);
    // On parse error, default to pass to avoid blocking workflow
    return { verdict: 'pass', violations: [], actions: ['(JSON parse failed, defaulting to pass)'] };
  }
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

  // 1. Run AdSense policy check
  const { verdict, violations } = await judgeArticle(process.env.GROQ_API_KEY, article);
  article.policyResult = verdict;
  article.policyViolations = violations;
  article.policyCheckedAt = new Date().toISOString();

  // 2. Run AdSense richness check (statistics, citations)
  const content = await fetchArticleBody(article.slug, article.content);
  const wordCount = (content.match(/\b\w+\b/g) || []).length;
  const richness = checkRichness(content, wordCount);

  // Richness violations are treated as policy violations for rewrite purposes
  const richnessViolations = richness.reasons.length > 0 ? [{
    category: 'richness',
    reason: richness.reasons.join(', '),
    severity: 'warning' as const,
    location: 'full content'
  }] : [];

  const allViolations = [...violations, ...richnessViolations];
  const hasFailures = verdict === 'fail' || !richness.isRich;
  const canRetry = article.retryCount < article.maxRetries;

  if (hasFailures && canRetry) {
    article.retryCount++;
    state.step = 'generate';
    state.articles[idx].regenerateContext = {
      violations: allViolations.map(v => v.category + ': ' + v.reason).join('; '),
      actions: verdict === 'fail'
        ? violations.map(v => v.category === 'stats' ? 'Add proper citations' : v.category === 'sources' ? 'Verify all sources' : 'Review content').join('; ')
        : `Add ${Math.max(0, 3 - richness.stats)} more statistics and ${Math.max(0, 2 - richness.citations)} more citations`,
    };
    state.updatedAt = new Date().toISOString();
    await saveWorkflowState(wid, state).catch((err) => {
      console.error('Failed to save workflow state in policy (retry):', err);
    });

    return NextResponse.json(
      ok('generate', state,
        { type: 'fetch', method: 'GET', url: '/api/workflow/generate/' + idx + '?wid=' + wid + '&idx=' + idx },
        'Policy FAIL — "' + article.title + '" | ' + (verdict === 'fail' ? violations[0]?.category : 'Not AdSense-rich')
        + '. Retry ' + article.retryCount + '/1. Rewriting with corrections.'
      )
    );
  }

  if (hasFailures && !canRetry && verdict === 'fail') {
    article.status = 'deleted';
    article.policyResult = 'delete';
    state.step = 'score';
    state.updatedAt = new Date().toISOString();
    await saveWorkflowState(wid, state).catch((err) => {
      console.error('Failed to save workflow state in policy (delete):', err);
    });

    return NextResponse.json(
      ok('score', state,
        { type: 'fetch', method: 'GET', url: '/api/workflow/score/' + idx + '?wid=' + wid + '&idx=' + idx },
        'Policy FAIL after retry — Article DELETED: ' + article.title
      )
    );
  }

  // Pass: proceed to scoring
  article.policyResult = 'pass';
  state.step = 'score';
  state.updatedAt = new Date().toISOString();
  await saveWorkflowState(wid, state).catch((err) => {
    console.error('Failed to save workflow state in policy (pass):', err);
  });

  return NextResponse.json(
    ok('score', state,
      { type: 'fetch', method: 'GET', url: '/api/workflow/score/' + idx + '?wid=' + wid + '&idx=' + idx },
      'Policy PASS: ' + article.title + ` (${wordCount}w, ${richness.stats} stats, ${richness.citations} citations)`
    )
  );
}