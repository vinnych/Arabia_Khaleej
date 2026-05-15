import { NextRequest, NextResponse } from 'next/server';
import { loadWorkflowState, saveWorkflowState, deleteWorkflow } from '@/lib/workflow/utils';
import { NodeResponse, WorkflowState } from '@/lib/workflow/types';
import { redis, setWithCompression, CACHE_TIMES } from '@/lib/redis';
import { InsightItem } from '@/lib/insights';

export const runtime = 'edge';

function ok(step: string, state: Partial<WorkflowState>, next?: any, summary = '') {
  return { ok: true, step, nextAction: next, summary, state } as NodeResponse;
}
function fail(step: string, error: string, state: Partial<WorkflowState> = {}) {
  return { ok: false, step, summary: error, error, state } as NodeResponse;
}

/**
 * Node 6 (Persist): Write article to final Redis store, delete workflow state.
 * This is the terminal node; always returns a 'done' NextAction.
 */
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const wid = searchParams.get('wid');
  const idx = parseInt(searchParams.get('idx') || '0');

  if (!wid) return NextResponse.json<NodeResponse>(
    fail('error', 'Missing workflow ID', {})
  );

  const state = await loadWorkflowState(wid).catch(() => null);
  if (!state) return NextResponse.json<NodeResponse>(
    fail('error', 'State not found: ' + wid, { workflowId: wid })
  );

  const article = state.articles[idx];
  if (!article) return NextResponse.json<NodeResponse>(
    fail('error', 'Article ' + idx + ' missing from workflow state', state)
  );

  // Persist to Redis final store (always write; status already set by Node5)
  const artKey  = 'insights:draft:article:' + article.slug;
  const listKey = 'insights:drafts:' + article.lang;

  try {
    await setWithCompression(artKey, article, { ex: CACHE_TIMES.INSIGHTS_ARCHIVE });
  } catch { /* non-fatal */ }

  try {
    const raw = await redis.get(listKey);
    let drafts = [];
    if (raw) { try { drafts = (JSON.parse(raw as string) as any[]); } catch {} }
    if (!drafts.some(d => d.slug === article.slug)) {
      drafts.unshift(article);
      if (drafts.length > 500) drafts = drafts.slice(0, 500);
      await setWithCompression(listKey, drafts, { ex: CACHE_TIMES.INSIGHTS_ARCHIVE });
    }
  } catch { /* non-fatal */ }

// Delete workflow state early to reclaim Redis space (keep state for logging)
   // Don't delete yet if there are more articles to process

   const nextIdx = idx + 1;
   const hasMore = nextIdx < state.articles.length;

   state.step            = hasMore ? 'trending' : 'done';
   state.workflowStatus  = hasMore ? 'running' : 'completed';
   state.currentIndex    = hasMore ? nextIdx : idx;
   state.updatedAt       = new Date().toISOString();
   await saveWorkflowState(wid, state).catch(() => {});

   if (hasMore) {
     return NextResponse.json<NodeResponse>(
       ok('trending', state,
         { type: 'fetch', method: 'GET',
           url: '/api/workflow/trending?wid=' + wid + '&idx=' + nextIdx },
         'Article ' + (idx + 1) + ' persisted. Continuing with article ' + (nextIdx + 1)
       )
     );
   }

   // Final article - delete workflow
   await deleteWorkflow(wid).catch(() => {});

   return NextResponse.json<NodeResponse>(
     ok('done', state, { type: 'done' },
       'Workflow completed. Article persisted: ' + article.title +
       ' | status=' + article.status +
       ' | score=' + (article.qualityScore || 'n/a') +
       ' | policy=' + (article.policyResult || 'n/a') +
       ' | Total: ' + state.articles.length + ' articles'
     )
   );
}