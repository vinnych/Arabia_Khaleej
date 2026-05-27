# 🧠 Arabia Khaleej — Development Context

## 🏗️ Architecture Overview
Next.js 15 (App Router) optimized for Cloudflare Pages + Cloudflare Workers.
- **Runtime**: Fully Edge-native (`export const runtime = 'edge'`) across all API routes.
- **Database**: No permanent DB. Upstash Redis (Free) used as a transient cache only.
- **AI / Article Generation**: Fully delegated to an external python generation agent, which submits completed drafts via our secure webhook callbacks.

## 🛠️ Development Commands
- `npm run dev` — Dev server
- `npm run build` — Production build
- `npm run lint` — ESLint
- `npm test` — Jest tests
- `npm run contact-worker:deploy` — Deploy Cloudflare contact form & email worker

## 📝 Coding Standards
- **Runtime**: Always declare `export const runtime = 'edge'` on Next.js API routes.
- **Redis**: Set TTL on every write: `{ ex: CACHE_TIMES.X }`.
- **Images**: External hostnames must be in `next.config.ts` `remotePatterns`.
- **CSP**: Defined in `lib/csp.ts`, applied in `middleware.ts`.
- **Naming**: camelCase vars/fns, PascalCase components.
- **Types**: Always use proper TypeScript types instead of `any`.

## 🤖 External Agent Editorial Workflow

Arabia Khaleej delegates heavy article generation to an external Python agent. Drafts are verified and approved via the human-in-the-loop admin panel.

**Active Callback & Operations Routes**:
| Route | Method | Purpose |
|---|---|---|
| `POST /api/generate` | POST | Triggers the external Python generation agent |
| `POST /api/webhook` | POST | Webhook callback to receive and store generated drafts |
| `GET /api/article` | GET/PUT/DELETE | Retrieves, edits, publishes, or deletes drafts in queue |
| `GET /api/admin/workflows` | GET/POST | Fetches or actions published and staged articles in the insights archive |
| `POST /api/admin/workflows/callback` | POST | Secure backup callback for Render agent publishing |

- **Admin review**: `/admin/review` (Markdown editor; requires `?secret=ADMIN_SECRET`).

## 📁 Critical File Map
- `lib/redis.ts` — Redis client + compression helpers + rate limiter
- `lib/draftsDb.ts` — Edge-compatible Redis draft storage manager
- `lib/insights.ts` — Redis read-side for listing/detail pages
- `lib/csp.ts` — CSP directives
- `lib/seo.ts` — Metadata, sitemap, structured data helpers
- `app/api/generate/route.ts` — Python agent dispatch endpoint
- `app/api/webhook/route.ts` — Main python agent callback receiver
- `app/api/article/route.ts` — Core draft management and publishing endpoints
- `app/api/admin/workflows/route.ts` — Advanced human verification pipeline route
- `worker/worker.js` — Cloudflare Contact Form Email Worker
- `middleware.ts` — CSP insertion, language cookie, www→non-www redirect

## 🚫 Never Do
- No Node.js-only packages in Edge routes.
- No `redis.set()` without an `ex` TTL.
- No hardcoded CSP strings.
- Do not rename `middleware.ts`.
- No silent catch blocks — always log errors with `console.error`.
- No `any` types — use proper TypeScript types.

© 2026 Arabia Khaleej. All rights reserved.

