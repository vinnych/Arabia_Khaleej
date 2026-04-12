import Image from "next/image";
import { pageMeta, SITE_URL } from "@/lib/seo";
import { safeJsonLd } from "@/lib/utils";

export const metadata = pageMeta({
  title: "Qatar Visa Requirements 2026 — Complete Guide",
  description: "Qatar visa requirements for 2026: visa-free countries, tourist visa, work visa, family visa, fees, and how to apply online via Hayya platform.",
  path: "/qatar-visa-requirements",
  keywords: ["Qatar visa requirements", "Qatar tourist visa 2026", "Qatar work visa", "Hayya visa Qatar", "Qatar visa on arrival"],
  ogTitle: "Qatar Visa Requirements 2026 — Complete Guide",
  ogDescription: "Everything you need to know about Qatar visas: tourist, work, family, fees, and how to apply.",
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
          text: "Citizens of GCC countries (Saudi Arabia, UAE, Kuwait, Bahrain, Oman) can enter Qatar without a visa. Additionally, over 100 nationalities including the US, UK, EU, Australia, Canada, and Japan receive a free visa on arrival valid for 30 days.",
        },
      },
      {
        "@type": "Question",
        name: "How do I apply for a Qatar tourist visa?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Apply online via the Hayya platform (hayya.qa) or through Qatar's e-visa portal. Upload your passport, photo, and travel itinerary. Processing takes 3–5 business days. The fee is QAR 100 (approx. $27 USD).",
        },
      },
      {
        "@type": "Question",
        name: "How long can I stay in Qatar on a tourist visa?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "A standard Qatar tourist visa allows a 30-day stay, extendable once for another 30 days. Visa-on-arrival grants 30 days which can be extended to 60 days total.",
        },
      },
      {
        "@type": "Question",
        name: "What is required for a Qatar work visa?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "A Qatar work visa requires a job offer from a Qatar-based employer. Your employer applies for a work permit through the Ministry of Labour. You then receive a visa to enter and obtain your Qatar ID (QID) within 30 days of arrival.",
        },
      },
    ],
  };

  return (
    <div className="-mx-4 sm:-mx-5 md:-mx-8 lg:-mx-12 -mt-5 sm:-mt-6">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: safeJsonLd(jsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: safeJsonLd({ "@context": "https://schema.org", "@type": "BreadcrumbList", itemListElement: [{ "@type": "ListItem", position: 1, name: "Home", item: SITE_URL }, { "@type": "ListItem", position: 2, name: "Qatar Visa Requirements", item: `${SITE_URL}/qatar-visa-requirements` }] }) }} />

      {/* ── Hero ─────────────────────────────────────────────────────
          FIX: removed diagonal-mask clip-path (breaks on mobile).
          FIX: hero height is auto on mobile — min-h only kicks in at md+.
          FIX: heading capped at text-3xl on mobile, scales up on larger screens.
      ──────────────────────────────────────────────────────────────── */}
      <section className="relative min-h-[460px] md:min-h-[580px] flex items-center overflow-hidden">
        <div className="absolute inset-0">
          <Image
            src="/west-bay-qatar.jpg"
            alt="West Bay Doha skyline at sunset reflected on calm water"
            fill
            sizes="100vw"
            className="object-cover"
            priority
          />
          {/* Stronger bottom-to-top overlay on mobile so short hero still reads well */}
          <div className="absolute inset-0 bg-gradient-to-r from-[#1a0008]/95 via-[#1a0008]/65 to-[#1a0008]/30" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#1a0008]/70 via-transparent to-transparent" />
        </div>

        <div className="relative z-10 w-full max-w-7xl mx-auto px-5 sm:px-8 md:px-12 lg:px-16 py-12 md:py-20">
          {/* FIX: text-3xl mobile → text-5xl tablet → text-6xl desktop */}
          <h1 className="font-[var(--font-newsreader)] text-3xl sm:text-5xl lg:text-6xl leading-[1.1] text-white tracking-tight mb-5 max-w-xl">
            Your Guide to<br />
            <span className="italic text-[#ffb2bd]">Qatar Residency</span>
          </h1>

          <p className="text-white/70 text-sm md:text-base max-w-sm md:max-w-md mb-8 leading-relaxed">
            Everything you need to enter, work, or settle in Qatar — from visa-on-arrival to full residency.
          </p>

          {/* Stat row — wraps cleanly on mobile */}
          <div className="flex flex-wrap gap-6 mb-8">
            {[
              { label: "Processing Time", value: "3–7 days" },
              { label: "Tourist Visa Fee", value: "QAR 100" },
              { label: "Visa-free Nations", value: "100+" },
            ].map(({ label, value }) => (
              <div key={label}>
                <p className="text-[10px] font-bold uppercase tracking-widest text-white/50 mb-0.5">{label}</p>
                <p className="text-lg font-semibold text-white">{value}</p>
              </div>
            ))}
          </div>

          {/* FIX: CTAs stack on very small screens */}
          <div className="flex flex-col xs:flex-row flex-wrap gap-3">
            <a
              href="https://portal.moi.gov.qa"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 bg-primary text-white px-5 py-3 rounded-lg font-semibold text-sm hover:bg-primary/90 transition-colors shadow-lg shadow-primary/30 whitespace-nowrap"
            >
              Apply on MOI Portal
              <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M7 17L17 7M17 7H7M17 7v10"/></svg>
            </a>
            <a
              href="https://hayya.qa"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 bg-white/10 border border-white/20 backdrop-blur-sm text-white px-5 py-3 rounded-lg font-semibold text-sm hover:bg-white/20 transition-colors whitespace-nowrap"
            >
              Hayya Platform
            </a>
          </div>

          <p className="mt-5 text-white/40 text-xs max-w-xs italic leading-relaxed">
            Visas are issued by Qatar&apos;s Ministry of Interior (MOI). This is an unofficial informational guide.
          </p>
        </div>
      </section>

      {/* ── Process Bar ──────────────────────────────────────────────
          FIX: on mobile, show a simple 2-column grid of numbered steps.
               Connector lines hidden entirely on mobile — only shown sm+.
      ──────────────────────────────────────────────────────────────── */}
      <section className="bg-surface-container-low border-y border-outline-variant/30">
        <div className="max-w-7xl mx-auto px-5 sm:px-8 md:px-12 py-5 md:py-6">

          {/* Mobile: 2-col grid */}
          <div className="grid grid-cols-2 gap-3 sm:hidden">
            {[
              { n: "1", label: "Check Eligibility" },
              { n: "2", label: "Apply Online" },
              { n: "3", label: "Pay Fee" },
              { n: "4", label: "Track Status" },
              { n: "5", label: "Arrive in Qatar" },
            ].map(({ n, label }, i) => (
              <div key={n} className={`flex items-center gap-3 p-2 ${i === 4 ? "col-span-2 justify-center" : ""}`}>
                <span className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm shrink-0 ${i === 0 ? "bg-primary text-white" : "border-2 border-primary/20 text-primary/50"}`}>
                  {n}
                </span>
                <span className={`text-xs font-semibold ${i === 0 ? "text-primary" : "text-stone-500"}`}>{label}</span>
              </div>
            ))}
          </div>

          {/* sm+: horizontal row with connector lines */}
          <div className="hidden sm:flex items-center justify-between">
            {[
              { n: "1", label: "Check Eligibility" },
              { n: "2", label: "Apply Online" },
              { n: "3", label: "Pay Fee" },
              { n: "4", label: "Track Status" },
              { n: "5", label: "Arrive in Qatar" },
            ].map(({ n, label }, i) => (
              <div key={n} className="flex items-center">
                {i > 0 && <div className="h-px w-8 lg:w-16 bg-primary/15 mx-1" />}
                <div className="flex flex-col items-center text-center">
                  <span className={`w-9 h-9 rounded-full flex items-center justify-center font-bold text-sm ${i === 0 ? "bg-primary text-white shadow-md shadow-primary/25" : "border-2 border-primary/25 text-primary/60"}`}>
                    {n}
                  </span>
                  <span className={`text-xs font-semibold mt-2 ${i === 0 ? "text-primary" : "text-stone-500"}`}>{label}</span>
                </div>
              </div>
            ))}
          </div>

        </div>
      </section>

      {/* ── Content wrapper ───────────────────────────────────────── */}
      <div className="max-w-7xl mx-auto px-5 sm:px-8 md:px-12 lg:px-16 py-10 md:py-14 space-y-16 md:space-y-20">

        {/* ── Step 1 + Step 2 ───────────────────────────────────── */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 md:gap-14 items-start">

          {/* Step 1 — Document Preparation */}
          <div className="flex gap-5 group">
            <span className="text-4xl md:text-5xl font-[var(--font-newsreader)] text-surface-container-highest select-none shrink-0 group-hover:text-primary/10 transition-colors leading-none mt-1">01</span>
            <div>
              <h2 className="font-[var(--font-newsreader)] text-xl md:text-2xl text-on-surface mb-2">Document Preparation</h2>
              <p className="text-stone-500 text-sm leading-relaxed mb-5">
                Have high-resolution scans of the following ready before starting your application.
              </p>
              <ul className="space-y-4">
                {[
                  { doc: "Valid Passport", note: "Minimum 6 months validity remaining" },
                  { doc: "Passport Photo", note: "White background, high resolution digital scan" },
                  { doc: "Proof of Accommodation", note: "Hotel booking or sponsor letter" },
                  { doc: "Travel Itinerary", note: "Flight bookings to and from Qatar" },
                ].map(({ doc, note }) => (
                  <li key={doc} className="flex items-start gap-3">
                    <svg className="w-5 h-5 text-secondary mt-0.5 shrink-0" viewBox="0 0 24 24" fill="currentColor"><path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/></svg>
                    <span>
                      <span className="font-semibold text-on-surface text-sm">{doc}</span>
                      <span className="block text-xs text-stone-400 mt-0.5">{note}</span>
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Step 2 — Application Portal (form mockup)
              FIX: form fields are single-column on mobile, 2-col on sm+ */}
          <div className="card-base p-5 sm:p-7 relative group">
            <span className="absolute -top-7 right-5 text-4xl md:text-5xl font-[var(--font-newsreader)] text-surface-container-highest select-none group-hover:text-primary/10 transition-colors">02</span>
            <h2 className="font-[var(--font-newsreader)] text-xl md:text-2xl text-on-surface mb-5">Application Portal</h2>

            <div className="space-y-3 opacity-60 pointer-events-none select-none">
              {/* FIX: grid-cols-1 on mobile, 2 on sm */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {["Passport Number", "Full Name"].map((f) => (
                  <div key={f}>
                    <p className="text-[10px] font-bold uppercase tracking-wider text-stone-500 mb-1">{f}</p>
                    <div className="h-9 bg-surface-container rounded border border-outline-variant/50" />
                  </div>
                ))}
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {["Date of Birth", "Nationality"].map((f) => (
                  <div key={f}>
                    <p className="text-[10px] font-bold uppercase tracking-wider text-stone-500 mb-1">{f}</p>
                    <div className="h-9 bg-surface-container rounded border border-outline-variant/50" />
                  </div>
                ))}
              </div>
              <div>
                <p className="text-[10px] font-bold uppercase tracking-wider text-stone-500 mb-1">Country of Residence</p>
                <div className="h-9 bg-surface-container rounded border border-outline-variant/50" />
              </div>
            </div>

            <div className="mt-5 pt-4 border-t border-outline-variant/30 text-center">
              <span className="text-[10px] font-bold text-primary uppercase tracking-[0.15em]">Preview only — apply via MOI portal</span>
            </div>
          </div>
        </div>

        {/* ── Step 3 + Step 4 ───────────────────────────────────── */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 md:gap-14 items-start">

          {/* Step 3 — Fee Payment
              FIX: p-6 on mobile, p-10 on md+ */}
          <div className="bg-primary rounded-xl p-6 md:p-10 relative overflow-hidden">
            <span className="absolute top-3 right-5 text-5xl font-[var(--font-newsreader)] text-white/10 select-none">03</span>
            <h2 className="font-[var(--font-newsreader)] text-2xl md:text-3xl text-white italic mb-4">Fee Payment</h2>
            <p className="text-white/75 text-sm leading-relaxed mb-6">
              Payment is processed through a secure gateway on the official government portal. Ensure your card supports international online transactions.
            </p>

            <div className="space-y-2 mb-6">
              {[
                { type: "Tourist e-Visa", fee: "QAR 100" },
                { type: "Visa Extension", fee: "QAR 200" },
                { type: "Family Visa (per person)", fee: "QAR 200" },
                { type: "Visa-on-Arrival", fee: "Free" },
              ].map(({ type, fee }) => (
                <div key={type} className="flex justify-between items-center py-2 border-b border-white/10 last:border-0">
                  <span className="text-sm text-white/80">{type}</span>
                  <span className="text-sm font-bold text-[#e4c193] shrink-0 ml-4">{fee}</span>
                </div>
              ))}
            </div>

            <div className="p-3 bg-white/10 border border-white/15 rounded-lg flex items-start gap-2">
              <svg className="w-4 h-4 text-[#e4c193] shrink-0 mt-0.5" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-6h2v6zm0-8h-2V7h2v2z"/></svg>
              <p className="text-xs text-white/70">Payment is only accepted on the official MOI portal. Beware of third-party agents charging extra fees.</p>
            </div>
          </div>

          {/* Step 4 — Tracking & Arrival
              FIX: stack number + content vertically on mobile for easier reading */}
          <div>
            <div className="flex items-start gap-4 mb-4">
              <span className="text-4xl md:text-5xl font-[var(--font-newsreader)] text-surface-container-highest select-none shrink-0 leading-none">04</span>
              <h2 className="font-[var(--font-newsreader)] text-xl md:text-2xl text-on-surface pt-1">Tracking & Arrival</h2>
            </div>
            <p className="text-stone-500 text-sm leading-relaxed mb-5">
              Monitor your application status online. Upon approval, your visa is emailed — keep a digital copy ready.
            </p>

            <a
              href="https://portal.moi.gov.qa"
              target="_blank"
              rel="noopener noreferrer"
              className="flex justify-between items-center p-4 border border-outline-variant hover:border-primary transition-colors rounded-lg group/link mb-4"
            >
              <span className="font-medium text-sm text-on-surface">Official Tracking Portal</span>
              <svg className="w-4 h-4 text-primary group-hover/link:translate-x-1 transition-transform shrink-0 ml-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
            </a>

            <div className="p-4 md:p-5 bg-surface-container-low rounded-xl">
              <h3 className="text-[10px] font-bold uppercase tracking-widest text-primary mb-3">Arrival Tips</h3>
              <ul className="space-y-2 text-sm text-stone-600">
                {[
                  "Hamad International Airport (HIA) has dedicated e-gates for visa holders.",
                  "Keep your digital visa accessible on your mobile device.",
                  "Work visa holders must obtain their QID within 30 days of arrival.",
                ].map((tip) => (
                  <li key={tip} className="flex items-start gap-2">
                    <span className="text-primary mt-0.5 shrink-0">·</span>
                    {tip}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* ── Visa Types ─────────────────────────────────────────── */}
        <div>
          <div className="section-label">Visa Types</div>
          <h2 className="font-[var(--font-newsreader)] text-2xl md:text-3xl text-primary mb-6 md:mb-8">Which Visa Do You Need?</h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-5">
            {[
              {
                title: "Visa on Arrival",
                icon: "✈️",
                color: "bg-emerald-50 border-emerald-100",
                hcolor: "text-emerald-900",
                points: ["100+ nationalities eligible", "Free of charge at HIA", "Valid 30 days, extendable to 60"],
              },
              {
                title: "Tourist e-Visa",
                icon: "🌐",
                color: "bg-sky-50 border-sky-100",
                hcolor: "text-sky-900",
                points: ["Apply via visa.moi.gov.qa", "Fee: QAR 100 (~$27 USD)", "3–5 business days processing", "Valid 30 days, single entry"],
              },
              {
                title: "Work Visa",
                icon: "💼",
                color: "bg-amber-50 border-amber-100",
                hcolor: "text-amber-900",
                points: ["Sponsored by Qatar employer", "Employer applies via MOI", "Obtain QID within 30 days", "No NOC required since 2020"],
              },
              {
                title: "Family Residence",
                icon: "👨‍👩‍👧",
                color: "bg-rose-50 border-rose-100",
                hcolor: "text-rose-900",
                points: ["Min. salary QAR 10,000/mo", "Sponsor spouse & children", "Fee: QAR 200 per member", "5–10 business days"],
              },
              {
                title: "Hotel-Sponsored",
                icon: "🏨",
                color: "bg-violet-50 border-violet-100",
                hcolor: "text-violet-900",
                points: ["Hotel applies on your behalf", "Usually free of charge", "Tied to hotel stay duration"],
              },
              {
                title: "GCC Nationals",
                icon: "🛡️",
                color: "bg-stone-50 border-stone-200",
                hcolor: "text-stone-900",
                points: ["No visa required", "Saudi, UAE, Kuwait, Bahrain, Oman", "Enter freely with national ID"],
              },
            ].map(({ title, icon, color, hcolor, points }) => (
              <div key={title} className={`border ${color} rounded-xl p-4 md:p-5`}>
                <div className="text-2xl mb-3">{icon}</div>
                <h3 className={`font-semibold text-sm md:text-base ${hcolor} mb-3`}>{title}</h3>
                <ul className="space-y-1.5">
                  {points.map((p) => (
                    <li key={p} className="text-xs text-gray-600 flex items-start gap-1.5">
                      <span className="text-gray-400 mt-0.5 shrink-0">–</span>
                      {p}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        {/* ── FAQ ────────────────────────────────────────────────── */}
        <div>
          <div className="section-label">FAQ</div>
          <h2 className="font-[var(--font-newsreader)] text-2xl md:text-3xl text-primary mb-6 md:mb-8">Frequently Asked Questions</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4">
            {[
              { q: "Can I extend my tourist visa?", a: "Yes. Tourist visas can be extended once for an additional 30 days via the MOI portal or at an immigration office. Fee: QAR 200." },
              { q: "Do I need travel insurance for Qatar?", a: "Travel insurance is not mandatory for visitors, but strongly recommended. All residents are required to have health insurance." },
              { q: "Can I work on a tourist visa?", a: "No. Working on a tourist visa is illegal in Qatar and can result in deportation and a re-entry ban." },
              { q: "What happened to the No-Objection Certificate?", a: "Qatar abolished the NOC in 2020. Workers can now change jobs freely without needing their employer's permission." },
            ].map(({ q, a }) => (
              <details key={q} className="bg-surface-container-low border border-outline-variant/40 rounded-xl p-4 md:p-5 cursor-pointer group">
                <summary className="font-semibold text-sm text-on-surface list-none flex justify-between items-center gap-3">
                  <span>{q}</span>
                  <svg className="w-4 h-4 text-primary shrink-0 group-open:rotate-180 transition-transform" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M6 9l6 6 6-6"/></svg>
                </summary>
                <p className="text-sm text-stone-500 mt-3 leading-relaxed">{a}</p>
              </details>
            ))}
          </div>
        </div>

        {/* ── CTA ────────────────────────────────────────────────── */}
        <div className="text-center py-8 md:py-10">
          <div className="inline-block h-px w-16 bg-secondary mb-6 md:mb-8" />
          <h2 className="font-[var(--font-newsreader)] text-2xl md:text-4xl text-primary mb-4 leading-tight">
            Ready to begin your journey<br className="hidden sm:block" /> to the State of Qatar?
          </h2>
          <p className="text-stone-500 text-sm mb-6 md:mb-8 max-w-xs mx-auto">
            Applications are managed exclusively by the Ministry of Interior.
          </p>
          <a
            href="https://portal.moi.gov.qa"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 bg-primary text-white px-6 md:px-8 py-3.5 md:py-4 rounded-lg font-semibold text-sm hover:bg-primary/90 transition-colors shadow-lg shadow-primary/20"
          >
            Start Application on MOI Portal
            <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M7 17L17 7M17 7H7M17 7v10"/></svg>
          </a>
        </div>

        {/* ── Internal links ──────────────────────────────────────── */}
        <section className="bg-rose-50 border border-rose-100 rounded-xl p-4 md:p-5 text-sm">
          <p className="font-semibold text-rose-900 mb-3">Planning to move to Qatar?</p>
          <div className="flex flex-wrap gap-3 md:gap-4">
            <a href="/jobs" className="text-rose-700 hover:underline">→ Browse Qatar Jobs</a>
            <a href="/work-in-qatar" className="text-rose-700 hover:underline">→ Work in Qatar</a>
            <a href="/cost-of-living-doha" className="text-rose-700 hover:underline">→ Cost of Living in Doha</a>
            <a href="/qatar-salary-guide" className="text-rose-700 hover:underline">→ Salary Guide</a>
          </div>
        </section>

      </div>
    </div>
  );
}
