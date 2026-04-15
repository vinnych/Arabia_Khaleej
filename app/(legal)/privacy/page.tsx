import { pageMeta, SITE_URL } from "@/lib/seo";
import { safeJsonLd } from "@/lib/utils";

export const metadata = pageMeta({
  title: "Privacy Manifesto | The Zero-PII Protocol",
  description: "Our structural commitment to user anonymity in the State of Qatar. No cookies, no logs, no identifiers.",
  path: "/privacy",
});

export default function PrivacyPage() {
  return (
    <div className="max-w-4xl mx-auto px-6 py-20 space-y-24">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: safeJsonLd({ "@context": "https://schema.org", "@type": "WebPage", name: "Privacy Manifesto", url: `${SITE_URL}/privacy` }) }} />

      {/* ── The Manifesto Header ─────────────────────────── */}
      <section className="space-y-8">
        <p className="text-[10px] font-black uppercase tracking-[0.4em] text-primary">Anonymity by Design</p>
        <h1 className="national-title text-6xl md:text-9xl italic leading-tight">Privacy <br/> Protocol.</h1>
        <p className="text-sm font-medium text-slate-500 leading-relaxed max-w-xl">
          In an era of invasive data harvesting, Qatar Portal operates on a structural "Zero-PII" mandate. We do not store your identity because we do not need it.
        </p>
      </section>

      {/* ── Structural Pillars ───────────────────────────── */}
      <div className="space-y-16">
         {[
           {
             title: "1. Zero-PII Ingress",
             desc: "We do not use databases to store user identity. There are no accounts, no email lists, and no registration pathways. Every session is treated as a transient, anonymous interaction.",
             footer: "Status: No Backend Storage for User Data"
           },
           {
             title: "2. Transient Geolocation",
             desc: "When you locate yourself for prayer or weather data, the coordinates are processed only for that specific request. We do not log location history or map IP addresses to physical identities.",
             footer: "Encryption: TLS 1.3 Active"
           },
           {
             title: "3. Cookie-Less Philosophy",
             desc: "Qatar Portal does not deploy first-party tracking cookies. Your navigation patterns are not stored beyond the local browser session cached for performance.",
             footer: "Target: Zero First-Party Cookies"
           }
         ].map(pillar => (
           <div key={pillar.title} className="group border-l-4 border-slate-100 dark:border-slate-800 pl-8 space-y-4">
              <h2 className="text-xs font-black uppercase tracking-widest text-[#8A1538]">{pillar.title}</h2>
              <p className="text-sm font-medium text-slate-500 leading-relaxed">{pillar.desc}</p>
              <p className="text-[9px] font-black text-slate-300 uppercase tracking-widest">{pillar.footer}</p>
           </div>
         ))}
      </div>

      {/* ── Third Party Disclosures ──────────────────────── */}
      <section className="bento-tile bg-slate-50 dark:bg-slate-950 p-12 border-none space-y-8">
         <h2 className="text-xs font-black uppercase tracking-widest text-on-surface">External Intelligence</h2>
         <p className="text-[11px] font-medium text-slate-500 leading-relaxed">
           To provide a high-performance experience, we leverage industry-standard infrastructure. These providers may process anonymous technical metadata (IP, browser type) to deliver content.
         </p>
         <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {[
              { n: "Vercel", f: "Edge Compute & Hosting" },
              { n: "Google AdSense", f: "Contextual Advertising" },
              { n: "Open-Meteo", f: "Weather Telemetry" },
              { n: "Aladhan API", f: "Prayer Schedule Data" },
            ].map(item => (
              <div key={item.n} className="bg-white dark:bg-white/5 p-4 rounded-xl border border-slate-200/50">
                 <h4 className="text-[10px] font-black uppercase tracking-widest mb-1">{item.n}</h4>
                 <p className="text-[10px] font-medium text-slate-400 italic">{item.f}</p>
              </div>
            ))}
         </div>
      </section>

      {/* ── Contact for Privacy ─────────────────────────── */}
      <section className="text-center pt-20 border-t border-slate-100 dark:border-slate-800">
         <h2 className="national-title text-4xl italic mb-6">Concerns?</h2>
         <p className="text-sm text-slate-500 mb-8 font-medium">As a hobby project, we take privacy seriously. Reach out via our unofficial channels for any protocol questions.</p>
         <a href="/contact" className="inline-block px-10 py-5 bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900 rounded-2xl font-black text-[10px] uppercase tracking-widest shadow-xl">Contact Protocol</a>
      </section>

      <footer className="text-center py-12">
        <p className="text-[9px] font-black text-slate-300 uppercase tracking-[0.4em]">Protocol Version 1.2 · April 2026</p>
      </footer>
    </div>
  );
}
