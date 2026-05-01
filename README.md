# Arabia Khaleej

Premium GCC-focused digital platform providing editorial insights, prayer times, currency exchange, and marketplace features.

Live: [arabiakhaleej.com](https://arabiakhaleej.com)

---

## Stack

- **Framework**: Next.js (App Router) + TypeScript
- **AI**: Groq API — `llama-3.3-70b-versatile` (articles), `llama-3.1-8b-instant` (topics)
- **Cache**: Upstash Redis — insights archive (30-day TTL), marketplace cache (1h TTL), rate limiting
- **Images**: Pexels (primary) → Unsplash (fallback) → deterministic fallback
- **Email**: Cloudflare Worker (`worker/`)
- **Marketplace**: Noon.com affiliate feed (JWT via Web Crypto)
- **Deployment**: Vercel (Hobby) + GitHub Actions

---

## Automation

| Trigger | Schedule | Action |
|---------|----------|--------|
| GitHub Actions | Every hour | `master-digest` — generates 1 EN + 1 AR article |
| Vercel cron | Daily 12:00 UTC | `marketplace` — refreshes product cache |

Article generation endpoint: `GET /api/admin/daily-automation?action=master-digest`
Protected by `Authorization: Bearer CRON_SECRET`.

---

## API Routes

| Route | Auth | Purpose |
|-------|------|---------|
| `GET /api/insights` | None | Fetch articles (lang, slug, category, limit) |
| `GET /api/prayer-times` | None | Prayer times by coordinates (Aladhan) |
| `GET /api/exchange-rates` | None | Live currency rates (open.er-api.com) |
| `GET /api/market-data` | None | GCC stock/commodity indicators |
| `GET /api/hijri` | None | Gregorian → Hijri calendar |
| `GET /api/geolocation` | None | IP geolocation (freeipapi.com) |
| `POST /api/invite` | None | Contact/join form |
| `GET /api/marketplace/products` | None | Aggregated product feed |
| `GET /api/admin/daily-automation` | `CRON_SECRET` | Content + marketplace automation |

Rate limits (per IP, per route, per hour): prayer 60, geolocation 30, invite 5.

---

## Environment Variables

| Variable | Required | Purpose |
|----------|----------|---------|
| `UPSTASH_REDIS_REST_URL` | Yes | Redis connection |
| `UPSTASH_REDIS_REST_TOKEN` | Yes | Redis auth |
| `GROQ_API_KEY` | Yes | AI article generation |
| `CRON_SECRET` | Yes | Protects automation endpoint |
| `PEXELS_API_KEY` | Optional | Article images (primary) |
| `UNSPLASH_ACCESS_KEY` | Optional | Article images (fallback) |
| `NOON_KEY_ID` | Optional | Noon marketplace JWT |
| `NOON_PRIVATE_KEY` | Optional | Noon marketplace JWT signing |
| `NOON_CHANNEL_ID` | Optional | Noon partner channel |
| `CONTACT_WORKER_URL` | Optional | Cloudflare Worker URL for contact form |

Set all in Vercel → Settings → Environment Variables.
GitHub Actions needs `PRODUCTION_URL` and `CRON_SECRET` under repo → Settings → Secrets.

---

## Architecture Notes

- No permanent database — Redis is transient cache only (aligns with legal strategy)
- Middleware (`middleware.ts`) handles CSP nonce generation and language cookie sync
- CSP is middleware-only — `next.config.ts` only sets non-CSP security headers
- `jsonwebtoken` removed — Noon JWT uses Web Crypto API for Edge Runtime compatibility
- Rate limit keys are namespaced per route: `ratelimit:{route}:{ip}`
- `x-forwarded-for` is split before use to get the real client IP

---

*Last updated: May 1, 2026*
