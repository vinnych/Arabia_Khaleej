/**
 * @file app/api/workflow/history/route.ts
 * @description Arabia Khaleej — Workflow run history.
 *
 * GET /api/workflow/history?secret=ADMIN_SECRET
 * Returns all past workflow runs stored in Redis (up to 50, sorted by most-recently updated).
 * Each run carries its full article table (slug · title · policy · score · status · errors).
 *
 * Useful for the admin History tab and for post-mortem debugging.
 */

import { NextResponse } from 'next/server';
import { redis } from '@/lib/redis';
import {
  WorkflowStep,
  WorkflowStatus,
  PolicyViolation,
  WorkflowState,
} from '@/lib/workflow/types';
import { loadWorkflowState } from '@/lib/workflow/utils';

// ---------------------------------------------------------------------------
// Display helpers
// ---------------------------------------------------------------------------

const STEP_LABELS: Record<WorkflowStep, string> = {
  init: '⚙ Initialize', trending: '📈 Trending', filter: '🔍 Filter',
  generate: '✍ Generate', policy: '🛡 Policy', score: '📊 Score',
  persist: '💾 Persist', done: '✅ Done', error: '❌ Error',
};

function formatDuration(startedAt: string, updatedAt: string): string {
  const ms = new Date(updatedAt).getTime() - new Date(startedAt).getTime();
  if (ms < 1000) return ms + 'ms';
  return (ms / 1000).toFixed(1) + 's';
}

function timeAgo(iso: string): string {
  const ms = Date.now() - new Date(iso).getTime();
  if (ms < 60_000)    return 'Just now';
  if (ms < 3_600_000) return Math.floor(ms / 60_000) + 'm ago';
  if (ms < 86_400_000)return Math.floor(ms / 3_600_000) + 'h ago';
  return Math.floor(ms / 86_400_000) + 'd ago';
}

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

type ArticleSummary = {
  position: number;
  slug: string;
  title: string;
  lang: string;
  country?: string;
  topic?: string;
  policyResult?: string;
  qualityScore?: number;
  status: string;
  wordCount?: number;
  persistError?: string;
  policyViolations: PolicyViolation[];
  retryCount: number;
  maxRetries: number;
};

type HistoryRun = {
  workflowId: string;
  step: WorkflowStep;
  workflowStatus: WorkflowStatus;
  createdAt: string;
  updatedAt: string;
  currentIndex: number;
  totalArticles: number;
  duration: string;
  runCount: number;
  errors: string[];
  hasGroqApiKey: boolean;
  articles: ArticleSummary[];
  since: string;
};

// ---------------------------------------------------------------------------
// Loader
// ---------------------------------------------------------------------------

async function loadHistory(limit = 50): Promise<HistoryRun[]> {
  const runs: HistoryRun[] = [];
  const statusOrder: Record<string, number> = { running: 0, retrying: 1, completed: 2, failed: 3 };

  try {
    const keys = await redis.keys('wf:*');
    const wfKeys = keys.filter(k => /^wf:[a-z0-9-]+$/.test(k));

    const states: WorkflowState[] = [];
    for (const k of wfKeys) {
      try {
        const wid = k.replace(/^wf:/, '');
        const s   = await loadWorkflowState(wid);
        if (s) states.push(s);
      } catch { /* skip */ }
    }

    states.sort((a, b) => {
      const sp = (statusOrder[a.workflowStatus] ?? 4) - (statusOrder[b.workflowStatus] ?? 4);
      if (sp !== 0) return sp;
      return new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime();
    });

    for (const state of states.slice(0, limit)) {
      runs.push({
        workflowId:     state.workflowId,
        step:           state.step,
        workflowStatus: state.workflowStatus,
        createdAt:      state.createdAt,
        updatedAt:      state.updatedAt,
        currentIndex:   state.currentIndex,
        totalArticles:  state.articles.length,
        duration:       formatDuration(state.createdAt, state.updatedAt),
        runCount:       state.runCount,
        errors:         state.errors,
        hasGroqApiKey:  state.hasGroqApiKey,
        articles:       state.articles.map((a, i) => ({
          position:      i,
          slug:          a.slug,
          title:         a.title,
          lang:          a.lang,
          country:       a.country,
          topic:         a.topic,
          policyResult:  a.policyResult,
          qualityScore:  a.qualityScore,
          status:        a.status,
          wordCount:     a.wordCount,
          persistError:  a.persistError,
          policyViolations: a.policyViolations ?? [],
          retryCount:    a.retryCount,
          maxRetries:    a.maxRetries,
        })),
        since:          timeAgo(state.updatedAt),
      });
    }
  } catch { /* noop */ }

  return runs;
}

// ---------------------------------------------------------------------------
// Error badge + persist-error renderer helpers (inline to avoid circular deps)
// ---------------------------------------------------------------------------

const STATUS_BADGE: Record<string, { bg: string; text: string }> = {
  running:    { bg: 'bg-blue-100', text: 'text-blue-700' },
  retrying:   { bg: 'bg-yellow-100', text: 'text-yellow-700' },
  completed:  { bg: 'bg-green-100', text: 'text-green-700' },
  failed:     { bg: 'bg-red-100', text: 'text-red-700' },
};

// ---------------------------------------------------------------------------
// GET handler
// ---------------------------------------------------------------------------

export const runtime = 'edge';

export async function GET(_request: Request) {
  // Auth check
  const { searchParams } = new URL(_request.url);
  const secret = searchParams.get('secret');

  // For the workflow history endpoint, check cron secret
  const ADMIN_SECRET = process.env.ADMIN_SECRET;
  const CRON_SECRET  = process.env.CRON_SECRET;
  if (secret !== ADMIN_SECRET && secret !== CRON_SECRET) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const runs = await loadHistory();
    return NextResponse.json({
      runs,
      stepLabels: STEP_LABELS,
      statusBadge: STATUS_BADGE,
    });
  } catch (err) {
    console.error('[WF History] Failed:', err);
    return NextResponse.json(
      { error: 'Failed to load history', details: (err as Error).message },
      { status: 500 }
    );
  }
}
