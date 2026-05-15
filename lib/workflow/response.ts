import { NextAction, NodeResponse, WorkflowState, WorkflowStep } from './types';

export function ok(
  step: WorkflowStep,
  state: Partial<WorkflowState>,
  nextAction?: NextAction,
  summary = ''
): NodeResponse {
  return { ok: true, step, nextAction, summary, state };
}

export function fail(
  step: WorkflowStep,
  error: string,
  state: Partial<WorkflowState> = {}
): NodeResponse {
  return { ok: false, step, summary: error, error, state };
}