# AGENT.md

## Project
Qatar Portal — Next.js 16 App Router site for Qatar/Gulf audiences: prayer times, news, jobs, weather, currency, Hijri calendar.
- **Live:** https://qatar-portal.vercel.app | **Local:** http://localhost:3000
- **Repo:** `vinnych/Qatar-portal` (GitHub) | **Deploy:** Vercel auto-deploy on push to master

## Stack
Next.js 16 · TypeScript · Tailwind CSS · Upstash Redis · Groq API · Vercel

## Commands
```bash
cd "c:\Users\asish\qatar news"
npm run dev && npm run build && npm run lint
```

## Key Files
| File | Purpose |
|---|---|
| `app/page.tsx` | Homepage — prayer, weather/currency, news+jobs grid, FAQ section |
| `app/layout.tsx` | Root layout — skip link, nav, footer, CookieConsent, JSON-LD |
| `app/sitemap.ts` | Dynamic sitemap — 50+ URLs incl. all articles + jobs |
| `app/terms/page.tsx` | Terms of Service (12 sections) |
| `app/privacy/page.tsx` | Privacy Policy |
| `lib/seo.ts` | `pageMeta()` — automated SEO helper used by all static pages |
| `lib/prayer.ts` | Aladhan API — today + monthly by city or coords, revalidate 3600s/86400s |
| `lib/rss.ts` | RSS parser — regex, OG scrape, Pexels fallback, 5s timeout, 5MB cap |
| `lib/jobs.ts` | Jobs RSS — same safety measures |
| `lib/groq.ts` | Groq llama-3.1-8b-instant AI summaries, Redis-cached 7 days |
| `lib/redis.ts` | Upstash Redis — graceful null if env missing |
| `lib/rateLimit.ts` | Per-IP rate limit 30 req/min via Redis INCR |
| `lib/utils.ts` | `toSlug()`, `safeJsonLd()`, `isValidHttpUrl()` |
| `components/CookieConsent.tsx` | GDPR banner — GA4 + AdSense load only after accept |
| `components/PrayerSelector.tsx` | `"use client"` — city dropdown + geolocation detect, fetches `/api/prayer` |
| `components/SkyScene.tsx` | `"use client"` — animated sky (sun/moon/stars/clouds) |
| `components/NewsFeed.tsx` | Server component — `rounded-xl` white cards, `h-28` images |
| `components/JobList.tsx` | Server component — `rounded-xl` white cards |
| `components/MobileMenu.tsx` | `"use client"` — hamburger nav with `aria-expanded` + `aria-controls` |
| `components/NewsletterCTA.tsx` | `"use client"` — dismissible amber banner → qatarportal.substack.com |
| `public/ads.txt` | `google.com, pub-7212871157824722, DIRECT, f08c47fec0942fa0` |

## SEO Automation
All static pages use `pageMeta()` from `lib/seo.ts`:
```ts
export const metadata = pageMeta({
  title: "Page Title | Qatar Portal",
  description: "...",
  path: "/my-page",
  keywords: ["kw1", "kw2"],
  ogTitle: "Optional shorter OG title",      // defaults to title
  ogDescription: "Optional OG description",  // defaults to description
});
```
Auto-generates: canonical URL, Open Graph + image, Twitter card, Doha geo tags (geo.region, geo.placename, geo.position, ICBM).

Dynamic pages (`/news/[slug]`, `/jobs/[slug]`, `/prayer/[city]`, category pages) use `generateMetadata()` — already include `news_keywords` and `dateModified` on news articles.

## Cookie Consent
`CookieConsent.tsx` gates GA4 + AdSense behind user accept. Stored in `localStorage("cookie-consent")`. On decline, neither script loads.

## Slug System
- `slug` = `toSlug(title, url)` — kebab-case title + 4-char hash (e.g. `qatar-fuel-a3f9`)
- Old base64 slugs still work via fallback decode (backward compat)
- React `cache()` deduplicates fetch between `generateMetadata` and page

## Design System — The Modern Diplomat
- **Body font:** Inter (next/font/google) · Playfair Display for "QATAR" wordmark · Newsreader italic 700 for all page H1s
- **Font smoothing:** antialiased + optimizeLegibility in globals.css
- **Colors (custom tokens):**
  - `primary` `#640023` — CTAs, hover links, active states
  - `surface-low` `#f4f3f1` — section backgrounds, inputs
  - `on-surface` `#1a1c1a` — body text
  - `secondary-accent` `#fcd34d` — amber gold highlights
  - `utility-chip` `#acf2c7` — mint green expat source badges
- **Surface hierarchy (no-border system):** page bg `#faf9f6` → section bg `surface-low` → cards `bg-white`
- **Cards:** `bg-white rounded-xl ring-1 ring-stone-900/5 shadow-ambient` — hover: `shadow-ambient-hover transition-shadow duration-200`
- **Shadows:** `.shadow-ambient` = `0 20px 40px rgba(87,65,68,0.06)` · `.shadow-ambient-hover` = `0 24px 48px rgba(87,65,68,0.10)`
- **Header:** `h-11` fixed · gradient `from-[#640023] to-rose-900` at 135° · nav `text-[11px] font-semibold gap-5`
- **Primary CTAs:** `bg-primary text-white hover:scale-[1.02] transition-transform`
- **Inputs:** `bg-surface-low border-0 focus:ring-2 focus:ring-primary/30`
- **Section labels:** `text-[10px] font-bold text-gray-600 uppercase tracking-widest` + thin `h-px bg-stone-200` separator
- **Typography scale:** body `text-xs`/`text-[11px]` · titles `text-[13px] font-semibold` · labels `text-[10px] font-bold uppercase tracking-widest`
- **Touch targets:** FAQ `<summary>` min-h-[44px] · job cards min-h via p-3

## Accessibility Standards
- Skip-to-content link in layout (`#main-content`)
- All search/select inputs have linked `<label>` via `htmlFor`/`id`
- `sr-only` labels on NewsSearch and JobSearch inputs
- `aria-expanded` + `aria-controls` on MobileMenu open button
- WCAG AA contrast on all text (minimum 4.5:1 for small text, 3:1 for large)
- `suppressHydrationWarning` on `<details>` elements (browser injects text nodes)

## Frontend Review (Ongoing)
After every significant UI change, audit for:
1. **Mobile (375px):** tap targets ≥44px, text ≥11px, no horizontal scroll, cards stack cleanly
2. **Consistency:** all new cards use the standard card pattern above
3. **Typography:** Inter applied, correct weight/size hierarchy
4. **Interactions:** hover states smooth (duration-200), no jarring color jumps
5. **Performance:** no new heavy dependencies, images use `loading="lazy"`
6. **Accessibility:** new inputs have labels, new buttons have aria-labels, contrast ≥4.5:1

## API Routes
| Route | Notes |
|---|---|
| `GET /api/prayer` | `?city=&country=` or `?lat=&lng=` — rate limited |
| `GET /api/prayer/monthly` | `?city=&country=&year=&month=` or `?lat=&lng=` — validates year 1900-2100, month 1-12 |
| `GET /api/news` | Rate limited |
| `GET /api/jobs` | Rate limited |

## Redis Keys
| Key | TTL |
|---|---|
| `news:{slug}`, `job:{slug}` | 7 days (nx:true) |
| `news:summary:{slug}` | 7 days |
| `news:ogimage:{slug}` | 7 days |
| `prayer:today:{city}:{country}` | 1h |
| `prayer:monthly:{city}:{country}:{year}:{month}` | 24h |
| `ratelimit:{ip}:{minute}` | 90s |

## Env Vars
`UPSTASH_REDIS_REST_URL` · `UPSTASH_REDIS_REST_TOKEN` · `GROQ_API_KEY` · `PEXELS_API_KEY`

## Analytics & Monetization
- **GA:** `G-VPREJS079K` · **AdSense:** `ca-pub-7212871157824722` · **Search Console:** verified
- **Bing Webmaster Tools:** verified via Google Search Console import (no meta tag needed)
- Both GA + AdSense are consent-gated via `CookieConsent.tsx`

## SEO
- `pageMeta()` in `lib/seo.ts` auto-applies canonical, OG, Twitter card, geo tags to all static pages
- JSON-LD per page: `WebSite`, `Organization`, `FAQPage`, `NewsArticle`, `JobPosting`, `ItemList`, `BreadcrumbList`
- `news_keywords` meta + `dateModified` on all news article pages
- Prayer page uses `WebPage` schema — NOT `Event` (caused Search Console errors)
- Sitemap includes `/terms` and `/privacy`

## Security
- `isValidHttpUrl()` on all external links · `safeJsonLd()` escapes `<>` for XSS prevention
- 5s timeout + 5MB cap on RSS · 2s on OG image scrapes
- CSP in `next.config.ts` — `font-src 'self' fonts.gstatic.com` (self for Next.js-hosted fonts)
- AdSense, GA, Groq, Pexels, Aladhan all explicitly allowed in CSP

## Gotchas
- `create-next-app` hangs interactively — scaffold manually
- Next.js 16: `params` is a Promise — must `await params` before accessing `slug`
- All RSS parsing uses regex — no rss-parser library
- Gemini geo-restricted in Qatar — use Groq
- Prayer page failed on Vercel (not locally) — fixed by Redis cache in `lib/prayer.ts`
- Geolocation "no permission box": browser may have cached a previous deny — reset via Site Settings → Location → Ask
- Next.js self-hosts Google Fonts at `/_next/static/media/` — CSP `font-src` must include `'self'`
- `<details>` elements need `suppressHydrationWarning` — browsers inject text nodes that cause React error #418
- Cookie consent in `localStorage` — GA/AdSense only load after accept; test in incognito to see banner
