import { pageMeta, SITE_URL } from "@/lib/seo";
import { safeJsonLd } from "@/lib/utils";
import DisclaimerBanner from "@/components/DisclaimerBanner";
import BreadcrumbNav from "@/components/BreadcrumbNav";
import RelatedGuides from "@/components/RelatedGuides";

export const metadata = pageMeta({
  title: "Cost of Living Doha 2026 | Lifestyle Analytics",
  description: "Explore the economic landscape of Doha, Qatar. A luxury concierge's guide to housing, schooling, transport, and leisure costs in a tax-free haven.",
  path: "/cost-of-living-doha",
  keywords: ["Cost of living Doha", "Qatar expenses 2026", "rent in Doha", "lifestyle Qatar"],
});

const SUMMARY = [
  { item: "Housing (1BR)", cost: "4.5k – 8k", family: "9k – 16k", bg: "bg-primary/5" },
  { item: "Education (Intl)", cost: "N/A", family: "2.5k – 5k", bg: "bg-slate-50 dark:bg-slate-900" },
  { item: "Utilities / Fiber", cost: "500 – 800", family: "1k – 1.8k", bg: "bg-primary/5" },
  { item: "Transportation", cost: "400 – 1.2k", family: "2k – 4k", bg: "bg-slate-50 dark:bg-slate-900" },
];

export default function CostOfLivingDohaPage() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: [
      {
        "@type": "Question",
        name: "How much is rent in Doha?",
        acceptedAnswer: { "@type": "Answer", text: "Rent varies significantly. A luxury 1BR in The Pearl starts at QAR 8,000, while central Doha (Al Sadd) offers units for QAR 4,500 – 6,500." },
      },
    ],
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: safeJsonLd(jsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: safeJsonLd({ "@context": "https://schema.org", "@type": "BreadcrumbList", itemListElement: [{ "@type": "ListItem", position: 1, name: "Home", item: SITE_URL }, { "@type": "ListItem", position: 2, name: "Cost of Living", item: `${SITE_URL}/cost-of-living-doha` }] }) }} />

      <div className="max-w-7xl mx-auto px-6 py-2 sm:py-12 flex flex-col gap-12 sm:gap-20">
        <BreadcrumbNav crumbs={[{ label: "Home", href: "/" }, { label: "Guides" }, { label: "Cost of Living" }]} />

      {/* ── Lifestyle Archive Hero ─────────────────────────── */}
      <section className="bento-tile bg-gradient-to-br from-primary to-primary-dark !text-white border-none min-h-[400px] flex items-center relative overflow-hidden shadow-2xl">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-white/5 rounded-full blur-[100px] translate-x-1/2 -translate-y-1/2" />
        <div className="relative z-10 w-full max-w-4xl">
          <p className="label-xs text-white/60 mb-6">Independent Guide · 2026</p>
          <h1 className="national-title text-6xl sm:text-9xl mb-8 italic leading-[0.8] tracking-tighter">
             <span className="lang-en">Living Index</span>
             <span className="lang-ar">مؤشر المعيشة</span>
          </h1>
          <p className="text-sm font-medium text-white/50 leading-relaxed max-w-md">
            A granular analysis of the economic lifestyle within the Doha metropolitan area. Curated for the global professional.
          </p>
        </div>
      </section>

      {/* ── Disclaimer ─────────────────────────────────────── */}
      <DisclaimerBanner
        officialSourceUrl="https://www.psa.gov.qa"
        officialSourceName="Qatar Planning and Statistics Authority"
        lastReviewed="March 2026"
      />

      {/* ── Monthly Allocation Dashboard ───────────────────── */}
      <section className="space-y-12">
        <div className="flex flex-col md:flex-row justify-between items-end gap-6">
          <div>
            <h2 className="national-title text-5xl">Monthly Costs</h2>
            <p className="text-xs font-black text-slate-400 uppercase tracking-widest mt-2">Estimated Monthly Expenses (QAR)</p>
          </div>
        </div>

        <div className="bento-tile !p-0 overflow-hidden shadow-xl">
           <table className="w-full text-left">
              <thead className="bg-slate-50 dark:bg-slate-950">
                 <tr className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                    <th className="py-6 px-8 whitespace-nowrap">Distinction</th>
                    <th className="py-6 px-8">Single Professional</th>
                    <th className="py-6 px-8">Family of Four</th>
                 </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {SUMMARY.map(row => (
                  <tr key={row.item} className={`group hover:bg-slate-50 dark:hover:bg-slate-900/50 ${row.bg}`}>
                     <td className="py-6 px-8 text-xs font-black uppercase tracking-widest text-slate-900 dark:text-slate-100 group-hover:text-primary transition-colors">{row.item}</td>
                     <td className="py-6 px-8 font-mono text-sm font-bold text-slate-500">{row.cost}</td>
                     <td className="py-6 px-8 font-mono text-sm font-bold text-primary">{row.family}</td>
                  </tr>
                ))}
              </tbody>
           </table>
        </div>
      </section>

      {/* ── Residential Districts ────────────────────────────── */}
      <section className="grid grid-cols-1 lg:grid-cols-12 gap-12">
        <div className="lg:col-span-8 space-y-12">
          <div>
            <h2 className="national-title text-4xl">Where to Live in Doha</h2>
            <p className="text-xs font-black text-slate-400 uppercase tracking-widest mt-2">Neighbourhoods & Typical Rents</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
            {[
              { t: "The Pearl / Lusail", p: "8,000+", l: "Exclusive Waterfront", d: "The pinnacle of luxury living, featuring high-rise apartments and extensive promenade access." },
              { t: "Msheireb / West Bay", p: "7,500+", l: "Central Business", d: "Smart-city living and historical fusion. Proximity to the financial district and major embassies." },
              { t: "Al Sadd / Najma", p: "5,000+", l: "Heritage Central", d: "Vibrant, high-density residential zones favored by seasoned professionals for their connectivity." },
              { t: "Al Wakra / South", p: "3,500+", l: "Coastal Serenity", d: "Rapidly expanding residential hubs offering high-value housing for larger families." },
            ].map(area => (
              <div key={area.t} className="bento-tile group">
                 <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">{area.l}</h4>
                 <h3 className="text-xl font-bold mb-1">{area.t}</h3>
                 <p className="text-sm font-black text-primary mb-4">Starts QAR {area.p}</p>
                 <p className="text-xs text-slate-500 leading-relaxed font-medium">{area.d}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="lg:col-span-4 bento-tile !bg-slate-900 !text-white border-none p-12 flex flex-col justify-center shadow-2xl relative overflow-hidden">
           <span className="material-symbols-outlined absolute -right-10 -bottom-10 text-[200px] text-white/5 rotate-12">receipt</span>
           <h3 className="national-title text-4xl mb-6 italic">Your Money Goes Further</h3>
           <p className="text-sm font-medium text-white/60 leading-relaxed mb-10">
             Zero personal income tax in Qatar means your take-home pay is <b>30-45% higher</b> in real terms compared to equivalent roles in Europe or North America.
           </p>
           <div className="flex gap-4">
              <a href="/currency" className="px-6 py-4 bg-primary text-white text-xs font-black uppercase tracking-widest rounded-2xl hover:scale-105 transition-all">Exchange Rates</a>
              <a href="/qatar-salary-guide" className="px-6 py-4 bg-white/10 text-white text-xs font-black uppercase tracking-widest rounded-2xl hover:bg-white/20 transition-all border border-white/20">Salary Guide</a>
           </div>
        </div>
      </section>

      <RelatedGuides guides={[
        { href: "/qatar-salary-guide",    icon: "bar_chart",   title: "Salary Guide",     description: "Compare salaries across Engineering, Tech, and Finance to plan your budget." },
        { href: "/work-in-qatar",         icon: "work",        title: "Work in Qatar",    description: "Everything you need to prepare before and after arriving in Qatar." },
        { href: "/community-resources",   icon: "groups",      title: "Community Resources", description: "Banking, healthcare, schools, and expat life essentials in Doha." },
      ]} />
      </div>
    </>
  );
}
