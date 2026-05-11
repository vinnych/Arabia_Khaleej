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
- **Caching**: **ALWAYS** use `revalidate` on API routes (default 300s) to enable edge caching.
- **Images**: Ensure all external hostnames are added to `next.config.ts` remotePatterns to allow optimization.
- **CSP**: `lib/csp.ts` defines the directives, used in `middleware.ts`.
- **Naming**: Use camelCase for functions/variables, PascalCase for components.

## 🤖 Automation Details
- **Worker**: `worker/daily-automation.js` (Cloudflare Worker)
- **Schedule**: Every 12 hours (00:00 and 12:00 UTC).
- **Behavior**: Generates articles with a mix of Helpful Content and Analysis.
- **API Backup**: `/api/automation/daily` (Edge-optimized version).

## 📁 Critical File Map
- `lib/ai.ts` — Groq integration and prompts.
- `lib/finance-service.ts` — Central source for market data.
- `lib/csp.ts` — CSP configuration and directives.
- `app/api/automation/daily/route.ts` — Daily article generation logic.
- `middleware.ts` — Nonce generation and language sync.

## 🚫 Never Do
- Do not use Node.js-only packages in Edge runtime routes.
- Do not perform `redis.set()` without an expiry time.
- Do not hardcode CSP strings in middleware (use `lib/csp.ts`).
- Do not rename `middleware.ts`.

© 2026 Arabia Khaleej. All rights reserved.
