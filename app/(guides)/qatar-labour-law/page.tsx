import { pageMeta, SITE_URL } from "@/lib/seo";
import { safeJsonLd } from "@/lib/utils";
import DisclaimerBanner from "@/components/DisclaimerBanner";
import BreadcrumbNav from "@/components/BreadcrumbNav";
import RelatedGuides from "@/components/RelatedGuides";

export const metadata = pageMeta({
  title: "Qatar Labour Law 2026 | Employee Rights & Legal Framework",
  description: "Independent guide to the Qatar Labour Law for 2026. Detailed insights on working hours, minimum wage standards, notice periods, and worker protections.",
  path: "/qatar-labour-law",
  keywords: ["Qatar labour law", "worker rights Doha", "minimum wage Qatar", "employment regulations 2026"],
});

const SECTIONS = [
  { t: "Working Hours", d: "Standard: 8h/day (48h/week). Ramadan: 6h/day (36h/week).", icon: "schedule" },
  { t: "Minimum Wage", d: "Total: QAR 1,800. Basic: 1,000 + 300 (Food) + 500 (Housing).", icon: "payments" },
  { t: "Annual Leave", d: "21 days (Years 1-5). 28 days (Year 5+). Fully paid leave.", icon: "beach_access" },
  { t: "Notice Period", d: "1 Month (< 2 yrs service). 2 Months (>= 2 yrs service).", icon: "assignment_return" },
];

export default function QatarLabourLawPage() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: [
      {
        "@type": "Question",
        name: "Is there a minimum wage in Qatar?",
        acceptedAnswer: { "@type": "Answer", text: "Yes, Qatar set a non-discriminatory minimum wage of QAR 1,000 basic plus allowances in 2021." },
      },
    ],
  };

  return (
    <div className="max-w-7xl mx-auto px-6 py-12 space-y-20">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: safeJsonLd(jsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: safeJsonLd({ "@context": "https://schema.org", "@type": "BreadcrumbList", itemListElement: [{ "@type": "ListItem", position: 1, name: "Home", item: SITE_URL }, { "@type": "ListItem", position: 2, name: "Labour Law", item: `${SITE_URL}/qatar-labour-law` }] }) }} />

      <BreadcrumbNav crumbs={[{ label: "Home", href: "/" }, { label: "Guides" }, { label: "Labour Law" }]} />

      {/* ── Legal Archive Hero ────────────────────────────── */}
      <section className="bento-tile bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 !text-white border-none min-h-[400px] flex items-center relative overflow-hidden shadow-2xl">
        <div className="absolute top-0 right-0 w-96 h-96 bg-primary/10 rounded-full blur-[100px] translate-x-1/3 -translate-y-1/3" />
        <div className="relative z-10 w-full max-w-4xl">
          <p className="text-[10px] font-black uppercase tracking-[0.3em] text-white/60 mb-6">Ministry of Labour · Regulatory Framework</p>
          <h1 className="national-title text-6xl sm:text-9xl mb-8 italic leading-[0.8] tracking-tighter">
             <span className="lang-en">Labour Law</span>
             <span className="lang-ar">قانون العمل</span>
          </h1>
          <p className="text-sm font-medium text-white/50 leading-relaxed max-w-md">
            The fundamental legal protections and obligations for the workforce in the State of Qatar. Updated for 2026.
          </p>
        </div>
      </section>

      {/* ── Disclaimer ─────────────────────────────────────── */}
      <DisclaimerBanner
        officialSourceUrl="https://www.mol.gov.qa"
        officialSourceName="Qatar Ministry of Labour"
        lastReviewed="March 2026"
      />

      {/* ── Core Protections ────────────────────────────────── */}
      <section className="space-y-12">
        <div className="text-center">
          <h2 className="national-title text-4xl">Core Protections</h2>
          <p className="text-xs font-black text-slate-400 uppercase tracking-widest mt-2">Legal Benchmarks for Employees</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {SECTIONS.map(s => (
            <div key={s.t} className="bento-tile group">
              <span className="material-symbols-outlined text-primary text-4xl mb-6 group-hover:scale-110 transition-transform">{s.icon}</span>
              <h3 className="text-lg font-black mb-3 tracking-tight uppercase">{s.t}</h3>
              <p className="text-xs text-slate-500 leading-relaxed font-medium">{s.d}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── Worker Rights & Reforms ──────────────────────────── */}
      <section className="grid grid-cols-1 lg:grid-cols-12 gap-12">
        <div className="lg:col-span-8 bento-tile !p-0 overflow-hidden shadow-2xl">
           <div className="p-8 sm:p-12 bg-slate-50 dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800">
              <h3 className="national-title text-5xl italic mb-1">Labour Reforms</h3>
              <p className="text-xs font-black text-slate-400 uppercase tracking-widest">Post-2020 Legislative Updates</p>
           </div>
           <div className="divide-y divide-slate-100 dark:divide-slate-800">
             {[
               { t: "NOC Abolishment", d: "The No Objection Certificate is no longer required to change employers after completing initial tenure." },
               { t: "Minimum Wage Law", d: "First country in the region to implement a non-discriminatory, state-mandated minimum wage." },
               { t: "Exit Permit Removal", d: "Freedom of movement: Expatriate workers can leave the country without an exit permit." },
               { t: "Heat Stress Laws", d: "Prohibited outdoor work during specific afternoon hours in summer months (June – Sept)." },
             ].map(reform => (
               <div key={reform.t} className="p-8 sm:p-12 group hover:bg-slate-50 dark:hover:bg-slate-950 transition-all">
                  <h4 className="text-sm font-black text-slate-900 dark:text-slate-100 uppercase tracking-widest mb-2 group-hover:text-primary transition-colors">{reform.t}</h4>
                  <p className="text-sm text-slate-500 leading-relaxed max-w-2xl">{reform.d}</p>
               </div>
             ))}
           </div>
        </div>

        <div className="lg:col-span-4 space-y-8">
           <div className="bento-tile !bg-primary !text-white border-none p-12 relative overflow-hidden shadow-xl shadow-primary/20">
              <span className="material-symbols-outlined absolute -right-10 -top-10 text-[200px] text-white/5 rotate-12">gavel</span>
              <h3 className="national-title text-4xl italic mb-6">Metrash2</h3>
              <p className="text-sm font-medium text-white/70 leading-relaxed mb-10">
                Formal grievances and legal inquiries can be filed directly via the MOI Metrash2 application.
              </p>
              <a href="https://portal.moi.gov.qa" className="block w-full py-4 bg-white text-primary text-center rounded-2xl font-black text-[10px] uppercase tracking-widest">Access MOI Portal</a>
           </div>

           <div className="bento-tile bg-slate-950 !text-white border-none flex flex-col justify-center">
              <h4 className="text-xs font-black text-primary uppercase tracking-[0.2em] mb-4">Passport Rights</h4>
              <p className="text-sm text-white/50 leading-relaxed font-medium">
                It is strictly illegal for an employer to retain an employee's passport. This act carries a penalty of up to QAR 25,000 per passport.
              </p>
           </div>
        </div>
      </section>

      <RelatedGuides guides={[
        { href: "/work-in-qatar",       icon: "work",       title: "Work in Qatar",    description: "Understand the full process of getting a job and settling in Qatar." },
        { href: "/qatar-salary-guide",  icon: "bar_chart",  title: "Salary Guide",     description: "See what salaries look like across Engineering, Tech, and Finance." },
        { href: "/qatar-visa-requirements", icon: "id_card", title: "Visa Requirements", description: "Entry and residency visa rules for visitors and new workers." },
      ]} />
    </div>
  );
}
