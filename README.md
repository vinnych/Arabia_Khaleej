# Qatar Portal — Independent Digital Concierge

A high-performance, static-first utility hub for the State of Qatar. Focused on speed, privacy, and curated public data for residents and visitors.

**Live:** https://qatar-portal.vercel.app

---

## ⚖️ Legal Compliance

This is an **unofficial hobby project**. All operators and contributors must adhere to the:
👉 **[LEGAL_RULES.md](./LEGAL_RULES.md)**

---

## Features

- **Prayer Times** — Real-time Doha timings + monthly utility calendar via Aladhan API.
- **Utility Guides** — Step-by-step roadmaps for QID, Visas, Driving Licences, and Labour Law.
- **Market Insights** — Benchmarking data on salaries, cost of living, and public holidays.
- **Real-Time Data** — Live QAR exchange rates and Doha weather conditions (Open-Meteo).
- **Metro Nav** — Static guide to the Doha Metro network and operation.
- **Privacy First** — Cookie-less, anonymous architecture with zero PII collection.

---

## Stack

| Layer | Technology |
|---|---|
| Framework | Next.js 16 (App Router) |
| Language | TypeScript |
| Styling | Premium CSS (Neutral Design System) |
| Hosting | Vercel (Edge Runtime) |

---

## Project Structure

```
app/
├── page.tsx                    # Homepage (Utility Dashboard)
├── layout.tsx                  # Root layout — nav, footer, skip link
├── sitemap.ts                  # Dynamic sitemap (Guides & Tools)
├── not-found.tsx               # Custom 404 page
├── (guides)/                   # QID, Visa, and Law guides
├── (legal)/                    # Privacy & Terms
└── (tools)/                    # Weather, Prayer, Currency tools

components/
├── NavControls.tsx             # Theme & Language toggles (client)
├── HomeHero.tsx                # Branding & Clock hero
├── PrayerCard.tsx              # Live prayer visualization
└── visuals/                    # Modular UI components (Fees, Steps, etc.)

lib/
├── seo.ts                      # pageMeta() — automated SEO
├── weather.ts                  # Open-Meteo integration
└── currency.ts                 # Exchange rate logic
```

---

## Getting Started

### Prerequisites
- Node.js 18+

### Running Locally
```bash
npm install
npm run dev       # http://localhost:3000
npm run build     # production build
```

---

## Key Design Decisions

### Strategic Identity
The platform is branded as an **Independent Digital Concierge**. All features related to automated news aggregation or career listings have been decommissioned to ensure maximum legal transparency and focus on core utility guides.

### Pure Utility Focus
- **No Dynamic Feeds**: Automated jobs and news feeds have been eliminated.
- **Static Guides**: Information is served as verified, high-quality static utility guides.
- **Privacy Core**: No user accounts or data tracking. The portal remains a transient tool for public data access.

---

## License

All rights reserved © 2026. This project is for community utility and information purposes only.
