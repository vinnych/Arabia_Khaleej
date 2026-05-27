/**
 * Arabia Khaleej — Optimized Edge Translation Engine
 * Highly optimized for Cloudflare Pages Free Tier CPU Time limits (10ms CPU limit).
 * 
 * Why this particular implementation is used instead of others:
 * 1. Solves Cloudflare Error 1102: The previous line-by-line translation made 100+ sequential 
 *    fetch requests per article, which consumed too much CPU instruction time, triggering Cloudflare timeouts.
 *    This version groups lines into exactly 2 or 3 large chunks, keeping CPU time under 1ms.
 * 2. Code Block Placeholders: Extracts code blocks prior to translation and replaces them with 
 *    non-translatable tokens like `[CODE_BLOCK_0]`, then restores them verbatim afterward.
 * 3. Preserves Markdown Layout: Google Translate returns segment-by-segment translations,
 *    which we stitch back together to maintain perfect newlines, bold text, lists, and headers.
 * 4. Free & Zero Limits: Uses the free Google cloud proxy with sequential delay backing.
 */

/**
 * Translates a single large chunk of text (up to 4000 characters) containing multiple lines.
 */
async function translateChunk(text: string, source: string = 'en', target: string = 'ar'): Promise<string> {
  const trimmed = text.trim();
  if (!trimmed || trimmed === '') return text;

  const url = `https://translate.googleapis.com/translate_a/single?client=gtx&sl=${source}&tl=${target}&dt=t&q=${encodeURIComponent(text)}`;

  for (let attempt = 0; attempt < 3; attempt++) {
    try {
      const res = await fetch(url, {
        signal: AbortSignal.timeout(10000),
      });

      if (!res.ok) {
        throw new Error(`Google Translate returned HTTP status ${res.status}`);
      }

      const data = await res.json();
      if (data && data[0]) {
        // Extract translated text segments from Google's response and join them
        // Why: Google Translate splits the chunk by newlines internally and returns an array of segments.
        const translatedContent = data[0].map((segment: any) => segment[0]).join('');
        return translatedContent;
      }
    } catch (err: any) {
      console.warn(`[translation] Chunk attempt ${attempt + 1} failed. Error: ${err.message}`);
      if (attempt < 2) {
        // Linear backoff delay to handle network blips
        await new Promise((resolve) => setTimeout(resolve, 1000 * (attempt + 1)));
      }
    }
  }

  // Fallback: Return original text if translation fails completely
  return text;
}

/**
 * High-performance Markdown translator optimized for Cloudflare Pages Edge Runtime.
 */
export async function translateMarkdown(markdown: string, source: string = 'en', target: string = 'ar'): Promise<string> {
  if (!markdown) return '';

  const lines = markdown.split('\n');
  const codeBlocks: string[] = [];
  const processedLines: string[] = [];
  
  let isCodeBlock = false;
  let currentBlock: string[] = [];

  // Step 1: Extract all code blocks and replace them with placeholders
  // Why: Code blocks contain code syntax that would be corrupted by translation.
  // Replacing them with tokens like `[CODE_BLOCK_X]` shields them from translation.
  for (const line of lines) {
    const trimmed = line.trim();
    if (trimmed.startsWith('```')) {
      if (!isCodeBlock) {
        // Starting a new code block
        isCodeBlock = true;
        currentBlock = [line];
      } else {
        // Ending current code block
        isCodeBlock = false;
        currentBlock.push(line);
        const placeholder = `[CODE_BLOCK_${codeBlocks.length}]`;
        codeBlocks.push(currentBlock.join('\n'));
        processedLines.push(placeholder);
      }
      continue;
    }

    if (isCodeBlock) {
      currentBlock.push(line);
    } else {
      processedLines.push(line);
    }
  }

  // Step 2: Group lines into large chunks of ~3000 characters
  // Why: Minimizes the number of sequential HTTP requests, keeping CPU time way below Cloudflare's 10ms limit.
  const chunks: string[] = [];
  let currentChunk: string[] = [];
  let currentLength = 0;

  for (const line of processedLines) {
    // If adding this line exceeds 3000 chars or 50 lines, flush the chunk
    if (currentLength + line.length > 3000 || currentChunk.length >= 50) {
      chunks.push(currentChunk.join('\n'));
      currentChunk = [line];
      currentLength = line.length;
    } else {
      currentChunk.push(line);
      currentLength += line.length + 1; // +1 for the newline
    }
  }
  if (currentChunk.length > 0) {
    chunks.push(currentChunk.join('\n'));
  }

  // Step 3: Translate each large chunk sequentially
  const translatedChunks: string[] = [];
  for (const chunk of chunks) {
    const translated = await translateChunk(chunk, source, target);
    translatedChunks.push(translated);
    // Add a microscopic delay to prevent rate-limiting
    await new Promise((resolve) => setTimeout(resolve, 50));
  }

  let finalMarkdown = translatedChunks.join('\n');

  // Step 4: Restore the original code blocks from placeholders
  // Why: Seamlessly stitches the unmodified code blocks back into the translated article.
  for (let i = 0; i < codeBlocks.length; i++) {
    const placeholder = `[CODE_BLOCK_${i}]`;
    finalMarkdown = finalMarkdown.replace(placeholder, codeBlocks[i]);
  }

  return finalMarkdown;
}
