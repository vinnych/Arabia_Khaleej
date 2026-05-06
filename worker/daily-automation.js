/**
 * Arabia Khaleej — Daily Automation Worker (Cloudflare)
 * 
 * This worker handles the long-running AI article generation process
 * which exceeds Vercel Hobby's 10s timeout limit.
 * 
 * Features:
 * - Generates 5 high-fidelity articles (3 EN, 2 AR) sequentially.
 * - Respects Groq rate limits (TPM/RPM).
 * - Saves directly to Upstash Redis.
 * - Zero-cost on Cloudflare Free tier.
 */

export default {
  async scheduled(event, env, ctx) {
    ctx.waitUntil(handleAutomation(env));
  },
  
  // Also allow manual trigger via HTTP GET (secured by secret)
  async fetch(request, env) {
    const { searchParams } = new URL(request.url);
    if (searchParams.get('secret') !== env.CRON_SECRET) {
      return new Response('Unauthorized', { status: 401 });
    }
    return new Response(JSON.stringify(await handleAutomation(env)), {
      headers: { 'Content-Type': 'application/json' }
    });
  }
};

async function handleAutomation(env) {
  console.log("Starting Cloudflare Automation...");
  const startTime = Date.now();
  
  try {
    // 1. Generate Topics
    const topics = await generateTrendingTopics(env);
    if (!topics || topics.length === 0) throw new Error("No topics generated");

    const generatedEn = [];
    const generatedAr = [];

    // 2. Generate 3 English Articles (Sequential)
    for (let i = 0; i < 3; i++) {
      if (topics[i]) {
        console.log(`Generating EN: ${topics[i].topic}`);
        const res = await generateSingleArticle('en', 'gcc', topics[i], env);
        if (res) generatedEn.push(res);
        // Small delay to avoid aggressive rate limits
        await new Promise(r => setTimeout(r, 2000));
      }
    }

    // 3. Generate 2 Arabic Articles (Sequential)
    for (let i = 3; i < 5; i++) {
      if (topics[i]) {
        console.log(`Generating AR: ${topics[i].topic}`);
        const res = await generateSingleArticle('ar', 'gcc', topics[i], env);
        if (res) generatedAr.push(res);
        await new Promise(r => setTimeout(r, 2000));
      }
    }

    // 4. Save to Upstash Redis
    for (const lang of ['en', 'ar']) {
      const batch = lang === 'en' ? generatedEn : generatedAr;
      if (batch.length === 0) continue;

      const archiveKey = `insights_archive_${lang}`;
      
      // Get current archive
      const currentRes = await fetch(`${env.UPSTASH_REDIS_REST_URL}/get/${archiveKey}`, {
        headers: { Authorization: `Bearer ${env.UPSTASH_REDIS_REST_TOKEN}` }
      });
      const currentData = await currentRes.json();
      const currentArchive = currentData.result ? JSON.parse(currentData.result) : [];
      
      const existingSlugs = new Set(currentArchive.map(a => a.slug));
      const uniqueBatch = batch.filter(g => !existingSlugs.has(g.slug));

      if (uniqueBatch.length > 0) {
        const updatedArchive = [...uniqueBatch, ...currentArchive].slice(0, 1500);
        // Set with EX (30 days)
        await fetch(`${env.UPSTASH_REDIS_REST_URL}/set/${archiveKey}?ex=2592000`, {
          method: 'POST',
          headers: { Authorization: `Bearer ${env.UPSTASH_REDIS_REST_TOKEN}` },
          body: JSON.stringify(updatedArchive)
        });
      }
    }

    const duration = Math.floor((Date.now() - startTime) / 1000);
    console.log(`Automation Completed in ${duration}s`);
    return { success: true, duration: `${duration}s`, generated: { en: generatedEn.length, ar: generatedAr.length } };

  } catch (error) {
    console.error("Automation Failed:", error.message);
    return { success: false, error: error.message };
  }
}

async function generateSingleArticle(lang, type, item, env) {
  try {
    const model = "llama-3.3-70b-versatile";
    const prompt = lang === 'en' 
      ? `Write a comprehensive, well-researched article about ${item.country} focusing on ${item.topic}. MIN 1500 words. Markdown format. Start with # Title.`
      : `اكتب مقالاً شاملاً ومعمّقاً عن ${item.country} مع التركيز على ${item.topic}. لا يقل عن 1500 كلمة. تنسيق Markdown. ابدأ بـ # العنوان.`;

    const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${env.GROQ_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model,
        messages: [
          { role: "system", content: "You are a regional analyst for Arabia Khaleej." },
          { role: "user", content: prompt }
        ],
        temperature: 0.8,
        max_tokens: 8192,
      }),
    });

    if (!response.ok) return null;
    const data = await response.json();
    const rawContent = data.choices[0].message.content;
    const content = cleanAIContent(rawContent);
    
    if (content.length < 500) return null;

    const firstLine = content.split('\n')[0].replace(/[#*]/g, '').trim();
    const title = firstLine.length > 10 ? firstLine : `${item.country}: ${item.topic}`;
    const slug = toSlug(item.topic, `${Date.now()}`);
    const imageUrl = await getRelevantImage(`${item.topic} ${item.country}`, env);

    return {
      id: `daily-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`,
      slug,
      title,
      description: extractDescription(content),
      content,
      link: `/insights/${slug}`,
      pubDate: new Date().toISOString(),
      source: "Arabia Khaleej Editorial",
      category: "gcc",
      language: lang,
      tags: [type, 'trending', 'premium'],
      image: imageUrl,
    };
  } catch (err) {
    return null;
  }
}

async function generateTrendingTopics(env) {
  const prompt = `Generate 10 trending GCC article topics. Return ONLY a JSON array of objects with keys "country" and "topic".`;
  const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${env.GROQ_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: "llama-3.1-8b-instant",
      messages: [{ role: "user", content: prompt }],
      response_format: { type: "json_object" }
    }),
  });

  if (!response.ok) return [];
  const data = await response.json();
  const parsed = JSON.parse(data.choices[0].message.content);
  return Array.isArray(parsed) ? parsed : (parsed.topics || Object.values(parsed)[0]);
}

async function getRelevantImage(query, env) {
  const pexelsKey = env.PEXELS_API_KEY;
  if (!pexelsKey) return "/images/insights/default.png";
  try {
    const res = await fetch(`https://api.pexels.com/v1/search?query=${encodeURIComponent(query)}&per_page=1`, {
      headers: { 'Authorization': pexelsKey }
    });
    const data = await res.json();
    return data.photos?.[0]?.src?.large2x || "/images/insights/default.png";
  } catch {
    return "/images/insights/default.png";
  }
}

function cleanAIContent(content) {
  return content.replace(/^(Here is|Sure|Certainly|Title:|Article:).*\n+/i, '').trim();
}

function extractDescription(content) {
  const lines = content.split('\n').map(l => l.trim()).filter(Boolean);
  const paragraph = lines.find(l => !l.startsWith('#') && l.length > 80);
  return (paragraph || lines[0] || '').replace(/[#*_]/g, '').trim().substring(0, 180) + '...';
}

function toSlug(title, salt) {
  const base = title.toLowerCase().replace(/[^\u0600-\u06FFa-z0-9\s-]/g, "").trim().replace(/\s+/g, "-").slice(0, 80);
  const hash = Math.random().toString(36).slice(2, 8);
  return `${base}-${hash}`;
}
