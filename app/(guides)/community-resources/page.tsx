import { pageMeta, SITE_URL } from "@/lib/seo";
import { safeJsonLd } from "@/lib/utils";
import DisclaimerBanner from "@/components/DisclaimerBanner";
import BreadcrumbNav from "@/components/BreadcrumbNav";
import RelatedGuides from "@/components/RelatedGuides";

export const metadata = pageMeta({
  title: "Community Resources for Expats in Qatar 2026 | Qatar Portal",
  description: "Independent guide to banking, healthcare, schools, and everyday life in Qatar. Essential community resources for residents and new arrivals in Doha.",
  path: "/community-resources",
  keywords: ["expat life Qatar", "banking in Qatar", "healthcare Doha", "international schools Qatar", "living in Qatar 2026"],
});

const BANKS = [
  { name: "Qatar National Bank (QNB)", type: "Government", note: "Largest bank in MENA. Widest ATM network, English app.", url: "https://www.qnb.com" },
  { name: "Commercial Bank of Qatar", type: "Private",     note: "Strong expat support. Online account opening available.", url: "https://www.cbq.qa" },
  { name: "HSBC Qatar",               type: "International", note: "Familiar for UK/EU arrivals. Preferred by expat professionals.", url: "https://www.hsbc.com.qa" },
  { name: "Mashreq Bank",             type: "Regional",    note: "Popular with South Asian expats. Good mobile app.", url: "https://www.mashreqbank.com" },
  { name: "Doha Bank",                type: "Local",       note: "Competitive rates for remittances to India, Pakistan, Philippines.", url: "https://www.dohabank.com.qa" },
];

const HOSPITALS = [
  { name: "Hamad Medical Corporation", type: "Public", note: "Primary public healthcare network. Residents need a Seha health card.", icon: "local_hospital", color: "bg-primary/5 border-primary/10" },
  { name: "Sidra Medicine",            type: "Public", note: "World-class women & children's hospital. Part of the HMC network.", icon: "pediatrics", color: "bg-slate-50 dark:bg-slate-900 border-slate-100 dark:border-slate-800" },
  { name: "Qatar Medical Center (QMC)", type: "Private", note: "Multi-specialty private hospital. Insurance accepted.", icon: "medical_services", color: "bg-slate-50 dark:bg-slate-900 border-slate-100 dark:border-slate-800" },
  { name: "Al Ahli Hospital",           type: "Private", note: "Well-regarded private hospital in central Doha.", icon: "health_and_safety", color: "bg-slate-50 dark:bg-slate-900 border-slate-100 dark:border-slate-800" },
];

const TRANSPORT = [
  { mode: "Doha Metro", icon: "subway",       desc: "3 lines covering most of central Doha and suburbs. QAR 2 per journey. Gold class available.", href: "/qatar-metro" },
  { mode: "Karwa Taxis", icon: "local_taxi",  desc: "Official metered taxi. Flag-fall QAR 4 (day) / QAR 5 (night). Book via Karwa app or flag at street.", href: null },
  { mode: "Uber / Careem", icon: "directions_car", desc: "Both operate in Doha. Careem is more widely used locally. Surge pricing applies during peak hours.", href: null },
  { mode: "Bus Network", icon: "directions_bus",   desc: "Qatar Rail operates buses across the city. QAR 2 flat fare. Useful for areas the metro doesn't cover.", href: null },
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
          text: "Most banks require a valid Qatar ID (QID), a no-objection letter from your employer, and a passport copy. Some banks like Commercial Bank of Qatar allow online applications.",
        },
      },
      {
        "@type": "Question",
        name: "How does healthcare work in Qatar?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Employees are covered by mandatory health insurance provided by their employer. The public network (Hamad Medical) requires a Seha health card obtainable through the PHCC app.",
        },
      },
    ],
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: safeJsonLd(jsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: safeJsonLd({ "@context": "https://schema.org", "@type": "BreadcrumbList", itemListElement: [{ "@type": "ListItem", position: 1, name: "Home", item: SITE_URL }, { "@type": "ListItem", position: 2, name: "Community Resources", item: `${SITE_URL}/community-resources` }] }) }} />

      <div className="max-w-7xl mx-auto px-6 py-2 sm:py-12 flex flex-col gap-12 sm:gap-20">
        <BreadcrumbNav crumbs={[{ label: "Home", href: "/" }, { label: "Guides" }, { label: "Community Resources" }]} />

        {/* ── Hero ─────────────────────────────────────────── */}
        <section className="bento-tile bg-gradient-to-br from-primary to-primary-dark !text-white border-none min-h-[400px] flex items-center relative overflow-hidden shadow-2xl">
          <div className="absolute top-0 right-0 w-96 h-96 bg-white/5 rounded-full blur-[100px] translate-x-1/3 -translate-y-1/3" />
          <div className="absolute -bottom-16 -left-16 w-64 h-64 bg-white/3 rounded-full blur-[80px]" />
          <div className="relative z-10 w-full max-w-4xl">
            <p className="label-xs text-white/60 mb-6">Independent Guide · Expat Life in Qatar</p>
            <h1 className="national-title text-6xl sm:text-9xl mb-8 italic leading-[0.8] tracking-tighter">
              <span className="lang-en">Community</span>
              <span className="lang-ar">مجتمع قطر</span>
            </h1>
            <p className="text-sm font-medium text-white/60 leading-relaxed max-w-xl mb-10">
              Practical information for daily life in Qatar — banking, healthcare, schools, and getting around Doha. Everything new residents need to get settled.
            </p>
            <div className="flex flex-wrap gap-3">
              {["Banking", "Healthcare", "Schools", "Transport", "Expat Tips"].map((chip) => (
                <a key={chip} href={`#${chip.toLowerCase().replace(" ", "-")}`} className="px-4 py-2 bg-white/10 border border-white/15 rounded-full text-xs font-bold hover:bg-white/20 transition-colors">
                  {chip}
                </a>
              ))}
            </div>
          </div>
        </section>

        {/* ── Disclaimer ───────────────────────────────────── */}
        <DisclaimerBanner
          officialSourceUrl="https://hukoomi.gov.qa"
          officialSourceName="Hukoomi — Qatar e-Government Portal"
          lastReviewed="April 2026"
        />

        {/* ── Banking ──────────────────────────────────────── */}
        <section id="banking" className="space-y-10">
          <div className="flex items-end gap-4 border-b border-slate-100 dark:border-slate-800 pb-6">
            <div>
              <p className="label-xs text-primary mb-1">Section 1</p>
              <h2 className="national-title text-4xl sm:text-5xl">Banking in Qatar</h2>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Account opening requirements */}
            <div className="bento-tile bg-slate-900 !text-white border-none flex flex-col justify-between">
              <div>
                <span className="material-symbols-outlined text-accent mb-4" style={{ fontSize: "28px", fontVariationSettings: "'FILL' 1" }}>account_balance</span>
                <h3 className="text-lg font-black mb-3">What You Need to Open an Account</h3>
                <ul className="space-y-3">
                  {[
                    "Valid Qatar ID (QID) — mandatory for all banks",
                    "Original passport + copy",
                    "No-Objection Letter (NOC) from your employer",
                    "Proof of address (tenancy contract or utility bill)",
                    "3 months' salary slips (some banks require this)",
                  ].map((item) => (
                    <li key={item} className="flex items-start gap-3 text-sm text-white/70">
                      <span className="material-symbols-outlined text-accent shrink-0 mt-0.5" style={{ fontSize: "16px" }}>check_circle</span>
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
              <p className="mt-6 text-xs text-white/40 border-t border-white/10 pt-4">
                Most accounts can be opened within 3–5 working days once documents are verified.
              </p>
            </div>

            {/* Remittances tip */}
            <div className="space-y-4">
              <div className="bento-tile bg-primary/5 border-primary/10">
                <span className="material-symbols-outlined text-primary mb-3" style={{ fontSize: "22px", fontVariationSettings: "'FILL' 1" }}>send_money</span>
                <h4 className="font-black text-sm mb-2">Sending Money Home</h4>
                <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                  Qatar has no restrictions on remittances. Western Union, MoneyGram, and most banks offer competitive transfer rates. The Exchange and Al Fardan Exchange are popular alternatives with lower fees.
                </p>
              </div>
              <div className="bento-tile">
                <span className="material-symbols-outlined text-slate-400 mb-3" style={{ fontSize: "22px" }}>credit_card</span>
                <h4 className="font-black text-sm mb-2">International Cards</h4>
                <p className="text-sm text-slate-500 leading-relaxed">
                  Visa and Mastercard are accepted everywhere. AMEX is widely accepted in malls and hotels. Apple Pay and Google Pay work at most POS terminals.
                </p>
              </div>
            </div>
          </div>

          {/* Banks table */}
          <div className="bento-tile !p-0 overflow-hidden shadow-xl">
            <div className="p-6 sm:p-8 border-b border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-950">
              <h3 className="font-black text-sm uppercase tracking-widest">Major Banks in Qatar</h3>
            </div>
            <div className="divide-y divide-slate-100 dark:divide-slate-800">
              {BANKS.map((bank) => (
                <div key={bank.name} className="flex flex-col sm:flex-row sm:items-center gap-3 p-5 sm:p-6 hover:bg-slate-50 dark:hover:bg-slate-900/50 transition-colors group">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-3 mb-1">
                      <span className="font-black text-sm text-slate-900 dark:text-slate-100">{bank.name}</span>
                      <span className="label-xs text-slate-400 normal-case font-medium tracking-normal">{bank.type}</span>
                    </div>
                    <p className="text-xs text-slate-500">{bank.note}</p>
                  </div>
                  <a href={bank.url} target="_blank" rel="noopener noreferrer" className="shrink-0 text-xs font-black text-primary hover:underline flex items-center gap-1">
                    Website <span className="material-symbols-outlined" style={{ fontSize: "13px" }}>open_in_new</span>
                  </a>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── Healthcare ───────────────────────────────────── */}
        <section id="healthcare" className="space-y-10">
          <div className="border-b border-slate-100 dark:border-slate-800 pb-6">
            <p className="label-xs text-primary mb-1">Section 2</p>
            <h2 className="national-title text-4xl sm:text-5xl">Healthcare in Qatar</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bento-tile border-primary/20">
              <span className="material-symbols-outlined text-primary mb-4" style={{ fontSize: "28px", fontVariationSettings: "'FILL' 1" }}>health_and_safety</span>
              <h3 className="text-lg font-black mb-3">How It Works for Residents</h3>
              <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed mb-4">
                All employers in Qatar are legally required to provide health insurance to employees. For the public Hamad Medical network, you also need a <b>Seha health card</b> — get this through the PHCC app or any Primary Health Care Centre.
              </p>
              <ul className="space-y-2 text-sm text-slate-600 dark:text-slate-400">
                <li className="flex items-center gap-2"><span className="w-1.5 h-1.5 rounded-full bg-primary shrink-0" /> Emergency: 999 (free, no insurance needed)</li>
                <li className="flex items-center gap-2"><span className="w-1.5 h-1.5 rounded-full bg-primary shrink-0" /> PHCC app for GP appointments</li>
                <li className="flex items-center gap-2"><span className="w-1.5 h-1.5 rounded-full bg-primary shrink-0" /> Prescriptions at HMC pharmacies are subsidised</li>
              </ul>
            </div>

            <div className="bento-tile bg-slate-900 !text-white border-none">
              <span className="material-symbols-outlined text-accent mb-4" style={{ fontSize: "28px", fontVariationSettings: "'FILL' 1" }}>vaccines</span>
              <h3 className="text-lg font-black mb-3 text-white">Dental & Optical</h3>
              <p className="text-sm text-white/60 leading-relaxed mb-4">
                Dental and optical care is rarely covered under standard employer insurance. Many residents pay out-of-pocket at private clinics, which are generally well-equipped and affordable compared to Europe.
              </p>
              <a href="https://www.hmc.org.qa" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 text-xs font-black text-accent hover:underline">
                Hamad Medical Corporation <span className="material-symbols-outlined" style={{ fontSize: "13px" }}>open_in_new</span>
              </a>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {HOSPITALS.map((h) => (
              <div key={h.name} className={`bento-tile border ${h.color} flex flex-col`}>
                <span className="material-symbols-outlined text-primary mb-3" style={{ fontSize: "22px", fontVariationSettings: "'FILL' 1" }}>{h.icon}</span>
                <span className="label-xs text-slate-400 mb-1">{h.type}</span>
                <h4 className="font-black text-sm mb-2 leading-snug">{h.name}</h4>
                <p className="text-xs text-slate-500 leading-relaxed mt-auto">{h.note}</p>
              </div>
            ))}
          </div>
        </section>

        {/* ── Schools ──────────────────────────────────────── */}
        <section id="schools" className="space-y-10">
          <div className="border-b border-slate-100 dark:border-slate-800 pb-6">
            <p className="label-xs text-primary mb-1">Section 3</p>
            <h2 className="national-title text-4xl sm:text-5xl">Schools & Education</h2>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-4">
              {[
                {
                  type: "British Curriculum",
                  examples: "Doha British School, DPS Qatar, Cambridge International",
                  fees: "QAR 25,000 – 55,000/yr",
                  note: "Most popular among UK, Indian, and South Asian families. IGCSE and A-Levels.",
                  color: "border-l-4 border-l-primary",
                },
                {
                  type: "American Curriculum",
                  examples: "American School of Doha, Qatar Academy",
                  fees: "QAR 45,000 – 80,000/yr",
                  note: "US-accredited, Advanced Placement (AP) programme. Popular with Western expats.",
                  color: "border-l-4 border-l-slate-300 dark:border-l-slate-600",
                },
                {
                  type: "Indian Curriculum (CBSE)",
                  examples: "Indian School Doha, MES Indian School",
                  fees: "QAR 8,000 – 18,000/yr",
                  note: "Most affordable international option. Very large student community.",
                  color: "border-l-4 border-l-accent",
                },
                {
                  type: "Arabic / Islamic Schools",
                  examples: "Qatar Foundation Schools, private Islamic schools",
                  fees: "QAR 5,000 – 20,000/yr",
                  note: "Curriculum aligned with Qatari national standards. Arabic-medium instruction.",
                  color: "border-l-4 border-l-slate-200 dark:border-l-slate-700",
                },
              ].map((s) => (
                <div key={s.type} className={`bento-tile ${s.color}`}>
                  <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2 mb-2">
                    <h4 className="font-black text-sm">{s.type}</h4>
                    <span className="label-xs text-primary font-bold normal-case tracking-normal">{s.fees}</span>
                  </div>
                  <p className="text-xs text-slate-500 mb-1">{s.examples}</p>
                  <p className="text-xs text-slate-600 dark:text-slate-400">{s.note}</p>
                </div>
              ))}
            </div>

            <div className="bento-tile bg-slate-900 !text-white border-none flex flex-col">
              <span className="material-symbols-outlined text-accent mb-4" style={{ fontSize: "28px", fontVariationSettings: "'FILL' 1" }}>school</span>
              <h3 className="text-lg font-black mb-4">Enrolment Tips</h3>
              <ul className="space-y-4 flex-1">
                {[
                  "Apply as early as possible — popular schools fill up fast, especially for mid-year arrivals",
                  "Most schools require a QID or proof of residency for enrolment",
                  "Many employers in Qatar offer a school fee allowance as part of the package",
                  "Education City (Qatar Foundation) hosts branch campuses of major universities",
                  "School year runs September – June, aligned with the Northern Hemisphere",
                ].map((tip) => (
                  <li key={tip} className="flex items-start gap-3 text-sm text-white/70">
                    <span className="material-symbols-outlined text-accent shrink-0 mt-0.5" style={{ fontSize: "15px" }}>arrow_right</span>
                    {tip}
                  </li>
                ))}
              </ul>
              <a href="https://www.moe.gov.qa" target="_blank" rel="noopener noreferrer" className="mt-8 text-xs font-black text-accent hover:underline flex items-center gap-1">
                Ministry of Education <span className="material-symbols-outlined" style={{ fontSize: "13px" }}>open_in_new</span>
              </a>
            </div>
          </div>
        </section>

        {/* ── Transport ────────────────────────────────────── */}
        <section id="transport" className="space-y-10">
          <div className="border-b border-slate-100 dark:border-slate-800 pb-6">
            <p className="label-xs text-primary mb-1">Section 4</p>
            <h2 className="national-title text-4xl sm:text-5xl">Getting Around Doha</h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {TRANSPORT.map((t) => (
              <div key={t.mode} className="bento-tile group hover:border-primary/20 transition-all flex items-start gap-4">
                <div className="w-11 h-11 shrink-0 rounded-xl bg-primary/5 flex items-center justify-center group-hover:bg-primary transition-colors">
                  <span className="material-symbols-outlined text-primary group-hover:text-white transition-colors" style={{ fontSize: "20px" }}>{t.icon}</span>
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="font-black text-sm mb-1">{t.mode}</h4>
                  <p className="text-xs text-slate-500 leading-relaxed">{t.desc}</p>
                  {t.href && (
                    <a href={t.href} className="mt-2 inline-flex items-center gap-1 text-xs font-black text-primary hover:underline">
                      Full Guide <span className="material-symbols-outlined" style={{ fontSize: "13px" }}>arrow_forward</span>
                    </a>
                  )}
                </div>
              </div>
            ))}
          </div>

          <div className="bento-tile bg-primary/5 border-primary/15">
            <div className="flex items-start gap-4">
              <span className="material-symbols-outlined text-primary shrink-0 mt-0.5" style={{ fontSize: "22px", fontVariationSettings: "'FILL' 1" }}>directions_car</span>
              <div>
                <h4 className="font-black text-sm mb-2">Driving in Qatar</h4>
                <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                  Most expats eventually buy or lease a car — public transport doesn't cover all areas. An international driving licence is accepted for the first 12 months. After that, convert to a Qatar licence via MOI. See the <a href="/qatar-services/driving-licence" className="font-black text-primary hover:underline">Driving Licence guide</a> for step-by-step instructions.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* ── Expat Tips ───────────────────────────────────── */}
        <section id="expat-tips" className="space-y-10">
          <div className="border-b border-slate-100 dark:border-slate-800 pb-6">
            <p className="label-xs text-primary mb-1">Section 5</p>
            <h2 className="national-title text-4xl sm:text-5xl">Settling In</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bento-tile bg-slate-900 !text-white border-none">
              <span className="material-symbols-outlined text-accent mb-4" style={{ fontSize: "26px", fontVariationSettings: "'FILL' 1" }}>smartphone</span>
              <h3 className="font-black text-sm mb-3">SIM Cards & Mobile</h3>
              <p className="text-sm text-white/60 leading-relaxed">
                Ooredoo and Vodafone Qatar are the two providers. Buy a prepaid SIM at the airport with your passport. Post-paid plans require a QID. 5G coverage is excellent across Doha.
              </p>
            </div>

            <div className="bento-tile">
              <span className="material-symbols-outlined text-primary mb-4" style={{ fontSize: "26px", fontVariationSettings: "'FILL' 1" }}>home</span>
              <h3 className="font-black text-sm mb-3">Finding Housing</h3>
              <p className="text-sm text-slate-500 leading-relaxed">
                Most expats rent. Popular apps: Property Finder Qatar, Bayut, and local Facebook groups. Landlords typically ask for 1–3 months' advance rent. Utilities (KAHRAMAA) are usually separate from rent.
              </p>
            </div>

            <div className="bento-tile">
              <span className="material-symbols-outlined text-primary mb-4" style={{ fontSize: "26px", fontVariationSettings: "'FILL' 1" }}>restaurant</span>
              <h3 className="font-black text-sm mb-3">Food & Groceries</h3>
              <p className="text-sm text-slate-500 leading-relaxed">
                Lulu Hypermarket, Carrefour, and Monoprix are the main supermarkets. Talabat and Deliveroo cover most of Doha for food delivery. Alcohol is only available through the QDC (Qatar Distribution Company) for non-Muslims with a permit.
              </p>
            </div>

            <div className="bento-tile">
              <span className="material-symbols-outlined text-primary mb-4" style={{ fontSize: "26px", fontVariationSettings: "'FILL' 1" }}>wb_sunny</span>
              <h3 className="font-black text-sm mb-3">Summer Heat</h3>
              <p className="text-sm text-slate-500 leading-relaxed">
                June–September temperatures regularly exceed 40°C. Outdoor work is prohibited midday. Malls and indoor spaces are heavily air-conditioned. Most expats plan holidays abroad during peak summer.
              </p>
            </div>

            <div className="bento-tile">
              <span className="material-symbols-outlined text-primary mb-4" style={{ fontSize: "26px", fontVariationSettings: "'FILL' 1" }}>mosque</span>
              <h3 className="font-black text-sm mb-3">Ramadan</h3>
              <p className="text-sm text-slate-500 leading-relaxed">
                Eating, drinking, and smoking in public during daylight hours is not permitted during Ramadan. Working hours are reduced by law. Evening iftars are a major social occasion across the city.
              </p>
            </div>

            <div className="bento-tile">
              <span className="material-symbols-outlined text-primary mb-4" style={{ fontSize: "26px", fontVariationSettings: "'FILL' 1" }}>gavel</span>
              <h3 className="font-black text-sm mb-3">Cultural Respect</h3>
              <p className="text-sm text-slate-500 leading-relaxed">
                Dress modestly in public spaces, particularly at government buildings and traditional markets. Public displays of affection are not appropriate. Photography of people and government buildings requires consent.
              </p>
            </div>
          </div>
        </section>

        <RelatedGuides guides={[
          { href: "/work-in-qatar",          icon: "work",        title: "Work in Qatar",    description: "Full relocation guide — visas, QID, onboarding checklist." },
          { href: "/cost-of-living-doha",    icon: "home_work",   title: "Cost of Living",   description: "Housing costs, school fees, and monthly budget breakdown." },
          { href: "/emergency-numbers-qatar", icon: "emergency",  title: "Emergency Numbers", description: "Police, hospitals, and embassy contacts for Qatar." },
        ]} />
      </div>
    </>
  );
}
