import Link from "next/link";
import { pageMeta, SITE_URL } from "@/lib/seo";
import { safeJsonLd } from "@/lib/utils";
import { GUIDES, GUIDE_SUMMARIES, GUIDE_SLUGS } from "@/lib/qatar-services-data";
import BreadcrumbNav from "@/components/BreadcrumbNav";

export const metadata = pageMeta({
  title: "Qatar Services Directory 2026 | Independent Utility Gateway",
  description: "A comprehensive guide to public services in the State of Qatar. Step-by-step navigation for residency, licensing, and business protocols.",
  path: "/qatar-services",
  keywords: ["Qatar services", "QID guide", "Doha licensing", "public portals Qatar"],
});

export default function QatarServicesPage() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: "Independent Qatar Service Guides",
    url: `${SITE_URL}/qatar-services`,
    itemListElement: GUIDE_SLUGS.map((slug, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: GUIDES[slug].title,
      url: `${SITE_URL}/qatar-services/${slug}`,
    })),
  };

  return (
    <div className="max-w-7xl mx-auto px-6 py-12 space-y-20">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: safeJsonLd(jsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: safeJsonLd({ "@context": "https://schema.org", "@type": "BreadcrumbList", itemListElement: [{ "@type": "ListItem", position: 1, name: "Home", item: SITE_URL }, { "@type": "ListItem", position: 2, name: "Community Services", item: `${SITE_URL}/qatar-services` }] }) }} />

      <BreadcrumbNav crumbs={[{ label: "Home", href: "/" }, { label: "Services Directory" }]} />

      {/* ── National Utility Hero ─────────────────────────── */}
      <section className="bento-tile bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 !text-white border-none min-h-[400px] flex items-center relative overflow-hidden shadow-2xl">
        <div className="absolute top-0 right-0 w-96 h-96 bg-primary/10 rounded-full blur-[100px] translate-x-1/3 -translate-y-1/3" />
        <div className="relative z-10 w-full max-w-4xl">
          <p className="text-[10px] font-black uppercase tracking-[0.3em] text-white/60 mb-6">Independent Utility Archive · 2026</p>
          <h1 className="national-title text-6xl sm:text-9xl mb-10 italic leading-[0.8] tracking-tighter">
             <span className="lang-en">Public Services</span>
             <span className="lang-ar">الخدمات العامة</span>
          </h1>
          <p className="text-sm font-medium text-white/50 leading-relaxed max-w-md">
            The consolidated gateway for administrative, civic, and commercial procedures in the State of Qatar.
          </p>
        </div>
      </section>

      {/* ── Services Directory ──────────────────────────────── */}
      <section className="space-y-12">
        <div className="flex justify-between items-end border-b border-slate-100 dark:border-slate-800 pb-8">
           <div>
              <h2 className="national-title text-4xl">The Directory</h2>
              <p className="text-xs font-black text-slate-400 uppercase tracking-widest mt-2">Active Protocols & Guides</p>
           </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {GUIDE_SLUGS.map((slug) => {
            const guide = GUIDES[slug];
            const summary = GUIDE_SUMMARIES[slug];
            const totalFees = guide.fees.reduce((s, f) => s + f.amount, 0);
            
            return (
              <Link key={slug} href={`/qatar-services/${slug}`} className="bento-tile group hover:border-primary/20 transition-all flex flex-col min-h-[300px] justify-between">
                <div>
                   <div className="w-12 h-12 rounded-2xl bg-slate-50 dark:bg-slate-900 flex items-center justify-center text-2xl mb-6 group-hover:scale-110 transition-transform">
                      {summary.icon}
                   </div>
                   <h3 className="text-xl font-black mb-2 tracking-tight group-hover:text-primary transition-colors uppercase">{guide.title}</h3>
                   <p className="text-xs text-slate-500 leading-relaxed font-medium line-clamp-3">{summary.tagline}</p>
                </div>
                <div className="pt-8 flex items-center justify-between border-t border-slate-50 dark:border-slate-900 mt-8">
                   <div className="flex gap-4">
                      <div>
                         <p className="text-xs font-black text-slate-300 uppercase tracking-widest">Est. Fee</p>
                         <p className="text-xs font-black text-primary uppercase">{totalFees === 0 ? "Free" : `QAR ${totalFees}`}</p>
                      </div>
                      <div>
                         <p className="text-xs font-black text-slate-300 uppercase tracking-widest">Time</p>
                         <p className="text-xs font-black text-slate-900 dark:text-slate-100 uppercase">{guide.minDays}-{guide.maxDays} Days</p>
                      </div>
                   </div>
                   <span className="material-symbols-outlined text-slate-300 group-hover:text-primary transition-colors">east</span>
                </div>
              </Link>
            );
          })}
        </div>
      </section>

      {/* ── Official Source Reminder ────────────────────────── */}
      <section className="bento-tile bg-slate-900 !text-white border-none p-10 sm:p-12 flex flex-col md:flex-row items-start md:items-center gap-8">
        <div className="w-12 h-12 shrink-0 rounded-2xl bg-amber-400/10 border border-amber-400/20 flex items-center justify-center">
          <span className="material-symbols-outlined text-amber-400" style={{ fontSize: "22px", fontVariationSettings: "'FILL' 1" }}>verified</span>
        </div>
        <div className="flex-1">
           <h3 className="text-sm font-black uppercase tracking-widest text-white mb-2">Always Verify with Official Portals</h3>
           <p className="text-sm font-medium text-white/50 leading-relaxed">
             This directory is independently researched and has no affiliation with the State of Qatar or its ministries. Fees, timelines, and document requirements change — always confirm with the official government source before submitting any application.
           </p>
        </div>
        <a href="https://hukoomi.gov.qa" target="_blank" rel="noopener noreferrer" className="shrink-0 px-8 py-4 bg-white text-primary rounded-2xl font-black text-xs uppercase tracking-[0.2em] shadow-2xl shadow-black/20 hover:scale-105 transition-all whitespace-nowrap">
          Hukoomi Portal <span className="material-symbols-outlined align-middle" style={{ fontSize: "13px" }}>open_in_new</span>
        </a>
      </section>
    </div>
  );
}