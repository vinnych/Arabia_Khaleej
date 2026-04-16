import { getFullWeather } from "@/lib/weather";
import { safeJsonLd } from "@/lib/utils";
import { pageMeta, SITE_URL } from "@/lib/seo";

export const metadata = pageMeta({
  title: "GCC Weather Registry | Live Observations & 7-Day Protocol | Arabia Khaleej",
  description: "Live GCC weather observations: current temperature, humidity, and 7-day atmospheric forecast for Riyadh, Dubai, Doha, and the region. Elite digital concierge weather protocol.",
  path: "/weather",
  keywords: ["GCC weather registry", "Arabia climate protocol", "Riyadh temperature today", "Dubai 7-day forecast", "Arabia Khaleej weather"],
});

export default async function WeatherPage() {
  const weather = await getFullWeather();

  const now = new Date();
  const today = `${now.getDate()} ${now.toLocaleDateString("en-GB", { month: "short" })} ${now.getFullYear()}`;

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: [
      {
        "@type": "Question",
        name: "What is the weather in the GCC today?",
        acceptedAnswer: {
          "@type": "Answer",
          text: weather
            ? `Currently ${weather.current.temperature}°C across the central Gulf. Condition: ${weather.current.condition}. Humidity: ${weather.current.humidity}%.`
            : "Live weather data for the region is currently unavailable. Please try again shortly.",
        },
      },
      {
        "@type": "Question",
        name: "What is the climate of the Arabian Peninsula?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "The GCC region features a hot desert climate. Summers are extremely hot and humid (40°C+), while winters are mild and pleasant average between 15–25°C. Coastal cities like Dubai, Doha, and Abu Dhabi experience higher humidity than inland cities like Riyadh.",
        },
      },
      {
        "@type": "Question",
        name: "What is the best time to visit the Gulf?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "The peak season is between November and March. During these months, the weather is perfect for outdoor activities, events like the Dubai Shopping Festival, and desert exploration.",
        },
      },
    ],
  };

  return (
    <div className="page-sections pt-2 sm:pt-10">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: safeJsonLd(jsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: safeJsonLd({ "@context": "https://schema.org", "@type": "BreadcrumbList", itemListElement: [{ "@type": "ListItem", position: 1, name: "Home", item: SITE_URL }, { "@type": "ListItem", position: 2, name: "Doha Weather", item: `${SITE_URL}/weather` }] }) }} />

      {/* Header */}
      <div>
        <h1 className="font-serif text-xl font-bold text-on-surface mb-1">
          Arabia Weather Registry
        </h1>
        <p className="text-xs text-gray-400 dark:text-slate-500 mb-3">{today} · Gulf Region · Updates every 30 min</p>
      </div>

      {!weather ? (
        <p className="text-gray-400 dark:text-slate-500">Weather data is currently unavailable. Please try again shortly.</p>
      ) : (
        <>
          {/* Current weather card */}
          <div className="bg-gradient-to-br from-amber-50 to-orange-50 dark:from-amber-900/20 dark:to-orange-900/20 border border-amber-100 dark:border-amber-800/30 rounded-[2rem] p-6 sm:p-8">
            <p className="label-mobile text-amber-700 dark:text-amber-400 mb-6 lowercase first-letter:uppercase">Current Conditions</p>
            <div className="flex items-center gap-4 sm:gap-6 mb-4">
              <span className="text-5xl sm:text-7xl">{weather.current.icon}</span>
              <div>
                <div className="text-4xl sm:text-6xl font-bold text-gray-900 dark:text-slate-100 leading-none">
                  {weather.current.temperature}°C
                </div>
                <div className="text-base sm:text-lg text-gray-600 dark:text-slate-400 mt-2">{weather.current.condition}</div>
              </div>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 sm:gap-3">
              <div className="bg-white/70 dark:bg-slate-800/70 border border-amber-100 dark:border-amber-800/30 rounded-md p-2 text-center">
                <p className="text-xs text-gray-500 dark:text-slate-400 mb-1">Feels Like</p>
                <p className="text-base sm:text-lg font-bold text-gray-900 dark:text-slate-100">{weather.current.feelsLike}°C</p>
              </div>
              <div className="bg-white/70 dark:bg-slate-800/70 border border-amber-100 dark:border-amber-800/30 rounded-md p-2 text-center">
                <p className="text-xs text-gray-500 dark:text-slate-400 mb-1">Humidity</p>
                <p className="text-base sm:text-lg font-bold text-gray-900 dark:text-slate-100">{weather.current.humidity}%</p>
              </div>
              <div className="bg-white/70 dark:bg-slate-800/70 border border-amber-100 dark:border-amber-800/30 rounded-md p-2 text-center">
                <p className="text-xs text-gray-500 dark:text-slate-400 mb-1">Wind</p>
                <p className="text-base sm:text-lg font-bold text-gray-900 dark:text-slate-100">{weather.current.windSpeed} <span className="text-xs sm:text-sm font-normal">km/h</span></p>
              </div>
            </div>
          </div>

          {/* 7-day forecast — calendar cards */}
          <section>
            <h2 className="label-mobile text-gray-500 dark:text-slate-400 mb-4 lowercase first-letter:uppercase">7-Day Regional Forecast</h2>
            <div className="grid grid-cols-7 gap-1.5 sm:gap-2">
              {weather.forecast.map((day, i) => {
                const isToday = i === 0;
                const label = isToday ? "Today" : day.dayLabel.split(",")[0];
                const dateNum = day.dayLabel.split(" ").at(-1) ?? "";
                const mon = day.dayLabel.split(" ").slice(-2, -1)[0] ?? "";
                return (
                  <div
                    key={day.date}
                    className={`flex flex-col items-center rounded-2xl py-3 px-1 sm:px-2 transition-shadow ${
                      isToday
                        ? "bg-gradient-to-b from-rose-800 to-rose-950 shadow-lg shadow-rose-900/30"
                        : "bg-white dark:bg-slate-800 border border-stone-200/50 dark:border-slate-700"
                    }`}
                  >
                    <span className={`text-[10px] font-bold tracking-wide uppercase mb-0.5 ${isToday ? "text-amber-200/70" : "text-gray-400 dark:text-slate-500"}`}>
                      {label}
                    </span>
                    {!isToday && (
                      <span className="text-xs font-semibold mb-1 text-gray-500 dark:text-slate-400">
                        {mon} {dateNum}
                      </span>
                    )}
                    <span className="text-2xl sm:text-3xl my-1 leading-none">{day.icon}</span>
                    <span className={`text-base sm:text-lg font-bold leading-none ${isToday ? "text-amber-100" : "text-amber-700 dark:text-amber-400"}`}>
                      {day.maxTemp}°
                    </span>
                    <span className={`text-xs mt-0.5 ${isToday ? "text-amber-200/50" : "text-gray-400 dark:text-slate-500"}`}>
                      {day.minTemp}°
                    </span>
                    <span className={`text-[9px] mt-1.5 hidden sm:block ${isToday ? "text-amber-200/40" : "text-gray-300 dark:text-slate-600"}`}>
                      {day.maxWind} km/h
                    </span>
                  </div>
                );
              })}
            </div>
          </section>

          {/* Qatar climate info */}
          <section>
            <h2 className="label-mobile text-gray-500 dark:text-slate-400 mb-4 lowercase first-letter:uppercase">GCC Regional Climate Guide</h2>
            <div className="grid sm:grid-cols-2 gap-3">
              <div className="bg-stone-50 dark:bg-slate-800 rounded-lg border border-stone-200 dark:border-slate-700 p-3">
                <h3 className="font-semibold text-gray-800 dark:text-slate-200 mb-2">Summer (May – Sep)</h3>
                <p className="text-sm text-gray-600 dark:text-slate-400">Extreme heat across the region. Coastal cities (Dubai, Doha, Manama) experience intense humidity, while inland (Riyadh) is dry heat. 40°C–50°C is common.</p>
              </div>
              <div className="bg-stone-50 dark:bg-slate-800 rounded-lg border border-stone-200 dark:border-slate-700 p-3">
                <h3 className="font-semibold text-gray-800 dark:text-slate-200 mb-2">Winter (Nov – Feb)</h3>
                <p className="text-sm text-gray-600 dark:text-slate-400">Peak season for the GCC. Mild and pleasant, 15–25°C. Northern regions (KSA, Kuwait) can see cold nights below 10°C.</p>
              </div>
              <div className="bg-stone-50 dark:bg-slate-800 rounded-lg border border-stone-200 dark:border-slate-700 p-3">
                <h3 className="font-semibold text-gray-800 dark:text-slate-200 mb-2">Spring/Autumn</h3>
                <p className="text-sm text-gray-600 dark:text-slate-400">Transitional periods with warm temperatures (25–35°C). Ideal for outdoor sports and beach activities before the summer peak.</p>
              </div>
              <div className="bg-stone-50 dark:bg-slate-800 rounded-lg border border-stone-200 dark:border-slate-700 p-3">
                <h3 className="font-semibold text-gray-800 dark:text-slate-200 mb-2">Regional Variations</h3>
                <p className="text-sm text-gray-600 dark:text-slate-400">Oman (Salalah) experiences the Khareef (monsoon) from June to Sept, offering a rare green escape while the rest of the GCC is in peak summer.</p>
              </div>
            </div>
          </section>
        </>
      )}

      <div className="bento-tile bg-[#020617] !text-white border-none p-8 sm:p-12 flex flex-col md:flex-row items-center gap-8 mt-12">
        <div className="flex-1">
          <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-white/40 mb-3">Protocol: Official Verification</h3>
          <p className="text-sm font-medium text-stone-300 leading-relaxed">
            This dashboard uses aggregated Open-Meteo data for guidance. For safety-critical decisions, always cross-verify at the respective national meteorology departments (QMD, NCM, etc.).
          </p>
        </div>
      </div>

      <p className="text-[10px] text-gray-400 dark:text-slate-500 font-bold uppercase tracking-widest text-center mt-6">
        Data Hub: Open-Meteo · Independent Aggregation · Protocol v1.2
      </p>
    </div>
  );
}
