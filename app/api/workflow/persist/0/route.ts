import { NextRequest, NextResponse } from 'next/server';
import { loadWorkflowState, saveWorkflowState, deleteWorkflow } from '@/lib/workflow/utils';
import { NodeResponse, WorkflowState } from '@/lib/workflow/types';
import { redis, getWithCompression, setWithCompression, CACHE_TIMES } from '@/lib/redis';
import { InsightItem } from '@/lib/insights';
import { ok, fail } from '@/lib/workflow/response';

export const runtime = 'edge';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const wid = searchParams.get('wid');
  const idx = parseInt(searchParams.get('idx') || '0');

  if (!wid) return NextResponse.json(fail('error', 'Missing workflow ID', {}));

  const state = await loadWorkflowState(wid);
  if (!state) return NextResponse.json(fail('error', 'State not found: ' + wid, { workflowId: wid }));

  const article = state.articles[idx];
  if (!article) return NextResponse.json(fail('error', 'Article ' + idx + ' missing from workflow state', state));

  // Persist to Redis final store (always write; status already set by Node5)
  const artKey = 'insights:draft:article:' + article.slug;
  const listKey = 'insights:drafts:' + article.lang;

  try {
    await setWithCompression(artKey, article, { ex: CACHE_TIMES.INSIGHTS_ARCHIVE });
  } catch (err) {
    console.error('Failed to save article in persist:', err);
  }

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
    let drafts: InsightItem[] = (await getWithCompression<InsightItem[]>(listKey)) || [];
    if (!drafts.some(d => d.slug === article.slug)) {
      drafts.unshift(listEntry);
      if (drafts.length > 500) drafts = drafts.slice(0, 500);
      await setWithCompression(listKey, drafts, { ex: CACHE_TIMES.INSIGHTS_ARCHIVE });
    }
  } catch (err) {
    console.error('Failed to save drafts list in persist:', err);
  }

  // Delete workflow state early to reclaim Redis space (keep state for logging)
  const nextIdx = idx + 1;
  const hasMore = nextIdx < state.articles.length;

  state.step = hasMore ? 'trending' : 'done';
  state.workflowStatus = hasMore ? 'running' : 'completed';
  state.currentIndex = hasMore ? nextIdx : idx;
  state.updatedAt = new Date().toISOString();
  await saveWorkflowState(wid, state).catch((err) => {
    console.error('Failed to save workflow state in persist:', err);
  });

  if (hasMore) {
    return NextResponse.json(
      ok('trending', state,
        { type: 'fetch', method: 'GET',
          url: '/api/workflow/trending?wid=' + wid + '&idx=' + nextIdx },
        'Article ' + (idx + 1) + ' persisted. Continuing with article ' + (nextIdx + 1)
      )
    );
  }

  await deleteWorkflow(wid).catch((err) => {
    console.error('Failed to delete workflow in persist (final):', err);
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