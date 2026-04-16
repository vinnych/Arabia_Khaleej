import { pageMeta, SITE_URL } from "@/lib/seo";
import { safeJsonLd } from "@/lib/utils";
import BreadcrumbNav from "@/components/BreadcrumbNav";
import RelatedGuides from "@/components/RelatedGuides";

export const metadata = pageMeta({
  title: "Qatar Emergency Contacts 2026 | Public Contact Directory",
  description: "Emergency contact numbers for the State of Qatar. Police, Ambulance, Fire, and Consular contacts for residents and visitors.",
  path: "/emergency-numbers-qatar",
  keywords: ["999 Qatar", "emergency numbers Doha", "embassy contacts Qatar", "police Qatar", "ambulance help"],
});

export default function EmergencyNumbersQatarPage() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: [
      {
        "@type": "Question",
        name: "What is the primary emergency number in Qatar?",
        acceptedAnswer: { "@type": "Answer", text: "The primary emergency number for police, fire, and ambulance is 999." },
      },
    ],
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: safeJsonLd(jsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: safeJsonLd({ "@context": "https://schema.org", "@type": "BreadcrumbList", itemListElement: [{ "@type": "ListItem", position: 1, name: "Home", item: SITE_URL }, { "@type": "ListItem", position: 2, name: "Emergency Contacts", item: `${SITE_URL}/emergency-numbers-qatar` }] }) }} />

      <div className="max-w-7xl mx-auto px-6 py-2 sm:py-12 flex flex-col gap-12 sm:gap-20">
        <BreadcrumbNav crumbs={[{ label: "Home", href: "/" }, { label: "Guides" }, { label: "Emergency Numbers" }]} />

      {/* ── National Response Hero ─────────────────────────── */}
      <section className="bento-tile bg-gradient-to-br from-rose-900 via-primary-dark to-slate-950 !text-white border-none min-h-[400px] flex items-center relative overflow-hidden shadow-2xl">
        <div className="absolute top-0 right-0 w-96 h-96 bg-red-600/10 rounded-full blur-[100px] translate-x-1/3 -translate-y-1/3 animate-pulse" />
        <div className="relative z-10 w-full max-w-4xl">
          <p className="text-[10px] font-black uppercase tracking-[0.3em] text-white/60 mb-6">Directorate of Public Safety · 2026</p>
          <h1 className="national-title text-6xl sm:text-9xl mb-8 italic leading-[0.8]">
             <span className="lang-en">First Response</span>
             <span className="lang-ar">الاستجابة الأولى</span>
          </h1>
          <p className="text-sm font-medium text-white/50 leading-relaxed max-w-md">
            The consolidated registry of emergency, consular, and utility services for the State of Qatar.
          </p>
        </div>
      </section>

      {/* ── High-Priority Dashboard ────────────────────────── */}
      <section className="grid grid-cols-1 lg:grid-cols-12 gap-12">
        <div className="lg:col-span-8 grid grid-cols-1 sm:grid-cols-2 gap-8">
           {[
             { title: "Universal Rescue", s: "Police · Fire · Med", num: "999", color: "bg-primary !text-white" },
             { title: "Traffic Response", s: "Road Safety Unit", num: "96600", color: "bg-slate-900 !text-white" },
             { title: "Energy Hub", s: "Water & Electricity", num: "991", color: "bg-amber-400 !text-primary" },
             { title: "Hamad Medical", s: "Hospital Gateway", num: "44393", color: "bg-slate-50 dark:bg-slate-900" },
           ].map(card => (
             <a key={card.title} href={`tel:${card.num}`} className={`bento-tile flex flex-col justify-between p-10 min-h-[240px] border-none shadow-xl active:scale-95 transition-all ${card.color}`}>
                <div>
                   <h4 className="text-[10px] font-black uppercase tracking-[0.2em] opacity-60 mb-2">{card.s}</h4>
                   <h3 className="text-2xl font-black italic tracking-tight">{card.title}</h3>
                </div>
                <div className="flex items-center gap-4">
                   <span className="text-5xl font-black italic">{card.num}</span>
                   <span className="material-symbols-outlined">call</span>
                </div>
             </a>
           ))}
        </div>

        <div className="lg:col-span-4 bento-tile flex flex-col justify-center bg-slate-50 dark:bg-slate-900 border-none">
           <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-primary mb-6">Language Support</h3>
           <p className="text-sm text-slate-500 leading-relaxed font-medium">
             Emergency operators in Qatar are multi-lingual. Support is available for <b>English, Arabic, Hindi, Tagalog, and Urdu</b> speakers.
           </p>
           <div className="mt-8 pt-8 border-t border-slate-200 dark:border-slate-800 flex flex-wrap gap-4 font-black text-[9px] text-slate-400 uppercase tracking-widest">
              <span>EN</span><span>AR</span><span>HI</span><span>TL</span><span>UR</span>
           </div>
        </div>
      </section>

      {/* ── Consular Directory ──────────────────────────────── */}
      <section className="space-y-12">
        <div>
          <h2 className="national-title text-4xl">Consular Services</h2>
          <p className="text-xs font-black text-slate-400 uppercase tracking-widest mt-2">Embassy & Diplomatic Support</p>
        </div>

        <div className="bento-tile !p-0 overflow-hidden shadow-2xl">
          <table className="w-full text-left">
            <thead className="bg-slate-50 dark:bg-slate-950">
               <tr className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                  <th className="py-6 px-8 whitespace-nowrap">Distinction</th>
                  <th className="py-6 px-8">Consular Hotline</th>
                  <th className="py-6 px-8">Location Hub</th>
               </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-900">
               {[
                 { c: "India", n: "4425 5777", l: "Al Hilal" },
                 { c: "United Kingdom", n: "4496 2000", l: "West Bay" },
                 { c: "Pakistan", n: "4467 9210", l: "Al Dafna" },
                 { c: "United States", n: "4496 6000", l: "Al Luqta" },
                 { c: "Philippines", n: "4483 6444", l: "Al Hilal" },
               ].map(row => (
                 <tr key={row.c} className="group hover:bg-slate-50 dark:hover:bg-slate-900/50">
                    <td className="py-6 px-8 text-xs font-black uppercase tracking-widest text-slate-900 dark:text-slate-100 group-hover:text-primary transition-colors">{row.c}</td>
                    <td className="py-6 px-8 text-xs font-bold text-slate-500 group-hover:text-slate-900 dark:group-hover:text-slate-100"><a href={`tel:${row.n}`}>{row.n}</a></td>
                    <td className="py-6 px-8 text-xs font-black text-slate-400 uppercase tracking-[0.2em]">{row.l}</td>
                 </tr>
               ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* ── Social Support ──────────────────────────────────── */}
      <section className="bento-tile bg-primary-dark !text-white border-none flex flex-col md:flex-row items-center gap-12 p-12">
        <div className="flex-1">
           <h3 className="national-title text-5xl mb-6 italic">Aman Hotline</h3>
           <p className="text-sm font-medium text-white/60 leading-relaxed italic">
             Providing a safe haven and advocacy for women and children in the State of Qatar. Secure, confidential, and professional assistance.
           </p>
        </div>
        <a href="tel:919" className="w-[180px] h-[180px] shrink-0 rounded-full bg-accent flex flex-col items-center justify-center text-primary shadow-2xl shadow-accent/20 hover:scale-105 transition-all outline outline-8 outline-white/5">
           <span className="text-5xl font-black italic mb-1 tracking-tighter">919</span>
           <span className="label-xs">Aman Help</span>
        </a>
      </section>

      <RelatedGuides guides={[
        { href: "/community-resources",   icon: "groups",      title: "Community Resources", description: "Healthcare, banking, schools, and expat life support in Qatar." },
        { href: "/qatar-labour-law",      icon: "gavel",       title: "Labour Law",          description: "Know your rights if you face issues with an employer." },
        { href: "/qatar-visa-requirements", icon: "id_card",   title: "Visa Requirements",   description: "Entry and residency rules for visitors and workers." },
      ]} />
      </div>
    </>
  );
}
