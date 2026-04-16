import { pageMeta, SITE_URL } from "@/lib/seo";
import { safeJsonLd } from "@/lib/utils";
import BreadcrumbNav from "@/components/BreadcrumbNav";
import RelatedGuides from "@/components/RelatedGuides";

export const metadata = pageMeta({
  title: "Qatar Public Holidays 2026 | Community Calendar",
  description: "Independent schedule of public holidays in the State of Qatar for 2026. Explore dates for National Day, Eid Al-Fitr, and Qatar Sports Day.",
  path: "/qatar-public-holidays",
  keywords: ["Qatar holidays 2026", "National Day Qatar", "Eid holidays 2026", "Qatar Sports Day"],
});

const HOLIDAYS = [
  { date: "10 Feb", isoDate: "2026-02-10", name: "National Sports Day",  type: "State",    color: "text-amber-500",   description: "Qatar's annual National Sports Day promoting health and physical activity across the state." },
  { date: "20 Mar*", isoDate: "2026-03-20", name: "Eid Al-Fitr",         type: "Islamic",  color: "text-emerald-500", description: "The festival marking the end of Ramadan. Exact date subject to moon sighting confirmation." },
  { date: "27 May*", isoDate: "2026-05-27", name: "Eid Al-Adha",         type: "Islamic",  color: "text-emerald-500", description: "The feast of sacrifice, one of the two major Islamic festivals. Exact date subject to moon sighting." },
  { date: "16 Jun*", isoDate: "2026-06-16", name: "Islamic New Year",    type: "Islamic",  color: "text-emerald-500", description: "The Islamic Hijri New Year marking the start of Muharram." },
  { date: "18 Dec", isoDate: "2026-12-18",  name: "National Day",        type: "National", color: "text-primary",     description: "Qatar National Day commemorates the unification of Qatar in 1878. Celebrated with state events across Doha." },
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
      {
        "@type": "Question",
        name: "How many public holidays are there in Qatar in 2026?",
        acceptedAnswer: { "@type": "Answer", text: "Qatar has 5 official public holidays in 2026: National Sports Day (Feb 10), Eid Al-Fitr (approx. Mar 20), Eid Al-Adha (approx. May 27), Islamic New Year (approx. Jun 16), and National Day (Dec 18). Islamic dates are subject to moon sighting." },
      },
    ],
  };

  const eventsJsonLd = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: "Qatar Public Holidays 2026",
    url: `${SITE_URL}/qatar-public-holidays`,
    itemListElement: HOLIDAYS.map((h, i) => ({
      "@type": "ListItem",
      position: i + 1,
      item: {
        "@type": "Event",
        name: h.name,
        startDate: h.isoDate,
        endDate: h.isoDate,
        eventStatus: "https://schema.org/EventScheduled",
        eventAttendanceMode: "https://schema.org/OfflineEventAttendanceMode",
        description: h.description,
        image: `${SITE_URL}/opengraph-image`,
        location: {
          "@type": "Country",
          name: "Qatar",
          address: {
            "@type": "PostalAddress",
            addressCountry: "QA",
            addressLocality: "Doha",
          },
        },
        organizer: {
          "@type": "GovernmentOrganization",
          name: "State of Qatar",
          url: "https://hukoomi.gov.qa",
        },
        offers: {
          "@type": "Offer",
          price: "0",
          priceCurrency: "QAR",
          availability: "https://schema.org/InStock",
        },
      },
    })),
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: safeJsonLd(faqJsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: safeJsonLd(eventsJsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: safeJsonLd({ "@context": "https://schema.org", "@type": "BreadcrumbList", itemListElement: [{ "@type": "ListItem", position: 1, name: "Home", item: SITE_URL }, { "@type": "ListItem", position: 2, name: "Public Holidays", item: `${SITE_URL}/qatar-public-holidays` }] }) }} />

      <div className="max-w-7xl mx-auto px-6 py-2 sm:py-12 flex flex-col gap-12 sm:gap-20">
        <BreadcrumbNav crumbs={[{ label: "Home", href: "/" }, { label: "Guides" }, { label: "Public Holidays" }]} />

      {/* ── National Calendar Hero ─────────────────────────── */}
      <section className="bento-tile bg-gradient-to-br from-primary to-primary-dark !text-white border-none min-h-[400px] flex items-center relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-white/5 rounded-full blur-[100px] translate-x-1/3 -translate-y-1/3" />
        <div className="relative z-10 w-full max-w-4xl">
          <p className="text-[10px] font-black uppercase tracking-[0.3em] text-white/60 mb-6">State Protocols · 2026</p>
          <h1 className="national-title text-6xl sm:text-9xl mb-8 italic leading-[0.8]">
             <span className="lang-en">Public Holidays</span>
             <span className="lang-ar">العطل الرسمية</span>
          </h1>
          <p className="text-sm font-medium text-white/70 leading-relaxed max-w-md">
            The public schedule of commemorative, religious, and civic observances in the State of Qatar.
          </p>
        </div>
      </section>

      {/* ── Holiday Feed ────────────────────────────────────── */}
      <section className="space-y-12">
        <div className="flex justify-between items-end">
          <div>
            <h2 className="national-title text-4xl">The Schedule</h2>
            <p className="text-xs font-black text-slate-400 uppercase tracking-widest mt-2">Gregorian · Hijri Alignment</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {HOLIDAYS.map(h => (
            <div key={h.name} className="bento-tile flex items-center justify-between p-8 group hover:border-primary/20 transition-all">
              <div className="flex flex-col gap-1">
                <span className={`text-[10px] font-black uppercase tracking-[0.2em] ${h.color}`}>{h.type}</span>
                <h3 className="text-xl font-bold tracking-tight">{h.name}</h3>
              </div>
              <div className="text-right">
                <span className="text-2xl font-black text-slate-900 dark:text-slate-100 italic">{h.date}</span>
              </div>
            </div>
          ))}
          <div className="bento-tile bg-slate-50 dark:bg-slate-900 border-none flex flex-col justify-center items-center text-center p-8 opacity-60">
             <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-relaxed">
               * Islamic dates are subject to moon sighting confirmation by the Ministry of Awqaf.
             </p>
          </div>
        </div>
      </section>

      {/* ── Significant Observances ─────────────────────────── */}
      <section className="grid grid-cols-1 lg:grid-cols-12 gap-12">
        <div className="lg:col-span-12 bento-tile !p-0 overflow-hidden shadow-2xl">
           <div className="grid grid-cols-1 md:grid-cols-2">
              <div className="p-12 sm:p-20 bg-primary !text-white border-none flex flex-col justify-center">
                 <h3 className="national-title text-6xl italic mb-6">National Day</h3>
                 <p className="text-sm font-medium text-white/70 leading-relaxed mb-10">
                   Commemorating the unification of Qatar in 1878. A day of national pride, heritage, and state-wide celebration across the Doha Corniche.
                 </p>
                 <div className="px-6 py-4 bg-white/10 rounded-2xl border border-white/10 w-fit font-black text-xs uppercase tracking-[0.2em]">
                   18 December · 2026
                 </div>
              </div>
              <div className="p-12 sm:p-20 bg-slate-900 !text-white border-none flex flex-col justify-center">
                 <h3 className="national-title text-6xl italic mb-6">Ramadan</h3>
                 <p className="text-sm font-medium text-white/70 leading-relaxed mb-10">
                   The holy month of fasting. Working hours are reduced across state and private sectors to accommodate spiritual obligations.
                 </p>
                 <a href="/prayer" className="px-6 py-4 bg-accent text-primary rounded-2xl w-fit font-black text-xs uppercase tracking-[0.2em] hover:scale-105 transition-all">
                   Prayer Timings
                 </a>
              </div>
           </div>
        </div>
      </section>

      {/* ── Concierge Support ────────────────────────────────── */}
      <section className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="bento-tile">
           <h4 className="text-sm font-black uppercase tracking-widest mb-4">Labour Rights</h4>
           <p className="text-sm text-slate-500 leading-relaxed">
             Under Qatar Labour Law, all employees are entitled to fully paid leave during public holidays. Companies operating during these days must provide alternative rest days or overtime compensation.
           </p>
        </div>
        <div className="bento-tile bg-slate-50 dark:bg-slate-950 border-none flex items-center justify-between group">
           <div>
             <h4 className="font-bold mb-1">Planning a visit?</h4>
             <p className="text-xs text-slate-400">Review your residency requirements.</p>
           </div>
           <a href="/qatar-visa-requirements" className="w-12 h-12 rounded-full border border-slate-200 dark:border-slate-800 flex items-center justify-center text-slate-300 group-hover:text-primary group-hover:border-primary transition-all">
              <span className="material-symbols-outlined">east</span>
           </a>
        </div>
      </section>

      <RelatedGuides guides={[
        { href: "/prayer",                  icon: "mosque",   title: "Prayer Times",      description: "Live Doha prayer times and full monthly calendar." },
        { href: "/qatar-labour-law",        icon: "gavel",    title: "Labour Law",         description: "Your rights during public holidays — paid leave and overtime rules." },
        { href: "/qatar-visa-requirements", icon: "id_card",  title: "Visa Requirements",  description: "Entry rules for visitors planning around Qatar public holidays." },
      ]} />
      </div>
    </>
  );
}
