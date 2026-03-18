import type { Metadata } from "next";
import { safeJsonLd } from "@/lib/utils";

const SITE_URL = "https://qatar-portal.vercel.app";

export const metadata: Metadata = {
  title: "Qatar Labour Law 2026 — Employee Rights & Work Rules",
  description: "Complete guide to Qatar Labour Law 2026: working hours, minimum wage, annual leave, end of service, overtime, notice period, and worker rights.",
  keywords: ["Qatar labour law 2026", "Qatar employment law", "Qatar working hours", "Qatar minimum wage", "Qatar end of service", "Qatar overtime pay", "Qatar annual leave"],
  alternates: { canonical: `${SITE_URL}/qatar-labour-law` },
  openGraph: {
    title: "Qatar Labour Law 2026 — Employee Rights & Work Rules",
    description: "Qatar Labour Law guide: working hours, minimum wage, annual leave, end of service, and worker rights for expats.",
    url: `${SITE_URL}/qatar-labour-law`,
    siteName: "Qatar Portal",
    type: "website",
    images: [{ url: `${SITE_URL}/opengraph-image`, width: 1200, height: 630 }],
  },
  twitter: { card: "summary_large_image", title: "Qatar Labour Law 2026 — Employee Rights", description: "Qatar Labour Law: working hours, minimum wage, annual leave, end of service, and overtime rules." },
};

const SECTIONS = [
  {
    icon: "🕐",
    title: "Working Hours",
    rows: [
      ["Standard hours", "8 hours/day · 48 hours/week"],
      ["During Ramadan", "6 hours/day · 36 hours/week"],
      ["Rest day", "Friday (minimum 1 day/week off)"],
      ["Break entitlement", "1 hour break if working 5+ continuous hours"],
    ],
  },
  {
    icon: "💰",
    title: "Minimum Wage",
    rows: [
      ["Basic minimum wage", "QAR 1,000/month"],
      ["Food allowance", "QAR 300/month (if no food provided)"],
      ["Accommodation allowance", "QAR 500/month (if no housing provided)"],
      ["Total minimum package", "QAR 1,800/month"],
      ["Applies to", "All private sector workers (since March 2021)"],
    ],
  },
  {
    icon: "🏖️",
    title: "Annual Leave",
    rows: [
      ["First 5 years of service", "3 weeks (21 days) per year"],
      ["After 5 years", "4 weeks (28 days) per year"],
      ["Leave carry-over", "Unused leave can be carried forward (max 1 year)"],
      ["Leave encashment", "Entitled to pay in lieu of unused leave upon exit"],
    ],
  },
  {
    icon: "🤝",
    title: "End of Service Gratuity",
    rows: [
      ["Minimum service required", "1 year continuous employment"],
      ["First 5 years", "3 weeks basic salary per year"],
      ["After 5 years", "4 weeks basic salary per year"],
      ["Calculation base", "Final basic salary only (not allowances)"],
      ["Payment timeline", "Within 7 days of contract end"],
    ],
  },
  {
    icon: "📋",
    title: "Probation & Notice Period",
    rows: [
      ["Probation period", "Maximum 6 months"],
      ["Notice period (< 2 years)", "1 month"],
      ["Notice period (≥ 2 years)", "2 months"],
      ["Notice pay in lieu", "Employer can pay salary in lieu of notice"],
    ],
  },
  {
    icon: "⏰",
    title: "Overtime Pay",
    rows: [
      ["Weekday overtime", "Basic hourly rate + 25%"],
      ["Rest day / Friday", "Basic hourly rate + 50%"],
      ["Public holidays", "Basic hourly rate + 150%"],
      ["Maximum overtime", "2 hours/day (except in emergencies)"],
    ],
  },
  {
    icon: "🏥",
    title: "Other Entitlements",
    rows: [
      ["Sick leave", "Up to 4 weeks paid, 4 weeks half-pay per year"],
      ["Maternity leave", "50 days (for female employees)"],
      ["Paternity leave", "5 days"],
      ["Hajj leave", "Once during employment (unpaid, or as agreed)"],
      ["Medical insurance", "Employer must provide basic health coverage"],
    ],
  },
  {
    icon: "✈️",
    title: "Travel & Exit Rights",
    rows: [
      ["Exit permit", "Abolished in 2020 — workers can leave freely"],
      ["End of service ticket", "Employer must provide repatriation ticket"],
      ["Passport retention", "Illegal — employer cannot hold your passport"],
      ["Job change", "Workers can change employers after 1 year (no NOC needed)"],
    ],
  },
];

export default function QatarLabourLawPage() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: [
      {
        "@type": "Question",
        name: "What is the minimum wage in Qatar?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Qatar's minimum wage (since March 2021) is QAR 1,000/month basic salary, plus QAR 300/month food allowance and QAR 500/month accommodation allowance if not provided by the employer — totalling QAR 1,800/month minimum.",
        },
      },
      {
        "@type": "Question",
        name: "How many days annual leave are employees entitled to in Qatar?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Employees in Qatar are entitled to 3 weeks (21 days) of annual leave per year for the first 5 years of service, and 4 weeks (28 days) per year thereafter.",
        },
      },
      {
        "@type": "Question",
        name: "How is end of service gratuity calculated in Qatar?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "End of service gratuity in Qatar is 3 weeks of basic salary per year for the first 5 years of service, and 4 weeks per year thereafter. It is calculated on basic salary only, not on allowances.",
        },
      },
      {
        "@type": "Question",
        name: "Do workers in Qatar need an exit permit to leave the country?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "No. Qatar abolished the exit permit requirement in 2020. Workers can now leave the country freely without employer permission, except for employees in specific government security roles.",
        },
      },
    ],
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: safeJsonLd(jsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: safeJsonLd({ "@context": "https://schema.org", "@type": "BreadcrumbList", itemListElement: [{ "@type": "ListItem", position: 1, name: "Home", item: "https://qatar-portal.vercel.app" }, { "@type": "ListItem", position: 2, name: "Qatar Labour Law 2026", item: "https://qatar-portal.vercel.app/qatar-labour-law" }] }) }} />

      <h1 className="text-2xl font-bold text-gray-900 mb-2">Qatar Labour Law 2026</h1>
      <p className="text-gray-500 mb-2 text-sm">
        Key rights and rules under Qatar&apos;s Labour Law (Law No. 14 of 2004) as amended — for private sector employees and expatriate workers.
      </p>
      <p className="text-xs text-amber-700 bg-amber-50 border border-amber-100 rounded-lg px-3 py-2 mb-6">
        ℹ️ This is a summary guide. For legal advice or disputes, contact the <strong>Ministry of Labour Qatar</strong> (Adaala portal) or a licensed employment lawyer.
      </p>

      {/* Law sections */}
      <div className="space-y-5">
        {SECTIONS.map(({ icon, title, rows }) => (
          <div key={title} className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
            <div className="bg-gray-50 border-b border-gray-100 px-5 py-3 flex items-center gap-2">
              <span className="text-xl">{icon}</span>
              <h2 className="font-bold text-gray-900">{title}</h2>
            </div>
            <table className="w-full text-sm">
              <tbody>
                {rows.map(([label, value], i) => (
                  <tr key={label} className={i % 2 === 0 ? "bg-white" : "bg-gray-50/50"}>
                    <td className="px-5 py-2.5 text-gray-600 font-medium w-1/2">{label}</td>
                    <td className="px-5 py-2.5 text-gray-900 font-semibold">{value}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ))}
      </div>

      {/* FAQ */}
      <div className="mt-8 bg-white rounded-xl border border-gray-100 shadow-sm p-4">
        <h2 className="text-lg font-semibold text-gray-800 mb-3">Frequently Asked Questions</h2>
        <div className="space-y-3">
          {[
            { q: "What is the minimum wage in Qatar?", a: "Qatar's minimum wage is QAR 1,000/month basic + QAR 300 food allowance + QAR 500 housing allowance = QAR 1,800/month total if those are not provided by the employer." },
            { q: "Can my employer hold my passport in Qatar?", a: "No. Passport confiscation by employers is illegal under Qatar Labour Law. If your employer has your passport, you can report it to the Ministry of Labour." },
            { q: "Do I need a No Objection Certificate (NOC) to change jobs?", a: "Since 2020, workers in Qatar can change jobs without a NOC from their employer after completing 1 year of service. This is part of Qatar's labour reform." },
            { q: "Do workers in Qatar need an exit permit?", a: "No. Qatar abolished the exit permit system in September 2020. Workers can now leave the country freely without employer approval." },
          ].map(({ q, a }) => (
            <details key={q} className="group">
              <summary className="cursor-pointer font-medium text-gray-800 py-2 list-none flex justify-between items-center">
                {q}
                <span className="text-gray-400 group-open:rotate-180 transition-transform">▼</span>
              </summary>
              <p className="text-gray-600 text-sm pt-1 pb-3">{a}</p>
            </details>
          ))}
        </div>
      </div>

      <div className="mt-6 flex gap-3 flex-wrap text-sm">
        <a href="/qatar-visa-requirements" className="text-rose-700 hover:underline">→ Visa requirements</a>
        <a href="/cost-of-living-doha" className="text-rose-700 hover:underline">→ Cost of living</a>
        <a href="/qatar-salary-guide" className="text-rose-700 hover:underline">→ Salary guide</a>
        <a href="/jobs" className="text-rose-700 hover:underline">→ Jobs in Qatar</a>
      </div>
    </div>
  );
}
