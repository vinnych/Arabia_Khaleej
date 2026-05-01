/**
 * Groq AI Integration Helper
 */

export interface GroqResponse {
  choices: {
    message: {
      content: string;
    };
  }[];
}

/**
 * Generates a viral, high-fidelity insight article.
 */
export async function generateGCCInsight(
  country: string,
  topic: string,
  lang: 'en' | 'ar',
  model: "llama-3.3-70b-versatile" | "llama-3.1-8b-instant" = "llama-3.3-70b-versatile"
): Promise<string> {
  const apiKey = process.env.GROQ_API_KEY;
  if (!apiKey) {
    throw new Error("GROQ_API_KEY is not configured.");
  }

  const prompt = lang === 'en'
    ? `Write a comprehensive, well-researched article about ${country} focusing on ${topic}.
       The article should be at least 1500 words with clear sections and practical insights.
       Focus: Accurate context, cultural depth, economic relevance, and forward-looking analysis backed by facts.
       Tone: Authoritative editorial voice — informative, not sensational.
       Format: Clean Markdown with proper H2/H3 headings.

       STRICT FORMATTING RULES:
       1. START directly with the article title as an H1 heading (e.g., # Title).
       2. DO NOT include any introductory "Here is your article" or preamble text.
       3. Use professional, sophisticated British English.`
    : `اكتب مقالاً شاملاً ومعمّقاً عن ${country} مع التركيز على ${topic}.
       يجب أن لا يقل عن 1500 كلمة مع أقسام واضحة ورؤى عملية.
       التركيز: السياق الدقيق، العمق الثقافي، الأهمية الاقتصادية، والتحليل الاستشرافي المبني على الحقائق.
       الأسلوب: صوت تحريري موثوق — معلوماتي وليس إثارياً.
       التنسيق: Markdown نظيف مع عناوين H2/H3 مناسبة.

       قواعد التنسيق الصارمة:
       1. ابدأ مباشرة بعنوان المقال كعنوان H1 (مثال: # العنوان).
       2. لا تدرج أي نص تمهيدي مثل "إليك المقال".
       3. استخدم لغة عربية فصحى احترافية وراقية.`;

  try {
    const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model,
        messages: [
          {
            role: "system",
            content: "You are a knowledgeable regional analyst and editor for Arabia Khaleej. You write clear, accurate, and genuinely helpful articles about the GCC for an informed international audience."
          },
          { role: "user", content: prompt }
        ],
        temperature: 0.8,
        max_tokens: 4096,
      }),
    });

    if (!response.ok) throw new Error("Groq API Error");
    const data: GroqResponse = await response.json();
    return data.choices[0].message.content;
  } catch (error) {
    throw error;
  }
}

/**
 * Generates trending topics for both GCC and International contexts.
 */
export async function generateTrendingTopics(
  lang: 'en' | 'ar',
  type: 'gcc' | 'international' = 'gcc',
  retries = 2
): Promise<{ country: string, topic: string }[]> {
  const apiKey = process.env.GROQ_API_KEY;
  if (!apiKey) return [];

  const context = type === 'gcc'
    ? "GCC region (Saudi, UAE, Qatar, etc.) focusing on Vision 2030, NEOM, and Luxury."
    : "International tourism, Global AI trends, and western products/luxuries popular with Arabs (e.g., European watchmaking, Swiss wellness, London real estate).";

  const prompt = `Generate 10 trending article topics for ${lang === 'en' ? 'English' : 'Arabic'} readers. 
  Current Reference Time: ${new Date().toISOString()} (Use this to ensure variety from previous runs).
  Context: ${context}
  
  CRITERIA:
  1. Must be viral, visionary, or highly strategic (e.g., Vision 2030, Mega-projects, Sovereign Wealth, Luxury).
  2. Appeal to high-net-worth individuals and regional decision-makers.
  3. Ensure a mix of countries: Saudi Arabia, UAE, Qatar, Kuwait, Oman, Bahrain.

  Return ONLY a JSON array of objects with keys "country" and "topic". 
  Example: [{"country": "Saudi Arabia", "topic": "Vision 2030 Housing"}, ...]`;

  for (let i = 0; i <= retries; i++) {
    try {
      const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${apiKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: "llama-3.1-8b-instant",
          messages: [{ role: "user", content: prompt }],
          temperature: 0.7,
          response_format: { type: "json_object" }
        }),
      });

      if (!response.ok) throw new Error(`Groq API Error: ${response.status}`);
      const data = await response.json();
      const rawContent = data.choices[0].message.content;

      // Attempt to parse JSON
      const parsed = JSON.parse(rawContent);

      // Handle cases where AI wraps array in an object (e.g. { "topics": [...] })
      const topics = Array.isArray(parsed) ? parsed : (parsed.topics || Object.values(parsed).find(v => Array.isArray(v)));

      if (Array.isArray(topics) && topics.length > 0) {
        return topics.map((t: any) => ({
          country: t.country || "GCC",
          topic: t.topic || "Regional Insight"
        }));
      }

      throw new Error("Empty or invalid topics array from AI");
    } catch (error) {
      console.error(`Attempt ${i + 1} failed for trending topics:`, error);
      if (i < retries) await new Promise(r => setTimeout(r, 2000));
    }
  }

  return [];
}
