import ProtocolHero from "@/components/protocols/ProtocolHero";
import ProtocolGrid from "@/components/protocols/ProtocolGrid";
import ProtocolVerification from "@/components/protocols/ProtocolVerification";
import RelatedGuides from "@/components/RelatedGuides";
import { pageMeta, SITE_URL } from "@/lib/seo";
import { safeJsonLd } from "@/lib/utils";

export const metadata = pageMeta({
  title: "Qatar State Calendar 2026 | Elite Public Holiday Registry | Arabia Khaleej",
  description: "The definitive curator registry of public holidays and national observances in the State of Qatar. Elite verification protocols for state and religious calendars.",
  path: "/qatar-public-holidays",
  keywords: ["Qatar public holiday registry", "Qatar National Day 2026", "Eid Al-Fitr 2026 Qatar", "Doha state calendar", "Arabia Khaleej holidays"],
});

const HOLIDAYS = [
  { date: "10 Feb", name: "National Sports Day",  type: "State",    description: "National health and physical activity directive." },
  { date: "20 Mar*", name: "Eid Al-Fitr",         type: "Islamic",  description: "Festival marking the conclusion of the holy month." },
  { date: "27 May*", name: "Eid Al-Adha",         type: "Islamic",  description: "The feast of sacrifice, a major Islamic observance." },
  { date: "16 Jun*", name: "Islamic New Year",    type: "Islamic",  description: "Marking the commencement of the Hijri calendar." },
  { date: "18 Dec",  name: "National Day",        type: "National", description: "Commemorating the unification of the State in 1878." },
];

export default function QatarPublicHolidaysPage() {
  const faqJsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: [
      {
        "@type": "Question",
        name: "When is Qatar National Day 2026?",
        acceptedAnswer: { "@type": "Answer", text: "Qatar National Day is celebrated on December 18, 2026." },
      },
    ],
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: safeJsonLd(faqJsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: safeJsonLd({ "@context": "https://schema.org", "@type": "BreadcrumbList", itemListElement: [{ "@type": "ListItem", position: 1, name: "Home", item: SITE_URL }, { "@type": "ListItem", position: 2, name: "Public Holidays", item: `${SITE_URL}/qatar-public-holidays` }] }) }} />

      <div className="max-w-7xl mx-auto px-6 py-2 sm:py-12 flex flex-col gap-24">
        <ProtocolHero 
          category="State Protocols & Calendar"
          titleEn="Public Holidays"
          titleAr="العطل الرسمية"
          description="The public schedule of commemorative, religious, and civic observances in the State of Qatar. A definitive registry for personal and professional planning."
          crumbs={[{ label: "Home", href: "/" }, { label: "Guides" }, { label: "Public Holidays" }]}
        />

        <ProtocolGrid 
          points={[
            { label: "Cycle Status", value: "Gregorian/Hijri", icon: "calendar_month" },
            { label: "Islamic Dates", value: "Moon Sighting", icon: "dark_mode" },
            { label: "State Alignment", value: "Verified", icon: "verified" },
            { label: "Next Major", value: "National Day", icon: "event_note" },
          ]}
        />

        <section className="space-y-12">
          <div>
            <h2 className="luxury-text text-5xl">The Registry</h2>
            <p className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400 mt-4">Commemorative & Islamic Observances</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-1">
            {HOLIDAYS.map(h => (
              <div key={h.name} className="insider-card flex justify-between items-center group">
                <div className="space-y-1">
                  <span className="text-[9px] font-black uppercase tracking-widest text-primary/40">{h.type}</span>
                  <h3 className="text-xl font-bold tracking-tight">{h.name}</h3>
                  <p className="text-[10px] font-medium text-slate-500 max-w-[180px]">{h.description}</p>
                </div>
                <div className="text-right">
                  <p className="text-2xl font-black font-serif italic text-primary">{h.date}</p>
                </div>
              </div>
            ))}
            <div className="insider-card bg-slate-50 dark:bg-slate-900 border-none flex flex-col justify-center items-center text-center">
               <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest leading-relaxed">
                 * Islamic dates are subject to moon sighting confirmation by the Ministry of Awqaf.
               </p>
            </div>
          </div>
        </section>

        <section className="grid grid-cols-1 lg:grid-cols-2 gap-1">
          <div className="insider-card bg-primary !text-white border-none space-y-8 flex flex-col justify-center p-12 lg:p-20">
             <h3 className="luxury-text text-6xl italic">National Day</h3>
             <p className="text-sm font-medium text-white/70 leading-relaxed max-w-sm">
                Commemorating the unification of Qatar in 1878. A day of national pride, heritage, and state-wide celebration across the Doha Corniche.
             </p>
             <div className="text-[10px] font-black uppercase tracking-[0.3em] text-accent">
                Protocol: 18 December
             </div>
          </div>
          <div className="insider-card bg-slate-900 !text-white border-none space-y-8 flex flex-col justify-center p-12 lg:p-20">
             <h3 className="luxury-text text-6xl italic">Ramadan</h3>
             <p className="text-sm font-medium text-white/70 leading-relaxed max-w-sm">
                The holy month of fasting. Working hours are typically adjusted across state and private sectors to accommodate spiritual obligations.
             </p>
             <div className="flex gap-4 pt-4">
                <a href="/" className="text-[10px] font-black uppercase tracking-[0.3em] text-accent hover:underline transition-all">Protocol Guide</a>
             </div>
          </div>
        </section>

        <ProtocolVerification 
          sourceName="Qatar Ministry of Interior (MOI)" 
          sourceUrl="https://portal.moi.gov.qa" 
        />

        <RelatedGuides guides={[
          { href: "/work-in-qatar",         icon: "work",        title: "Work in Qatar",    description: "Everything you need to prepare before and after arriving in Qatar." },
          { href: "/qatar-visa-requirements", icon: "id_card",   title: "Visa Requirements",   description: "Entry and residency rules for visitors and workers." },
        ]} />
      </div>
    </>
  );
}

