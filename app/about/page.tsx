import type { Metadata } from "next";
import { safeJsonLd } from "@/lib/utils";

const SITE_URL = "https://qatar-portal.vercel.app";

export const metadata: Metadata = {
  title: "About Qatar Portal — Free Daily Resource for Qatar",
  description:
    "Qatar Portal: free prayer times, live weather, Gulf news, QAR rates, and jobs for Qatar residents, expats, and visitors.",
  keywords: ["Qatar Portal", "about Qatar Portal", "Qatar expat resource", "Doha daily guide", "Qatar information site"],
  alternates: { canonical: `${SITE_URL}/about` },
  openGraph: {
    title: "About Qatar Portal",
    description: "Your free daily resource for Qatar: prayer times, weather, news, currency rates, and jobs.",
    url: `${SITE_URL}/about`,
    siteName: "Qatar Portal",
    type: "website",
    images: [{ url: `${SITE_URL}/opengraph-image`, width: 1200, height: 630 }],
  },
  twitter: { card: "summary_large_image", title: "About Qatar Portal", description: "Free daily resource for Qatar: prayer times, weather, news, currency rates, and jobs." },
};

export default function AboutPage() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    name: "About Qatar Portal",
    url: `${SITE_URL}/about`,
    description:
      "Qatar Portal is a free daily resource for residents, expats, and visitors in Qatar covering prayer times, weather, news, exchange rates, and jobs.",
    publisher: {
      "@type": "Organization",
      name: "Qatar Portal",
      url: SITE_URL,
    },
  };

  return (
    <div className="max-w-2xl mx-auto space-y-5">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: safeJsonLd(jsonLd) }}
      />

      {/* Header */}
      <div>
        <h1 className="text-xl font-bold text-gray-900 mb-1">About Qatar Portal</h1>
        <p className="text-xs text-gray-500">
          Qatar Portal is a free, ad-supported daily resource built for the people living in, working in, and visiting Qatar and the Gulf region.
        </p>
      </div>

      {/* Mission */}
      <section className="bg-rose-50 border border-rose-100 rounded-lg p-3">
        <h2 className="text-sm font-semibold text-rose-900 mb-2">Our Mission</h2>
        <p className="text-gray-700 text-sm leading-relaxed">
          We built Qatar Portal to provide one reliable place for the information Qatar residents need every day — prayer times, weather, news from trusted Gulf sources, live currency rates for the expat community, and local job listings. Everything is free, updated automatically, and works fast on any device.
        </p>
      </section>

      {/* What we offer */}
      <section>
        <h2 className="text-sm font-semibold text-gray-700 mb-2">What Qatar Portal Offers</h2>
        <div className="grid sm:grid-cols-2 gap-3">
          {[
            {
              icon: "🕌",
              title: "Prayer Times",
              desc: "Accurate daily prayer times for Doha and 40+ cities across the Gulf, Middle East, and Muslim world. Includes monthly calendar and Hijri date.",
            },
            {
              icon: "🌤️",
              title: "Doha Weather",
              desc: "Live current conditions and 7-day forecast for Doha, Qatar. Temperature, humidity, wind speed — updated every 30 minutes.",
            },
            {
              icon: "📰",
              title: "Qatar & Gulf News",
              desc: "Latest headlines from Al Jazeera, Google News Qatar, and BBC Middle East — aggregated and refreshed every 15 minutes.",
            },
            {
              icon: "💱",
              title: "QAR Exchange Rates",
              desc: "Live Qatari Riyal rates vs USD, EUR, GBP, INR, PKR, PHP, EGP, BDT and more. Essential for Qatar's large expat community.",
            },
            {
              icon: "💼",
              title: "Jobs in Qatar",
              desc: "Latest Qatar job listings and hiring news aggregated from Google News. Updated daily.",
            },
            {
              icon: "🌙",
              title: "Hijri Calendar",
              desc: "Hijri (Islamic) date shown alongside Gregorian dates on the prayer times page.",
            },
          ].map((item) => (
            <div key={item.title} className="bg-stone-50 border border-stone-200 rounded-xl p-4">
              <p className="text-xl mb-1">{item.icon}</p>
              <h3 className="text-xs font-semibold text-gray-900 mb-0.5">{item.title}</h3>
              <p className="text-xs text-gray-600">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Data sources */}
      <section>
        <h2 className="text-sm font-semibold text-gray-700 mb-2">Our Data Sources</h2>
        <p className="text-xs text-gray-500 mb-3">
          We use reputable, publicly available data sources. We do not manufacture or editorialize data.
        </p>
        <div className="rounded-lg border border-stone-200 overflow-x-auto">
          <table className="w-full text-sm min-w-[360px]">
            <thead>
              <tr className="bg-stone-100 text-gray-700">
                <th className="px-3 py-2 text-left font-semibold">Feature</th>
                <th className="px-3 py-2 text-left font-semibold">Source</th>
              </tr>
            </thead>
            <tbody>
              {[
                ["Prayer Times", "Aladhan API (aladhan.com) — Muslim World League method"],
                ["Weather", "Open-Meteo (open-meteo.com) — open-source weather API"],
                ["News", "Al Jazeera RSS, Google News Qatar, BBC Middle East RSS"],
                ["Exchange Rates", "ExchangeRate-API (open.er-api.com)"],
                ["Jobs", "Google News RSS — Qatar hiring/careers search"],
              ].map(([feature, source], i) => (
                <tr key={feature} className={`border-t border-stone-100 ${i % 2 === 0 ? "bg-white" : "bg-stone-50"}`}>
                  <td className="px-3 py-2 font-medium text-gray-800">{feature}</td>
                  <td className="px-3 py-2 text-gray-500">{source}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* Who we serve */}
      <section>
        <h2 className="text-sm font-semibold text-gray-700 mb-2">Who We Serve</h2>
        <p className="text-xs text-gray-600 leading-relaxed">
          Qatar has one of the world&apos;s largest expat populations — over 85% of residents are from outside Qatar. Qatar Portal serves this diverse community: South Asian workers (India, Pakistan, Bangladesh, Nepal, Philippines), Arab expats, Western professionals, and Qatari nationals who want fast access to daily essentials in one place.
        </p>
      </section>

      {/* Contact */}
      <section className="bg-stone-50 border border-stone-200 rounded-lg p-3">
        <h2 className="text-sm font-semibold text-gray-900 mb-2">Contact</h2>
        <p className="text-xs text-gray-600">
          For feedback, corrections, or inquiries, please reach out via the GitHub repository:{" "}
          <a
            href="https://github.com/vinnych/Qatar-portal"
            target="_blank"
            rel="noopener noreferrer"
            className="text-rose-700 hover:underline"
          >
            github.com/vinnych/Qatar-portal
          </a>
        </p>
      </section>
    </div>
  );
}
