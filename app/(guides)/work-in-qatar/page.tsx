import { pageMeta, SITE_URL } from "@/lib/seo";
import { safeJsonLd } from "@/lib/utils";

export const revalidate = 86400;

export const metadata = pageMeta({
  title: "Working in Qatar 2026 — Complete Expat Guide | Qatar Portal",
  description: "Complete guide to working in Qatar: visa requirements, salary ranges, labour law, cost of living, and how to find jobs in Doha.",
  path: "/work-in-qatar",
  keywords: ["working in Qatar", "work in Qatar 2026", "Qatar expat guide", "jobs in Qatar", "Qatar work visa", "Qatar salary", "moving to Qatar"],
  ogTitle: "Working in Qatar 2026 — Complete Expat Guide",
  ogDescription: "Everything you need to know about working in Qatar: visa, salary, labour law, cost of living, and finding a job.",
});

const RESOURCES = [
  {
    icon: "🛂",
    title: "Qatar Visa Requirements",
    desc: "Work visas, sponsorship rules, and which nationalities get visa-on-arrival.",
    href: "/qatar-visa-requirements",
    color: "sky",
  },
  {
    icon: "⚖️",
    title: "Qatar Labour Law",
    desc: "Working hours, minimum wage, annual leave, end-of-service, overtime, and notice periods.",
    href: "/qatar-labour-law",
    color: "rose",
  },
  {
    icon: "💰",
    title: "Qatar Salary Guide",
    desc: "Average salaries by job category and seniority. All income is 100% tax-free.",
    href: "/qatar-salary-guide",
    color: "amber",
  },
  {
    icon: "💼",
    title: "Jobs in Qatar",
    desc: "Latest job vacancies in Doha and Qatar — updated daily from top Gulf job boards.",
    href: "/jobs",
    color: "emerald",
  },
  {
    icon: "🏠",
    title: "Cost of Living in Doha",
    desc: "Rent, food, transport, schools, and utilities — what to expect on an expat budget.",
    href: "/cost-of-living-doha",
    color: "violet",
  },
];

const FAQS = [
  {
    q: "Do I need a visa to work in Qatar?",
    a: "Yes, most nationalities require a work visa sponsored by your employer. Your employer handles the visa process — you do not apply independently. Some nationalities (GCC, UK, USA, EU) can enter visa-free for up to 30–180 days but still need a residence permit to work.",
  },
  {
    q: "Is there income tax in Qatar?",
    a: "No. Qatar has zero personal income tax. Your entire salary is take-home pay. There is also no VAT on most goods and services, making Qatar one of the most tax-efficient countries for expats.",
  },
  {
    q: "What is the minimum wage in Qatar?",
    a: "Qatar's minimum wage is QAR 1,000/month basic salary, plus QAR 500 food allowance and QAR 500 accommodation allowance if not provided by employer — totalling QAR 2,000/month minimum.",
  },
  {
    q: "Can I change jobs in Qatar?",
    a: "Yes. Since 2020, Qatar abolished the exit permit requirement and allows job changes without employer permission after 1 year of service (or immediately in cases of employer breach). Workers can now freely change employers.",
  },
  {
    q: "What are typical working hours in Qatar?",
    a: "Standard working hours are 8 hours/day and 48 hours/week. During Ramadan, working hours are reduced to 6 hours/day for Muslim employees. Overtime is paid at 125% on weekdays and 150% on rest days and public holidays.",
  },
  {
    q: "What is end of service gratuity?",
    a: "Qatar Labour Law entitles employees to end of service gratuity: 3 weeks basic salary per year for the first 5 years of service, and 4 weeks per year thereafter. This is paid when you leave, in addition to your regular salary.",
  },
  {
    q: "How do I find jobs in Qatar?",
    a: "Top job boards for Qatar include Bayt.com, GulfTalent, LinkedIn, and Naukrigulf. Many jobs are also filled through company websites and recruitment agencies. Qatar Portal aggregates daily job listings from multiple sources.",
  },
  {
    q: "What is the cost of renting in Doha?",
    a: "Renting in Doha varies widely. A 1-bedroom apartment in a central area costs QAR 5,000–9,000/month. Many employers include housing allowances in the package (typically QAR 2,000–8,000/month).",
  },
];

export default function WorkInQatarPage() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: FAQS.map(({ q, a }) => ({
      "@type": "Question",
      name: q,
      acceptedAnswer: { "@type": "Answer", text: a },
    })),
  };

  const breadcrumbLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: SITE_URL },
      { "@type": "ListItem", position: 2, name: "Working in Qatar", item: `${SITE_URL}/work-in-qatar` },
    ],
  };

  return (
    <div className="page-sections">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: safeJsonLd(jsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: safeJsonLd(breadcrumbLd) }} />

      {/* Hero */}
      <div className="mb-4">
        <h1 className="font-newsreader text-xl font-bold text-on-surface mb-1">
          Working in Qatar — Complete Guide 2026
        </h1>
        <p className="text-xs text-gray-400 dark:text-slate-500">
          Everything you need to know before moving to Qatar for work: visas, salaries, labour rights, cost of living, and how to find a job. All information is verified and updated for 2026.
        </p>
      </div>

      {/* Tax-free highlight */}
      <div className="bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-200 dark:border-emerald-800/30 rounded-lg p-3 mb-4 flex items-start gap-2">
        <span className="text-xl">💡</span>
        <div>
          <p className="text-sm font-bold text-emerald-800 dark:text-emerald-300">Qatar is 100% tax-free</p>
          <p className="text-xs text-emerald-700 dark:text-emerald-400">No income tax, no VAT on most goods. Your entire salary is yours to keep — making Qatar one of the highest-paying expat destinations in the world.</p>
        </div>
      </div>

      {/* Resource cards */}
      <div className="grid sm:grid-cols-2 gap-3 mb-6">
        {RESOURCES.map(({ icon, title, desc, href }) => (
          <a
            key={href}
            href={href}
            className="bg-white dark:bg-slate-800 rounded-lg border border-stone-200 dark:border-slate-700 shadow-none p-3 hover:shadow-md hover:border-rose-200 dark:hover:border-rose-800/50 transition-all flex gap-3 items-start"
          >
            <span className="text-2xl flex-shrink-0">{icon}</span>
            <div>
              <h2 className="text-sm font-bold text-gray-900 dark:text-slate-100 mb-0.5">{title}</h2>
              <p className="text-xs text-gray-500 dark:text-slate-400 leading-relaxed">{desc}</p>
            </div>
          </a>
        ))}
      </div>

      {/* Quick stats */}
      <div className="bg-rose-900 text-white rounded-lg p-4 mb-6">
        <h2 className="text-sm font-bold text-amber-300 mb-3">Qatar at a Glance</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-sm">
          {[
            { label: "Income Tax", value: "0%" },
            { label: "Minimum Wage", value: "QAR 2,000" },
            { label: "Work Week", value: "48 hrs max" },
            { label: "Expat Population", value: "~88%" },
            { label: "Currency", value: "QAR (≈ USD 0.27)" },
            { label: "Language", value: "Arabic / English" },
          ].map(({ label, value }) => (
            <div key={label} className="bg-rose-800 rounded-md p-2.5">
              <p className="text-[10px] text-rose-300 mb-1">{label}</p>
              <p className="text-sm font-bold text-white">{value}</p>
            </div>
          ))}
        </div>
      </div>

      {/* FAQ */}
      <div className="bg-white dark:bg-slate-800 rounded-lg border border-gray-100 dark:border-slate-700 shadow-sm p-3 mb-5">
        <h2 className="text-xs font-medium text-gray-400 dark:text-slate-500 uppercase tracking-wide mb-2">FAQ</h2>
        <div className="space-y-1">
          {FAQS.map(({ q, a }) => (
            <details key={q} className="group border-b border-gray-50 last:border-0">
              <summary className="cursor-pointer text-xs font-medium text-gray-800 dark:text-slate-200 py-2 list-none flex justify-between items-center gap-2">
                <span>{q}</span>
                <span className="text-gray-400 dark:text-slate-500 flex-shrink-0 group-open:rotate-180 transition-transform text-xs">▼</span>
              </summary>
              <p className="text-xs text-gray-500 dark:text-slate-400 pb-3 leading-relaxed">{a}</p>
            </details>
          ))}
        </div>
      </div>

      {/* Related links */}
      <div className="flex flex-wrap gap-3 text-xs">
        <a href="/jobs" className="text-rose-700 hover:underline">→ Browse jobs in Qatar</a>
        <a href="/qatar-labour-law" className="text-rose-700 hover:underline">→ Qatar Labour Law</a>
        <a href="/prayer" className="text-rose-700 hover:underline">→ Prayer Times & Hijri</a>
        <a href="/qatar-public-holidays" className="text-rose-700 hover:underline">→ Public holidays</a>
      </div>
    </div>
  );
}
