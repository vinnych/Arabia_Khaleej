import { pageMeta, SITE_URL } from "@/lib/seo";
import { safeJsonLd } from "@/lib/utils";
import BreadcrumbNav from "@/components/BreadcrumbNav";
import RelatedGuides from "@/components/RelatedGuides";

export const metadata = pageMeta({
  title: "Doha Metro Guide 2026 | Lines, Fares & Map",
  description: "Navigate the State of Qatar with an independent Doha Metro guide. Detailed info on the Red, Green, and Gold lines, station maps, and fare information.",
  path: "/qatar-metro",
  keywords: ["Doha Metro", "Qatar Metro guide", "Metro fares Qatar", "Red Line Doha", "Gold Line Metro"],
});

const LINES = [
  {
    name: "Red Line",
    color: "from-red-600 to-red-900",
    route: "Lusail QNB ↔ Al Wakra / HIA",
    desc: "The primary north-south artery connecting the coastal cities to Doha's heart at Msheireb.",
    key: ["Lusail", "Katara", "West Bay", "Msheireb", "Wakra"],
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
    key: ["Villaggio", "Sport City", "Souq Waqif", "Msheireb"],
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
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: safeJsonLd({ "@context": "https://schema.org", "@type": "BreadcrumbList", itemListElement: [{ "@type": "ListItem", position: 1, name: "Home", item: SITE_URL }, { "@type": "ListItem", position: 2, name: "Metro Guide", item: `${SITE_URL}/qatar-metro` }] }) }} />

      <div className="max-w-7xl mx-auto px-6 py-2 sm:py-12 flex flex-col gap-12 sm:gap-20">
        <BreadcrumbNav crumbs={[{ label: "Home", href: "/" }, { label: "Guides" }, { label: "Doha Metro" }]} />

      {/* ── National Transport Hero ─────────────────────────── */}
      <section className="bento-tile bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 !text-white border-none min-h-[450px] flex items-center relative overflow-hidden shadow-2xl">
        <div className="absolute inset-0 opacity-20 pointer-events-none">
           <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_50%_120%,rgba(138,21,56,0.5),transparent)]" />
        </div>
        <div className="relative z-10 w-full max-w-4xl">
          <div className="flex items-center gap-3 mb-8 bg-white/5 border border-white/10 px-4 py-2 rounded-full w-fit">
            <span className="material-symbols-outlined text-primary text-sm">directions_subway</span>
            <p className="text-[10px] font-black uppercase tracking-[0.3em] text-white/60">Qatar Rail · National Network</p>
          </div>
          <h1 className="national-title text-6xl sm:text-9xl mb-10 italic leading-[0.8]">
             <span className="lang-en">Metro Doha</span>
             <span className="lang-ar">مترو الدوحة</span>
          </h1>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-8 border-t border-white/10 pt-10">
            {[
              { l: "Operating Hours", v: "06:00 – 23:00" },
              { l: "Min. Fare", v: "2.00 QAR" },
              { l: "Station Count", v: "37 Modern Hubs" },
              { l: "Class Options", v: "Standard & Gold" },
            ].map(stat => (
              <div key={stat.l}>
                <p className="text-[10px] font-black text-white/30 uppercase tracking-widest mb-1">{stat.l}</p>
                <p className="text-xl font-black text-primary">{stat.v}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── The Network ─────────────────────────────────────── */}
      <section className="space-y-12">
        <div className="text-center">
          <h2 className="national-title text-5xl">The Network</h2>
          <p className="text-xs font-black text-slate-400 uppercase tracking-widest mt-2">Automated Rapid Transport Lines</p>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {LINES.map(line => (
            <div key={line.name} className="bento-tile flex flex-col group hover:border-primary/20 transition-all">
              <div className={`h-2 w-full rounded-full bg-gradient-to-r ${line.color} mb-8`} />
              <h3 className="text-2xl font-black mb-2 tracking-tight">{line.name}</h3>
              <p className="text-xs font-black text-primary uppercase tracking-widest mb-4">{line.route}</p>
              <p className="text-sm text-slate-500 leading-relaxed mb-8 flex-1">{line.desc}</p>
              <div className="flex flex-wrap gap-2">
                {line.key.map(s => (
                  <span key={s} className="px-3 py-1 bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-lg text-[10px] font-bold text-slate-400">
                    {s}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── Fare Structure & Hours ───────────────────────────── */}
      <section className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        <div className="bento-tile !p-0 overflow-hidden">
          <div className="p-8 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center">
             <h3 className="text-xl font-black tracking-tight uppercase">Fare Matrix</h3>
             <span className="px-3 py-1 bg-primary/5 text-primary text-[10px] font-black rounded-full uppercase tracking-widest border border-primary/10">Public Rates</span>
          </div>
          <table className="w-full text-left">
             <thead className="bg-slate-50 dark:bg-slate-950">
               <tr className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                  <th className="py-6 px-8">Class</th>
                  <th className="py-6 px-8">Single Trip</th>
                  <th className="py-6 px-8">Daily Cap</th>
               </tr>
             </thead>
             <tbody className="divide-y divide-slate-50 dark:divide-slate-900">
               {[
                 { c: "Standard", s: "2 QAR", d: "6 QAR" },
                 { c: "Goldclub", s: "10 QAR", d: "30 QAR" },
                 { c: "Haza Card", s: "10 QAR", d: "Base Price" },
               ].map(row => (
                 <tr key={row.c} className="group hover:bg-slate-50 dark:hover:bg-slate-900/50">
                   <td className="py-6 px-8 text-sm font-black text-slate-900 dark:text-slate-100 uppercase tracking-wider">{row.c}</td>
                   <td className="py-6 px-8 font-mono text-sm font-bold text-slate-500">{row.s}</td>
                   <td className="py-6 px-8 font-mono text-sm font-bold text-primary">{row.d}</td>
                 </tr>
               ))}
             </tbody>
          </table>
        </div>

        <div className="bento-tile bg-primary-dark !text-white border-none flex flex-col justify-center p-12 relative overflow-hidden shadow-xl shadow-primary/20">
          <span className="material-symbols-outlined absolute -right-10 -bottom-10 text-[200px] text-white/5 rotate-12">schedule</span>
          <h3 className="national-title text-5xl mb-8 italic">Operating Hours</h3>
          <div className="space-y-6 relative z-10">
            {[
              { d: "Saturday – Wednesday", t: "06:00 – 23:00" },
              { d: "Thursday", t: "06:00 – 23:59" },
              { d: "Friday", t: "14:00 – 23:59" },
            ].map(row => (
              <div key={row.d} className="flex justify-between items-center border-b border-white/10 pb-4">
                <span className="text-xs font-black uppercase tracking-widest text-white/60">{row.d}</span>
                <span className="text-lg font-black font-mono">{row.t}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Travel Concierge Tips ───────────────────────────── */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {[
          { title: "Goldclub Access", icon: "stars", desc: "Experience the pinnacle of urban transport with premium seating and panoramic views for a refined journey." },
          { title: "Family Zones", icon: "family_restroom", desc: "Dedicated carriages for women and children ensure a comfortable and private commute across the city." },
          { title: "Smart Connectivity", icon: "wifi", desc: "High-speed Wi-Fi and USB charging across all stations and trains keep you connected en route." },
        ].map(tip => (
          <div key={tip.title} className="bento-tile !bg-slate-50 dark:!bg-slate-900 border-none group">
            <span className="material-symbols-outlined text-primary text-3xl mb-6 group-hover:scale-110 transition-transform">{tip.icon}</span>
            <h4 className="font-bold mb-3 uppercase tracking-tighter text-sm">{tip.title}</h4>
            <p className="text-xs text-slate-500 leading-relaxed font-medium">{tip.desc}</p>
          </div>
        ))}
      </section>

      <RelatedGuides guides={[
        { href: "/community-resources",   icon: "groups",    title: "Community Resources", description: "Getting around Doha: taxis, Karwa, Uber, and what to expect as a new resident." },
        { href: "/cost-of-living-doha",   icon: "home_work", title: "Cost of Living",      description: "Transport costs in context — how much you'll spend getting around Doha monthly." },
        { href: "/qatar-public-holidays", icon: "calendar_month", title: "Public Holidays", description: "Know when metro schedules change during national and Islamic holidays." },
      ]} />
      </div>
    </>
  );
}
