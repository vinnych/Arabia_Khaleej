import { pageMeta, SITE_URL } from "@/lib/seo";
import { safeJsonLd } from "@/lib/utils";

export const metadata = pageMeta({
  title: "Qatar Salary Guide 2026 — Average Salaries in Doha",
  description: "Average salaries in Qatar by job category and experience level. Tax-free income guide for expats in Doha 2026.",
  path: "/qatar-salary-guide",
  keywords: ["Qatar salary guide 2026", "average salary Qatar", "Doha salary", "Qatar salary by job", "expat salary Qatar", "IT salary Qatar", "engineering salary Qatar"],
  ogTitle: "Qatar Salary Guide 2026 — Average Salaries in Doha",
  ogDescription: "Average salaries in Qatar by job category, experience level, and sector. Tax-free income guide for expats in Doha.",
});

const SALARY_CATEGORIES = [
  {
    icon: "⚙️",
    category: "Engineering",
    color: "sky",
    roles: [
      { role: "Civil Engineer", junior: "6,000–8,000", mid: "9,000–14,000", senior: "15,000–22,000" },
      { role: "Mechanical Engineer", junior: "6,500–8,500", mid: "10,000–15,000", senior: "16,000–24,000" },
      { role: "Electrical Engineer", junior: "6,000–8,000", mid: "9,500–14,500", senior: "15,000–22,000" },
      { role: "Project Manager", junior: "10,000–14,000", mid: "15,000–22,000", senior: "23,000–35,000" },
    ],
  },
  {
    icon: "💻",
    category: "IT & Technology",
    color: "violet",
    roles: [
      { role: "Software Developer", junior: "7,000–10,000", mid: "11,000–17,000", senior: "18,000–28,000" },
      { role: "IT Manager", junior: "12,000–16,000", mid: "17,000–25,000", senior: "26,000–40,000" },
      { role: "Network Engineer", junior: "6,000–8,500", mid: "9,000–14,000", senior: "15,000–22,000" },
      { role: "Data Analyst", junior: "7,000–10,000", mid: "11,000–16,000", senior: "17,000–25,000" },
    ],
  },
  {
    icon: "🏥",
    category: "Healthcare",
    color: "emerald",
    roles: [
      { role: "General Physician", junior: "10,000–14,000", mid: "15,000–22,000", senior: "23,000–35,000" },
      { role: "Specialist Doctor", junior: "18,000–25,000", mid: "26,000–40,000", senior: "41,000–60,000" },
      { role: "Registered Nurse", junior: "4,500–6,500", mid: "7,000–10,000", senior: "11,000–15,000" },
      { role: "Pharmacist", junior: "7,000–9,000", mid: "10,000–14,000", senior: "15,000–20,000" },
    ],
  },
  {
    icon: "🏦",
    category: "Finance & Banking",
    color: "amber",
    roles: [
      { role: "Accountant", junior: "5,000–7,500", mid: "8,000–12,000", senior: "13,000–20,000" },
      { role: "Financial Analyst", junior: "7,000–10,000", mid: "11,000–17,000", senior: "18,000–28,000" },
      { role: "Bank Manager", junior: "12,000–16,000", mid: "17,000–25,000", senior: "26,000–40,000" },
      { role: "Auditor / CPA", junior: "8,000–11,000", mid: "12,000–18,000", senior: "19,000–30,000" },
    ],
  },
  {
    icon: "🏗️",
    category: "Construction",
    color: "orange",
    roles: [
      { role: "Site Engineer", junior: "5,000–7,500", mid: "8,000–13,000", senior: "14,000–20,000" },
      { role: "Quantity Surveyor", junior: "6,000–8,500", mid: "9,000–14,000", senior: "15,000–22,000" },
      { role: "Architect", junior: "7,000–10,000", mid: "11,000–16,000", senior: "17,000–25,000" },
      { role: "Foreman / Supervisor", junior: "3,000–4,500", mid: "5,000–7,000", senior: "7,500–10,000" },
    ],
  },
];

const PACKAGE_COMPONENTS = [
  { item: "Basic Salary", desc: "Core salary (used for end of service & overtime calculations)", typical: "50–70% of total package" },
  { item: "Housing Allowance", desc: "Monthly rent contribution", typical: "QAR 2,000–8,000/month" },
  { item: "Transport Allowance", desc: "Car or public transport allowance", typical: "QAR 500–1,500/month" },
  { item: "Medical Insurance", desc: "Health coverage (mandatory by law)", typical: "Provided by employer" },
  { item: "Annual Flight Ticket", desc: "Return ticket to home country per year", typical: "1–2 tickets/year" },
  { item: "Annual Bonus", desc: "Performance or contractual bonus", typical: "1–3 months salary" },
];

export default function QatarSalaryGuidePage() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: [
      {
        "@type": "Question",
        name: "Is there income tax on salaries in Qatar?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "No. Qatar has no personal income tax. Your entire salary is tax-free. This makes Qatar salaries significantly more valuable compared to equivalent salaries in countries like the UK, USA, or Europe.",
        },
      },
      {
        "@type": "Question",
        name: "What is the average salary in Qatar?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "The average salary in Qatar varies widely by sector and experience. Mid-level professionals typically earn QAR 10,000–20,000/month. Senior professionals and managers earn QAR 20,000–40,000+. All figures are tax-free.",
        },
      },
      {
        "@type": "Question",
        name: "What allowances are typically included in a Qatar salary package?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Qatar salary packages typically include: basic salary, housing allowance (QAR 2,000–8,000), transport allowance (QAR 500–1,500), medical insurance, and an annual flight ticket to your home country.",
        },
      },
    ],
  };

  return (
    <div className="page-sections">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: safeJsonLd(jsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: safeJsonLd({ "@context": "https://schema.org", "@type": "BreadcrumbList", itemListElement: [{ "@type": "ListItem", position: 1, name: "Home", item: "https://qatar-portal.vercel.app" }, { "@type": "ListItem", position: 2, name: "Qatar Salary Guide 2026", item: "https://qatar-portal.vercel.app/qatar-salary-guide" }] }) }} />

      <h1 className="font-newsreader text-xl font-bold text-on-surface mb-1">Qatar Salary Guide 2026</h1>
      <p className="text-xs text-gray-400 mb-3">
        Average monthly salaries in Qatar by job category and experience level. All figures are in QAR and are <strong>tax-free</strong> (Qatar has no personal income tax).
      </p>

      {/* Tax-free highlight */}
      <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-3 mb-4 flex items-start gap-3">
        <span className="text-2xl">🏦</span>
        <div>
          <p className="font-bold text-emerald-800">100% Tax-Free Income</p>
          <p className="text-sm text-emerald-700">Qatar has <strong>no personal income tax</strong>. Every riyal you earn is yours to keep. There is also no VAT on most goods and services.</p>
        </div>
      </div>

      {/* Salary tables by category */}
      <div className="space-y-4 mb-6">
        {SALARY_CATEGORIES.map(({ icon, category, roles }) => (
          <div key={category} className="bg-white rounded-lg border border-gray-100 shadow-none overflow-hidden">
            <div className="bg-gray-50 border-b border-gray-100 px-4 py-2 flex items-center gap-2">
              <span className="text-xl">{icon}</span>
              <h2 className="font-bold text-gray-900">{category}</h2>
              <span className="text-xs text-gray-400 ml-1">(QAR/month)</span>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-gray-50">
                    <th className="text-left px-4 py-2 font-semibold text-gray-600">Role</th>
                    <th className="text-left px-3 py-2 font-semibold text-sky-700">Junior</th>
                    <th className="text-left px-3 py-2 font-semibold text-gray-700">Mid-Level</th>
                    <th className="text-left px-3 py-2 font-semibold text-emerald-700">Senior</th>
                  </tr>
                </thead>
                <tbody>
                  {roles.map(({ role, junior, mid, senior }, i) => (
                    <tr key={role} className={i % 2 === 0 ? "bg-white" : "bg-gray-50/50"}>
                      <td className="px-4 py-2 text-gray-800 font-medium">{role}</td>
                      <td className="px-3 py-2 text-sky-700 text-xs">{junior}</td>
                      <td className="px-3 py-2 text-gray-700 text-xs">{mid}</td>
                      <td className="px-3 py-2 text-emerald-700 text-xs">{senior}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        ))}
      </div>

      {/* Package components */}
      <div className="bg-white rounded-lg border border-gray-100 shadow-none overflow-hidden mb-4">
        <div className="bg-amber-50 border-b border-amber-100 px-4 py-2">
          <h2 className="font-bold text-gray-900">Typical Qatar Salary Package Components</h2>
        </div>
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-gray-50 bg-gray-50">
              <th className="text-left px-4 py-2 font-semibold text-gray-600">Component</th>
              <th className="text-left px-4 py-2 font-semibold text-gray-600">Description</th>
              <th className="text-left px-4 py-2 font-semibold text-gray-600">Typical Amount</th>
            </tr>
          </thead>
          <tbody>
            {PACKAGE_COMPONENTS.map(({ item, desc, typical }, i) => (
              <tr key={item} className={i % 2 === 0 ? "bg-white" : "bg-gray-50/50"}>
                <td className="px-3 py-2 font-semibold text-gray-800">{item}</td>
                <td className="px-3 py-2 text-gray-600">{desc}</td>
                <td className="px-3 py-2 text-amber-700 font-medium">{typical}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* FAQ */}
      <div className="bg-white rounded-lg border border-gray-100 shadow-none p-3 mb-4">
        <h2 className="text-xs font-medium text-gray-400 uppercase tracking-wide mb-2">FAQ</h2>
        <div className="space-y-3">
          {[
            { q: "Is there income tax on salaries in Qatar?", a: "No. Qatar has no personal income tax. All salary figures are take-home amounts." },
            { q: "How does a Qatar salary compare to my home country?", a: "Qatar salaries are tax-free, which adds significant value. A QAR 15,000/month salary in Qatar (~USD 4,100) is equivalent to a much higher gross salary in a country with 30–45% income tax." },
            { q: "Do Qatar salaries include end of service benefits?", a: "Qatar law requires employers to pay end of service gratuity: 3 weeks basic salary per year for the first 5 years, and 4 weeks per year thereafter. This is paid on top of your salary when you leave." },
          ].map(({ q, a }) => (
            <details key={q} className="group">
              <summary className="cursor-pointer text-xs font-medium text-gray-700 py-2 list-none flex justify-between items-center">
                {q}
                <span className="text-gray-400 group-open:rotate-180 transition-transform">▼</span>
              </summary>
              <p className="text-xs text-gray-500 pt-1 pb-3">{a}</p>
            </details>
          ))}
        </div>
      </div>

      <p className="text-[10px] text-gray-400 mb-4">
        * Salary ranges are estimates based on market data and may vary by company, nationality, and negotiation. Figures are in QAR/month.
      </p>

      <div className="flex gap-3 flex-wrap text-xs">
        <a href="/jobs" className="text-rose-700 hover:underline">→ Browse jobs in Qatar</a>
        <a href="/cost-of-living-doha" className="text-rose-700 hover:underline">→ Cost of living in Doha</a>
        <a href="/qatar-labour-law" className="text-rose-700 hover:underline">→ Qatar Labour Law</a>
      </div>
    </div>
  );
}
