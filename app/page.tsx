import { Suspense } from "react";
import Image from "next/image";
import HomeHero from "@/components/HomeHero";
import PrayerCard from "@/components/PrayerCard";
import { getFullWeather } from "@/lib/weather";
import { getQARRates } from "@/lib/currency";
import { getJobs } from "@/lib/jobs";
import { safeJsonLd } from "@/lib/utils";
import { pageMeta } from "@/lib/seo";

export const metadata = pageMeta({
  title: "Doha Prayer Times Today — Qatar Jobs & Services | Qatar Portal",
  description: "Accurate Doha prayer times for today including Fajr, Dhuhr, Asr, Maghrib and Isha. Plus latest job listings and weather updates.",
  path: "/",
  keywords: ["Doha prayer times today", "Fajr time Doha", "Qatar prayer times", "jobs in Qatar", "Maghrib time Doha", "Qatar Portal"],
  ogTitle: "Doha Prayer Times Today — Qatar Jobs & Services | Qatar Portal",
  ogDescription: "Accurate Doha prayer times for today including Fajr, Dhuhr, Asr, Maghrib and Isha. Plus latest job listings and weather updates.",
});

const homeJsonLd = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "@id": "https://qatar-portal.vercel.app/#faq",
  mainEntity: [
    { "@type": "Question", name: "What time is Fajr in Doha today?", acceptedAnswer: { "@type": "Answer", text: "Fajr prayer time in Doha today can be found on Qatar Portal, updated daily from the Aladhan API." } },
    { "@type": "Question", name: "What time is Maghrib in Doha today?", acceptedAnswer: { "@type": "Answer", text: "Maghrib prayer time in Doha today is available on Qatar Portal, updated daily." } },
    { "@type": "Question", name: "What are today's prayer times in Qatar?", acceptedAnswer: { "@type": "Answer", text: "Today's prayer times in Qatar are updated daily on Qatar Portal." } },
    { "@type": "Question", name: "Where can I find jobs in Qatar?", acceptedAnswer: { "@type": "Answer", text: "Qatar Portal lists the latest job vacancies in Doha and Qatar, updated daily." } },
  ],
};

const BADGE_COLORS = ["bg-blue-600", "bg-red-700", "bg-indigo-600"];

const CURRENCY_SYMBOLS: Record<string, string> = {
  USD: "$", EUR: "€", GBP: "£", INR: "₹", PKR: "₨", PHP: "₱", EGP: "£", BDT: "৳",
};
const CURRENCY_BG   = ["bg-blue-50 dark:bg-blue-900/30", "bg-indigo-50 dark:bg-indigo-900/30", "bg-orange-50 dark:bg-orange-900/30", "bg-green-50 dark:bg-green-900/30"];
const CURRENCY_TEXT = ["text-blue-600 dark:text-blue-400", "text-indigo-600 dark:text-indigo-400", "text-orange-600 dark:text-orange-400", "text-green-600 dark:text-green-400"];

export default async function Home() {
  const [weather, currency, jobs] = await Promise.allSettled([
    getFullWeather(),
    getQARRates(),
    getJobs(5),
  ]);

  const fullWeather   = weather.status   === "fulfilled" ? weather.value   : null;
  const weatherData   = fullWeather?.current ?? null;
  const todayForecast = fullWeather?.forecast?.[0] ?? null;
  const currencyData  = currency.status  === "fulfilled" ? currency.value  : null;
  const jobsData      = jobs.status      === "fulfilled" ? jobs.value      : [];
  const topRates      = currencyData?.rates?.slice(0, 4) ?? [];

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: safeJsonLd(homeJsonLd) }} />

      <div className="-mx-4 sm:-mx-5 md:-mx-8 lg:-mx-12 -mt-5 sm:-mt-6 -mb-20 md:-mb-6 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 transition-colors duration-300 overflow-x-hidden">

        {/* ── Page content ─────────────────────────────────────── */}
        {/* ── Page content ─────────────────────────────────────── */}
        <div className="max-w-7xl mx-auto px-6 lg:px-12 py-6 sm:py-10 space-y-12">

          {/* Hero */}
          <HomeHero />

          {/* ── Bento Grid Widgets ─────────────────────────────── */}
          <section id="widgets" className="bento-grid">

            {/* Prayer — col-span-4 */}
            <div className="lg:col-span-4 bento-tile">
              <Suspense fallback={<div className="h-72 rounded-2xl bg-slate-100 dark:bg-slate-800 animate-pulse" />}>
                <PrayerCard />
              </Suspense>
            </div>

            {/* Weather — col-span-4 */}
            <div className="lg:col-span-4 bento-tile flex flex-col justify-between overflow-hidden relative">
               {/* Decorative background icon */}
               <span className="absolute -right-6 -top-6 material-symbols-outlined text-[160px] text-primary opacity-[0.05] rotate-12 pointer-events-none select-none rtl:right-auto rtl:-left-6">wb_sunny</span>

               <div className="relative z-10">
                 <p className="text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-[0.2em] mb-6">
                   <span className="lang-en">Current Climate</span>
                   <span className="lang-ar">الطقس الحالي</span>
                 </p>

                 {weatherData ? (
                   <div className="space-y-6">
                     <div className="flex items-center gap-4">
                       <span className="text-5xl sm:text-7xl font-black text-slate-900 dark:text-slate-100 tracking-tighter">{weatherData.temperature}°</span>
                       <div className="flex flex-col">
                         <span className="material-symbols-outlined text-4xl text-primary" style={{ fontVariationSettings: "'FILL' 1" }}>
                           {weatherData.weatherCode === 0 ? "wb_sunny" : "partly_cloudy_day"}
                         </span>
                         <span className="text-sm font-bold opacity-70 uppercase tracking-widest">{weatherData.condition}</span>
                       </div>
                     </div>
                     <div className="grid grid-cols-2 gap-6 border-t border-slate-100 dark:border-slate-800 pt-6">
                       <div>
                         <p className="text-[10px] text-slate-400 uppercase font-black">Humidity</p>
                         <p className="text-lg font-bold">{weatherData.humidity}%</p>
                       </div>
                       <div>
                         <p className="text-[10px] text-slate-400 uppercase font-black">Wind</p>
                         <p className="text-lg font-bold">{weatherData.windSpeed} <small>km/h</small></p>
                       </div>
                     </div>
                   </div>
                 ) : (
                   <p className="text-sm text-slate-500">Weather unavailable</p>
                 )}
               </div>

               <a href="/weather" className="mt-8 flex items-center gap-2 text-sm font-black text-primary group">
                 <span className="lang-en">Full Forecast</span>
                 <span className="lang-ar">التوقعات الكاملة</span>
                 <span className="material-symbols-outlined text-lg group-hover:translate-x-1 transition-transform rtl:rotate-180">arrow_forward</span>
               </a>
            </div>

            {/* Currency — col-span-4 */}
            <div className="lg:col-span-4 bento-tile">
              <p className="text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-[0.2em] mb-8">
                <span className="lang-en">QAR Exchange</span>
                <span className="lang-ar">أسعار الصرف</span>
              </p>
              <div className="space-y-5">
                {topRates.slice(0, 3).map((rate, i) => (
                  <div key={rate.code} className="flex items-center justify-between group">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-xl bg-slate-50 dark:bg-slate-800 flex items-center justify-center font-bold text-primary group-hover:bg-primary group-hover:text-white transition-all">
                        {CURRENCY_SYMBOLS[rate.code] ?? rate.code[0]}
                      </div>
                      <span className="font-bold text-sm">{rate.code}</span>
                    </div>
                    <span className="font-mono font-black text-lg">
                      {rate.value.toFixed(2)}
                    </span>
                  </div>
                ))}
              </div>
              <a href="/currency" className="mt-8 block text-center py-4 bg-slate-50 dark:bg-slate-800 rounded-2xl text-xs font-black uppercase tracking-widest hover:bg-primary hover:text-white transition-all">
                <span className="lang-en">View Market Rates</span>
                <span className="lang-ar">عرض أسعار السوق</span>
              </a>
            </div>

            {/* Quick Jobs — col-span-4 */}
            <div className="lg:col-span-4 bento-tile bg-primary !text-white border-none relative overflow-hidden">
               <span className="absolute -right-4 -bottom-4 material-symbols-outlined text-[120px] opacity-10 pointer-events-none">work</span>
               <p className="text-[11px] font-bold text-white/60 uppercase tracking-[0.2em] mb-6">
                 <span className="lang-en">Opportunities</span>
                 <span className="lang-ar">الفرص المتاحة</span>
               </p>
               <h3 className="text-3xl font-black mb-4">
                 <span className="lang-en">Hire in Qatar</span>
                 <span className="lang-ar">وظائف قطر</span>
               </h3>
               <p className="text-sm font-medium mb-8 text-white/80">
                 Explore {jobsData.length}+ active job listings in Doha and beyond.
               </p>
               <a href="/jobs" className="inline-flex items-center gap-2 bg-white text-primary px-6 py-3 rounded-xl font-bold text-sm shadow-xl shadow-black/10 hover:scale-105 transition-transform">
                 <span className="lang-en">Search Jobs</span>
                 <span className="lang-ar">بحث عن وظيفة</span>
               </a>
            </div>

          </section>

          {/* ── Jobs ──────────────────────────────────────────────── */}
          <section className="bg-white dark:bg-slate-900 rounded-[3rem] p-8 sm:p-10 border border-slate-200 dark:border-slate-800 shadow-sm">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 mb-12">
              <div>
                <h2 className="text-2xl sm:text-4xl font-black tracking-tight text-slate-900 dark:text-slate-100 mb-3">
                  <span className="lang-en">Work in Qatar</span>
                  <span className="lang-ar">وظائف في قطر</span>
                </h2>
                <span className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest">
                  Powered by Google Jobs
                </span>
              </div>
              <div className="bg-blue-50 dark:bg-blue-900/30 px-6 py-4 rounded-2xl flex items-center gap-4 border border-blue-100 dark:border-blue-800/50">
                <div className="w-10 h-10 bg-blue-600 dark:bg-blue-500 rounded-xl flex items-center justify-center text-white">
                  <span className="material-symbols-outlined" style={{ fontSize: "20px" }}>work</span>
                </div>
                <div>
                  <span className="block font-black text-blue-600 dark:text-blue-400 text-lg leading-tight">{jobsData.length}+</span>
                  <span className="text-[10px] font-bold text-blue-600/70 dark:text-blue-400/70 uppercase tracking-widest">
                    <span className="lang-en">New Openings Today</span>
                    <span className="lang-ar">وظيفة جديدة اليوم</span>
                  </span>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              {jobsData.slice(0, 5).map((job) => (
                <a
                  key={job.link}
                  href={`/jobs/${job.slug}`}
                  className="flex flex-col lg:flex-row justify-between lg:items-center p-6 rounded-3xl bg-slate-50 dark:bg-slate-800/50 border border-transparent hover:bg-white dark:hover:bg-slate-800 hover:shadow-xl hover:-translate-y-1 hover:border-slate-200 dark:hover:border-slate-700 transition-all duration-300 group touch-manipulation cursor-pointer"
                >
                  <div className="flex items-center gap-6 mb-6 lg:mb-0">
                    <div className="w-16 h-16 bg-white dark:bg-slate-800 rounded-2xl flex items-center justify-center text-blue-600 dark:text-blue-400 font-black text-2xl shadow-sm border border-slate-200 dark:border-slate-700 shrink-0">
                      {(job.company ?? job.title).charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <h4 className="text-xl font-bold text-slate-900 dark:text-slate-100 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                        {job.title}
                      </h4>
                      <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-sm font-medium mt-2 text-slate-600 dark:text-slate-400">
                        {job.company && (
                          <span className="flex items-center gap-1.5">
                            <span className="material-symbols-outlined text-blue-600 dark:text-blue-400" style={{ fontSize: "18px" }}>apartment</span>
                            {job.company}
                          </span>
                        )}
                        {job.location && (
                          <span className="flex items-center gap-1.5">
                            <span className="material-symbols-outlined text-slate-400" style={{ fontSize: "18px" }}>location_on</span>
                            {job.location}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                  <span className="bg-blue-600 dark:bg-blue-500 text-white px-8 py-4 rounded-xl font-bold text-sm shadow-lg shadow-blue-500/20 shrink-0 text-center hover:bg-blue-700 dark:hover:bg-blue-600 transition-all active:scale-95">
                    <span className="lang-en">Apply Now</span>
                    <span className="lang-ar">قدّم الآن</span>
                  </span>
                </a>
              ))}
              {jobsData.length === 0 && (
                <p className="text-sm text-slate-500 dark:text-slate-400">No job listings available right now.</p>
              )}
            </div>

            <div className="mt-8 text-center">
              <a href="/jobs" className="inline-flex items-center gap-2 px-8 py-4 rounded-2xl font-bold text-sm bg-primary/5 dark:bg-primary/20 hover:bg-primary/10 transition-all text-primary">
                <span className="lang-en">View All Jobs</span>
                <span className="lang-ar">عرض الوظائف</span>
                <span className="material-symbols-outlined" style={{ fontSize: "18px" }}>arrow_outward</span>
              </a>
            </div>
          </section>

          {/* ── FAQ ───────────────────────────────────────────────── */}
          <section className="py-12">
            <div className="text-center mb-16">
              <h2 className="text-2xl sm:text-4xl font-black tracking-tight text-slate-900 dark:text-slate-100 mb-4">
                <span className="lang-en">Frequently Asked Questions</span>
                <span className="lang-ar">الأسئلة الشائعة</span>
              </h2>
            </div>
            <div className="space-y-3 max-w-4xl mx-auto">
              {[
                { icon: "id_card",     en: "Renewing Resident Permit (QID)",   ar: "تجديد الإقامة (البطاقة الشخصية)", a: { en: "QID renewal can be done via the MOI portal or Hukoomi. You'll need a valid passport, medical test results, and employer sponsorship documents.", ar: "يمكن تجديد البطاقة الشخصية عبر بوابة وزارة الداخلية أو حكومي." } },
                { icon: "schedule",    en: "What time is Fajr in Doha today?", ar: "ما موعد صلاة الفجر في الدوحة؟",   a: { en: "Fajr prayer time in Doha is updated daily using the Muslim World League calculation method.", ar: "يُحدَّث وقت صلاة الفجر في الدوحة يوميًا وفق حساب رابطة العالم الإسلامي." } },
                { icon: "wb_twilight", en: "What time is Maghrib today?",       ar: "ما موعد صلاة المغرب اليوم؟",      a: { en: "Maghrib prayer time in Doha is calculated based on sunset time for Qatar, updated daily.", ar: "يُحسب وقت صلاة المغرب بناءً على وقت غروب الشمس في قطر." } },
                { icon: "work",        en: "Where can I find jobs in Qatar?",   ar: "أين أجد وظائف في قطر؟",          a: { en: "Qatar Portal lists the latest job vacancies in Doha and Qatar, updated daily.", ar: "تعرض بوابة قطر أحدث الوظائف الشاغرة في الدوحة وقطر يوميًا." } },
              ].map(({ icon, en, ar, a }) => (
                <details key={en} className="group bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-md transition-all p-1" suppressHydrationWarning>
                  <summary className="p-4 sm:p-6 flex items-center justify-between cursor-pointer list-none touch-manipulation select-none">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 bg-primary/5 dark:bg-primary/30 rounded-xl flex items-center justify-center shrink-0 text-primary">
                        <span className="material-symbols-outlined" style={{ fontSize: "20px" }}>{icon}</span>
                      </div>
                      <span className="font-bold text-lg text-slate-900 dark:text-slate-100">
                        <span className="lang-en">{en}</span>
                        <span className="lang-ar">{ar}</span>
                      </span>
                    </div>
                    <span className="material-symbols-outlined text-primary group-open:rotate-45 transition-transform shrink-0 ml-3" style={{ fontSize: "24px" }}>add</span>
                  </summary>
                  <p className="px-6 pb-6 text-sm leading-relaxed text-slate-600 dark:text-slate-400">
                    <span className="lang-en">{a.en}</span>
                    <span className="lang-ar">{a.ar}</span>
                  </p>
                </details>
              ))}
            </div>
          </section>
        </div>
      </div>
    </>
  );
}
