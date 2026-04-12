import { Suspense } from "react";
import Image from "next/image";
import HomeHero from "@/components/HomeHero";
import PrayerCard from "@/components/PrayerCard";
import { getFullWeather } from "@/lib/weather";
import { getQARRates } from "@/lib/currency";
import { getNews } from "@/lib/rss";
import { getJobs } from "@/lib/jobs";
import { safeJsonLd } from "@/lib/utils";
import { pageMeta } from "@/lib/seo";

export const metadata = pageMeta({
  title: "Doha Prayer Times Today — Qatar News & Jobs | Qatar Portal",
  description: "Accurate Doha prayer times for today including Fajr, Dhuhr, Asr, Maghrib and Isha. Plus latest Qatar news and job listings.",
  path: "/",
  keywords: ["Doha prayer times today", "Fajr time Doha", "Qatar prayer times", "Qatar news today", "jobs in Qatar", "Maghrib time Doha", "Qatar Portal"],
  ogTitle: "Doha Prayer Times Today — Qatar News & Jobs | Qatar Portal",
  ogDescription: "Accurate Doha prayer times for today including Fajr, Dhuhr, Asr, Maghrib and Isha. Plus latest Qatar news and job listings.",
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
  const [weather, currency, news, jobs] = await Promise.allSettled([
    getFullWeather(),
    getQARRates(),
    getNews(3),
    getJobs(5),
  ]);

  const fullWeather   = weather.status   === "fulfilled" ? weather.value   : null;
  const weatherData   = fullWeather?.current ?? null;
  const todayForecast = fullWeather?.forecast?.[0] ?? null;
  const currencyData  = currency.status  === "fulfilled" ? currency.value  : null;
  const newsData      = news.status      === "fulfilled" ? news.value      : [];
  const jobsData      = jobs.status      === "fulfilled" ? jobs.value      : [];
  const topRates      = currencyData?.rates?.slice(0, 4) ?? [];

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: safeJsonLd(homeJsonLd) }} />

      <div className="-mx-4 sm:-mx-5 md:-mx-8 lg:-mx-12 -mt-5 sm:-mt-6 -mb-20 md:-mb-6 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 transition-colors duration-300 overflow-x-hidden">

        {/* ── Page content ─────────────────────────────────────── */}
        <main className="max-w-7xl mx-auto px-6 lg:px-12 py-6 sm:py-10 space-y-16">

          {/* Hero */}
          <HomeHero />

          {/* ── Widgets ─────────────────────────────────────────── */}
          <section id="widgets" className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-6">

            {/* Prayer — col-span-5 */}
            <div className="lg:col-span-5 bg-white dark:bg-slate-900 rounded-4xl p-8 shadow-sm border border-slate-200 dark:border-slate-800 flex flex-col justify-between">
              <Suspense fallback={<div className="h-72 rounded-2xl bg-slate-100 dark:bg-slate-800 animate-pulse" />}>
                <PrayerCard />
              </Suspense>
            </div>

            {/* Weather — col-span-3 */}
            <div className="lg:col-span-3 bg-slate-100 dark:bg-slate-800 rounded-4xl p-8 flex flex-col justify-between overflow-hidden relative border border-slate-200 dark:border-slate-700/50">
              {/* Decorative background icon */}
              <span className="absolute -right-6 -top-6 material-symbols-outlined text-[160px] text-slate-900 dark:text-slate-100 opacity-[0.03] rotate-12 pointer-events-none select-none rtl:right-auto rtl:-left-6">wb_sunny</span>

              <div className="relative z-10 flex flex-col h-full">
                <p className="text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-[0.2em] mb-4">
                  <span className="lang-en">Current Weather</span>
                  <span className="lang-ar">الطقس الحالي</span>
                </p>

                {weatherData ? (
                  <>
                    <div className="flex items-center gap-3">
                      <span
                        className="material-symbols-outlined text-5xl sm:text-6xl shrink-0"
                        style={{
                          fontVariationSettings: "'FILL' 1",
                          color: weatherData.weatherCode === 0 ? "#f59e0b"
                            : weatherData.weatherCode <= 2 ? "#fbbf24"
                            : weatherData.weatherCode === 3 ? "#94a3b8"
                            : weatherData.weatherCode <= 48 ? "#64748b"
                            : weatherData.weatherCode <= 67 ? "#60a5fa"
                            : weatherData.weatherCode <= 77 ? "#bae6fd"
                            : weatherData.weatherCode <= 82 ? "#60a5fa"
                            : "#a78bfa",
                        }}
                      >
                        {weatherData.weatherCode === 0 ? "wb_sunny"
                          : weatherData.weatherCode <= 2 ? "partly_cloudy_day"
                          : weatherData.weatherCode === 3 ? "cloud"
                          : weatherData.weatherCode <= 48 ? "foggy"
                          : weatherData.weatherCode <= 67 ? "rainy"
                          : weatherData.weatherCode <= 77 ? "ac_unit"
                          : weatherData.weatherCode <= 82 ? "rainy"
                          : "thunderstorm"}
                      </span>
                      <div className="flex items-start">
                        <span className="text-5xl sm:text-6xl font-black text-slate-900 dark:text-slate-100 leading-none">{weatherData.temperature}°</span>
                        <span className="text-2xl font-normal mt-1 opacity-50">C</span>
                      </div>
                    </div>

                    <p className="text-sm font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-2 mt-4">
                      <span className="w-2 h-2 rounded-full bg-green-500 shrink-0" />
                      {weatherData.condition} &amp; Humidity {weatherData.humidity}%
                    </p>

                    <div className="grid grid-cols-2 gap-4 mt-6 border-t border-slate-200 dark:border-slate-700/50 pt-6">
                      <div className="flex items-center gap-2">
                        <span className="material-symbols-outlined text-blue-500 text-lg" style={{ fontVariationSettings: "'FILL' 1" }}>humidity_mid</span>
                        <div>
                          <p className="text-[10px] text-slate-500 dark:text-slate-400 uppercase font-bold tracking-wider">
                            <span className="lang-en">Humidity</span><span className="lang-ar">الرطوبة</span>
                          </p>
                          <p className="text-sm font-bold text-slate-900 dark:text-slate-100">{weatherData.humidity}%</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="material-symbols-outlined text-blue-500 text-lg">air</span>
                        <div>
                          <p className="text-[10px] text-slate-500 dark:text-slate-400 uppercase font-bold tracking-wider">
                            <span className="lang-en">Wind</span><span className="lang-ar">الرياح</span>
                          </p>
                          <p className="text-sm font-bold text-slate-900 dark:text-slate-100">{weatherData.windSpeed} km/h</p>
                        </div>
                      </div>
                      {todayForecast && (
                        <div className="flex items-center gap-2">
                          <span className="material-symbols-outlined text-orange-500 text-lg" style={{ fontVariationSettings: "'FILL' 1" }}>wb_sunny</span>
                          <div>
                            <p className="text-[10px] text-slate-500 dark:text-slate-400 uppercase font-bold tracking-wider">
                              <span className="lang-en">Max Wind</span><span className="lang-ar">أقصى رياح</span>
                            </p>
                            <p className="text-sm font-bold text-slate-900 dark:text-slate-100">{todayForecast.maxWind} km/h</p>
                          </div>
                        </div>
                      )}
                    </div>

                    {todayForecast && (
                      <div className="flex justify-between items-end mt-6">
                        <div>
                          <p className="text-[10px] text-slate-500 dark:text-slate-400 uppercase font-bold tracking-wider mb-1">
                            <span className="lang-en">Tonight</span><span className="lang-ar">الليلة</span>
                          </p>
                          <p className="text-2xl font-black text-slate-900 dark:text-slate-100">{todayForecast.minTemp}°C</p>
                        </div>
                        <div className="flex gap-2.5 pb-1">
                          <div className="h-16 w-3.5 bg-blue-200/50 dark:bg-blue-900/50 rounded-full flex items-end"><div className="h-10 w-full bg-blue-400/80 rounded-full" /></div>
                          <div className="h-16 w-3.5 bg-blue-200/50 dark:bg-blue-900/50 rounded-full flex items-end"><div className="h-8 w-full bg-blue-400/60 rounded-full" /></div>
                          <div className="h-16 w-3.5 bg-blue-200/50 dark:bg-blue-900/50 rounded-full flex items-end"><div className="h-12 w-full bg-blue-600 rounded-full" /></div>
                        </div>
                      </div>
                    )}
                  </>
                ) : (
                  <p className="text-sm text-slate-500 dark:text-slate-400">Weather unavailable</p>
                )}
              </div>

              <div className="mt-6 pt-6 border-t border-slate-200 dark:border-slate-700/50 relative z-10">
                <a href="/weather" className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 shadow-sm transition-colors rounded-2xl py-4 flex items-center justify-center gap-2 text-sm font-bold text-slate-900 dark:text-slate-100 group">
                  <span className="lang-en">View Full Forecast</span>
                  <span className="lang-ar">عرض التوقعات كاملة</span>
                  <span className="material-symbols-outlined text-lg group-hover:translate-x-0.5 transition-transform rtl:rotate-180">arrow_forward</span>
                </a>
              </div>
            </div>

            {/* Currency — col-span-4 */}
            <div className="lg:col-span-4 bg-white dark:bg-slate-900 rounded-4xl p-8 flex flex-col border border-slate-200 dark:border-slate-800 shadow-sm">
              <p className="text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-[0.2em] mb-8">
                <span className="lang-en">QAR Exchange Rates</span>
                <span className="lang-ar">أسعار صرف الريال</span>
              </p>
              <div className="space-y-6 flex-1">
                {topRates.length > 0 ? topRates.map((rate, i) => (
                  <div key={rate.code} className="flex items-center justify-between group">
                    <div className="flex items-center gap-4">
                      <div className={`w-12 h-12 rounded-2xl flex items-center justify-center font-bold text-xl group-hover:scale-110 transition-transform ${CURRENCY_BG[i]} ${CURRENCY_TEXT[i]}`}>
                        {CURRENCY_SYMBOLS[rate.code] ?? rate.code[0]}
                      </div>
                      <div>
                        <span className="block font-bold text-slate-900 dark:text-slate-100">{rate.code} / QAR</span>
                        <span className="text-[10px] font-bold uppercase text-slate-500 dark:text-slate-400">
                          <span className="lang-en">Market Rate</span>
                          <span className="lang-ar">سعر السوق</span>
                        </span>
                      </div>
                    </div>
                    <span className="font-mono font-black text-2xl text-slate-900 dark:text-slate-100">
                      {rate.value < 1 ? rate.value.toFixed(4) : rate.value.toFixed(2)}
                    </span>
                  </div>
                )) : (
                  <p className="text-sm text-slate-500 dark:text-slate-400">Rates unavailable</p>
                )}
              </div>
              <div className="mt-8 pt-6 border-t border-slate-200 dark:border-slate-800">
                <a href="/currency" className="w-full py-4 rounded-2xl font-bold text-sm flex items-center justify-center gap-2 group bg-blue-50 dark:bg-blue-900/20 hover:bg-blue-100 dark:hover:bg-blue-900/30 transition-all text-blue-600 dark:text-blue-400">
                  <span className="lang-en">View All Currencies</span>
                  <span className="lang-ar">عرض جميع العملات</span>
                  <span className="material-symbols-outlined group-hover:translate-x-0.5 transition-transform rtl:rotate-180" style={{ fontSize: "18px" }}>arrow_forward</span>
                </a>
              </div>
            </div>
          </section>

          {/* ── News ──────────────────────────────────────────────── */}
          <section>
            <div className="flex items-end justify-between mb-10 pb-6 border-b border-slate-200 dark:border-slate-800">
              <div>
                <span className="font-bold text-xs tracking-widest uppercase mb-1 block text-blue-600 dark:text-blue-400">
                  <span className="lang-en">Live Updates</span>
                  <span className="lang-ar">آخر التحديثات</span>
                </span>
                <h2 className="text-2xl sm:text-4xl font-black tracking-tight text-slate-900 dark:text-slate-100">
                  <span className="lang-en">Latest Updates</span>
                  <span className="lang-ar">آخر الأخبار</span>
                </h2>
              </div>
              <a href="/news" className="bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 px-5 py-2.5 rounded-xl font-bold text-sm flex items-center gap-2 hover:bg-blue-100 dark:hover:bg-blue-900/40 transition-all group">
                <span className="lang-en">View All News</span>
                <span className="lang-ar">عرض الأخبار</span>
                <span className="material-symbols-outlined text-lg group-hover:translate-x-0.5 transition-transform rtl:rotate-180">arrow_outward</span>
              </a>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {newsData.slice(0, 3).map((item, i) => (
                <a key={item.link} href={`/news/${item.slug}`} className="group cursor-pointer">
                  <div className="relative h-64 rounded-3xl overflow-hidden mb-6 shadow-md">
                    {item.imageUrl ? (
                      <Image
                        src={item.imageUrl}
                        alt={item.title}
                        fill
                        sizes="(max-width: 768px) 100vw, 33vw"
                        className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.04]"
                      />
                    ) : (
                      <div className="w-full h-full bg-gradient-to-br from-slate-100 to-slate-200 dark:from-slate-800 dark:to-slate-700" />
                    )}
                    <span className={`absolute top-4 left-4 rtl:left-auto rtl:right-4 text-[10px] font-bold px-3 py-1.5 rounded-lg uppercase tracking-wider shadow-lg text-white ${BADGE_COLORS[i % BADGE_COLORS.length]}`}>
                      {item.source}
                    </span>
                  </div>
                  <h3 className="text-xl font-bold leading-snug text-slate-900 dark:text-slate-100 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                    {item.title}
                  </h3>
                </a>
              ))}
              {newsData.length === 0 && (
                <p className="col-span-3 text-sm text-slate-500 dark:text-slate-400">No news available right now.</p>
              )}
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
              <a href="/jobs" className="inline-flex items-center gap-2 px-8 py-4 rounded-2xl font-bold text-sm bg-blue-50 dark:bg-blue-900/20 hover:bg-blue-100 dark:hover:bg-blue-900/30 transition-all text-blue-600 dark:text-blue-400">
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
                      <div className="w-10 h-10 bg-blue-50 dark:bg-blue-900/30 rounded-xl flex items-center justify-center shrink-0 text-blue-600 dark:text-blue-400">
                        <span className="material-symbols-outlined" style={{ fontSize: "20px" }}>{icon}</span>
                      </div>
                      <span className="font-bold text-lg text-slate-900 dark:text-slate-100">
                        <span className="lang-en">{en}</span>
                        <span className="lang-ar">{ar}</span>
                      </span>
                    </div>
                    <span className="material-symbols-outlined text-blue-600 dark:text-blue-400 group-open:rotate-45 transition-transform shrink-0 ml-3" style={{ fontSize: "24px" }}>add</span>
                  </summary>
                  <p className="px-6 pb-6 text-sm leading-relaxed text-slate-600 dark:text-slate-400">
                    <span className="lang-en">{a.en}</span>
                    <span className="lang-ar">{a.ar}</span>
                  </p>
                </details>
              ))}
            </div>
          </section>
        </main>
      </div>
    </>
  );
}
