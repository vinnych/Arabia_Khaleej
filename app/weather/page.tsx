import { getFullWeather } from "@/lib/weather";
import { safeJsonLd } from "@/lib/utils";
import type { Metadata } from "next";

const SITE_URL = "https://qatar-portal.vercel.app";

export const metadata: Metadata = {
  title: "Doha Weather Today — Qatar Temperature & 7-Day Forecast | Qatar Portal",
  description:
    "Live Doha weather today: current temperature, humidity, wind speed and 7-day forecast for Qatar. Updated every 30 minutes from Open-Meteo.",
  alternates: { canonical: `${SITE_URL}/weather` },
  keywords: [
    "Doha weather today",
    "Qatar weather",
    "weather in Doha",
    "Doha temperature today",
    "Qatar weather forecast",
    "Doha 7 day forecast",
    "weather Qatar",
  ],
  openGraph: {
    title: "Doha Weather Today — Qatar Temperature & 7-Day Forecast",
    description: "Live current weather and 7-day forecast for Doha, Qatar. Temperature, humidity, wind speed updated every 30 minutes.",
    url: `${SITE_URL}/weather`,
    siteName: "Qatar Portal",
    type: "website",
    images: [{ url: `${SITE_URL}/opengraph-image`, width: 1200, height: 630 }],
  },
  twitter: { card: "summary_large_image", title: "Doha Weather Today — Qatar Temperature & 7-Day Forecast", description: "Live current weather and 7-day forecast for Doha, Qatar." },
};

export default async function WeatherPage() {
  const weather = await getFullWeather();

  const today = new Date().toLocaleDateString("en-US", {
    weekday: "long", year: "numeric", month: "long", day: "numeric",
  });

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
    <div className="max-w-3xl mx-auto space-y-10">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: safeJsonLd(jsonLd) }}
      />

      {/* Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">
          Doha Weather Today
        </h1>
        <p className="text-gray-500 text-sm">{today} · Doha, Qatar · Updates every 30 min</p>
      </div>

      {!weather ? (
        <p className="text-gray-400">Weather data is currently unavailable. Please try again shortly.</p>
      ) : (
        <>
          {/* Current weather card */}
          <div className="bg-gradient-to-br from-amber-50 to-orange-50 border border-amber-100 rounded-2xl p-6">
            <p className="text-xs font-semibold text-amber-700 uppercase tracking-wide mb-4">Current Conditions</p>
            <div className="flex items-center gap-4 sm:gap-6 mb-6">
              <span className="text-5xl sm:text-7xl">{weather.current.icon}</span>
              <div>
                <div className="text-4xl sm:text-6xl font-bold text-gray-900 leading-none">
                  {weather.current.temperature}°C
                </div>
                <div className="text-base sm:text-lg text-gray-600 mt-2">{weather.current.condition}</div>
              </div>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 sm:gap-3">
              <div className="bg-white/70 border border-amber-100 rounded-xl p-2 sm:p-3 text-center">
                <p className="text-xs text-gray-500 mb-1">Feels Like</p>
                <p className="text-base sm:text-lg font-bold text-gray-900">{weather.current.feelsLike}°C</p>
              </div>
              <div className="bg-white/70 border border-amber-100 rounded-xl p-2 sm:p-3 text-center">
                <p className="text-xs text-gray-500 mb-1">Humidity</p>
                <p className="text-base sm:text-lg font-bold text-gray-900">{weather.current.humidity}%</p>
              </div>
              <div className="bg-white/70 border border-amber-100 rounded-xl p-2 sm:p-3 text-center">
                <p className="text-xs text-gray-500 mb-1">Wind</p>
                <p className="text-base sm:text-lg font-bold text-gray-900">{weather.current.windSpeed} <span className="text-xs sm:text-sm font-normal">km/h</span></p>
              </div>
            </div>
          </div>

          {/* 7-day forecast */}
          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-4">7-Day Forecast — Doha, Qatar</h2>
            <div className="rounded-2xl border border-stone-200 overflow-x-auto">
              <table className="w-full text-sm min-w-[280px]">
                <thead>
                  <tr className="bg-amber-700 text-white">
                    <th className="px-4 py-3 text-left font-semibold">Day</th>
                    <th className="px-4 py-3 text-center font-semibold">Condition</th>
                    <th className="px-4 py-3 text-center font-semibold">High</th>
                    <th className="px-4 py-3 text-center font-semibold">Low</th>
                    <th className="px-4 py-3 text-center font-semibold hidden sm:table-cell">Wind</th>
                  </tr>
                </thead>
                <tbody>
                  {weather.forecast.map((day, i) => (
                    <tr
                      key={day.date}
                      className={`border-t border-stone-100 ${i === 0 ? "bg-amber-50 font-semibold" : i % 2 === 0 ? "bg-white" : "bg-stone-50"}`}
                    >
                      <td className="px-4 py-3 text-gray-800">
                        {day.dayLabel}
                        {i === 0 && (
                          <span className="ml-2 text-xs bg-amber-200 text-amber-900 px-1.5 py-0.5 rounded-full font-bold">Today</span>
                        )}
                      </td>
                      <td className="px-4 py-3 text-center">
                        <span className="mr-1">{day.icon}</span>
                        <span className="text-gray-600 hidden md:inline">{day.condition}</span>
                      </td>
                      <td className="px-4 py-3 text-center font-semibold text-orange-700">{day.maxTemp}°</td>
                      <td className="px-4 py-3 text-center text-gray-500">{day.minTemp}°</td>
                      <td className="px-4 py-3 text-center text-gray-400 hidden sm:table-cell">{day.maxWind} km/h</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>

          {/* Qatar climate info — keyword-rich content for SEO */}
          <section className="prose prose-sm max-w-none text-gray-600">
            <h2 className="text-xl font-bold text-gray-900 mb-3">Qatar Weather Guide</h2>
            <div className="grid sm:grid-cols-2 gap-4">
              <div className="bg-stone-50 rounded-xl border border-stone-200 p-4">
                <h3 className="font-semibold text-gray-800 mb-2">Summer (May – Sep)</h3>
                <p className="text-sm text-gray-600">Extremely hot and humid. Temperatures regularly exceed 40°C. High UV index. Stay hydrated and limit outdoor activity midday.</p>
              </div>
              <div className="bg-stone-50 rounded-xl border border-stone-200 p-4">
                <h3 className="font-semibold text-gray-800 mb-2">Winter (Nov – Feb)</h3>
                <p className="text-sm text-gray-600">Mild and pleasant, 15–25°C. Occasional rain. The best season for outdoor activities, desert camping, and sightseeing.</p>
              </div>
              <div className="bg-stone-50 rounded-xl border border-stone-200 p-4">
                <h3 className="font-semibold text-gray-800 mb-2">Spring (Mar – Apr)</h3>
                <p className="text-sm text-gray-600">Warm with rising humidity, 20–35°C. Occasional dust storms (haboob) possible. Brief but lively wildflower season in northern Qatar.</p>
              </div>
              <div className="bg-stone-50 rounded-xl border border-stone-200 p-4">
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
