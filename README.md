# 🇦🇪 Arabia Khaleej (عربية خليج)
> **Premium GCC Digital Intelligence Platform**

Arabia Khaleej is a state-of-the-art digital ecosystem providing high-fidelity editorial insights, real-time prayer timings, currency dynamics, and market intelligence for the Gulf Cooperation Council region.

---

## 💎 Project Essence
- **AI Editorial Pipeline**: Expert-curated long-form regional analysis (1500+ words) powered by an external Python agent, with mandatory human review before publication.
- **Real-time Utility**: Precision prayer times via Adhan API and live GCC market indicators.
- **Bilingual**: Full English ↔ Arabic support across editorial content, UI, and metadata.
- **Glassmorphic UI**: A premium, responsive interface built with Next.js 15 and Tailwind CSS.
- **Privacy First**: No permanent database; transient caching via Upstash Redis with TTLs on every key.

---

## 🚀 Technology Stack

| Layer | Technology |
| :--- | :--- |
| **Framework** | Next.js 15 (App Router) + TypeScript |
| **Runtime** | Cloudflare Pages (Edge Runtime — all API routes) |
| **AI Engine** | External Python agent on Render (LLM generation) |
| **Persistence** | Upstash Redis (REST API, transient cache) |
| **Imagery** | Pexels API + geometric fallback |
| **Styling** | Tailwind CSS + custom CSS |
| **Infrastructure** | Cloudflare Pages + Cloudflare Workers |
| **i18n** | Next.js App Router subpath routing (`/[lang]/`) + Custom `lib/i18n.tsx` — EN / AR |

---

## 🤖 Article Editorial Workflow

Arabia Khaleej delegates heavy article generation to an external Python agent hosted on Render. The platform itself **does not** run LLM calls — keeping edge functions lightweight and within timeout limits.

### End-to-End Flow

```
[Cloudflare Cron Worker]           [Admin Dashboard]
  every 30 min                       manual topic
       │                                  │
       ▼                                  ▼
  GET /api/cron/generate          POST /api/generate
  • Fetches GCC/UAE Google News        • Validates ADMIN_SECRET
    RSS via rss2json.com proxy         • Calls triggerAgentGeneration()
  • Picks random headline
       │
       └──────────────┬────────────────────┘
                      ▼
             lib/agentHelper.ts
             • Writes article:{topic} → status: generating  (TTL: 7 days)
             • POST → Python agent on Render /v1/generate
             • Passes callback_url built from WEBHOOK_SECRET env var
                      │
                      ▼ (async callback)
             POST /api/webhook
             • Validates WEBHOOK_SECRET
             • Saves content, tags, image_url
             • article:{topic} → status: pending_review  (no TTL — persists for admin)
                      │
                      ▼
          /admin/review  (polls every 5s)
          • Review / Edit markdown content
          • Publish → translates EN→AR, writes to insights:article:{slug}
                       prepends to insights:list:en + insights:list:ar
          • Delete  → cascades: draft + live + both list caches
                      │
                      ▼
          Public Pages: /[lang]/insights  /[lang]/insights/[slug]
          Served by lib/insights.ts SOLID service pipeline
```

### Article Status States

| Status | TTL | Meaning |
|---|---|---|
| `generating` | 7 days | Agent dispatched, awaiting callback |
| `error` | 2 days | Agent rejected immediately; auto-cleans |
| `pending_review` | None | Ready for admin action — persists until published/deleted |
| `published` | None (Indefinite) | Live on public feed |

---

## 🛠️ API Architecture

| Endpoint | Method | Auth | Purpose |
| :--- | :--- | :--- | :--- |
| `/api/generate` | POST | `ADMIN_SECRET` or `CRON_SECRET` Bearer header | Manual article generation trigger |
| `/api/cron/generate` | GET | `CRON_SECRET` Bearer header | Automated trending-topic generation |
| `/api/webhook` | POST | `WEBHOOK_SECRET` Bearer header | Python agent callback receiver |
| `/api/article` | GET | `ADMIN_SECRET` Bearer header | List draft queue |
| `/api/article` | PUT | `ADMIN_SECRET` Bearer header | Edit or publish a draft |
| `/api/article` | DELETE | `ADMIN_SECRET` Bearer header | Cascade-delete draft + live + lists |
| `/api/admin/workflows` | GET | `ADMIN_SECRET` Bearer header | List published insights-store articles |
| `/api/admin/workflows` | POST | `ADMIN_SECRET` Bearer header | Delete a live published article |
| `/api/insights` | GET | Public | Article listing & slug delivery |
| `/api/prayer-times` | GET | Public | Location-based prayer timings |
| `/api/exchange-rates` | GET | Public | Real-time GCC currency dynamics |
| `/api/market-data` | GET | Public | GCC stock and commodity indices |

---

## 🔑 Environment Configuration

All required environment variables for production:

```env
# Upstash Redis (transient cache + draft queue)
UPSTASH_REDIS_REST_URL=        # Redis connection URL
UPSTASH_REDIS_REST_TOKEN=      # Redis auth token

# Imagery
PEXELS_API_KEY=                # Primary image source

# RSS Proxy Configuration
RSS2JSON_API_KEY=              # API key for rss2json.com (prevents "429 Too Many Requests" on shared IP ranges)

# Authentication
ADMIN_SECRET=                  # Admin dashboard + /api/article access
CRON_SECRET=                   # Cloudflare Automation Worker auth
WEBHOOK_SECRET=                # Python agent callback auth (/api/webhook)
                               # (can be same value as ADMIN_SECRET)

# Site
NEXT_PUBLIC_SITE_URL=          # e.g. https://arabiakhaleej.com
                               # Used to build agent callback URLs dynamically
NEXT_PUBLIC_ADSENSE_ID=        # AdSense publisher ID
NEXT_PUBLIC_SITE_VERIFICATION= # Google Search Console verification token
CONTACT_WORKER_URL=            # Cloudflare contact form worker URL

# Optional overrides
AGENT_URL=                     # Override Python agent base URL (default: Render)
DASHBOARD_CALLBACK_URL=        # Full override for agent callback URL
```

> **Important**: `WEBHOOK_SECRET` and `NEXT_PUBLIC_SITE_URL` are required — without them `lib/agentHelper.ts` will throw a configuration error and block all generation. Add them in your Cloudflare Pages dashboard under **Settings → Environment Variables**.

---

## ☁️ Cloudflare Deployment

### 1. Frontend — Cloudflare Pages (GitHub Integration)

Cloudflare Pages is connected to the GitHub repository and deploys automatically on every `git push` to `main`.

1. Go to **Cloudflare Pages → your project → Settings → Builds & Deployments**
2. Build command: `npx @cloudflare/next-on-pages`
3. Output directory: `.vercel/output/static`
4. Framework preset: **Next.js (Edge)**

**Required Pages environment variables** (Settings → Environment Variables → Add):

| Variable | Required | Notes |
|---|---|---|
| `UPSTASH_REDIS_REST_URL` | ✅ | Redis REST endpoint |
| `UPSTASH_REDIS_REST_TOKEN` | ✅ | Redis auth token |
| `PEXELS_API_KEY` | ✅ | Image API |
| `ADMIN_SECRET` | ✅ | Admin dashboard access |
| `CRON_SECRET` | ✅ | Cron worker auth |
| `WEBHOOK_SECRET` | ✅ | Python agent callback auth |
| `NEXT_PUBLIC_SITE_URL` | ✅ | e.g. `https://arabiakhaleej.com` |
| `NEXT_PUBLIC_ADSENSE_ID` | ✅ | AdSense publisher ID |
| `NEXT_PUBLIC_SITE_VERIFICATION` | ✅ | Google Search Console |
| `CONTACT_WORKER_URL` | ✅ | Contact form worker URL |
| `RSS2JSON_API_KEY` | ✅ | rss2json.com proxy API key |

> **Note**: `.env.local` and `.env*` files are gitignored — they never reach Cloudflare. All secrets must be set via the dashboard.

---

### 2. Automation & Contact Workers (Manual Deploy)

Workers are **not** auto-deployed from GitHub. You must deploy them manually after any change:

```bash
# From the project root:
npm run automation-worker:deploy
npm run contact-worker:deploy
```

> ⚠️ **IMPORTANT — After every automation worker deploy**, you must re-set the `CRON_SECRET` worker secret or the cron will return 401 and silently skip generation:
>
> ```bash
> npx wrangler secret put CRON_SECRET --config worker/wrangler-automation.toml
> ```
> When prompted, enter the same value as your `CRON_SECRET` environment variable.

**Worker secrets also needed** (set once, persisted by Cloudflare):
- `CRON_SECRET` — must match the Pages env var

### 3. Python Agent (Render)

The external article agent runs at `https://article-agent-zk00.onrender.com`. The Cloudflare Automation Worker pings it every 14 minutes to prevent cold starts.

---

## 🔑 Redis Key Schema

| Key Pattern | TTL | Content |
|---|---|---|
| `article:{topic}` | Varies by status (see above) | Draft queue entry |
| `insights:article:{slug}` | None (Indefinite) | Full bilingual article document |
| `insights:list:en` | None (Indefinite) | Normalized EN article listing (max 3000) |
| `insights:list:ar` | None (Indefinite) | Normalized AR article listing (max 3000) |

### 🧹 Free-Tier Cache Eviction Policy
To optimize storage on your Upstash Redis Free Tier (10,000 keys limit), Arabia Khaleej implements an application-level FIFO (First-In, First-Out) cache eviction policy during article publication:
- **Feed Listing Cap:** Feeds are limited to a generous maximum of `3,000` articles to prevent high Edge CPU/payload latencies on Cloudflare.
- **Dynamic DB-Size Safety Threshold:** The system queries `redis.dbsize()` in real-time. If the total number of keys in Redis meets or exceeds `9,500` keys:
  1. The system slices off the oldest 10 articles from the lists.
  2. Runs `redis.del` on their full bilingual details (`insights:article:{slug}`) to erase them from Redis.
  3. Evicts oldest content first to keep the database running smoothly without ever breaching Upstash Free Tier quotas.

---

## 🧪 Testing

We maintain a comprehensive, edge-native Jest test suite to ensure the stability of all translation, data access, and routing systems:
- **Run all tests**: `npm test`
- **Watch mode**: `npm run test:watch`
- **Coverage report**: `npm test -- --coverage`

The test suite covers:
- **Edge Translation Engine** (`lib/__tests__/translate.test.ts`): Verification of HTML/markdown translation, code block placeholder shielding, sequential chunk parsing, and self-healing HTTP linear backoff retries.
- **SOLID Insights Pipeline** (`lib/__tests__/insights.test.ts`): Verification of data repositories, standard SSR-safe validators, deduplication, date sorting, category filters, and fuzzy slug variant routing.
- **Common Utilities** (`lib/__tests__/utils.test.ts`): Verification of slugification, URL safety, date parsing, and SSRF prevention.

---

## 🛡️ Security & Performance
- **Edge-native**: All API routes use `export const runtime = 'edge'` for Cloudflare Pages compatibility.
- **Fail-closed Auth**: Every sensitive endpoint validates secrets via environment variables. Missing secrets throw immediately.
- **No Hardcoded Secrets**: Webhook and agent callback URLs are built dynamically from env vars. Nothing sensitive is in source code.
- **Draft TTLs**: Generating (7 days) and error (2 days) draft keys auto-expire; `pending_review` drafts persist until admin action.
- **Edge Caching**: ISR/SWR (5-minute revalidation) for near-instant loading on public pages.
- **CSP**: Strict Content Security Policy managed via `middleware.ts` + `lib/csp.ts`.
- **Free-Tier Optimized**: Architected for Cloudflare Free + Upstash Redis Free limits.
- **Human Editorial Gate**: All AI-generated articles require admin approval before going live. No auto-publish.
- **AdSense Compliance**: Per-article content review before publishing.

---

© 2026 Arabia Khaleej. All rights reserved.
