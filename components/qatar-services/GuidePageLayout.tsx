import Link from "next/link";
import ProtocolHero from "@/components/protocols/ProtocolHero";
import ProtocolGrid from "@/components/protocols/ProtocolGrid";
import ProtocolFlow from "@/components/protocols/ProtocolFlow";
import ProtocolVerification from "@/components/protocols/ProtocolVerification";
import RelatedGuides from "@/components/RelatedGuides";
import type { GuideData } from "@/lib/qatar-services-data";

interface Props {
  guide: GuideData;
}

export default function GuidePageLayout({ guide }: Props) {
  const hasOfficialRate = guide.fees.some(f => f.amount === undefined);
  const totalFees = guide.fees.reduce((s, f) => s + (f.amount || 0), 0);
  const feeDisplay = hasOfficialRate ? "Official Rate" : totalFees === 0 ? "Free Access" : `QAR ${totalFees}`;
  
  const timeLabel =
    guide.minDays === guide.maxDays
      ? `${guide.minDays} Units`
      : `${guide.minDays}–${guide.maxDays} Units`;

  return (
    <div className="max-w-7xl mx-auto px-6 py-2 sm:py-12 flex flex-col gap-24 font-sans">
      
      <ProtocolHero 
        category="Administrative Protocol"
        titleEn={guide.title}
        titleAr="إجراء رسمي"
        description={guide.intro}
        crumbs={[{ label: "Home", href: "/" }, { label: "Services", href: "/qatar-services" }, { label: guide.title }]}
      />

      <ProtocolGrid 
        points={[
          { label: "Protocol Cycle", value: timeLabel, icon: "schedule" },
          { label: "Market Status", value: feeDisplay, icon: "payments" },
          { label: "Registry Items", value: `${guide.docs.length} Required`, icon: "description" },
          { label: "Access Level", value: guide.role, icon: "shield_person" },
        ]}
      />

      {/* ── Eligibility & Documentation ──────────────────── */}
      <section className="grid grid-cols-1 lg:grid-cols-2 gap-1">
        <div className="insider-card space-y-8">
           <h3 className="luxury-text text-5xl">Eligibility</h3>
           <div className="space-y-6">
              {guide.eligibility.map(item => (
                <div key={item.label} className="flex items-center gap-4 group">
                  <span className={`w-2 h-2 rounded-full ${item.met ? 'bg-primary' : 'bg-slate-200'}`} />
                  <p className="text-sm font-medium text-slate-500 group-hover:text-primary transition-colors">{item.label}</p>
                </div>
              ))}
           </div>
        </div>
        <div className="insider-card bg-slate-900 !text-white border-none space-y-8">
           <h3 className="luxury-text text-5xl">Registry</h3>
           <div className="space-y-6">
              {guide.docs.map(doc => (
                <div key={doc} className="flex items-start gap-4 group">
                  <span className="material-symbols-outlined text-primary text-xl">folder_open</span>
                  <p className="text-sm font-medium text-white/70 group-hover:text-white transition-colors leading-relaxed">{doc}</p>
                </div>
              ))}
           </div>
        </div>
      </section>

      {/* ── Execution Path ────────────────────────────────── */}
      <ProtocolFlow steps={guide.steps} />

      {/* ── Fee Registry & Tips ───────────────────────────── */}
      <section className="grid grid-cols-1 lg:grid-cols-3 gap-12">
         <div className="lg:col-span-2 insider-card space-y-12">
            <h3 className="luxury-text text-5xl">Market Status</h3>
            <div className="space-y-6">
               {guide.fees.map(f => (
                 <div key={f.label} className="flex justify-between items-baseline border-b border-slate-100 pb-4">
                   <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">{f.label}</span>
                   <p className="text-lg font-bold text-primary">{f.amount === undefined ? "Official Register" : f.amount === 0 ? "Free" : `QAR ${f.amount.toLocaleString()}`}</p>
                 </div>
               ))}
               <div className="flex justify-between items-baseline pt-4">
                  <span className="text-[10px] font-black uppercase tracking-widest text-primary">Calculation Total</span>
                  <p className="text-3xl font-black font-serif italic text-primary">{feeDisplay}</p>
               </div>
            </div>
         </div>

         <div className="space-y-1">
            <div className="insider-card bg-primary !text-white border-none space-y-8 h-full flex flex-col justify-center">
               <h4 className="luxury-text text-4xl">Concierge</h4>
               <ul className="space-y-4">
                  {guide.tips.map(tip => (
                    <li key={tip} className="text-xs font-medium text-white/70 leading-relaxed italic border-l border-white/10 pl-4">
                       {tip}
                    </li>
                  ))}
               </ul>
            </div>
         </div>
      </section>

      {/* ── Portals ───────────────────────────────────────── */}
      <section className="insider-card space-y-12">
         <h3 className="luxury-text text-5xl">Official Verifications</h3>
         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {guide.portals.map(p => (
              <a key={p.name} href={p.url} target="_blank" className="flex items-center justify-between p-6 bg-slate-50 dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800 hover:border-primary transition-all group">
                 <span className="text-xs font-black uppercase tracking-widest text-slate-600 dark:text-slate-400 group-hover:text-primary">{p.name}</span>
                 <span className="material-symbols-outlined text-slate-300 group-hover:text-primary transition-colors">open_in_new</span>
              </a>
            ))}
         </div>
      </section>

      <ProtocolVerification 
        sourceName="Qatar e-Government Portal (Hukoomi)" 
        sourceUrl="https://hukoomi.gov.qa" 
      />

      <RelatedGuides guides={[
        { href: "/work-in-qatar",          icon: "work",        title: "Work in Qatar",    description: "Full relocation guide — visas, QID, onboarding checklist." },
        { href: "/cost-of-living-doha",    icon: "home_work",   title: "Cost of Living",   description: "Housing costs, school fees, and monthly budget breakdown." },
      ]} />
    </div>
  );
}

