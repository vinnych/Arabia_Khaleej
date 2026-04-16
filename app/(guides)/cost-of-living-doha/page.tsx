import ProtocolHero from "@/components/protocols/ProtocolHero";
import ProtocolGrid from "@/components/protocols/ProtocolGrid";
import ProtocolVerification from "@/components/protocols/ProtocolVerification";
import RelatedGuides from "@/components/RelatedGuides";
import { pageMeta, SITE_URL } from "@/lib/seo";
import { safeJsonLd } from "@/lib/utils";

export const metadata = pageMeta({
  title: "Qatar Lifestyle Economy 2026 | Elite Cost of Living Registry | Arabia Khaleej",
  description: "Elite curator analysis of the Doha economic landscape. Independent insights on housing protocols, lifestyle expenditures, and fiscal advantages in the State of Qatar.",
  path: "/cost-of-living-doha",
  keywords: ["Qatar cost of living registry", "Doha rent protocols 2026", "Qatar lifestyle expenditure", "tax-free living Doha", "Arabia Khaleej economy"],
});

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
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: safeJsonLd({ "@context": "https://schema.org", "@type": "BreadcrumbList", itemListElement: [{ "@type": "ListItem", position: 1, name: "Home", item: SITE_URL }, { "@type": "ListItem", position: 2, name: "Cost Index", item: `${SITE_URL}/cost-of-living-doha` }] }) }} />

      <div className="max-w-7xl mx-auto px-6 py-2 sm:py-12 flex flex-col gap-24">
        <ProtocolHero 
          category="Lifestyle Analytics"
          titleEn="Cost Index"
          titleAr="مؤشر التكلفة"
          description="A granular analysis of the economic lifestyle within the Doha metropolitan area. Curated for the global professional seeking to maximize the advantages of a tax-free fiscal environment."
          crumbs={[{ label: "Home", href: "/" }, { label: "Guides" }, { label: "Cost Index" }]}
        />

        <ProtocolGrid 
          points={[
            { label: "Personal Tax", value: "0.00%", icon: "payments" },
            { label: "Purchase Power", value: "Elite Tier", icon: "shopping_bag" },
            { label: "Currency Status", value: "USD Pegged", icon: "currency_exchange" },
            { label: "Lifestyle Rank", value: "Global Hub", icon: "diamond" },
          ]}
        />

        <section className="space-y-12">
          <div>
            <h2 className="luxury-text text-5xl">Expenditure Registry</h2>
            <p className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400 mt-4">Estimated Monthly Allocation (QAR)</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-1">
             {[
               { item: "Executive Housing", cost: "8,000+", sub: "Tier-1 Districts" },
               { item: "Family Schooling", cost: "Variable", sub: "International Curriculums" },
               { item: "Utility Protocols", cost: "1,200+", sub: "Fiber + Energy" },
               { item: "Private Transport", cost: "2,000+", sub: "Leasing / Finance" },
             ].map(row => (
               <div key={row.item} className="insider-card flex flex-col justify-between min-h-[180px]">
                  <h4 className="text-[10px] font-black uppercase tracking-widest text-slate-400">{row.item}</h4>
                  <div>
                    <p className="text-2xl font-serif italic font-black text-primary">{row.cost}</p>
                    <p className="text-[10px] font-bold text-slate-300 uppercase tracking-widest mt-1">{row.sub}</p>
                  </div>
               </div>
             ))}
          </div>
        </section>

        <section className="space-y-12">
          <div>
            <h2 className="luxury-text text-5xl">District Profiles</h2>
            <p className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400 mt-4">Neighbourhood Character & Market Status</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-1">
            {[
              { t: "The Pearl / Lusail", p: "Registry High", l: "Elite Waterfront", d: "The pinnacle of luxury living, featuring high-rise apartments and extensive promenade access." },
              { t: "West Bay Hub", p: "Mid-to-High", l: "Diplomatic Center", d: "Smart-city living and historical fusion. Proximity to the financial district and major embassies." },
              { t: "Msheireb Downtown", p: "Tier 1", l: "Sustainable Luxury", d: "Regenerated historical heart of Doha, focusing on heritage and sustainable smart-living." },
              { t: "Al Wakra / South", p: "Emerging Value", l: "Coastal Growth", d: "Rapidly expanding residential hubs offering high-value housing for larger families." },
            ].map(area => (
              <div key={area.t} className="insider-card group">
                 <div className="flex justify-between items-start mb-6">
                    <h3 className="text-2xl font-bold tracking-tight">{area.t}</h3>
                    <span className="text-[10px] font-black text-primary uppercase tracking-widest border border-primary/20 px-3 py-1 rounded-full">{area.p}</span>
                 </div>
                 <p className="text-sm text-slate-500 leading-relaxed font-medium mb-4">{area.d}</p>
                 <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em]">{area.l}</p>
              </div>
            ))}
          </div>
        </section>

        <div className="insider-card bg-primary !text-white border-none p-12 flex flex-col md:flex-row items-center gap-10">
           <div className="flex-1 space-y-4">
              <h3 className="luxury-text text-5xl">Strategic Advantage</h3>
              <p className="text-sm font-medium text-white/70 leading-relaxed italic">
                 Zero personal income tax in the State of Qatar yields a take-home performance significantly higher than global averages. Curate your lifestyle across Doha&apos;s diverse professional districts to maximize this fiscal protocol.
              </p>
           </div>
           <div className="flex gap-4">
              <a href="/qatar-salary-guide" className="px-8 py-4 bg-white text-primary rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-accent transition-all">Salary Guide</a>
           </div>
        </div>

        <ProtocolVerification 
          sourceName="Planning and Statistics Authority (PSA)" 
          sourceUrl="https://www.psa.gov.qa" 
        />

        <RelatedGuides guides={[
          { href: "/qatar-salary-guide",    icon: "bar_chart",   title: "Salary Guide",     description: "Compare salaries across Engineering, Tech, and Finance to plan your budget." },
          { href: "/work-in-qatar",         icon: "work",        title: "Work in Qatar",    description: "Everything you need to prepare before and after arriving in Qatar." },
          { href: "/community-resources",   icon: "groups",      title: "Community Resources", description: "Banking, healthcare, schools, and expat life essentials in Doha." },
        ]} />
      </div>
    </>
  );
}

