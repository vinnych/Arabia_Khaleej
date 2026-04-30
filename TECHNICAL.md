# Technical Infrastructure & SEO Architecture: Arabia Khaleej

This document details the external services, data architecture, and SEO strategy for the Arabia Khaleej platform.

---

## 🛠️ External Services Inventory

### 1. Official News Aggregation (RSS Feeds)
The "Press Terminal" fetches real-time news from official state agencies (QNA, WAM, SPA, BNA, ONA). This serves as a secondary utility layer to our primary original insights.

### 2. Premium Insights Content
Deep editorial content (1000+ words) is generated using the Groq API (`llama-3.3-70b-versatile`) and refined by human-in-the-loop logic to ensure authoritative regional analysis.

### 2. Financial & Market Data
| Service | Data Type | Refresh Rate | API Provider |
| :--- | :--- | :--- | :--- |
| **Currency Rates** | FX Spot Prices | 30 Minutes | `open.er-api.com` |
| **Market Indices** | GCC Stock Markets | Real-time (Sim) | Internal Algorithm |
| **Commodities** | Gold & Brent Crude | Real-time (Sim) | Internal Algorithm |

### 3. Infrastructure & Caching
| Service | Purpose | Provider | Retention |
| :--- | :--- | :--- | :--- |
| **Redis** | News Archiving & SEO | Upstash / Local | 30 Days |
| **Vercel Edge** | Deployment & Edge Middleware | Vercel | N/A |

### 4. Assets & Media
| Service | Usage | License | Integration Method |
| :--- | :--- | :--- | :--- |
| **Custom AI Generation** | Premium Article Visuals | Proprietary | Local File Hosting (`/public/images/insights/`) |
| **Typography** | Apple System Stack | OS Native | -apple-system, SF Pro Display |
| **Lucide React** | UI Iconography | ISC | NPM Library |
| **React Markdown** | Long-form Rendering | MIT | NPM Library |

---

## 🚀 SEO Ambition & Strategy

> *"Arabia Khaleej is an authoritative digital reference. Every insight must be a machine-readable, indexable, and trustworthy fact."*

### Philosophy
Arabia Khaleej is a **structured knowledge graph** and premium editorial hub for the GCC region. Every article and data point is expressed as a formal Schema.org entity.

### Key Ambitions
1. **Premium Brand Authority**: Achieve high-tier rankings for "GCC Insights" and "Regional Analysis."
2. **Knowledge Panel Domination**: Achieve Google Knowledge Panel eligibility as an Organization and for regional data.
3. **Rich Snippet Coverage**: Targeted snippets for Editorial Insights, Prayer Times, Market Data, and Economic Outlooks.
4. **Bilingual Indexing Parity**: Full support for English and Arabic (`ar-SA`, `ar-AE`, etc.) with `hreflang` alternates.
5. **AI Crawler Accessibility**: Explicitly allowing GPTBot, Claude-Web, and others to ensure visibility in AI answers.

---

## ✅ SEO Health Checklist

- [x] `sitemap.xml` — dynamic route, optimized for premium items.
- [x] `robots.txt` — allows AI crawlers, blocks internal paths.
- [x] Canonical URLs and `hreflang` implementation.
- [x] Unique `<title>` and `<meta description>` per page.
- [x] OpenGraph images (1200×630) and Twitter cards.
- [x] Original long-form content — 1000+ word dedicated posts.
- [x] Local image hosting for premium assets (SEO performance).

---
*Last Updated: April 30, 2026*
