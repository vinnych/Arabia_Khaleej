import Link from "next/link";
import ProtocolHero from "@/components/protocols/ProtocolHero";
import ProtocolVerification from "@/components/protocols/ProtocolVerification";
import { pageMeta, SITE_URL } from "@/lib/seo";
import { safeJsonLd } from "@/lib/utils";
import { GUIDES, GUIDE_SUMMARIES, GUIDE_SLUGS } from "@/lib/qatar-services-data";

export const metadata = pageMeta({
  title: "Administrative Protocol Registry | Boutique Service Directory | Arabia Khaleej",
  description: "Elite curator registry for public services in the State of Qatar. Step-by-step navigation for residency, licensing, and commercial protocols with independent verification.",
  path: "/qatar-services",
  keywords: ["Qatar service registry", "Doha administrative protocols", "Hukoomi verification guide", "Qatar residential services", "Arabia Khaleej services"],
});

export default function QatarServicesPage() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: "Independent Qatar Service Protocols",
    url: `${SITE_URL}/qatar-services`,
    itemListElement: GUIDE_SLUGS.map((slug, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: GUIDES[slug].title,
      url: `${SITE_URL}/qatar-services/${slug}`,
    })),
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: safeJsonLd(jsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: safeJsonLd({ "@context": "https://schema.org", "@type": "BreadcrumbList", itemListElement: [{ "@type": "ListItem", position: 1, name: "Home", item: SITE_URL }, { "@type": "ListItem", position: 2, name: "Service Registry", item: `${SITE_URL}/qatar-services` }] }) }} />

      <div className="max-w-7xl mx-auto px-6 py-2 sm:py-12 flex flex-col gap-24">
        <ProtocolHero 
          category="Administrative Protocols"
          titleEn="Service Registry"
          titleAr="سجل الخدمات"
          description="The consolidated gateway for administrative, civic, and commercial procedures in the State of Qatar. Independently curated for the global professional seeking structural clarity."
          crumbs={[{ label: "Home", href: "/" }, { label: "Service Registry" }]}
        />

        <section className="space-y-12">
          <div>
            <h2 className="luxury-text text-5xl">Active Protocols</h2>
            <p className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400 mt-4">Structural Navigation & Verification Guides</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-1">
            {GUIDE_SLUGS.map((slug) => {
              const guide = GUIDES[slug];
              const summary = GUIDE_SUMMARIES[slug];
              const hasOfficialRate = guide.fees.some(f => f.amount === undefined);
              const totalFees = guide.fees.reduce((s, f) => s + (f.amount || 0), 0);
              const feeDisplay = hasOfficialRate ? "Official Rate" : totalFees === 0 ? "Free Access" : `QAR ${totalFees}`;
              
              return (
                <Link key={slug} href={`/qatar-services/${slug}`} className="insider-card group flex flex-col min-h-[320px] justify-between">
                  <div>
                    <div className="text-3xl mb-8 group-hover:scale-110 transition-transform inline-block">
                       {summary.icon}
                    </div>
                    <h3 className="text-xl font-bold tracking-tight mb-3 group-hover:text-primary transition-colors">{guide.title}</h3>
                    <p className="text-xs text-slate-500 leading-relaxed font-medium line-clamp-3">{summary.tagline}</p>
                  </div>
                  
                  <div className="pt-8 border-t border-slate-50 flex items-center justify-between">
                    <div className="flex gap-6">
                      <div>
                        <p className="text-[9px] font-black text-slate-300 uppercase tracking-widest">Market Status</p>
                        <p className="text-[10px] font-black text-primary uppercase mt-0.5">{feeDisplay}</p>
                      </div>
                      <div>
                        <p className="text-[9px] font-black text-slate-300 uppercase tracking-widest">Protocol Cycle</p>
                        <p className="text-[10px] font-black text-slate-900 uppercase mt-0.5">{guide.minDays}-{guide.maxDays} Units</p>
                      </div>
                    </div>
                    <span className="material-symbols-outlined text-slate-300 group-hover:text-primary transition-colors">east</span>
                  </div>
                </Link>
              );
            })}
          </div>
        </section>

        <ProtocolVerification 
          sourceName="Qatar e-Government Portal (Hukoomi)" 
          sourceUrl="https://hukoomi.gov.qa" 
        />
      </div>
    </>
  );
}

