import { NextRequest, NextResponse } from 'next/server';
import { redis, getWithCompression } from '@/lib/redis';
import { loadWorkflowState, saveWorkflowState, deleteWorkflow } from '@/lib/workflow/utils';
import { checkRichness } from '@/lib/workflow/analysis';
import { POLICY_JUDGE_PROMPT } from '@/lib/workflow/prompts';
import { NodeResponse, WorkflowState, ArticleDraft, PolicyViolation } from '@/lib/workflow/types';
import { GROQ_API_URL } from '@/lib/constants/api';
import { ok, fail } from '@/lib/workflow/response';

export const runtime = 'edge';
export const dynamic = 'force-dynamic';

async function fetchArticleBody(slug: string, fallback: string): Promise<string> {
  try {
    const raw = await getWithCompression<{ content?: string } | null>('insights:draft:article:' + slug);
    if (!raw) return fallback || '';
    return raw.content || fallback || '';
  } catch (err) {
    console.error('Failed to fetch article body for slug ' + slug + ':', err);
    return fallback || '';
  }
}

async function judgeArticle(
  apiKey: string,
  article: ArticleDraft
): Promise<{ verdict: 'pass' | 'fail'; violations: PolicyViolation[]; actions: string[] }> {
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

  if (!groqRes.ok) {
    console.warn('Groq API call failed in policy judge:', groqRes.status);
    return {
      verdict: 'fail',
      violations: [{ category: 'api', reason: 'Policy audit unavailable', severity: 'critical', location: 'full content' }],
      actions: ['(LLM unavailable — article FAILED policy check)'],
    };
  }

  const groqData = await groqRes.json();
  const raw = groqData.choices[0].message.content;
  const cleaned = raw.replace(/`json?\n?/gi, '').replace(/`+$/, '').trim();

  try {
    return JSON.parse(cleaned);
  } catch (parseError) {
    console.error('Failed to parse Groq response as JSON:', parseError, 'Raw:', raw);
    return {
      verdict: 'fail',
      violations: [{ category: 'api', reason: 'Policy audit parse error', severity: 'critical', location: 'full content' }],
      actions: ['(JSON parse failed — article FAILED policy check)'],
    };
  }
}

export async function GET(request: NextRequest): Promise<NextResponse<NodeResponse>> {
  const { searchParams } = new URL(request.url);
  const wid = searchParams.get('wid');
  const idx = parseInt(searchParams.get('idx') || '0');
  const stepLabel = 'policy[' + idx + ']';

  if (!wid) return NextResponse.json(fail('error', 'Missing workflow ID', {}));
  console.log('[WF ' + stepLabel + '] wid=' + wid + ' idx=' + idx);

  const state = await loadWorkflowState(wid);
  if (!state) return NextResponse.json(fail('error', 'Workflow not found: ' + wid, { workflowId: wid }));
  const article = state.articles[idx];
  if (!article) return NextResponse.json(fail('error', 'Article ' + idx + ' not found in workflow', state));

  if (!process.env.GROQ_API_KEY) return NextResponse.json(fail('error', 'GROQ_API_KEY missing', state));

  console.log('[WF ' + stepLabel + '] Judging "' + article.title + '" slug=' + article.slug + ' retry=' + article.retryCount + '/' + article.maxRetries);
  const articleSlug = article.slug;
  // Snapshot regenerateContext: we delete it on success; restore it on failure
  const existingRegenContext = article.regenerateContext;
  let hasStateChanges = false;

  try {
    /**
     * Step 1 — AdSense LLM policy check
     */
    const { verdict, violations } = await judgeArticle(process.env.GROQ_API_KEY, article);
    article.policyResult = verdict;
    article.policyViolations = violations;
    article.policyCheckedAt = new Date().toISOString();

    /**
     * Step 2 — AdSense richness check (statistics / citations)
     * Uses shared `checkRichness` from lib/workflow/analysis.ts
     */
    const content = await fetchArticleBody(article.slug, article.content);
    const wordCount = (content.match(/\b\w+\b/g) || []).length;
    const richness = checkRichness(content, wordCount);

    const richnessViolations = richness.reasons.length > 0 ? [{
      category: 'richness',
      reason: richness.reasons.join(', '),
      severity: 'warning' as const,
      location: 'full content' as const,
    }] : [];

    const allViolations = [...violations, ...richnessViolations];
    const hasFailures = verdict === 'fail' || !richness.isRich;
    const canRetry = article.retryCount < article.maxRetries;

    /**
     * Retry path — regenerate the article
     */
    if (hasFailures && canRetry) {
      article.retryCount++;
      state.step = 'generate';
      state.articles[idx].regenerateContext = {
        violations: allViolations.map(v => v.category + ': ' + v.reason).join('; '),
        actions: verdict === 'fail'
          ? violations.map(v =>
              v.category === 'stats' ? 'Add proper citations' :
              v.category === 'sources' ? 'Verify all sources' :
              'Review content'
            ).join('; ')
          : `Add ${Math.max(0, 3 - richness.stats)} more statistics and ${Math.max(0, 2 - richness.citations)} more citations`,
      };
      state.updatedAt = new Date().toISOString();
      hasStateChanges = true;
      try {
        await saveWorkflowState(wid, state);
      } catch (err) {
        console.error('Failed to save workflow state in policy (retry):', err);
        return NextResponse.json(
          fail('error', 'Failed to persist policy retry request: ' + (err as Error).message, state),
          { status: 500 }
        );
      }

      console.log('[WF ' + stepLabel + '] FAIL verdict=' + verdict + ' richness=' + richness.isRich +
        ' retry=' + article.retryCount + '/' + article.maxRetries + ' | next=generate(regenerate)');

      return NextResponse.json(
        ok('generate', state,
          { type: 'fetch', method: 'GET', url: '/api/workflow/generate/' + idx + '?wid=' + wid + '&idx=' + idx },
          'Policy FAIL — "' + article.title + '" | ' + (verdict === 'fail' ? violations[0]?.category : 'Not AdSense-rich')
          + '. Retry ' + article.retryCount + '/1. Rewriting with corrections.'
        )
      );
    }

    /**
     * Hard-delete path — exhausted retries or critical violation => score 0, skip article
     */
    if (hasFailures && !canRetry && verdict === 'fail') {
      article.status = 'deleted';
      article.policyResult = 'delete';
      state.step = 'score';
      state.updatedAt = new Date().toISOString();
      hasStateChanges = true;
      try {
        await saveWorkflowState(wid, state);
      } catch (err) {
        console.error('Failed to save workflow state in policy (delete):', err);
        return NextResponse.json(
          fail('error', 'Failed to persist article deletion: ' + (err as Error).message, state),
          { status: 500 }
        );
      }

      console.log('[WF ' + stepLabel + '] FAIL (exhausted) verdict=' + verdict + ' | status=deleted | next=score');

      return NextResponse.json(
        ok('score', state,
          { type: 'fetch', method: 'GET', url: '/api/workflow/score/' + idx + '?wid=' + wid + '&idx=' + idx },
          'Policy FAIL after retry — Article DELETED: ' + article.title
        )
      );
    }

    /**
     * Pass path
     */
    article.policyResult = 'pass';
    state.step = 'score';
    state.updatedAt = new Date().toISOString();
    hasStateChanges = true;
    try {
      await saveWorkflowState(wid, state);
    } catch (err) {
      console.error('Failed to save workflow state in policy (pass):', err);
      return NextResponse.json(
        fail('error', 'Failed to persist policy pass result: ' + (err as Error).message, state),
        { status: 500 }
      );
    }

    console.log('[WF ' + stepLabel + '] PASS verdict=' + verdict + ' richness=stats ' + richness.stats + ' cites ' + richness.citations + ' | next=score');

    return NextResponse.json(
      ok('score', state,
        { type: 'fetch', method: 'GET', url: '/api/workflow/score/' + idx + '?wid=' + wid + '&idx=' + idx },
        'Policy PASS: ' + article.title + ` (${wordCount}w, ${richness.stats} stats, ${richness.citations} citations)`
      )
    );

  } catch (err: any) {
    /**
     * Error-recovery: clean up state mutations on unexpected failure
     * so the step can be re-run from a clean slate.
     */
    console.error('Policy step unexpected error:', err);

    if (hasStateChanges) {
      // Reload state from Redis and roll back article-level mutations
      const freshState = await loadWorkflowState(wid).catch(() => null);
      if (freshState) {
        const freshArticle = freshState.articles[idx];
        if (freshArticle) {
          // Restore the regenerate context that we may have set
          if (existingRegenContext) {
            freshArticle.regenerateContext = existingRegenContext;
          } else {
            delete freshArticle.regenerateContext;
          }
          // Revert policy result fields
          delete freshArticle.policyResult;
          delete freshArticle.policyViolations;
          delete freshArticle.policyCheckedAt;
          freshState.step = 'policy';
          freshState.updatedAt = new Date().toISOString();
          await saveWorkflowState(wid, freshState).catch(() => {});
          console.log('[WF ' + stepLabel + '] State rolled back, step reset to policy');
        }
      }
    }

    // Clean up any rogue regenerateContext that may have been written
    if (article?.regenerateContext) {
      delete article.regenerateContext;
      try {
        const rollbackState = await loadWorkflowState(wid);
        if (rollbackState?.articles[idx]) {
          delete rollbackState.articles[idx].regenerateContext;
          await saveWorkflowState(wid, rollbackState);
        }
      } catch { /* best-effort */ }
    }

    console.error('[WF ' + stepLabel + '] FAILED error=' + (err?.message || err));
    return NextResponse.json(fail('error', 'Policy step failed: ' + (err?.message || err), state));
  }
}
