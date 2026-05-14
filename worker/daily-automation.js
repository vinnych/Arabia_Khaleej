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
    // With 12 runs per day (every 2 hours), generating 3 articles per run for ~36 daily
    for (let i = 0; i < 2; i++) {
      if (topics[i]) {
        console.log(`Generating EN: ${topics[i].topic}`);
        const res = await generateSingleArticle(topics[i], 'en', 'gcc', 'analytical', env);
        if (res) generatedEn.push(res);
        await new Promise(r => setTimeout(r, 800));
      }
    }

    if (topics[2]) {
      console.log(`Generating AR: ${topics[2].topic}`);
      const res = await generateSingleArticle(topics[2], 'ar', 'gcc', 'analytical', env);
      if (res) generatedAr.push(res);
      await new Promise(r => setTimeout(r, 800));
    }
    
    // 4th article if available
    if (topics[3]) {
      console.log(`Generating EN: ${topics[3].topic}`);
      const res = await generateSingleArticle(topics[3], 'en', 'gcc', 'analytical', env);
      if (res) generatedEn.push(res);
      await new Promise(r => setTimeout(r, 800));
    }

    // 4. Save Drafts to Upstash Redis (No auto-publish)
    for (const lang of ['en', 'ar']) {
      const batch = lang === 'en' ? generatedEn : generatedAr;
      if (batch.length === 0) continue;

      const draftKey = `insights:drafts:${lang}`;
      
      // Get current drafts
      const currentRes = await fetch(`${env.UPSTASH_REDIS_REST_URL}/get/${draftKey}`, {
        headers: { Authorization: `Bearer ${env.UPSTASH_REDIS_REST_TOKEN}` }
      });
      const currentData = await currentRes.json();
      let currentDrafts = [];
      if (currentData.result) {
        currentDrafts = await decompress(currentData.result);
      }

      const newMetadata = [];
      for (const article of batch) {
        // Save full draft content individually
        const articleKey = `insights:draft:article:${article.slug}`;
        const compressedContent = await compress(article);
        await fetch(`${env.UPSTASH_REDIS_REST_URL}/set/${articleKey}?ex=31536000`, { // 1 year
          method: 'POST',
          headers: { Authorization: `Bearer ${env.UPSTASH_REDIS_REST_TOKEN}` },
          body: compressedContent
        });

        // Extract metadata for the draft list
        const { content, ...metadata } = article;
        newMetadata.push(metadata);
      }

      // Update the draft list
      const updatedDrafts = [...newMetadata, ...currentDrafts].slice(0, 1000);
      const compressedDrafts = await compress(updatedDrafts);
      
      await fetch(`${env.UPSTASH_REDIS_REST_URL}/set/${draftKey}?ex=31536000`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${env.UPSTASH_REDIS_REST_TOKEN}` },
        body: compressedDrafts
      });
    }

    const duration = Math.floor((Date.now() - startTime) / 1000);
    return { success: true, duration: `${duration}s`, generated: { en: generatedEn.length, ar: generatedAr.length } };

  } catch (error) {
    console.error("Automation Failed:", error.message);
    return { success: false, error: error.message };
  }
}
async function generateSingleArticle(item, lang, type, contentStyle, env) {
  try {
    const author = EDITORIAL_AUTHOR;
const prompt = lang === 'en' 
  ? `Write an extremely detailed, 1500-word authoritative regional analysis about ${item.country} regarding: ${item.topic}.
  
        EDITORIAL IDENTITY: You are a seasoned GCC journalist with 20+ years experience, providing deep insights into regional developments.
  
        REQUIRED ELEMENTS (Critical for quality):
        - Specific company names from ${item.country}/GCC (e.g., "Saudi Aramco", "Emirates NBD", "Qatar Investment Authority")
        - Cite at least 2 specific official sources with dates (e.g., "According to UAE Ministry of Economy Q1 2024 report...")
        - Include concrete statistics or policy numbers with actual figures
        - Reference specific government initiatives or investment values (e.g., "Saudi Vision 2030 allocates...")
        - Add specific regional examples that demonstrate local context
  
        STYLE & TONE:
        - CONVERSATIONAL: Write as if explaining to a colleague over coffee
        - LOCALIZED: Use regional terms and phrasing (e.g. "GCC business landscape", "Khaleeji markets")
        - VARIED: Mix short punchy sentences with longer descriptive ones
        - NO "AIISMS": Avoid "As an AI", "In conclusion", "Furthermore"
        - ENGAGING: Use rhetorical questions and occasional humor
  
        THE ARTICLE MUST INCLUDE:
        - A catchy SEO-optimized title 
        - Clear context about why this matters now
        - Specific examples from ${item.country} with named entities
        - Analysis of key players/institutions involved
        - Thoughtful prognosis of future impacts
        - Properly cited sources throughout
  
        Format in Markdown. Start with # Title.`
        : `اكتب تحليلاً إقليمياً موثوقاً ومفصلاً للغاية (1500 كلمة) عن ${item.country} بخصوص: ${item.topic}.
  
        الهوية التحريرية: أنت صحفي إقليمي مخضرم ولديه أكثر من 20 عاماً من الخبرة في التحليل الاقتصادي والسياسي.
  
        العناصر المطلوبة (حاسمة للجودة):
        - أسماء شركات محددة من ${item.country}/الخليج (مثل "شركة Saudi Aramco"، "بنك Emirates NBD")
        - اقتباس مصادر رسمية محددة بتواريخ (مثل "وفقاً لتقرير وزارة الاقتصاد الإماراتية للربع الأول 2024...")
        - إدراج إحصاءات ملموسة أو أرقام سياسية بموجبها حقيقية
        - الإشارة إلى مبادرات حكومية محددة أو قيم استثمارية (مثل "خطة رؤية 2030 السعودية تخصص...")
        - أمثلة إقليمية محددة توضح السياق المحلي
  
        الأسلوب والنبرة (نبرة خليجية مهنية):
        - اللغة: استخدم لغة عربية فصيحة ولكن بمفردات خليجية دارجة في الأوساط المهنية
        - المحادثة: اكتب كما لو كنت تشرح الموضوع لزميل في ديوانية عمل
        - المواقف: عبر عن آراء شخصية مدعومة بوقائع وأرقام
        - تجنب "العبارات الآلية": يمنع استخدام "هذا المقال المقدم من الذكاء الاصطناعي" أو "في الختام"
        - التشويق: استخدم أسئلة بلاغية وطرفة خفيفة عند الاقتضاء
  
        يجب أن يتضمن المقال:
        - عنواناً جذاباً ومحسّناً لمحركات البحث
        - سياقاً واضحاً عن أهمية الموضوع الآن
        - أمثلة محددة من ${item.country} مع كيانات مسماة
        - تحليل لأبرز المؤسسات والأطراف المعنية
        - توقعات مستقبلية مبنية على معطيات
        - مصادر مُقتبسة طوال النص
  
        تنسيق Markdown. ابدأ بـ # العنوان.`;

    const model = "llama-3.3-70b-versatile";
    const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${env.GROQ_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model,
        messages: [
          { role: "system", content: "You are a senior regional analyst for Arabia Khaleej, providing institutional-grade intelligence. You write with deep local GCC knowledge, utilizing a professional Khaleeji 'White-Collar' Arabic style, and meticulously avoid common AI linguistic patterns and direct English translations." },
          { role: "user", content: prompt }
        ],
        temperature: 0.8, // Slightly higher for more creative/human output
        max_tokens: 8192,
      }),
    });

    if (!response.ok) return null;
    const data = await response.json();
    const rawContent = data.choices[0].message.content;
    const content = rawContent;
    
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
      status: 'draft',
      author: {
        id: author.id,
        name: lang === 'en' ? author.name : author.nameAr,
        role: lang === 'en' ? author.role : author.roleAr,
      }
    };
  } catch (err) {
    return null;
  }
}

// Inline Author Data for Worker (Verified Editorial Team)
const EDITORIAL_AUTHOR = {
  id: "arabia-khaleej-editorial",
  name: "Arabia Khaleej Editorial Team",
  nameAr: "هيئة تحرير عربية خليج",
  role: "Editorial Board",
  roleAr: "هيئة التحرير",
};


async function generateTrendingTopics(newsContext, env) {
   const prompt = `Based on these current GCC news headlines:\n${newsContext}\n\nGenerate 20 trending and authoritative article topics for the GCC region. 
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

