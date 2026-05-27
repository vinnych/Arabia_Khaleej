/**
 * Arabia Khaleej — Edge-Native Translation Utility
 * Provides 100% free, high-performance, edge-compatible translation from English to Arabic.
 * 
 * Why this particular implementation is used instead of others:
 * 1. Cloudflare Edge Compatible: Uses standard fetch APIs, running natively in Pages/Edge.
 * 2. 100% Free: Relies on Google's public translation endpoint, avoiding billing charges.
 * 3. Markdown Formatting Protection: Protects code blocks, headers, bullet symbols, and 
 *    formatting characters from being scrambled or translated, maintaining a pristine visual layout.
 * 4. Resilient Retries: Uses exponential backoff to handle temporary cloud rate-limits.
 */

/**
 * Translates a single line of text from English to Arabic with retry logic.
 */
async function translateLine(text: string, source: string = 'en', target: string = 'ar'): Promise<string> {
  const trimmed = text.trim();
  if (!trimmed || trimmed === '') return text;

  // Preserve table layout elements or horizontal rules
  if (trimmed === '---|---|---|' || trimmed === '---|---' || trimmed.startsWith('---')) {
    return text;
  }

  // Preserve markdown list bullet prefixes
  let prefix = '';
  let content = text;
  
  const headerMatch = text.match(/^(#{1,6}\s+)(.*)$/);
  const listMatch = text.match(/^(\s*[-*+]\s+)(.*)$/);
  const numListMatch = text.match(/^(\s*\d+\.\s+)(.*)$/);

  if (headerMatch) {
    prefix = headerMatch[1];
    content = headerMatch[2];
  } else if (listMatch) {
    prefix = listMatch[1];
    content = listMatch[2];
  } else if (numListMatch) {
    prefix = numListMatch[1];
    content = numListMatch[2];
  }

  const url = `https://translate.googleapis.com/translate_a/single?client=gtx&sl=${source}&tl=${target}&dt=t&q=${encodeURIComponent(content)}`;

  for (let attempt = 0; attempt < 3; attempt++) {
    try {
      const res = await fetch(url, {
        signal: AbortSignal.timeout(6000),
      });

      if (!res.ok) {
        throw new Error(`Google Translate returned HTTP status ${res.status}`);
      }

      const data = await res.json();
      if (data && data[0]) {
        // Extract translated text segments and concatenate
        const translatedContent = data[0].map((segment: any) => segment[0]).join('');
        return prefix + translatedContent;
      }
    } catch (err: any) {
      console.warn(`[translation] Attempt ${attempt + 1} failed for line: "${content.substring(0, 30)}...". Error: ${err.message}`);
      if (attempt < 2) {
        // Exponential backoff delay
        await new Promise((resolve) => setTimeout(resolve, 500 * (attempt + 1)));
      }
    }
  }

  // Fallback: If translation fails after all attempts, return original text to avoid crashes
  return text;
}

/**
 * Translates an entire Markdown article, fully preserving code blocks and syntax structures.
 */
export async function translateMarkdown(markdown: string, source: string = 'en', target: string = 'ar'): Promise<string> {
  if (!markdown) return '';

  const lines = markdown.split('\n');
  const translatedLines: string[] = [];
  let isCodeBlock = false;

  for (const line of lines) {
    const trimmed = line.trim();

    // Toggle code block state
    // Why: We must NEVER translate any code snippets, system paths, or syntax code blocks.
    if (trimmed.startsWith('```')) {
      isCodeBlock = !isCodeBlock;
      translatedLines.push(line);
      continue;
    }

    if (isCodeBlock) {
      // Return code lines verbatim
      translatedLines.push(line);
      continue;
    }

    // Handle standard translation with rate throttling
    // Why: Adding a microscopic delay ensures we stay well within Google's free-use usage limits.
    const translatedLine = await translateLine(line, source, target);
    translatedLines.push(translatedLine);
    await new Promise((resolve) => setTimeout(resolve, 30));
  }

  return translatedLines.join('\n');
}
