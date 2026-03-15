import type { Metadata } from "next";
import { safeJsonLd } from "@/lib/utils";

const SITE_URL = "https://qatar-portal.vercel.app";

export const metadata: Metadata = {
  title: "Cost of Living in Doha, Qatar 2025 — Expat Guide",
  description:
    "Complete cost of living guide for Doha, Qatar in 2025. Housing, food, transport, utilities, and schooling costs for expats and new arrivals.",
  keywords: ["cost of living Doha", "cost of living Qatar 2025", "Doha rent prices", "expat life Qatar", "Qatar living expenses"],
  alternates: { canonical: `${SITE_URL}/cost-of-living-doha` },
  openGraph: {
    title: "Cost of Living in Doha, Qatar 2025",
    description: "Housing, food, transport, and utilities costs for expats living in Doha, Qatar.",
    url: `${SITE_URL}/cost-of-living-doha`,
    siteName: "Qatar Portal",
    type: "website",
    images: [{ url: `${SITE_URL}/opengraph-image`, width: 1200, height: 630 }],
  },
  twitter: { card: "summary_large_image", title: "Cost of Living in Doha, Qatar 2025", description: "Housing, food, transport, and utilities costs for expats living in Doha, Qatar." },
};

export default function CostOfLivingDohaPage() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: [
      {
        "@type": "Question",
        name: "Is Qatar expensive to live in?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Qatar is moderately expensive. Housing is the biggest cost — a 1-bedroom apartment in Doha costs QAR 4,000–8,000/month. However, there is no income tax, which significantly increases take-home pay for expats.",
        },
      },
      {
        "@type": "Question",
        name: "How much does it cost to rent in Doha?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "A 1-bedroom apartment in central Doha costs QAR 5,000–8,000/month. A 3-bedroom costs QAR 9,000–15,000/month. Areas like Al Wakra and Lusail offer more affordable options.",
        },
      },
      {
        "@type": "Question",
        name: "Is food expensive in Qatar?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Food costs vary. A meal at a local restaurant costs QAR 15–30. Groceries at Carrefour or LuLu Hypermarket cost QAR 600–1,200/month for a family. Many expats cook at home to save.",
        },
      },
      {
        "@type": "Question",
        name: "Do expats pay tax in Qatar?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "No. Qatar has zero personal income tax. There is also no VAT on most goods, though a 5% VAT applies to some items. This makes Qatar financially attractive for expats compared to Western countries.",
        },
      },
    ],
  };

  return (
    <div className="max-w-2xl mx-auto space-y-10">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: safeJsonLd(jsonLd) }} />

      <div>
        <h1 className="text-3xl font-bold text-gray-900 mb-3">Cost of Living in Doha, Qatar 2025</h1>
        <p className="text-gray-600 text-base leading-relaxed">
          A practical breakdown of monthly expenses for expats and new arrivals in Doha. All prices in Qatari Riyal (QAR). 1 USD ≈ 3.64 QAR.
        </p>
      </div>

      {/* Summary table */}
      <section className="bg-amber-50 border border-amber-100 rounded-2xl p-6">
        <h2 className="text-lg font-bold text-amber-900 mb-4">Monthly Cost Summary</h2>
        <div className="rounded-xl border border-amber-200 overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-amber-100 text-gray-700">
                <th className="px-4 py-2 text-left font-semibold">Category</th>
                <th className="px-4 py-2 text-left font-semibold">Single</th>
                <th className="px-4 py-2 text-left font-semibold">Family (4)</th>
              </tr>
            </thead>
            <tbody>
              {[
                ["Housing", "QAR 4,000–7,000", "QAR 8,000–15,000"],
                ["Food & groceries", "QAR 600–1,000", "QAR 1,500–2,500"],
                ["Transport", "QAR 300–800", "QAR 800–1,500"],
                ["Utilities", "QAR 200–400", "QAR 500–1,000"],
                ["Entertainment", "QAR 300–600", "QAR 600–1,200"],
                ["**Total estimate**", "**QAR 5,400–9,800**", "**QAR 11,400–21,200**"],
              ].map(([cat, single, family], i) => (
                <tr key={cat} className={`border-t border-amber-100 ${i % 2 === 0 ? "bg-white" : "bg-amber-50"}`}>
                  <td className="px-4 py-2 font-medium text-gray-800">{cat.replace(/\*\*/g, "")}</td>
                  <td className="px-4 py-2 text-gray-600">{single.replace(/\*\*/g, "")}</td>
                  <td className="px-4 py-2 text-gray-600">{family.replace(/\*\*/g, "")}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* Housing */}
      <section>
        <h2 className="text-xl font-bold text-gray-900 mb-4">🏠 Housing</h2>
        <div className="space-y-3 text-sm text-gray-700">
          {[
            { area: "The Pearl / West Bay", price: "QAR 7,000–15,000/mo", note: "Premium, near business district" },
            { area: "Al Sadd / Najma", price: "QAR 4,000–7,000/mo", note: "Central, popular with expats" },
            { area: "Lusail", price: "QAR 5,000–10,000/mo", note: "New city, modern apartments" },
            { area: "Al Wakra / Al Wukair", price: "QAR 3,000–6,000/mo", note: "Affordable, south of Doha" },
          ].map((h) => (
            <div key={h.area} className="bg-stone-50 border border-stone-200 rounded-xl p-4 flex justify-between items-start">
              <div>
                <p className="font-semibold text-gray-900">{h.area}</p>
                <p className="text-gray-500">{h.note}</p>
              </div>
              <p className="font-bold text-rose-900 text-right whitespace-nowrap ml-4">{h.price}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Food */}
      <section>
        <h2 className="text-xl font-bold text-gray-900 mb-4">🍽️ Food & Groceries</h2>
        <div className="rounded-xl border border-stone-200 overflow-x-auto">
          <table className="w-full text-sm">
            <tbody>
              {[
                ["Local restaurant meal", "QAR 15–30"],
                ["Fast food combo (McDonald's/KFC)", "QAR 25–40"],
                ["Mid-range restaurant (2 people)", "QAR 80–150"],
                ["Monthly groceries (1 person)", "QAR 600–1,000"],
                ["1L milk", "QAR 6–8"],
                ["1kg chicken breast", "QAR 18–25"],
                ["1kg rice (basmati)", "QAR 5–10"],
              ].map(([item, price], i) => (
                <tr key={item} className={`border-t border-stone-100 ${i % 2 === 0 ? "bg-white" : "bg-stone-50"}`}>
                  <td className="px-4 py-2.5 text-gray-800">{item}</td>
                  <td className="px-4 py-2.5 font-medium text-gray-700">{price}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* Transport */}
      <section>
        <h2 className="text-xl font-bold text-gray-900 mb-4">🚗 Transport</h2>
        <div className="space-y-2 text-sm text-gray-700">
          <p><strong>Fuel:</strong> QAR 1.85/litre (petrol is very cheap in Qatar)</p>
          <p><strong>Taxi (Karwa):</strong> QAR 4 flag fall + QAR 1.6/km</p>
          <p><strong>Metro (Doha Metro):</strong> QAR 2–6 per trip, monthly pass QAR 100</p>
          <p><strong>Car rental:</strong> QAR 1,200–2,500/month</p>
          <p><strong>Car purchase:</strong> Toyota Camry ~QAR 85,000 new</p>
        </div>
      </section>

      {/* Utilities */}
      <section>
        <h2 className="text-xl font-bold text-gray-900 mb-4">💡 Utilities</h2>
        <p className="text-sm text-gray-700 mb-2">
          Electricity and water are subsidised for residents. Average monthly bill for a 1-bedroom: <strong>QAR 150–400</strong>.
        </p>
        <p className="text-sm text-gray-700">
          Internet: <strong>QAR 200–350/month</strong> for fibre broadband (Ooredoo or Vodafone Qatar). Mobile plans start at QAR 60/month.
        </p>
      </section>

      {/* FAQ */}
      <section>
        <h2 className="text-xl font-bold text-gray-900 mb-4">Frequently Asked Questions</h2>
        <div className="space-y-3">
          {[
            { q: "Is there income tax in Qatar?", a: "No. Qatar has zero personal income tax, making it financially attractive for expats." },
            { q: "Is alcohol available in Qatar?", a: "Alcohol is available only at licensed hotel bars and the Qatar Distribution Company (QDC) store for non-Muslim residents with a permit." },
            { q: "How does Qatar compare to Dubai for cost of living?", a: "Qatar and Dubai are similar in cost. Qatar is slightly cheaper for housing, while Dubai offers more entertainment options. Both have no income tax." },
          ].map(({ q, a }) => (
            <details key={q} className="bg-stone-50 border border-stone-200 rounded-xl p-4 cursor-pointer">
              <summary className="font-semibold text-gray-900 text-sm">{q}</summary>
              <p className="text-sm text-gray-600 mt-2">{a}</p>
            </details>
          ))}
        </div>
      </section>

      {/* Internal links */}
      <section className="bg-rose-50 border border-rose-100 rounded-2xl p-6 text-sm">
        <p className="font-semibold text-rose-900 mb-2">Useful resources</p>
        <div className="flex flex-wrap gap-3">
          <a href="/jobs" className="text-rose-700 hover:underline">→ Jobs in Qatar</a>
          <a href="/currency" className="text-rose-700 hover:underline">→ QAR Exchange Rates</a>
          <a href="/qatar-visa-requirements" className="text-rose-700 hover:underline">→ Qatar Visa Requirements</a>
        </div>
      </section>
    </div>
  );
}
