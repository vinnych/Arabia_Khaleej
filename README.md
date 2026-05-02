# Arabia Khaleej
Premium GCC digital platform — editorial insights, prayer times, currency exchange.
Live: [arabiakhaleej.com](https://arabiakhaleej.com)

## Stack
| | |
|---|---|
| Framework | Next.js App Router + TypeScript |
| AI | Groq — `llama-3.3-70b-versatile` (articles), `llama-3.1-8b-instant` (topics) |
| Cache | Upstash Redis — 30-day TTL archive + rate limiting |
| Images | Pexels → Unsplash → deterministic fallback |
| Email | Cloudflare Worker (`worker/`) |
| Deploy | Vercel Hobby + GitHub Actions |

## Automation
GitHub Actions (hourly) --> `GET /api/admin/daily-automation?action=master-digest` --> 1 EN + 1 AR article
Auth: `Authorization: Bearer CRON_SECRET`

## API Routes
| Route | Auth | Purpose |
|---|---|---|
| `GET /api/insights` | — | Articles (lang, slug, category, limit) |
| `GET /api/prayer-times` | — | Prayer times by coordinates |
| `GET /api/exchange-rates` | — | Live currency rates |
| `GET /api/market-data` | — | GCC stock/commodity indicators |
| `GET /api/hijri` | — | Gregorian → Hijri |
| `GET /api/geolocation` | — | IP geolocation |
| `POST /api/invite` | — | Contact/join form |
| `GET /api/admin/daily-automation` | `CRON_SECRET` | Content automation |

Rate limits (per IP/hour): prayer 60 · geo 30 · invite 5

## Env Variables
| Variable | Req | Purpose |
|---|---|---|
| `UPSTASH_REDIS_REST_URL` | ✓ | Redis URL |
| `UPSTASH_REDIS_REST_TOKEN` | ✓ | Redis auth |
| `GROQ_API_KEY` | ✓ | AI generation |
| `CRON_SECRET` | ✓ | Automation auth |
| `PEXELS_API_KEY` | — | Images (primary) |
| `UNSPLASH_ACCESS_KEY` | — | Images (fallback) |
| `CONTACT_WORKER_URL` | — | Contact form worker |

Vercel: Settings → Env Vars · GitHub: repo → Settings → Secrets (`PRODUCTION_URL`, `CRON_SECRET`)

## Architecture
- No DB — Redis is transient cache only
- `middleware.ts` --> CSP nonce + language cookie sync (Next.js 15+)
- CSP middleware-only; `next.config.ts` has non-CSP headers only
- Rate limit keys: `ratelimit:{route}:{ip}`
- Real client IP from `x-forwarded-for` (split before use)
