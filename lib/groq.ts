import Groq from "groq-sdk";
import { redis } from "./redis";

const apiKey = process.env.GROQ_API_KEY;
const CACHE_KEY = (slug: string) => `news:summary:${slug}`;
const CACHE_TTL = 60 * 60 * 24 * 7; // 7 days

export async function summarizeArticle(
  slug: string,
  title: string,
  snippet: string | undefined,
  source: string
): Promise<string | null> {
  // 1. Check Redis cache first
  if (redis) {
    try {
      const cached = await redis.get<string>(CACHE_KEY(slug));
      if (cached) return cached;
    } catch { /* fall through */ }
  }

  // 2. No API key — skip silently
  if (!apiKey) return null;

  // 3. Require enough context
  if (!snippet || snippet.trim().length < 30) return null;

  // 4. Generate with Groq
  try {
    const groq = new Groq({ apiKey });
    const chat = await groq.chat.completions.create({
      model: "llama-3.1-8b-instant",
      messages: [
        {
          role: "system",
          content: "You are a neutral news summarizer. Write concise 2–3 sentence summaries in your own words. Never copy the original text. Be factual and objective.",
        },
        {
          role: "user",
          content: `Summarize this news article:\n\nTitle: ${title}\nSource: ${source}\nSnippet: ${snippet}`,
        },
      ],
      max_tokens: 150,
      temperature: 0.3,
    });

    const summary = chat.choices[0]?.message?.content?.trim() ?? null;
    if (!summary) return null;

    // 5. Cache in Redis
    if (redis) {
      try {
        await redis.set(CACHE_KEY(slug), summary, { ex: CACHE_TTL });
      } catch { /* ignore */ }
    }

    return summary;
  } catch (err) {
    console.error("[groq] summarize error:", err instanceof Error ? err.message : err);
    return null;
  }
}
