import { pageMeta, SITE_URL } from "@/lib/seo";
import { safeJsonLd } from "@/lib/utils";

export const metadata = pageMeta({
  title: "Terms of Protocol | Independent User Agreement",
  description: "The legal and operational agreement governing the use of the Qatar Portal hobby project. Unofficial, independent, and provided as-is.",
  path: "/terms",
});

export default function TermsPage() {
  return (
    <div className="max-w-4xl mx-auto px-6 py-20 space-y-24">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: safeJsonLd({ "@context": "https://schema.org", "@type": "BreadcrumbList", itemListElement: [{ "@type": "ListItem", position: 1, name: "Home", item: SITE_URL }, { "@type": "ListItem", position: 2, name: "Terms", item: `${SITE_URL}/terms` }] }) }} />

      {/* ── Terms Header ─────────────────────────────────── */}
      <section className="space-y-8">
        <p className="text-[10px] font-black uppercase tracking-[0.4em] text-primary">Protocol & Governance</p>
        <h1 className="national-title text-6xl md:text-9xl italic leading-tight">Terms of <br/> Protocol.</h1>
        <div className="bento-tile !bg-primary/5 border-primary/10 p-8">
           <p className="text-[10px] font-black text-primary leading-relaxed uppercase tracking-widest">
             Important: This portal is a non-registered hobby project. We are not a government agency.
           </p>
        </div>
      </section>

      {/* ── The Articles ─────────────────────────────────── */}
      <div className="space-y-20">
         {[
           {
             id: "01",
             title: "Unofficial Independent Status",
             content: "Qatar Portal is a private, independent web project. It is not affiliated, authorized, maintained, or sponsored by the State of Qatar or any of its government bodies including Hukoomi, the Ministry of Interior, or the Ministry of Labour."
           },
           {
             id: "02",
             title: "The 'Manual Verification' Mandate",
             content: "All data—including Prayer Times, Visa Roadmaps, and Utility Directories—is sourced from public endpoints. While we strive for accuracy, users are strictly mandated to manually verify sensitive information with official government portals before taking action."
           },
           {
             id: "03",
             title: "Limitation on Commercial Use",
             content: "As a hobby project, this platform is for individual informational use only. Commercially exploiting, scraping, or redistributing the data found here is prohibited without prior voluntary consensus."
           },
           {
             id: "04",
             title: "No Liability for Information",
             content: "By using this protocol, you waive any claim for liability against the project creator resulting from inaccuracies or technical failures. We provide a 'best effort' service without legal warranties."
           }
         ].map(article => (
           <div key={article.id} className="grid grid-cols-1 md:grid-cols-4 gap-4 items-start">
             <span className="text-sm font-serif font-black italic text-slate-200">{article.id}</span>
             <div className="md:col-span-3 space-y-4">
                <h2 className="text-xs font-black uppercase tracking-widest text-[#8A1538]">{article.title}</h2>
                <p className="text-sm font-medium text-slate-500 leading-relaxed">{article.content}</p>
             </div>
           </div>
         ))}
      </div>

      {/* ── Closure ───────────────────────────────────────── */}
      <section className="pt-20 border-t border-slate-100 dark:border-slate-800 text-center">
         <h2 className="national-title text-4xl italic mb-6">Agreement</h2>
         <p className="text-sm text-slate-500 mb-8 font-medium italic">
           Continuing to access this archive constitutes your acceptance of the Doha Hobbyist Protocol.
         </p>
         <div className="flex justify-center gap-4">
             <a href="/about" className="text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-primary">Learn About the Project</a>
             <span className="text-slate-200">|</span>
             <a href="/contact" className="text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-primary">Contact Operator</a>
         </div>
      </section>

      <footer className="text-center py-12">
        <p className="text-[9px] font-black text-slate-300 uppercase tracking-[0.4em]">Protocol Version 2.0 · Doha 2026</p>
      </footer>
    </div>
  );
}
