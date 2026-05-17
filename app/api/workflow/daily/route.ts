import { NextRequest, NextResponse } from 'next/server';
import { loadWorkflowState, saveWorkflowState } from '@/lib/workflow/utils';
import { WorkflowState, NextAction } from '@/lib/workflow/types';
import { ok, fail } from '@/lib/workflow/response';

export const runtime = 'edge';

export async function POST(request: NextRequest) {
  // Verify cron secret for authentication
  const authHeader = request.headers.get('authorization');
  const expectedSecret = process.env.CRON_SECRET;
  
  if (expectedSecret && authHeader !== `Bearer ${expectedSecret}`) {
    return NextResponse.json(fail('error', 'Unauthorized'), { status: 401 });
  }
  
  try {
    const body = await request.json().catch((err) => {
      console.warn('Failed to parse request body:', err);
      return {};
    }) as {
      articleCount?: number;
      workflowId?: string | null;
      adminSecret?: string | null;
    };
    
    // Validate admin secret for admin-triggered actions
    const providedAdminSecret = body.adminSecret;
    const expectedAdminSecret = process.env.ADMIN_SECRET;
    if (providedAdminSecret && expectedAdminSecret && providedAdminSecret !== expectedAdminSecret) {
      return NextResponse.json(fail('error', 'Invalid admin secret'), { status: 401 });
    }
    
    const articleCount: number = Math.min(Math.max(body.articleCount ?? 1, 1), 5);

    const existingId = typeof body.workflowId === 'string' ? body.workflowId : null;
    const workflowId = existingId || 'wf-' + Date.now().toString(36) + '-' + Math.random().toString(36).slice(2, 6);
    const adminSecret = typeof body.adminSecret === 'string' && body.adminSecret?.length > 0
      ? body.adminSecret
      : 'wf-' + Date.now().toString(36) + '-' + Math.random().toString(36).slice(2, 7);

    console.log('[WF daily] articleCount=' + articleCount + ' workflowId=' + workflowId + ' resume=' + !!existingId);

    // Try to load existing workflow state for resume
    const existing: WorkflowState | null = existingId
      ? await loadWorkflowState(existingId).catch((err) => {
          console.error('Failed to load workflow state for resume [' + existingId + ']:', err);
          return null;
        })
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
        errors: [], hasGroqApiKey: !!process.env.GROQ_API_KEY,         runCount: 0, adminSecret,
      };
      await saveWorkflowState(workflowId, freshState);
      console.log('[WF daily] NEW workflow created wid=' + workflowId + ' idx=0');

      return NextResponse.json(ok('init', { workflowId, step: 'init', workflowStatus: 'running' },
        { type: 'fetch', method: 'GET', url: '/api/workflow/trending?wid=' + workflowId + '&idx=0' },
        'Workflow initialized; chaining to /api/workflow/trending'
      ));
    }

// Resume path
    console.log('[WF daily] RESUMING wid=' + workflowId + ' step=' + existing.step + ' idx=' + existing.currentIndex);
    const stepMap: Record<string, string> = {
      init:      '/api/workflow/trending?',
      trending:  '/api/workflow/generate/',
      filter:    '/api/workflow/trending?',
      generate:  '/api/workflow/policy/',
      policy:    '/api/workflow/score/',
      score:     '/api/workflow/persist/',
      persist:   '/api/workflow/trending?',
      done:      '',
      error:     '/api/workflow/trending?',
    };
    const baseUrl = stepMap[existing.step] || '';
    const nextUrl = baseUrl ? baseUrl + existing.currentIndex + '?wid=' + workflowId + '&idx=' + existing.currentIndex : undefined;

    return NextResponse.json(ok(existing.step, {
      workflowId,
      step: existing.step,
      currentIndex: existing.currentIndex
    },
      nextUrl ? { type: 'fetch', method: 'GET', url: nextUrl } : undefined,
      'Resumed at step: ' + existing.step + ' idx=' + existing.currentIndex
    ));
  } catch (e: any) {
    console.error('Workflow initialization failed:', e);
    return NextResponse.json(fail('error', e.message || 'Unknown error'));
  }
}