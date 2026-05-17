import { NextRequest, NextResponse } from 'next/server';
import { redis, setWithCompression, CACHE_TIMES } from '@/lib/redis';
import { generateGCCInsight } from '@/lib/ai';
import { toSlug } from '@/lib/utils';
import { getRelevantImage } from '@/lib/images';
import { loadWorkflowState, saveWorkflowState, deleteWorkflow } from '@/lib/workflow/utils';
import { InsightItem } from '@/lib/insights';
import { NodeResponse, WorkflowState, ArticleDraft } from '@/lib/workflow/types';
import { REGENERATE_PROMPT } from '@/lib/workflow/prompts';
import { GROQ_API_URL } from '@/lib/constants/api';
import { ok, fail } from '@/lib/workflow/response';

export const runtime = 'edge';
export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest): Promise<NextResponse<NodeResponse>> {
  const { searchParams } = new URL(request.url);
  const wid = searchParams.get('wid');
  const idx = parseInt(searchParams.get('idx') || '0');
  const stepLabel = 'generate[' + idx + ']';

  if (!wid) return NextResponse.json(fail('error', 'Missing workflow ID', {}));
  console.log('[WF ' + stepLabel + '] wid=' + wid + ' idx=' + idx);

  const state = await loadWorkflowState(wid);
  if (!state) return NextResponse.json(fail('error', 'Workflow not found: ' + wid, { workflowId: wid }));

  if (!process.env.GROQ_API_KEY) return NextResponse.json(fail('error', 'GROQ_API_KEY missing', state));

  const article = state.articles[idx];
  if (!article) return NextResponse.json(fail('error', 'Article ' + idx + ' not found in workflow', state));

  const country = article?.country || '';
  const topic = article?.topic || '';

  if (!country || !topic) {
    return NextResponse.json(
      fail('error', 'Article ' + idx + ' missing country/topic', state)
    );
  }

  console.log('[WF ' + stepLabel + '] country=' + country + ' topic=' + topic + ' regenerate=' + !!article.regenerateContext);

  // -- Generate article -------------------------------------------
  let aiResult;
  try {
    if (article.regenerateContext && article.content) {
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
      if (!groqRes.ok) throw new Error('Regeneration API failed: HTTP ' + groqRes.status);
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
  const newSlug = toSlug(aiResult.title + ' ' + topic);
  const imageUrl = await getRelevantImage(topic + ' ' + country, newSlug).catch((err) => {
    console.warn('Image fetch failed, using default:', err);
    return '/images/insights/default.png';
  });
  const wordCount = (aiResult.content.match(/\b\w+\b/g) || []).length;

  const safeTitle = aiResult.title || `${country}: ${topic}`;
  const safeSummary = aiResult.summary || `Analysis of ${topic} in ${country}`;
  const safeContent = aiResult.content || '';
  const safeCategory = (aiResult.category as InsightItem['category']) || 'gcc';
  const safeAuthor = aiResult.author ?? { name: "Arabia Khaleej Editorial Team", nameAr: "هيئة تحرير عربية خليج", title: "Editorial Board", titleAr: "هيئة التحرير" };

  const freshArticle: InsightItem = {
    id: 'wf-' + wid.slice(-6) + '-a' + idx,
    slug: newSlug,
    title: safeTitle,
    description: safeSummary,
    content: safeContent,
    link: '/insights/' + newSlug,
    pubDate: new Date().toISOString(),
    source: safeAuthor.name,
    category: safeCategory,
    language: 'en',
    tags: ['gcc', 'intelligence', (safeCategory?.toLowerCase() || 'strategy') as string].filter(Boolean),
    image: imageUrl,
    status: 'draft' as const,
    humanEdited: false,
  };

  // -- Save article body to Redis (main store) -------------------
  const articleKey = 'insights:draft:article:' + newSlug;
  try {
    await setWithCompression(articleKey, freshArticle, { ex: CACHE_TIMES.INSIGHTS_ARCHIVE });
  } catch (err) {
    console.error(`Failed to save article to Redis ${articleKey}:`, err);
    await redis.del(articleKey).catch(() => {});
    return NextResponse.json(fail('error', 'Failed to save generated article to Redis', state));
  }

  // -- Error-recovery: clean up stale Redis orphan from prior slug --
  if (article.slug && article.slug !== newSlug) {
    const oldArticleKey = 'insights:draft:article:' + article.slug;
    await redis.del(oldArticleKey).catch((err) => {
      console.warn(`Failed to delete old article key ${oldArticleKey}:`, err);
    });
  }

  // -- Update workflow state --------------------------------------
  state.articles[idx] = {
    ...article,
    title: safeTitle,
    slug: newSlug,
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

  try {
    await saveWorkflowState(wid, state);
  } catch (err) {
    console.error(`Failed to save workflow state ${wid}:`, err);
    // Revert in-memory article body change — caller gets a clear error
    return NextResponse.json(fail('error', 'Failed to persist workflow state after generation', state));
  }

  // -- Chain to policy check --------------------------------------
  console.log('[WF ' + stepLabel + '] Chain -> policy wid=' + wid + ' idx=' + idx);
  return NextResponse.json(
    ok('policy', state,
      { type: 'fetch', method: 'GET',
        url: '/api/workflow/policy/' + idx + '?wid=' + wid + '&idx=' + idx },
      'Article generated: ' + aiResult.title + ' (' + wordCount + 'w), chaining to policy check'
    )
  );
}
