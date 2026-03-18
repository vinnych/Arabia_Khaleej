# Qatar Portal

A fast, mobile-first portal for Qatar and Gulf audiences — prayer times, news, jobs, weather, currency, and Hijri calendar.

**Live:** https://qatar-portal.vercel.app

---

## Features

- **Prayer Times** — today's times + monthly calendar for 35+ cities, geolocation support (Doha, Mecca, Dubai, Riyadh, and more)
- **News** — aggregated from Al Jazeera, The Peninsula Qatar, Gulf Times, Qatar News Agency, with AI summaries via Groq
- **Jobs** — listings from Bayt.com and GulfTalent
- **Weather** — current conditions and forecast for Doha via Open-Meteo
- **Currency** — live exchange rates for QAR vs major currencies
- **Hijri Calendar** — date conversion and monthly view
- **Ramadan 2026** — prayer times, Suhoor/Iftar schedule
- **Qatar Guides** — salary guide, labour law, visa requirements, cost of living
- **Work in Qatar** — complete expat guide hub
- **News Categories** — Qatar, Business, Sports, World, Gulf filtered feeds

---

## Stack

| Layer | Technology |
|---|---|
| Framework | Next.js 16 (App Router) |
| Language | TypeScript |
| Styling | Tailwind CSS |
| Hosting | Vercel (auto-deploy on push to `master`) |
| Cache | Upstash Redis |
| AI Summaries | Groq API (Llama 3.1 8B Instant) |
| Images | Pexels API |
| Analytics | Google Analytics 4 |
| Ads | Google AdSense |

---

## Project Structure

```
app/
├── page.tsx                    # Homepage
├── layout.tsx                  # Root layout — nav, footer, GA, AdSense
├── sitemap.ts                  # Dynamic sitemap (50+ URLs)
├── news/
│   ├── page.tsx                # News feed
│   └── [slug]/page.tsx         # Article detail with AI summary
├── jobs/
│   ├── page.tsx                # Job listings
│   └── [slug]/page.tsx         # Job detail
├── prayer/
│   ├── page.tsx                # Prayer times (Doha default)
│   └── [city]/page.tsx         # Prayer times by city
├── api/
│   ├── prayer/route.ts         # GET prayer times (city or coords)
│   ├── prayer/monthly/         # GET monthly prayer calendar
│   ├── news/route.ts           # GET news feed
│   └── jobs/route.ts           # GET jobs feed
└── [other pages]/              # weather, currency, hijri, ramadan-2026, guides...

components/
├── PrayerSelector.tsx          # City dropdown + geolocation (client)
├── SkyScene.tsx                # Animated sky — sun/moon/stars/clouds (client)
├── NewsFeed.tsx                # News card grid (server)
├── JobList.tsx                 # Job card list (server)
├── AdUnit.tsx                  # Google AdSense wrapper (client)
├── NewsletterCTA.tsx           # Dismissible Substack banner (client)
└── FooterScenery.tsx           # SVG date palm footer decoration

lib/
├── prayer.ts                   # Aladhan API — today + monthly, Redis cached
├── rss.ts                      # RSS parser — news feed with SSRF protection
├── jobs.ts                     # Jobs RSS parser
├── groq.ts                     # Groq AI summaries, Redis cached 7 days
├── redis.ts                    # Upstash Redis client
├── rateLimit.ts                # Per-IP rate limiting (30 req/min via Redis)
└── utils.ts                    # toSlug(), safeJsonLd(), isValidHttpUrl()
```

---

## Getting Started

### Prerequisites

- Node.js 18+

### Environment Variables

Create a `.env.local` file:

```env
UPSTASH_REDIS_REST_URL=your_upstash_url
UPSTASH_REDIS_REST_TOKEN=your_upstash_token
GROQ_API_KEY=your_groq_api_key
PEXELS_API_KEY=your_pexels_api_key
```

All four are optional for local development — the site degrades gracefully without them (no AI summaries, no image search, no Redis caching).

### Running Locally

```bash
git clone https://github.com/vinnych/Qatar-portal.git
cd Qatar-portal
npm install
npm run dev       # http://localhost:3000
npm run build     # production build
npm run lint      # ESLint
```

---

## Key Design Decisions

### Slug System
Article and job slugs are `toSlug(title, url)` — kebab-case title + a 4-character hash derived from the URL (e.g. `qatar-fuel-a3f9`). Old base64 slugs redirect via fallback decode for backward compatibility.

### Caching Strategy

| Data | Cache | TTL |
|---|---|---|
| News / job metadata | Redis | 7 days |
| AI summaries | Redis | 7 days |
| Article images (Pexels) | Redis | 7 days |
| Prayer times (today) | Redis + Next.js fetch | 1 hour |
| Monthly prayer calendar | Redis + Next.js fetch | 24 hours |
| Rate-limit counters | Redis | 90 seconds |

### RSS Parsing
All RSS feeds are parsed with regex — no `rss-parser` library. Each fetch has a 5-second timeout and a 5 MB response cap to prevent abuse.

### SEO
- Server-rendered on all pages with `revalidate` for freshness
- JSON-LD structured data per page: `NewsArticle`, `JobPosting`, `FAQPage`, `BreadcrumbList`, `WebPage`, `ItemList`
- Dynamic sitemap with 50+ URLs
- Canonical tags, Open Graph, Twitter cards on every page

### Security
- SSRF protection on all outbound RSS/job fetches (blocks private IPv4 and IPv6 ranges)
- Rate limiting: 30 requests/minute per IP via Redis
- Input sanitization on all API query parameters
- `nofollow` on all external outbound links
- Content Security Policy, HSTS, X-Frame-Options, X-Content-Type-Options headers
- Prompt injection mitigation before passing RSS content to Groq
- GPS coordinates rounded to ~1 km precision before use

---

## Deployment

The repo auto-deploys to Vercel on every push to `master`. Set the four environment variables in the Vercel dashboard under **Settings → Environment Variables**.

---

## Analytics & Monetization

- **Google Analytics 4:** `G-VPREJS079K`
- **Google AdSense:** `ca-pub-7212871157824722`
- **Newsletter:** [qatarportal.substack.com](https://qatarportal.substack.com)

---

## License

All rights reserved © 2026
