import { pageMeta, SITE_URL } from "@/lib/seo";
import { safeJsonLd } from "@/lib/utils";

export const metadata = pageMeta({
  title: "Contact Protocol | Reach the Arabia Khaleej Operator",
  description: "Official channels to reach the Arabia Khaleej hobbyist operator for feedback, data corrections, or technical inquiries.",
  path: "/contact",
});

export default function ContactPage() {
  return (
    <div className="max-w-4xl mx-auto px-6 py-20 space-y-24">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: safeJsonLd({ "@context": "https://schema.org", "@type": "ContactPage", url: `${SITE_URL}/contact` }) }} />

      {/* ── Contact Header ────────────────────────────────── */}
      <section className="space-y-8">
        <p className="text-[10px] font-black uppercase tracking-[0.4em] text-primary text-center md:text-left">Feedback & Intelligence</p>
        <h1 className="national-title text-6xl md:text-9xl italic leading-tight text-center md:text-left">Contact <br/> Protocol.</h1>
        <p className="text-sm font-medium text-slate-500 leading-relaxed max-w-xl text-center md:text-left mx-auto md:mx-0">
          As a hobby project, we depend on community oversight. If you find a data inaccuracy, a broken link, or have a technical suggestion, use the unofficial channels below.
        </p>
      </section>

      {/* ── Channels Grid ────────────────────────────────── */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
         <div className="bento-tile p-10 hover:bg-slate-50 transition-colors cursor-pointer group border-none bg-slate-50 dark:bg-slate-950">
            <span className="material-symbols-outlined text-primary mb-6 text-3xl">code</span>
            <h3 className="text-xs font-black uppercase tracking-widest mb-4">Technical Archive</h3>
            <p className="text-[11px] font-medium text-slate-500 leading-relaxed mb-8">
               For code-related feedback, bug reports, and data source discussions, please visit the official GitHub repository.
            </p>
            <a href="https://github.com/vinnych/Qatar-portal" target="_blank" className="inline-flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-[#8A1538]">
               View Archive <span className="material-symbols-outlined text-sm">east</span>
            </a>
         </div>

         <div className="bento-tile p-10 hover:bg-slate-50 transition-colors border-none bg-slate-50 dark:bg-slate-950">
            <span className="material-symbols-outlined text-primary mb-6 text-3xl">mail</span>
            <h3 className="text-xs font-black uppercase tracking-widest mb-4">Email Channel</h3>
            <p className="text-[11px] font-medium text-slate-500 leading-relaxed mb-8">
               Have a sensitive inquiry or a general suggestion? Reach out via our primary hobbyist email address.
            </p>
            <p className="text-xs font-black text-slate-900 dark:text-white uppercase tracking-widest">
               hello@qatar-portal.fake
            </p>
            <p className="text-[9px] font-bold text-slate-400 mt-1 uppercase italic tracking-widest">
               (Replace .fake with .com or use GitHub)
            </p>
         </div>
      </div>

      {/* ── Response Expectations ────────────────────────── */}
      <section className="bento-tile bg-primary/5 border-primary/10 p-12 text-center">
         <h3 className="text-xs font-black uppercase tracking-widest text-primary mb-4 italic">Response Protocol</h3>
         <p className="text-[11px] font-medium text-primary/70 leading-relaxed max-w-lg mx-auto uppercase tracking-widest">
           Since this is an independent hobby project, responses are not guaranteed and are provided on a best-effort, time-permitting basis. We appreciate your patience and your commitment to the Doha Protocol.
         </p>
      </section>

      <footer className="text-center py-12">
        <p className="text-[9px] font-black text-slate-300 uppercase tracking-[0.4em]">Protocol 1.0 · Integrated Contact Channel</p>
      </footer>
    </div>
  );
}
