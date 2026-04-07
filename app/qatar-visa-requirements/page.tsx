import { pageMeta, SITE_URL } from "@/lib/seo";
import { safeJsonLd } from "@/lib/utils";

export const metadata = pageMeta({
  title: "Qatar Visa Requirements 2026 — Complete Guide",
  description: "Qatar visa requirements for 2026: visa-free countries, tourist visa, work visa, family visa, fees, and how to apply online via Hayya platform.",
  path: "/qatar-visa-requirements",
  keywords: ["Qatar visa requirements", "Qatar tourist visa 2026", "Qatar work visa", "Hayya visa Qatar", "Qatar visa on arrival"],
  ogTitle: "Qatar Visa Requirements 2026 — Complete Guide",
  ogDescription: "Everything you need to know about Qatar visas: tourist, work, family, fees, and how to apply.",
});

export default function QatarVisaRequirementsPage() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: [
      {
        "@type": "Question",
        name: "Which countries are visa-free for Qatar?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Citizens of GCC countries (Saudi Arabia, UAE, Kuwait, Bahrain, Oman) can enter Qatar without a visa. Additionally, over 100 nationalities including the US, UK, EU, Australia, Canada, and Japan receive a free visa on arrival valid for 30 days.",
        },
      },
      {
        "@type": "Question",
        name: "How do I apply for a Qatar tourist visa?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Apply online via the Hayya platform (hayya.qa) or through Qatar's e-visa portal. Upload your passport, photo, and travel itinerary. Processing takes 3–5 business days. The fee is QAR 100 (approx. $27 USD).",
        },
      },
      {
        "@type": "Question",
        name: "How long can I stay in Qatar on a tourist visa?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "A standard Qatar tourist visa allows a 30-day stay, extendable once for another 30 days. Visa-on-arrival grants 30 days which can be extended to 60 days total.",
        },
      },
      {
        "@type": "Question",
        name: "What is required for a Qatar work visa?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "A Qatar work visa requires a job offer from a Qatar-based employer. Your employer applies for a work permit through the Ministry of Labour. You then receive a visa to enter and obtain your Qatar ID (QID) within 30 days of arrival.",
        },
      },
    ],
  };

  return (
    <div className="page-sections">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: safeJsonLd(jsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: safeJsonLd({ "@context": "https://schema.org", "@type": "BreadcrumbList", itemListElement: [{ "@type": "ListItem", position: 1, name: "Home", item: "https://qatar-portal.vercel.app" }, { "@type": "ListItem", position: 2, name: "Qatar Visa Requirements", item: "https://qatar-portal.vercel.app/qatar-visa-requirements" }] }) }} />

      <div>
        <h1 className="font-newsreader text-2xl font-bold text-on-surface mb-2">Qatar Visa Requirements 2026</h1>
        <p className="text-gray-600 text-base leading-relaxed">
          A complete guide to entering Qatar — whether you&apos;re visiting, working, or joining family.
        </p>
      </div>

      {/* Visa-free */}
      <section className="bg-emerald-50 border border-emerald-100 rounded-xl p-4">
        <h2 className="text-lg font-bold text-emerald-900 mb-3">✅ Visa-Free Entry</h2>
        <p className="text-sm text-gray-700 mb-3">
          Citizens of <strong>GCC countries</strong> (Saudi Arabia, UAE, Kuwait, Bahrain, Oman) can enter Qatar without any visa.
        </p>
        <p className="text-sm text-gray-700">
          Over <strong>100+ nationalities</strong> receive a <strong>free visa on arrival</strong> (30 days), including:
          USA, UK, EU countries, Australia, Canada, Japan, South Korea, New Zealand, and more.
        </p>
      </section>

      {/* Tourist Visa */}
      <section>
        <h2 className="text-lg font-semibold text-gray-800 mb-3">🏖️ Tourist Visa</h2>
        <div className="space-y-3 text-sm text-gray-700">
          <div className="bg-sky-50 border border-sky-100 rounded-xl p-4">
            <p className="font-semibold text-gray-900 mb-1">Visa on Arrival</p>
            <p>Available to 100+ nationalities at Hamad International Airport. Free of charge. Valid 30 days, extendable to 60 days.</p>
          </div>
          <div className="bg-sky-50 border border-sky-100 rounded-xl p-4">
            <p className="font-semibold text-gray-900 mb-1">e-Visa (Online)</p>
            <p>Apply via <strong>visa.moi.gov.qa</strong>. Fee: QAR 100 (~$27 USD). Processing: 3–5 business days. Valid 30 days, single entry.</p>
          </div>
          <div className="bg-sky-50 border border-sky-100 rounded-xl p-4">
            <p className="font-semibold text-gray-900 mb-1">Hotel-Sponsored Visa</p>
            <p>Qatar hotels can sponsor a tourist visa for guests. Your hotel applies on your behalf — usually free.</p>
          </div>
        </div>
      </section>

      {/* Work Visa */}
      <section>
        <h2 className="text-lg font-semibold text-gray-800 mb-3">💼 Work Visa</h2>
        <ol className="list-decimal list-inside space-y-2 text-sm text-gray-700">
          <li>Receive a job offer from a Qatar-based employer</li>
          <li>Employer applies for a work permit via Ministry of Labour portal</li>
          <li>Once approved, you receive an entry visa</li>
          <li>Enter Qatar and obtain your <strong>Qatar ID (QID)</strong> within 30 days</li>
          <li>Medical test + biometrics required for QID</li>
        </ol>
        <p className="text-sm text-gray-500 mt-3">Note: Qatar abolished the No-Objection Certificate (NOC) in 2020 — workers can change jobs freely.</p>
      </section>

      {/* Family Visa */}
      <section>
        <h2 className="text-lg font-semibold text-gray-800 mb-3">👨‍👩‍👧 Family Residence Visa</h2>
        <p className="text-sm text-gray-700 mb-3">
          Qatar residents earning <strong>QAR 10,000/month or more</strong> (or QAR 15,000 for a 3-bedroom apartment) can sponsor their spouse and children.
        </p>
        <div className="rounded-xl border border-stone-200 overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-stone-100 text-gray-700">
                <th className="px-4 py-2 text-left font-semibold">Requirement</th>
                <th className="px-4 py-2 text-left font-semibold">Details</th>
              </tr>
            </thead>
            <tbody>
              {[
                ["Minimum salary", "QAR 10,000/month (sponsor)"],
                ["Documents", "Marriage certificate, birth certificates (attested)"],
                ["Fee", "QAR 200 per family member"],
                ["Processing", "5–10 business days"],
              ].map(([req, det], i) => (
                <tr key={req} className={`border-t border-stone-100 ${i % 2 === 0 ? "bg-white" : "bg-stone-50"}`}>
                  <td className="px-4 py-2 font-medium text-gray-800">{req}</td>
                  <td className="px-4 py-2 text-gray-500">{det}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* FAQ */}
      <section>
        <h2 className="text-lg font-semibold text-gray-800 mb-3">Frequently Asked Questions</h2>
        <div className="space-y-3">
          {[
            { q: "Can I extend my tourist visa?", a: "Yes. Tourist visas can be extended once for an additional 30 days via the MOI portal or at an immigration office. Fee: QAR 200." },
            { q: "Do I need travel insurance for Qatar?", a: "Travel insurance is not mandatory for Qatar but is strongly recommended. Qatar requires health insurance for all residents." },
            { q: "Can I work on a tourist visa?", a: "No. Working on a tourist visa is illegal in Qatar and can result in deportation and a ban from re-entry." },
          ].map(({ q, a }) => (
            <details key={q} className="bg-stone-50 border border-stone-200 rounded-xl p-4 cursor-pointer">
              <summary className="font-semibold text-gray-900 text-sm">{q}</summary>
              <p className="text-sm text-gray-600 mt-2">{a}</p>
            </details>
          ))}
        </div>
      </section>

      {/* Internal links */}
      <section className="bg-rose-50 border border-rose-100 rounded-xl p-4 text-sm">
        <p className="font-semibold text-rose-900 mb-2">Planning to move to Qatar?</p>
        <div className="flex flex-wrap gap-3">
          <a href="/jobs" className="text-rose-700 hover:underline">→ Browse Qatar Jobs</a>
          <a href="/work-in-qatar" className="text-rose-700 hover:underline">→ Work in Qatar</a>
          <a href="/cost-of-living-doha" className="text-rose-700 hover:underline">→ Cost of Living in Doha</a>
        </div>
      </section>
    </div>
  );
}
