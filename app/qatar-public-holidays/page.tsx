import { pageMeta, SITE_URL } from "@/lib/seo";
import { safeJsonLd } from "@/lib/utils";

export const metadata = pageMeta({
  title: "Qatar Public Holidays 2026 — Official Government & Islamic Holidays",
  description: "Complete list of Qatar public holidays for 2026 including National Day, Sports Day, Eid Al-Fitr, Eid Al-Adha, and all official government holidays.",
  path: "/qatar-public-holidays",
  keywords: ["Qatar public holidays 2026", "Qatar national day", "Eid holidays Qatar", "Qatar Sports Day", "Qatar government holidays", "Qatar holiday calendar"],
  ogTitle: "Qatar Public Holidays 2026",
  ogDescription: "Official Qatar public holidays 2026: National Day, Sports Day, Eid Al-Fitr, Eid Al-Adha, and all government holidays.",
});

const HOLIDAYS_2026 = [
  { date: "1 Jan 2026", name: "New Year's Day", type: "International" },
  { date: "10 Feb 2026", name: "Qatar National Sports Day", type: "Sports" },
  { date: "20 Mar 2026 (approx)", name: "Eid Al-Fitr (End of Ramadan)", type: "Islamic" },
  { date: "21–23 Mar 2026", name: "Eid Al-Fitr Holiday", type: "Islamic" },
  { date: "27 May 2026 (approx)", name: "Eid Al-Adha", type: "Islamic" },
  { date: "28–30 May 2026", name: "Eid Al-Adha Holiday", type: "Islamic" },
  { date: "16 Jun 2026 (approx)", name: "Islamic New Year (Hijri New Year)", type: "Islamic" },
  { date: "25 Aug 2026 (approx)", name: "Prophet Muhammad's Birthday (Mawlid)", type: "Islamic" },
  { date: "18 Dec 2026", name: "Qatar National Day", type: "National" },
];

export default function QatarPublicHolidaysPage() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: [
      {
        "@type": "Question",
        name: "How many public holidays does Qatar have in 2026?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Qatar has approximately 9–10 public holidays in 2026, including New Year's Day, National Sports Day (10 Feb), Eid Al-Fitr (3 days), Eid Al-Adha (3 days), Islamic New Year, Prophet's Birthday, and National Day on December 18.",
        },
      },
      {
        "@type": "Question",
        name: "When is Qatar National Day?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Qatar National Day is on December 18 every year. It commemorates the unification of Qatar under Sheikh Jassim bin Mohammed Al Thani in 1878. It is marked with parades, fireworks, and cultural events.",
        },
      },
      {
        "@type": "Question",
        name: "When is Eid Al-Fitr 2026 in Qatar?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Eid Al-Fitr 2026 in Qatar is expected around March 20, 2026, marking the end of Ramadan. The exact date depends on the moon sighting. The official holiday lasts 3 days.",
        },
      },
      {
        "@type": "Question",
        name: "When is Qatar National Sports Day 2026?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Qatar National Sports Day 2026 is on Tuesday, 10 February 2026. It falls on the second Tuesday of February each year. It is a public holiday that promotes physical activity and a healthy lifestyle across Qatar.",
        },
      },
      {
        "@type": "Question",
        name: "Do private sector employees get public holidays in Qatar?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Yes. Under Qatar Labour Law, all employees (public and private sector) are entitled to paid public holidays. If a holiday falls on a rest day, the employee is entitled to compensation.",
        },
      },
    ],
  };

  return (
    <div className="page-sections">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: safeJsonLd(jsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: safeJsonLd({ "@context": "https://schema.org", "@type": "BreadcrumbList", itemListElement: [{ "@type": "ListItem", position: 1, name: "Home", item: "https://qatar-portal.vercel.app" }, { "@type": "ListItem", position: 2, name: "Qatar Public Holidays 2026", item: "https://qatar-portal.vercel.app/qatar-public-holidays" }] }) }} />

      <div>
        <h1 className="font-newsreader text-3xl font-bold text-on-surface mb-3">Qatar Public Holidays 2026</h1>
        <p className="text-gray-600 text-base leading-relaxed">
          Official government and Islamic holidays in Qatar for 2025. Islamic holiday dates are approximate — confirmed by moon sighting.
        </p>
      </div>

      {/* Holiday table */}
      <section>
        <h2 className="text-xl font-bold text-gray-900 mb-4">📅 2026 Holiday Calendar</h2>
        <div className="rounded-xl border border-stone-200 overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-stone-100 text-gray-700">
                <th className="px-4 py-3 text-left font-semibold">Date</th>
                <th className="px-4 py-3 text-left font-semibold">Holiday</th>
                <th className="px-4 py-3 text-left font-semibold">Type</th>
              </tr>
            </thead>
            <tbody>
              {HOLIDAYS_2026.map((h, i) => (
                <tr key={h.name} className={`border-t border-stone-100 ${i % 2 === 0 ? "bg-white" : "bg-stone-50"}`}>
                  <td className="px-4 py-2.5 text-gray-600 whitespace-nowrap">{h.date}</td>
                  <td className="px-4 py-2.5 font-medium text-gray-900">{h.name}</td>
                  <td className="px-4 py-2.5">
                    <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                      h.type === "Islamic" ? "bg-emerald-100 text-emerald-800" :
                      h.type === "National" ? "bg-rose-100 text-rose-800" :
                      h.type === "Sports" ? "bg-amber-100 text-amber-800" :
                      "bg-sky-100 text-sky-800"
                    }`}>
                      {h.type}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="text-xs text-gray-400 mt-2">* Islamic holiday dates subject to official moon sighting announcement.</p>
      </section>

      {/* National Day */}
      <section className="bg-rose-50 border border-rose-100 rounded-2xl p-6">
        <h2 className="text-lg font-bold text-rose-900 mb-2">🇶🇦 Qatar National Day — 18 December</h2>
        <p className="text-sm text-gray-700 leading-relaxed">
          Qatar National Day commemorates the unification of the country under Sheikh Jassim bin Mohammed Al Thani on December 18, 1878.
          Celebrated with military parades, fireworks over Doha Corniche, traditional performances, and cultural events across the country.
        </p>
      </section>

      {/* Ramadan note */}
      <section>
        <h2 className="text-xl font-bold text-gray-900 mb-3">🌙 Ramadan 2025</h2>
        <p className="text-sm text-gray-700 mb-2">
          Ramadan 2026 is expected to begin around <strong>18 February 2026</strong> and end around <strong>19 March 2026</strong> (subject to moon sighting).
        </p>
        <p className="text-sm text-gray-700">
          During Ramadan, working hours are reduced by 2 hours per day for all employees. Public eating, drinking, and smoking during daylight hours is prohibited in public spaces.
        </p>
        <a href="/prayer" className="inline-block mt-3 text-sm text-rose-700 hover:underline">→ Check prayer times during Ramadan</a>
      </section>

      {/* FAQ */}
      <section>
        <h2 className="text-xl font-bold text-gray-900 mb-4">Frequently Asked Questions</h2>
        <div className="space-y-3">
          {[
            { q: "When is Qatar Sports Day 2026?", a: "Qatar National Sports Day 2026 falls on Tuesday, 10 February 2026. It is observed on the second Tuesday of February every year and is a public holiday for all employees." },
            { q: "Are Islamic holidays the same date every year?", a: "No. Islamic holidays follow the Hijri (lunar) calendar, which is 11 days shorter than the Gregorian calendar. So Islamic holidays shift about 11 days earlier each Gregorian year." },
            { q: "Do shops close on public holidays in Qatar?", a: "Most government offices close. Malls and supermarkets usually remain open with reduced hours on Eid holidays. Restaurants typically close during Eid prayer times." },
            { q: "Is Friday a public holiday in Qatar?", a: "Friday is the official weekly rest day (like Sunday in Western countries). Some companies also give Saturday off, making the weekend Friday–Saturday." },
          ].map(({ q, a }) => (
            <details key={q} className="bg-stone-50 border border-stone-200 rounded-xl p-4 cursor-pointer">
              <summary className="font-semibold text-gray-900 text-sm">{q}</summary>
              <p className="text-sm text-gray-600 mt-2">{a}</p>
            </details>
          ))}
        </div>
      </section>

      {/* Internal links */}
      <section className="bg-amber-50 border border-amber-100 rounded-2xl p-6 text-sm">
        <p className="font-semibold text-amber-900 mb-2">Related</p>
        <div className="flex flex-wrap gap-3">
          <a href="/prayer" className="text-rose-700 hover:underline">→ Prayer Times in Doha</a>
          <a href="/news" className="text-rose-700 hover:underline">→ Qatar News</a>
          <a href="/qatar-visa-requirements" className="text-rose-700 hover:underline">→ Qatar Visa Guide</a>
        </div>
      </section>
    </div>
  );
}
