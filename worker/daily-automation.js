/**
 * Arabia Khaleej — Daily Automation Worker (Cloudflare)
 * 
 * This worker handles the long-running AI article generation process
 * with real-time news grounding and optimized decoupled storage.
 */

export default {
  async scheduled(event, env, ctx) {
    ctx.waitUntil(handleAutomation(env));
  },
  
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

/**
 * Compression Helpers (GZIP + Base64)
 */
async function compress(data) {
  const encoder = new TextEncoder();
  const uint8 = encoder.encode(typeof data === 'string' ? data : JSON.stringify(data));
  const stream = new ReadableStream({
    start(controller) {
      controller.enqueue(uint8);
      controller.close();
    },
  }).pipeThrough(new CompressionStream('gzip'));
  const buffer = await new Response(stream).arrayBuffer();
  let binary = '';
  const bytes = new Uint8Array(buffer);
  for (let i = 0; i < bytes.byteLength; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return 'compressed:' + btoa(binary);
}

async function decompress(compressedStr) {
  if (typeof compressedStr !== 'string' || !compressedStr.startsWith('compressed:')) {
    return typeof compressedStr === 'string' ? JSON.parse(compressedStr) : compressedStr;
  }
  const base64 = compressedStr.replace('compressed:', '');
  const binary = atob(base64);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) {
    bytes[i] = binary.charCodeAt(i);
  }
  const stream = new ReadableStream({
    start(controller) {
      controller.enqueue(bytes);
      controller.close();
    },
  }).pipeThrough(new DecompressionStream('gzip'));
  const text = await new Response(stream).text();
  return JSON.parse(text);
}

/**
 * Grounding: Fetch recent news context from Google News RSS
 */
async function fetchNewsContext() {
  try {
    const res = await fetch("https://news.google.com/rss/search?q=GCC+business+economy+technology&hl=en-US&gl=US&ceid=US:en");
    const xml = await res.text();
    // Simple regex to extract titles (don't need a full XML parser in a worker)
    const titles = [...xml.matchAll(/<title>(.*?)<\/title>/g)].map(m => m[1]).slice(1, 15);
    return titles.join("\n");
  } catch (e) {
    return "GCC regional development and economic trends";
  }
}

async function handleAutomation(env) {
  console.log("Starting Optimized Arabia Khaleej Automation...");
  const startTime = Date.now();
  
  try {
    // 1. Fetch Real-time Context
    const newsContext = await fetchNewsContext();

    // 2. Generate Topics with Context
    const topics = await generateTrendingTopics(newsContext, env);
    if (!topics || topics.length === 0) throw new Error("No topics generated");

    const generatedEn = [];
    const generatedAr = [];

    // 3. Generate Articles (Sequential to respect Groq limits)
    for (let i = 0; i < 5; i++) {
      if (topics[i]) {
        console.log(`Generating EN: ${topics[i].topic}`);
        const res = await generateSingleArticle('en', 'gcc', topics[i], env);
        if (res) generatedEn.push(res);
        await new Promise(r => setTimeout(r, 3000));
      }
    }

    for (let i = 5; i < 10; i++) {
      if (topics[i]) {
        console.log(`Generating AR: ${topics[i].topic}`);
        const res = await generateSingleArticle('ar', 'gcc', topics[i], env);
        if (res) generatedAr.push(res);
        await new Promise(r => setTimeout(r, 3000));
      }
    }

    // 4. Save to Upstash Redis (Decoupled Model)
    for (const lang of ['en', 'ar']) {
      const batch = lang === 'en' ? generatedEn : generatedAr;
      if (batch.length === 0) continue;

      const listKey = `insights:list:${lang}`;
      
      // Get current list
      const currentRes = await fetch(`${env.UPSTASH_REDIS_REST_URL}/get/${listKey}`, {
        headers: { Authorization: `Bearer ${env.UPSTASH_REDIS_REST_TOKEN}` }
      });
      const currentData = await currentRes.json();
      let currentList = [];
      if (currentData.result) {
        currentList = await decompress(currentData.result);
      }

      const newMetadata = [];
      for (const article of batch) {
        // Save full article content individually
        const articleKey = `insights:article:${article.slug}`;
        const compressedContent = await compress(article);
        await fetch(`${env.UPSTASH_REDIS_REST_URL}/set/${articleKey}?ex=31536000`, { // 1 year
          method: 'POST',
          headers: { Authorization: `Bearer ${env.UPSTASH_REDIS_REST_TOKEN}` },
          body: compressedContent
        });

        // Extract metadata for the list
        const { content, ...metadata } = article;
        newMetadata.push(metadata);
      }

      // Update the metadata list
      const updatedList = [...newMetadata, ...currentList].slice(0, 1000);
      const compressedList = await compress(updatedList);
      
      await fetch(`${env.UPSTASH_REDIS_REST_URL}/set/${listKey}?ex=31536000`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${env.UPSTASH_REDIS_REST_TOKEN}` },
        body: compressedList
      });
    }

    const duration = Math.floor((Date.now() - startTime) / 1000);
    return { success: true, duration: `${duration}s`, generated: { en: generatedEn.length, ar: generatedAr.length } };

  } catch (error) {
    console.error("Automation Failed:", error.message);
    return { success: false, error: error.message };
  }
}

async function generateSingleArticle(lang, type, item, env) {
  try {
    const model = "llama-3.3-70b-versatile";
    
    // Weighted Content Rotation
    const rand = Math.random();
    let specificPrompt = "";
    let contentStyle = "";
    
    if (rand < 0.15) {
      contentStyle = "strategic-analysis";
      specificPrompt = lang === 'en'
        ? "Focus on high-level strategic implications, market entry barriers, and long-term economic forecasting."
        : "ركز على الآثار الاستراتيجية رفيعة المستوى، وعوائق دخول السوق، والتوقعات الاقتصادية طويلة المدى.";
    } else {
      const styles = [
        { name: "how-to", en: "Write a practical 'How-To' guide with actionable steps for regional professionals.", ar: "اكتب دليلاً عملياً 'كيفية' يتضمن خطوات قابلة للتنفيذ للمهنيين الإقليميين." },
        { name: "why-explainer", en: "Write a deep-dive 'Why' explainer addressing the root causes and regional drivers.", ar: "اكتب مقالاً تفسيرياً 'لماذا' يتناول الأسباب الجذرية والمحركات الإقليمية." },
        { name: "expert-review", en: "Write an objective expert review with pros, cons, and a definitive verdict.", ar: "اكتب مراجعة خبير موضوعية مع الإيجابيات والسلبيات وحكم نهائي." }
      ];
      const style = styles[Math.floor(Math.random() * styles.length)];
      contentStyle = style.name;
      specificPrompt = lang === 'en' ? style.en : style.ar;
    }

    const prompt = lang === 'en' 
      ? `Write an extremely detailed, 1500-word authoritative regional analysis about ${item.country} regarding: ${item.topic}.
         STYLE: ${specificPrompt}
         The article MUST include:
         - A professional, SEO-optimized title
         - Executive Summary
         - Detailed Context & Background
         - Current Market Trends & Data
         - In-depth Impact Analysis
         - Future Outlook & Recommendations
         Format in Markdown. Start with # Title.`
      : `اكتب تحليلاً إقليمياً موثوقاً ومفصلاً للغاية (1500 كلمة) عن ${item.country} بخصوص: ${item.topic}.
         الأسلوب: ${specificPrompt}
         يجب أن يتضمن المقال:
         - عنوان مهني مُحسن لمحركات البحث
         - ملخص تنفيذي
         - السياق والخلفية التفصيلية
         - اتجاهات السوق والبيانات الحالية
         - تحليل معمق للتأثير
         - التوقعات المستقبلية والتوصيات
         تنسيق Markdown. ابدأ بـ # العنوان.`;

    const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${env.GROQ_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model,
        messages: [
          { role: "system", content: "You are a senior regional analyst for Arabia Khaleej, providing institutional-grade intelligence." },
          { role: "user", content: prompt }
        ],
        temperature: 0.7,
        max_tokens: 8192,
      }),
    });

    if (!response.ok) return null;
    const data = await response.json();
    const content = cleanAIContent(data.choices[0].message.content);
    
    if (content.length < 3000) return null;

    const firstLine = content.split('\n')[0].replace(/[#*]/g, '').trim();
    const title = firstLine.length > 10 ? firstLine : `${item.country}: ${item.topic}`;
    const slug = toSlug(item.topic);
    const imageUrl = await getRelevantImage(`${item.topic} ${item.country}`, env);

    return {
      id: `ai-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`,
      slug,
      title,
      description: extractDescription(content),
      content,
      link: `/insights/${slug}`,
      pubDate: new Date().toISOString(),
      source: "Arabia Khaleej Editorial",
      category: "gcc",
      language: lang,
      tags: [type, 'intelligence', contentStyle],
      image: imageUrl,
    };
  } catch (err) {
    return null;
  }
}

async function generateTrendingTopics(newsContext, env) {
  const prompt = `Based on these current GCC news headlines:\n${newsContext}\n\nGenerate 10 trending and authoritative article topics for the GCC region. 
  Focus on economics, tech, policy, and business. 
  Return ONLY a JSON array of objects with keys "country" and "topic".`;
  
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

function toSlug(title) {
  return title
    .toLowerCase()
    .replace(/[^\u0600-\u06FFa-z0-9\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .slice(0, 100);
}

