import { pageMeta, SITE_URL } from "@/lib/seo";
import { safeJsonLd } from "@/lib/utils";
import DisclaimerBanner from "@/components/DisclaimerBanner";
import BreadcrumbNav from "@/components/BreadcrumbNav";
import RelatedGuides from "@/components/RelatedGuides";

export const metadata = pageMeta({
  title: "Qatar Visa & Residency Guide 2026 | Independent Hub",
  description: "Independent guide to Qatar visa requirements for 2026. Explore visa-free entry, Hayya platform updates, and residency procedures for the State of Qatar.",
  path: "/qatar-visa-requirements",
  keywords: ["Qatar visa requirements", "Qatar tourist visa 2026", "Hayya visa Qatar", "Qatar residency"],
});

export default function QatarVisaRequirementsPage() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: [
      {
        "@type": "Question",
        name: "Which countries are visa-free for Qatar?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Over 100 nationalities including the US, UK, EU, and GCC citizens receive visa-free entry or free visa-on-arrival in Qatar.",
        },
      },
    ],
  };

  return (
    <div className="max-w-7xl mx-auto px-6 py-12 space-y-20">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: safeJsonLd(jsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: safeJsonLd({ "@context": "https://schema.org", "@type": "BreadcrumbList", itemListElement: [{ "@type": "ListItem", position: 1, name: "Home", item: SITE_URL }, { "@type": "ListItem", position: 2, name: "Visa Requirements", item: `${SITE_URL}/qatar-visa-requirements` }] }) }} />

      <BreadcrumbNav crumbs={[{ label: "Home", href: "/" }, { label: "Guides" }, { label: "Visa Requirements" }]} />

      {/* ── Premium National Hero ────────────────────────────── */}
      <section className="bento-tile bg-gradient-to-br from-primary to-primary-dark !text-white border-none min-h-[400px] flex items-center relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-white/5 rounded-full blur-[100px] translate-x-1/3 -translate-y-1/3" />
        <div className="relative z-10 w-full max-w-3xl">
          <p className="text-[10px] font-black uppercase tracking-[0.3em] text-white/60 mb-6">National Archive · Residency</p>
          <h1 className="national-title text-6xl sm:text-8xl italic mb-8">
            <span className="lang-en">Qatar Visa</span>
            <span className="lang-ar">تأشيرة قطر</span>
          </h1>
          <p className="text-sm font-medium text-white/70 leading-relaxed mb-10 max-w-md">
            Your definitive digital roadmap for entering and residing in the State of Qatar. Updated for 2026 regulatory standards.
          </p>
          <div className="flex flex-wrap gap-4">
            <a href="https://portal.moi.gov.qa" className="bg-white text-primary px-8 py-4 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-slate-50 transition-all">Official Portal</a>
            <a href="https://hayya.qa" className="bg-white/10 text-white border border-white/20 px-8 py-4 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-white/20 transition-all">Hayya Platform</a>
          </div>
        </div>
      </section>

      {/* ── Disclaimer ─────────────────────────────────────── */}
      <DisclaimerBanner
        officialSourceUrl="https://portal.moi.gov.qa"
        officialSourceName="Qatar Ministry of Interior — Visa Portal"
        lastReviewed="March 2026"
      />

      {/* ── Core Information Grid ────────────────────────────── */}
      <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {[
          { 
            title: "Visa-Free Entry", 
            icon: "flight_takeoff", 
            desc: "Citizens of over 100 countries are eligible for visa-free entry. Duration ranges from 30 to 90 days depending on nationality."
          },
          { 
            title: "Work Residency", 
            icon: "badge", 
            desc: "Supported by local sponsorship. All residents receive a QID within 30 days of arrival. NOC requirements have been abolished." 
          },
          { 
            title: "Family Visit", 
            icon: "family_restroom", 
            desc: "For those with resident relatives. Requires proof of kinship and valid residency of the sponsor in Qatar." 
          }
        ].map(item => (
          <div key={item.title} className="bento-tile group">
            <span className="material-symbols-outlined text-primary text-4xl mb-6 group-hover:scale-110 transition-transform">{item.icon}</span>
            <h3 className="text-xl font-bold mb-3 tracking-tight">{item.title}</h3>
            <p className="text-sm text-slate-500 leading-relaxed">{item.desc}</p>
          </div>
        ))}
      </section>

      {/* ── The Process ───────────────────────────────────────── */}
      <section className="bento-tile bg-slate-900 !text-white border-none shadow-2xl">
        <div className="mb-12">
          <h2 className="national-title text-4xl mb-2">Step-by-Step</h2>
          <p className="text-xs font-black text-white/40 uppercase tracking-widest">Entry Application Flow</p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-12">
          {[
            { n: "01", t: "Eligibility", d: "Check your nationality's status on the MOI portal." },
            { n: "02", t: "Submission", d: "Apply via Hayya or MOI with passport & photo scans." },
            { n: "03", t: "Verification", d: "Most visas process within 3–5 business days." },
            { n: "04", t: "Arrival", d: "Present your digital visa at Hamad International." }
          ].map(step => (
            <div key={step.n} className="flex flex-col gap-4">
              <span className="text-4xl font-black text-primary italic opacity-50">{step.n}</span>
              <h4 className="font-bold tracking-tight">{step.t}</h4>
              <p className="text-xs text-white/50 leading-relaxed">{step.d}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── FAQ & Legal ───────────────────────────────────────── */}
      <section className="max-w-4xl mx-auto space-y-12">
        <div className="text-center">
          <h2 className="national-title text-5xl italic">Clarifications</h2>
        </div>
        <div className="grid gap-4">
          {[
            { q: "Can I extend a tourist visa?", a: "Yes, extensions are possible for a further 30 days via the Metrash2 app or MOI portal for a fee of QAR 200." },
            { q: "Do I need travel insurance?", a: "Health insurance is mandatory for all visitors to Qatar and can be purchased from authorized providers upon arrival or online." }
          ].map(faq => (
            <details key={faq.q} className="group bento-tile !p-8 hover:border-primary transition-all">
              <summary className="flex justify-between items-center cursor-pointer list-none font-bold tracking-tight">
                {faq.q}
                <span className="material-symbols-outlined text-primary group-open:rotate-180 transition-transform">expand_more</span>
              </summary>
              <p className="mt-6 text-sm text-slate-500 leading-relaxed">{faq.a}</p>
            </details>
          ))}
        </div>
      </section>

      <RelatedGuides guides={[
        { href: "/work-in-qatar",       icon: "work",        title: "Work in Qatar",    description: "The full roadmap for relocating and starting your professional life in Qatar." },
        { href: "/qatar-services/qid",  icon: "badge",       title: "QID Application",  description: "Step-by-step guide to getting your Qatar ID card after arrival." },
        { href: "/qatar-metro",         icon: "subway",      title: "Doha Metro",       description: "Navigate the city — metro lines, fares, and station guide." },
      ]} />
    </div>
  );
}
