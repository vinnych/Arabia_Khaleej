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

The platform uses a **LangGraph state machine** to generate, validate, and persist editorial content. The workflow runs entirely in `/api/workflow/daily` via `workflow.invoke()`, returning the final result after processing all articles sequentially.

### Architecture

```
Worker (CF Worker)  →  POST /api/workflow/daily
                           │
                           ▼
                      LangGraph State Graph
                           │
        ┌─────────────────┬─┴─┬─────────────────┐
        ▼                 ▼   ▼                 ▼
     trending          policy  score       persist
        │                  │     │              │
        ▼                  ▼     │              ▼
     generate ──────► retry/passthrough  drafts list
        │
        ▼
   [LLM Article]
   [Image Fetch]
```

### Node Flow

Each article flows through 6 agent nodes:

| Node | Step | What it does |
|------|------|--------------|
| **init** | Creates placeholder articles for each requested count |
| **trending** | Fetches GCC topics from Groq LLM; sorts by AdSense score |
| **generate** | Groq 70B writes article; Pexels/Unsplash image; saves draft |
| **policy** | AdSense compliance check (1100+ words, richness); retries once on fail |
| **score** | 0–100 quality score (word count, sections, citations, stats, entities) |
| **persist** | Saves to `insights:drafts:{lang}`; deletes workflow state |

### Cron Trigger

- **Worker**: `worker/daily-automation.js` (Cloudflare Worker)
- **Schedule**: `0 */2 * * *` — every 2 hours
- **Articles per run**: 3
- **Daily output**: up to 36

### Deleted Article Handling

When an article fails policy checks after retries, it is marked `deleted`. The workflow **continues** to the next article (previously this would terminate the entire run — bug fixed in LangGraph version).

### Code Quality

- **LangGraph v1.3.2**: Annotation.Root pattern for state schema
- **State Persistence**: Redis state saved between nodes for debugging
- **Error Isolation**: Failed articles don't block other articles
- **ADSENSE_RULES**: Single source of truth in `lib/workflow/prompts.ts`
- **Analysis**: Richness/scoring functions in `lib/workflow/analysis.ts`

---

## 🛠️ API Architecture

| Endpoint | Parameters | Purpose |
| :--- | :--- | :--- |
| `GET /api/insights` | `lang`, `slug`, `limit` | Article delivery & discovery |
| `GET /api/prayer-times` | `lat`, `lng` | Location-based prayer timings |
| `GET /api/exchange-rates` | — | Real-time GCC currency dynamics |
| `GET /api/market-data` | — | GCC stock and commodity indices |

The agentic editorial pipeline is triggered by the Cloudflare Worker cron (`worker/daily-automation.js`) or manually via POST to `/api/workflow/daily` with proper authentication.

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
