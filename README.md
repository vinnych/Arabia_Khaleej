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

## 🤖 External Agent Editorial Workflow

Arabia Khaleej delegates heavy article generation to an external Python agent. The platform itself does **not** run any cron jobs for generating content. 

### Architecture Flow

1. **Trigger**: A Cloudflare Automation Worker (`worker/daily-automation.js`) hits the website's `/api/cron/generate` route every 30 minutes. 
   *(Note: The worker also pings the Render agent every 14 minutes to prevent cold starts).*
2. **Trending Topics**: The Next.js API `/api/cron/generate` generates trending topics for the GCC region.
3. **Dispatch**: The website sends these topics to the external Python agent (`article-agent-zk00.onrender.com`).
4. **Agent Activation**: The Python agent receives the topics, activates its heavy AI processing (using Groq 70B), and writes the articles.
5. **Callback**: The agent sends the final completed drafts back to the website via a secure webhook (`POST /api/webhook`).
6. **Persistence**: Drafts are stored in Upstash Redis and appear in the admin panel for human review.

This decoupled architecture ensures the Next.js edge functions don't time out during heavy LLM generation, keeping the main website lightweight and fast.

---

## 🛠️ API Architecture

| Endpoint | Parameters | Purpose |
| :--- | :--- | :--- |
| `GET /api/insights` | `lang`, `slug`, `limit` | Article delivery & discovery |
| `GET /api/prayer-times` | `lat`, `lng` | Location-based prayer timings |
| `GET /api/exchange-rates` | — | Real-time GCC currency dynamics |
| `GET /api/market-data` | — | GCC stock and commodity indices |

The generation pipeline is triggered externally by the Cloudflare Automation Worker pinging `/api/cron/generate` or manually via POST to `/api/generate` with proper authentication.

---

## 🔑 Environment Configuration
Required environment variables for production:

```env
UPSTASH_REDIS_REST_URL=      # Redis Connection URL
UPSTASH_REDIS_REST_TOKEN=    # Redis Auth Token
PEXELS_API_KEY=              # Primary Imagery Source
CRON_SECRET=                 # Worker Cron Authentication
ADMIN_SECRET=                # Admin Review Panel Access
NEXT_PUBLIC_ADSENSE_ID=      # AdSense Publisher ID
NEXT_PUBLIC_SITE_VERIFICATION= # Google Site Verification
CONTACT_WORKER_URL=          # Contact Form API URL
```

---

## ☁️ Cloudflare Deployment

### 1. Frontend (Cloudflare Pages)

1. Run `npm run build` — outputs to `.vercel/output`
2. In Cloudflare Pages, select **Next.js framework preset** with **Output = Serverless Functions** (SSR)
3. Connect your repo / upload the built output

Required Pages environment variables (Settings → Variables → Add):
`UPSTASH_REDIS_REST_URL`, `UPSTASH_REDIS_REST_TOKEN`, `PEXELS_API_KEY`, `ADMIN_SECRET`, `NEXT_PUBLIC_ADSENSE_ID`, `NEXT_PUBLIC_SITE_VERIFICATION`, `CONTACT_WORKER_URL`

### 2. Automation & Contact Workers (Cloudflare Worker)

```bash
npm run automation-worker:deploy
npm run contact-worker:deploy
```

These deploy the background `worker/daily-automation.js` and the `worker/worker.js` (contact form).

Required Worker secrets (via `wrangler secret put <KEY>`):
`UPSTASH_REDIS_REST_URL`, `UPSTASH_REDIS_REST_TOKEN`, `PEXELS_API_KEY`, `CRON_SECRET`

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
