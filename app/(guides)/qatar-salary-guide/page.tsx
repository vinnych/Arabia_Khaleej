import { pageMeta, SITE_URL } from "@/lib/seo";
import { safeJsonLd } from "@/lib/utils";
import DisclaimerBanner from "@/components/DisclaimerBanner";
import BreadcrumbNav from "@/components/BreadcrumbNav";
import RelatedGuides from "@/components/RelatedGuides";

export const metadata = pageMeta({
  title: "Qatar Salary Guide 2026 | Market Insights & Benchmarks",
  description: "Independent market insights on salaries in Qatar for 2026. Explore average pay scales across IT, Engineering, Healthcare, and Finance in a tax-free economy.",
  path: "/qatar-salary-guide",
  keywords: ["Qatar salary guide", "average salary Doha", "tax-free income Qatar", "salary benchmarks 2026"],
});

const SALARY_DATA = [
  {
    cat: "Engineering",
    roles: [
      { r: "Civil Engineer", j: "8.5k", m: "14k", s: "22k" },
      { r: "Project Manager", j: "14k", m: "22k", s: "35k" },
      { r: "Mechanical", j: "9k", m: "15k", s: "24k" },
    ]
  },
  {
    cat: "Technology",
    roles: [
      { r: "Software Engineer", j: "10k", m: "17k", s: "28k" },
      { r: "Data Scientist", j: "12k", m: "18k", s: "30k" },
      { r: "Cloud Architect", j: "15k", m: "25k", s: "40k" },
    ]
  },
  {
    cat: "Finance",
    roles: [
      { r: "Accountant", j: "7k", m: "12k", s: "20k" },
      { r: "Financial Analyst", j: "10k", m: "17k", s: "28k" },
      { r: "CFO / Director", j: "30k", m: "45k", s: "70k+" },
    ]
  }
];

export default function QatarSalaryGuidePage() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: [
      {
        "@type": "Question",
        name: "Is there income tax in Qatar?",
        acceptedAnswer: { "@type": "Answer", text: "Qatar has zero personal income tax, making salaries highly competitive globally." },
      },
    ],
  };

  return (
    <div className="max-w-7xl mx-auto px-6 py-12 space-y-20">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: safeJsonLd(jsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: safeJsonLd({ "@context": "https://schema.org", "@type": "BreadcrumbList", itemListElement: [{ "@type": "ListItem", position: 1, name: "Home", item: SITE_URL }, { "@type": "ListItem", position: 2, name: "Salary Guide", item: `${SITE_URL}/qatar-salary-guide` }] }) }} />

      <BreadcrumbNav crumbs={[{ label: "Home", href: "/" }, { label: "Guides" }, { label: "Salary Guide" }]} />

      {/* ── Economic Insight Hero ──────────────────────────── */}
      <section className="bento-tile bg-gradient-to-br from-primary to-primary-dark !text-white border-none min-h-[450px] flex items-center relative overflow-hidden shadow-2xl">
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-white/5 rounded-full blur-[120px] translate-x-1/2 -translate-y-1/2" />
        <div className="relative z-10 w-full max-w-4xl">
          <div className="flex items-center gap-3 mb-8 bg-white/5 border border-white/10 px-4 py-2 rounded-full w-fit">
            <span className="material-symbols-outlined text-accent text-sm">account_balance</span>
            <p className="label-xs text-white/60">Independent Guide · Tax-Free Economy</p>
          </div>
          <h1 className="national-title text-6xl sm:text-9xl mb-10 italic leading-[0.8] tracking-tighter">
             <span className="lang-en">Salary Guide</span>
             <span className="lang-ar">دليل الرواتب</span>
          </h1>
          <p className="text-sm font-medium text-white/50 leading-relaxed max-w-lg mb-12">
            Benchmarking the 2026 fiscal compensation landscape in the State of Qatar. All figures represent monthly tax-free disbursements.
          </p>
          <div className="flex flex-wrap gap-12 border-l-2 border-primary pl-8">
             <div>
                <p className="text-[10px] font-black text-white/30 uppercase tracking-widest mb-1">Taxation Rate</p>
                <p className="text-3xl font-black text-accent">0.00%</p>
             </div>
             <div>
                <p className="text-[10px] font-black text-white/30 uppercase tracking-widest mb-1">Median Growth</p>
                <p className="text-3xl font-black text-white">+4.2%</p>
             </div>
          </div>
        </div>
      </section>

      {/* ── Disclaimer ─────────────────────────────────────── */}
      <DisclaimerBanner
        officialSourceUrl="https://www.mol.gov.qa"
        officialSourceName="Qatar Ministry of Labour — Labour Market"
        lastReviewed="March 2026"
      />

      {/* ── Sector Analytics ────────────────────────────────── */}
      <section className="space-y-12">
        <div className="flex flex-col md:flex-row justify-between items-end gap-6">
          <div>
            <h2 className="national-title text-5xl">Sectoral Benchmarks</h2>
            <p className="text-xs font-black text-slate-400 uppercase tracking-widest mt-2">Monthly Compensation (QAR)</p>
          </div>
          <div className="flex gap-4">
             <div className="flex items-center gap-2"><span className="w-2 h-2 rounded-full bg-slate-200" /><span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Junior</span></div>
             <div className="flex items-center gap-2"><span className="w-2 h-2 rounded-full bg-primary/40" /><span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Mid</span></div>
             <div className="flex items-center gap-2"><span className="w-2 h-2 rounded-full bg-primary" /><span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Senior</span></div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {SALARY_DATA.map(group => (
            <div key={group.cat} className="bento-tile group hover:border-primary/20 transition-all overflow-hidden flex flex-col">
              <h3 className="text-2xl font-black mb-8 border-b border-slate-100 dark:border-slate-800 pb-4">{group.cat}</h3>
              <div className="space-y-8 flex-1">
                {group.roles.map(role => (
                  <div key={role.r} className="space-y-3">
                    <div className="flex justify-between items-center mr-1">
                       <span className="text-xs font-bold text-slate-900 dark:text-slate-100 uppercase tracking-tight">{role.r}</span>
                       <span className="text-xs font-black text-primary uppercase">{role.s}</span>
                    </div>
                    <div className="flex h-1.5 w-full bg-slate-100 dark:bg-slate-900 rounded-full overflow-hidden">
                       <div className="h-full bg-slate-300 w-1/4" />
                       <div className="h-full bg-primary/40 w-1/2 border-x border-white/20 dark:border-black/20" />
                       <div className="h-full bg-primary w-1/4" />
                    </div>
                    <div className="flex justify-between px-1">
                       <span className="text-[10px] font-black text-slate-300 uppercase">{role.j}</span>
                       <span className="text-[10px] font-black text-slate-400 uppercase">{role.m}</span>
                       <span className="text-[10px] font-black text-primary/40 uppercase">Max</span>
                    </div>
                  </div>
                ))}
              </div>
              <a href="/qatar-labour-law" className="mt-10 flex items-center justify-center gap-3 py-4 bg-slate-50 dark:bg-slate-950 text-xs font-black uppercase tracking-widest hover:bg-primary hover:text-white transition-all rounded-xl">
                 Know Your Rights <span className="material-symbols-outlined text-sm">east</span>
              </a>
            </div>
          ))}
        </div>
      </section>

      {/* ── Package Components ─────────────────────────────── */}
      <section className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        <div className="bento-tile !bg-primary !text-white border-none p-12 relative overflow-hidden shadow-2xl shadow-primary/20">
           <span className="material-symbols-outlined absolute -right-10 -top-10 text-[250px] text-white/5 -rotate-12">receipt_long</span>
           <h3 className="national-title text-5xl italic mb-8">The Package</h3>
           <p className="text-sm font-medium text-white/70 leading-relaxed mb-10 max-w-sm">
             Employment contracts in Qatar typically consolidate several allowances into a monthly lump sum.
           </p>
           <div className="space-y-6 relative z-10">
             {[
               { i: "Basic Salary", v: "60% of total" },
               { i: "Housing Allowance", v: "Fixed or Cash" },
               { i: "Transportation", v: "QAR 500 – 2,000" },
               { i: "Medical & Flights", v: "Annual Provision" },
             ].map(item => (
               <div key={item.i} className="flex justify-between items-center border-b border-white/10 pb-4">
                  <span className="text-[10px] font-black uppercase tracking-widest text-white/50">{item.i}</span>
                  <span className="text-xs font-black uppercase tracking-widest text-accent">{item.v}</span>
               </div>
             ))}
           </div>
        </div>

        <div className="space-y-6">
          <div className="bento-tile">
             <h4 className="text-sm font-black uppercase tracking-widest mb-4">Gratuity Benefit</h4>
             <p className="text-sm text-slate-500 leading-relaxed">
               Under Qatar Labour Law, employees are entitled to an <b>End of Service Gratuity</b>. This is calculated as 3 weeks of basic salary for each year of service.
             </p>
          </div>
          <div className="bento-tile bg-primary/5 dark:bg-primary/10 !border-primary/10">
             <div className="flex items-center gap-4 mb-3">
               <span className="material-symbols-outlined text-primary">verified</span>
               <h4 className="text-sm font-black uppercase tracking-widest text-primary">Important Note</h4>
             </div>
             <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
               All professional contracts must be registered with the Ministry of Labour to be enforceable under state law.
             </p>
          </div>
        </div>
      </section>

      <RelatedGuides guides={[
        { href: "/qatar-labour-law",       icon: "gavel",       title: "Labour Law",        description: "Your full legal rights as an employee in Qatar — wages, hours, and protections." },
        { href: "/work-in-qatar",          icon: "work",        title: "Work in Qatar",     description: "End-to-end guide to relocating and starting your career in Qatar." },
        { href: "/cost-of-living-doha",    icon: "home_work",   title: "Cost of Living",    description: "How far does your salary actually go? Housing, transport, and school costs." },
      ]} />
    </div>
  );
}
