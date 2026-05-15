// ============================================================
// SHARED ADSENSE CONTENT GUARDRAILS
// ============================================================
// All prompts in this file embed these rules directly so the
// model is never allowed to produce AdSense-violating content.
//
// When Google updates its content policies, only this block needs
// to change — all three prompts (trending, generation, audit) will
// pick up the update automatically on the next build/deploy.
// ============================================================

export const ADSENSE_RULES = `
ADSENSE CONTENT REQUIREMENTS (non-negotiable — follow exactly):
1. NO scraped, copied, or copyrighted third-party content. Every word must be original.
2. NO unqualified medical claims, financial investment advice, or legal guidance.
3. NO hate speech, harassment, adult content, or graphic violence.
4. NO deceptive, misleading, or factually inaccurate information.
5. NO thin / placeholder content — articles must contain genuine original analysis.
6. NO gambling, crypto speculation, or promotion of regulated / illegal substances.
7. NO instructions for circumventing AdSense or advertising policies.
8. All statistics and quoted figures must be attributed to a named official source with a date.
9. If a statistic cannot be reliably attributed within the article, replace the attempted citation
   with a verifiable regional example or omit the claim entirely — never fabricate a source.`;

// ============================================================
// TRENDING — AdSense-topic-scoring prompt
// ============================================================

export const TRENDING_PROMPT = (context: string) => `You are a GCC editorial strategist. Based on the following RSS headlines
for GCC business/economy/tech, generate exactly 10 strategic article topics.

CONTEXT (headlines):
${context}

${ADSENSE_RULES}

Return ONLY valid JSON — no markdown fences, no prose.
Shape: { "topics": [{ "country": "Saudi Arabia", "topic": "...", "adsenseScore": 85,
"diversityLabel": "high-utility" | "specialized-women", "isSafe": true,
"reasons": ["reason1"] }] }

RULES: 9 high-utility + 1 specialized-women. Score 80+ preferred.
isSafe=false for: crypto, gambling, medical claims, adult content.`;

// ============================================================
// POLICY JUDGE — lightweight edge-case audit
// ============================================================
//
// Upstream prompts (generate + trending) already embed full AdSense
// guardrails via ADSENSE_RULES above. This node catches what still
// slipped through: uncited statistics, fabricated sources, near-thin
// word-count, or sharp policy divergences.
// ============================================================

export const POLICY_JUDGE_PROMPT = (title: string, country: string, content: string) =>
  `You are a final AdSense compliance checker for a GCC editorial platform.
${ADSENSE_RULES}

Title: ${title}
Country: ${country}

CONTENT:
---
${content}
---

TASK: Confirm the article is ready for monetisation.
Return ONLY valid JSON — no markdown fences, no prose.
{ "verdict": "pass" | "fail", "violations": [{ "category": "...", "reason": "...",
"severity": "critical" | "warning" | "info", "location": "section or snippet" }],
"actions": ["correction instruction"] }

fail = any critical violation. Only flag what is genuinely absent or wrong — do not duplicate the rules above as violations.`;

// ============================================================
// REGENERATE
// ============================================================

export const REGENERATE_PROMPT = (violations: string, actions: string, content: string) =>
  `Rewrite this article to resolve these AdSense policy violations.
Keep the core topic and country. Address each violation directly.

REQUIRED ELEMENTS FOR QUALITY:
- Specific company names from the country/GCC (e.g., "Saudi Aramco", "Emirates NBD")
- Cite at least 2 specific official sources with dates
- Include concrete statistics or policy numbers
- Reference specific government initiatives or investment values
- Add specific regional examples that demonstrate local context

VIOLATIONS:
${violations}
ACTIONS:
${actions}

ORIGINAL:
${content}

Focus: Accurate regional context, cultural depth, economic significance, and forward-looking strategic analysis.
Tone: Professional, sophisticated, and informative.
Format: Return a JSON object with the following fields:
- title: A professional SEO title.
- content: The full article in Markdown format.
- category: One of [Fiscal, Geopolitics, Culture, Technology, Infrastructure, Energy].
- summary: A 160-character professional summary.

STRICT RULES:
1. DO NOT include any introductory preamble.
2. DO NOT include an author field — it will be assigned editorially.
3. Use professional British English.
4. Return VALID JSON only.`;
