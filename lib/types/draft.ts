/**
 * Arabia Khaleej — Draft Type Definitions
 */

export interface SetDraftOptions {
  ttlSeconds?: number;
}

export interface DraftItem {
  topic: string;
  status: 'generating' | 'pending_review' | 'published' | 'error' | 'rejected';
  word_count?: number;
  content?: string | { en: string; ar: string };
  image_url?: string;
  error?: string;
  description?: string | { en: string; ar: string };
  tags?: string[];
  timestamp: number;
  qualityScore?: number;
  slug?: string;
  title?: string | { en: string; ar: string };
  id?: string;
  image?: string;
  wordCount?: number;
}
