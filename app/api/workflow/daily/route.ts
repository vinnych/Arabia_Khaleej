import { NextRequest, NextResponse } from 'next/server';
import { loadWorkflowState } from '@/lib/workflow/utils';
import { WorkflowState, NextAction } from '@/lib/workflow/types';
import { ok, fail } from '@/lib/workflow/response';

export const runtime = 'edge';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json().catch(() => ({})) as {
      articleCount?: number;
      workflowId?: string | null;
      adminSecret?: string | null;
    };
    const articleCount: number = Math.min(Math.max(body.articleCount ?? 1, 1), 5);

    const existingId = typeof body.workflowId === 'string' ? body.workflowId : null;
    const workflowId = existingId || 'wf-' + Date.now().toString(36) + '-' + Math.random().toString(36).slice(2, 6);
    const adminSecret = typeof body.adminSecret === 'string' && body.adminSecret?.length > 0
      ? body.adminSecret
      : 'wf-' + Date.now().toString(36) + '-' + Math.random().toString(36).slice(2, 7);

    // Try to load existing workflow state for resume
    const existing: WorkflowState | null = existingId
      ? await loadWorkflowState(existingId).catch(() => null)
      : null;

    if (!existing) {
      const articles = Array.from({ length: articleCount }, (_, i) => ({
        id: 'placeholder-' + i,
        country: '', topic: '', lang: 'en' as const, title: '', slug: '', description: '',
        content: '', category: 'high-utility' as const, tags: [], image: '', pubDate: new Date().toISOString(),
        status: 'pending' as const, retryCount: 0, maxRetries: 1,
      }));
      const freshState: WorkflowState = {
        workflowId, step: 'init', workflowStatus: 'running', createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(), currentIndex: 0, articles, trendingTopics: [],
        errors: [], hasGroqApiKey: !!process.env.GROQ_API_KEY, runCount: 0, adminSecret,
      };
      await loadWorkflowState(workflowId).catch(() => null); // Initialize
      const { saveWorkflowState } = await import('@/lib/workflow/utils');
      await saveWorkflowState(workflowId, freshState).catch(() => null);
      return NextResponse.json(ok('init', { workflowId, step: 'init', workflowStatus: 'running' },
        { type: 'fetch', method: 'GET', url: '/api/workflow/trending?wid=' + workflowId + '&idx=0' },
        'Workflow initialized; chaining to /api/workflow/trending'
      ));
    }

    // Resume path
    const stepMap: Record<string, string> = {
      init:      '/api/workflow/trending',
      trending:  '/api/workflow/generate/',
      filter:    '/api/workflow/trending',
      generate:  '/api/workflow/policy/',
      policy:    '/api/workflow/score/',
      score:     '/api/workflow/persist/',
      persist:   '/api/workflow/trending',
      done:      '',
      error:     '/api/workflow/trending',
    };
    const url = stepMap[existing.step] || '';
    return NextResponse.json(ok(existing.step, {
      workflowId,
      step: existing.step,
      currentIndex: existing.currentIndex
    },
      url ? { type: 'fetch', method: 'GET', url: url + existing.currentIndex + '?wid=' + workflowId + '&idx=' + existing.currentIndex } : undefined,
      'Resumed at step: ' + existing.step + ' idx=' + existing.currentIndex
    ));
  } catch (e: any) {
    return NextResponse.json(fail('error', e.message || 'Unknown error'));
  }
}
