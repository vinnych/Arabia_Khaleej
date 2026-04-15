import { pageMeta, SITE_URL } from "@/lib/seo";
import { safeJsonLd } from "@/lib/utils";

export const metadata = pageMeta({
  title: "About Qatar Portal | The Digital Concierge Protocol",
  description: "An independent hobby project dedicated to the State of Qatar. Built on the principles of speed, anonymity, and high-density information architecture.",
  path: "/about",
});

export default function AboutPage() {
  return (
    <div className="max-w-7xl mx-auto px-6 py-20 space-y-32">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: safeJsonLd({ "@context": "https://schema.org", "@type": "WebPage", name: "About Qatar Portal", url: `${SITE_URL}/about` }) }} />

      {/* ── The Visionary Hero ────────────────────────────── */}
      <section className="relative min-h-[60vh] flex flex-col justify-center">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary/5 rounded-full blur-[120px] -translate-y-1/2 translate-x-1/2" />
        <p className="text-[10px] font-black uppercase tracking-[0.4em] text-primary mb-8 border-l-2 border-primary pl-4">Established 2026 · Doha Protocol</p>
        <h1 className="national-title text-7xl md:text-[10rem] italic leading-[0.75] tracking-tighter mb-12">
          Independent <br />
          <span className="text-primary">Intelligence.</span>
        </h1>
        <p className="text-lg font-medium text-slate-500 max-w-2xl leading-relaxed">
          Qatar Portal is an unofficial digital experiment. We curate the pulse of the State into a singular, premium interface designed for the modern resident.
        </p>
      </section>

      {/* ── Core Mandates ─────────────────────────────────── */}
      <section className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {[
          {
            title: "Safe AI Integration",
            desc: "Our AI protocols are strictly defined by our Legal Manifesto. We use intelligence for categorization and translation, ensuring every human-facing fact is verified.",
            icon: "database"
          },
          {
            title: "Zero-PII Architecture",
            desc: "We do not store your identity. No accounts, no cookies, no logs. Your anonymity is a structural feature of our serverless foundation.",
            icon: "shield"
          },
          {
            title: "Glanceable High-Density",
            desc: "Optimized for the State of Qatar. We provide the information you need in seconds, from prayer times to visa roadmaps, without the noise.",
            icon: "bolt"
          }
        ].map(mandate => (
          <div key={mandate.title} className="bento-tile p-10 space-y-6 group hover:bg-slate-50 transition-colors">
            <span className="material-symbols-outlined text-primary text-3xl">{mandate.icon}</span>
            <h3 className="text-xs font-black uppercase tracking-widest">{mandate.title}</h3>
            <p className="text-[11px] font-medium text-slate-500 leading-relaxed">{mandate.desc}</p>
          </div>
        ))}
      </section>

      {/* ── Technical Independence ───────────────────────── */}
      <section className="grid grid-cols-1 md:grid-cols-2 gap-20 items-center">
        <div className="bento-tile bg-slate-900 !text-white border-none p-16 shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-primary/20 rotate-45 translate-x-1/2 -translate-y-1/2 blur-[60px]" />
          <h2 className="national-title text-5xl mb-8 italic">Serverless Native.</h2>
          <p className="text-sm font-medium text-white/50 leading-relaxed mb-10">
            Built using Next.js and Vercel's global edge network. Our infrastructure is designed for the State of Qatar's high-speed mobile connectivity.
          </p>
          <div className="flex flex-wrap gap-3">
             {['Next.js 16', 'Tailwind', 'Framer', 'Official APIs'].map(tech => (
               <span key={tech} className="px-3 py-1 bg-white/10 rounded-full text-[9px] font-black uppercase tracking-widest">{tech}</span>
             ))}
          </div>
        </div>
        <div className="space-y-8">
          <h2 className="national-title text-5xl italic text-slate-900 dark:text-white">Community Driven.</h2>
          <p className="text-sm text-slate-500 leading-relaxed font-medium">
            This is a hobby project born from the need for a beautiful, unified Qatar resource. We iterate based on public feedback and the evolving needs of the 85% expat population residing in the State.
          </p>
          <p className="text-xs font-black uppercase tracking-widest text-[#8A1538]">Status: Independent Web Project</p>
          <div className="flex gap-4">
             <a href="https://github.com/vinnych/Qatar-portal" target="_blank" className="text-[10px] font-black uppercase tracking-widest border-b-2 border-primary pb-1 hover:text-primary transition-colors">View the Archive</a>
             <a href="/contact" className="text-[10px] font-black uppercase tracking-widest border-b-2 border-slate-200 pb-1 hover:border-primary transition-all">Report Accuracy</a>
          </div>
        </div>
      </section>

      {/* ── Final Disclosure ─────────────────────────────── */}
      <footer className="text-center py-20 border-t border-slate-100 dark:border-slate-800">
         <p className="text-[9px] font-black text-slate-400 uppercase tracking-[0.5em] mb-4">Non-Governmental · Unofficial · 2026</p>
         <p className="text-[10px] font-medium text-slate-400 max-w-lg mx-auto leading-relaxed italic">
           All data is sourced from public endpoints. Accuracy is monitored but verification remains the responsibility of the end user.
         </p>
      </footer>
    </div>
  );
}
