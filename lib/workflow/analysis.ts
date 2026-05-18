import { redis } from '@/lib/redis';
import { WorkflowState, NodeResponse, ArticleDraft, PolicyViolation } from '@/lib/workflow/types';
import { ok, fail } from '@/lib/workflow/response';

/**
 * Shared content analysis helpers.
 * Single source of truth for statistics / citations / entities.
 * Used by policy and scoring nodes to avoid duplication.
 */

/** Count numbers, currencies, and percentage figures in text */
export function countStats(text: string): number {
  return (text.match(/\d{1,3}(?:,\d{3})*(?:\.\d+)?%?|\$\d[\d.]*|USD|GBP|SAR|AED/g) || []).length;
}

/** Count named entities - supports Latin (Title Case) and Arabic (proper nouns) */
export function countEntities(text: string): number {
  const latin = (text.match(/\b([A-Z][a-z]+(?:\s+[A-Z][a-z]+)+)\b/g) || []).length;
  const arabic = (text.match(/[\u0600-\u06FF]{2,}/g) || []).length;
  return latin + arabic;
}

/** Count citation / source references in text */
export function countCitations(text: string): number {
  return (text.match(/(?:according to|source:|reports?|ministry|authority|announced|data from|statistics show)/gi) || []).length;
}

/** Count markdown headings (H1-H3) */
export function countSections(text: string): number {
  return (text.match(/^#{1,3}\s+.+$/gm) || []).length;
}

/**
 * AdSense richness check — needs minimum stats and citations for compliance.
 * Thin content below these thresholds is flagged as a policy violation.
 */
export function checkRichness(
  content: string,
  wordCount: number
): { isRich: boolean; stats: number; citations: number; reasons: string[] } {
  const stats = countStats(content);
  const citations = countCitations(content);
  const reasons: string[] = [];

  const minStats = wordCount >= 1100 ? 3 : 1;
  const minCitations = wordCount >= 1100 ? 2 : 1;

  const isRich = stats >= minStats && citations >= minCitations;
  if (stats < minStats) reasons.push(`Need ${minStats}+ statistics (found ${stats})`);
  if (citations < minCitations) reasons.push(`Need ${minCitations}+ citations (found ${citations})`);

  return { isRich, stats, citations, reasons };
}

/**
 * Return a 0-100 quality score across five weighted dimensions:
 * word count · sections · citations · statistics · entities
 */
export function scoreArticle(
   article: { content?: string }
): {
   score: number;
   wordCount: number;
   sections: number;
   citations: number;
   stats: number;
   entities: number;
} {
   const text = article.content ?? '';
   const words = (text.match(/\b\w+\b/g) || []).length;
   const sections = countSections(text);
   const citations = countCitations(text);
   const stats = countStats(text);
   const entities = countEntities(text);

   const wordScore = Math.min(30, Math.round(30 * Math.min(1, words / 1100)));
   const sectionScore = Math.min(20, Math.round(20 * Math.min(1, sections / 3)));
   const citeScore = Math.min(15, Math.round(15 * Math.min(1, citations / 2)));
   const statsScore = Math.min(15, Math.round(15 * Math.min(1, stats / 1)));
   const entScore = Math.min(20, Math.round(20 * Math.min(1, entities / 3)));

   let score = wordScore + sectionScore + citeScore + statsScore + entScore;

   if (citations === 0 && words > 1100) score -= 5;
   if (stats === 0 && words > 1100) score -= 5;
   if (entities === 0 && words > 1100) score -= 5;

   return {
      score: Math.max(0, Math.min(100, score)),
      wordCount: words,
      sections,
      citations,
      stats,
      entities,
   };
}
