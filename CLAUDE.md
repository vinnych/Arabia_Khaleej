# 🧠 Arabia Khaleej — Development Context

## 🏗️ Architecture Overview
Next.js 15 (App Router) project optimized for Cloudflare Pages (Edge runtime). 
- **Database**: No permanent DB. Upstash Redis (Free) is used as a transient cache.
- **AI**: Groq API using `llama-3.3-70b-versatile` for high-fidelity content.

## 🛠️ Development Commands
- `npm run dev` — Start development server
- `npm run build` — Build for production
- `npm run lint` — Run ESLint
- `npm test` — Run Bun tests

## 📝 Coding Standards
- **Runtime**: Prefer `edge` for API routes to ensure Cloudflare compatibility.
- **Redis**: **ALWAYS** set TTL on every write (`{ ex: CACHE_TIMES.X }`).
- **Groq**: Never call Groq in parallel to avoid rate limits (TPM/RPM).
- **CSP**: `middleware.ts` is the single source of truth for CSP.
- **Naming**: Use camelCase for functions/variables, PascalCase for components.

## 🤖 Automation Details
- **Worker**: `worker/daily-automation.js` (Cloudflare Worker)
- **Schedule**: Daily at 00:00 UTC (Cron Trigger).
- **Behavior**: Generates 3 English and 2 Arabic articles sequentially.
- **Storage**: Updates `insights_archive_{lang}` keys in Redis.

## 📁 Critical File Map
- `lib/ai.ts` — Groq integration and prompts.
- `lib/redis.ts` — Redis client and rate limiting logic.
- `lib/insights.ts` — Insight fetcher (merges base + dynamic).
- `app/api/daily-automation-v3-p9-kr22-auto-gen-7x/route.ts` — Core automation logic.
- `middleware.ts` — CSP nonce and i18n language sync.

## 🚫 Never Do
- Do not use Node.js-only packages in Edge runtime routes.
- Do not perform `redis.set()` without an expiry time.
- Do not add CSP headers to `next.config.ts`.
- Do not rename `middleware.ts`.
