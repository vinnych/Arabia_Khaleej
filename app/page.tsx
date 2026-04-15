import { Suspense } from "react";
import HomeHero from "@/components/HomeHero";
import PrayerCard from "@/components/PrayerCard";
import { getFullWeather } from "@/lib/weather";
import { getQARRates } from "@/lib/currency";
import { safeJsonLd } from "@/lib/utils";
import { pageMeta } from "@/lib/seo";

export const metadata = pageMeta({
  title: "Qatar Portal — Essential Services & Utilities in Doha",
  description: "An independent gateway to Qatar. Access real-time Doha prayer times, weather updates, QAR exchange rates, and essential public utilities in the State of Qatar.",
  path: "/",
  keywords: ["Qatar Portal", "Doha prayer times", "Qatar Visa", "Metro Doha", "Currency exchange QAR", "Qatar essential services"],
  ogTitle: "Qatar Portal — Independent Digital Concierge",
  ogDescription: "Access live prayer times, weather, and currency rates in Qatar through our independent digital portal.",
});

const homeJsonLd = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  "name": "Qatar Portal",
  "alternateName": "بوابة قطر",
  "url": "https://qatar-portal.vercel.app",
  "description": "Essential utilities and services for residents and visitors in Qatar.",
};

const CURRENCY_SYMBOLS: Record<string, string> = {
  USD: "$", EUR: "€", GBP: "£", INR: "₹", PKR: "₨", PHP: "₱", EGP: "£", BDT: "৳",
};

export default async function Home() {
  const [weather, currency] = await Promise.allSettled([
    getFullWeather(),
    getQARRates(),
  ]);

  const fullWeather   = weather.status   === "fulfilled" ? weather.value   : null;
  const weatherData   = fullWeather?.current ?? null;
  const currencyData  = currency.status  === "fulfilled" ? currency.value  : null;
  const topRates      = currencyData?.rates?.slice(0, 4) ?? [];

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: safeJsonLd(homeJsonLd) }} />

      <div className="-mx-4 sm:-mx-5 md:-mx-8 lg:-mx-12 -mt-5 sm:-mt-6 -mb-20 md:-mb-6 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 transition-colors duration-300">

        <div className="max-w-7xl mx-auto px-6 lg:px-12 py-10 space-y-20">

          <HomeHero />

          {/* ── Live Data & Essential Guides ──────────────────── */}
          <section id="widgets" className="bento-grid">

            {/* Prayer — col-span-5 (most-used feature, placed first) */}
            <div className="lg:col-span-5 bento-tile !p-0 overflow-hidden group">
              <Suspense fallback={<div className="h-full min-h-[360px] rounded-[2rem] bg-slate-100 dark:bg-slate-800 animate-pulse" />}>
                <PrayerCard />
              </Suspense>
            </div>

            {/* Live Data stack — col-span-7: Weather + Currency */}
            <div className="lg:col-span-7 flex flex-col gap-6">

              {/* Weather — entire card is the click target */}
              <div className="bento-tile flex flex-col justify-between relative overflow-hidden group bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-slate-900 dark:to-indigo-950/30 flex-1 cursor-pointer">
                {/* Stretched link covers the whole card */}
                <a href="/weather" className="absolute inset-0 z-10 rounded-[2rem]" aria-label="View full weather forecast for Doha" />
                <span className="absolute -right-8 -top-8 material-symbols-outlined text-[180px] text-blue-500 dark:text-blue-400 opacity-[0.03] group-hover:opacity-[0.06] group-hover:scale-110 transition-all duration-700 select-none">wb_sunny</span>
                <div className="relative z-0">
                  <p className="label-xs text-slate-400 mb-6">
                    <span className="lang-en">Current Climate — Doha</span>
                    <span className="lang-ar">الطقس الحالي — الدوحة</span>
                  </p>
                  {weatherData ? (
                    <div className="flex items-center gap-4">
                      <span className="text-5xl sm:text-6xl font-black text-slate-900 dark:text-slate-100 tracking-tighter">{weatherData.temperature}°</span>
                      <div className="flex flex-col">
                        <span className="material-symbols-outlined text-3xl text-blue-500 dark:text-blue-400" style={{ fontVariationSettings: "'FILL' 1" }}>
                          {weatherData.weatherCode === 0 ? "wb_sunny" : "partly_cloudy_day"}
                        </span>
                        <span className="text-xs font-black uppercase tracking-widest text-slate-500">{weatherData.condition}</span>
                      </div>
                    </div>
                  ) : (
                    <p className="text-sm text-slate-500">Weather unavailable</p>
                  )}
                </div>
                {/* Visual footer — decorative only, the stretched link above handles navigation */}
                <div className="mt-6 flex items-center justify-between relative z-0">
                  <span className="text-sm font-black text-slate-900 dark:text-slate-100 uppercase tracking-widest">
                    <span className="lang-en">Full Forecast</span>
                    <span className="lang-ar">توقعات كاملة</span>
                  </span>
                  <span className="material-symbols-outlined text-blue-500 dark:text-blue-400 group-hover:translate-x-1 transition-transform">arrow_forward</span>
                </div>
              </div>

              {/* Currency */}
              <div className="bento-tile flex flex-col bg-slate-950 !text-white border-none overflow-hidden group relative flex-1 cursor-pointer">
                {/* Stretched link covers the whole card */}
                <a href="/currency" className="absolute inset-0 z-10 rounded-[2rem]" aria-label="View QAR exchange rates" />
                <div className="absolute inset-0 bg-gradient-to-tr from-primary/10 to-transparent pointer-events-none" />
                <p className="label-xs text-white/40 mb-6 relative z-0">
                  <span className="lang-en">QAR Exchange Rate</span>
                  <span className="lang-ar">سعر صرف الريال</span>
                </p>
                <div className="space-y-4 relative z-0 flex-1">
                  {topRates.slice(0, 4).map((rate) => (
                    <div key={rate.code} className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-xl bg-white/5 flex items-center justify-center font-bold text-accent border border-white/5 group-hover:bg-accent group-hover:text-black transition-all text-sm">
                          {CURRENCY_SYMBOLS[rate.code] ?? rate.code[0]}
                        </div>
                        <span className="font-bold text-sm tracking-widest">{rate.code}</span>
                      </div>
                      <span className="font-mono font-black text-xl text-accent">
                        {rate.value.toFixed(3)}
                      </span>
                    </div>
                  ))}
                </div>
                {/* Visual footer — decorative only, stretched link above handles navigation */}
                <div className="mt-8 flex items-center justify-between relative z-0">
                  <span className="label-xs text-white/60">
                    <span className="lang-en">All Rates</span>
                    <span className="lang-ar">جميع الأسعار</span>
                  </span>
                  <span className="material-symbols-outlined text-accent group-hover:translate-x-1 transition-transform" style={{ fontSize: "18px" }}>arrow_forward</span>
                </div>
              </div>
            </div>

            {/* Essential Guides — full-width row */}
            <div className="lg:col-span-12 bento-tile bg-gradient-to-br from-primary to-primary-dark !text-white border-none overflow-hidden relative">
              <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full blur-3xl translate-x-1/2 -translate-y-1/2" />
              <div className="relative z-10 flex flex-col sm:flex-row sm:items-center gap-8">
                <div className="shrink-0">
                  <p className="label-xs text-white/60 mb-2">
                    <span className="lang-en">Essential Guides</span>
                    <span className="lang-ar">الأدلة الأساسية</span>
                  </p>
                  <h2 className="national-title text-3xl sm:text-4xl text-white">
                    <span className="lang-en">Qatar at a Glance</span>
                    <span className="lang-ar">قطر في لمحة</span>
                  </h2>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:ml-auto">
                  {[
                    { icon: "subway",         en: "Metro",    ar: "المترو",    href: "/qatar-metro" },
                    { icon: "id_card",         en: "Visa",     ar: "التأشيرة",  href: "/qatar-visa-requirements" },
                    { icon: "bar_chart",       en: "Salaries", ar: "الرواتب",   href: "/qatar-salary-guide" },
                    { icon: "calendar_month",  en: "Holidays", ar: "الإجازات",  href: "/qatar-public-holidays" },
                    { icon: "gavel",           en: "Labour",   ar: "العمل",     href: "/qatar-labour-law" },
                    { icon: "home_work",       en: "Living",   ar: "المعيشة",   href: "/cost-of-living-doha" },
                    { icon: "work",            en: "Work in QA", ar: "العمل",   href: "/work-in-qatar" },
                    { icon: "emergency",       en: "Emergency", ar: "الطوارئ",  href: "/emergency-numbers-qatar" },
                  ].map((item) => (
                    <a
                      key={item.href}
                      href={item.href}
                      className="group p-3 rounded-2xl bg-white/10 backdrop-blur-md border border-white/10 hover:bg-white hover:border-white transition-all duration-300 flex items-center gap-3"
                    >
                      <span className="material-symbols-outlined text-white group-hover:text-primary transition-colors" style={{ fontSize: "20px" }}>
                        {item.icon}
                      </span>
                      <p className="font-bold text-xs group-hover:text-primary transition-colors leading-tight">
                        <span className="lang-en">{item.en}</span>
                        <span className="lang-ar">{item.ar}</span>
                      </p>
                    </a>
                  ))}
                </div>
              </div>
            </div>

          </section>

          {/* ── FAQ ───────────────────────────────────────────────── */}
          <section className="py-20 max-w-5xl mx-auto">
            <div className="text-center mb-20">
              <h2 className="national-title text-5xl sm:text-7xl mb-6 text-slate-900 dark:text-slate-100">
                <span className="lang-en">Common Inquiries</span>
                <span className="lang-ar">الأسئلة الشائعة</span>
              </h2>
            </div>
            <div className="grid gap-6">
              {[
                {
                  icon: "badge",
                  en: "How do I get a Qatar ID (QID)?",
                  ar: "كيف أحصل على بطاقة الهوية القطرية؟",
                  a: {
                    en: "Your employer sponsors the QID application through the MOI portal. The process takes 7–30 days and costs QAR 100. Our step-by-step guide covers documents, fees, and timelines.",
                    ar: "يتقدم صاحب العمل بطلب البطاقة عبر بوابة وزارة الداخلية. تستغرق العملية 7-30 يومًا وتكلف 100 ريال قطري.",
                  },
                  link: { href: "/qatar-services/qid", en: "View QID Guide →", ar: "دليل البطاقة →" },
                },
                {
                  icon: "id_card",
                  en: "Do I need a visa to visit Qatar?",
                  ar: "هل أحتاج تأشيرة لزيارة قطر؟",
                  a: {
                    en: "Over 100 nationalities — including the US, UK, EU, and all GCC citizens — receive visa-free or free visa-on-arrival entry. Check our Visa Guide for your specific country.",
                    ar: "أكثر من 100 جنسية، بما فيها الولايات المتحدة والمملكة المتحدة والاتحاد الأوروبي ومواطنو دول الخليج، يحصلون على دخول بدون تأشيرة.",
                  },
                  link: { href: "/qatar-visa-requirements", en: "View Visa Requirements →", ar: "متطلبات التأشيرة →" },
                },
                {
                  icon: "mosque",
                  en: "When is Fajr prayer in Doha today?",
                  ar: "ما وقت صلاة الفجر في الدوحة اليوم؟",
                  a: {
                    en: "Prayer times in Doha are calculated daily using Muslim World League (MWL) standards for coordinates 25.28°N, 51.53°E. Check our live Prayer Times page for today's exact times.",
                    ar: "يتم حساب أوقات الصلاة في الدوحة يوميًا وفق معايير رابطة العالم الإسلامي للإحداثيات 25.28 شمالًا، 51.53 شرقًا.",
                  },
                  link: { href: "/prayer", en: "Today's Prayer Times →", ar: "أوقات الصلاة اليوم →" },
                },
              ].map(({ icon, en, ar, a, link }) => (
                <details key={en} className="group bg-white dark:bg-slate-900/50 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-xl transition-all overflow-hidden" suppressHydrationWarning>
                  <summary className="p-8 flex items-center justify-between cursor-pointer list-none">
                    <div className="flex items-center gap-6">
                      <span className="material-symbols-outlined text-primary group-hover:scale-125 transition-transform" style={{ fontSize: "24px" }}>{icon}</span>
                      <span className="font-bold text-lg text-slate-900 dark:text-slate-100 tracking-tight">
                        <span className="lang-en">{en}</span>
                        <span className="lang-ar">{ar}</span>
                      </span>
                    </div>
                    <span className="material-symbols-outlined text-slate-300 group-open:rotate-180 transition-transform">expand_more</span>
                  </summary>
                  <div className="px-8 pb-8 pt-2 space-y-4">
                    <p className="text-base leading-relaxed text-slate-600 dark:text-slate-400 max-w-2xl">
                      <span className="lang-en">{a.en}</span>
                      <span className="lang-ar">{a.ar}</span>
                    </p>
                    <a href={link.href} className="inline-flex items-center text-sm font-black text-primary hover:underline">
                      <span className="lang-en">{link.en}</span>
                      <span className="lang-ar">{link.ar}</span>
                    </a>
                  </div>
                </details>
              ))}
            </div>
          </section>
        </div>
      </div>
    </>
  );
}
