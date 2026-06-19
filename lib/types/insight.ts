/**
 * Arabia Khaleej — Insight and Article Type Definitions
 */

export interface InsightItem {
  id: string;
  slug: string;
  title: string;
  description: string;
  link: string;
  pubDate: string;
  source: string;
  category: 'gcc' | 'expat';
  language: 'en' | 'ar' | 'regional';
  image?: string;
  tags?: string[];
  content?: string;
  status?: 'draft' | 'pending' | 'published' | 'rejected' | 'deleted' | 'failed';
  author?: {
    id: string;
    name: string;
    role: string;
  };
  humanEdited?: boolean;
  editedAt?: string;
  qualityScore?: number;
  policyResult?: 'pass' | 'fail' | 'delete';
  policyViolations?: {
    category: string;
    reason: string;
    severity: 'critical' | 'warning' | 'info';
    location?: string;
  }[];
  wordCount?: number;
  retryCount?: number;
  maxRetries?: number;
  country?: string;
  topic?: string;
  persistError?: string;
}

export interface BilingualInsightItem {
  id: string;
  slug: string;
  title: string | { en: string; ar: string };
  description: string | { en: string; ar: string };
  link: string;
  pubDate: string;
  source: string;
  category: 'gcc' | 'expat';
  language: 'en' | 'ar' | 'regional';
  image?: string;
  tags?: string[];
  content?: string | { en: string; ar: string };
  status?: 'draft' | 'pending' | 'published' | 'rejected' | 'deleted' | 'failed';
  author?: {
    id: string;
    name: string | { en: string; ar: string };
    role: string | { en: string; ar: string };
  };
  humanEdited?: boolean;
  editedAt?: string;
  qualityScore?: number;
  policyResult?: 'pass' | 'fail' | 'delete';
  policyViolations?: {
    category: string;
    reason: string;
    severity: 'critical' | 'warning' | 'info';
    location?: string;
  }[];
  wordCount?: number;
  retryCount?: number;
  maxRetries?: number;
  country?: string;
  topic?: string;
  persistError?: string;
}
