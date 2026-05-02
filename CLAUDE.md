# Arabia Khaleej — Claude Context

Premium GCC platform. Next.js 16 App Router + TypeScript. Vercel Hobby (free). No DB — Redis (Upstash free) is transient cache only.

## Constraints
- **Vercel Hobby**: Edge max 30s, 2 crons max (daily frequency)
- **Groq free**: 30 RPM, 6,000 TPM (`llama-3.3-70b-versatile`) — never parallel article generation
- **Upstash free**: 10,000 cmds/day, 256MB — always set TTL on every Redis write
- **Edge Runtime**: Web Crypto only (`crypto.subtle`) — no `jsonwebtoken`, no `crypto` module

## Automation
GitHub Actions (hourly) --> `GET /api/admin/daily-automation?action=master-digest` (Authorization header)

## Rate Limiting
Keys: `ratelimit:{route}:{ip}` · Routes: `prayer`, `geo`, `invite` · Always pass route as 4th arg to `rateLimit()`

## CSP
`middleware.ts` is the sole CSP source. **Never** add CSP to `next.config.ts`.

## Redis TTL Rule
Always `redis.set(key, val, { ex: CACHE_TIMES.X })` — no TTL-less writes ever.

## Key Files
- `middleware.ts` — CSP nonce + language cookie sync (Next.js 15+)
- `lib/ai.ts` — Groq
- `lib/redis.ts` — Upstash client + `rateLimit(ip, limit, window, route)`
- `lib/insights.ts` — hardcoded + Redis archive fetcher
- `lib/images.ts` — Pexels → Unsplash → fallback
- `app/api/admin/daily-automation/route.ts` — automation (Edge)
- `worker/` — Cloudflare Worker (contact email)

## Never Do
- Node.js-only packages in `runtime = 'edge'` routes
- Parallel Groq calls
- `redis.set()` without TTL
- CSP in `next.config.ts`
- Rename `middleware.ts` — Next.js 15 requires this exact filename
