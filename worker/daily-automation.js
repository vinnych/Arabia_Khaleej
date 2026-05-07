/**
 * Arabia Khaleej — Daily Automation Worker (Cloudflare)
 * 
 * This worker handles the long-running AI article generation process
 * which exceeds Vercel Hobby's 10s timeout limit.
 * 
 * Features:
 * - Generates 10 high-fidelity articles (5 EN, 5 AR) sequentially.
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


async function handleAutomation(env) {
  console.log("Starting Cloudflare Automation...");
  const startTime = Date.now();
  
  try {
    // 1. Generate Topics
    const topics = await generateTrendingTopics(env);
    if (!topics || topics.length === 0) throw new Error("No topics generated");

    const generatedEn = [];
    const generatedAr = [];

    // 2. Generate 5 English Articles (Sequential)
    for (let i = 0; i < 5; i++) {
      if (topics[i]) {
        console.log(`Generating EN: ${topics[i].topic}`);
        const res = await generateSingleArticle('en', 'gcc', topics[i], env);
        if (res) generatedEn.push(res);
        // Small delay to avoid aggressive rate limits
        await new Promise(r => setTimeout(r, 2000));
      }
    }

    // 3. Generate 5 Arabic Articles (Sequential)
    for (let i = 5; i < 10; i++) {
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
      let currentArchive = [];
      if (currentData.result) {
        try {
          currentArchive = await decompress(currentData.result);
        } catch (e) {
          console.error("Decompression failed, falling back to raw parse:", e);
          currentArchive = typeof currentData.result === 'string' ? JSON.parse(currentData.result) : currentData.result;
        }
      }

      
      const existingSlugs = new Set(currentArchive.map(a => a.slug));
      const uniqueBatch = batch.filter(g => !existingSlugs.has(g.slug));

      if (uniqueBatch.length > 0) {
        const updatedArchive = [...uniqueBatch, ...currentArchive].slice(0, 1500);
        const compressedBody = await compress(updatedArchive);
        
        // Set with EX (30 days)
        await fetch(`${env.UPSTASH_REDIS_REST_URL}/set/${archiveKey}?ex=2592000`, {
          method: 'POST',
          headers: { Authorization: `Bearer ${env.UPSTASH_REDIS_REST_TOKEN}` },
          body: compressedBody
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
    
    // 90/10 Content Type Split
    const rand = Math.random();
    let contentStyle = "";
    let specificPrompt = "";
    
    if (rand < 0.1) {
      // 10% Niche Analysis: Women-centric
      contentStyle = "women-centric-analysis";
      specificPrompt = lang === 'en'
        ? `Write a professional regional analysis focused on Women's Interests, Achievements, and Perspectives in ${item.country} and the broader international context. Focus on leadership, entrepreneurship, and social impact.`
        : `اكتب تحليلاً مهنياً إقليمياً يركز على اهتمامات المرأة وإنجازاتها ومنظورها في ${item.country} والسياق الدولي الأوسع. ركز على القيادة وريادة الأعمال والتأثير الاجتماعي.`;
    } else {
      // 90% Primary Helpful Content (Rotate between How-To, Why, Review, Experience)
      const subRand = Math.random();
      if (subRand < 0.3) {
        contentStyle = "how-to";
        specificPrompt = lang === 'en'
          ? `Write a comprehensive, step-by-step How-To Guide about ${item.topic} in ${item.country}. Use "How To" in the title. Focus on practical, actionable advice for residents or visitors.`
          : `اكتب دليلاً شاملاً خطوة بخطوة (How-To) عن ${item.topic} في ${item.country}. استخدم "كيفية" في العنوان. ركز على نصائح عملية وقابلة للتنفيذ للمقيمين أو الزوار.`;
      } else if (subRand < 0.6) {
        contentStyle = "why-explainer";
        specificPrompt = lang === 'en'
          ? `Write a detailed "Why" explainer about ${item.topic} in ${item.country}. Address the underlying reasons, regional trends, and strategic decisions. Use a question-based heading.`
          : `اكتب مقالاً تفسيرياً مفصلاً (لماذا) عن ${item.topic} في ${item.country}. تناول الأسباب الكامنة والتوجهات الإقليمية والقرارات الاستراتيجية. استخدم عنواناً قائماً على سؤال.`;
      } else if (subRand < 0.8) {
        contentStyle = "expert-review";
        specificPrompt = lang === 'en'
          ? `Write an objective Expert Review of ${item.topic} in ${item.country}. Provide pros, cons, and a final verdict based on regional standards and quality expectations.`
          : `اكتب مراجعة خبير موضوعية لـ ${item.topic} في ${item.country}. قدم الإيجابيات والسلبيات وحكماً نهائياً بناءً على المعايير الإقليمية وتوقعات الجودة.`;
      } else {
        contentStyle = "experience-guide";
        specificPrompt = lang === 'en'
          ? `Write a narrative-driven Experience Guide about ${item.topic} in ${item.country}. Focus on first-hand insights, hidden gems, and expertise-based recommendations.`
          : `اكتب دليلاً قائماً على الخبرة والتجربة عن ${item.topic} في ${item.country}. ركز على الرؤى المباشرة والجواهر الخفية والتوصيات القائمة على الخبرة.`;
      }
    }

    const prompt = lang === 'en' 
      ? `Write an extremely detailed, 1500-word long-form article about ${item.country} regarding ${item.topic}.
         STYLE: ${specificPrompt}
         The article MUST include:
         - A catchy, professional title (relevant to the STYLE)
         - Detailed Executive Summary
         - Historical Context & Background
         - Key Current Developments
         - In-depth Impact Analysis
         - Strategic Future Outlook
         - Comprehensive Conclusion
         Use multiple descriptive subheadings (H2, H3). Aim for extreme depth and professional regional analysis tone. Markdown format. Start with # Title.`
      : `اكتب مقالاً طويلاً ومفصلاً للغاية (1500 كلمة) عن ${item.country} بخصوص ${item.topic}.
         الأسلوب: ${specificPrompt}
         يجب أن يتضمن المقال:
         - عنوان جذاب ومهني (مناسب للأسلوب)
         - ملخص تنفيذي مفصل
         - السياق التاريخي والخلفية
         - التطورات الحالية الرئيسية
         - تحليل معمق للتأثير
         - التوقعات المستقبلية الاستراتيجية
         - خاتمة شاملة
         استخدم عناوين فرعية وصفية متعددة. استهدف العمق الشديد وأسلوب التحليل الإقليمي المهني والتفاصيل الشاملة. تنسيق Markdown. ابدأ بـ # العنوان.`;

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
    
    if (content.length < 5000) {
      console.log(`Article too short (${content.length} chars), skipping...`);
      return null;
    }

    const firstLine = content.split('\n')[0].replace(/[#*]/g, '').trim();
    const title = firstLine.length > 10 ? firstLine : `${item.country}: ${item.topic}`;
    const slug = toSlug(item.topic);
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
      tags: [type, 'trending', 'premium', contentStyle],
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

function toSlug(title) {
  return title
    .toLowerCase()
    .replace(/[^\u0600-\u06FFa-z0-9\s-]/g, "") // Keep Arabic, alphanumeric, space, hyphen
    .trim()
    .replace(/\s+/g, "-") // Replace spaces with hyphens
    .replace(/-+/g, "-")  // Collapse multiple hyphens
    .slice(0, 100);       // Limit length
}
