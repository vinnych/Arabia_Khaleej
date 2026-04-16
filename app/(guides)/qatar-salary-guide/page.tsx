import ProtocolHero from "@/components/protocols/ProtocolHero";
import ProtocolGrid from "@/components/protocols/ProtocolGrid";
import ProtocolVerification from "@/components/protocols/ProtocolVerification";
import RelatedGuides from "@/components/RelatedGuides";
import { pageMeta, SITE_URL } from "@/lib/seo";
import { safeJsonLd } from "@/lib/utils";

export const metadata = pageMeta({
  title: "Qatar Salary Benchmarks 2026 | Elite Compensation Registry | Arabia Khaleej",
  description: "Elite curator insights on Qatar's professional compensation landscape. Independent benchmarking for tax-free salaries across Tech, Engineering, and Finance sectors.",
  path: "/qatar-salary-guide",
  keywords: ["Qatar salary benchmarks", "Doha compensation registry", "tax-free salary Qatar", "Qatar professional pay scales", "Arabia Khaleej salaries"],
});

const SALARY_DATA = [
  {
    cat: "Engineering",
    roles: [
      { r: "Project Director", j: "15k", m: "25k", s: "40k+" },
      { r: "Civil Engineer", j: "8k", m: "14k", s: "22k" },
      { r: "Mechanical Lead", j: "10k", m: "16k", s: "25k" },
    ]
  },
  {
    cat: "Technology",
    roles: [
      { r: "Cloud Architect", j: "14k", m: "22k", s: "35k" },
      { r: "Software Engineer", j: "9k", m: "15k", s: "24k" },
      { r: "Data Scientist", j: "11k", m: "18k", s: "28k" },
    ]
  },
  {
    cat: "Finance",
    roles: [
      { r: "Executive Director", j: "35k", m: "50k", s: "80k+" },
      { r: "Financial Analyst", j: "10k", m: "16k", s: "25k" },
      { r: "Accountant", j: "7k", m: "11k", s: "18k" },
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
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: safeJsonLd(jsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: safeJsonLd({ "@context": "https://schema.org", "@type": "BreadcrumbList", itemListElement: [{ "@type": "ListItem", position: 1, name: "Home", item: SITE_URL }, { "@type": "ListItem", position: 2, name: "Salary Guide", item: `${SITE_URL}/qatar-salary-guide` }] }) }} />

      <div className="max-w-7xl mx-auto px-6 py-2 sm:py-12 flex flex-col gap-24">
        <ProtocolHero 
          category="Economic Benchmarking"
          titleEn="Salary Guide"
          titleAr="دليل الرواتب"
          description="Benchmarking the 2026 fiscal compensation landscape in the State of Qatar. An independent analysis of monthly tax-free disbursements for global professionals."
          crumbs={[{ label: "Home", href: "/" }, { label: "Guides" }, { label: "Salary Guide" }]}
        />

        <ProtocolGrid 
          points={[
            { label: "Taxation Rate", value: "0.00%", icon: "payments" },
            { label: "Median Growth", value: "+4.2%", icon: "trending_up" },
            { label: "Market Status", value: "Stable", icon: "verified" },
            { label: "Currency", value: "QAR Fixed", icon: "account_balance" },
          ]}
        />

        <section className="space-y-12">
          <div className="flex flex-col md:flex-row justify-between items-end gap-6">
            <div>
              <h2 className="luxury-text text-5xl">Sector Analytics</h2>
              <p className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400 mt-4">Monthly Basic (QAR, Tax-Free)</p>
            </div>
            <div className="flex gap-6 pb-2">
               <div className="flex items-center gap-2 text-[10px] font-black text-slate-400 uppercase tracking-widest">
                 <span className="w-1.5 h-1.5 bg-slate-200 rounded-full" /> Junior
               </div>
               <div className="flex items-center gap-2 text-[10px] font-black text-slate-400 uppercase tracking-widest">
                 <span className="w-1.5 h-1.5 bg-primary/40 rounded-full" /> Mid
               </div>
               <div className="flex items-center gap-2 text-[10px] font-black text-primary uppercase tracking-widest">
                 <span className="w-1.5 h-1.5 bg-primary rounded-full" /> Senior
               </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-1">
            {SALARY_DATA.map((group) => (
              <div key={group.cat} className="insider-card flex flex-col gap-12">
                <h3 className="text-xl font-bold tracking-tight text-primary uppercase">{group.cat}</h3>
                <div className="space-y-10">
                  {group.roles.map((role) => (
                    <div key={role.r} className="space-y-4">
                      <div className="flex justify-between items-baseline">
                        <span className="text-sm font-bold tracking-tight text-slate-900 dark:text-slate-100">{role.r}</span>
                        <span className="text-sm font-black text-primary uppercase tracking-tighter">{role.s}</span>
                      </div>
                      <div className="flex h-1 w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                        <div className="h-full bg-slate-300 w-1/4" />
                        <div className="h-full bg-primary/40 w-1/2 border-x border-white/10" />
                        <div className="h-full bg-primary w-1/4" />
                      </div>
                      <div className="flex justify-between text-[10px] font-black text-slate-400 uppercase tracking-widest">
                        <span>{role.j}</span>
                        <span>{role.m}</span>
                        <span className="opacity-40">Max</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          <div className="insider-card space-y-6">
            <h3 className="luxury-text text-5xl">Package Protocols</h3>
            <p className="text-sm text-slate-500 leading-relaxed font-medium">
              Professional offers in Qatar typically consolidate basic pay with housing and transportation allowances. While median figures are provided as benchmarks, final disbursements are subject to corporate tiering and individual seniority.
            </p>
          </div>
          <div className="insider-card bg-slate-100 dark:bg-slate-900 border-none flex flex-col justify-center">
            <h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-primary mb-4">Mandatory Compliance</h4>
            <p className="text-sm font-bold text-slate-600 dark:text-slate-400 italic">
              All professional compensation agreements must be electronically registered with the Ministry of Labour to secure legal status under Qatar Law.
            </p>
          </div>
        </section>

        <ProtocolVerification 
          sourceName="Ministry of Labour (MOL)" 
          sourceUrl="https://www.mol.gov.qa" 
        />

        <RelatedGuides guides={[
          { href: "/work-in-qatar",          icon: "work",        title: "Work in Qatar",     description: "End-to-end guide to relocating and starting your career in Qatar." },
          { href: "/cost-of-living-doha",    icon: "home_work",   title: "Cost of Living",    description: "How far does your salary actually go? Housing, transport, and school costs." },
        ]} />
      </div>
    </>
  );
}

