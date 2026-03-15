"use client";

import { useState, useEffect } from "react";
import type { PrayerTimes, PrayerDay } from "@/lib/prayer";

const CITIES: { label: string; city: string; country: string }[] = [
  { label: "Doha, Qatar", city: "Doha", country: "Qatar" },
  { label: "Mecca, Saudi Arabia", city: "Mecca", country: "Saudi Arabia" },
  { label: "Medina, Saudi Arabia", city: "Medina", country: "Saudi Arabia" },
  { label: "Riyadh, Saudi Arabia", city: "Riyadh", country: "Saudi Arabia" },
  { label: "Jeddah, Saudi Arabia", city: "Jeddah", country: "Saudi Arabia" },
  { label: "Dubai, UAE", city: "Dubai", country: "United Arab Emirates" },
  { label: "Abu Dhabi, UAE", city: "Abu Dhabi", country: "United Arab Emirates" },
  { label: "Kuwait City, Kuwait", city: "Kuwait City", country: "Kuwait" },
  { label: "Manama, Bahrain", city: "Manama", country: "Bahrain" },
  { label: "Muscat, Oman", city: "Muscat", country: "Oman" },
  { label: "Amman, Jordan", city: "Amman", country: "Jordan" },
  { label: "Beirut, Lebanon", city: "Beirut", country: "Lebanon" },
  { label: "Baghdad, Iraq", city: "Baghdad", country: "Iraq" },
  { label: "Tehran, Iran", city: "Tehran", country: "Iran" },
  { label: "Istanbul, Turkey", city: "Istanbul", country: "Turkey" },
  { label: "Ankara, Turkey", city: "Ankara", country: "Turkey" },
  { label: "Cairo, Egypt", city: "Cairo", country: "Egypt" },
  { label: "Casablanca, Morocco", city: "Casablanca", country: "Morocco" },
  { label: "Algiers, Algeria", city: "Algiers", country: "Algeria" },
  { label: "Tunis, Tunisia", city: "Tunis", country: "Tunisia" },
  { label: "Tripoli, Libya", city: "Tripoli", country: "Libya" },
  { label: "Khartoum, Sudan", city: "Khartoum", country: "Sudan" },
  { label: "Mogadishu, Somalia", city: "Mogadishu", country: "Somalia" },
  { label: "Karachi, Pakistan", city: "Karachi", country: "Pakistan" },
  { label: "Lahore, Pakistan", city: "Lahore", country: "Pakistan" },
  { label: "Islamabad, Pakistan", city: "Islamabad", country: "Pakistan" },
  { label: "Dhaka, Bangladesh", city: "Dhaka", country: "Bangladesh" },
  { label: "Jakarta, Indonesia", city: "Jakarta", country: "Indonesia" },
  { label: "Kuala Lumpur, Malaysia", city: "Kuala Lumpur", country: "Malaysia" },
  { label: "Kabul, Afghanistan", city: "Kabul", country: "Afghanistan" },
  { label: "Tashkent, Uzbekistan", city: "Tashkent", country: "Uzbekistan" },
  { label: "Lagos, Nigeria", city: "Lagos", country: "Nigeria" },
  { label: "Kano, Nigeria", city: "Kano", country: "Nigeria" },
  { label: "Dakar, Senegal", city: "Dakar", country: "Senegal" },
  { label: "London, UK", city: "London", country: "United Kingdom" },
  { label: "Paris, France", city: "Paris", country: "France" },
  { label: "New York, USA", city: "New York", country: "United States" },
  { label: "Toronto, Canada", city: "Toronto", country: "Canada" },
];

const PRAYERS = ["Fajr", "Sunrise", "Dhuhr", "Asr", "Maghrib", "Isha"] as const;
const PRAYER_ICONS: Record<string, string> = {
  Fajr: "🌙", Sunrise: "🌅", Dhuhr: "☀️", Asr: "🌤️", Maghrib: "🌇", Isha: "🌃",
};

export default function PrayerSelector({
  defaultTimes,
  defaultCalendar,
}: {
  defaultTimes: PrayerTimes;
  defaultCalendar: PrayerDay[];
}) {
  const [selected, setSelected] = useState(0); // index into CITIES
  const [times, setTimes] = useState<PrayerTimes>(defaultTimes);
  const [calendar, setCalendar] = useState<PrayerDay[]>(defaultCalendar);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);

  const now = new Date();
  const monthName = now.toLocaleString("en-US", { month: "long" });
  const year = now.getFullYear();

  useEffect(() => {
    if (selected === 0) {
      setTimes(defaultTimes);
      setCalendar(defaultCalendar);
      return;
    }
    const { city, country } = CITIES[selected];
    setLoading(true);
    setError(false);
    Promise.all([
      fetch(`/api/prayer?city=${encodeURIComponent(city)}&country=${encodeURIComponent(country)}`).then((r) => { if (!r.ok) throw new Error("prayer"); return r.json(); }),
      fetch(`/api/prayer/monthly?city=${encodeURIComponent(city)}&country=${encodeURIComponent(country)}`).then((r) => { if (!r.ok) throw new Error("monthly"); return r.json(); }),
    ])
      .then(([t, c]) => {
        if (!t?.Fajr || !Array.isArray(c)) throw new Error("invalid");
        setTimes(t);
        setCalendar(c);
      })
      .catch(() => setError(true))
      .finally(() => setLoading(false));
  }, [selected, defaultTimes, defaultCalendar]);

  const todayStr = now.toLocaleDateString("en-GB", { day: "2-digit", month: "long", year: "numeric" });

  return (
    <div className="space-y-8">
      {/* Location selector */}
      <div className="flex flex-wrap items-center gap-3">
        <label className="text-sm font-medium text-violet-800">Location:</label>
        <select
          value={selected}
          onChange={(e) => setSelected(Number(e.target.value))}
          className="rounded-xl border border-violet-200 bg-white px-3 py-2 text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-violet-300 shadow-sm"
        >
          {CITIES.map((c, i) => (
            <option key={i} value={i}>{c.label}</option>
          ))}
        </select>
        {loading && <span className="text-xs text-violet-500 animate-pulse">Loading…</span>}
        {error && <span className="text-xs text-red-500">Failed to load. Try again.</span>}
      </div>

      {/* Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold text-violet-900 mb-1">
          Prayer Times — {CITIES[selected].label}
        </h1>
        <p className="text-gray-500 text-sm">
          {todayStr}
          {times && (
            <span className="ml-3 text-violet-600 font-medium">
              {times.hijriDate} {times.hijriMonth} {times.hijriYear} AH
            </span>
          )}
        </p>
      </div>

      {/* Today's prayer cards */}
      <div className={`grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 transition-opacity ${loading ? "opacity-40" : "opacity-100"}`}>
        {PRAYERS.map((name) => (
          <div
            key={name}
            className="bg-violet-50 rounded-2xl border border-violet-100 shadow-sm p-4 flex flex-col items-center gap-2 hover:border-violet-300 transition-colors"
          >
            <span className="text-2xl">{PRAYER_ICONS[name]}</span>
            <span className="text-xs font-semibold text-violet-800 uppercase tracking-wide">{name}</span>
            <span className="text-lg font-bold text-gray-900">{times?.[name] ?? "—"}</span>
          </div>
        ))}
      </div>

      {/* Calculation method note */}
      <p className="text-xs text-gray-400">
        Calculation method: Muslim World League (MWL) · Source: Aladhan API
      </p>

      {/* Monthly Calendar */}
      <section>
        <h2 className="text-xl font-bold text-violet-900 mb-4">
          {monthName} {year} — Full Prayer Calendar
        </h2>
        {calendar.length > 0 ? (
          <div className={`overflow-x-auto rounded-2xl border border-stone-200 shadow-sm transition-opacity ${loading ? "opacity-40" : "opacity-100"}`}>
            <table className="w-full text-sm min-w-[320px]">
              <thead>
                <tr className="bg-violet-900 text-white">
                  <th className="px-3 py-3 text-left font-semibold">Date</th>
                  <th className="px-3 py-3 text-left font-semibold hidden sm:table-cell">Hijri</th>
                  <th className="px-3 py-3 text-center font-semibold">Fajr</th>
                  <th className="px-3 py-3 text-center font-semibold hidden md:table-cell">Sunrise</th>
                  <th className="px-3 py-3 text-center font-semibold">Dhuhr</th>
                  <th className="px-3 py-3 text-center font-semibold">Asr</th>
                  <th className="px-3 py-3 text-center font-semibold">Maghrib</th>
                  <th className="px-3 py-3 text-center font-semibold">Isha</th>
                </tr>
              </thead>
              <tbody>
                {calendar.slice(Math.max(0, calendar.findIndex((d) => d.date === times?.date))).map((day, i) => {
                  const isToday = day.date === times?.date;
                  return (
                    <tr
                      key={day.date}
                      className={`border-t border-stone-100 ${
                        isToday ? "bg-violet-50 font-semibold" : i % 2 === 0 ? "bg-white" : "bg-stone-50"
                      }`}
                    >
                      <td className="px-3 py-2.5 whitespace-nowrap">
                        <span className={isToday ? "text-violet-800" : "text-gray-700"}>
                          {day.date.split(" ")[0]} {day.date.split(" ")[1]}
                        </span>
                        <span className="block text-xs text-gray-400">{day.dayOfWeek}</span>
                        {isToday && (
                          <span className="text-xs bg-violet-200 text-violet-900 px-1.5 py-0.5 rounded-full font-bold">Today</span>
                        )}
                      </td>
                      <td className="px-3 py-2.5 text-xs text-gray-400 hidden sm:table-cell">{day.hijriDate}</td>
                      <td className="px-3 py-2.5 text-center text-gray-700">{day.Fajr}</td>
                      <td className="px-3 py-2.5 text-center text-gray-400 hidden md:table-cell">{day.Sunrise}</td>
                      <td className="px-3 py-2.5 text-center text-gray-700">{day.Dhuhr}</td>
                      <td className="px-3 py-2.5 text-center text-gray-700">{day.Asr}</td>
                      <td className="px-3 py-2.5 text-center text-gray-700">{day.Maghrib}</td>
                      <td className="px-3 py-2.5 text-center text-gray-700">{day.Isha}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        ) : (
          <p className="text-gray-400">Could not load monthly calendar.</p>
        )}
      </section>
    </div>
  );
}
