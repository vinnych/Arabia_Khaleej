import { NextRequest, NextResponse } from 'next/server';
import { loadWorkflowState, saveWorkflowState, deleteWorkflow } from '@/lib/workflow/utils';
import { NodeResponse, WorkflowState } from '@/lib/workflow/types';
import { redis, getWithCompression, setWithCompression, CACHE_TIMES } from '@/lib/redis';
import { InsightItem } from '@/lib/insights';
import { ok, fail } from '@/lib/workflow/response';

export const runtime = 'edge';
export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest): Promise<NextResponse<NodeResponse>> {
  const { searchParams } = new URL(request.url);
  const wid = searchParams.get('wid');
  const idx = parseInt(searchParams.get('idx') || '0');
  const stepLabel = 'persist[' + idx + ']';

  if (!wid) return NextResponse.json(fail('error', 'Missing workflow ID', {}));
  console.log(`[WF ${stepLabel}] wid=${wid} idx=${idx}`);

  const state = await loadWorkflowState(wid);
  if (!state) return NextResponse.json(fail('error', 'State not found: ' + wid, { workflowId: wid }));
  const article = state.articles[idx];
  if (!article) return NextResponse.json(fail('error', 'Article ' + idx + ' missing from workflow state', state));

  console.log(`[WF ${stepLabel}] Persisting "${article.title}" slug=${article.slug} score=${article.qualityScore} policy=${article.policyResult}`);

  // -- Persist article body to Redis (main draft store) -----------------
  const artKey = 'insights:draft:article:' + article.slug;
  try {
    await setWithCompression(artKey, article, { ex: CACHE_TIMES.INSIGHTS_ARCHIVE });
    console.log(`[WF ${stepLabel}] Article body saved key=${artKey}`);
  } catch (err) {
    console.error(`[WF ${stepLabel}] Failed to save article body key=${artKey}:`, err);
    return NextResponse.json(
      fail('error', 'Failed to persist article body: ' + (err as Error).message, state),
      { status: 500 }
    );
  }

  // -- Update the drafts list array -------------------------------------
  const lang = article.lang || 'en';
  const listKey = 'insights:drafts:' + lang;
  const listEntry: InsightItem = {
    id: article.id,
    slug: article.slug,
    title: article.title,
    description: article.description,
    link: '/insights/' + article.slug,
    pubDate: article.pubDate,
    source: 'Arabia Khaleej Editorial',
    category: (article.category as InsightItem['category']) || 'gcc',
    language: (article.lang as InsightItem['language']) || 'en',
    tags: article.tags,
    image: article.image,
    status: 'draft',
  };

  try {
    const rawList = await getWithCompression<unknown>(listKey);
    const drafts: InsightItem[] = Array.isArray(rawList) ? (rawList as InsightItem[]) : [];

    if (!drafts.some(d => d.slug === article.slug)) {
      drafts.unshift(listEntry);
      if (drafts.length > 500) drafts.splice(500);
      await setWithCompression(listKey, drafts, { ex: CACHE_TIMES.INSIGHTS_ARCHIVE });
      console.log(`[WF ${stepLabel}] Drafts list updated key=${listKey} count=${drafts.length} newSlug=${article.slug}`);
    } else {
      console.log(`[WF ${stepLabel}] Drafts list unchanged key=${listKey} slug already present: ${article.slug}`);
    }
  } catch (err) {
    console.error(`[WF ${stepLabel}] Drafts list write FAILED key=${listKey} slug=${article.slug}:`, err);

    // Advance workflow past this article so the cron worker does not
    // re-loop on a permanently-failed step.  The article body is
    // intentionally NOT deleted here — mark the article as
    // persist-failed instead, so the admin panel can surface it.
    const nextIdx = idx + 1;
    const hasMore = nextIdx < state.articles.length;
    state.articles[idx].status = 'failed';
    state.articles[idx].persistError = (err as Error).message;
    state.step = hasMore ? 'trending' : 'done';
    state.workflowStatus = hasMore ? 'running' : 'completed';
    state.currentIndex = hasMore ? nextIdx : idx;
    state.updatedAt = new Date().toISOString();
    // Best-effort: if this fails nothing more can be done after the JSON response
    await saveWorkflowState(wid, state).catch(() => {});

    return NextResponse.json(
      fail('error',
        'Drafts list write failed for "' + article.slug + '": ' + (err as Error).message +
        '. Workflow advanced to article ' + (nextIdx + 1) + (hasMore ? '' : ' — workflow complete'),
        state
      ),
      { status: 500 }
    );
  }

  // -- Advance workflow -------------------------------------------------
  const nextIdx = idx + 1;
  const hasMore = nextIdx < state.articles.length;
  state.step = hasMore ? 'trending' : 'done';
  state.workflowStatus = hasMore ? 'running' : 'completed';
  state.currentIndex = hasMore ? nextIdx : idx;
  state.updatedAt = new Date().toISOString();

  try {
    await saveWorkflowState(wid, state);
    console.log(`[WF ${stepLabel}] State saved, nextStep=${hasMore ? 'trending' : 'done'} nextIdx=${nextIdx}`);
  } catch (err) {
    console.error(`[WF ${stepLabel}] Failed to save workflow state after persist:`, err);
    // Continue — the response has already been formed in memory and is correct;
    // the cron worker will reload from Redis on the next call and resume at the
    // same step with the correct in-progress article body still in Redis.
  }

if (hasMore) {
     return NextResponse.json(
       ok('trending', state,
         { type: 'fetch', method: 'GET',
           url: '/api/workflow/trending/' + nextIdx + '?wid=' + wid + '&idx=' + nextIdx },
         'Article ' + (idx + 1) + ' persisted. Continuing with article ' + (nextIdx + 1)
       )
     );
   }

  await deleteWorkflow(wid).catch((err) => {
    console.error(`[WF ${stepLabel}] Failed to delete workflow on final persist:`, err);
  });

  return NextResponse.json(
    ok('done', state, { type: 'done' },
      'Workflow completed. Article persisted: ' + article.title +
      ' | status=' + article.status +
      ' | score=' + (article.qualityScore || 'n/a') +
      ' | policy=' + (article.policyResult || 'n/a') +
      ' | Total: ' + state.articles.length + ' articles'
    )
  );
}
