import Link from "next/link";
import { ArrowLeft, Clock, Banknote, Zap, ExternalLink } from "lucide-react";
import EligibilityScale from "@/components/visuals/EligibilityScale";
import DocStack from "@/components/visuals/DocStack";
import StepGarden from "@/components/visuals/StepGarden";
import DisclaimerBanner from "@/components/DisclaimerBanner";
import BreadcrumbNav from "@/components/BreadcrumbNav";
import type { GuideData } from "@/lib/qatar-services-data";

interface Props {
  guide: GuideData;
}

export default function GuidePageLayout({ guide }: Props) {
  const totalFees = guide.fees.reduce((s, f) => s + f.amount, 0);
  const timeLabel =
    guide.minDays === guide.maxDays
      ? `${guide.minDays} days`
      : `${guide.minDays}–${guide.maxDays} days`;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 sm:py-12 space-y-12 sm:space-y-20">

      <BreadcrumbNav crumbs={[{ label: "Home", href: "/" }, { label: "Services", href: "/qatar-services" }, { label: guide.title }]} />

      {/* ── Premium Service Hero ─────────────────────────── */}
      <section className="bento-tile bg-gradient-to-br from-primary to-primary-dark !text-white border-none min-h-[300px] sm:min-h-[400px] flex items-center relative overflow-hidden shadow-2xl">
        <div className="absolute top-0 right-0 w-96 h-96 bg-white/5 rounded-full blur-[100px] translate-x-1/3 -translate-y-1/3" />
        <div className="relative z-10 w-full max-w-4xl">
          <Link href="/qatar-services" className="flex items-center gap-2 label-mobile text-white/40 mb-8 hover:text-white transition-colors">
            <ArrowLeft size={14} /> <span className="lang-en">Back to Directory</span>
          </Link>
          <div className="flex items-center gap-2 mb-6">
             <span className="text-[10px] font-black uppercase tracking-widest px-3 py-1 bg-white/10 border border-white/10 rounded-full text-accent whitespace-nowrap">For: {guide.role}</span>
             {guide.fastTrack && <span className="text-[10px] font-black uppercase tracking-widest px-3 py-1 bg-amber-500/20 border border-amber-500/20 rounded-full text-amber-300 flex items-center gap-1"><Zap size={10} /> Fast Track</span>}
          </div>
          <h1 className="national-title text-5xl sm:text-8xl mb-8 italic leading-[0.9] tracking-tighter">
             <span className="lang-en">{guide.title}</span>
          </h1>
          <p className="text-sm font-medium text-white/50 leading-relaxed max-w-xl mb-12 italic">
            {guide.intro}
          </p>
          <div className="flex flex-wrap gap-x-8 gap-y-6 border-t border-white/10 pt-10">
            <div>
               <p className="label-mobile text-white/30 mb-1 flex items-center gap-1"><Clock size={12} /> Timeline</p>
               <p className="text-xl font-black">{timeLabel}</p>
            </div>
            <div>
               <p className="label-mobile text-white/30 mb-1 flex items-center gap-1"><Banknote size={12} /> Fees</p>
               <p className="text-xl font-black text-accent">{totalFees === 0 ? "Free" : `~QAR ${totalFees.toLocaleString()}`}</p>
            </div>
            <div>
               <p className="label-mobile text-white/30 mb-1">Requirements</p>
               <p className="text-xl font-black">{guide.docs.length} Documents</p>
            </div>
          </div>
        </div>
      </section>

      {/* ── Practical Framework ────────────────────────────── */}
      <section className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        <EligibilityScale criteria={guide.eligibility} />
        <DocStack docs={guide.docs} />
      </section>

      {/* ── Disclaimer ─────────────────────────────────────── */}
      <DisclaimerBanner
        officialSourceUrl="https://www.hukoomi.gov.qa"
        officialSourceName="Hukoomi — Qatar e-Government Portal"
        lastReviewed="March 2026"
      />

      {/* ── Procedural Flow ────────────────────────────────── */}
      <section className="space-y-12">
        <div className="text-center">
           <h2 className="national-title text-5xl italic">The Process</h2>
           <p className="text-xs font-black text-slate-400 uppercase tracking-widest mt-2">Step-by-step Execution</p>
        </div>
        <StepGarden steps={guide.steps} />
      </section>

      {/* ── Fee Breakdown & Legal ───────────────────────────── */}
      <section className="grid grid-cols-1 lg:grid-cols-3 gap-12">
         <div className="lg:col-span-2 bento-tile !p-0 overflow-hidden shadow-xl">
            <div className="p-5 sm:p-8 border-b border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 flex justify-between items-center">
              <h3 className="label-mobile">Official Fee Matrix</h3>
              <span className="label-mobile px-3 py-1 bg-primary/5 text-primary rounded-full border border-primary/10 transition-colors">Est. 2026</span>
           </div>
           
           {/* Mobile Card list */}
           <div className="sm:hidden divide-y divide-slate-100 dark:divide-slate-900">
              {guide.fees.map(f => (
                <div key={f.label} className="p-5 flex justify-between items-center bg-white dark:bg-slate-950">
                   <div className="label-mobile text-slate-500 lowercase first-letter:uppercase">{f.label}</div>
                   <div className="font-black text-sm text-slate-950 dark:text-white">{f.amount === 0 ? "Free" : `QAR ${f.amount.toLocaleString()}`}</div>
                </div>
              ))}
              <div className="p-5 flex justify-between items-center bg-primary/5">
                 <div className="label-mobile text-primary">Total Due</div>
                 <div className="text-xl font-black text-primary">{totalFees === 0 ? "Free" : `~QAR ${totalFees.toLocaleString()}`}</div>
              </div>
           </div>

           {/* Desktop Table */}
           <table className="hidden sm:table w-full text-left">
              <tbody className="divide-y divide-slate-100 dark:divide-slate-900">
                {guide.fees.map(f => (
                  <tr key={f.label} className="group hover:bg-slate-50 dark:hover:bg-slate-900/50">
                     <td className="py-6 px-8 text-xs font-bold text-slate-600 dark:text-slate-400 uppercase tracking-widest">{f.label}</td>
                     <td className="py-6 px-8 text-sm font-black text-slate-900 dark:text-slate-100 text-right">{f.amount === 0 ? "Free" : `QAR ${f.amount.toLocaleString()}`}</td>
                  </tr>
                ))}
                <tr className="bg-primary/5">
                   <td className="py-6 px-8 text-xs font-black uppercase tracking-[0.2em] text-primary">Calculation Total</td>
                   <td className="py-6 px-8 text-lg font-black text-primary text-right">{totalFees === 0 ? "Free" : `~QAR ${totalFees.toLocaleString()}`}</td>
                </tr>
              </tbody>
           </table>
         </div>

         <div className="space-y-8">
            <div className="bento-tile !bg-slate-900 !text-white border-none p-10 flex flex-col justify-center min-h-[300px] relative overflow-hidden">
               <span className="material-symbols-outlined absolute -right-5 -top-5 text-[150px] text-white/5 rotate-12">verified</span>
               <h4 className="text-[10px] font-black uppercase tracking-widest text-primary mb-4">Official Portals</h4>
               <div className="space-y-4 relative z-10">
                  {guide.portals.map(p => (
                    <a key={p.name} href={p.url} target="_blank" className="flex items-center justify-between text-xs font-bold text-white/70 hover:text-white transition-colors group">
                       {p.name} <ExternalLink size={12} className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                    </a>
                  ))}
               </div>
            </div>
            {guide.tips.length > 0 && (
              <div className="bento-tile bg-emerald-50 dark:bg-emerald-950/20 !border-emerald-100/50">
                 <h4 className="text-[10px] font-black uppercase tracking-widest text-emerald-600 mb-4">Concierge Tips</h4>
                 <ul className="space-y-4">
                    {guide.tips.map(tip => (
                      <li key={tip} className="text-xs font-medium text-emerald-800 dark:text-emerald-500 leading-relaxed flex gap-3">
                         <span className="text-emerald-400 shrink-0">→</span> {tip}
                      </li>
                    ))}
                 </ul>
              </div>
            )}
         </div>
      </section>

      {/* ── FAQ Overlay ─────────────────────────────────────── */}
      {guide.faq.length > 0 && (
        <section className="space-y-8 max-w-4xl mx-auto">
           <div className="text-center">
              <h2 className="national-title text-4xl italic">Clarifications</h2>
           </div>
           <div className="grid gap-4">
             {guide.faq.map(item => (
               <details key={item.q} className="group bento-tile !p-8 hover:border-primary transition-all">
                  <summary className="flex justify-between items-center cursor-pointer list-none font-bold tracking-tight text-sm uppercase">
                     {item.q}
                     <span className="material-symbols-outlined text-primary group-open:rotate-180 transition-transform">expand_more</span>
                  </summary>
                  <p className="mt-6 text-sm text-slate-500 leading-relaxed font-medium italic">{item.a}</p>
               </details>
             ))}
           </div>
        </section>
      )}
    </div>
  );
}
