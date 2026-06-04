# 🧠 Arabia Khaleej — Development Context (CLAUDE.md)

> Read this file first. It defines the rules, patterns, and architecture every contributor must follow.

---

## 🏗️ Architecture Overview

Next.js 15 (App Router) fully optimized for **Cloudflare Pages + Cloudflare Workers**.

- **Runtime**: Every API route must declare `export const runtime = 'edge'`. No Node.js-only packages.
- **Database**: Cloudflare D1 (SQLite at the Edge) is the primary relational database. If the D1 binding (`process.env.DB`) is not configured, the platform automatically falls back to Upstash Redis (transient cache + draft queue + permanent articles with a 9,500 keys FIFO eviction policy).
- **AI / Article Generation**: Fully delegated to an external Python agent on Render. Triggered asynchronously using Next.js 15 `after()` background execution to prevent Cloudflare 25s execution timeouts.
- **Bilingual**: All editorial content is stored bilingually `{ en: string, ar: string }` in D1/Redis and normalized at read-time.
- **i18n Routing**: Native Next.js App Router subpath routing (e.g., `/en/insights`). All internal `<Link>` components and sitemap entries must use the locale prefix.

---

## 🛠️ Development Commands

```bash
npm run dev                         # Local dev server
npm run build                       # Production build
npm run lint                        # ESLint
npm test                            # Jest unit tests
npm run db:clean                    # Cleanup dead Redis listings/drafts
npm run automation-worker:deploy    # Deploy daily cron + keep-alive worker
npm run contact-worker:deploy       # Deploy Cloudflare contact form worker
```

> **Deployment**: Cloudflare Pages auto-deploys from GitHub on every push to `main`. Workers are NOT auto-deployed — run the commands above after any `worker/` change.

---

## 📝 Coding Standards

| Rule | Detail |
|---|---|
| **Runtime** | Always `export const runtime = 'edge'` on API routes |
| **D1 / DB Fallback** | Use `getInsightRepository()` to obtain the active repository (D1 or Redis). |
| **Redis REST POSTs** | Never pass keys in REST URL paths (e.g. `/get/key`). Always send POST requests to `/` with `["GET", key]` body arrays to prevent injection. |
| **No hardcoded secrets** | All secrets come from `process.env.*`. Never put a token/password in source code. |
| **Images** | External hostnames must be added to `next.config.ts` `remotePatterns` |
| **CSP** | Defined in `lib/csp.ts`, applied in `middleware.ts`. Never inline CSP strings. Static routes (like `/admin`) omit the nonce to prevent blocking hydration scripts. |
| **Naming** | camelCase vars/fns · PascalCase components |
| **Types** | Always use TypeScript types. Avoid `any` unless casting raw database rows. |
| **Errors** | No silent catch blocks. Always `console.error(...)` with context. |
| **Comments** | Add `// Why: ...` comments explaining non-obvious decisions. |

---

## 🧪 Testing Standards

We maintain a Jest unit test suite covering core edge engines, utilities, and read-side pipeline services.

- **Test Files Location**: Always put test files in `lib/__tests__/` with the suffix `.test.ts`.
- **Mocking External Services**: Mock `global.fetch` and D1 database objects in unit tests so that tests run instantly and offline.
- **Run Tests**: Execute `npm test` before submitting changes. All tests must pass successfully.

---

## 🤖 Article Editorial Workflow

```
[Cron: daily-automation.js every 60min]  [Admin: /admin/review manual input]
                    │                                   │
                    ▼                                   ▼
         GET /api/cron/generate              POST /api/generate
         (fetches Google News RSS,           (validates ADMIN_SECRET)
          picks random UAE headline)
                    └──────────────┬──────────────────┘
                                   ▼
                           lib/agentHelper.ts
                           • writes draft to database (status: generating)
                           • dispatches request in background using next.js 15 after()
                           • POST → Render agent /v1/generate
                                    │ (async callback)
                                    ▼
                           POST /api/webhook
                           • Validates WEBHOOK_SECRET
                           • Saves content, tags, description, status: pending_review
                                    │
                                    ▼
                       /admin/review (polls every 2m when active; manual Refresh)
                       • Review / Edit markdown
                       • Publish → translates EN→AR via resilient translateMarkdown
                                   saves live bilingual article to D1 (or Redis fallback)
                       • Delete  → cascades draft + live details + listings
```

---

## 🔑 Required Environment Variables

```env
# Upstash Redis (Fallback cache & queue)
UPSTASH_REDIS_REST_URL=        # Redis connection URL
UPSTASH_REDIS_REST_TOKEN=      # Redis auth token

# Cloudflare D1 (Primary Database)
# Configured via Pages Dashboard binding named 'DB'

# Auth
ADMIN_SECRET=                  # Admin panel + /api/article
CRON_SECRET=                   # Cloudflare Automation Worker
WEBHOOK_SECRET=                # Python agent callback (/api/webhook)

# Site
NEXT_PUBLIC_SITE_URL=          # Full site URL (e.g. https://arabiakhaleej.com)
NEXT_PUBLIC_ADSENSE_ID=        # AdSense publisher ID
NEXT_PUBLIC_SITE_VERIFICATION= # Google Search Console token
CONTACT_WORKER_URL=            # Cloudflare contact form worker URL

# RSS Proxy Configuration
RSS2JSON_API_KEY=              # API key for rss2json.com proxy
```

---

## 🚫 Never Do

- **No URL-path key injection** in REST Redis calls — always use POST request body commands.
- **No 5-second polling** — keep polling at 2 minutes, visibility-gated, with an active idle-timer and manual refresh button.
- **No Node.js-only packages** in edge routes (no `fs`, no `net`).
- **No hardcoded secrets** — all tokens/passwords must come from `process.env.*`.
- **No nonces in CSP on static pre-rendered routes** — dynamic nonces on static routes block build-time inline hydration scripts, causing blank page crashes.
- **No middleware i18n routing for static files** — always bypass static files and metadata assets.
- **No silent catch blocks** — always log with `console.error('[context] message', err)`.
- **No `any` types** — use proper TypeScript types.
- **No multiple concurrent subrequests in Cloudflare Workers** — when querying listings, always use `MGET` or bulk SQL commands.

---

© 2026 Arabia Khaleej. All rights reserved.
