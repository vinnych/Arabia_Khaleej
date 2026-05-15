/**
 * Workflow Types
 * Shared types for the agentic workflow state machine.
 */

export type WorkflowStep = 'init' | 'trending' | 'filter' | 'generate' | 'policy' | 'score' | 'persist' | 'done' | 'error';
export type WorkflowStatus = 'running' | 'retrying' | 'completed' | 'failed';

export type PolicyResult = 'pass' | 'fail' | 'delete';

export interface PolicyViolation {
  category: string;
  reason: string;
  severity: 'critical' | 'warning' | 'info';
  location?: string;
}

export interface ArticleDraft {
  id: string;
  country: string;
  topic: string;
  lang: 'en' | 'ar';
  title: string;
  slug: string;
  description: string;
  content: string;
  category: string;
  tags: string[];
  image: string;
  pubDate: string;
  status: 'pending' | 'approved' | 'rejected' | 'deleted';
  retryCount: number;
  maxRetries: number;
  policyResult?: PolicyResult;
  policyViolations?: PolicyViolation[];
  policyCheckedAt?: string;
  qualityScore?: number;
  wordCount?: number;
  regenerateContext?: { violations: string; actions: string };
}

export interface TrendingTopic {
  country: string;
  topic: string;
  adsenseScore?: number;
  diversityLabel?: string;
  isSafe?: boolean;
  reasons?: string[];
}

export interface WorkflowState {
  workflowId: string;
  step: WorkflowStep;
  workflowStatus: WorkflowStatus;
  createdAt: string;
  updatedAt: string;
  currentIndex: number;
  articles: ArticleDraft[];
  trendingTopics: TrendingTopic[];
  errors: string[];
  hasGroqApiKey: boolean;
  runCount: number;
  adminSecret: string;
}

export interface NodeResponse {
  ok: boolean;
  step: WorkflowStep;
  error?: string;
  nextAction?: NextAction;
  summary: string;
  state: Partial<WorkflowState>;
}

export type NextAction =
  | { type: 'fetch'; method: 'GET' | 'POST'; url: string; body?: unknown }
  | { type: 'done' };