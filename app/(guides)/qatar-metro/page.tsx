import { pageMeta, SITE_URL } from "@/lib/seo";
import { safeJsonLd } from "@/lib/utils";

export const metadata = pageMeta({
  title: "Qatar Metro Guide — Doha Metro Lines, Stations & Fares",
  description: "Complete guide to the Doha Metro: Red, Green, and Gold lines, station map, ticket prices, operating hours, and tips for riding the Qatar Metro.",
  path: "/qatar-metro",
  keywords: ["Qatar Metro", "Doha Metro", "Doha Metro stations", "Qatar Metro map", "Doha Metro fare", "Qatar Metro lines", "Gold line Doha", "Red line Doha Metro"],
  ogTitle: "Qatar Metro Guide — Lines, Stations & Fares",
  ogDescription: "Everything you need to know about the Doha Metro: lines, stations, fares, and operating hours.",
});

const LINES = [
  {
    name: "Red Line",
    color: "red",
    bgClass: "bg-red-600",
    lightClass: "bg-red-50 border-red-100",
    textClass: "text-red-700",
    route: "Lusail City ↔ Mesaieed",
    length: "40 km",
    stations: 17,
    key: ["Lusail", "Qatar University", "Al Qassar", "Legtaifiya", "Al Messila", "Msheireb", "Corniche", "National Museum", "Al Wakra", "Mesaieed"],
    note: "North–South backbone running through Msheireb, Doha's central interchange.",
  },
  {
    name: "Green Line",
    color: "green",
    bgClass: "bg-green-600",
    lightClass: "bg-green-50 border-green-100",
    textClass: "text-green-700",
    route: "Al Riffa ↔ Hamad International Airport",
    length: "29 km",
    stations: 11,
    key: ["Al Riffa", "Bin Mahmoud", "Al Doha Al Jadeda", "Msheireb", "Musheirib", "Al Aziziyah", "Qatar National Library", "Education City", "Hamad Int'l Airport"],
    note: "East–West corridor connecting Education City to the Airport. Intersects Red Line at Msheireb.",
  },
  {
    name: "Gold Line",
    color: "yellow",
    bgClass: "bg-yellow-500",
    lightClass: "bg-yellow-50 border-yellow-100",
    textClass: "text-yellow-700",
    route: "Al Wakair ↔ Ras Bu Abboud",
    length: "29 km",
    stations: 10,
    key: ["Al Wakair", "Al Mansoura", "Msheireb", "Al Souq", "Ras Bu Abboud"],
    note: "Heritage route linking Msheireb Downtown to the souq district and waterfront.",
  },
];

const FARES = [
  { zone: "1 zone", standard: "2 QAR", gold: "10 QAR" },
  { zone: "2 zones", standard: "3 QAR", gold: "15 QAR" },
  { zone: "3 zones", standard: "4 QAR", gold: "20 QAR" },
  { zone: "Daily cap", standard: "10 QAR", gold: "50 QAR" },
];

const HOURS = [
  { day: "Saturday – Wednesday", firstTrain: "6:00 AM", lastTrain: "11:00 PM" },
  { day: "Thursday", firstTrain: "6:00 AM", lastTrain: "12:00 AM (midnight)" },
  { day: "Friday", firstTrain: "2:00 PM", lastTrain: "12:00 AM (midnight)" },
];

const TIPS = [
  { icon: "💳", title: "Get a Alhazm Card", desc: "Tap-and-go Alhazm smart card for discounted fares. Available at all station vending machines and online." },
  { icon: "🚆", title: "Gold Class carriages", desc: "Each train has a Gold Class carriage at the front — premium seating for a higher fare. Women and children may also use the Family & Women carriage." },
  { icon: "🛄", title: "Baggage & luggage", desc: "Large luggage permitted in designated areas. There is no extra charge, but space is limited during peak hours." },
  { icon: "🍽️", title: "No food or drink", desc: "Eating and drinking (including water) is prohibited on all Metro trains and within paid areas of stations. Fines apply." },
  { icon: "🔌", title: "Charging & Wi-Fi", desc: "Free Wi-Fi is available at all stations. USB charging points are provided on platform seating areas." },
  { icon: "♿", title: "Accessibility", desc: "All stations are fully accessible with lifts, tactile guidance paths, and dedicated spaces for wheelchair users." },
];

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    {
      "@type": "Question",
      name: "How many metro lines are there in Doha?",
      acceptedAnswer: { "@type": "Answer", text: "Doha Metro has three lines: the Red Line (north–south, 17 stations), the Green Line (east–west, 11 stations), and the Gold Line (heritage route, 10 stations). All three lines intersect at Msheireb station." },
    },
    {
      "@type": "Question",
      name: "What is the fare for the Qatar Metro?",
      acceptedAnswer: { "@type": "Answer", text: "Qatar Metro fares start at 2 QAR for one zone in Standard class (3 QAR for 2 zones, 4 QAR for 3 zones). Gold Class costs 10–20 QAR depending on zones. A daily cap of 10 QAR (Standard) applies." },
    },
    {
      "@type": "Question",
      name: "What time does the Doha Metro open and close?",
      acceptedAnswer: { "@type": "Answer", text: "The Doha Metro runs from 6:00 AM to 11:00 PM Saturday–Wednesday, until midnight on Thursdays, and from 2:00 PM to midnight on Fridays." },
    },
    {
      "@type": "Question",
      name: "Does the Doha Metro go to the airport?",
      acceptedAnswer: { "@type": "Answer", text: "Yes. Hamad International Airport is served by the Green Line. The journey from Msheireb (city centre) to the airport takes approximately 10 minutes." },
    },
  ],
};

export default function QatarMetroPage() {
  return (
    <div className="w-full">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: safeJsonLd(jsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: safeJsonLd({ "@context": "https://schema.org", "@type": "BreadcrumbList", itemListElement: [{ "@type": "ListItem", position: 1, name: "Home", item: SITE_URL }, { "@type": "ListItem", position: 2, name: "Qatar Metro", item: `${SITE_URL}/qatar-metro` }] }) }} />

      <h1 className="font-newsreader text-xl font-bold text-on-surface mb-1">Qatar Metro — Doha Metro Guide</h1>
      <p className="text-xs text-gray-400 mb-4">Lines, stations, fares, and operating hours for the Doha Metro system.</p>

      {/* Quick stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
        {[
          { label: "Total Lines", value: "3", icon: "🚇" },
          { label: "Total Stations", value: "37+", icon: "🗺️" },
          { label: "Network Length", value: "~76 km", icon: "📏" },
          { label: "Min Fare", value: "2 QAR", icon: "💳" },
        ].map(({ label, value, icon }) => (
          <div key={label} className="bg-white border border-gray-100 rounded-lg p-3 shadow-sm">
            <p className="text-xl mb-1">{icon}</p>
            <p className="text-xs text-gray-500 font-medium uppercase tracking-wide">{label}</p>
            <p className="font-bold text-gray-900 text-base">{value}</p>
          </div>
        ))}
      </div>

      {/* Lines */}
      <h2 className="text-sm font-semibold text-gray-700 mb-2">Metro Lines</h2>
      <div className="space-y-3 mb-6">
        {LINES.map((line) => (
          <div key={line.name} className={`${line.lightClass} border rounded-lg overflow-hidden`}>
            <div className={`${line.bgClass} px-4 py-2 flex items-center gap-2`}>
              <span className="text-white font-bold text-sm">{line.name}</span>
              <span className="text-white/70 text-xs ml-auto">{line.length} · {line.stations} stations</span>
            </div>
            <div className="px-4 py-3">
              <p className={`${line.textClass} text-xs font-semibold mb-1`}>{line.route}</p>
              <p className="text-gray-500 text-xs mb-2">{line.note}</p>
              <div className="flex flex-wrap gap-1">
                {line.key.map((s) => (
                  <span key={s} className="bg-white border border-gray-200 text-gray-600 text-[10px] px-2 py-0.5 rounded-full">{s}</span>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Fares */}
      <div className="bg-white rounded-lg border border-gray-100 shadow-sm overflow-hidden mb-6">
        <div className="bg-gray-800 px-4 py-2">
          <h2 className="text-white font-bold text-sm">Ticket Fares</h2>
          <p className="text-gray-300 text-xs mt-0.5">Alhazm smart card rates (cash may be higher)</p>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-100">
                <th className="text-left px-4 py-2 font-semibold text-gray-600">Journey</th>
                <th className="text-left px-4 py-2 font-semibold text-gray-700">Standard</th>
                <th className="text-left px-4 py-2 font-semibold text-yellow-700">Gold Class</th>
              </tr>
            </thead>
            <tbody>
              {FARES.map((row, i) => (
                <tr key={row.zone} className={i % 2 === 0 ? "bg-white" : "bg-gray-50/50"}>
                  <td className="px-4 py-2 text-gray-700 font-medium">{row.zone}</td>
                  <td className="px-4 py-2 text-gray-700">{row.standard}</td>
                  <td className="px-4 py-2 text-yellow-700 font-medium">{row.gold}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Operating hours */}
      <div className="bg-white rounded-lg border border-gray-100 shadow-sm overflow-hidden mb-6">
        <div className="bg-gray-800 px-4 py-2">
          <h2 className="text-white font-bold text-sm">Operating Hours</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-100">
                <th className="text-left px-4 py-2 font-semibold text-gray-600">Day</th>
                <th className="text-left px-4 py-2 font-semibold text-gray-600">First Train</th>
                <th className="text-left px-4 py-2 font-semibold text-gray-600">Last Train</th>
              </tr>
            </thead>
            <tbody>
              {HOURS.map((row, i) => (
                <tr key={row.day} className={i % 2 === 0 ? "bg-white" : "bg-gray-50/50"}>
                  <td className="px-4 py-2 text-gray-700 font-medium">{row.day}</td>
                  <td className="px-4 py-2 text-gray-700">{row.firstTrain}</td>
                  <td className="px-4 py-2 text-gray-700">{row.lastTrain}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Tips */}
      <div className="bg-white rounded-lg border border-gray-100 shadow-sm p-3 mb-4">
        <h2 className="text-sm font-semibold text-gray-700 mb-2">Tips for Riding the Metro</h2>
        <div className="space-y-2">
          {TIPS.map(({ icon, title, desc }) => (
            <div key={title} className="flex gap-2">
              <span className="text-lg flex-shrink-0 mt-0.5">{icon}</span>
              <div>
                <p className="font-semibold text-gray-800 text-sm">{title}</p>
                <p className="text-gray-600 text-sm">{desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* FAQ */}
      <div className="bg-white rounded-lg border border-gray-100 shadow-sm p-3 mb-4">
        <h2 className="text-xs font-medium text-gray-400 uppercase tracking-wide mb-2">FAQ</h2>
        <div className="space-y-3">
          {[
            { q: "Does the Doha Metro go to Hamad International Airport?", a: "Yes. The airport is served by the Green Line. From Msheireb (city centre) the journey takes approximately 10 minutes." },
            { q: "Can I bring my bike on the Qatar Metro?", a: "Bicycles are allowed on the Metro during off-peak hours (before 7 AM and after 8 PM on weekdays, and all day on weekends). Folded bikes and scooters are permitted at any time." },
            { q: "Is there a women-only carriage on the Doha Metro?", a: "Yes. Each train has a dedicated Family & Women carriage. Women travelling alone or with children may use it. Men are not permitted in this carriage." },
            { q: "How do I get an Alhazm card?", a: "Alhazm smart cards are available at all Metro station vending machines, Customer Service desks, and online. Cards cost 10 QAR and can be loaded with credit at any station." },
          ].map(({ q, a }) => (
            <details key={q} className="group">
              <summary className="cursor-pointer text-xs font-medium text-gray-700 py-2 list-none flex justify-between items-center">
                {q}
                <span className="text-gray-400 group-open:rotate-180 transition-transform">▼</span>
              </summary>
              <p className="text-xs text-gray-500 pt-1 pb-3">{a}</p>
            </details>
          ))}
        </div>
      </div>

      <div className="flex gap-3 flex-wrap text-xs">
        <a href="/weather" className="text-rose-700 hover:underline">→ Doha Weather</a>
        <a href="/cost-of-living-doha" className="text-rose-700 hover:underline">→ Cost of Living in Doha</a>
        <a href="/work-in-qatar" className="text-rose-700 hover:underline">→ Working in Qatar</a>
      </div>
    </div>
  );
}
