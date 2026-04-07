import { pageMeta, SITE_URL } from "@/lib/seo";
import { safeJsonLd } from "@/lib/utils";

export const metadata = pageMeta({
  title: "Emergency Numbers Qatar & Embassy Contacts Doha 2026",
  description: "Qatar emergency numbers: police, ambulance, fire, traffic. Embassy contacts for India, Pakistan, Philippines, UK, USA and more.",
  path: "/emergency-numbers-qatar",
  keywords: ["emergency numbers Qatar", "Qatar police number", "ambulance Qatar", "embassies in Doha", "Indian embassy Qatar", "Pakistan embassy Qatar"],
  ogTitle: "Emergency Numbers Qatar & Embassies in Doha",
  ogDescription: "Qatar emergency contacts and embassy phone numbers for major nationalities in Doha.",
});

export default function EmergencyNumbersQatarPage() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: [
      {
        "@type": "Question",
        name: "What is the emergency number in Qatar?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "The emergency number in Qatar is 999 for police, ambulance, and fire. For the traffic police, call 96600000.",
        },
      },
      {
        "@type": "Question",
        name: "What is the Indian Embassy number in Doha, Qatar?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "The Indian Embassy in Doha, Qatar can be reached at +974 4425 5777. The embassy is located in the diplomatic area of Doha.",
        },
      },
      {
        "@type": "Question",
        name: "How do I call an ambulance in Qatar?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "To call an ambulance in Qatar, dial 999. Hamad Medical Corporation operates the national ambulance service, which is free to call.",
        },
      },
    ],
  };

  const breadcrumbLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: SITE_URL },
      { "@type": "ListItem", position: 2, name: "Emergency Numbers Qatar", item: `${SITE_URL}/emergency-numbers-qatar` },
    ],
  };

  return (
    <div className="page-sections">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: safeJsonLd(jsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: safeJsonLd(breadcrumbLd) }} />

      <div>
        <h1 className="font-newsreader text-3xl font-bold text-on-surface mb-3">Emergency Numbers Qatar & Embassies in Doha</h1>
        <p className="text-gray-600 text-base leading-relaxed">
          Save these numbers before you need them. Essential contacts for emergencies, legal assistance, and consular services in Qatar.
        </p>
      </div>

      {/* Emergency numbers */}
      <section>
        <h2 className="text-xl font-bold text-gray-900 mb-4">🚨 Emergency Numbers</h2>
        <div className="grid sm:grid-cols-2 gap-3">
          {[
            { service: "Police", number: "999", icon: "👮" },
            { service: "Ambulance", number: "999", icon: "🚑" },
            { service: "Fire Department", number: "999", icon: "🚒" },
            { service: "Traffic Police", number: "96600000", icon: "🚗" },
            { service: "Hamad Medical (Hospital)", number: "44393333", icon: "🏥" },
            { service: "Women & Children Protection", number: "919", icon: "👧" },
            { service: "Ministry of Interior Hotline", number: "44406444", icon: "🏛️" },
            { service: "Electricity & Water (KAHRAMAA)", number: "991", icon: "💡" },
            { service: "Ooredoo Customer Service", number: "111", icon: "📞" },
            { service: "Vodafone Qatar", number: "800 7111", icon: "📱" },
          ].map((e) => (
            <div key={e.service} className="bg-red-50 border border-red-100 rounded-xl p-4 flex items-center gap-3">
              <span className="text-2xl">{e.icon}</span>
              <div>
                <p className="font-semibold text-gray-900 text-sm">{e.service}</p>
                <a href={`tel:${e.number}`} className="text-red-700 font-bold text-lg hover:underline">{e.number}</a>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Embassies */}
      <section>
        <h2 className="text-xl font-bold text-gray-900 mb-4">🌍 Embassies & Consulates in Doha</h2>
        <div className="rounded-xl border border-stone-200 overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-stone-100 text-gray-700">
                <th className="px-4 py-3 text-left font-semibold">Country</th>
                <th className="px-4 py-3 text-left font-semibold">Phone</th>
                <th className="px-4 py-3 text-left font-semibold">Area</th>
              </tr>
            </thead>
            <tbody>
              {[
                { country: "🇮🇳 India", phone: "+974 4425 5777", area: "Al Hilal" },
                { country: "🇵🇰 Pakistan", phone: "+974 4467 9210", area: "Al Dafna" },
                { country: "🇧🇩 Bangladesh", phone: "+974 4483 5031", area: "Al Hilal" },
                { country: "🇵🇭 Philippines", phone: "+974 4483 6444", area: "Al Hilal" },
                { country: "🇳🇵 Nepal", phone: "+974 4483 7015", area: "Al Hilal" },
                { country: "🇱🇰 Sri Lanka", phone: "+974 4483 5721", area: "Al Hilal" },
                { country: "🇪🇬 Egypt", phone: "+974 4483 5022", area: "Al Mansoura" },
                { country: "🇬🇧 United Kingdom", phone: "+974 4496 2000", area: "West Bay" },
                { country: "🇺🇸 United States", phone: "+974 4496 6000", area: "Al Luqta" },
                { country: "🇫🇷 France", phone: "+974 4420 6600", area: "West Bay" },
                { country: "🇩🇪 Germany", phone: "+974 4408 6300", area: "West Bay" },
                { country: "🇸🇦 Saudi Arabia", phone: "+974 4483 5722", area: "Al Hilal" },
                { country: "🇯🇴 Jordan", phone: "+974 4483 5555", area: "Al Hilal" },
                { country: "🇹🇷 Turkey", phone: "+974 4483 5432", area: "Al Hilal" },
              ].map((e, i) => (
                <tr key={e.country} className={`border-t border-stone-100 ${i % 2 === 0 ? "bg-white" : "bg-stone-50"}`}>
                  <td className="px-4 py-2.5 font-medium text-gray-900">{e.country}</td>
                  <td className="px-4 py-2.5">
                    <a href={`tel:${e.phone}`} className="text-rose-700 hover:underline">{e.phone}</a>
                  </td>
                  <td className="px-4 py-2.5 text-gray-500">{e.area}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="text-xs text-gray-400 mt-2">Phone numbers are approximate — verify with the official embassy website before visiting.</p>
      </section>

      {/* Hospitals */}
      <section>
        <h2 className="text-xl font-bold text-gray-900 mb-4">🏥 Major Hospitals in Doha</h2>
        <div className="space-y-2 text-sm text-gray-700">
          {[
            { name: "Hamad General Hospital", note: "Main public hospital, 24/7 emergency", phone: "44393333" },
            { name: "Al Khor Hospital", note: "North Qatar public hospital", phone: "44719999" },
            { name: "Sidra Medicine", note: "Women & children specialist", phone: "40030000" },
            { name: "Aster DM Healthcare", note: "Private, multiple branches", phone: "44413999" },
          ].map((h) => (
            <div key={h.name} className="bg-stone-50 border border-stone-200 rounded-xl p-3 flex justify-between items-center">
              <div>
                <p className="font-semibold text-gray-900">{h.name}</p>
                <p className="text-gray-500 text-xs">{h.note}</p>
              </div>
              <a href={`tel:${h.phone}`} className="text-rose-700 font-bold hover:underline ml-4">{h.phone}</a>
            </div>
          ))}
        </div>
      </section>

      {/* Internal links */}
      <section className="bg-rose-50 border border-rose-100 rounded-2xl p-6 text-sm">
        <p className="font-semibold text-rose-900 mb-2">More Qatar guides</p>
        <div className="flex flex-wrap gap-3">
          <a href="/qatar-visa-requirements" className="text-rose-700 hover:underline">→ Qatar Visa Requirements</a>
          <a href="/cost-of-living-doha" className="text-rose-700 hover:underline">→ Cost of Living in Doha</a>
          <a href="/qatar-public-holidays" className="text-rose-700 hover:underline">→ Qatar Public Holidays</a>
        </div>
      </section>
    </div>
  );
}
