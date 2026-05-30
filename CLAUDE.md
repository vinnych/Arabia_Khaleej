# 🧠 Arabia Khaleej — Development Context (CLAUDE.md)

> Read this file first. It defines the rules, patterns, and architecture every contributor must follow.

---

## 🏗️ Architecture Overview

Next.js 15 (App Router) fully optimized for **Cloudflare Pages + Cloudflare Workers**.

- **Runtime**: Every API route must declare `export const runtime = 'edge'`. No Node.js-only packages.
- **Database**: No permanent DB. Upstash Redis (Free) via REST API is the only persistence layer (transient cache + draft queue).
- **AI / Article Generation**: Fully delegated to an external Python agent on Render. The Next.js app never calls LLMs directly.
- **Bilingual**: All editorial content is stored bilingually `{ en: string, ar: string }` in Redis and normalized at read-time.
- **i18n Routing**: Native Next.js App Router subpath routing (e.g., `/en/insights`). All internal `<Link>` components and sitemap entries must use the locale prefix.

---

## 🛠️ Development Commands

```bash
npm run dev                         # Local dev server
npm run build                       # Production build
npm run lint                        # ESLint
npm test                            # Jest unit tests
npm run automation-worker:deploy    # Deploy daily cron + keep-alive worker (manual — NOT via GitHub)
npm run contact-worker:deploy       # Deploy Cloudflare contact form worker (manual — NOT via GitHub)
```

> **Deployment**: Cloudflare Pages auto-deploys from GitHub on every push to `main`. Workers are NOT auto-deployed — run the commands above after any `worker/` change.
>
> **After every `automation-worker:deploy`** you must re-set the Worker secret or the cron returns 401:
> ```bash
> npx wrangler secret put CRON_SECRET --config worker/wrangler-automation.toml
> ```

---

## 📝 Coding Standards

| Rule | Detail |
|---|---|
| **Runtime** | Always `export const runtime = 'edge'` on API routes |
| **Redis TTL** | Every `redis.set()` / `setWithCompression()` call must include `{ ex: N }`. Draft keys use `setDraft(..., { ttlSeconds: N })`. |
| **No hardcoded secrets** | All secrets come from `process.env.*`. Never put a token/password in source code. |
| **Images** | External hostnames must be added to `next.config.ts` `remotePatterns` |
| **CSP** | Defined in `lib/csp.ts`, applied in `middleware.ts`. Never inline CSP strings. |
| **Naming** | camelCase vars/fns · PascalCase components |
| **Types** | Always use TypeScript types. Avoid `any`. |
| **Errors** | No silent catch blocks. Always `console.error(...)` with context. |
| **Comments** | Add `// Why: ...` comments explaining non-obvious decisions. |
---

## 🧪 Testing Standards

We maintain a Jest unit test suite covering core edge engines, utilities, and read-side pipeline services.

- **Test Files Location**: Always put test files in `lib/__tests__/` with the suffix `.test.ts`.
- **Mocking External Services**: Never make real network requests in unit tests. Mock `global.fetch` and any cache services (like `lib/redis.ts` and `getWithCompression`) so that tests run instantly and offline.
- **Run Tests**: Execute `npm test` before submitting changes. All tests must pass successfully.

---

## 🤖 Article Editorial Workflow

Arabia Khaleej delegates heavy article generation to an external Python agent. Drafts go through a mandatory human-in-the-loop review before publication.

### Trigger → Publish Pipeline

```
[Cron: daily-automation.js every 30min]  [Admin: /admin/review manual input]
                    │                                   │
                    ▼                                   ▼
         GET /api/cron/generate              POST /api/generate
         (fetches Google News RSS,           (validates ADMIN_SECRET)
          picks random UAE headline)
                    └──────────────┬──────────────────┘
                                   ▼
                          lib/agentHelper.ts
                          • article:{topic} → status: generating  TTL: 7d
                          • buildCallbackUrl() from WEBHOOK_SECRET env var
                          • POST → Render agent /v1/generate
                                   │ (async callback)
                                   ▼
                          POST /api/webhook
                          • Validates WEBHOOK_SECRET
                          • Saves content, tags, image_url
                          • article:{topic} → status: pending_review  (no TTL)
                                   │
                                   ▼
                      /admin/review (polls every 5s)
                      • Review / Edit markdown
                      • Publish → translateMarkdown EN→AR
                                  setWithCompression insights:article:{slug}  TTL: 30d
                                  prepend to insights:list:en + insights:list:ar  TTL: 30d
                      • Delete  → cascades draft + live + both list caches
```

### Article Status State Machine

| Status | TTL | Set By |
|---|---|---|
| `generating` | 7 days | `agentHelper.ts` on dispatch |
| `error` | 2 days | `agentHelper.ts` on agent HTTP failure |
| `pending_review` | None | `webhook/route.ts` on agent callback |
| `published` | N/A | `article/route.ts` PUT action |

### Active API Routes

| Route | Method | Auth | Purpose |
|---|---|---|---|
| `POST /api/generate` | POST | `ADMIN_SECRET` / `CRON_SECRET` Bearer | Manual generation trigger |
| `GET /api/cron/generate` | GET | `CRON_SECRET` Bearer or query param | Automated trending-topic generation |
| `POST /api/webhook` | POST | `WEBHOOK_SECRET` query param | Agent callback receiver |
| `/api/article` | GET/PUT/DELETE | `ADMIN_SECRET` query param | Draft CRUD |
| `/api/admin/workflows` | GET/POST | `ADMIN_SECRET` query param | Published articles management |

---

## 📁 Critical File Map

```
lib/
  agentHelper.ts      — Shared generation trigger: writes draft, calls Render agent
  draftsDb.ts         — Edge-compatible Upstash REST draft storage (with TTL support)
  redis.ts            — Redis client + compression helpers (setWithCompression / getWithCompression)
  insights.ts         — SOLID read-side: Repository → Validator → Processor pipeline
  translate.ts        — Google Translate wrapper for EN→AR content translation
  csp.ts              — CSP directive builder
  seo.ts              — Metadata, sitemap, structured data helpers
  i18n.tsx            — Bilingual context + hooks

app/api/
  generate/route.ts         — Manual admin generation endpoint
  cron/generate/route.ts    — Automated cron generation (RSS → topic → agent)
  webhook/route.ts          — Agent callback receiver
  article/route.ts          — Core draft management + publish logic
  admin/workflows/route.ts  — Published article management

worker/
  daily-automation.js       — Cloudflare Worker: 14min keep-alive ping + 30min generation cron
  worker.js                 — Cloudflare Worker: Contact form email handler

app/admin/review/page.tsx   — Admin dashboard (polls every 5s; drafts + published tabs)
middleware.ts               — CSP insertion, i18n locale subpath routing, www→non-www redirect
```

---

## 🔑 Required Environment Variables

```env
# Upstash Redis
UPSTASH_REDIS_REST_URL=        # Redis connection URL
UPSTASH_REDIS_REST_TOKEN=      # Redis auth token

# Auth
ADMIN_SECRET=                  # Admin panel + /api/article
CRON_SECRET=                   # Cloudflare Automation Worker
WEBHOOK_SECRET=                # Python agent callback (/api/webhook) — can equal ADMIN_SECRET

# Site
NEXT_PUBLIC_SITE_URL=          # Full site URL (e.g. https://arabiakhaleej.com)
                               # REQUIRED — used by agentHelper.ts to build callback URL
NEXT_PUBLIC_ADSENSE_ID=        # AdSense publisher ID
NEXT_PUBLIC_SITE_VERIFICATION= # Google Search Console token
CONTACT_WORKER_URL=            # Cloudflare contact form worker URL

# Imagery
PEXELS_API_KEY=                # Primary image source

# Optional overrides
AGENT_URL=                     # Python agent base URL (default: Render)
DASHBOARD_CALLBACK_URL=        # Full override for agent callback URL
```

---

## 🔑 Redis Key Schema

| Key | TTL | Content |
|---|---|---|
| `article:{topic}` | Varies (see status table) | Draft queue entry |
| `insights:article:{slug}` | 30 days | Full bilingual article |
| `insights:list:en` | 30 days | EN article listing (max 1000) |
| `insights:list:ar` | 30 days | AR article listing (max 1000) |

---

## 🚫 Never Do

- **No Node.js-only packages** in edge routes (no `fs`, no `net`, no TCP Redis clients).
- **No `redis.set()` without TTL** — use `{ ex: N }` or `{ ttlSeconds: N }` on `setDraft`.
- **No hardcoded secrets** — all tokens/passwords must come from `process.env.*`.
- **No hardcoded CSP strings** — always use `lib/csp.ts`.
- **No silent catch blocks** — always log with `console.error('[context] message', err)`.
- **No `any` types** — use proper TypeScript types.
- **Do not rename `middleware.ts`** — Cloudflare/Next.js resolves it by exact filename.
- **No auto-publish** — all AI articles must go through human review in `/admin/review`.
- **Do not forget `wrangler secret put CRON_SECRET`** after every automation worker deploy — without it every cron call returns 401 and generation silently stops.

---

© 2026 Arabia Khaleej. All rights reserved.
