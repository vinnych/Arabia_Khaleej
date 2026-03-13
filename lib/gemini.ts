import { GoogleGenerativeAI, GoogleGenerativeAIError } from "@google/generative-ai";
import { redis } from "./redis";

const apiKey = process.env.GEMINI_API_KEY;
const CACHE_KEY = (slug: string) => `news:summary:${slug}`;
const CACHE_TTL = 60 * 60 * 24 * 7; // 7 days
const TIMEOUT_MS = 8000;

function withTimeout<T>(promise: Promise<T>, ms: number): Promise<T> {
  return Promise.race([
    promise,
    new Promise<T>((_, reject) =>
      setTimeout(() => reject(new Error("Gemini request timed out")), ms)
    ),
  ]);
}

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
    } catch (err) {
      console.warn("[gemini] Redis read failed:", err instanceof Error ? err.message : err);
    }
  }

  // 2. No API key — skip silently
  if (!apiKey) return null;

  // 3. Require enough context to produce a meaningful summary
  if (!snippet || snippet.trim().length < 30) return null;

  // 4. Generate with Gemini
  try {
    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    const prompt = `You are a neutral news summarizer. Write a concise 2–3 sentence summary of the following news article in your own words. Do not copy the original text. Be factual and objective.

Title: ${title}
Source: ${source}
Snippet: ${snippet}

Summary:`;

    const result = await withTimeout(model.generateContent(prompt), TIMEOUT_MS);
    const summary = result.response.text().trim();
    if (!summary) return null;

    // 5. Cache result in Redis
    if (redis) {
      try {
        await redis.set(CACHE_KEY(slug), summary, { ex: CACHE_TTL });
      } catch (err) {
        console.warn("[gemini] Redis write failed:", err instanceof Error ? err.message : err);
      }
    }

    return summary;
  } catch (err) {
    if (err instanceof GoogleGenerativeAIError) {
      console.error("[gemini] API error:", err.message);
    } else {
      console.error("[gemini] Error:", err instanceof Error ? err.message : err);
    }
    return null;
  }
}
