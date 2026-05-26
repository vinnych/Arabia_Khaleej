# 🧠 Arabia Khaleej — Development Context

## 🏗️ Architecture Overview
Next.js 15 (App Router) optimized for Cloudflare Pages + Cloudflare Workers.
- **Runtime**: Edge (`export const runtime = 'edge'`) on most API routes. **Node.js runtime** required for LangGraph workflow routes that use `@langchain/langgraph`.
- **Database**: No permanent DB. Upstash Redis (Free) used as a transient cache only.
- **AI**: Groq API using `llama-3.3-70b-versatile` (article gen) + `llama-3.1-8b-instant` (scoring/topics).

## 🛠️ Development Commands
- `npm run dev` — Dev server
- `npm run build` — Production build
- `npm run lint` — ESLint
- `npm test` — Bun tests
- `npm run worker:deploy` — Deploy Cloudflare Worker automation

## 📝 Coding Standards
- **Runtime**: Declare `export const runtime = 'edge'` on API routes. Use `export const runtime = 'nodejs'` for LangGraph workflow routes.
- **Redis**: Set TTL on every write: `{ ex: CACHE_TIMES.X }`.
- **Groq**: Never call Gro in parallel (rate limits).
- **Images**: External hostnames must be in `next.config.ts` `remotePatterns`.
- **CSP**: Defined in `lib/csp.ts`, applied in `middleware.ts`.
- **Naming**: camelCase vars/fns, PascalCase components.
- **Shared Helpers**: Use `ok()`, `fail()` from `lib/workflow/response.ts` for consistent responses.
- **Types**: Use `NextAction` type instead of `any` for nextAction parameters.

## 🤖 Agentic Editorial Workflow

LangGraph-based state machine for content generation. All routes live under `app/api/workflow/`.

**Active Route** (LangGraph):
| Route | Purpose |
|---|---|
| `POST /api/workflow/daily` | Single entry point - entire workflow runs via LangGraph state machine. Uses **Node.js runtime** because @langchain/langgraph requires Node.js APIs. |

**Legacy Routes** (deprecated - not used by LangGraph):
| Node | Route | Purpose |
|---|---|---|
| Node 1 — Trending | `GET /api/workflow/trending` | RSS + AdSense topic scoring |
| Node 2 — Generate | `GET /api/workflow/generate/0` | Groq 70B article generation |
| Node 3 — Policy | `GET /api/workflow/policy/0` | AdSense compliance audit |
| Node 4 — Score | `GET /api/workflow/score/0` | Heuristic quality scoring |
| Node 5 — Persist | `GET /api/workflow/persist/0` | Redis commit, cleanup |

- **Worker**: `worker/daily-automation.js` — cron trigger at `0 */2 * * *` (every 2 h).
- **Resume**: Workflow state saved under `wf:{id}` in Redis; next run resumes from last node.
- **Admin review**: `/admin/review` (Markdown editor; requires `?secret=ADMIN_SECRET`).

## 📁 Critical File Map
- `lib/ai.ts` — Groq integration and prompts
- `lib/workflow/types.ts` — Workflow state & node response types
- `lib/workflow/utils.ts` — Redis state load/save/delete helpers
- `lib/workflow/prompts.ts` — LLM prompts for trending/policy nodes
- `lib/workflow/response.ts` — Shared `ok`/`fail` helper functions
- `lib/constants/api.ts` — Centralized API constants (GROQ_API_URL, etc.)
- `lib/redis.ts` — Redis client + compression helpers + rate limiter
- `lib/insights.ts` — Redis read-side for listing/detail pages
- `lib/csp.ts` — CSP directives
- `lib/seo.ts` — Metadata, sitemap, structured data helpers
- `app/api/workflow/daily/route.ts` — Workflow entry point
- `app/api/workflow/trending/route.ts` — Node 1
- `app/api/workflow/generate/0/route.ts` — Node 2
- `app/api/workflow/policy/0/route.ts` — Node 3
- `app/api/workflow/score/0/route.ts` — Node 4
- `app/api/workflow/persist/0/route.ts` — Node 5
- `app/api/admin/drafts/route.ts` — Draft listing for admin panel
- `app/api/admin/drafts/[slug]/route.ts` — Permanent draft deletion
- `app/api/admin/draft-content/route.ts` — Draft body fetch for admin review
- `app/api/admin/approve/route.ts` — Publish draft to live store
- `worker/daily-automation.js` — Cloudflare Worker cron trigger
- `middleware.ts` — CSP insertion, language cookie, www→non-www redirect

## 🚫 Never Do
- No Node.js-only packages in Edge routes.
- No `redis.set()` without an `ex` TTL.
- No hardcoded CSP strings.
- No parallel Groq calls.
- Do not rename `middleware.ts`.
- No silent catch blocks — always log errors with `console.error`.
- No `any` types — use proper TypeScript types.

© 2026 Arabia Khaleej. All rights reserved.
