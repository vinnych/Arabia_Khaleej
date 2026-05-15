# 🇦🇪 Arabia Khaleej (عربية خليج)
> **Premium GCC Digital Intelligence Platform**

Arabia Khaleej is a state-of-the-art digital ecosystem providing high-fidelity editorial insights, real-time prayer timings, currency dynamics, and market intelligence for the Gulf Cooperation Council region.

---

## 💎 Project Essence
- **Visionary Editorial**: Expert-led long-form regional analysis (1500+ words) focused on GCC transformation.
- **Real-time Utility**: Precision prayer times via Adhan API and live GCC market indicators.
- **Glassmorphic UI**: A premium, responsive interface built with Next.js 15 and Framer Motion.
- **Privacy First**: No permanent database; transient caching via Upstash Redis.

---

## 🚀 Technology Stack
| Layer | Technology |
| :--- | :--- |
| **Framework** | Next.js 15 (App Router) + TypeScript |
| **AI Engine** | Groq (Llama 3.3 70B & Llama 3.1 8B) |
| **Persistence** | Upstash Redis (Transient Cache) |
| **Imagery** | Multi-tier fallback (Pexels → Unsplash → Geometric) |
| **Styling** | Tailwind CSS + Framer Motion |
| **Infrastructure** | Cloudflare Pages + Workers |

---

## 🤖 Agentic Editorial Workflow

The platform uses a **6-node edge state machine** to generate, validate, and persist editorial content. Every node outputs a `nextAction` field, so the Cloudflare Worker can chain through the entire pipeline without additional orchestration.

### Node Flow

```
POST /api/workflow/daily          →  init
  │  GET /api/workflow/trending    →  trending      (Node 1: RSS + AdSense topic scoring)
  │    GET /api/workflow/generate/ →  generate     (Node 2: Groq 70B article generation)
  │      GET /api/workflow/policy/  →  policy       (Node 3: AdSense compliance audit)
  │        GET /api/workflow/score/ →  score        (Node 4: heuristic quality scoring)
  │          GET /api/workflow/persist/ → persist   (Node 5: Redis commit + workflow cleanup)
  │            ✓ done
```

### Per-Node Responsibilities

| Node | Endpoint | What it does |
|---|---|---|
| **1 — Init** | `POST /api/workflow/daily` | Creates or resumes workflow state in Redis; chains to trending |
| **2 — Trending** | `GET /api/workflow/trending` | Fetches Google News RSS for GCC, Groq 8B scores topics for AdSense density, picks top topic |
| **3 — Generate** | `GET /api/workflow/generate/0` | Groq 70B writes the full article; Pexels/Search image; draft saved to Redis |
| **4 — Policy** | `GET /api/workflow/policy/0` | Groq 8B audits against AdSense policy AND checks for AdSense richness (minimum statistics/citations); retries once on fail/poor richness; auto-deletes on second fail |
| **5 — Score** | `GET /api/workflow/score/0` | Heuristic 0–100 score across word count, sections, citations, stats, named entities |
| **6 — Persist** | `GET /api/workflow/persist/0` | Writes to `insights:drafts:{lang}` list; deletes workflow state; returns `done` |

### Cron Trigger

- **Worker**: `worker/daily-automation.js` (Cloudflare Worker)
- **Schedule**: `0 */2 * * *` — every 2 hours, consistently generating new drafts awaiting human editorial review on `/admin/review`
- **Articles per run**: 3
- **Daily output**: up to 36

### Code Quality

- **Shared Helpers**: `ok()` and `fail()` functions are centralized in `lib/workflow/response.ts`
- **Type Safety**: All workflow routes use proper TypeScript types (`NextAction` instead of `any`)
- **Error Logging**: All catch blocks log errors with `console.error` for debugging
- **ADSENSE_RULES**: Single source of truth in `lib/workflow/prompts.ts`, imported where needed
- **Constants**: API URLs centralized in `lib/constants/api.ts`

### Resume Support

If a workflow run is interrupted (e.g., a node times out), the state machine is persisted in Redis under `wf:{id}` every step. On the next `/api/workflow/daily` call, the same `workflowId` resumes from the last completed step automatically.

---

## 🛠️ API Architecture

| Endpoint | Parameters | Purpose |
| :--- | :--- | :--- |
| `GET /api/insights` | `lang`, `slug`, `limit` | Article delivery & discovery |
| `GET /api/prayer-times` | `lat`, `lng` | Location-based prayer timings |
| `GET /api/exchange-rates` | — | Real-time GCC currency dynamics |
| `GET /api/market-data` | — | GCC stock and commodity indices |

The agentic editorial pipeline is **not** called from a browser.
It is triggered exclusively by the Cloudflare Worker cron (`worker/daily-automation.js`).

---

## 🔑 Environment Configuration
Required environment variables for production:

```env
UPSTASH_REDIS_REST_URL=      # Redis Connection URL
UPSTASH_REDIS_REST_TOKEN=    # Redis Auth Token
GROQ_API_KEY=                # AI Generation Key
PEXELS_API_KEY=              # Primary Imagery Source
UNSPLASH_ACCESS_KEY=         # Fallback Imagery Source
CRON_SECRET=                 # Worker Cron Authentication
ADMIN_SECRET=                # Admin Review Panel Access
```

---

## ☁️ Cloudflare Deployment

### 1. Frontend (Cloudflare Pages)

1. Run `npm run build` — outputs to `.vercel/output`
2. In Cloudflare Pages, select **Next.js framework preset** with **Output = Serverless Functions** (SSR)
3. Connect your repo / upload the built output

Required Pages environment variables (Settings → Variables → Add):
`UPSTASH_REDIS_REST_URL`, `UPSTASH_REDIS_REST_TOKEN`, `GROQ_API_KEY`, `PEXELS_API_KEY`, `ADMIN_SECRET`, `NEXT_PUBLIC_ADSENSE_ID`, `NEXT_PUBLIC_SITE_VERIFICATION`

### 2. Automation Worker (Cloudflare Worker)

```bash
npm run worker:deploy
```

This deploys `worker/daily-automation.js` with `worker/wrangler.toml` (schedule: every 2 h).

Required Worker secrets (via `wrangler secret put <KEY>`):
`UPSTASH_REDIS_REST_URL`, `UPSTASH_REDIS_REST_TOKEN`, `GROQ_API_KEY`, `PEXELS_API_KEY`, `CRON_SECRET`

---

## 🛡️ Security & Performance
- **Edge Caching**: ISR/SWR (5-minute revalidation) for near-instant loading.
- **Image Optimization**: Next.js Image Optimizer for regional news sources (WAM, QNA, SPA, etc.).
- **Free-Tier Optimized**: Architected for Cloudflare Free + Upstash Redis Free limits.
- **CSP**: Strict Content Security Policy managed via `middleware.ts` + `lib/csp.ts`.
- **Rate Limiting**: IP-based throttling on sensitive utility routes.
- **No-DB Strategy**: Transient storage using Redis with aggressive TTLs.
- **AdSense Compliance**: Per-article policy audit node + human editorial review before publishing.

---

© 2026 Arabia Khaleej. All rights reserved.
