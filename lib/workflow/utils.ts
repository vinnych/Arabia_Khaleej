import { redis } from '@/lib/redis';
import { WorkflowState } from './types';

const PREFIX = 'wf:';
const TTL    = 3600; // Reduced from 24h to 1h - workflows complete in minutes

export async function loadWorkflowState(wid: string): Promise<WorkflowState | null> {
  try {
    const raw = await redis.get(PREFIX + wid);
    if (!raw) return null;
    return typeof raw === 'string' ? JSON.parse(raw) as WorkflowState : raw as WorkflowState;
  } catch { return null; }
}

export async function saveWorkflowState(wid: string, state: WorkflowState): Promise<string | null> {
  return redis.set(PREFIX + wid, JSON.stringify(state), { ex: TTL });
}

export async function bumpTtl(wid: string): Promise<void> {
  try { await redis.expire(PREFIX + wid, TTL); } catch (err) {
    console.warn('Failed to bump TTL for workflow ' + wid + ':', err);
  }
}

export async function deleteWorkflow(wid: string): Promise<void> {
  try { await redis.del(PREFIX + wid); } catch (err) {
    console.error('Failed to delete workflow ' + wid + ':', err);
  }
}