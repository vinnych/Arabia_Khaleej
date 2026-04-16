import ProtocolHero from "@/components/protocols/ProtocolHero";
import ProtocolGrid from "@/components/protocols/ProtocolGrid";
import ProtocolVerification from "@/components/protocols/ProtocolVerification";
import RelatedGuides from "@/components/RelatedGuides";
import { pageMeta, SITE_URL } from "@/lib/seo";
import { safeJsonLd } from "@/lib/utils";

export const metadata = pageMeta({
  title: "Qatar Community Registry 2026 | Elite Expat Lifestyle Guide | Arabia Khaleej",
  description: "Elite curator analysis of banking, healthcare, and education protocols in the State of Qatar. Independent lifestyle registry for professional residents.",
  path: "/community-resources",
  keywords: ["Qatar community registry", "Doha expat lifestyle", "Qatar banking protocols", "healthcare in Doha", "Arabia Khaleej community"],
});

const BANKS = [
  { name: "Qatar National Bank (QNB)", type: "State Institution", note: "Premier banking network with extensive global reach.", url: "https://www.qnb.com" },
  { name: "Commercial Bank of Qatar", type: "Private Label", note: "Leading digital innovation in the Qatari retail sector.", url: "https://www.cbq.qa" },
  { name: "HSBC Qatar", type: "International Hub", note: "Preferred choice for British and European professionals.", url: "https://www.hsbc.com.qa" },
  { name: "Doha Bank", type: "Regional Specialist", note: "Advanced remittance protocols for international corridors.", url: "https://www.dohabank.com.qa" },
];

export default function CommunityResourcesPage() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: [
      {
        "@type": "Question",
        name: "How do I open a bank account in Qatar?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Opening an account requires a valid Qatar ID (QID) and a No-Objection Letter from your employer.",
        },
      },
    ],
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: safeJsonLd(jsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: safeJsonLd({ "@context": "https://schema.org", "@type": "BreadcrumbList", itemListElement: [{ "@type": "ListItem", position: 1, name: "Home", item: SITE_URL }, { "@type": "ListItem", position: 2, name: "Community Registry", item: `${SITE_URL}/community-resources` }] }) }} />

      <div className="max-w-7xl mx-auto px-6 py-2 sm:py-12 flex flex-col gap-24">
        <ProtocolHero 
          category="Expat Lifestyle & Essentials"
          titleEn="Community"
          titleAr="مجتمع قطر"
          description="The definitive digital concierge for daily life in the State of Qatar. Granular insights into the protocols of banking, healthcare, and education for the global resident."
          crumbs={[{ label: "Home", href: "/" }, { label: "Guides" }, { label: "Community Registry" }]}
        />

        <ProtocolGrid 
          points={[
            { label: "Onboarding", value: "Verified QID", icon: "badge" },
            { label: "Financials", value: "Account Ready", icon: "account_balance" },
            { label: "Healthcare", value: "State Health Card", icon: "health_and_safety" },
            { label: "Education", value: "Global Standards", icon: "school" },
          ]}
        />

        {/* ── Financial Protocols ─────────────────────────── */}
        <section id="banking" className="space-y-12">
          <div>
            <h2 className="luxury-text text-5xl">Financial Protocols</h2>
            <p className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400 mt-4">Banking & Remittance Verification</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-1">
            <div className="insider-card bg-primary !text-white border-none space-y-8 p-12 lg:p-16">
               <h3 className="text-2xl font-bold tracking-tight">Onboarding Documentation</h3>
               <ul className="space-y-4">
                 {[
                   "Valid State Qatar ID (QID)",
                   "Original Passport Documentation",
                   "Employer No-Objection Letter (NOC)",
                   "Validated Residential Address",
                 ].map((item) => (
                   <li key={item} className="flex items-center gap-3 text-sm text-white/70">
                     <span className="w-1.5 h-1.5 rounded-full bg-accent shrink-0" />
                     {item}
                   </li>
                 ))}
               </ul>
            </div>
            
            <div className="grid grid-cols-1 gap-1">
              {BANKS.map((bank) => (
                <div key={bank.name} className="insider-card flex items-center justify-between group">
                  <div className="space-y-1">
                    <span className="text-[9px] font-black uppercase tracking-widest text-primary/40">{bank.type}</span>
                    <h4 className="text-base font-bold tracking-tight">{bank.name}</h4>
                    <p className="text-[10px] text-slate-500">{bank.note}</p>
                  </div>
                  <a href={bank.url} target="_blank" rel="noopener noreferrer" className="text-primary hover:scale-110 transition-transform">
                    <span className="material-symbols-outlined" style={{ fontSize: "18px" }}>open_in_new</span>
                  </a>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── Medical Registry ──────────────────────────── */}
        <section id="healthcare" className="space-y-12">
          <div>
            <h2 className="luxury-text text-5xl">Medical Registry</h2>
            <p className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400 mt-4">Healthcare Access & State Systems</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-1">
            <div className="insider-card col-span-1 md:col-span-2 space-y-8">
               <h3 className="text-2xl font-bold tracking-tight">Systemic Overview</h3>
               <p className="text-sm text-slate-600 leading-relaxed font-medium">
                  The Qatar healthcare landscape is bifurcated into a high-performance public network managed by Hamad Medical Corporation (HMC) and a sophisticated private sector. Residents are legally eligible for a Health Card, granting access to subsidized state-tier care.
               </p>
               <div className="flex gap-10">
                  <div>
                    <p className="text-2xl font-black font-serif italic text-primary">Emergency</p>
                    <p className="text-[10px] font-black uppercase tracking-widest text-slate-300 mt-1">999 · Protocol Zero</p>
                  </div>
                  <div>
                    <p className="text-2xl font-black font-serif italic text-primary">HMC Registry</p>
                    <p className="text-[10px] font-black uppercase tracking-widest text-slate-300 mt-1">Managed State Care</p>
                  </div>
               </div>
            </div>
            <div className="insider-card bg-slate-900 !text-white border-none flex flex-col justify-center text-center space-y-4">
               <span className="material-symbols-outlined text-accent text-5xl">health_and_safety</span>
               <h4 className="text-lg font-bold">Health Card Verification</h4>
               <p className="text-xs text-white/50 leading-relaxed">Mandatory for state care access. Renewals and applications managed via PHCC.</p>
               <a href="https://www.hmc.org.qa" className="text-[10px] font-black uppercase tracking-widest text-accent hover:underline">Verify Status</a>
            </div>
          </div>
        </section>

        {/* ── Educational Curriculums ─────────────────────── */}
        <section id="schools" className="space-y-12">
          <div>
            <h2 className="luxury-text text-5xl">Educational Standards</h2>
            <p className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400 mt-4">International Curriculums & Institution Profiles</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-4 gap-1">
             {[
               { t: "British Protocol", d: "IGCSE / A-Levels", v: "High Demand", icon: "school" },
               { t: "American Tier", d: "AP / IB Framework", v: "Elite Campus", icon: "history_edu" },
               { t: "Indian (CBSE)", d: "National Standards", v: "Mass Market", icon: "local_library" },
               { t: "French / German", d: "European Baccalaureate", v: "Bilingual Hub", icon: "language" },
             ].map(edu => (
               <div key={edu.t} className="insider-card flex flex-col justify-between min-h-[220px]">
                  <span className="material-symbols-outlined text-primary text-3xl">{edu.icon}</span>
                  <div>
                    <h4 className="text-base font-bold tracking-tight">{edu.t}</h4>
                    <p className="text-[10px] text-slate-500 mb-4">{edu.d}</p>
                    <span className="text-[9px] font-black uppercase tracking-widest text-primary/40 border border-primary/10 px-2 py-0.5 rounded-full">{edu.v}</span>
                  </div>
               </div>
             ))}
          </div>
        </section>

        {/* ── Settlement Protocol ────────────────────────── */}
        <section className="space-y-12">
          <div>
            <h2 className="luxury-text text-5xl">Settlement Protocols</h2>
            <p className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400 mt-4">Essential Logistics for the Professional Resident</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-1">
            {[
              { t: "Connectivity", icon: "smartphone", d: "Ooredoo and Vodafone 5G networks cover the metropolitan area. QID is mandatory for post-paid services." },
              { t: "Urban Transit", icon: "directions_car", d: "Private automotive protocols are primary. International licenses are recognized for a limited grace period." },
              { t: "Cultural Registry", icon: "mosque", d: "Respect state protocols regarding public modesty and religious observances, particularly during Ramadan." },
            ].map(tip => (
              <div key={tip.t} className="insider-card group">
                <span className="material-symbols-outlined text-primary text-3xl mb-6 group-hover:scale-110 transition-transform">{tip.icon}</span>
                <h4 className="text-sm font-bold uppercase tracking-tight mb-2">{tip.t}</h4>
                <p className="text-xs text-slate-500 leading-relaxed font-medium">{tip.d}</p>
              </div>
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
          { href: "/emergency-numbers-qatar", icon: "emergency",  title: "Emergency Numbers", description: "Police, hospitals, and embassy contacts for Qatar." },
        ]} />
      </div>
    </>
  );
}

