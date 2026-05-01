# Arabia Khaleej — Claude Context

## What this project is
Premium GCC digital platform. Next.js 16 App Router + TypeScript. Deployed on Vercel Hobby (free tier). No permanent database — Redis (Upstash free) is transient cache only.

## Key constraints
- **Vercel Hobby**: Edge functions max 30s, 2 cron jobs max (daily frequency)
- **Groq free tier**: 30 RPM, 6,000 TPM for llama-3.3-70b-versatile — never run parallel article generation
- **Upstash free tier**: 10,000 commands/day, 256MB storage — always set TTL on Redis writes
- **No Node.js APIs in Edge Runtime**: Use Web Crypto (`crypto.subtle`) not `jsonwebtoken`, `crypto` module, etc.

## Automation
- Articles: GitHub Actions every hour → `GET /api/admin/daily-automation?action=master-digest` (Authorization header)
- Marketplace: Vercel cron daily 12:00 UTC → `GET /api/admin/daily-automation?action=marketplace`

## Rate limiting
All rate limits use namespaced Redis keys: `ratelimit:{route}:{ip}`. Routes: `prayer`, `geo`, `invite`. Always pass the route name as the 4th arg to `rateLimit()`.

## CSP
`middleware.ts` is the single source of truth for Content-Security-Policy. Do NOT add CSP to `next.config.ts`.

## Redis TTL rule
Always pass `{ ex: CACHE_TIMES.X }` when calling `redis.set()`. Never write to Redis without an expiry.

## File structure
- `middleware.ts` — CSP nonce + language cookie (must be named exactly this)
- `lib/ai.ts` — Groq integration
- `lib/redis.ts` — Upstash client + `rateLimit(ip, limit, window, route)`
- `lib/insights.ts` — Unified insights fetcher (hardcoded + Redis archive)
- `lib/images.ts` — Pexels → Unsplash → fallback
- `lib/marketplace/providers/noon.ts` — Noon JWT via Web Crypto
- `app/api/admin/daily-automation/route.ts` — Main automation (Edge runtime)
- `worker/` — Cloudflare Worker for contact form email

## What NOT to do
- Don't use `jsonwebtoken` or any Node.js-only package in routes with `runtime = 'edge'`
- Don't run multiple Groq calls in parallel (rate limit + timeout risk)
- Don't call `redis.set()` without a TTL
- Don't add CSP headers in `next.config.ts`
- Don't rename `middleware.ts` — Next.js only recognizes this exact filename
