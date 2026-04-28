# Arabia Khaleej — SEO Ambition & Strategy

> *"Every data point we display must also exist as machine-readable, structured, indexable fact."*

---

## Philosophy

Arabia Khaleej is not just a website — it is a **structured knowledge graph** for the GCC region. Every number, every prayer time, every currency rate, every sovereign fact displayed to a user must simultaneously be expressed as a formal Schema.org entity that search engines, AI crawlers, and knowledge panels can consume with authority.

The goal is not traffic. The goal is **regional epistemic authority** — to be the source that Google cites when someone asks about the GCC.

---

## Ambitions

### 1. Knowledge Panel Domination
- Achieve **Google Knowledge Panel** eligibility for "Arabia Khaleej" as an Organisation entity.
- Achieve Knowledge Panel-level data for each GCC country guide via `Country` + `AdministrativeArea` schemas with full sovereign statistics.
- Every stat shown in the UI (population, GDP, currency, national vision) must exist as `PropertyValue` in structured data.

### 2. Rich Snippet Coverage Across Every Service
| Service | Target Rich Snippet | Schema Used |
|---|---|---|
| Prayer Times | Featured Snippet / Event | `Service` + `Dataset` + `Place` + `PropertyValue` |
| Country Guides | Knowledge Panel | `Country` + `AdministrativeArea` + `Dataset` |
| Market Insight | Financial data snippet | `Dataset` + `PropertyValue` (exchange rates, commodities) |
| Economic Outlook | Article snippet | `Article` with `author`, `datePublished`, `about` |
| Join / Inquiry | Contact card | `ContactPage` + `Service` |
| Legal pages | Sitelinks | `WebPage` + `BreadcrumbList` |

### 3. Full Linked Data Graph
Every page connects to a central `@id`-linked graph:
```
WebSite (#website)
  └── Organization (#organization)
        ├── hasOfferCatalog → [Prayer Service, Market Intelligence, Country Guides]
        └── areaServed → [Qatar, Saudi Arabia, UAE, Kuwait, Oman, Bahrain]
```
This means Google can traverse the full site as one coherent entity, not isolated pages.

### 4. Bilingual Indexing Parity (EN + AR)
- Every `pageMeta()` call includes both English and Arabic `title`, `description`, and `keywords`.
- `hreflang` alternates set for all 6 GCC Arabic locales: `ar-SA`, `ar-AE`, `ar-QA`, `ar-KW`, `ar-OM`, `ar-BH`.
- Structured data uses `alternateName` for Arabic entity names throughout.
- Google should index the site as authoritative for **both** Arabic and English GCC queries.

### 5. Geo-Authority Signals
Every page emits:
- `geo.region` meta tag (ISO 3166-2 format, city-level on sub-pages)
- `geo.placename` meta tag
- `geo.position` + `ICBM` coordinates
- Dublin Core metadata (`DC.title`, `DC.description`, `DC.date.issued`)
- `GeoCoordinates` in Place/Country schemas

### 6. AI Crawler Accessibility
- `robots.ts` explicitly **allows** GPTBot, Claude-Web, CCBot, PerplexityBot to index all content.
- This ensures Arabia Khaleej appears as a source in AI-generated answers about the GCC.
- `google: notranslate` prevents Google from mangling bilingual content.

### 7. Sitemap Precision
- All routes segmented by `priority` and `changeFrequency`:
  - `/prayer/*` — `daily`, priority `0.7–0.9` (content changes every day)
  - `/market-insight/*` — `daily`, priority `0.7–0.9`
  - `/countries/*` — `weekly`, priority `0.8`
  - Legal pages — `monthly`, priority `0.3`
- Ensures Google's crawl budget is spent on the highest-value, freshest pages first.

---

## Schema.org Entities In Use

| Schema Type | Where Used | Purpose |
|---|---|---|
| `Organization` | Global (layout) | Brand identity + GSC ownership |
| `WebSite` | Global (layout) | Site-level entity with publisher link |
| `WebPage` | Every page | Linked-data graph node per URL |
| `BreadcrumbList` | Every page | Navigation hierarchy for sitelinks |
| `Country` | Country guides | Full sovereign data — capital, GDP, population, currency, vision |
| `Place` | Prayer sub-pages | City-level geographic authority |
| `Service` | Prayer, Join | Service-type entity with `areaServed` + `availableLanguage` |
| `Dataset` | Prayer, Market, Countries | Machine-readable structured data disclosure |
| `Article` | Market Outlook | Editorial credibility with `author`, `datePublished` |
| `ContactPage` | Join / Inquiry | GSC contact type recognition |
| `FAQPage` | Country guides (planned) | Q&A featured snippet eligibility |
| `PropertyValue` | All data-rich pages | Embedding every statistic as a typed fact |

---

## Execution Rules

1. **If it's displayed, it's schema'd.** Any number, label, or fact visible to the user must exist as a `PropertyValue` or named entity in JSON-LD.
2. **No orphaned pages.** Every page has `WebPage` schema linking back to `#website` and `#organization`.
3. **No duplicate schemas.** Breadcrumbs are emitted once from the server component, not re-emitted from the client.
4. **No broken SearchAction.** A `potentialAction: SearchAction` is only declared if a `/search` route exists.
5. **Canonical first.** Every page has a canonical URL. hreflang alternates use the canonical as `x-default`.

---

## GSC Health Checklist

- [x] `sitemap.xml` — dynamic route, optimized with latest 500 news items (to prevent crawl budget throttling)
- [x] `robots.txt` — allows AI crawlers, blocks internal paths
- [x] Canonical URLs on all pages
- [x] No duplicate `<title>` or `<meta description>` across pages
- [x] `google61758f95d085e67d.html` — site ownership verified
- [x] OpenGraph images — 1200×630 on all pages
- [x] Twitter cards — `summary_large_image` on all pages
- [x] Favicon — `/favicon-emblem.png` (512×512)
- [x] `apple-mobile-web-app-title` — set globally
- [x] Dublin Core metadata — set globally
- [x] Google Search Console sitemap submitted
- [ ] GSC URL Inspection for key pages *(manual step)*

---

*Last updated: April 2026 | Maintained by Arabia Khaleej Development*
