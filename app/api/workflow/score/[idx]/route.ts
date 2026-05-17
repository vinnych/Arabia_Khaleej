import { NextRequest, NextResponse } from 'next/server';
import { redis } from '@/lib/redis';
import { loadWorkflowState, saveWorkflowState, deleteWorkflow, bumpTtl } from '@/lib/workflow/utils';
import { scoreArticle } from '@/lib/workflow/analysis';
import { NodeResponse, WorkflowState } from '@/lib/workflow/types';
import { ok, fail } from '@/lib/workflow/response';

export const runtime = 'edge';
export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest): Promise<NextResponse<NodeResponse>> {
  const { searchParams } = new URL(request.url);
  const wid = searchParams.get('wid');
  const idx = parseInt(searchParams.get('idx') || '0');
  const stepLabel = 'score[' + idx + ']';

  if (!wid) return NextResponse.json(fail('error', 'Missing workflow ID', {}));
  console.log('[WF ' + stepLabel + '] wid=' + wid + ' idx=' + idx);

  const state = await loadWorkflowState(wid);
  if (!state) return NextResponse.json(fail('error', 'Workflow not found: ' + wid, { workflowId: wid }));
  const article = state.articles[idx];
  if (!article) return NextResponse.json(fail('error', 'Article ' + idx + ' not found', state));

  console.log('[WF ' + stepLabel + '] Scoring "' + article.title + '" status=' + article.status + ' policy=' + article.policyResult);

  /**
   * Deleted articles skip scoring — assign 0 and advance immediately.
   * Also clean up the associated draft Redis key.
   */
  if (article.status === 'deleted' || article.policyResult === 'delete') {
    const orphanKey = 'insights:draft:article:' + article.slug;
    console.log('[WF ' + stepLabel + '] Article deleted, scoring=0 | cleanup orphan key=' + orphanKey);
    await redis.del(orphanKey).catch((err) => {
      console.warn('Failed to delete orphaned draft key for deleted article:', err);
    });

    article.qualityScore = 0;
    state.step = 'done';
    state.updatedAt = new Date().toISOString();

    try {
      await saveWorkflowState(wid, state);
    } catch (err) {
      console.error('Failed to save workflow state in score (deleted article):', err);
      await deleteWorkflow(wid).catch(() => {});
      return NextResponse.json(
        fail('error', 'Score step failed for deleted article: ' + (err as Error).message, state),
        { status: 500 }
      );
    }

    console.log('[WF ' + stepLabel + '] Article DELETED score=0 | workflow done');
    await deleteWorkflow(wid).catch((err) => {
      console.error('Failed to delete workflow in score (deleted article):', err);
    });
    await bumpTtl(wid).catch((err) => {
      console.error('Failed to bump TTL in score (deleted article):', err);
    });

    return NextResponse.json(
      ok('done', state, { type: 'done' },
        'Article DELETED: ' + article.title + ' | workflow cleaned up'
      )
    );
  }

  // -- Compute score in memory using shared analysis helper ------------
  const { score, wordCount, sections, citations, stats, entities } = scoreArticle(article);
  console.log('[WF ' + stepLabel + '] Score=' + score + '/100 w=' + wordCount + ' sections=' + sections + ' cites=' + citations + ' stats=' + stats + ' ents=' + entities);

  article.qualityScore = score;
  article.wordCount = wordCount;
  state.step = 'persist';
  state.updatedAt = new Date().toISOString();

  try {
    await saveWorkflowState(wid, state);
  } catch (err) {
    console.error('Failed to save workflow state in score:', err);
    return NextResponse.json(
      fail('error', 'Failed to persist scoring results: ' + (err as Error).message, state),
      { status: 500 }
    );
  }

  return NextResponse.json(
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
