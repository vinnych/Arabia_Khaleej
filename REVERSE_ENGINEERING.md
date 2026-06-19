# 🧠 Arabia Khaleej — System Reverse Engineering & Architecture Deep-Dive

This document provides a comprehensive, step-by-step technical breakdown of **Arabia Khaleej**, a bilingual (English & Arabic) regional intelligence portal optimized for high-performance serverless edge deployment using **Next.js 15 (App Router)**, **Cloudflare Workers (nodejs_compat)**, **Cloudflare D1 (SQLite)**, and **Upstash Redis (Cache / Limit)**.

---

## 🏗️ 1. Core Architecture & High-Level Design

Arabia Khaleej is built as a serverless, bilingual publication engine. The high-level component layout is visualized below:

```mermaid
graph TD
    subgraph Cloudflare Edge Runtime
        NextApp[Next.js 15 App Router]
        CFWorker[CF Automation Worker]
        CFEmail[CF Email Worker]
        D1DB[(Cloudflare D1 SQL DB)]
    end

    subgraph External Infrastructure
        PythonAgent[Render Python LLM Agent]
        Upstash[Upstash Redis REST API]
        GoogleNews[Google/Bing RSS Feeds]
        GoogleTrans[Google Translate API]
    end

    CFWorker -- "1. Hourly Ping + Cron GET" --> NextApp
    NextApp -- "2. Parse RSS Feeds" --> GoogleNews
    NextApp -- "3. Trigger Async Run (after)" --> PythonAgent
    PythonAgent -- "4. Bilingual Webhook Callback" --> NextApp
    NextApp -- "5. Store Bilingual Draft" --> D1DB
    
    Admin[Admin Panel /admin/review] -- "6. Review / Edit / Publish" --> NextApp
    NextApp -.->|Fallback translation| GoogleTrans
    NextApp -- "7. Store Live Bilingual Article" --> D1DB
    NextApp -- "8. Cache feeds & articles" --> Upstash
```

### Why this architecture was chosen:
1. **Serverless Edge (Cloudflare Workers)**: Executing routes at the edge keeps response times sub-millisecond globally, particularly in the GCC region, without maintaining expensive Virtual Machines.
2. **Cloudflare D1 (SQLite at the Edge)**: Cloudflare D1 provides native, zero-latency SQL storage right inside the Edge runtime, resolving key limits and volatile eviction policies.
3. **Upstash REST Redis Cache**: Upstash Redis is used strictly as a fast cache layer for hot articles and feed listings, as well as tracking sliding-window rate limits.
4. **External Render Python Agent**: Running heavy AI and LangChain scripts directly inside Vercel or Cloudflare Edge functions is impossible due to execution size limits and CPU instruction timeouts. Delegating to a dedicated Python instance on Render handles heavy operations. Next.js 15's `after()` handles triggers asynchronously, avoiding blocking timeouts.

---

## 🛢️ 2. Database Schema (D1 SQL) & Redis Cache

Arabia Khaleej utilizes Cloudflare D1 as its primary relational store.

### D1 SQLite Table Structures

#### 1. `articles` Table
Stores published bilingual article details.
```sql
CREATE TABLE articles (
    id TEXT PRIMARY KEY,
    slug TEXT UNIQUE NOT NULL,
    title_en TEXT NOT NULL,
    title_ar TEXT NOT NULL,
    description_en TEXT NOT NULL,
    description_ar TEXT NOT NULL,
    pubDate TEXT NOT NULL,
    source TEXT NOT NULL,
    category TEXT NOT NULL,
    image TEXT,
    tags TEXT, -- JSON array of strings
    author_id TEXT,
    author_name_en TEXT,
    author_name_ar TEXT,
    author_role_en TEXT,
    author_role_ar TEXT,
    content_en TEXT NOT NULL,
    content_ar TEXT NOT NULL,
    wordCount INTEGER NOT NULL DEFAULT 0,
    qualityScore INTEGER NOT NULL DEFAULT 6
);
```

#### 2. `drafts` Table
Manages active draft reviews.
```sql
CREATE TABLE drafts (
    topic TEXT PRIMARY KEY,
    status TEXT NOT NULL,
    word_count INTEGER,
    title TEXT, -- JSON object {en, ar} or string
    content TEXT, -- JSON object {en, ar} or string
    image_url TEXT,
    error TEXT,
    description TEXT, -- JSON object {en, ar} or string
    tags TEXT, -- JSON array
    timestamp INTEGER NOT NULL,
    quality_score INTEGER NOT NULL DEFAULT 6
);
```

### Redis Key Schema (Cache & Rate Limits)
Upstash Redis acts purely as a transient cache layer and rate limiter:

| Key Template | Type | TTL / Retention | Purpose |
|---|---|---|---|
| `insights:article:{slug}` | String (GZipped JSON) | Indefinite (Permanent Cache) | Cache of full bilingual published article content |
| `insights:list:en` | List (GZipped JSON) | Indefinite (Permanent Cache) | Cache of ordered English feed summaries |
| `insights:list:ar` | List (GZipped JSON) | Indefinite (Permanent Cache) | Cache of ordered Arabic feed summaries |
| `ratelimit:{route}:{ip}` | Integer | 60s to 3600s | Sliding window rate limiting count |
| `lock:insights:list` | String | 15s | Mutex lock for cache feed updates |

---

## 🔄 3. Step-by-Step Workflows

### Flow A: Automated Daily Article Generation (Cron Trigger)

1. **Cron Dispatch**: Cloudflare cron Worker hits Next.js `/api/cron/generate` with a Bearer header.
2. **RSS Parsing & Deduplication**: Fetches RSS feeds and runs Jaccard Similarity deduplication against existing topics (rejecting any with $\ge 60\%$ word vocabulary match).
3. **Draft Initialization**: Writes draft entry to database with status: `generating`.
4. **Non-Blocking Trigger (`after()`)**: Next.js uses stable `after()` to trigger the Render Python Agent in the background, immediately responding with `220 Accepted` to the worker cron, avoiding execution timeouts.

---

### Flow B: Webhook Callback Processing

1. **Callback Payload**: Render agent completes compilation and sends POST webhook with bilingual results (`titleAr`, `articleAr`, `descriptionAr`).
2. **Zod Validation**: Validates payload schema, supporting both flat and bilingual structures.
3. **Bilingual Parsing & Fallbacks**: Resolves translations directly from the agent. If translations are missing, it falls back to Edge-native translation (`translateMarkdown`) to ensure continuity.
4. **Atomic Update**: Performs an idempotent update check to guarantee updates only apply if the draft's current status is `'generating'`, shielding user-made edits from late retries.

---

### Flow C: Admin Editing & Publication

1. **Manual Edit**: Admin reviews and edits both English and Arabic content of drafts bilingually from the `/admin/review` panel (supporting Write, Preview, and Split Screen render views).
2. **Save Draft**: Saves bilingual manual edits back to the drafts table.
3. **Publish (Zero-Latency)**: Publishes the draft by moving pre-translated content directly to live articles, completely bypassing slow publish-time translation APIs and avoiding 504 Edge Gateway timeouts.
4: **Dynamic Polling**: Dashboard checks database status at a 2-minute interval with tab-visibility and 5-minute idle tracking, or executes immediate fetches via the header **Refresh** button.

---

## 📂 4. Layered Directory Hierarchy

To keep execution scopes clean, the core project enforces distinct physical folder boundaries:

* **Domain Types ([lib/types/](file:///c:/Users/asish/Arabia%20Khaleej/lib/types))**: Houses domain definitions (`insight.ts`, `draft.ts`) so edge routes don't import database libraries.
* **Storage Repositories ([lib/database/repositories/](file:///c:/Users/asish/Arabia%20Khaleej/lib/database/repositories))**: Abstracted SQL/Redis adapters (`insightRepository.ts`, `draftRepository.ts`) conforming to repository interfaces.
* **Service Orchestration ([lib/services/](file:///c:/Users/asish/Arabia%20Khaleej/lib/services))**: Orchestrates validation filters, date sorting, category querying, and page-level facades (`insightService.ts`).
* **Facades ([lib/database/insights.ts](file:///c:/Users/asish/Arabia%20Khaleej/lib/database/insights.ts), [lib/database/draftsDb.ts](file:///c:/Users/asish/Arabia%20Khaleej/lib/database/draftsDb.ts))**: Act as entry points to retain backward compatibility with old Next.js App Router route paths.

---

© 2026 Arabia Khaleej. All rights reserved.
