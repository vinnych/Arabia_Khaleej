import { NextRequest, NextResponse } from 'next/server';
import { redis } from '@/lib/redis';
import { generateGCCInsight } from '@/lib/ai';
import { toSlug } from '@/lib/utils';
import { getRelevantImage } from '@/lib/images';
import { loadWorkflowState, saveWorkflowState } from '@/lib/workflow/utils';
import { InsightItem } from '@/lib/insights';
import { NodeResponse, WorkflowState } from '@/lib/workflow/types';
import { REGENERATE_PROMPT } from '@/lib/workflow/prompts';
import { GROQ_API_URL } from '@/lib/constants/api';
import { ok, fail } from '@/lib/workflow/response';

export const runtime = 'edge';
export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest): Promise<NextResponse<NodeResponse>> {
  const { searchParams } = new URL(request.url);
  const wid = searchParams.get('wid');
  const idxStr = searchParams.get('idx');
  const idx = parseInt(idxStr || '0');

  if (!wid) return NextResponse.json(fail('error', 'Missing workflow ID', {}));

  const state = await loadWorkflowState(wid);
  if (!state) return NextResponse.json(fail('error', 'Workflow not found: ' + wid, { workflowId: wid }));

  if (!process.env.GROQ_API_KEY) return NextResponse.json(fail('error', 'GROQ_API_KEY missing', state));

  // Determine country/topic from state (set by trending/filter node)
  const article = state.articles[idx];
  const country = article?.country || '';
  const topic = article?.topic || '';

  if (!country || !topic) {
    return NextResponse.json(
      fail('error', 'Article ' + idx + ' missing country/topic', state)
    );
  }

  // -- Generate article -------------------------------------------
  let aiResult;
  try {
    // Check for regeneration context from policy failure
    if (article.regenerateContext && article.content) {
      // Regenerate using REGENERATE_PROMPT for targeted rewrite
      const { violations, actions } = article.regenerateContext;
      const regenPrompt = REGENERATE_PROMPT(violations, actions, article.content);
      const groqRes = await fetch(GROQ_API_URL, {
        method: 'POST',
        headers: {
          'Authorization': 'Bearer ' + process.env.GROQ_API_KEY,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'llama-3.3-70b-versatile',
          messages: [
            { role: 'system', content: 'You rewrite articles to fix AdSense policy violations.' },
            { role: 'user', content: regenPrompt },
          ],
          temperature: 0.6,
          max_tokens: 8192,
          response_format: { type: 'json_object' },
        }),
      });
      if (!groqRes.ok) throw new Error('Regeneration API failed');
      const data = await groqRes.json();
      aiResult = JSON.parse(data.choices[0].message.content);
    } else {
      aiResult = await generateGCCInsight(country, topic, 'en', 'llama-3.3-70b-versatile');
    }
  } catch (err: any) {
    console.error('Insight generation failed:', err);
    return NextResponse.json(
      fail('error', 'Insight generation failed: ' + (err?.message || err), state)
    );
  }

  // -- Build InsightItem ------------------------------------------
  const slug = toSlug(aiResult.title + ' ' + topic);
  const imageUrl = await getRelevantImage(topic + ' ' + country, slug).catch((err) => {
    console.warn('Image fetch failed, using default:', err);
    return '/images/insights/default.png';
  });
  const wordCount = (aiResult.content.match(/\b\w+\b/g) || []).length;

  // Safety check for required fields from AI response
  const safeTitle = aiResult.title || `${country}: ${topic}`;
  const safeSummary = aiResult.summary || `Analysis of ${topic} in ${country}`;
  const safeContent = aiResult.content || "";
  const safeCategory = (aiResult.category as InsightItem['category']) || 'gcc';
  const safeAuthor = aiResult.author ?? { name: "Arabia Khaleej Editorial Team", nameAr: "هيئة تحرير عربية خليج", title: "Editorial Board", titleAr: "هيئة التحرير" };

  const freshArticle: InsightItem = {
    id: 'wf-' + wid.slice(-6) + '-a' + idx,
    slug,
    title: safeTitle,
    description: safeSummary,
    content: safeContent,
    link: '/insights/' + slug,
    pubDate: new Date().toISOString(),
    source: safeAuthor.name,
    category: safeCategory,
    language: 'en',
    tags: ['gcc', 'intelligence', (safeCategory?.toLowerCase() || 'strategy') as string].filter(Boolean),
    image: imageUrl,
    status: 'draft' as const,
    humanEdited: false,
  };

  // Clean up old slug if it changed during regeneration (prevents Redis orphaned keys)
  if (article.slug && article.slug !== slug) {
    const oldArticleKey = 'insights:draft:article:' + article.slug;
    await redis.del(oldArticleKey).catch((err) => {
      console.warn(`Failed to delete old article key ${oldArticleKey}:`, err);
    });
  }

  // -- Save article body to Redis (main store) -------------------
  const articleKey = 'insights:draft:article:' + slug;
  await redis.set(articleKey, JSON.stringify(freshArticle), { ex: 31536000 }).catch((err) => {
    console.error(`Failed to save article to Redis ${articleKey}:`, err);
    throw err; // Re-throw to fail the request
  });

  // -- Update workflow state --------------------------------------
  state.articles[idx] = {
    ...article,
    title: safeTitle,
    slug,
    description: safeSummary,
    content: safeContent,
    image: imageUrl,
    category: safeCategory,
    tags: ['gcc', 'intelligence', (safeCategory?.toLowerCase() || 'strategy') as string].filter(Boolean),
    wordCount,
    status: 'pending',
    retryCount: article.retryCount || 0,
    maxRetries: article.maxRetries || 1,
  };
  // Clear regenerate context after use to prevent stale rewrites
  delete state.articles[idx].regenerateContext;
  state.step = 'policy';
  state.updatedAt = new Date().toISOString();

  await saveWorkflowState(wid, state).catch((err) => {
    console.error(`Failed to save workflow state ${wid}:`, err);
    throw err; // Re-throw to fail the request
  });

  // -- Chain to policy check --------------------------------------
  return NextResponse.json(
    ok('policy', state,
      { type: 'fetch', method: 'GET',
        url: '/api/workflow/policy/' + idx + '?wid=' + wid + '&idx=' + idx },
      'Article generated: ' + aiResult.title + ' (' + wordCount + 'w), chaining to policy check'
    )
  );
}