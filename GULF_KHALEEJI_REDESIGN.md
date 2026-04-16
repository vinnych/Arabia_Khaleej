# Arabia Khaleej — Complete Redesign Plan
> Rebranding Qatar Insider → Arabia Khaleej · خليج

---

## Vision

A unified GCC digital concierge serving expats, residents, and visitors across all 6 Gulf Cooperation Council countries. The only destination that covers prayer times, visa guides, labour law, cost of living, and public services for the entire Gulf region — in English, with Arabic cultural authenticity.

**The gap we fill:** Most Gulf portals are either too local (Qatar-only, Dubai-only) or too generic (travel blogs). Arabia Khaleej is the first premium, structured, bilingual concierge for the entire GCC.

---

## Brand Identity

### Name
```
Arabia Khaleej  ·  خليجي
```
- **Gulf** → English speakers instantly know the region and language
- **Khaleeji** (خليجي) → Arab speakers feel cultural ownership — it is their identity word
- The Arabic subtitle in the logo does the heavy lifting — Arabs see their script, English speakers see a premium international brand

### Logo Mark
```
Arabia Khaleej  ·  خليجي
```
- "Arabia Khaleej" in DM Serif Display (serif italic — existing font)
- "·  خليجي" in Noto Sans Arabic, smaller weight, inline
- One brand, two scripts, one glance

### Colour Palette
| Token | Hex | Usage |
|---|---|---|
| `primary` | `#8A1538` | Qatar Maroon — main brand colour, warm Gulf sunset |
| `accent` | `#C9A84C` | Desert Gold — neutral across all 6 GCC flags |
| `surface` | `#faf9f6` | Off-white background |
| `slate-950` | `#020617` | Dark mode background |

**Rationale:** Maroon and gold appear across GCC flags (Qatar, Saudi, Bahrain, Kuwait). Keeping Maroon as primary preserves existing brand equity while Desert Gold expands the palette to feel pan-GCC rather than Qatar-specific.

---

## Target Audience

| Segment | Need |
|---|---|
| Expats relocating to GCC | Visa guides, labour law, cost of living |
| Muslim residents | Daily prayer times, Hijri calendar |
| Visitors | Visa requirements, emergency numbers, metro/transport |
| Professionals | Salary benchmarks, work permits |
| Arabic speakers | Native-language navigation, culturally authentic content |

**Primary language:** English (content written in English)  
**Arabic presence:** Navigation labels, UI text, cultural signals — enough for Arab users to feel ownership without requiring the operator to write Arabic content

---

## URL Architecture

### Structure: Country Prefix
```
/qa/prayer                  → Qatar prayer times
/qa/labour-law              → Qatar labour law
/qa/cost-of-living          → Qatar cost of living
/ae/prayer                  → UAE prayer times
/ae/labour-law              → UAE labour law
/ae/cost-of-living          → UAE cost of living
/sa/prayer                  → Saudi Arabia prayer times
/currency                   → GCC-wide (all 6 currencies, no prefix)
/prayer                     → GCC prayer hub (city selector)
```

### Country Codes
| Code | Country |
|---|---|
| `qa` | Qatar 🇶🇦 |
| `ae` | United Arab Emirates 🇦🇪 |
| `sa` | Saudi Arabia 🇸🇦 |
| `kw` | Kuwait 🇰🇼 |
| `bh` | Bahrain 🇧🇭 |
| `om` | Oman 🇴🇲 |

### Migration Map (existing Qatar pages)
| Old URL | New URL |
|---|---|
| `/qatar-labour-law` | `/qa/labour-law` |
| `/qatar-visa-requirements` | `/qa/visa-requirements` |
| `/qatar-salary-guide` | `/qa/salary-guide` |
| `/qatar-public-holidays` | `/qa/public-holidays` |
| `/qatar-metro` | `/qa/metro` |
| `/cost-of-living-doha` | `/qa/cost-of-living` |
| `/work-in-qatar` | `/qa/work` |
| `/emergency-numbers-qatar` | `/qa/emergency-numbers` |
| `/qatar-services/*` | `/qa/services/*` |
| `/community-resources` | `/qa/community` |

**301 redirects** must be added for all old URLs to preserve SEO equity.

---

## Homepage Redesign

### Hero — Country Selector
```
┌─────────────────────────────────────────────┐
│                                             │
│   Arabia Khaleej  ·  خليجي                  │
│   Your GCC Concierge                        │
│                                             │
│   [🇶🇦 Qatar]  [🇦🇪 UAE]  [🇸🇦 Saudi]        │
│   [🇰🇼 Kuwait] [🇧🇭 Bahrain] [🇴🇲 Oman]      │
│                                             │
└─────────────────────────────────────────────┘
```
Clicking a country flag loads that country's bento grid — prayer times, guides, services — same layout, different data. Selected country is remembered in localStorage.

### Bento Grid (per country)
- Prayer Times card (live, city-specific)
- Weather card (city-specific)
- Currency card (GCC-wide, highlights selected country's currency)
- Quick links: Visa, Labour Law, Cost of Living, Emergency Numbers

---

## Content Strategy Per Country

### Qatar 🇶🇦 (already built — migrate to /qa/)
- [x] Prayer Times
- [x] Labour Law
- [x] Visa Requirements
- [x] Salary Guide
- [x] Public Holidays
- [x] Metro Guide
- [x] Cost of Living (Doha)
- [x] Work in Qatar
- [x] Emergency Numbers
- [x] Community Resources
- [x] Services: QID, Work Visa, Family Visa, Driving Licence

### UAE 🇦🇪 (Phase 2)
- [ ] Prayer Times (Dubai, Abu Dhabi, Sharjah)
- [ ] UAE Labour Law (Federal Decree-Law No. 33/2021)
- [ ] UAE Visa Requirements (Golden Visa, Tourist, Work)
- [ ] Salary Guide (Dubai benchmarks)
- [ ] Public Holidays
- [ ] Metro Guide (Dubai Metro — Red & Green lines)
- [ ] Cost of Living (Dubai)
- [ ] Work in UAE
- [ ] Emergency Numbers (999 police, 998 ambulance)
- [ ] Services: Emirates ID, UAE Work Permit

### Saudi Arabia 🇸🇦 (Phase 3)
- [ ] Prayer Times (Riyadh, Jeddah, Mecca, Medina)
- [ ] Saudi Labour Law
- [ ] Visa Requirements (eVisa, Hajj, Work)
- [ ] Salary Guide
- [ ] Public Holidays (National Day, Founding Day)
- [ ] Cost of Living (Riyadh)
- [ ] Work in Saudi Arabia
- [ ] Emergency Numbers

### Kuwait 🇰🇼 · Bahrain 🇧🇭 · Oman 🇴🇲 (Phase 4)
- [ ] Prayer Times
- [ ] Labour Law
- [ ] Visa Requirements
- [ ] Emergency Numbers
- [ ] Cost of Living

---

## Currency Tool — GCC Expansion

### Current: QAR base only
### New: All 6 GCC currencies

| Currency | Code | Peg |
|---|---|---|
| Qatari Riyal | QAR | Fixed 3.64/USD |
| UAE Dirham | AED | Fixed 3.67/USD |
| Saudi Riyal | SAR | Fixed 3.75/USD |
| Kuwaiti Dinar | KWD | Basket peg |
| Bahraini Dinar | BHD | Fixed 0.376/USD |
| Omani Rial | OMR | Fixed 0.385/USD |

---

## Navigation Redesign

### Desktop Nav
```
Arabia Khaleej · خليجي    [🇶🇦 Qatar ▾]    Tools ▾    Guides ▾    Services ▾    [New to GCC? →]
```
Country switcher becomes the first nav element — the whole site context shifts when you switch country.

### Mobile Bottom Nav
```
[Home]  [Prayer]  [Currency]  [Country]  [Guides]
```

---

## SEO / GEO / AEO Strategy

### Target keywords per country
- Qatar: already indexed — preserve with 301 redirects
- UAE: "Dubai prayer times", "UAE labour law 2026", "cost of living Dubai"
- Saudi: "Riyadh prayer times", "Saudi work visa", "Saudi salary guide"

### Hreflang
```html
<link rel="alternate" hreflang="en" href="https://gulfkhaleeji.com/qa/labour-law" />
<link rel="alternate" hreflang="ar" href="https://gulfkhaleeji.com/qa/labour-law" />
<link rel="alternate" hreflang="x-default" href="https://gulfkhaleeji.com" />
```

### JSON-LD — Organisation scope
```json
{
  "@type": "Organization",
  "name": "Arabia Khaleej",
  "areaServed": ["QA", "AE", "SA", "KW", "BH", "OM"]
}
```

---

## Launch Phases

### Phase 1 — Rebrand (Priority: Immediate)
**Goal:** Qatar Insider → Arabia Khaleej with zero content loss

- [ ] Update site name everywhere: layout.tsx, manifest.ts, seo.ts, all page metadata
- [ ] Update logo in HomeNav.tsx
- [ ] Add country selector UI to homepage hero
- [ ] Migrate Qatar URLs to `/qa/` prefix
- [ ] Add 301 redirects for all old Qatar URLs
- [ ] Update sitemap.ts
- [ ] Update JSON-LD Organisation schema
- [ ] Register domain: gulfkhaleeji.com

### Phase 2 — UAE Layer (Priority: High)
**Goal:** Launch UAE as second country, highest expat traffic after Qatar

- [ ] Create `/ae/` route group in Next.js
- [ ] Build UAE guide pages (labour law, visa, cost of living, etc.)
- [ ] Add Dubai/Abu Dhabi to prayer times
- [ ] Add AED to currency tool
- [ ] Update country selector on homepage
- [ ] UAE-specific sitemap entries
- [ ] UAE-specific JSON-LD geo tags (geo.region: AE-DU)

### Phase 3 — Saudi Arabia (Priority: High)
**Goal:** Largest GCC market by population

- [ ] Create `/sa/` route group
- [ ] Saudi guide pages
- [ ] Add Riyadh/Jeddah/Mecca to prayer times
- [ ] Add SAR to currency tool

### Phase 4 — Complete GCC
**Goal:** Full 6-country coverage

- [ ] Kuwait `/kw/`
- [ ] Bahrain `/bh/`
- [ ] Oman `/om/`
- [ ] GCC-wide homepage with all flags active

---

## Technical Stack (unchanged)

| Layer | Technology |
|---|---|
| Framework | Next.js 15 App Router |
| Styling | Tailwind CSS 3.4 |
| Icons | Material Symbols Outlined |
| Fonts | DM Serif Display (headings) + Inter (body) + Noto Sans Arabic |
| Deployment | Vercel Edge Network |
| Analytics | Vercel Speed Insights |

---

## Domain

**Confirmed:** `arabiakhaleej.com` ✅  
**Full URL:** `https://arabiakhaleej.com`

Current deployment: `qatar-insider.vercel.app` (stays live until domain pointed to Vercel)

### Domain setup on Vercel
1. Go to Vercel project → Settings → Domains
2. Add `arabiakhaleej.com`
3. Add DNS records at your registrar:
   - A record: `76.76.21.21`
   - CNAME `www` → `cname.vercel-dns.com`

---

## Design Principles (unchanged)

1. **Trustworthy** — DisclaimerBanner on all legal/regulatory content, always link to official .gov sources
2. **Discoverable** — Every page reachable within 2 clicks from homepage
3. **Utility at a glance** — Dense information, zero fluff, fast load
4. **Bilingual** — English primary, Arabic cultural signals throughout
5. **Independent** — No affiliation with any GCC government or ministry

---

*Document created: April 2026*  
*Status: Planning — awaiting Phase 1 kickoff*
