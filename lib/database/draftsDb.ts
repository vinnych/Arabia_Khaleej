/**
 * Arabia Khaleej — Drafts Database Facade
 * Preserves the exact draftDb API signature to support existing sync pipelines,
 * while delegation is forwarded to the SOLID Draft Repository.
 */

import { SetDraftOptions } from '../types/draft';
import { getDraftRepository } from './repositories/draftRepository';

const repo = getDraftRepository();

export const draftDb = {
  /**
   * Helper to get the D1 database binding from OpenNext context.
   */
  async getDb(): Promise<any> {
    try {
      const { getCloudflareContext } = await import('@opennextjs/cloudflare');
      const { env } = await getCloudflareContext({ async: true });
      return (env as any).DB || null;
    } catch {
      return null;
    }
  },

  /**
   * Helper to check if D1 database is active (retained for backward-compatibility checks).
   */
  async isD1Active(): Promise<boolean> {
    try {
      const { getCloudflareContext } = await import('@opennextjs/cloudflare');
      const { env } = await getCloudflareContext({ async: true });
      return !!(env as any).DB;
    } catch {
      return false;
    }
  },

  /**
   * Retrieve a draft by topic name or slug.
   */
  getDraft(topicOrSlug: string, dbOverride?: any) {
    return repo.getDraft(topicOrSlug, dbOverride);
  },

  /**
   * Save or update a draft topic.
   */
  setDraft(topic: string, value: any, options?: SetDraftOptions, dbOverride?: any) {
    return repo.setDraft(topic, value, options, dbOverride);
  },

  /**
   * Delete a draft topic.
   */
  delDraft(topic: string, dbOverride?: any) {
    return repo.delDraft(topic, dbOverride);
  },

  /**
   * Safe conditional update for background generation status checks.
   */
  updateDraftIfExist(topic: string, value: any, dbOverride?: any) {
    return repo.updateDraftIfExist(topic, value, dbOverride);
  },

  /**
   * Fetch all active drafts, ordered chronologically.
   */
  getAllDrafts(dbOverride?: any) {
    return repo.getAllDrafts(dbOverride);
  }
};
export type { SetDraftOptions };
