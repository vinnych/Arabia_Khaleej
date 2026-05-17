'use client';

import { useEffect, useState, useCallback } from 'react';
import Image from 'next/image';
import { useSearchParams } from 'next/navigation';
import { Trash2, Eye, RefreshCw, CheckCircle, AlertTriangle,
  XCircle, Clock, Globe, BarChart3, EyeOff, FileText, Zap, Shield, Trophy } from 'lucide-react';

// ---------- Types ----------

type PolicyViolation = { category: string; reason: string; severity: 'critical' | 'warning' | 'info'; location?: string };

type Article = {
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
  workflowStatus?: string;
  workflowStep?: string;
  workflowId?: string;
};

type WorkflowStepLabel      = Record<string, string>;
type StepDescription        = Record<string, string>;
type StatusBadge            = Record<string, { bg: string; text: string }>;
type ArticleStatusBadgeMap  = Record<string, { bg: string; text: string }>;
type PolicyBadgeMap         = Record<string, { bg: string; text: string }>;

// ---------- Tab definitions ----------

type TabId = 'drafts' | 'rejected' | 'workflow' | 'history';

const TABS: { id: TabId; label: string; icon: React.ReactNode }[] = [
  { id: 'drafts',    label: 'Drafts',    icon: <FileText className="w-4 h-4" /> },
  { id: 'rejected',  label: 'Rejected',  icon: <XCircle className="w-4 h-4" /> },
  { id: 'workflow',  label: 'Workflow',  icon: <Zap className="w-4 h-4" /> },
  { id: 'history',   label: 'History',   icon: <Clock className="w-4 h-4" /> },
];

// ---------------------------------------------------------------------------
// Module-level time / violation helpers (used insideAdminReviewPage closures)
// ---------------------------------------------------------------------------

function defaultTimeAgo(iso: string): string {
  const ms = Date.now() - new Date(iso).getTime();
  if (ms < 60_000)    return 'Just now';
  if (ms < 3_600_000) return Math.floor(ms / 60_000) + 'm ago';
  if (ms < 86_400_000)return Math.floor(ms / 3_600_000) + 'h ago';
  return Math.floor(ms / 86_400_000) + 'd ago';
}

function defaultViolationBadges(violations: PolicyViolation[]): string[] {
  if (!violations?.length) return [];
  return violations.map(v => {
    const sev = v.severity === 'critical' ? '🔴' : v.severity === 'warning' ? '🟡' : '🔵';
    return `${sev} [${v.category}] ${v.reason}` + (v.location ? ` · ${v.location}` : '');
  });
}

// ---------------------------------------------------------------------------
// HTML-safe badge factory
// ---------------------------------------------------------------------------

function Badge({ label, bgClass, textClass }: { label: string; bgClass: string; textClass: string }) {
  return (
    <span className={`inline-block px-2 py-0.5 rounded text-xs font-medium whitespace-nowrap ${bgClass} ${textClass}`}>
      {label}
    </span>
  );
}

function sevIcon(sev: PolicyViolation['severity']): string {
  return sev === 'critical' ? '🔴' : sev === 'warning' ? '🟡' : '🔵';
}

// ---------- Hotel: Article Card ----------

function ArticleCard({ article, secret }: { article: Article; secret: string }) {
  const [expanded, setExpanded] = useState(false);
  const [showContent, setShowContent] = useState(false);
  const [content, setContent]   = useState('');
  const [busy, setBusy]         = useState(false);
  const [editedContent, setEditedContent] = useState('');
  const [hasEdits, setHasEdits] = useState(false);
  const [editingTitle, setEditingTitle] = useState(article.title);

  const loadContent = async () => {
    if (content) return;
    try {
      const r = await fetch(`/api/admin/draft-content?secret=${secret}&slug=${article.slug}`);
      if (!r.ok) return;
      const d = await r.json();
      setContent(d.content || '');
      setEditedContent(d.content || '');
    } catch { /* silent */ }
  };

  const openExpand = async () => {
    if (!expanded) await loadContent();
    setExpanded(!expanded);
  };

  const approve = async () => {
    if (!hasEdits && !confirm('You must make substantive edits before publishing for AdSense compliance. Continue?')) return;
    setBusy(true);
    try {
      const r = await fetch(`/api/admin/workflows?secret=${secret}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ slug: article.slug, lang: article.language, action: 'approve', title: editingTitle, content: editedContent }),
      });
      const d = await r.json();
      if (d.success) { window.location.reload(); }
      else alert('Failed: ' + (d.error || d.details || 'unknown'));
    } catch { alert('Approval failed'); }
    setBusy(false);
  };

  const reject = async () => {
    if (!confirm('Permanently reject and delete this draft?')) return;
    setBusy(true);
    try {
      const r = await fetch(`/api/admin/workflows?secret=${secret}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ slug: article.slug, lang: article.language, action: 'reject' }),
      });
      const d = await r.json();
      if (d.success) { window.location.reload(); }
      else alert('Failed: ' + (d.error || d.details || 'unknown'));
    } catch { alert('Reject failed'); }
    setBusy(false);
  };

  const timeAgo = article.pubDate
    ? (() => { const ms = Date.now() - new Date(article.pubDate).getTime(); if (ms < 60_000) return 'Just now'; if (ms < 3_600_000) return Math.floor(ms / 60_000) + 'm ago'; if (ms < 86_400_000) return Math.floor(ms / 3_600_000) + 'h ago'; return Math.floor(ms / 86_400_000) + 'd ago'; })()
    : '';

  return (
    <div className="border border-gray-200 rounded-xl p-5 shadow-sm hover:shadow-md transition-shadow bg-white">
      {/* ── Header: image + title ── */}
      <div className="flex gap-4 mb-4">
        {article.image && (
          <div className="relative w-32 h-24 flex-shrink-0 rounded-lg overflow-hidden bg-gray-100">
            <Image src={article.image} alt={article.title} fill className="object-cover" />
          </div>
        )}
        <div className="flex-1 min-w-0">
          <h3 className="text-lg font-semibold leading-tight mb-1 line-clamp-2">{article.title || article.slug}</h3>
          <p className="text-sm text-gray-600 line-clamp-2">{article.description}</p>
        </div>
      </div>

      {/* ── Metadata row ── */}
      <div className="flex flex-wrap gap-2 items-center mb-3 text-xs">
        <span className="inline-flex items-center gap-1 text-gray-500">
          <Globe className="w-3 h-3" /> {article.language?.toUpperCase()}
        </span>
        <span className="text-gray-400">{timeAgo}</span>
        {article.country && <span className="text-gray-500">{article.country}</span>}
        {article.topic   && (
          <span className="text-gray-700 bg-gray-50 px-2 py-0.5 rounded">{article.topic}</span>
        )}
      </div>

      {/* ── Status / Policy / Score row ── */}
      <div className="flex flex-wrap gap-2 mb-4">
        {/* Article status */}
        <span className="px-2 py-0.5 rounded text-xs font-medium inline-block items-center gap-1 bg-blue-50 text-blue-700">
          {article.status === 'draft'    ? '📝 Draft' :
           article.status === 'pending'  ? '⏳ Pending' :
           article.status === 'failed'   ? '❌ Failed'  :
           article.status === 'deleted'  ? '🗑 Deleted'  :
           article.status === 'published'? '✅ Published':
           article.status}
        </span>

        {/* Policy */}
        {article.policyResult && (
          article.policyResult === 'pass'
            ? <Badge label="Policy ✓ PASS" bgClass="bg-green-50" textClass="text-green-700" />
            : <Badge label="Policy ✗ FAIL" bgClass="bg-red-50" textClass="text-red-700" />
        )}

        {/* QoS score */}
        {typeof article.qualityScore === 'number' && (
          <span className="px-2 py-0.5 rounded text-xs font-medium inline-flex items-center gap-1
            bg-purple-50 text-purple-700">
            <BarChart3 className="w-3 h-3" /> {article.qualityScore}/100
          </span>
        )}

        {/* Word count */}
        {typeof article.wordCount === 'number' && (
          <span className="px-2 py-0.5 rounded text-xs bg-gray-50 text-gray-600">
            {article.wordCount}w
          </span>
        )}

        {/* Retry indicator */}
        {article.retryCount > 0 && (
          <Badge label={`${article.retryCount} retries`} bgClass="bg-yellow-50" textClass="text-yellow-700" />
        )}

        {/* Workflow / phase indicator */}
        {article.workflowStatus && (
          <Badge
            label={`WF: ${article.workflowStatus}`}
            bgClass={article.workflowStatus === 'failed' ? 'bg-red-100' : 'bg-blue-100'}
            textClass={article.workflowStatus === 'failed' ? 'text-red-700' : 'text-blue-700'}
          />
        )}

        {/* Persist error */}
        {article.persistError && (
          <Badge label="⚠ Persist error" bgClass="bg-red-100" textClass="text-red-700" />
        )}

        {/* Deleted (retries exhausted) */}
        {article.policyResult === 'delete' && (
          <Badge label="Deleted (exhausted retries)" bgClass="bg-gray-200" textClass="text-gray-600" />
        )}
      </div>

      {/* ── Policy violations ── */}
      {article.policyViolations.length > 0 && (
        <div className="mb-3">
          <button
            onClick={() => setExpanded(!expanded)}
            className="flex items-center gap-1 text-xs font-medium text-orange-700 hover:text-orange-800 mb-1"
          >
            <AlertTriangle className="w-3 h-3" />
            {article.policyViolations.length} policy violation{article.policyViolations.length !== 1 ? 's' : ''}{' '}
            <span className={expanded ? 'rotate-90' : ''}>▶</span>
          </button>
          {expanded && (
            <div className="pl-4 border-l-2 border-orange-200 space-y-1">
              {article.policyViolations.map((v, i) => (
                <div key={i} className="text-xs">
                  {sevIcon(v.severity)} <span className="font-medium">{v.category}</span>
                  {v.reason         && ` — ${v.reason}`}
                  {v.location       && ` (${v.location})`}
                  <span className="ml-2 text-gray-400">[{v.severity}]</span>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* ── Persist error detail ── */}
      {article.persistError && (
        <div className="mb-3 p-2 bg-red-50 border border-red-200 rounded text-xs text-red-700 font-mono break-words">
          Persist error: {article.persistError}
        </div>
      )}

      {/* ── Full content editor ── */}
      {showContent && (
        <div className="mb-4 space-y-2">
          <label className="block text-sm font-medium">Title (edit for SEO)</label>
          <input
            type="text"
            value={editingTitle}
            onChange={e => { setEditingTitle(e.target.value); setHasEdits(e.target.value !== article.title); }}
            className="w-full px-3 py-2 border border-gray-300 rounded text-sm"
          />
          <label className="block text-sm font-medium">Content (Markdown)</label>
          <textarea
            value={editedContent}
            onChange={e => { setEditedContent(e.target.value); setHasEdits(true); }}
            className="w-full px-3 py-2 border border-gray-300 rounded font-mono text-xs"
            rows={14}
          />
          {hasEdits && (
            <p className="text-green-600 text-xs font-medium">✓ Substantive edits detected — AdSense compliance ready</p>
          )}
        </div>
      )}

      {/* ── Actions ── */}
      <div className="flex gap-2 flex-wrap">
        <button
          onClick={openExpand}
          className="flex items-center gap-1 px-3 py-1.5 text-xs border border-gray-300 rounded hover:bg-gray-50"
        >
          {showContent ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
          {showContent ? 'Hide Editor' : 'Edit & Review'}
        </button>

        <a
          href={`/insights/${article.slug}?preview=true`}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1 px-3 py-1.5 text-xs border border-gray-300 rounded hover:bg-gray-50"
        >
          <Eye className="w-3.5 h-3.5" /> Preview
        </a>

        <button
          onClick={approve}
          disabled={busy}
          className={`inline-flex items-center gap-1 px-4 py-1.5 rounded text-white text-xs disabled:opacity-50
            ${hasEdits ? 'bg-green-600 hover:bg-green-700' : 'bg-green-400 hover:bg-green-500'}`}
        >
          <CheckCircle className="w-3.5 h-3.5" /> Approve & Publish
        </button>

        <button
          onClick={reject}
          disabled={busy}
          className="inline-flex items-center gap-1 px-4 py-1.5 rounded bg-red-600 text-white text-xs hover:bg-red-700 disabled:opacity-50"
        >
          <Trash2 className="w-3.5 h-3.5" /> Reject & Delete
        </button>
      </div>
    </div>
  );
}

// ---------- Hotel: Workflow Step Stepper ----------

function WorkflowStepper({
  stepLabels, stepDescriptions, currentStep
}: {
  stepLabels: WorkflowStepLabel;
  stepDescriptions: StepDescription;
  currentStep: string;
}) {
  const steps = ['init', 'trending', 'filter', 'generate', 'policy', 'score', 'persist', 'done', 'error'] as const;
  const idx = steps.indexOf(currentStep as any);

  return (
    <ol className="flex items-center overflow-x-auto gap-0 py-4">
      {steps.map((s, i) => {
        const isPast     = i < idx;
        const isCurrent  = i === idx;
        const isError    = s === 'error' && isCurrent;
        const isDone     = s === 'done'  && isCurrent || (s === 'done'  && !isCurrent && currentStep === 'done');

        return (
          <li key={s} className="flex items-center">
            <div className="flex flex-col items-center min-w-[90px]">
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold border-2 shrink-0
                  ${isError    ? 'bg-red-500 border-red-500 text-white' :
                   isDone     ? 'bg-green-500 border-green-500 text-white' :
                   isPast     ? 'bg-blue-600 border-blue-600 text-white' :
                   isCurrent  ? 'bg-white border-blue-500 text-blue-600 ring-2 ring-blue-200' :
                                'bg-gray-100 border-gray-300 text-gray-400'}`}
                title={stepDescriptions[s]}
              >
                {isDone ? '✓' : isPast || isCurrent ? i + 1 : '○'}
              </div>
              <span className={`text-[10px] mt-1 font-medium text-center leading-tight
                ${isPast || isDone || isCurrent ? 'text-gray-900' : 'text-gray-400'}`}
                style={{ maxWidth: 90 }}
              >
                {stepLabels[s]}
              </span>
              {isCurrent && (
                <span className="text-[9px] font-medium text-blue-600 bg-blue-50 px-1.5 rounded mt-0.5">
                  LIVE
                </span>
              )}
            </div>
            {i < steps.length - 1 && (
              <div className={`h-0.5 w-10 mx-0.5
                ${i + 1 < idx ? 'bg-blue-600' : 'bg-gray-200'}`}
              />
            )}
          </li>
        );
      })}
    </ol>
  );
}

// ---------- Hotel: Workflow Article Row ----------

function WorkflowArticleRow({
  article, stepLabels, violationBadges, timeAgo, showDetails, onToggle
}: {
  article: any;
  stepLabels: WorkflowStepLabel;
  violationBadges: (v: PolicyViolation[]) => string[];
  timeAgo: (iso: string) => string;
  showDetails: boolean;
  onToggle: () => void;
}) {
  const hasError  = article.persistError || article.status === 'failed';
  const hasPolicy = article.policyResult === 'fail' || (article.policyViolations?.length ?? 0) > 0;

  return (
    <div className="border border-gray-100 rounded-lg p-3 hover:border-gray-300 transition-colors">
      <div className="flex items-start gap-3" onClick={onToggle}>
        {/* Position indicator */}
        <div className={`flex-shrink-0 w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold
          ${article.status === 'deleted' || article.status === 'failed' ? 'bg-red-100 text-red-600' :
           article.status === 'published'  ? 'bg-green-100 text-green-600' :
            'bg-blue-100 text-blue-600'}`}>
          {article.status === 'deleted' ? '✕' : article.position + 1}
        </div>

        <div className="flex-1 min-w-0">
          <p className="font-medium text-sm truncate">{article.title || article.slug}</p>
          <div className="flex flex-wrap gap-1 mt-1">
            {article.country && (
              <span className="text-[10px] text-gray-500 bg-gray-50 px-1.5 py-0.5 rounded">{article.country}</span>
            )}
            {article.lang && (
              <span className="text-[10px] text-gray-500 bg-gray-50 px-1.5 py-0.5 rounded uppercase">{article.lang}</span>
            )}
            {article.policyResult && (
              <span className={`text-[10px] px-1.5 py-0.5 rounded ${
                article.policyResult === 'pass' ? 'bg-green-50 text-green-700' :
                article.policyResult === 'fail' ? 'bg-red-50 text-red-700' :
                'bg-gray-100 text-gray-600'}`}>
                Policy: {article.policyResult}
              </span>
            )}
            {article.qualityScore != null && (
              <span className="text-[10px] px-1.5 py-0.5 rounded bg-purple-50 text-purple-700">
                Score: {article.qualityScore}/100
              </span>
            )}
            {article.wordCount != null && (
              <span className="text-[10px] px-1.5 py-0.5 rounded bg-gray-50 text-gray-600">{article.wordCount}w</span>
            )}
            {article.retryCount > 0 && (
              <span className="text-[10px] px-1.5 py-0.5 rounded bg-yellow-50 text-yellow-700">
                ↻ retry {article.retryCount}/{article.maxRetries}
              </span>
            )}
          </div>
        </div>

        <button className="text-gray-400 hover:text-gray-600 text-xs" title={showDetails ? 'Hide' : 'Show'}>
          {showDetails ? '▲' : '▼'}
        </button>
      </div>

      {showDetails && (
        <div className="mt-3 pt-3 border-t border-gray-100 space-y-2">
          {hasPolicy && article.policyViolations?.length > 0 && (
            <div className="space-y-1">
              <p className="text-xs font-medium text-orange-700 flex items-center gap-1">
                <Shield className="w-3 h-3" /> Policy Violations
              </p>
              {violationBadges(article.policyViolations).map((v, i) => (
                <p key={i} className="text-[11px] text-gray-600 pl-5">{v}</p>
              ))}
            </div>
          )}

          {hasError && article.persistError && (
            <div className="p-2 bg-red-50 border border-red-200 rounded text-xs text-red-700 font-mono break-words">
              <span className="font-medium">Persist error:</span> {article.persistError}
            </div>
          )}

          {hasError && article.status === 'failed' && (
            <div className="p-2 bg-red-50 border border-red-200 rounded text-xs text-red-700 font-mono">
              Status: FAILED — article aborted mid-pipeline
            </div>
          )}

          <p className="text-[11px] text-gray-400">
            Slug: {article.slug}
            {article.topic && ` · Topic: ${article.topic}`}
            {article.country && ` · Country: ${article.country}`}
          </p>
        </div>
      )}
    </div>
  );
}

// ---------------------------------------------------------------------------
// Main Page
// ---------------------------------------------------------------------------

export const dynamic   = 'force-dynamic';
export const runtime   = 'edge';

export default function AdminReviewPage() {
  const [activeTab,    setActiveTab]    = useState<TabId>('drafts');
  const [articles,     setArticles]     = useState<Article[]>([]);
  const [activeRuns,   setActiveRuns]   = useState<any[]>([]);
  const [runHistory,   setRunHistory]   = useState<any[]>([]);
  const [stepLabels,   setStepLabels]   = useState<WorkflowStepLabel>({});
  const [stepDescs,    setStepDescs]    = useState<StepDescription>({});
  const [statusBadge,  setStatusBadge]  = useState<StatusBadge>({});
  const [artStatusMap, setArtStatusMap] = useState<ArticleStatusBadgeMap>({});
  const [polBadgeMap,  setPolBadgeMap]  = useState<PolicyBadgeMap>({});
  const [vBadgeFn,     setVBadgeFn]     = useState<((v: PolicyViolation[]) => string[])>(() => []);
  const [loading,      setLoading]      = useState(true);
  const [error,        setError]        = useState('');
  const [refreshKey,   setRefreshKey]   = useState(0);
  const [expandedArticle, setExpandedArticle] = useState<string | null>(null);

  const searchParams = useSearchParams();
  const secret = searchParams.get('secret');

  // ---------- Data fetch ----------

  const fetchTab = useCallback(async (tab: TabId) => {
    const url = `/api/admin/workflows?secret=${secret}&tab=${tab}`;
    const res = await fetch(url);
    if (!res.ok) {
      const d = await res.json().catch(() => ({}));
      throw new Error(d.error || d.details || `HTTP ${res.status}`);
    }
    const d = await res.json();
    return d;
  }, [secret]);

  const loadAll = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      // Load workflow tabs in parallel for speed
      const [wfRes, histRes, draftsRes, rejectedRes] = await Promise.all([
        fetchTab('workflow'),
        fetchTab('history'),
        fetchTab('drafts'),
        fetchTab('rejected'),
      ]);

      setActiveRuns(wfRes.runs      || []);
      setRunHistory(histRes.runs    || []);
      setStepLabels(wfRes.stepLabels         || {});
      setStepDescs(wfRes.stepDescriptions    || {});
      setStatusBadge(wfRes.statusBadge       || {});

      setArtStatusMap(draftsRes.articleStatusBadge    || {});
      setPolBadgeMap(draftsRes.policyBadge           || {});
      setVBadgeFn(defaultViolationBadges);
      setArticles(draftsRes.drafts                  || []);
    } catch (err: any) {
      setError(err.message || 'Failed to load data');
    } finally {
      setLoading(false);
    }
  }, [fetchTab]);

  useEffect(() => {
    if (!secret) { setError('Missing ?secret= parameter'); setLoading(false); return; }
    loadAll();
  }, [secret, loadAll, refreshKey]);

  // ---------- helpers on handleApprove/reject above ----------

  // ---------- Tab content ----------

  const renderDrafts = () => {
    if (!articles.length) return (
      <div className="text-center py-16">
        <FileText className="w-12 h-12 text-gray-300 mx-auto mb-4" />
        <p className="text-gray-500 font-medium">No drafts pending review</p>
        <p className="text-sm text-gray-400 mt-1">The AI automation worker will generate new drafts periodically.</p>
      </div>
    );
    return (
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-5">
        {articles.map(art => (
          <ArticleCard key={art.slug} article={art} secret={secret!} />
        ))}
      </div>
    );
  };

  const renderRejected = () => {
    // Rejected tab re-uses `articles` since we already filtered in the API call
    if (!articles.length) return (
      <div className="text-center py-16">
        <XCircle className="w-12 h-12 text-gray-300 mx-auto mb-4" />
        <p className="text-gray-500 font-medium">No rejected articles</p>
        <p className="text-sm text-gray-400 mt-1">
          Articles with failing policy checks and exhausted retry counts appear here.
          You can also manually delete them from the Drafts tab.
        </p>
      </div>
    );
    return (
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-5">
        {articles.map(art => (
          <ArticleCard key={art.slug} article={art} secret={secret!} />
        ))}
      </div>
    );
  };

  const renderWorkflow = () => {
    if (!activeRuns.length) return (
      <div className="text-center py-16">
        <Zap className="w-12 h-12 text-gray-300 mx-auto mb-4" />
        <p className="text-gray-500 font-medium">No workflow is currently running</p>
        <p className="text-sm text-gray-400 mt-1">
          Workflows run automatically on a cron schedule. Trigger one manually from History.
        </p>
        <button
          onClick={() => { /* TODO: trigger workflow endpoint */ }}
          className="mt-4 px-4 py-2 bg-blue-600 text-white rounded text-sm hover:bg-blue-700"
        >
          ⚡ Trigger Workflow Now
        </button>
      </div>
    );

    return activeRuns.map(run => {
      const ms  = typeof run.duration === 'string' ? run.duration : 'unknown';
      const sb  = statusBadge[run.workflowStatus] || { bg: 'bg-gray-100', text: 'text-gray-600' };
      const now = new Date();
      const sinceStart  = defaultTimeAgo(run.createdAt);
      const sinceUpdate = defaultTimeAgo(run.updatedAt);

      return (
        <div key={run.workflowId} className="border border-gray-200 rounded-xl p-6 bg-white shadow-sm mb-8 scroll-mt-24">
          {/* ── Run header ── */}
          <div className="flex flex-wrap gap-4 items-start justify-between mb-4 pb-4 border-b">
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h3 className="text-lg font-semibold font-mono">{run.workflowId}</h3>
                <Badge
                  label={run.workflowStatus.toUpperCase()}
                  bgClass={sb.bg}
                  textClass={sb.text}
                />
                {!run.hasGroqApiKey && <Badge label="⚠ No GROQ_API_KEY" bgClass="bg-red-100" textClass="text-red-700" />}
              </div>
              <div className="text-sm text-gray-500 mt-1 space-x-3">
                <span>⏱ {ms}</span>
                <span>Started {sinceStart}</span>
                <span>Updated {sinceUpdate}</span>
                <span>Article {run.currentIndex + 1}/{run.totalArticles}</span>
                <span>Runs: {run.runCount}</span>
              </div>
            </div>
            <button
              onClick={() => setRefreshKey(k => k + 1)}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 border border-gray-300 rounded text-sm hover:bg-gray-50"
            >
              <RefreshCw className="w-3.5 h-3.5" /> Refresh
            </button>
          </div>

          {/* ── Stepper ── */}
          <WorkflowStepper
            stepLabels={stepLabels}
            stepDescriptions={stepDescs}
            currentStep={run.step}
          />

          {/* ── Error banner ── */}
          {run.errors?.length > 0 && (
            <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg space-y-2">
              <p className="text-sm font-medium text-red-700 flex items-center gap-2"><AlertTriangle className="w-4 h-4" /> Errors</p>
              {run.errors.map((e: string, i: number) => (
                <p key={i} className="text-xs text-red-600 font-mono bg-red-100/50 p-2 rounded">
                  {e}
                </p>
              ))}
            </div>
          )}

          {/* ── Articles in workflow ── */}
          <div className="mt-4">
            <h4 className="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
              <Trophy className="w-4 h-4" />
              Articles in Pipeline ({run.articles.length})
            </h4>
            <div className="space-y-2">
              {run.articles.map((art: any) => {
                const seq = expandedArticle;
                return (
                  <WorkflowArticleRow
                    key={art.slug + art.position}
                    article={art}
                    stepLabels={stepLabels}
                    violationBadges={(v: any) => defaultViolationBadges(v || [])}
                    timeAgo={defaultTimeAgo}
                    showDetails={expandedArticle === art.slug}
                    onToggle={() => setExpandedArticle(seq === art.slug ? null : art.slug)}
                  />
                );
              })}
            </div>
          </div>
        </div>
      );
    });
  };

  const renderHistory = () => {
    if (!runHistory.length) return (
      <div className="text-center py-16">
        <Clock className="w-12 h-12 text-gray-300 mx-auto mb-4" />
        <p className="text-gray-500 font-medium">No workflow history yet</p>
      </div>
    );

    return (
      <div className="space-y-4">
        {runHistory.map(run => {
          const ms  = typeof run.duration === 'string' ? run.duration : '—';
          const sb  = statusBadge[run.workflowStatus] || { bg: 'bg-gray-100', text: 'text-gray-600' };
          const statusDot = run.workflowStatus === 'completed' ? '●' : run.workflowStatus === 'failed' ? '●' : '◑';

          return (
            <div key={run.workflowId} className="border border-gray-200 rounded-xl overflow-hidden bg-white">
              <div className="px-5 py-4 bg-gray-50/50 border-b flex flex-wrap gap-x-4 gap-y-1 items-center justify-between">
                <div className="flex items-center gap-3 flex-wrap">
                  <span className={`text-sm ${run.workflowStatus === 'completed' ? 'text-green-600' : run.workflowStatus === 'failed' ? 'text-red-600' : 'text-blue-600'}`}>
                    {statusDot}
                  </span>
                  <code className="text-xs font-mono text-gray-600 bg-white px-2 py-0.5 rounded border border-gray-200">
                    {run.workflowId}
                  </code>
                  <Badge label={run.workflowStatus.toUpperCase()} bgClass={sb.bg} textClass={sb.text} />
                  <span className="text-sm text-gray-500">{stepLabels[run.step] || run.step}</span>
                  <span className="text-xs text-gray-400">⏱ {ms}</span>
                  <span className="text-xs text-gray-400">{run.currentIndex + 1}/{run.totalArticles} articles</span>
                </div>
                <span className="text-xs text-gray-400 whitespace-nowrap">
                  {defaultTimeAgo(run.updatedAt)}
                </span>
              </div>

              {run.errors?.length > 0 && (
                <div className="px-5 py-2 bg-red-50 border-b border-red-200 space-y-1">
                  {run.errors.map((e: string, i: number) => (
                    <p key={i} className="text-xs text-red-700 font-mono">{e}</p>
                  ))}
                </div>
              )}

              {/* Mini article table */}
              {run.articles.length > 0 && (
                <div className="p-4">
                  <table className="w-full text-xs">
                    <thead>
                      <tr className="text-left text-gray-500 border-b">
                        <th className="pb-2 pr-4 w-8">#</th>
                        <th className="pb-2 pr-4">Title / Slug</th>
                        <th className="pb-2 pr-4">Status</th>
                        <th className="pb-2 pr-4">Policy</th>
                        <th className="pb-2">Score</th>
                      </tr>
                    </thead>
                    <tbody>
                      {run.articles.map((art: any) => {
                        const pol = polBadgeMap[art.policyResult as string];
                        const statusCls = ARTICLE_STATUS_BADGE_MAP[art.status] || ARTICLE_STATUS_BADGE_MAP['draft'];
                        return (
                          <tr key={art.slug + art.position} className="border-b last:border-b-0">
                            <td className="py-2 pr-4 text-gray-400">{art.position + 1}</td>
                            <td className="py-2 pr-4">
                              <span className="font-medium block truncate max-w-xs">{art.title || art.slug}</span>
                              <span className="text-gray-400">{art.slug}</span>
                            </td>
                            <td className="py-2 pr-4">
                              <Badge label={art.status.toUpperCase()} bgClass={statusCls.bg} textClass={statusCls.text} />
                            </td>
                            <td className="py-2 pr-4">
                              {art.policyResult && pol
                                ? <Badge label={art.policyResult.toUpperCase()} bgClass={pol.bg} textClass={pol.text} />
                                : <span className="text-gray-400">—</span>
                              }
                            </td>
                            <td className="py-2">
                              {art.qualityScore != null
                                ? <span className={`font-medium ${art.qualityScore < 50 ? 'text-red-600' : 'text-green-600'}`}>
                                    {art.qualityScore}/100
                                  </span>
                                : <span className="text-gray-400">—</span>
                              }
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                  {run.articles.some((a: any) => a.persistError) && (
                    <div className="mt-2 space-y-1">
                      {run.articles.filter((a: any) => a.persistError).map((art: any, i: number) => (
                        <p key={i} className="text-xs text-red-600 font-mono bg-red-50 p-2 rounded">
                          [{art.slug}] Persist Error: {art.persistError}
                        </p>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {run.articles.length === 0 && (
                <div className="p-4 text-sm text-gray-400 text-center">No articles in this run.</div>
              )}
            </div>
          );
        })}
      </div>
    );
  };

  // ---------- Secret check ----------

  if (!secret) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Admin Access Required</h1>
          <p className="text-gray-500">Add <code>?secret=YOUR_ADMIN_SECRET</code> to the URL</p>
        </div>
      </div>
    );
  }

  // ---------- Render ----------

  return (
    <div className="min-h-screen p-4 sm:p-6 pt-24 max-w-7xl mx-auto">
      {/* ── Page header ── */}
      <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
        <h1 className="text-2xl sm:text-3xl font-bold">Arabia Khaleej — Admin</h1>
        <div className="flex gap-2">
          <button
            onClick={() => setRefreshKey(k => k + 1)}
            className="inline-flex items-center gap-1.5 px-4 py-2 border border-gray-300 rounded-lg text-sm hover:bg-gray-50"
          >
            <RefreshCw className="w-4 h-4" /> Refresh
          </button>
        </div>
      </div>

      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm font-mono">
          {error}
        </div>
      )}

      {/* ── Tabs ── */}
      <nav className="flex gap-1 border-b border-gray-200 mb-6 overflow-x-auto pb-0">
        {TABS.map(t => {
          const count = t.id === 'drafts'   ? articles.length
                      : t.id === 'rejected' ? articles.length
                      : t.id === 'workflow' ? activeRuns.length
                      : runHistory.length;
          const isActive = activeTab === t.id;

          return (
            <button
              key={t.id}
              onClick={() => setActiveTab(t.id)}
              className={`flex items-center gap-1.5 px-4 py-3 text-sm font-medium border-b-2 whitespace-nowrap transition-colors
                ${isActive
                  ? 'border-blue-600 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'}`}
            >
              {t.icon} {t.label}
              {count > 0 && (
                <span className={`ml-1 inline-flex items-center justify-center min-w-[20px] h-5 rounded-full text-[10px] font-bold px-1
                  ${isActive ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 text-gray-500'}`}>
                  {count}
                </span>
              )}
            </button>
          );
        })}
      </nav>

      {/* ── Tab panels ── */}
      {loading ? (
        <div className="flex items-center justify-center py-20">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mr-3" />
          <span className="text-gray-600">Loading…</span>
        </div>
      ) : (
        <>
          {(activeTab === 'drafts' || activeTab === 'rejected') && activeTab === 'drafts' && renderDrafts()}
          {activeTab === 'rejected'                                            && renderRejected()}
          {activeTab === 'workflow'                                            && renderWorkflow()}
          {activeTab === 'history'                                             && renderHistory()}
        </>
      )}
    </div>
  );
}

// Helper map for rejected/history table
const ARTICLE_STATUS_BADGE_MAP: Record<string, { bg: string; text: string }> = {
  draft:     { bg: 'bg-gray-100',    text: 'text-gray-600' },
  pending:   { bg: 'bg-blue-50',     text: 'text-blue-700' },
  failed:    { bg: 'bg-red-50',      text: 'text-red-700' },
  deleted:   { bg: 'bg-gray-200',    text: 'text-gray-500' },
  rejected:  { bg: 'bg-orange-50',   text: 'text-orange-700' },
  published: { bg: 'bg-green-50',    text: 'text-green-700' },
};
