import ProtocolHero from "@/components/protocols/ProtocolHero";
import ProtocolGrid from "@/components/protocols/ProtocolGrid";
import ProtocolVerification from "@/components/protocols/ProtocolVerification";
import RelatedGuides from "@/components/RelatedGuides";
import { pageMeta, SITE_URL } from "@/lib/seo";
import { safeJsonLd } from "@/lib/utils";

export const metadata = pageMeta({
  title: "Doha Metro & Logistics Protocol 2026 | Elite Transport Registry | Arabia Khaleej",
  description: "The definitive curator registry for the Doha Metro network. Elite insights on line protocols, station hubs, fare verification, and automated transit logistics.",
  path: "/qatar-metro",
  keywords: ["Doha metro protocol", "Qatar transport registry", "Doha metro lines 2026", "Qatar rail fare verification", "Arabia Khaleej metro"],
});

const LINES = [
  {
    name: "Red Line",
    color: "from-red-600 to-red-900",
    route: "Lusail QNB ↔ Al Wakra",
    desc: "The primary north-south artery connecting the coastal cities to Doha's heart at Msheireb.",
    key: ["Katara", "West Bay", "Msheireb", "HIA"],
  },
  {
    name: "Green Line",
    color: "from-emerald-600 to-emerald-900",
    route: "Al Riffa ↔ Al Mansoura",
    desc: "Linking the Education City hub and the historical districts to the central downtown area.",
    key: ["Education City", "QN Library", "Hamad Hospital", "Msheireb"],
  },
  {
    name: "Gold Line",
    color: "from-amber-500 to-amber-700",
    route: "Aziziyah ↔ Ras Bu Abboud",
    desc: "The historical corridor connecting the Aspire Zone to the heritage markets and seafront.",
    key: ["Villaggio", "Souq Waqif", "Msheireb"],
  },
];

export default function QatarMetroPage() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: [
      {
        "@type": "Question",
        name: "How many metro lines are in Doha?",
        acceptedAnswer: { "@type": "Answer", text: "Doha Metro consists of three automated lines: Red, Green, and Gold, intersecting at the Msheireb Central Station." },
      },
    ],
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: safeJsonLd(jsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: safeJsonLd({ "@context": "https://schema.org", "@type": "BreadcrumbList", itemListElement: [{ "@type": "ListItem", position: 1, name: "Home", item: SITE_URL }, { "@type": "ListItem", position: 2, name: "Salary Guide", item: `${SITE_URL}/qatar-salary-guide` }] }) }} />

      <div className="max-w-7xl mx-auto px-6 py-2 sm:py-12 flex flex-col gap-24">
        <ProtocolHero 
          category="Transport & Logistics"
          titleEn="Metro Doha"
          titleAr="مترو الدوحة"
          description="The definitive digital roadmap for navigating the State of Qatar. Experience the pinnacle of urban transport with one of the world's most advanced automated rail networks."
          crumbs={[{ label: "Home", href: "/" }, { label: "Guides" }, { label: "Metro Doha" }]}
        />

        <ProtocolGrid 
          points={[
            { label: "Operation Start", value: "06:00 Daily", icon: "schedule" },
            { label: "Fare Min", value: "QAR 2.00", icon: "payments" },
            { label: "Station Count", value: "37 Modern Hubs", icon: "directions_subway" },
            { label: "Technology", value: "Fully Automated", icon: "bolt" },
          ]}
        />

        <section className="space-y-12">
          <div>
            <h2 className="luxury-text text-5xl">The Network</h2>
            <p className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400 mt-4">Automated Rapid Transport Protocols</p>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-1">
            {LINES.map(line => (
              <div key={line.name} className="insider-card flex flex-col group">
                <div className={`h-1.5 w-full bg-gradient-to-r ${line.color} mb-12`} />
                <h3 className="text-2xl font-bold tracking-tight mb-2">{line.name}</h3>
                <p className="text-[10px] font-black text-primary uppercase tracking-widest mb-6">{line.route}</p>
                <p className="text-sm text-slate-500 leading-relaxed mb-8 flex-1">{line.desc}</p>
                <div className="flex flex-wrap gap-2">
                  {line.key.map(s => (
                    <span key={s} className="px-3 py-1 bg-slate-50 dark:bg-slate-900 text-[10px] font-bold text-slate-400 border border-slate-100 dark:border-slate-800 rounded-lg">
                      {s}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          <div className="insider-card space-y-8">
             <h3 className="luxury-text text-5xl">Fare Protocols</h3>
             <div className="space-y-6">
                {[
                  { c: "Standard Trip", p: "QAR 2.00" },
                  { c: "Goldclub Trip", p: "QAR 10.00" },
                  { c: "Daily Ceiling", p: "QAR 6.00 / 30.00", sub: "Standard / Gold" },
                ].map(row => (
                  <div key={row.c} className="flex justify-between items-baseline border-b border-slate-100 pb-4">
                    <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">{row.c}</span>
                    <div className="text-right">
                      <p className="text-lg font-bold text-primary">{row.p}</p>
                      {row.sub && <p className="text-[9px] font-black text-slate-300 uppercase tracking-widest">{row.sub}</p>}
                    </div>
                  </div>
                ))}
             </div>
          </div>

          <div className="insider-card bg-primary !text-white border-none flex flex-col justify-center">
             <h3 className="luxury-text text-5xl">Operating Cycle</h3>
             <div className="mt-12 space-y-6">
                {[
                  { d: "Sat – Wed", t: "06:00 – 23:00" },
                  { d: "Thursday", t: "06:00 – 23:59" },
                  { d: "Friday", t: "14:00 – 23:59" },
                ].map(row => (
                  <div key={row.d} className="flex justify-between items-center border-b border-white/10 pb-4">
                    <span className="text-[10px] font-black uppercase tracking-widest text-white/50">{row.d}</span>
                    <span className="text-lg font-black font-mono">{row.t}</span>
                  </div>
                ))}
             </div>
          </div>
        </section>

        <section className="grid grid-cols-1 md:grid-cols-3 gap-1">
          {[
            { title: "Goldclub", icon: "stars", desc: "Premium seating with panoramic views for a refined transit experience." },
            { title: "Family Zones", icon: "family_restroom", desc: "Dedicated quiet carriages for women and children on all lines." },
            { title: "Connectivity", icon: "wifi", desc: "High-speed Wi-Fi and USB charging across the entire network hub." },
          ].map(tip => (
            <div key={tip.title} className="insider-card group">
              <span className="material-symbols-outlined text-primary text-3xl mb-6 group-hover:rotate-12 transition-transform">{tip.icon}</span>
              <h4 className="text-sm font-bold uppercase tracking-tight mb-2">{tip.title}</h4>
              <p className="text-xs text-slate-500 leading-relaxed font-medium">{tip.desc}</p>
            </div>
          ))}
        </section>

        <ProtocolVerification 
          sourceName="Qatar Rail Official Portal" 
          sourceUrl="https://www.qr.com.qa" 
        />

        <RelatedGuides guides={[
          { href: "/community-resources",   icon: "groups",    title: "Community Resources", description: "Getting around Doha: taxis, Karwa, Uber, and what to expect as a new resident." },
          { href: "/cost-of-living-doha",   icon: "home_work", title: "Cost of Living",      description: "Transport costs in context — how much you'll spend getting around Doha monthly." },
        ]} />
      </div>
    </>
  );
}

