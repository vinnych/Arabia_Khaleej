import { NextRequest, NextResponse } from 'next/server';
import { loadWorkflowState, saveWorkflowState, deleteWorkflow, bumpTtl } from '@/lib/workflow/utils';
import { NodeResponse, WorkflowState } from '@/lib/workflow/types';

export const runtime = 'edge';

function ok(step: string, state: Partial<WorkflowState>, next?: any, summary = '') {
  return { ok: true, step, nextAction: next, summary, state } as NodeResponse;
}
function fail(step: string, error: string, state: Partial<WorkflowState> = {}) {
  return { ok: false, step, summary: error, error, state } as NodeResponse;
}

/** Count numbers/currencies */
function countStats(text: string): number {
  return (text.match(/\d{1,3}(?:,\d{3})*(?:\.\d+)?%?|\$\d[\d.]*|USD|GBP|SAR|AED/g) || []).length;
}

/** Count named entities (simple heuristic: Titlecase multi-word phrases) */
function countEntities(text: string): number {
  return (text.match(/\b([A-Z][a-z]+(?:\s+[A-Z][a-z]+)+)\b/g) || []).length;
}

/** Return 0-100 quality score */
function scoreArticle(article: { content?: string; wordCount?: number }): { score: number; wordCount: number; sections: number; citations: number; stats: number; entities: number } {
  const text = article.content ?? '';
  const words = (text.match(/\b\w+\b/g) || []).length;
  const sections  = (text.match(/^#{1,3}\s+.+$/gm) || []).length;
  const citations = (text.match(/(?:according to|source:|reports| ministry|authority| announced)/gi) || []).length;
  const stats     = countStats(text);
  const entities  = countEntities(text);

  // Base: each subsection gets max score, penalties for missing elements
  const wordScore  = Math.min(30, Math.round(30 * Math.min(1, words / 1500)));
  const sectionScore = Math.min(20, Math.round(20 * Math.min(1, sections / 3)));
  const citeScore  = Math.min(15, Math.round(15 * Math.min(1, citations / 2)));
  const statsScore = Math.min(15, Math.round(15 * Math.min(1, stats     / 1)));
  const entScore   = Math.min(20, Math.round(20 * Math.min(1, entities  / 3)));

  let score = wordScore + sectionScore + citeScore + statsScore + entScore;

  if (citations === 0 && words > 1500) score -= 5;
  if (stats     === 0 && words > 1500) score -= 5;
  if (entities  === 0 && words > 1500) score -= 5;

  return {
    score: Math.max(0, Math.min(100, score)),
    wordCount: words, sections, citations, stats, entities,
  };
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

  const article = state.articles[idx];
  if (!article) return NextResponse.json<NodeResponse>(
    fail('error', 'Article ' + idx + ' not found', state)
  );

  // -- Deleted articles skip scoring --
  if (article.status === 'deleted' || article.policyResult === 'delete') {
    article.qualityScore = 0;
    state.step = 'done';
    state.updatedAt = new Date().toISOString();
    await deleteWorkflow(wid).catch(() => {});
    await bumpTtl(wid).catch(() => {});
    return NextResponse.json<NodeResponse>(
      ok('done', state, { type: 'done' },
        'Article DELETED: ' + article.title + ' | workflow cleaned up'
      )
    );
  }

  // -- Compute score in memory --
  const { score, wordCount, sections, citations, stats, entities } = scoreArticle(article);

  article.qualityScore = score;
  article.wordCount    = wordCount;
  state.step           = 'persist';
  state.updatedAt      = new Date().toISOString();

  await saveWorkflowState(wid, state).catch(() => {});

  // -- Chain to Node6 (persist) --
  return NextResponse.json<NodeResponse>(
    ok('persist', state,
      { type: 'fetch', method: 'GET',
        url: '/api/workflow/persist/' + idx + '?wid=' + wid + '&idx=' + idx },
      'Score: ' + score + '/100 | w=' + wordCount +
      ' sections=' + sections + ' cites=' + citations +
      ' stats=' + stats + ' ents=' + entities +
      ' | chaining to persist'
    )
  );
}
