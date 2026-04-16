import { pageMeta, SITE_URL } from "@/lib/seo";
import { safeJsonLd } from "@/lib/utils";
import DisclaimerBanner from "@/components/DisclaimerBanner";
import BreadcrumbNav from "@/components/BreadcrumbNav";
import RelatedGuides from "@/components/RelatedGuides";

export const metadata = pageMeta({
  title: "Working in Qatar 2026 | Professional Onboarding Guide",
  description: "The definitive guide to the professional landscape in the State of Qatar. Seamlessly navigate your career transition into the world's most tax-efficient economy.",
  path: "/work-in-qatar",
  keywords: ["Working in Qatar", "Doha professional guide", "Moving to Qatar 2026", "Expat careers Qatar"],
});

const RESOURCES = [
  { t: "Visa Protocols", h: "/qatar-visa-requirements", i: "badge" },
  { t: "Labour Framework", h: "/qatar-labour-law", i: "gavel" },
  { t: "Salary Benchmarks", h: "/qatar-salary-guide", i: "account_balance" },
  { t: "Economic Living", h: "/cost-of-living-doha", i: "payments" },
];

export default function WorkInQatarPage() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: [
      {
        "@type": "Question",
        name: "Is Qatar tax-free?",
        acceptedAnswer: { "@type": "Answer", text: "Yes, Qatar has 0% personal income tax, providing one of the most efficient compensation environments globally." },
      },
    ],
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: safeJsonLd(jsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: safeJsonLd({ "@context": "https://schema.org", "@type": "BreadcrumbList", itemListElement: [{ "@type": "ListItem", position: 1, name: "Home", item: SITE_URL }, { "@type": "ListItem", position: 2, name: "Work in Qatar", item: `${SITE_URL}/work-in-qatar` }] }) }} />

      <div className="max-w-7xl mx-auto px-6 py-2 sm:py-12 flex flex-col gap-12 sm:gap-20">
        <BreadcrumbNav crumbs={[{ label: "Home", href: "/" }, { label: "Guides" }, { label: "Work in Qatar" }]} />

      {/* ── Professional Onboarding Hero ───────────────────── */}
      <section className="bento-tile bg-gradient-to-br from-primary to-primary-dark !text-white border-none min-h-[400px] flex items-center relative overflow-hidden shadow-2xl">
        <div className="absolute top-0 right-0 w-96 h-96 bg-white/5 rounded-full blur-[100px] translate-x-1/3 -translate-y-1/3" />
        <div className="relative z-10 w-full max-w-4xl">
          <p className="label-xs text-white/60 mb-6">Independent Guide · Moving & Working</p>
          <h1 className="national-title text-6xl sm:text-9xl mb-10 italic leading-[0.8] tracking-tighter">
             <span className="lang-en">Work Guide</span>
             <span className="lang-ar">دليل الوظائف</span>
          </h1>
          <p className="text-sm font-medium text-white/50 leading-relaxed max-w-md">
            Everything you need to know before and after arriving in Qatar — visas, QID, your rights, and what life looks like on the ground.
          </p>
        </div>
      </section>

      {/* ── Disclaimer ─────────────────────────────────────── */}
      <DisclaimerBanner
        officialSourceUrl="https://www.mol.gov.qa"
        officialSourceName="Qatar Ministry of Labour"
        lastReviewed="March 2026"
      />

      {/* ── Key Resource Compass ────────────────────────────── */}
      <section className="space-y-12">
        <div className="text-center">
           <h2 className="national-title text-5xl">Key Resources</h2>
           <p className="text-xs font-black text-slate-400 uppercase tracking-widest mt-2">Everything You Need in One Place</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
           {RESOURCES.map(res => (
             <a key={res.h} href={res.h} className="bento-tile flex flex-col items-center text-center p-12 group hover:border-primary/20 transition-all">
                <span className="material-symbols-outlined text-primary text-4xl mb-6 group-hover:scale-110 transition-transform">{res.i}</span>
                <h3 className="text-xs font-black uppercase tracking-widest leading-relaxed mb-4">{res.t}</h3>
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] group-hover:text-primary transition-colors">Learn More <span className="material-symbols-outlined text-[10px] align-middle">east</span></span>
             </a>
           ))}
        </div>
      </section>

      {/* ── National Advantage Dashboard ───────────────────── */}
      <section className="grid grid-cols-1 lg:grid-cols-12 gap-12">
        <div className="lg:col-span-12 bento-tile !bg-slate-900 !text-white border-none p-12 md:p-20 relative overflow-hidden shadow-2xl shadow-primary/20">
           <div className="grid grid-cols-1 md:grid-cols-2 gap-20 items-center">
              <div>
                 <h3 className="national-title text-6xl mb-8 italic">Why Qatar?</h3>
                 <p className="text-sm font-medium text-white/50 leading-relaxed mb-12">
                   Zero income tax, modern infrastructure, and a multicultural workforce make Qatar one of the most rewarding places to build a career in the world.
                 </p>
                 <div className="grid grid-cols-2 gap-8">
                   {[
                     { l: "Tax Rate", v: "0.00%", sub: "Net = Gross" },
                     { l: "Growth Hub", v: "Doha", sub: "Global Gateway" },
                   ].map(stat => (
                     <div key={stat.l}>
                        <p className="text-[10px] font-black text-white/30 uppercase tracking-widest mb-1">{stat.l}</p>
                        <p className="text-3xl font-black text-accent mb-1">{stat.v}</p>
                        <p className="text-[10px] font-bold text-white/20 uppercase tracking-widest">{stat.sub}</p>
                     </div>
                   ))}
                 </div>
              </div>
              <div className="bento-tile bg-white/5 border-white/10 !p-10 space-y-8 backdrop-blur-md relative overflow-hidden">
                 <span className="absolute -right-5 -bottom-5 material-symbols-outlined text-[150px] text-white/5 rotate-12">verified</span>
                 <h4 className="text-sm font-black uppercase tracking-widest border-b border-white/10 pb-4">Onboarding Checklist</h4>
                 <div className="space-y-4">
                    {[
                      "Obtain a Qatari Employer Sponsorship",
                      "Attest Educational Qualifications",
                      "Medical Screening & Fingerprinting",
                      "Electronic Qatar ID Disbursement",
                    ].map(step => (
                      <div key={step} className="flex items-center gap-4 text-xs font-bold text-white/70">
                         <span className="material-symbols-outlined text-sm text-accent">check_circle</span>
                         {step}
                      </div>
                    ))}
                 </div>
              </div>
           </div>
        </div>
      </section>

      {/* ── Concierge Support ────────────────────────────────── */}
      <section className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="bento-tile flex flex-col justify-center">
           <h4 className="text-sm font-black uppercase tracking-widest mb-4">Before You Arrive</h4>
           <p className="text-sm text-slate-500 leading-relaxed font-bold">
             Understand your rights, salary benchmarks, and the QID process before your first day.
           </p>
           <a href="/qatar-services/qid" className="mt-8 flex items-center gap-3 text-xs font-black text-primary uppercase tracking-widest hover:underline">
              QID Application Guide <span className="material-symbols-outlined text-sm">east</span>
           </a>
        </div>
        <div className="bento-tile bg-slate-50 dark:bg-slate-900 border-none flex flex-col justify-center text-center">
           <h4 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-2">Legal Certainty</h4>
           <p className="text-xs font-black text-slate-400 uppercase tracking-[0.2em] leading-relaxed">
             All private sector contracts are subject to Qatar Law No. 14 of 2004.
           </p>
        </div>
      </section>

      <RelatedGuides guides={[
        { href: "/qatar-labour-law",       icon: "gavel",      title: "Labour Law",         description: "Know your rights: working hours, minimum wage, notice periods, and reforms." },
        { href: "/qatar-salary-guide",     icon: "bar_chart",  title: "Salary Guide",        description: "Benchmark your package across Tech, Engineering, and Finance sectors." },
        { href: "/qatar-visa-requirements", icon: "id_card",   title: "Visa Requirements",   description: "Visa-free entry, work residency, and family visit rules explained." },
      ]} />
      </div>
    </>
  );
}
