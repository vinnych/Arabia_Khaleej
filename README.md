# 🇦🇪 Arabia Khaleej (عربية خليج)
> **Premium GCC Digital Intelligence Platform**

Arabia Khaleej is a state-of-the-art digital ecosystem providing high-fidelity editorial insights, real-time prayer timings, currency dynamics, and market intelligence for the Gulf Cooperation Council region.

---

## 💎 Project Essence
- **AI Editorial Pipeline**: Expert-curated long-form regional analysis (1500+ words) powered by an external Python agent, with mandatory human review before publication.
- **Relational Database Storage**: Durable relational storage via **Cloudflare D1** (SQLite at the Edge) with automatic fallback to **Upstash Redis** if D1 is not configured.
- **Real-time Utility**: Precision prayer times via Adhan API and live GCC market indicators.
- **Bilingual**: Full English ↔ Arabic support across editorial content, UI, and metadata.
- **Glassmorphic UI**: A premium, responsive interface built with Next.js 15.

---

## 🚀 Technology Stack

| Layer | Technology |
| :--- | :--- |
| **Framework** | Next.js 15 (App Router) + TypeScript |
| **Runtime** | Cloudflare Pages (Edge Runtime — all API routes) |
| **AI Engine** | External Python agent on Render (LLM generation) |
| **Persistence** | **Cloudflare D1** (Edge SQL) with **Upstash Redis** (REST API) fallback |
| **Imagery** | Pexels API + geometric fallback |
| **Styling** | Vanilla CSS + Tailwind CSS |
| **Infrastructure** | Cloudflare Pages + Cloudflare Workers |
| **i18n** | Next.js App Router subpath routing (`/[lang]/`) + Custom `lib/i18n.tsx` |

---

## 🤖 Article Editorial Workflow

Arabia Khaleej delegates heavy article generation to an external Python agent hosted on Render. The platform itself **does not** run LLM calls — keeping edge functions lightweight and within timeout limits.

### End-to-End Flow

```
[Cloudflare Cron Worker]           [Admin Dashboard]
  every 60 min                       manual topic
       │                                  │
       ▼                                  ▼
  GET /api/cron/generate          POST /api/generate
  • Fetches GCC/UAE news RSS           • Validates secrets
  • Selects trending headline          • Triggers agent asynchronously
       │
       └──────────────┬────────────────────┘
                      ▼
             lib/agentHelper.ts
             • Writes draft to D1 (or Redis fallback)
             • Dispatches POST to agent via next.js 15 after() in background
                      │
                      ▼ (async callback)
             POST /api/webhook
             • Validates WEBHOOK_SECRET
             • Saves draft status: pending_review
                      │
                      ▼
           /admin/review  (polls every 2m when active; manual Refresh)
           • Review / Edit markdown content bilingually
           • Publish → translates EN→AR, saves live article to D1 (or Redis)
           • Delete  → cascades: deletes draft + live article + references
```

---

## 🛠️ API Architecture

| Endpoint | Method | Auth | Purpose |
| :--- | :--- | :--- | :--- |
| `/api/generate` | POST | `ADMIN_SECRET` or `CRON_SECRET` Bearer header | Manual article generation trigger (non-blocking) |
| `/api/cron/generate` | GET | `CRON_SECRET` Bearer header | Automated trending-topic generation (non-blocking) |
| `/api/webhook` | POST | `WEBHOOK_SECRET` Bearer header | Python agent callback receiver |
| `/api/article` | GET | `ADMIN_SECRET` Bearer header | List draft queue |
| `/api/article` | PUT | `ADMIN_SECRET` Bearer header | Edit or publish a draft |
| `/api/article` | DELETE | `ADMIN_SECRET` Bearer header | Cascade-delete draft + live + lists |
| `/api/admin/workflows` | GET | `ADMIN_SECRET` Bearer header | List published articles or fetch single bilingual body |
| `/api/admin/workflows` | POST | `ADMIN_SECRET` Bearer header | Approve, update live edits, or delete live articles |

---

## 🔑 Environment Configuration

All required environment variables:

```env
# Upstash Redis (Fallback cache & queue)
UPSTASH_REDIS_REST_URL=        # Redis connection URL
UPSTASH_REDIS_REST_TOKEN=      # Redis auth token

# Cloudflare D1 (Primary Database)
# Configured via Pages Dashboard binding named 'DB'

# Imagery & RSS
PEXELS_API_KEY=                # Primary image source
RSS2JSON_API_KEY=              # API key for rss2json.com proxy

# Authentication
ADMIN_SECRET=                  # Admin dashboard + API auth
CRON_SECRET=                   # Cloudflare Automation Worker auth
WEBHOOK_SECRET=                # Python agent callback auth

# Site
NEXT_PUBLIC_SITE_URL=          # e.g. https://arabiakhaleej.com
CONTACT_WORKER_URL=            # Cloudflare contact form worker URL
```

---

## ☁️ Cloudflare D1 Setup & Deployment

To enable durable relational SQL storage on your Cloudflare Pages production deployment:

### 1. Create D1 Database
Create the database via Wrangler:
```bash
npx wrangler d1 create arabiakhaleej-db
```

### 2. Configure wrangler.toml
A `wrangler.toml` at the project root maps the D1 instance to the runtime:
```toml
name = "arabiakhaleej"
pages_build_output_dir = ".vercel/output"
compatibility_date = "2025-02-04"
compatibility_flags = ["nodejs_compat"]

[[d1_databases]]
binding = "DB" # Binding name expected by code
database_name = "arabiakhaleej-db"
database_id = "<YOUR_DATABASE_ID>"
```

### 3. Initialize SQL Schemas
Run migrations locally and remotely:
```bash
# Local D1 SQLite
npx wrangler d1 execute arabiakhaleej-db --local --file=lib/schema.sql

# Production Cloudflare D1
npx wrangler d1 execute arabiakhaleej-db --remote --file=lib/schema.sql
```

*Note: In your Cloudflare Pages Dashboard under Settings → Functions, ensure you add a D1 Database Binding mapping variable name `DB` to your D1 database.*

---

## 🧪 Testing

We maintain a comprehensive, edge-native Jest test suite:
- **Run all tests**: `npm test`
- **Watch mode**: `npm run test:watch`

---

© 2026 Arabia Khaleej. All rights reserved.
