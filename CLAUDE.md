# CLAUDE.md

This file provides guidance to Claude Code when working with code in this repository.

## Project
Qatar Portal — a Next.js 14 website aggregating prayer times, news, and job listings for Qatar/Gulf audiences. Goal: organic SEO traffic without paid marketing.

**Live site:** https://qatar-portal.vercel.app
**Local dev:** http://localhost:3000

## Tech Stack
- **Framework:** Next.js 14 (App Router, TypeScript)
- **Styling:** Tailwind CSS
- **Hosting:** Vercel (free tier, auto-deploys from GitHub)
- **Prayer times:** Aladhan API (free, no auth)
- **News:** RSS feeds (Al Jazeera, Google News Qatar, BBC Middle East) parsed with regex in `lib/rss.ts`
- **Jobs:** Google News RSS (qatar jobs/careers queries) parsed in `lib/jobs.ts`
- **AI Summaries:** Groq API (llama-3.1-8b-instant) via `lib/groq.ts` — summaries cached in Redis
- **Database:** None — all data fetched live with Next.js `fetch` caching

## Project Structure
```
app/
├── page.tsx                  # Homepage (prayer + news + jobs)
├── icon.svg                  # Favicon — maroon square with golden date palm
├── news/
│   ├── page.tsx              # News list page
│   └── [slug]/page.tsx       # Individual article page (React cache dedup)
├── jobs/
│   ├── page.tsx              # Jobs list page
│   └── [slug]/page.tsx       # Individual job page (React cache dedup)
├── layout.tsx                # Shared layout + nav + WebSite JSON-LD + FooterScenery
├── sitemap.ts                # Dynamic sitemap (fetches all articles + jobs)
├── robots.ts                 # robots.txt
└── api/
    ├── prayer/
    │   ├── route.ts          # Today's prayer times
    │   └── monthly/route.ts  # Monthly calendar — validates year/month params
    ├── news/route.ts
    └── jobs/route.ts
components/
├── PrayerTimes.tsx           # Async server component (passes to SkyScene)
├── SkyScene.tsx              # "use client" — animated sky scene
├── NewsFeed.tsx              # Async server component, links to /news/[slug]
├── JobList.tsx               # Async server component, links to /jobs/[slug]
├── NewsSearch.tsx            # "use client" — client-side news filter
├── JobSearch.tsx             # "use client" — client-side job filter
└── FooterScenery.tsx         # Pure SVG date palm scene — renders above footer on all pages
lib/
├── prayer.ts                 # Aladhan API helper (revalidates 3600s)
├── rss.ts                    # RSS parser — regex, OG image scraping, URL validation, 5s timeout, 5MB cap
├── jobs.ts                   # Jobs RSS fetcher — same safety measures
├── groq.ts                   # Groq AI summarizer (llama-3.1-8b-instant), Redis-cached 7 days
└── redis.ts                  # Upstash Redis client — graceful null if env vars missing
public/                       # Static assets (currently empty)
next.config.ts                # Security headers (CSP, X-Frame-Options, etc.)
```

## Common Commands
```bash
cd "c:\Users\asish\qatar news"
npm run dev       # Start local dev server
npm run build     # Production build
npm run lint      # ESLint
```

## Data Sources
| Data | Source | Revalidation |
|---|---|---|
| Prayer times | api.aladhan.com | 1 hour |
| News | Al Jazeera RSS, The Peninsula RSS | 15 min |
| Jobs | Bayt.com RSS, GulfTalent RSS | 30 min |

## Slug System
- `slug` field on `NewsItem` and `Job` = `Buffer.from(link).toString("base64url")`
- Decode in detail pages: `Buffer.from(slug, "base64url").toString()`
- Always validate URLs with `isValidHttpUrl()` before use
- Both `generateMetadata` and the page component share one fetch via React `cache()`

## Card Color System
- News cards: `bg-sky-50 border-sky-100` — distinct from `stone-50` page background
- Job cards: `bg-emerald-50 border-emerald-100`
- Prayer cards: `bg-violet-50 border-violet-100`

## SEO Strategy
- SSR on all pages + individual article/job pages (~43+ indexed URLs)
- JSON-LD per page: WebSite, Event, NewsArticle, JobPosting, ItemList
- Canonical tags + keyword metadata on every page
- Dynamic async sitemap includes all individual article + job URLs
- Favicon: `app/icon.svg` (Next.js App Router auto-serves as favicon)
- After deploy: submit sitemap to Google Search Console

## Security
- URL validation before rendering any external link
- 5s fetch timeout + 5MB payload cap on RSS fetches
- `res.ok` checked before reading response body in all RSS fetchers
- Year/month bounds validation (1900–2100, 1–12) on monthly prayer API
- PrayerSelector validates API response shape before setting state
- Security headers set in `next.config.ts`

## Deployment
- Push to GitHub, connect repo to Vercel — auto-deploys on every push
- Env vars required: `UPSTASH_REDIS_REST_URL`, `UPSTASH_REDIS_REST_TOKEN`, `GROQ_API_KEY` (set in Vercel dashboard)

## External Services & Websites Used

### Hosting & Infrastructure
| Service | URL | Purpose |
|---|---|---|
| Vercel | https://vercel.com | Hosting + auto-deploy from GitHub |
| GitHub | https://github.com | Source code repository (vinnych/Qatar-portal) |
| Upstash | https://upstash.com | Serverless Redis — persists news/job articles for 7 days |

### Data APIs & RSS Feeds
| Service | URL | Purpose |
|---|---|---|
| Aladhan API | https://aladhan.com | Prayer times for all cities (free, no auth) |
| Al Jazeera RSS | https://www.aljazeera.com/xml/rss/all.xml | English news feed (✅ working) |
| Google News RSS | https://news.google.com/rss/search?q=qatar | Qatar news aggregator (✅ working) |
| BBC Middle East RSS | https://feeds.bbci.co.uk/news/world/middle_east/rss.xml | Middle East news (✅ working) |
| Google News Jobs RSS | https://news.google.com/rss/search?q=qatar+jobs+hiring | Qatar job news (✅ working) |
| Groq API | https://console.groq.com | AI news summaries — llama-3.1-8b-instant (free, 14,400 req/day) |

### Dev Tools & Frameworks
| Tool | URL | Purpose |
|---|---|---|
| Next.js | https://nextjs.org | React framework (App Router, SSR, SSG) |
| Tailwind CSS | https://tailwindcss.com | Utility-first CSS styling |
| TypeScript | https://www.typescriptlang.org | Type-safe JavaScript |
| Google Fonts | https://fonts.google.com | Playfair Display font |

### SEO & Analytics
| Tool | URL | Purpose |
|---|---|---|
| Google Search Console | https://search.google.com/search-console | Sitemap submission + indexing |
| Schema.org | https://schema.org | JSON-LD structured data vocabulary |
| Vercel Speed Insights | https://vercel.com/docs/speed-insights | Core Web Vitals monitoring |
