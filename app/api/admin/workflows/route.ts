/**
 * @file app/api/admin/workflows/route.ts
 * @module API · Admin Workflows
 * @description Arabia Khaleej — Single unified admin API endpoint.
 *
 * `?tab=drafts`       | Pending drafts (status=draft/pending) enriched with workflow
 *                      context from the live workflow state machine.
 * `?tab=rejected`     | Policy-failed, rejected, deleted, and failed articles.
 * `?tab=workflow`     | Currently-running workflow step-by-step monitor.
 * `?tab=history`      | All past workflow runs (completed + failed).
 *
 * POST /api/admin/workflows/[slug]
 *   Body: `{ lang, action: "approve" | "reject", title?, content? }`
 *   Approves or permanently deletes a single draft.
 */

import { NextRequest, NextResponse } from 'next/server';
import { redis, getWithCompression, setWithCompression, CACHE_TIMES } from '@/lib/redis';
import { loadWorkflowState, saveWorkflowState, deleteWorkflow } from '@/lib/workflow/utils';
import { WorkflowState, WorkflowStep, WorkflowStatus, PolicyViolation } from '@/lib/workflow/types';
import { ok, fail } from '@/lib/workflow/response';

// ---------------------------------------------------------------------------
// Display helpers
// ---------------------------------------------------------------------------

const STEP_LABELS: Record<WorkflowStep, string> = {
  init: '⚙ Initialize',
  trending: '📈 Trending Topics',
  filter: '🔍 Filter',
  generate: '✍ Generate Article',
  policy: '🛡 Policy Check',
  score: '📊 Quality Score',
  persist: '💾 Persist',
  done: '✅ Done',
  error: '❌ Error',
};

const STEP_DESCRIPTIONS: Record<WorkflowStep, string> = {
  init:       'Workflow bootstrapped; fetching trending topics from RSS + Groq',
  trending:   'Calling Groq to score GCC news headlines against AdSense criteria',
  filter:     'Filtering topics by AdSense safety and diversity label',
  generate:   'Generating full-length editorial article via Groq LLM',
  policy:     'Running AdSense policy audit (LLM judge + richness check)',
  score:      'Computing quality score: word-count, sections, citations, stats, entities',
  persist:    'Saving article body to Redis and adding to live drafts list',
  done:       'Workflow finished — all articles processed',
  error:      'An unexpected error interrupted this step',
};

const STATUS_BADGE: Record<WorkflowStatus, { bg: string; text: string }> = {
  running:    { bg: 'bg-blue-100', text: 'text-blue-700' },
  retrying:   { bg: 'bg-yellow-100', text: 'text-yellow-700' },
  completed:  { bg: 'bg-green-100', text: 'text-green-700' },
  failed:     { bg: 'bg-red-100', text: 'text-red-700' },
};

const POLICY_BADGE: Record<string, { bg: string; text: string }> = {
  pass: { bg: 'bg-green-50',  text: 'text-green-700' },
  fail: { bg: 'bg-red-50',    text: 'text-red-700' },
  delete:{bg: 'bg-gray-100',  text: 'text-gray-600' },
};

const ARTICLE_STATUS_BADGE: Record<string, { bg: string; text: string }> = {
  draft:     { bg: 'bg-gray-100',    text: 'text-gray-600' },
  pending:   { bg: 'bg-blue-50',     text: 'text-blue-700' },
  failed:    { bg: 'bg-red-50',      text: 'text-red-700' },
  deleted:   { bg: 'bg-gray-200',    text: 'text-gray-500' },
  rejected:  { bg: 'bg-orange-50',   text: 'text-orange-700' },
  published: { bg: 'bg-green-50',   text: 'text-green-700' },
};

function timeAgo(iso: string): string {
  const ms = Date.now() - new Date(iso).getTime();
  if (ms < 60_000)  return 'Just now';
  if (ms < 3_600_000) return Math.floor(ms / 60_000) + 'm ago';
  if (ms < 86_400_000)return Math.floor(ms / 3_600_000) + 'h ago';
  return Math.floor(ms / 86_400_000) + 'd ago';
}

function formatMs(ms: number): string {
  if (ms < 1000) return ms + 'ms';
  if (ms < 60_000) return (ms / 1000).toFixed(1) + 's';
  return Math.floor(ms / 60_000) + 'm ' + Math.round((ms % 60_000) / 1000) + 's';
}

function badge(label: string, { bg, text }: { bg: string; text: string }) {
  return `<span class="inline-block px-2 py-0.5 rounded text-xs font-medium ${bg} ${text}">${label}</span>`;
}

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

interface ArticleCard {
  slug: string;
  title: string;
  description: string;
  pubDate: string;
  language: string;
  image: string;
  status: string;
  policyResult?: string;
  qualityScore?: number;
  wordCount?: number;
  persistError?: string;
  policyViolations: PolicyViolation[];
  country?: string;
  topic?: string;
  retryCount: number;
  maxRetries: number;
  workflowId?: string;
  workflowStep?: string;
  workflowStatus?: string;
}

interface ArticleSummary {
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
  workflowId?: string;
  workflowStep?: string;
  workflowStatus?: string;
}

interface ActiveWorkflow {
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
}

interface WorkflowRun {
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
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function msBetween(from: string, to: string): number {
  return new Date(to).getTime() - new Date(from).getTime();
}

function violationBadges(violations: PolicyViolation[]): string[] {
  if (!violations.length) return [];
  return violations.map(v => {
    const sev = v.severity === 'critical' ? '🔴' : v.severity === 'warning' ? '🟡' : '🔵';
    return `${sev} [${v.category}] ${v.reason}` + (v.location ? ` · ${v.location}` : '');
  });
}

// ---------------------------------------------------------------------------
// Load all published articles from Redis
// ---------------------------------------------------------------------------
// Load all published articles from Redis
// ---------------------------------------------------------------------------

async function loadPublishedArticles(): Promise<ArticleCard[]> {
  const articles: ArticleCard[] = [];

  for (const lang of ['en', 'ar'] as const) {
    const listRaw = await getWithCompression<unknown>(`insights:list:${lang}`);
    const list: Record<string, unknown>[] = Array.isArray(listRaw) ? (listRaw as Record<string, unknown>[]) : [];

    const resolved = await Promise.all(
      list.map(async (entry) => {
        const slugRaw = entry.slug;
        if (!slugRaw) return null;
        const slug = String(slugRaw);

        // Fetch full article data from Redis
        const articleData = await getWithCompression<Record<string, unknown>>(`insights:article:${slug}`).catch(() => null);
        if (!articleData) return null;

        // Strictly use Redis data - if a field is missing or undefined, use empty string/zero/false as appropriate
        // but only if the field exists in the Redis data (not strictly missing)
        const title = articleData.title !== undefined && articleData.title !== null ? String(articleData.title) : '';
        const description = articleData.description !== undefined && articleData.description !== null ? String(articleData.description) : '';
        const pubDate = articleData.pubDate !== undefined && articleData.pubDate !== null ? String(articleData.pubDate) : new Date().toISOString();
        const language = articleData.language !== undefined && articleData.language !== null ? String(articleData.language) : lang;
        const image = articleData.image !== undefined && articleData.image !== null ? String(articleData.image) : '';
        const status = articleData.status !== undefined && articleData.status !== null ? String(articleData.status) : 'published';
        const policyResult = articleData.policyResult !== undefined && articleData.policyResult !== null ? String(articleData.policyResult) : undefined;
        const qualityScore = articleData.qualityScore !== undefined && articleData.qualityScore !== null ? Number(articleData.qualityScore) : undefined;
        const wordCount = articleData.wordCount !== undefined && articleData.wordCount !== null ? Number(articleData.wordCount) : undefined;
        const persistError = articleData.persistError !== undefined && articleData.persistError !== null ? String(articleData.persistError) : undefined;
        const policyViolations = Array.isArray(articleData.policyViolations) ? articleData.policyViolations as PolicyViolation[] : [];
        const country = articleData.country !== undefined && articleData.country !== null ? articleData.country : undefined;
        const topic = articleData.topic !== undefined && articleData.topic !== null ? articleData.topic : undefined;
        const retryCount = articleData.retryCount !== undefined && articleData.retryCount !== null ? Number(articleData.retryCount) : 0;
        const maxRetries = articleData.maxRetries !== undefined && articleData.maxRetries !== null ? Number(articleData.maxRetries) : 1;

        return {
          slug,
          title,
          description,
          pubDate,
          language,
          image,
          status,
          policyResult,
          qualityScore,
          wordCount,
          persistError,
          policyViolations,
          country,
          topic,
          retryCount,
          maxRetries,
        } as ArticleCard;
      })
    );

    articles.push(...(resolved.filter(Boolean) as ArticleCard[]));
  }

   // Sort by publication date (newest first)
   return deduplicateCards(articles.sort((a, b) => new Date(b.pubDate).getTime() - new Date(a.pubDate).getTime()));
}

// ---------------------------------------------------------------------------
// Load all draft article cards (both languages) from Redis
// ---------------------------------------------------------------------------

// ---------------------------------------------------------------------------
// Load all draft article cards (both languages) from Redis
// ---------------------------------------------------------------------------

async function loadArticleCards(): Promise<ArticleCard[]> {
  const cards: ArticleCard[] = [];

  for (const lang of ['en', 'ar'] as const) {
    const listRaw = await getWithCompression<unknown>(`insights:drafts:${lang}`);
    const list: Record<string, unknown>[] = Array.isArray(listRaw) ? (listRaw as Record<string, unknown>[]) : [];

    const resolved = await Promise.all(
      list.map(async (entry) => {
        const slugRaw = entry.slug;
        if (!slugRaw) return null;
        const slug = String(slugRaw);
        const body = await getWithCompression<Record<string, unknown>>(`insights:draft:article:${slug}`).catch(() => null);

        const str = (v: any, fallback: any) => v != null ? String(v) : fallback;
        const num = (v: any) => v != null ? Number(v) : undefined;

        const rawStatus = (entry as any).status ?? body?.status ?? 'draft';
        if (rawStatus === 'published') return null;

        return {
          slug,
          title: str((entry as any).title, body?.title ?? slug),
          description: str((entry as any).description, body?.description ?? ''),
          pubDate: str((entry as any).pubDate, body?.pubDate ?? new Date().toISOString()),
          language: str((entry as any).language, lang),
          image: str((entry as any).image, body?.image ?? ''),
          status: String(rawStatus),
          policyResult: (() => { const v = (entry as any).policyResult ?? body?.policyResult; return v ? String(v) : undefined; })(),
          qualityScore: (() => { const v = (entry as any).qualityScore ?? body?.qualityScore; return v != null ? Number(v) : undefined; })(),
          wordCount: (() => { const v = (entry as any).wordCount ?? body?.wordCount; return v != null ? Number(v) : undefined; })(),
          persistError: (() => { const v = (entry as any).persistError ?? body?.persistError; return v ? String(v) : undefined; })(),
          policyViolations: (() => { const v = (entry as any).policyViolations ?? body?.policyViolations; return Array.isArray(v) ? v as PolicyViolation[] : []; })(),
          country: (() => { const v = (entry as any).country ?? body?.country; return v; })(),
          topic: (() => { const v = (entry as any).topic ?? body?.topic; return v; })(),
           retryCount: Number((entry as any).retryCount ?? body?.retryCount ?? 0),
           maxRetries: Number((entry as any).maxRetries ?? body?.maxRetries ?? 1),
         } as ArticleCard;
       })
     );
 
      cards.push(...(resolved.filter(Boolean) as ArticleCard[]));
    }
  
    // Deduplicate by slug
    const seen = new Set<string>();
    return cards.filter(c => { if (seen.has(c.slug)) return false; seen.add(c.slug); return true; });
  }

// ---------------------------------------------------------------------------
// Load running workflow state (from Redis singleton store)
// ---------------------------------------------------------------------------
// Load running workflow state (from Redis singleton store)
// ---------------------------------------------------------------------------
// Load running workflow state (from Redis singleton store)
// ---------------------------------------------------------------------------
// Load running workflow state (from Redis singleton store)
// ---------------------------------------------------------------------------
// Load running workflow state (from Redis singleton store)
// ---------------------------------------------------------------------------
// Load running workflow state (from Redis singleton store)
// ---------------------------------------------------------------------------
// Load running workflow state (from Redis singleton store)
// ---------------------------------------------------------------------------
// Load running workflow state (from Redis singleton store)
// ---------------------------------------------------------------------------

async function loadActiveRuns(): Promise<ActiveWorkflow[]> {
  const runs: ActiveWorkflow[] = [];
  try {
    const keys = await redis.keys('wf:*');
    const wfKeys = keys.filter(k => /^wf:[a-z0-9-]+$/.test(k));
    for (const k of wfKeys) {
      try {
        const wid = k.replace(/^wf:/, '');
        const state = await loadWorkflowState(wid);
        if (!state) continue;
        if (state.workflowStatus !== 'running' && state.workflowStatus !== 'retrying') continue;

        runs.push({
          workflowId: state.workflowId,
          step: state.step,
          workflowStatus: state.workflowStatus,
          createdAt: state.createdAt,
          updatedAt: state.updatedAt,
          currentIndex: state.currentIndex,
          totalArticles: state.articles.length,
          duration: formatMs(msBetween(state.createdAt, state.updatedAt)),
          runCount: state.runCount,
          errors: state.errors,
          hasGroqApiKey: state.hasGroqApiKey,
          articles: state.articles.map((a, i) => ({
            position: i,
            slug: a.slug,
            title: a.title,
            lang: a.lang,
            country: a.country,
            topic: a.topic,
            policyResult: a.policyResult,
            qualityScore: a.qualityScore,
            status: a.status,
            wordCount: a.wordCount,
            persistError: a.persistError,
            policyViolations: a.policyViolations ?? [],
            retryCount: a.retryCount,
            maxRetries: a.maxRetries,
          })),
        });
      } catch { /* skip individual run failures */ }
    }
  } catch { /* noop */ }

  // Sort newest-updated first
  runs.sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime());
  return runs;
}

// ---------------------------------------------------------------------------
// Load all workflow runs (for History tab) — same Redis scan as above,
// returns up to 50 runs regardless of status.
// ---------------------------------------------------------------------------
// Load all workflow runs (for History tab) — same Redis scan as above,
// returns up to 50 runs regardless of status.
// ---------------------------------------------------------------------------

async function loadAllRuns(limit = 50): Promise<WorkflowRun[]> {
  const runs: WorkflowRun[] = [];
  try {
    const keys = await redis.keys('wf:*');
    const wfKeys = keys.filter(k => /^wf:[a-z0-9-]+$/.test(k));
    const statusPriority: Record<string, number> = { running: 0, retrying: 1, completed: 2, failed: 3 };

    const states: WorkflowState[] = [];
    for (const k of wfKeys) {
      try {
        const wid = k.replace(/^wf:/, '');
        const s = await loadWorkflowState(wid);
        if (s) states.push(s);
      } catch { /* skip */ }
    }

    states.sort((a, b) => {
      const sp = (statusPriority[a.workflowStatus] ?? 4) - (statusPriority[b.workflowStatus] ?? 4);
      if (sp !== 0) return sp;
      return new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime();
    });

    for (const state of states.slice(0, limit)) {
      runs.push({
        workflowId: state.workflowId,
        step: state.step,
        workflowStatus: state.workflowStatus,
        createdAt: state.createdAt,
        updatedAt: state.updatedAt,
        currentIndex: state.currentIndex,
        totalArticles: state.articles.length,
        duration: formatMs(msBetween(state.createdAt, state.updatedAt)),
        runCount: state.runCount,
        errors: state.errors,
        hasGroqApiKey: state.hasGroqApiKey,
        articles: state.articles.map((a, i) => ({
          position: i,
          slug: a.slug,
          title: a.title,
          lang: a.lang,
          country: a.country,
          topic: a.topic,
          policyResult: a.policyResult,
          qualityScore: a.qualityScore,
          status: a.status,
          wordCount: a.wordCount,
          persistError: a.persistError,
          policyViolations: a.policyViolations ?? [],
          retryCount: a.retryCount,
          maxRetries: a.maxRetries,
        })),
      });
    }
  } catch { /* noop */ }

  return runs;
}

// ---------------------------------------------------------------------------
// Enrich article cards with live workflow context from running runs
// ---------------------------------------------------------------------------

async function enrichCards(cards: ArticleCard[]): Promise<ArticleCard[]> {
  const bySlug = new Map<string, ArticleCard[]>();
  for (const card of cards) bySlug.set(card.slug, [card]);

  const activeRuns = await loadActiveRuns();
  for (const run of activeRuns) {
    for (const art of run.articles) {
      const existing = bySlug.get(art.slug);
      if (existing) {
        existing.forEach(c => {
          c.workflowId = run.workflowId;
          c.workflowStep = art.status === 'deleted' ? undefined : run.step;
          c.workflowStatus = run.workflowStatus;
        });
      }
    }
  }

  return cards;
}

// ---------------------------------------------------------------------------
// GET handler
// ---------------------------------------------------------------------------

export const runtime = 'edge';
export const dynamic = 'force-dynamic';

type Tab = 'drafts' | 'rejected' | 'workflow' | 'history' | 'published';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const secret = searchParams.get('secret');
  const tab = (searchParams.get('tab') || 'drafts') as Tab;
  const ADMIN_SECRET = process.env.ADMIN_SECRET!;

  if (secret !== ADMIN_SECRET) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    // ── Workflow Monitor tab ──────────────────────────────────────────
    if (tab === 'workflow') {
      const activeRuns = await loadActiveRuns();
      return NextResponse.json({
        runs: activeRuns,
        stepLabels: STEP_LABELS,
        stepDescriptions: STEP_DESCRIPTIONS,
        statusBadge: STATUS_BADGE,
      });
    }

    // ── History tab ───────────────────────────────────────────────────
    if (tab === 'history') {
      const history = await loadAllRuns();
      return NextResponse.json({
        runs: history,
        stepLabels: STEP_LABELS,
        stepDescriptions: STEP_DESCRIPTIONS,
        statusBadge: STATUS_BADGE,
      });
    }

    // ── Drafts / Rejected tabs ────────────────────────────────────────
    if (tab === 'drafts' || tab === 'rejected') {
      const cards = await loadArticleCards();
      const enriched = await enrichCards(cards);

      if (tab === 'rejected') {
        const rejected = enriched.filter(c =>
          c.status === 'rejected' || c.status === 'failed' || c.status === 'deleted' ||
          c.policyResult === 'fail' || c.policyResult === 'delete'
        );
        return NextResponse.json({
          drafts: rejected,
          total: rejected.length,
          timeAgo,
          articleStatusBadge: ARTICLE_STATUS_BADGE,
          policyBadge: POLICY_BADGE,
          violationBadges,
          stepLabels: STEP_LABELS,
          statusBadge: STATUS_BADGE,
        });
      }

      // default: drafts
      return NextResponse.json({
        drafts: enriched,
        total: enriched.length,
        timeAgo,
        articleStatusBadge: ARTICLE_STATUS_BADGE,
        policyBadge: POLICY_BADGE,
        violationBadges,
        stepLabels: STEP_LABELS,
        statusBadge: STATUS_BADGE,
      });
    }

    // ── Published tab ─────────────────────────────────────────────────
    if (tab === 'published') {
      const published = await loadPublishedArticles();
      return NextResponse.json({
        drafts: published, // Reusing 'drafts' field for consistency with frontend
        total: published.length,
        timeAgo,
        articleStatusBadge: ARTICLE_STATUS_BADGE,
        policyBadge: POLICY_BADGE,
        violationBadges: () => [], // Published articles shouldn't have policy violations
        stepLabels: STEP_LABELS,
        statusBadge: STATUS_BADGE,
      });
    }
  } catch (error) {
    console.error('[Admin Workflows] GET error:', error);
    return NextResponse.json(
      { error: 'Internal server error', details: (error as Error).message },
      { status: 500 }
    );
  }
}

  // Deduplicate by slug
function deduplicateCards(cards: ArticleCard[]): ArticleCard[] {
  const seen = new Set<string>();
  return cards.filter(c => { if (seen.has(c.slug)) return false; seen.add(c.slug); return true; });
}

// ---------------------------------------------------------------------------
// Load running workflow state (from Redis singleton store)
// ---------------------------------------------------------------------------
// POST — approve or reject a single draft
// ---------------------------------------------------------------------------

export async function POST(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const secret = searchParams.get('secret');
  const ADMIN_SECRET = process.env.ADMIN_SECRET!;

  if (secret !== ADMIN_SECRET) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { slug, lang, action, title, content } = await request.json().catch(() => ({})) as {
    slug?: string;
    lang?: string;
    action?: 'approve' | 'reject';
    title?: string;
    content?: string;
  };

  if (!slug || !lang || !action) {
    return NextResponse.json({ error: 'Missing slug, lang, or action' }, { status: 400 });
  }

  try {
    // ── APPROVE ───────────────────────────────────────────────────────
    if (action === 'approve') {
      const draftArticleKey = `insights:draft:article:${slug}`;
      const article = await getWithCompression<Record<string, unknown>>(draftArticleKey);
      if (!article) return NextResponse.json({ error: 'Draft not found' }, { status: 404 });

      // Apply edits if provided
      if (content !== undefined) article.content = content;
      if (title !== undefined) {
        article.title = title;
        const contentForDesc = (content ?? article.content ?? '') as string;
        const lines = contentForDesc.split('\n');
        const paragraph = lines.find((l: string) => !l.startsWith('#') && l.trim().length > 80);
        article.description = paragraph
          ? paragraph.replace(/[#*_]/g, '').trim().substring(0, 180) + '...'
          : (article.description ?? '');
      }

      article.status = 'published';

      // Save to live article key
      await setWithCompression(`insights:article:${slug}`, article, { ex: CACHE_TIMES.INSIGHTS_ARCHIVE || 31536000 });

      // Add to published live list
      const listKey = `insights:list:${lang}`;
      const currentLive = await getWithCompression<Record<string, unknown>[]>(listKey) ?? [];
      await setWithCompression(listKey,
        [article as Record<string, unknown>, ...currentLive].slice(0, 1000),
        { ex: 31536000 }
      );

      // Remove from draft lists
      for (const l of ['en', 'ar'] as const) {
        const dlKey = `insights:drafts:${l}`;
        const rawList = await getWithCompression<Record<string, unknown>[]>(dlKey) ?? [];
        const filtered = rawList.filter((d: Record<string, unknown>) => d.slug !== slug);
        await setWithCompression(dlKey, filtered, { ex: 31536000 });
      }

      // Delete draft body
      await redis.del(draftArticleKey).catch(() => {});

      // Clean up any workflow state referencing this slug (best-effort)
      try {
        const wfKeys = await redis.keys('wf:*');
        const matches = wfKeys.filter(k => /^wf:[a-z0-9-]+$/.test(k));
        for (const wk of matches) {
          const wid = wk.replace(/^wf:/, '');
          const state = await loadWorkflowState(wid).catch(() => null);
          if (!state) continue;
          const changed = state.articles.some((a: any) => a.slug === slug);
          if (changed) {
            state.articles = state.articles.filter((a: any) => a.slug !== slug);
            state.step = state.articles.length === 0 ? 'done' : state.step;
            await saveWorkflowState(wid, state).catch(() => {});
          }
        }
        // Re-check against active runs for caching
      } catch { /* best-effort */ }

      return NextResponse.json({ success: true, message: 'Article approved and published' });
    }

     // ── REJECT ────────────────────────────────────────────────────────
     if (action === 'reject') {
       const draftArticleKey = `insights:draft:article:${slug}`;
       await redis.del(draftArticleKey).catch(() => {});

       const dlKey = `insights:drafts:${lang}`;
       const rawList = await getWithCompression<Record<string, unknown>[]>(dlKey) ?? [];
       if (rawList.some((d: Record<string, unknown>) => d.slug === slug)) {
         const filtered = rawList.filter((d: Record<string, unknown>) => d.slug !== slug);
         await setWithCompression(dlKey, filtered, { ex: 31536000 });
       }

       // Mark as rejected in workflow state if present
       try {
         const wfKeys = await redis.keys('wf:*');
         const matches = wfKeys.filter(k => /^wf:[a-z0-9-]+$/.test(k));
         for (const wk of matches) {
           const wid = wk.replace(/^wf:/, '');
           const state = await loadWorkflowState(wid).catch(() => null);
           if (!state) continue;
           const art = state.articles.find((a: any) => a.slug === slug);
           if (art) {
             art.status = 'rejected';
             art.policyResult = 'delete';
             await saveWorkflowState(wid, state).catch(() => {});
           }
         }
       } catch { /* best-effort */ }

       return NextResponse.json({ success: true, message: 'Draft rejected and removed' });
     }

     // ── DELETE PUBLISHED ───────────────────────────────────────────────
     if (action === 'delete') {
       const publishedArticleKey = `insights:article:${slug}`;
       const article = await getWithCompression<Record<string, unknown>>(publishedArticleKey);
       if (!article) return NextResponse.json({ error: 'Published article not found' }, { status: 404 });

       // Remove from published list
       const listKey = `insights:list:${lang}`;
       const currentLive = await getWithCompression<Record<string, unknown>[]>(listKey) ?? [];
       const filtered = currentLive.filter((a: Record<string, unknown>) => a.slug !== slug);
       await setWithCompression(listKey, filtered, { ex: 31536000 });

       // Delete the article body
       await redis.del(publishedArticleKey).catch(() => {});

       // Clean up any workflow state referencing this slug (best-effort)
       try {
         const wfKeys = await redis.keys('wf:*');
         const matches = wfKeys.filter(k => /^wf:[a-z0-9-]+$/.test(k));
         for (const wk of matches) {
           const wid = wk.replace(/^wf:/, '');
           const state = await loadWorkflowState(wid).catch(() => null);
           if (!state) continue;
           const changed = state.articles.some((a: any) => a.slug === slug);
           if (changed) {
             state.articles = state.articles.filter((a: any) => a.slug !== slug);
             state.step = state.articles.length === 0 ? 'done' : state.step;
             await saveWorkflowState(wid, state).catch(() => {});
           }
         }
       } catch { /* best-effort */ }

        return NextResponse.json({ success: true, message: 'Published article deleted' });
     }

     return NextResponse.json({ error: 'Unknown action: ' + action }, { status: 400 });
  } catch (error) {
    console.error('[Admin Workflows] POST error:', error);
    return NextResponse.json(
      { error: 'Action failed', details: (error as Error).message },
      { status: 500 }
    );
  }
}
