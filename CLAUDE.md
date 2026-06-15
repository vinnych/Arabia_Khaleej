# 🧠 Arabia Khaleej — Development Context (CLAUDE.md)

> Read this file first. It defines the rules, patterns, and architecture every contributor must follow.

---

## 🏗️ Architecture Overview

Next.js 15 (App Router) fully optimized for **Cloudflare Workers (nodejs_compat)** via OpenNext.

- **Runtime**: Runs natively on the Node.js-compatible Workers runtime (`nodejs_compat`). No need for `export const runtime = 'edge'`.
- **Database**: Cloudflare D1 (SQLite at the Edge) is the primary database. The database bindings (`DB`) are resolved dynamically at runtime from the `@opennextjs/cloudflare` context (e.g., in `D1InsightRepository` and `draftDb`). Upstash Redis is retained purely as a caching and rate-limiting layer.
- **AI / Article Generation**: Fully delegated to an external Python agent on Render. Triggered asynchronously using Next.js 15 `after()` background execution to prevent Cloudflare 25s execution timeouts.
- **Bilingual**: All editorial content is stored bilingually `{ en: string, ar: string }` in D1 and normalized at read-time.
- **i18n Routing**: Native Next.js App Router subpath routing (e.g., `/en/insights`). All internal `<Link>` components and sitemap entries must use the locale prefix.

---

## 🛠️ Development Commands

```bash
npm run dev                         # Local dev server
npm run cf:build                    # Compile Next.js app via OpenNext for Cloudflare
npm run cf:deploy                   # Build Next.js app and deploy to Cloudflare Workers
npm run lint                        # ESLint
npm test                            # Jest unit tests
npm run db:clean                    # Cleanup dead Redis listings/drafts
npm run db:wipe                     # Completely reset local/remote D1 tables and Redis keys
npm run automation-worker:deploy    # Deploy daily cron + keep-alive worker
npm run contact-worker:deploy       # Deploy Cloudflare contact form worker
```

> **Deployment**: Main Next.js application is deployed to Cloudflare Workers and Assets using `npm run cf:deploy`. Background cron and contact workers must be deployed separately using their respective commands.

---

## 📝 Coding Standards

| Rule | Detail |
|---|---|
| **Runtime Compatibility** | Code must support V8 Edge environment. No unsupported native Node.js binaries. |
| **D1 / DB Access** | Access D1 bindings asynchronously from the Cloudflare runtime context using `getCloudflareContext()` (since Wrangler bindings do not live on `process.env` in production Workers). |
| **Redis REST POSTs** | Never pass keys in REST URL paths (e.g. `/get/key`). Always send POST requests to `/` with `["GET", key]` body arrays to prevent injection. |
| **Secrets & Variables** | Put public configuration in `wrangler.toml` `[vars]`. Keep private credentials in `.dev.vars` (local) and push to Cloudflare via `npx wrangler secret put KEY` (production). |
| **Images** | External hostnames must be added to `next.config.ts` `remotePatterns` |
| **CSP** | Defined in `lib/seo/csp.ts`, applied in `middleware.ts`. Never inline CSP strings. Static routes (like `/admin`) omit the nonce to prevent blocking hydration scripts. |
| **Naming** | camelCase vars/fns · PascalCase components |
| **Types** | Always use TypeScript types. Avoid `any` unless casting raw database rows. |
| **Errors** | No silent catch blocks. Always `console.error(...)` with context. |
| **Comments** | Add `// Why: ...` comments explaining non-obvious decisions. |

---

## 🧪 Testing Standards

We maintain a Jest unit test suite covering core edge engines, utilities, and read-side pipeline services.

- **Test Files Location**: Colocate test files within their module folders under `lib/<domain>/__tests__/` with the suffix `.test.ts`.
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
                           lib/services/agentHelper.ts
                           • writes draft to D1 (status: generating)
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
                                   saves live bilingual article to D1
                       • Delete  → cascades draft + live details + listings
```

---

## 🔑 Required Environment Variables & Secrets

### 🔒 Private Secrets (Configure via `npx wrangler secret put KEY`)
* `UPSTASH_REDIS_REST_URL` - Connection URL for Redis caching/rate-limiting.
* `UPSTASH_REDIS_REST_TOKEN` - Auth token for Redis.
* `PEXELS_API_KEY` - Image sourcing API.
* `ADMIN_SECRET` - Admin dashboard validation.
* `CRON_SECRET` - Auth token for automation worker triggers.
* `WEBHOOK_SECRET` - Callback verification token.
* `RSS2JSON_API_KEY` - API key for RSS proxy service.

### 🌐 Public Variables (Configure in `wrangler.toml` `[vars]`)
* `CONTACT_WORKER_URL` - Target url for email submissions.
* `NEXT_PUBLIC_SITE_URL` - Root site URL.
* `NEXT_PUBLIC_ADSENSE_ID` - Google Adsense Publisher ID.
* `NEXT_PUBLIC_SITE_VERIFICATION` - Google Search Console verification token.

---

## 🚫 Never Do

- **No URL-path key injection** in REST Redis calls — always use POST request body commands.
- **No 5-second polling** — keep polling at 2 minutes, visibility-gated, with an active idle-timer and manual refresh button.
- **No Node.js-only packages** in edge routes (no `fs`, no `net`).
- **No hardcoded secrets** — all tokens/passwords must come from `process.env.*` (secrets/vars bindings).
- **No nonces in CSP on static pre-rendered routes** — dynamic nonces on static routes block build-time inline hydration scripts, causing blank page crashes.
- **No middleware i18n routing for static files** — always bypass static files and metadata assets.
- **No silent catch blocks** — always log with `console.error('[context] message', err)`.
- **No `any` types** — use proper TypeScript types.
- **No multiple concurrent subrequests in Cloudflare Workers** — when querying listings, always use `MGET` or bulk SQL commands.

---

© 2026 Arabia Khaleej. All rights reserved.
