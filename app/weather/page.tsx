import { getFullWeather } from "@/lib/weather";
import { safeJsonLd } from "@/lib/utils";
import { pageMeta, SITE_URL } from "@/lib/seo";

export const metadata = pageMeta({
  title: "Doha Weather Today — 7-Day Forecast | Qatar Portal",
  description: "Live Doha weather today: current temperature, humidity, wind speed and 7-day forecast for Qatar. Updated every 30 minutes from Open-Meteo.",
  path: "/weather",
  keywords: ["Doha weather today", "Qatar weather", "weather in Doha", "Doha temperature today", "Qatar weather forecast", "Doha 7 day forecast", "weather Qatar"],
  ogTitle: "Doha Weather Today — Qatar Temperature & 7-Day Forecast",
  ogDescription: "Live current weather and 7-day forecast for Doha, Qatar. Temperature, humidity, wind speed updated every 30 minutes.",
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
        name: "What is the weather in Doha today?",
        acceptedAnswer: {
          "@type": "Answer",
          text: weather
            ? `Currently ${weather.current.temperature}°C in Doha, Qatar. Condition: ${weather.current.condition}. Feels like ${weather.current.feelsLike}°C. Humidity: ${weather.current.humidity}%. Wind: ${weather.current.windSpeed} km/h.`
            : "Live weather data is currently unavailable. Please try again shortly.",
        },
      },
      {
        "@type": "Question",
        name: "What is Qatar's climate like?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Qatar has a hot desert climate. Summers (May–September) are extremely hot and humid with temperatures regularly exceeding 40°C. Winters (November–February) are mild and pleasant, averaging 15–25°C. Rainfall is scarce, averaging less than 80mm annually.",
        },
      },
      {
        "@type": "Question",
        name: "What is the best time to visit Qatar?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "The best time to visit Qatar is between October and April, when temperatures are mild (15–30°C) and humidity is low. December to February is the coolest and most comfortable period for outdoor activities.",
        },
      },
    ],
  };

  return (
    <div className="page-sections">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: safeJsonLd(jsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: safeJsonLd({ "@context": "https://schema.org", "@type": "BreadcrumbList", itemListElement: [{ "@type": "ListItem", position: 1, name: "Home", item: "https://qatar-portal.vercel.app" }, { "@type": "ListItem", position: 2, name: "Doha Weather", item: "https://qatar-portal.vercel.app/weather" }] }) }} />

      {/* Header */}
      <div>
        <h1 className="font-newsreader text-xl font-bold text-on-surface mb-1">
          Doha Weather Today
        </h1>
        <p className="text-xs text-gray-400 mb-3">{today} · Doha, Qatar · Updates every 30 min</p>
      </div>

      {!weather ? (
        <p className="text-gray-400">Weather data is currently unavailable. Please try again shortly.</p>
      ) : (
        <>
          {/* Current weather card */}
          <div className="bg-gradient-to-br from-amber-50 to-orange-50 border border-amber-100 rounded-lg p-4">
            <p className="text-xs font-semibold text-amber-700 uppercase tracking-wide mb-4">Current Conditions</p>
            <div className="flex items-center gap-4 sm:gap-6 mb-4">
              <span className="text-5xl sm:text-7xl">{weather.current.icon}</span>
              <div>
                <div className="text-4xl sm:text-6xl font-bold text-gray-900 leading-none">
                  {weather.current.temperature}°C
                </div>
                <div className="text-base sm:text-lg text-gray-600 mt-2">{weather.current.condition}</div>
              </div>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 sm:gap-3">
              <div className="bg-white/70 border border-amber-100 rounded-md p-2 text-center">
                <p className="text-xs text-gray-500 mb-1">Feels Like</p>
                <p className="text-base sm:text-lg font-bold text-gray-900">{weather.current.feelsLike}°C</p>
              </div>
              <div className="bg-white/70 border border-amber-100 rounded-md p-2 text-center">
                <p className="text-xs text-gray-500 mb-1">Humidity</p>
                <p className="text-base sm:text-lg font-bold text-gray-900">{weather.current.humidity}%</p>
              </div>
              <div className="bg-white/70 border border-amber-100 rounded-md p-2 text-center">
                <p className="text-xs text-gray-500 mb-1">Wind</p>
                <p className="text-base sm:text-lg font-bold text-gray-900">{weather.current.windSpeed} <span className="text-xs sm:text-sm font-normal">km/h</span></p>
              </div>
            </div>
          </div>

          {/* 7-day forecast — calendar cards */}
          <section>
            <h2 className="text-sm font-semibold text-gray-700 mb-3">7-Day Forecast — Doha, Qatar</h2>
            <div className="grid grid-cols-7 gap-1.5 sm:gap-2">
              {weather.forecast.map((day, i) => {
                const isToday = i === 0;
                // Split "Mon, Mar 21" → short label
                const label = isToday ? "Today" : day.dayLabel.split(",")[0];
                const dateNum = day.dayLabel.split(" ").at(-1) ?? "";
                const mon = day.dayLabel.split(" ").slice(-2, -1)[0] ?? "";
                return (
                  <div
                    key={day.date}
                    className="flex flex-col items-center rounded-2xl py-3 px-1 sm:px-2 transition-shadow"
                    style={isToday ? {
                      background: "linear-gradient(135deg, #8B1A3C 0%, #5A0E26 100%)",
                      boxShadow: "0 4px 20px rgba(139,26,60,0.30)",
                    } : {
                      background: "#fff",
                      border: "1px solid rgba(0,0,0,0.07)",
                    }}
                  >
                    {/* Day label */}
                    <span className="text-[10px] font-bold tracking-wide uppercase mb-0.5"
                      style={{ color: isToday ? "rgba(248,236,210,0.7)" : "rgba(100,80,80,0.55)" }}>
                      {label}
                    </span>
                    {/* Date number */}
                    {!isToday && (
                      <span className="text-xs font-semibold mb-1" style={{ color: "#555" }}>
                        {mon} {dateNum}
                      </span>
                    )}
                    {/* Icon */}
                    <span className="text-2xl sm:text-3xl my-1 leading-none">{day.icon}</span>
                    {/* High */}
                    <span className="text-base sm:text-lg font-bold leading-none"
                      style={{ color: isToday ? "#F8ECD2" : "#b45309" }}>
                      {day.maxTemp}°
                    </span>
                    {/* Low */}
                    <span className="text-xs mt-0.5" style={{ color: isToday ? "rgba(248,236,210,0.5)" : "#9ca3af" }}>
                      {day.minTemp}°
                    </span>
                    {/* Wind */}
                    <span className="text-[9px] mt-1.5 hidden sm:block"
                      style={{ color: isToday ? "rgba(248,236,210,0.4)" : "#c4b5b5" }}>
                      {day.maxWind} km/h
                    </span>
                  </div>
                );
              })}
            </div>
          </section>

          {/* Qatar climate info — keyword-rich content for SEO */}
          <section className="prose prose-sm max-w-none text-gray-600">
            <h2 className="text-sm font-semibold text-gray-700 mb-2">Qatar Weather Guide</h2>
            <div className="grid sm:grid-cols-2 gap-3">
              <div className="bg-stone-50 rounded-lg border border-stone-200 p-3">
                <h3 className="font-semibold text-gray-800 mb-2">Summer (May – Sep)</h3>
                <p className="text-sm text-gray-600">Extremely hot and humid. Temperatures regularly exceed 40°C. High UV index. Stay hydrated and limit outdoor activity midday.</p>
              </div>
              <div className="bg-stone-50 rounded-lg border border-stone-200 p-3">
                <h3 className="font-semibold text-gray-800 mb-2">Winter (Nov – Feb)</h3>
                <p className="text-sm text-gray-600">Mild and pleasant, 15–25°C. Occasional rain. The best season for outdoor activities, desert camping, and sightseeing.</p>
              </div>
              <div className="bg-stone-50 rounded-lg border border-stone-200 p-3">
                <h3 className="font-semibold text-gray-800 mb-2">Spring (Mar – Apr)</h3>
                <p className="text-sm text-gray-600">Warm with rising humidity, 20–35°C. Occasional dust storms (haboob) possible. Brief but lively wildflower season in northern Qatar.</p>
              </div>
              <div className="bg-stone-50 rounded-lg border border-stone-200 p-3">
                <h3 className="font-semibold text-gray-800 mb-2">Autumn (Oct)</h3>
                <p className="text-sm text-gray-600">Transitional month. Temperatures drop from 40°C+ to a comfortable 25–30°C. Sea temperatures still warm — ideal for water sports.</p>
              </div>
            </div>
          </section>
        </>
      )}

      <p className="text-xs text-gray-400">Weather data source: Open-Meteo (open-meteo.com) · Updated every 30 minutes</p>
    </div>
  );
}
