"use client";

import { useState, useEffect, useCallback } from "react";
import type { PrayerTimes, PrayerDay } from "@/lib/prayer";

/* ── City list ──────────────────────────────────────────────── */
const CITIES: { label: string; city: string; country: string }[] = [
  { label: "Doha", city: "Doha", country: "Qatar" },
  { label: "Al Wakrah", city: "Al Wakrah", country: "Qatar" },
  { label: "Al Khor", city: "Al Khor", country: "Qatar" },
  { label: "Madinat ash Shamal", city: "Madinat ash Shamal", country: "Qatar" },
  { label: "Mecca", city: "Mecca", country: "Saudi Arabia" },
  { label: "Medina", city: "Medina", country: "Saudi Arabia" },
  { label: "Riyadh", city: "Riyadh", country: "Saudi Arabia" },
  { label: "Dubai", city: "Dubai", country: "United Arab Emirates" },
  { label: "Abu Dhabi", city: "Abu Dhabi", country: "United Arab Emirates" },
  { label: "Kuwait City", city: "Kuwait City", country: "Kuwait" },
  { label: "Manama", city: "Manama", country: "Bahrain" },
  { label: "Muscat", city: "Muscat", country: "Oman" },
  { label: "Cairo", city: "Cairo", country: "Egypt" },
  { label: "Istanbul", city: "Istanbul", country: "Turkey" },
  { label: "Karachi", city: "Karachi", country: "Pakistan" },
  { label: "Islamabad", city: "Islamabad", country: "Pakistan" },
  { label: "Dhaka", city: "Dhaka", country: "Bangladesh" },
  { label: "Jakarta", city: "Jakarta", country: "Indonesia" },
  { label: "Kuala Lumpur", city: "Kuala Lumpur", country: "Malaysia" },
  { label: "London", city: "London", country: "United Kingdom" },
  { label: "New York", city: "New York", country: "United States" },
  { label: "Toronto", city: "Toronto", country: "Canada" },
];

/* ── Prayer helpers ─────────────────────────────────────────── */
const PRAYERS = ["Fajr", "Sunrise", "Dhuhr", "Asr", "Maghrib", "Isha"] as const;
const PRAYER_ICONS: Record<string, string> = {
  Fajr: "nights_stay", Sunrise: "wb_twilight", Dhuhr: "wb_sunny",
  Asr: "light_mode", Maghrib: "wb_shade", Isha: "bedtime",
};

const MONTH_NAMES = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];

function toMin(t: string) {
  const clean = t.replace(/\s*\([^)]*\)/, "").trim();
  const [h, m] = clean.split(":").map(Number);
  return h * 60 + (m || 0);
}

function formatTime12(t: string) {
  const clean = t.replace(/\s*\([^)]*\)/, "").trim();
  const [h, m] = clean.split(":").map(Number);
  const ampm = h >= 12 ? "PM" : "AM";
  const h12 = h === 0 ? 12 : h > 12 ? h - 12 : h;
  return `${String(h12).padStart(2, "0")}:${String(m).padStart(2, "0")} ${ampm}`;
}

/* ── Islamic holidays ───────────────────────────────────────── */
const ISLAMIC_HOLIDAYS: Record<string, string> = {
  "2026-03-20": "Eid Al-Fitr",
  "2026-03-21": "Eid Al-Fitr",
  "2026-03-22": "Eid Al-Fitr",
  "2026-05-27": "Eid Al-Adha",
  "2026-05-28": "Eid Al-Adha",
  "2026-05-29": "Eid Al-Adha",
  "2026-06-16": "Islamic New Year",
  "2026-08-25": "Prophet's Birthday",
  "2026-12-18": "Qatar National Day",
};

/* ── Component ──────────────────────────────────────────────── */
export default function PrayerPageClient({
  defaultTimes,
  defaultCalendar,
}: {
  defaultTimes: PrayerTimes;
  defaultCalendar: PrayerDay[];
}) {
  const [selected, setSelected] = useState(0);
  const [times, setTimes] = useState<PrayerTimes>(defaultTimes);
  const [calendar, setCalendar] = useState<PrayerDay[]>(defaultCalendar);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const [usingGeo, setUsingGeo] = useState(false);
  const [calMonth, setCalMonth] = useState(() => {
    const n = new Date();
    return { year: n.getFullYear(), month: n.getMonth() + 1 };
  });

  const now = new Date();
  const qatarTime = new Date(now.toLocaleString("en-US", { timeZone: "Asia/Qatar" }));
  const nowMin = qatarTime.getHours() * 60 + qatarTime.getMinutes();

  /* ── Determine next prayer ────────────────────────────────── */
  const nextPrayer = (() => {
    for (const name of PRAYERS) {
      const t = times?.[name];
      if (t && toMin(t) > nowMin) return name;
    }
    return PRAYERS[0]; // wrap to Fajr
  })();

  const nextMin = times?.[nextPrayer] ? toMin(times[nextPrayer]) : 0;
  let diff = nextMin - nowMin;
  if (diff < 0) diff += 24 * 60;
  const diffH = Math.floor(diff / 60);
  const diffM = diff % 60;
  const countdown = diffH > 0 ? `In ${diffH}h ${diffM}m` : `In ${diffM}m`;

  /* ── Formatted dates ──────────────────────────────────────── */
  const dateEn = now.toLocaleDateString("en-US", {
    timeZone: "Asia/Qatar",
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });
  const hijriStr = times
    ? `${times.hijriDate} ${times.hijriMonth} ${times.hijriYear} AH`
    : "";

  /* ── Fetch helpers ────────────────────────────────────────── */
  const fetchCity = useCallback(
    (cityIdx: number, yr: number, mo: number) => {
      if (cityIdx === 0 && yr === now.getFullYear() && mo === now.getMonth() + 1) {
        setTimes(defaultTimes);
        setCalendar(defaultCalendar);
        return;
      }
      const { city, country } = CITIES[cityIdx];
      setLoading(true);
      setError(false);
      Promise.all([
        fetch(`/api/prayer?city=${encodeURIComponent(city)}&country=${encodeURIComponent(country)}`).then(r => { if (!r.ok) throw new Error(); return r.json(); }),
        fetch(`/api/prayer/monthly?city=${encodeURIComponent(city)}&country=${encodeURIComponent(country)}&year=${yr}&month=${mo}`).then(r => { if (!r.ok) throw new Error(); return r.json(); }),
      ])
        .then(([t, c]) => {
          if (!t?.Fajr || !Array.isArray(c)) throw new Error();
          setTimes(t);
          setCalendar(c);
        })
        .catch(() => setError(true))
        .finally(() => setLoading(false));
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [defaultTimes, defaultCalendar]
  );

  useEffect(() => {
    if (usingGeo) return;
    fetchCity(selected, calMonth.year, calMonth.month);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selected, usingGeo, calMonth]);

  function detectLocation() {
    if (!navigator.geolocation) { setError(true); return; }
    setLoading(true);
    setError(false);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const lat = Math.round(pos.coords.latitude * 100) / 100;
        const lng = Math.round(pos.coords.longitude * 100) / 100;
        const n = new Date();
        Promise.all([
          fetch(`/api/prayer?lat=${lat}&lng=${lng}`).then(r => { if (!r.ok) throw new Error(); return r.json(); }),
          fetch(`/api/prayer/monthly?lat=${lat}&lng=${lng}&year=${n.getFullYear()}&month=${n.getMonth() + 1}`).then(r => { if (!r.ok) throw new Error(); return r.json(); }),
        ])
          .then(([t, c]) => {
            if (!t?.Fajr || !Array.isArray(c)) throw new Error();
            setTimes(t);
            setCalendar(c);
            setUsingGeo(true);
          })
          .catch(() => setError(true))
          .finally(() => setLoading(false));
      },
      () => { setLoading(false); setError(true); },
      { timeout: 10000 }
    );
  }

  function prevMonth() {
    setCalMonth(p => p.month === 1 ? { year: p.year - 1, month: 12 } : { year: p.year, month: p.month - 1 });
  }
  function nextMonth() {
    setCalMonth(p => p.month === 12 ? { year: p.year + 1, month: 1 } : { year: p.year, month: p.month + 1 });
  }

  /* ── Build table rows ─────────────────────────────────────── */
  const todayReadable = times?.date ?? "";

  return (
    <div className={`transition-opacity duration-300 ${loading ? "opacity-50" : "opacity-100"}`}>

      {/* ── Hero Header ─────────────────────────────────────── */}
      <header className="mb-12 flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <h1 className="text-3xl sm:text-4xl font-black tracking-tighter text-blue-700 dark:text-blue-400 mb-2">
            Prayer Times – {usingGeo ? "Your Location" : `${CITIES[selected].label}, ${CITIES[selected].country}`}
          </h1>
          <div className="flex flex-wrap items-center gap-4 text-slate-600 dark:text-slate-400 bg-blue-50 dark:bg-blue-900/20 px-4 py-2 rounded-lg">
            <div className="flex items-center gap-1">
              <span className="material-symbols-outlined text-lg">calendar_today</span>
              <span className="font-medium text-sm">{dateEn}</span>
            </div>
            {hijriStr && (
              <>
                <div className="w-1 h-1 rounded-full bg-slate-300 dark:bg-slate-600" />
                <div className="flex items-center gap-1">
                  <span className="material-symbols-outlined text-lg">event_note</span>
                  <span className="font-medium text-sm">{hijriStr}</span>
                </div>
              </>
            )}
          </div>
        </div>
        <div className="flex flex-wrap gap-3">
          <button
            onClick={detectLocation}
            disabled={loading}
            className="flex items-center gap-2 px-4 py-2.5 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 rounded-lg font-semibold hover:bg-blue-200 dark:hover:bg-blue-900/50 transition-colors disabled:opacity-50"
          >
            <span className="material-symbols-outlined text-xl">my_location</span>
            <span>Use my location</span>
          </button>
          <div className="relative">
            <select
              value={selected}
              onChange={e => { setUsingGeo(false); setSelected(Number(e.target.value)); }}
              className="appearance-none pl-4 pr-10 py-2.5 bg-blue-50 dark:bg-slate-800 border-none rounded-lg font-semibold text-blue-700 dark:text-blue-400 focus:ring-2 focus:ring-blue-500/40 cursor-pointer"
            >
              {CITIES.map((c, i) => (
                <option key={i} value={i}>{c.label}</option>
              ))}
            </select>
            <span className="material-symbols-outlined absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-blue-700 dark:text-blue-400">expand_more</span>
          </div>
        </div>
      </header>

      {error && (
        <div className="mb-6 bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400 px-4 py-3 rounded-lg text-sm font-medium">
          Could not load prayer times. Please try again.
        </div>
      )}

      {/* ── Prayer Grid ─────────────────────────────────────── */}
      <section className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4 mb-16">
        {PRAYERS.map((name) => {
          const isNext = name === nextPrayer;
          return (
            <div
              key={name}
              className={
                isNext
                  ? "relative bg-gradient-to-br from-blue-700 to-blue-500 dark:from-blue-600 dark:to-blue-800 p-6 rounded-xl flex flex-col items-center justify-center text-center shadow-lg ring-4 ring-blue-500/20 dark:ring-blue-400/20 overflow-hidden"
                  : "bg-white dark:bg-slate-800 p-6 rounded-xl flex flex-col items-center justify-center text-center transition-transform hover:scale-[1.02] shadow-sm"
              }
            >
              {isNext && (
                <div className="absolute top-2 right-2 px-2 py-0.5 bg-rose-700 dark:bg-rose-600 rounded-full text-[10px] font-bold text-white uppercase tracking-tighter">
                  Next Prayer
                </div>
              )}
              <span
                className={`material-symbols-outlined mb-3 ${isNext ? "text-white text-4xl" : "text-blue-600 dark:text-blue-400 text-3xl"}`}
                style={isNext ? { fontVariationSettings: "'FILL' 1" } : undefined}
              >
                {PRAYER_ICONS[name]}
              </span>
              <span className={`text-xs font-bold uppercase tracking-widest mb-1 ${isNext ? "text-white/80" : "text-slate-500 dark:text-slate-400"}`}>
                {name}
              </span>
              <span className={`text-2xl font-black tracking-tight ${isNext ? "text-white" : "text-slate-900 dark:text-slate-100"}`}>
                {times?.[name] ? formatTime12(times[name]) : "—"}
              </span>
              {isNext && (
                <div className="mt-2 text-xs font-medium text-white/90 bg-white/10 px-3 py-1 rounded-full">
                  {countdown}
                </div>
              )}
            </div>
          );
        })}
      </section>

      {/* ── Monthly Calendar + Sidebar ──────────────────────── */}
      <section className="grid grid-cols-1 lg:grid-cols-4 gap-8 mb-16">

        {/* ── Table (3 col span) ──────────────────────────────── */}
        <div className="lg:col-span-3">
          <div className="bg-blue-50 dark:bg-slate-800/50 rounded-2xl p-6 md:p-8 shadow-sm h-full">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
              <div>
                <h2 className="text-2xl font-black tracking-tight text-slate-900 dark:text-slate-100">Monthly Prayer Calendar</h2>
                <p className="text-slate-600 dark:text-slate-400 text-sm font-medium">
                  Full schedule for {MONTH_NAMES[calMonth.month - 1]} {calMonth.year}
                  {times?.hijriMonth && ` / ${times.hijriMonth} ${times.hijriYear}`}
                </p>
              </div>
              <div className="flex items-center gap-3 bg-white dark:bg-slate-800 px-4 py-2 rounded-xl shadow-sm">
                <button onClick={prevMonth} className="p-1 hover:bg-blue-100 dark:hover:bg-slate-700 rounded-full transition-colors text-slate-700 dark:text-slate-300">
                  <span className="material-symbols-outlined">chevron_left</span>
                </button>
                <span className="font-bold text-blue-700 dark:text-blue-400 min-w-[120px] text-center">
                  {MONTH_NAMES[calMonth.month - 1]} {calMonth.year}
                </span>
                <button onClick={nextMonth} className="p-1 hover:bg-blue-100 dark:hover:bg-slate-700 rounded-full transition-colors text-slate-700 dark:text-slate-300">
                  <span className="material-symbols-outlined">chevron_right</span>
                </button>
              </div>
            </div>

            <div className="overflow-x-auto custom-scrollbar">
              <table className="w-full text-left border-collapse min-w-[640px]">
                <thead>
                  <tr className="text-slate-500 dark:text-slate-400 uppercase text-[11px] font-black tracking-widest border-b-2 border-slate-300 dark:border-slate-600">
                    <th className="py-4 px-3 sticky left-0 bg-blue-50 dark:bg-slate-800/50">Date</th>
                    <th className="py-4 px-3">Hijri</th>
                    <th className="py-4 px-3">Fajr</th>
                    <th className="py-4 px-3">Sunrise</th>
                    <th className="py-4 px-3">Dhuhr</th>
                    <th className="py-4 px-3">Asr</th>
                    <th className="py-4 px-3">Maghrib</th>
                    <th className="py-4 px-3">Isha</th>
                  </tr>
                </thead>
                <tbody className="text-sm text-slate-700 dark:text-slate-300">
                  {calendar.map((day) => {
                    const isToday = day.date === todayReadable;
                    const isFriday = day.dayOfWeek === "Friday";
                    const dayNum = day.date.split(" ")[0];
                    const dayOfWeek = day.dayOfWeek?.slice(0, 3) ?? "";
                    return (
                      <tr
                        key={day.date}
                        className={
                          isToday
                            ? "bg-blue-100/60 dark:bg-blue-900/20 border-b border-blue-300/40 dark:border-blue-700/40 hover:bg-blue-100 dark:hover:bg-blue-900/30 transition-colors"
                            : "border-b border-slate-200/50 dark:border-slate-700/30 hover:bg-blue-50/50 dark:hover:bg-slate-700/30 transition-colors"
                        }
                      >
                        <td className={`py-4 px-3 sticky left-0 ${isToday ? "bg-blue-100/60 dark:bg-blue-900/20 font-black text-blue-700 dark:text-blue-400" : "bg-blue-50 dark:bg-slate-800/50 font-bold"}`}>
                          {dayNum} {dayOfWeek}
                        </td>
                        <td className={`py-4 px-3 ${isToday ? "text-blue-600 dark:text-blue-400 font-bold" : isFriday ? "text-rose-600 dark:text-rose-400 font-medium" : "text-slate-400 dark:text-slate-500 font-medium"}`}>
                          {day.hijriDate.length > 12 ? day.hijriDate.slice(0, 10) : day.hijriDate}
                        </td>
                        {(["Fajr", "Sunrise", "Dhuhr", "Asr", "Maghrib", "Isha"] as const).map((p) => (
                          <td
                            key={p}
                            className={`py-4 px-3 font-mono ${
                              isToday && p === nextPrayer
                                ? "font-black text-blue-700 dark:text-blue-400 underline decoration-2 underline-offset-4"
                                : isToday ? "font-bold" : isFriday && p === "Dhuhr" ? "text-rose-600 dark:text-rose-400 font-bold" : ""
                            }`}
                          >
                            {day[p]}
                          </td>
                        ))}
                      </tr>
                    );
                  })}
                  {calendar.length === 0 && (
                    <tr><td colSpan={8} className="py-8 text-center text-slate-500 dark:text-slate-400">No calendar data available.</td></tr>
                  )}
                </tbody>
              </table>
            </div>

            <div className="mt-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 border-t border-slate-300 dark:border-slate-600 pt-4">
              <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">Data based on Muslim World League · Aladhan API</p>
            </div>
          </div>
        </div>

        {/* ── Sidebar ─────────────────────────────────────────── */}
        <div className="flex flex-col gap-6">

          {/* Location info */}
          <div className="bg-white dark:bg-slate-800 rounded-xl p-6 shadow-sm flex flex-col gap-4 border border-blue-100 dark:border-slate-700">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
                <span className="material-symbols-outlined text-blue-600 dark:text-blue-400">location_on</span>
              </div>
              <div>
                <h3 className="font-bold text-slate-900 dark:text-slate-100 leading-tight">
                  {usingGeo ? "Your Location" : `${CITIES[selected].label} Region`}
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">MWL Calculation Method</p>
              </div>
            </div>
            <div className="h-32 rounded-lg bg-blue-50 dark:bg-slate-700 overflow-hidden border border-slate-200 dark:border-slate-600">
              <img
                alt="Map of Doha"
                className="w-full h-full object-cover grayscale opacity-60 contrast-125"
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuCWdKTkqgI1aars3_M4TpyvlEXM3k1sxeN78prU3i2vnfa8bbVPcZgWeVlk80QUoJfS8gMNK63yBLZgFZ7TmUE0vndBTzkLveTXqArOTt60C1tU-iTEcCVDDyzXA_KESWvy5V3h56EvLs4PIlqSi3KKiF_tiQ5OFsviqItYNzGDYDJOseGZO7XqUlO2Ii7aHPugRDL2AVGlVI5c6nfRN1TzYn-a-8jT5-6Rkw9nY27CKGkn85-zJZutS1OTOGNzfIHL8H9aFRepqYc"
              />
            </div>
            <div className="flex flex-col gap-2">
              <div className="flex justify-between text-sm">
                <span className="text-slate-600 dark:text-slate-400 font-medium">Qibla Direction</span>
                <span className="font-bold text-slate-900 dark:text-slate-100">255.48° W</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-slate-600 dark:text-slate-400 font-medium">Calculation</span>
                <span className="font-bold text-slate-900 dark:text-slate-100">Muslim World League</span>
              </div>
            </div>
          </div>

          {/* Friday reminder */}
          <div className="bg-rose-100 dark:bg-rose-900/20 text-rose-800 dark:text-rose-300 rounded-xl p-6 flex flex-col gap-3 shadow-sm border border-rose-200 dark:border-rose-800/30">
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-rose-700 dark:text-rose-400" style={{ fontVariationSettings: "'FILL' 1" }}>error</span>
              <h3 className="font-black tracking-tight text-rose-700 dark:text-rose-400">Friday Prayer Reminder</h3>
            </div>
            <p className="text-sm font-medium leading-relaxed opacity-90">
              Jumu&apos;ah prayers will be held at {times?.Dhuhr ? formatTime12(times.Dhuhr) : "—"}. Please arrive at least 15 minutes early.
            </p>
          </div>

          {/* Hijri months reference */}
          <div className="bg-white dark:bg-slate-800 rounded-xl p-6 shadow-sm border border-blue-100 dark:border-slate-700">
            <h3 className="font-black text-sm tracking-tight text-slate-900 dark:text-slate-100 mb-3">The 12 Hijri Months</h3>
            <div className="flex flex-col gap-1.5">
              {[
                "Muharram", "Safar", "Rabi al-Awwal", "Rabi al-Thani",
                "Jumada al-Awwal", "Jumada al-Thani", "Rajab", "Sha'ban",
                "Ramadan", "Shawwal", "Dhu al-Qi'dah", "Dhu al-Hijjah",
              ].map((m, i) => {
                const isCurrent = times?.hijriMonth === m;
                return (
                  <div key={m} className="flex items-center gap-2 text-sm">
                    <span className="text-slate-400 dark:text-slate-500 font-mono w-5 text-right text-xs">{i + 1}.</span>
                    <span className={isCurrent ? "font-bold text-blue-700 dark:text-blue-400" : "text-slate-600 dark:text-slate-400"}>{m}</span>
                    {isCurrent && <span className="text-[10px] bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 px-2 py-0.5 rounded-full font-bold">Current</span>}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* ── Resources Section ──────────────────────────────────── */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
        {[
          {
            img: "https://lh3.googleusercontent.com/aida-public/AB6AXuBAQAi9LJWu4JiIWiPOvoOElrHXXRU3bDoV0OaRtjPZPOUgMfWOs_Iaoau0AI10070REJiIpP2YQxHNFGvu2sd5Glq_Bm1tg7afkchmILGSb1TRDznVMlmKpLBa5ZFk5iOjSlsmyP0Te5iwqc072v-ZcmfsfQG3pwYtURP8AZe_8lOIUngWoNrxBY1uei_1YRuJkzIHOz9n3PDges7gascqS8j-ZAsj_nsLun19Do8g47zp0JVos7c6mlOjbrk2VJ-LDNyg0Re4Ju0",
            title: "Guide to Mosques in Qatar",
            desc: "Discover the most significant and architecturally stunning mosques across the nation.",
          },
          {
            img: "https://lh3.googleusercontent.com/aida-public/AB6AXuDS4vo1gpNqY9aZrLzi2eGz5apBsnrGiJGOYXbTi1K9s_9z_jmp-K6JuVCNOpeiGuY7b-xPPWEoDNbaHTLWlXINDHkYiP60jrQDkyc1IxcWIHDw8pxCavgqkdGTueqOpcjQhWBe1PWcVq__dNAoCvXRiwV_vkfSN-SF0-y-ncIKVq5bWM5z6UKAAJxUtXtONT0JvYhP8riVxlo7zZXRuBWRAGgxSl0M29Hqk-r7TB474H3YxEhsW2bDf3i42HvIBrD3t3GCkT6fpSg",
            title: "Ministry of Awqaf Resources",
            desc: "Official religious guidelines, fatwas, and community services for residents.",
          },
          {
            img: "https://lh3.googleusercontent.com/aida-public/AB6AXuCv6Tpy66UuLsinAusVi_8cttfHt_Lrw3ozdyaJitdHaRsIbKl5ht0SZ-gBy8BghkJSkV90cfdAfe_0C331w0mBG03uumN6fgVwPwKR92sZXuLz68sPIcwzrLC1Ke1CobHai0_w1Bz0k3xJO2ETLOiLJS6N80Fsx8FJ28byjZyYEAjQ-iHX4-qyu2WQLBeIEdtJQzrM82AOznXYXwG65gOHK6cITaGq-mP5AR06JGn4tKk4QVhRc9UKeTE3Hdr_auGQTc41SZyxUtM",
            title: "Hijri Calendar & Islamic Dates",
            desc: "Full Hijri calendar with important Islamic dates and public holidays.",
          },
        ].map(({ img, title, desc }) => (
          <div key={title} className="group cursor-pointer">
            <div className="aspect-video rounded-xl bg-blue-50 dark:bg-slate-700 overflow-hidden mb-4 relative">
              <img alt={title} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" src={img} />
              <div className="absolute inset-0 bg-blue-700/20 dark:bg-blue-400/10 opacity-0 group-hover:opacity-100 transition-opacity" />
            </div>
            <h3 className="font-black text-lg text-slate-900 dark:text-slate-100 mb-2 tracking-tight">{title}</h3>
            <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">{desc}</p>
          </div>
        ))}
      </section>
    </div>
  );
}
