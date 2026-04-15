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
  const [usingGeo, setUsingGeo] = useState(false);
  const [geoLabel, setGeoLabel] = useState("");

  const now = new Date();
  const monthName = now.toLocaleString("en-US", { month: "long" });
  const year = now.getFullYear();

  function detectLocation() {
    if (!navigator.geolocation) {
      setError(true);
      return;
    }
    setLoading(true);
    setError(false);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const lat = Math.round(pos.coords.latitude * 100) / 100;
        const lng = Math.round(pos.coords.longitude * 100) / 100;
        const now = new Date();
        Promise.all([
          fetch(`/api/prayer?lat=${lat}&lng=${lng}`).then((r) => { if (!r.ok) throw new Error(); return r.json(); }),
          fetch(`/api/prayer/monthly?lat=${lat}&lng=${lng}&year=${now.getFullYear()}&month=${now.getMonth() + 1}`).then((r) => { if (!r.ok) throw new Error(); return r.json(); }),
        ])
          .then(([t, c]) => {
            if (!t?.Fajr || !Array.isArray(c)) throw new Error("invalid");
            setTimes(t);
            setCalendar(c);
            setUsingGeo(true);
            setGeoLabel("Your Location");
          })
          .catch(() => setError(true))
          .finally(() => setLoading(false));
      },
      () => {
        setLoading(false);
        setError(true);
      },
      { timeout: 10000 }
    );
  }

  useEffect(() => {
    if (usingGeo) return;
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
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selected, usingGeo]);

  const todayStr = now.toLocaleDateString("en-GB", { day: "2-digit", month: "long", year: "numeric" });

  return (
    <div className="space-y-5">
      {/* Location selector */}
      <div className="flex flex-col gap-2 sm:flex-row sm:flex-wrap sm:items-center sm:gap-3">
        <label htmlFor="city-select" className="text-sm font-medium text-gray-700">Location:</label>
        <select
          id="city-select"
          value={selected}
          onChange={(e) => { setUsingGeo(false); setGeoLabel(""); setSelected(Number(e.target.value)); }}
          className="rounded-xl bg-surface-low border-0 px-3 py-2.5 sm:py-2 text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-primary/30"
        >
          {CITIES.map((c, i) => (
            <option key={i} value={i}>{c.label}</option>
          ))}
        </select>
        <button
          onClick={detectLocation}
          disabled={loading}
          className="flex items-center gap-1.5 px-4 py-2.5 sm:py-2 rounded-xl border border-stone-300 bg-white text-primary text-sm font-medium hover:bg-surface-low transition-colors disabled:opacity-50"
        >
          📍 Use my location
        </button>
        {loading && <span className="text-xs text-gray-400 animate-pulse">Detecting…</span>}
        {error && <span className="text-xs text-red-500">Could not detect location. Try again.</span>}
      </div>

      {/* Header */}
      <div>
        <h1 className="font-serif text-xl sm:text-2xl lg:text-3xl font-bold text-on-surface mb-1">
          Prayer Times — {usingGeo ? geoLabel : CITIES[selected].label}
        </h1>
        <p className="text-gray-500 text-sm">
          {todayStr}
          {times && (
            <span className="ml-3 text-primary font-medium">
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
            className="bg-white rounded-2xl ring-1 ring-stone-900/5 shadow-ambient p-4 flex flex-col items-center gap-2 hover:shadow-ambient-hover transition-shadow"
          >
            <span className="text-2xl">{PRAYER_ICONS[name]}</span>
            <span className="text-xs font-semibold text-gray-600 uppercase tracking-wide">{name}</span>
            <span className="text-lg font-bold text-gray-900">{times?.[name] ?? "—"}</span>
          </div>
        ))}
      </div>

      {/* Calculation method note */}
      <p className="text-xs text-gray-400">
        Calculation method: Muslim World League (MWL) · Source: Aladhan API
      </p>

      {/* Monthly Prayer Calendar — grid */}
      <section className={`transition-opacity ${loading ? "opacity-40" : "opacity-100"}`}>
        <h2 className="text-xl font-bold text-on-surface mb-4">
          {monthName} {year} — Prayer Calendar
        </h2>
        {calendar.length > 0 ? (() => {
          const DOW: Record<string, number> = {
            Monday: 0, Tuesday: 1, Wednesday: 2, Thursday: 3,
            Friday: 4, Saturday: 5, Sunday: 6,
          };
          const DAY_LABELS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
          const offset = DOW[calendar[0]?.dayOfWeek] ?? 0;
          // Build full 6-week grid (42 slots)
          const slots: (typeof calendar[0] | null)[] = [
            ...Array(offset).fill(null),
            ...calendar,
          ];
          while (slots.length % 7 !== 0) slots.push(null);

          return (
            <div>
              {/* Day-of-week header */}
              <div className="grid grid-cols-7 mb-1">
                {DAY_LABELS.map((d) => (
                  <div key={d}
                    className="text-center text-[10px] font-bold tracking-widest uppercase py-1.5"
                    style={{ color: d === "Fri" ? "#8B1A3C" : "rgba(100,80,80,0.55)" }}>
                    {d}
                  </div>
                ))}
              </div>

              {/* Weeks */}
              <div className="grid grid-cols-7 gap-1">
                {slots.map((day, i) => {
                  if (!day) return <div key={`empty-${i}`} className="rounded-xl min-h-[72px] sm:min-h-[90px]" style={{ background: "rgba(0,0,0,0.02)" }} />;
                  const isToday = day.date === times?.date;
                  const isFriday = day.dayOfWeek === "Friday";
                  const dayNum = day.date.split(" ")[0];
                  return (
                    <div key={day.date}
                      className="rounded-xl p-1.5 sm:p-2 flex flex-col min-h-[72px] sm:min-h-[90px] transition-shadow"
                      style={isToday ? {
                        background: "#8B1A3C",
                        boxShadow: "0 4px 16px rgba(139,26,60,0.35)",
                      } : isFriday ? {
                        background: "rgba(200,168,75,0.08)",
                        border: "1px solid rgba(200,168,75,0.20)",
                      } : {
                        background: "#fff",
                        border: "1px solid rgba(0,0,0,0.06)",
                      }}
                    >
                      {/* Day number */}
                      <span className="text-sm font-bold leading-none mb-1"
                        style={{ color: isToday ? "#F8ECD2" : isFriday ? "#8B1A3C" : "#1a1c1a" }}>
                        {dayNum}
                        {isToday && <span className="ml-1 text-[8px] font-bold tracking-wide uppercase" style={{ color: "rgba(248,236,210,0.6)" }}>Today</span>}
                      </span>
                      {/* Hijri */}
                      <span className="text-[8px] leading-tight mb-1.5 truncate"
                        style={{ color: isToday ? "rgba(248,236,210,0.55)" : "rgba(120,80,80,0.5)" }}>
                        {day.hijriDate}
                      </span>
                      {/* Key prayer times */}
                      <div className="flex flex-col gap-0.5 mt-auto">
                        {[
                          { label: "Fajr", time: day.Fajr },
                          { label: "Dhuhr", time: day.Dhuhr },
                          { label: "Maghrib", time: day.Maghrib },
                        ].map(({ label, time }) => (
                          <div key={label} className="flex items-center justify-between gap-1">
                            <span className="text-[7px] font-bold tracking-wide uppercase hidden sm:inline"
                              style={{ color: isToday ? "rgba(248,236,210,0.45)" : "rgba(100,80,80,0.4)" }}>
                              {label[0]}
                            </span>
                            <span className="text-[9px] font-mono tabular-nums font-semibold"
                              style={{ color: isToday ? "#F8ECD2" : "#555" }}>
                              {time}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>
              <p className="text-[10px] text-gray-400 mt-2">Showing Fajr · Dhuhr · Maghrib · Tap full prayer page for all times</p>
            </div>
          );
        })() : (
          <p className="text-gray-400">Could not load monthly calendar.</p>
        )}
      </section>
    </div>
  );
}
