import ProtocolHero from "@/components/protocols/ProtocolHero";
import ProtocolGrid from "@/components/protocols/ProtocolGrid";
import ProtocolVerification from "@/components/protocols/ProtocolVerification";
import RelatedGuides from "@/components/RelatedGuides";
import { pageMeta, SITE_URL } from "@/lib/seo";
import { safeJsonLd } from "@/lib/utils";

export const metadata = pageMeta({
  title: "Qatar Emergency Registry | Elite Security & Rescue Protocol | Arabia Khaleej",
  description: "The definitive security registry for the State of Qatar. Elite access to police, rescue, medical, and diplomatic protocols for professional residents.",
  path: "/emergency-numbers-qatar",
  keywords: ["Qatar emergency numbers", "Doha rescue protocol", "Qatar police contact", "diplomatic registry Qatar", "Arabia Khaleej emergency"],
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
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: safeJsonLd({ "@context": "https://schema.org", "@type": "BreadcrumbList", itemListElement: [{ "@type": "ListItem", position: 1, name: "Home", item: SITE_URL }, { "@type": "ListItem", position: 2, name: "Emergency Registry", item: `${SITE_URL}/emergency-numbers-qatar` }] }) }} />

      <div className="max-w-7xl mx-auto px-6 py-2 sm:py-12 flex flex-col gap-24">
        <ProtocolHero 
          category="Public Safety & Rescue"
          titleEn="First Response"
          titleAr="الاستجابة الأولى"
          description="The consolidated registry of emergency, consular, and utility protocols for the State of Qatar. Secure, multi-lingual assistance available for all residents and visitors."
          crumbs={[{ label: "Home", href: "/" }, { label: "Guides" }, { label: "First Response" }]}
        />

        <ProtocolGrid 
          points={[
            { label: "Universal Rescue", value: "999", icon: "emergency" },
            { label: "Unified Health", value: "16000", icon: "medical_services" },
            { label: "Energy Hub", value: "991", icon: "bolt" },
            { label: "Patient Support", value: "16060", icon: "help_center" },
          ]}
        />

        <section className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          <div className="insider-card space-y-6">
            <h3 className="luxury-text text-5xl">Universal Rescue</h3>
            <p className="text-sm text-slate-500 leading-relaxed font-medium">
              The number <b>999</b> is the centralized portal for all life-critical emergencies including Police, Ambulance, and Civil Defense (Fire). Operators support multiple languages including English, Arabic, Hindi, Tagalog, and Urdu.
            </p>
          </div>
          <div className="insider-card bg-rose-950 !text-white border-none space-y-6">
             <h3 className="luxury-text text-5xl text-rose-200">Aman Hotline</h3>
             <p className="text-sm text-rose-100/60 leading-relaxed font-medium">
                Providing a safe haven and advocacy for women and children in the State of Qatar. Dial <b>919</b> for secure, confidential, and professional assistance.
             </p>
          </div>
        </section>

        <section className="space-y-12">
          <div>
            <h2 className="luxury-text text-5xl">Diplomatic Registry</h2>
            <p className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400 mt-4">Verified Consular Hubs</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-1">
             {[
               { c: "India", n: "4425 5777", l: "Al Hilal" },
               { c: "UK", n: "4496 2000", l: "West Bay" },
               { c: "Pakistan", n: "4467 9210", l: "Al Dafna" },
               { c: "USA", n: "4496 6000", l: "Al Luqta" },
               { c: "Philippines", n: "4483 6444", l: "Al Hilal" },
               { c: "Sri Lanka", n: "4467 4444", l: "Nuaija" }
             ].map(emb => (
               <div key={emb.c} className="insider-card group flex items-center justify-between">
                  <div>
                    <h4 className="text-xs font-bold text-slate-900 dark:text-slate-100 uppercase tracking-tight">{emb.c}</h4>
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-1">{emb.l}</p>
                  </div>
                  <a href={`tel:${emb.n}`} className="text-lg font-black italic text-primary group-hover:scale-110 transition-transform">
                    {emb.n}
                  </a>
               </div>
             ))}
          </div>
        </section>

        <ProtocolVerification 
          sourceName="Hukoomi Government Portal" 
          sourceUrl="https://hukoomi.gov.qa/en/article/emergency-numbers" 
        />

        <RelatedGuides guides={[
          { href: "/community-resources",   icon: "groups",      title: "Community Resources", description: "Healthcare, banking, schools, and expat life support in Qatar." },
          { href: "/qatar-visa-requirements", icon: "id_card",   title: "Visa Requirements",   description: "Entry and residency rules for visitors and workers." },
        ]} />
      </div>
    </>
  );
}

