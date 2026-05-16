import { redis } from '@/lib/redis';
import { WorkflowState } from './types';

const PREFIX = 'wf:';
const TTL = parseInt(process.env.WORKFLOW_TTL || '21600', 10); // 6h default, configurable via env

export async function loadWorkflowState(wid: string): Promise<WorkflowState | null> {
  const raw = await redis.get(PREFIX + wid);
  if (!raw) return null;
  return typeof raw === 'string' ? JSON.parse(raw) as WorkflowState : raw as WorkflowState;
}

export async function saveWorkflowState(wid: string, state: WorkflowState): Promise<string | null> {
  try {
    return await redis.set(PREFIX + wid, JSON.stringify(state), { ex: TTL });
  } catch (err) {
    console.error('Failed to save workflow state ' + wid + ':', err);
    throw err;
  }
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