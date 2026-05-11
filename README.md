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

## 📡 Content Intelligence Pipeline
The platform features a sophisticated editorial pipeline:

- **Trigger**: Strategic regional updates (Cloudflare Scheduled Triggers).
- **Core**: High-fidelity analysis engine.
- **Output**: 10 High-fidelity articles (5 English, 5 Arabic) per run.
- **Mix (90/10)**: 90% High-Utility (How-To Guides, Reviews, Explainers) and 10% Specialized Women-centric Analysis.
- **Quality**: Long-form 1500+ word professional regional analysis.
- **Advanced SEO**: Automated schema injection (HowTo, Review, FAQ, Article) based on content type.
- **Strategy**: Sequential generation to maintain peak quality and respect API constraints.

---

## 🛠️ API Architecture
| Endpoint | Parameters | Purpose |
| :--- | :--- | :--- |
| `GET /api/insights` | `lang`, `slug`, `limit` | Article delivery & discovery |
| `GET /api/prayer-times` | `lat`, `lng` | Location-based prayer timings |
| `GET /api/exchange-rates` | — | Real-time GCC currency dynamics |
| `GET /api/market-data` | — | GCC stock and commodity indices |
| `GET /api/daily-automation-v3-p9-kr22-auto-gen-7x` | — | Automated content pipeline |

---

## 🔑 Environment Configuration
Required environment variables for production:

```env
UPSTASH_REDIS_REST_URL=      # Redis Connection URL
UPSTASH_REDIS_REST_TOKEN=    # Redis Auth Token
GROQ_API_KEY=                # AI Generation Key
PEXELS_API_KEY=              # Primary Imagery Source
UNSPLASH_ACCESS_KEY=         # Fallback Imagery Source
CRON_SECRET=                 # Vercel Cron Authentication
```

---

## ☁️ Cloudflare Deployment
1. **Frontend**: Deploy to **Cloudflare Pages** using the Next.js preset.
2. **Automation**: Deploy `worker/daily-automation.js` using `npm run worker:deploy`.
3. **Secrets**: 
   - **Pages**: Add variables in the Cloudflare Dashboard under **Settings → Variables**.
   - **Worker**: Use `wrangler secret put <KEY>` for production, or create a `.dev.vars` file for local testing (see `.dev.vars.example`).

Required Keys: `UPSTASH_REDIS_REST_URL`, `UPSTASH_REDIS_REST_TOKEN`, `GROQ_API_KEY`, `PEXELS_API_KEY`, `CRON_SECRET`.

---

## 🛡️ Security & Performance
- **Edge Caching**: Optimized with Next.js 15 ISR/SWR (5-minute revalidation) for near-instant loading.
- **Image Optimization**: High-performance delivery for regional news sources (WAM, QNA, SPA, etc.) via Next.js Image Optimizer.
- **Free-Tier Optimized**: Specifically architected to stay within Cloudflare Free and Upstash Redis Free limits.
- **CSP**: Strict Content Security Policy managed via `middleware.ts`.
- **Rate Limiting**: Intelligent IP-based throttling on sensitive utility routes.
- **No-DB Strategy**: Legal-optimized transient storage using Redis with aggressive TTLs.
- **SEO**: Dynamic metadata generation for every insight article.

---

© 2026 Arabia Khaleej. All rights reserved.
