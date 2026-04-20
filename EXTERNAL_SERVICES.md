# External Services Inventory: Arabia Khaleej

This document lists all external APIs, data sources, and assets used by the **Arabia Khaleej** platform to ensure transparency and monitor dependency stability.

## 1. Official News Aggregation (RSS Feeds)
The "Press Terminal" fetches real-time, verbatim news from the following official state agencies:

| Source | Country | Format | Reliability |
| :--- | :--- | :--- | :--- |
| **QNA** | Qatar | RSS (XML) | High |
| **WAM** | UAE | RSS (XML) | High |
| **SPA** | Saudi Arabia | RSS (XML) | High |
| **BNA** | Bahrain | RSS (XML) | Medium (Schema dependent) |
| **ONA** | Oman | RSS (XML) | Medium (Schema dependent) |

## 2. Community & Expat News Feeds
To serve the expat population, the unified terminal integrates the following international sources:

| Source | Territory | Content | Language(s) |
| :--- | :--- | :--- | :--- |
| **ANI / Amar Ujala** | India | National | English, Hindi |
| **APP / BBC Urdu** | Pakistan | National | English, Urdu |
| **BSS / Prothom Alo** | Bangladesh | National | English, Bengali |
| **PNA / ABS-CBN** | Philippines | National | English, Filipino |

## 3. Financial & Market Data
| Service | Data Type | Refresh Rate | API Provider |
| :--- | :--- | :--- | :--- |
| **Currency Rates** | FX Spot Prices | 30 Minutes | `open.er-api.com` |
| **Market Indices** | GCC Stock Markets | Real-time (Sim) | Internal Algorithm (Sahmk Reference) |
| **Commodities** | Gold & Brent Crude | Real-time (Sim) | Internal Algorithm |

## 4. Assets & Media
| Service | Usage | License | Integration Method |
| :--- | :--- | :--- | :--- |
| **Unsplash** | Smart Article Images | Free / Open | Keyword-based Dynamic Link |
| **Google Fonts** | Typography (Inter, Noto) | SIL Open Font | Next.js Local Ingestion |
| **Lucide React** | UI Iconography | ISC | NPM Library |

## 5. Security & Legal Compliance
- **Transient Fetching**: No personal data or news articles are stored permanently in a database.
- **Offshore Hosting**: The site operates as an international reference dashboard to minimize local GCC regulatory friction.

---
*Last Updated: April 20, 2026*
