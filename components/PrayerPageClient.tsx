"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import type { PrayerTimes, PrayerDay } from "@/lib/prayer";

/* ── City list ──────────────────────────────────────────────── */
const CITIES: { label: string; city: string; country: string }[] = [
  { label: "Doha", city: "Doha", country: "Qatar" },
  { label: "Al Wakrah", city: "Al Wakrah", country: "Qatar" },
  { label: "Al Khor", city: "Al Khor", country: "Qatar" },
  { label: "Madinat ash Shamal", city: "Madinat ash Shamal", country: "Qatar" },
  { label: "Mecca", city: "Mecca", country: "Saudi Arabia" },
  { label: "Medina", city: "Medina", country: "Saudi Arabia" },
  { label: "Dubai", city: "Dubai", country: "United Arab Emirates" },
  { label: "London", city: "London", country: "United Kingdom" },
  { label: "New York", city: "New York", country: "United States" },
];

const PRAYERS = ["Fajr", "Sunrise", "Dhuhr", "Asr", "Maghrib", "Isha"] as const;
const PRAYER_ICONS: Record<string, string> = {
  Fajr: "nights_stay", Sunrise: "wb_twilight", Dhuhr: "wb_sunny",
  Asr: "light_mode", Maghrib: "wb_shade", Isha: "bedtime",
};

const SKY_THEMES: Record<string, string> = {
  Fajr: "from-slate-950 via-indigo-950 to-primary-dark",
  Sunrise: "from-amber-900 via-rose-900 to-primary",
  Dhuhr: "from-blue-600 via-sky-500 to-indigo-400",
  Asr: "from-indigo-600 via-rose-500 to-amber-500",
  Maghrib: "from-primary-dark via-rose-900 to-amber-900",
  Isha: "from-slate-950 via-slate-900 to-indigo-950",
};

const MONTH_NAMES = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];

function toMin(t: string) {
  if (!t) return 0;
  const clean = t.replace(/\s*\([^)]*\)/, "").trim();
  const [h, m] = clean.split(":").map(Number);
  return h * 60 + (m || 0);
}

function formatTime12(t: string) {
  if (!t) return "—";
  const clean = t.replace(/\s*\([^)]*\)/, "").trim();
  const [h, m] = clean.split(":").map(Number);
  const ampm = h >= 12 ? "PM" : "AM";
  const h12 = h === 0 ? 12 : h > 12 ? h - 12 : h;
  return `${String(h12).padStart(2, "0")}:${String(m).padStart(2, "0")} ${ampm}`;
}

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
  const todayRowRef = useRef<HTMLTableRowElement>(null);
  const tableContainerRef = useRef<HTMLDivElement>(null);

  const now = new Date();
  const qatarTime = new Date(now.toLocaleString("en-US", { timeZone: "Asia/Qatar" }));
  const nowMin = qatarTime.getHours() * 60 + qatarTime.getMinutes();

  const nextPrayer = (() => {
    for (const name of PRAYERS) {
      const t = times?.[name];
      if (t && toMin(t) > nowMin) return name;
    }
    return PRAYERS[0];
  })();

  const nextMin = times?.[nextPrayer] ? toMin(times[nextPrayer]) : 0;
  let diff = nextMin - nowMin;
  if (diff < 0) diff += 24 * 60;
  const diffH = Math.floor(diff / 60);
  const diffM = diff % 60;
  const countdown = diffH > 0 ? `${diffH}h ${diffM}m` : `${diffM}m`;

  const dateEn = now.toLocaleDateString("en-US", { weekday: "long", day: "numeric", month: "long" });
  const hijriStr = times ? `${times.hijriDate} ${times.hijriMonth} ${times.hijriYear} AH` : "";

  const fetchCity = useCallback((cityIdx: number, yr: number, mo: number) => {
    if (cityIdx === 0 && yr === now.getFullYear() && mo === now.getMonth() + 1) {
      setTimes(defaultTimes);
      setCalendar(defaultCalendar);
      return;
    }
    const { city, country } = CITIES[cityIdx];
    setLoading(true);
    setError(false);
    Promise.all([
      fetch(`/api/prayer?city=${encodeURIComponent(city)}&country=${encodeURIComponent(country)}`).then(r => r.json()),
      fetch(`/api/prayer/monthly?city=${encodeURIComponent(city)}&country=${encodeURIComponent(country)}&year=${yr}&month=${mo}`).then(r => r.json()),
    ]).then(([t, c]) => {
      setTimes(t);
      setCalendar(c);
    }).catch(() => setError(true)).finally(() => setLoading(false));
  }, [defaultTimes, defaultCalendar]);

  useEffect(() => {
    if (!usingGeo) fetchCity(selected, calMonth.year, calMonth.month);
  }, [selected, usingGeo, calMonth, fetchCity]);

  // Auto-scroll the today row into view whenever the calendar re-renders
  // (on initial load and whenever city/month changes back to current month).
  const currentMonth = now.getMonth() + 1;
  const currentYear = now.getFullYear();
  const isCurrentMonth = calMonth.month === currentMonth && calMonth.year === currentYear;

  useEffect(() => {
    if (!isCurrentMonth || !todayRowRef.current || !tableContainerRef.current) return;
    // Wait one frame so the DOM has painted before measuring
    const id = requestAnimationFrame(() => {
      const container = tableContainerRef.current!;
      const row = todayRowRef.current!;
      const rowTop = row.offsetTop;
      // Scroll so today row sits near the top of the visible table area (with 48px offset for the sticky header)
      container.scrollTo({ top: rowTop - 48, behavior: "smooth" });
    });
    return () => cancelAnimationFrame(id);
  }, [calendar, isCurrentMonth]);

  // Compute today string once, used both in the effect and the render
  const todayStr = now.toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" });

  return (
    <div className={`space-y-8 sm:space-y-12 pb-20 transition-opacity duration-500 ${loading ? "opacity-60" : "opacity-100"}`}>
      
      {/* ── Dynamic Sky Hero & Sticky Hub ────────────────────── */}
      <section className={`relative rounded-[2.5rem] sm:rounded-[3rem] overflow-hidden p-8 sm:p-20 text-white shadow-2xl transition-colors duration-1000 bg-gradient-to-br ${SKY_THEMES[nextPrayer]}`}>
        <div className="absolute inset-0 bg-black/10 backdrop-blur-[2px]" />
        <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-end gap-8 sm:gap-10">
          <div>
            <div className="flex items-center gap-3 mb-4 sm:mb-6 bg-white/10 backdrop-blur-md border border-white/10 px-4 py-2 rounded-full w-fit">
              <span className="w-1.5 h-1.5 bg-accent rounded-full animate-pulse" />
              <p className="label-mobile text-white/80 lowercase first-letter:uppercase">{countdown} until {nextPrayer}</p>
            </div>
            <h1 className="national-title text-5xl sm:text-9xl mb-4 leading-none italic">
              {usingGeo ? "Your Location" : CITIES[selected].label}
            </h1>
            <div className="flex items-center gap-4 sm:gap-6 label-mobile text-white/50 normal-case">
              <span>{dateEn}</span>
              <span className="w-1.5 h-1.5 bg-white/20 rounded-full" />
              <span className="text-accent">{hijriStr}</span>
            </div>
          </div>

          <div className="flex flex-wrap gap-3 w-full md:w-auto">
            <select
              value={selected}
              onChange={e => { setUsingGeo(false); setSelected(Number(e.target.value)); }}
              className="appearance-none w-full md:w-auto px-6 py-4 bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-white hover:text-primary transition-all cursor-pointer outline-none active:scale-95"
            >
              {CITIES.map((c, i) => (
                <option key={i} value={i} className="text-slate-900 font-sans">{c.label}</option>
              ))}
            </select>
          </div>
        </div>
      </section>

      {/* ── Daily Clock Dashboard ───────────────────────────── */}
      <section className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4">
        {PRAYERS.map((name) => {
          const isNext = name === nextPrayer;
          return (
            <div key={name} className={`bento-tile flex flex-col items-center justify-center p-6 sm:p-8 relative group transition-all touch-active ${isNext ? 'border-primary/50 ring-2 ring-primary/10 bg-primary/5' : ''}`}>
              {isNext && <span className="absolute top-3 right-4 label-mobile text-primary lowercase first-letter:uppercase">Next</span>}
              <span className={`material-symbols-outlined mb-3 text-3xl transition-transform group-hover:scale-110 ${isNext ? 'text-primary' : 'text-slate-300'}`} style={isNext ? { fontVariationSettings: "'FILL' 1" } : {}}>
                {PRAYER_ICONS[name]}
              </span>
              <p className="label-mobile text-slate-400 mb-1 normal-case tracking-wide">{name}</p>
              <h3 className={`text-xl sm:text-3xl font-black tracking-tighter ${isNext ? 'text-primary' : 'text-slate-900 dark:text-slate-100'}`}>
                {formatTime12(times?.[name] || "")}
              </h3>
            </div>
          );
        })}
      </section>

      {/* ── Monthly Calendar & Insights ──────────────────────── */}
      <section className="grid grid-cols-1 lg:grid-cols-12 gap-8">

        {/* ── Monthly Table ──────────────────────────── */}
        <div className="lg:col-span-8 bento-tile !p-0 overflow-hidden shadow-xl sm:block hidden">

          {/* Table header / controls */}
          <div className="px-6 py-5 bg-white dark:bg-slate-900 border-b border-slate-100 dark:border-slate-800 flex flex-col sm:flex-row justify-between items-center gap-4">
            <div>
              <h2 className="national-title text-3xl leading-none">Monthly Calendar</h2>
              <p className="label-xs text-slate-400 mt-1 normal-case tracking-wide">Muslim World League (MWL) · Method 2</p>
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={() => setCalMonth(p => p.month === 1 ? { year: p.year - 1, month: 12 } : { year: p.year, month: p.month - 1 })}
                className="w-9 h-9 rounded-xl flex items-center justify-center bg-slate-100 dark:bg-slate-800 hover:bg-primary hover:text-white transition-all"
                aria-label="Previous month"
              >
                <span className="material-symbols-outlined" style={{ fontSize: "18px" }}>west</span>
              </button>
              <p className="font-black text-sm uppercase tracking-wider min-w-[130px] text-center text-slate-900 dark:text-slate-100">
                {MONTH_NAMES[calMonth.month - 1]} {calMonth.year}
              </p>
              <button
                onClick={() => setCalMonth(p => p.month === 12 ? { year: p.year + 1, month: 1 } : { year: p.year, month: p.month + 1 })}
                className="w-9 h-9 rounded-xl flex items-center justify-center bg-slate-100 dark:bg-slate-800 hover:bg-primary hover:text-white transition-all"
                aria-label="Next month"
              >
                <span className="material-symbols-outlined" style={{ fontSize: "18px" }}>east</span>
              </button>

              {/* Jump to today — only shown when not on current month */}
              {!isCurrentMonth && (
                <button
                  onClick={() => setCalMonth({ year: currentYear, month: currentMonth })}
                  className="px-3 h-9 rounded-xl bg-primary text-white text-xs font-black uppercase tracking-wide hover:bg-primary-dark transition-all"
                >
                  Today
                </button>
              )}
            </div>
          </div>

          {/* Table — scrollable container, ref used for auto-scroll to today */}
          <div ref={tableContainerRef} className="overflow-x-auto overflow-y-auto max-h-[520px] custom-scrollbar">
            <table className="w-full text-left border-collapse min-w-[540px]">
              <thead className="sticky top-0 z-10">
                <tr className="bg-slate-50 dark:bg-slate-950 border-b border-slate-200 dark:border-slate-800">
                  {/* Date */}
                  <th className="py-3 pl-5 pr-3 label-xs text-slate-400 font-black normal-case tracking-wider w-[90px]">Date</th>
                  {/* Hijri */}
                  <th className="py-3 px-3 label-xs text-slate-400 font-black normal-case tracking-wider">Hijri</th>
                  {/* Prayer columns — colour-coded */}
                  <th className="py-3 px-3">
                    <span className="flex items-center gap-1 label-xs text-indigo-400 font-black normal-case tracking-wider">
                      <span className="material-symbols-outlined" style={{ fontSize: "13px", fontVariationSettings: "'FILL' 1" }}>bedtime</span>Fajr
                    </span>
                  </th>
                  <th className="py-3 px-3">
                    <span className="flex items-center gap-1 label-xs text-amber-500 font-black normal-case tracking-wider">
                      <span className="material-symbols-outlined" style={{ fontSize: "13px", fontVariationSettings: "'FILL' 1" }}>wb_sunny</span>Dhuhr
                    </span>
                  </th>
                  <th className="py-3 px-3">
                    <span className="flex items-center gap-1 label-xs text-orange-400 font-black normal-case tracking-wider">
                      <span className="material-symbols-outlined" style={{ fontSize: "13px", fontVariationSettings: "'FILL' 1" }}>light_mode</span>Asr
                    </span>
                  </th>
                  <th className="py-3 px-3">
                    <span className="flex items-center gap-1 label-xs text-rose-400 font-black normal-case tracking-wider">
                      <span className="material-symbols-outlined" style={{ fontSize: "13px", fontVariationSettings: "'FILL' 1" }}>wb_shade</span>Maghrib
                    </span>
                  </th>
                  <th className="py-3 px-3 pr-5">
                    <span className="flex items-center gap-1 label-xs text-slate-400 font-black normal-case tracking-wider">
                      <span className="material-symbols-outlined" style={{ fontSize: "13px", fontVariationSettings: "'FILL' 1" }}>nightlight</span>Isha
                    </span>
                  </th>
                </tr>
              </thead>
              <tbody>
                {calendar.map((day) => {
                    const isFriday = day.dayOfWeek === "Friday";
                    const isToday = day.date === todayStr;
                    const [dayNum, , ] = day.date.split(" ");
                    const weekdayShort = day.dayOfWeek.slice(0, 3);

                    return (
                      <tr
                        key={day.date}
                        ref={isToday ? todayRowRef : undefined}
                        className={`group transition-colors border-b last:border-0 ${
                          isToday
                            ? "bg-primary/8 dark:bg-primary/15 border-primary/20"
                            : isFriday
                            ? "bg-primary/[0.03] dark:bg-primary/[0.06] border-slate-100 dark:border-slate-900 hover:bg-primary/5"
                            : "border-slate-50 dark:border-slate-900 hover:bg-slate-50/80 dark:hover:bg-slate-900/50"
                        }`}
                      >
                        {/* Date cell */}
                        <td className="py-2.5 pl-5 pr-3 whitespace-nowrap">
                          <div className="flex items-center gap-2">
                            {isToday && (
                              <span className="w-1.5 h-1.5 rounded-full bg-primary shrink-0" />
                            )}
                            <span className={`font-black text-sm tabular-nums ${isToday ? "text-primary" : isFriday ? "text-primary/70" : "text-slate-700 dark:text-slate-300"}`}>
                              {dayNum}
                            </span>
                            <span className={`text-xs font-medium ${isToday ? "text-primary/70" : "text-slate-400"}`}>
                              {weekdayShort}
                            </span>
                            {isFriday && !isToday && (
                              <span className="hidden sm:inline label-xs text-primary/50 normal-case tracking-wide">Jumu'ah</span>
                            )}
                          </div>
                        </td>

                        {/* Hijri */}
                        <td className="py-2.5 px-3 text-xs font-medium text-slate-400 whitespace-nowrap">
                          {day.hijriDate}
                        </td>

                        {/* Fajr */}
                        <td className="py-2.5 px-3">
                          <span className={`font-mono text-xs font-bold tabular-nums ${isToday ? "text-indigo-500 dark:text-indigo-400" : "text-slate-600 dark:text-slate-400"}`}>
                            {day.Fajr}
                          </span>
                        </td>

                        {/* Dhuhr */}
                        <td className="py-2.5 px-3">
                          <span className={`font-mono text-xs font-bold tabular-nums ${isToday ? "text-amber-600 dark:text-amber-400" : "text-slate-600 dark:text-slate-400"}`}>
                            {day.Dhuhr}
                          </span>
                        </td>

                        {/* Asr */}
                        <td className="py-2.5 px-3">
                          <span className={`font-mono text-xs font-bold tabular-nums ${isToday ? "text-orange-500 dark:text-orange-400" : "text-slate-600 dark:text-slate-400"}`}>
                            {day.Asr}
                          </span>
                        </td>

                        {/* Maghrib */}
                        <td className="py-2.5 px-3">
                          <span className={`font-mono text-xs font-bold tabular-nums ${isToday ? "text-rose-500 dark:text-rose-400" : "text-slate-600 dark:text-slate-400"}`}>
                            {day.Maghrib}
                          </span>
                        </td>

                        {/* Isha */}
                        <td className="py-2.5 px-3 pr-5">
                          <span className={`font-mono text-xs font-bold tabular-nums ${isToday ? "text-slate-700 dark:text-slate-200" : "text-slate-600 dark:text-slate-400"}`}>
                            {day.Isha}
                          </span>
                        </td>
                      </tr>
                    );
                  })}
              </tbody>
            </table>
          </div>

          {/* Table legend */}
          <div className="px-5 py-3 border-t border-slate-100 dark:border-slate-800 flex flex-wrap items-center gap-4 bg-slate-50/50 dark:bg-slate-950/50">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-primary" />
              <span className="label-xs text-slate-400 normal-case">Today</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-6 h-1 rounded bg-primary/20" />
              <span className="label-xs text-slate-400 normal-case">Jumu'ah (Friday)</span>
            </div>
            <span className="label-xs text-slate-300 dark:text-slate-600 normal-case ml-auto">Sunrise excluded · 24-hr format</span>
          </div>
        </div>

        {/* ── Side info ─────────────────────────────── */}
        <div className="lg:col-span-4 space-y-6">
          <div className="bento-tile !bg-primary !text-white border-none shadow-xl shadow-primary/20">
            <h3 className="national-title text-3xl mb-3 italic">Friday Prayer</h3>
            <p className="text-sm font-medium text-white/80 leading-relaxed mb-5">
              Jumu&apos;ah prayers in Doha are performed at the Dhuhr time slot. Most mosques hold the sermon (khutbah) 20 minutes prior.
            </p>
            <div className="flex items-center gap-3 p-4 bg-white/10 rounded-2xl border border-white/10">
              <span className="material-symbols-outlined text-accent" style={{ fontVariationSettings: "'FILL' 1" }}>schedule</span>
              <div>
                <p className="label-xs text-white/50 normal-case tracking-wide mb-0.5">Next Jumu&apos;ah</p>
                <p className="font-black text-base">{formatTime12(times?.Dhuhr || "")}</p>
              </div>
            </div>
          </div>

          <div className="bento-tile">
            <h3 className="label-xs text-slate-400 mb-5">Regional Compass</h3>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium text-slate-500">Qibla Angle</span>
                <span className="font-mono font-black text-sm text-slate-900 dark:text-slate-100">255.48° W</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium text-slate-500">Calculation</span>
                <span className="font-mono font-black text-sm text-slate-900 dark:text-slate-100">MWL Method 2</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium text-slate-500">Coordinates</span>
                <span className="font-mono font-black text-sm text-slate-900 dark:text-slate-100">25.28°N 51.53°E</span>
              </div>
              <div className="flex justify-between items-center pt-4 border-t border-slate-100 dark:border-slate-800">
                <span className="text-sm font-medium text-slate-500">Hijri Date</span>
                <span className="font-mono font-black text-sm text-primary">
                  {times?.hijriDate} {times?.hijriMonth} {times?.hijriYear}
                </span>
              </div>
            </div>
          </div>

          <div className="bento-tile !bg-slate-950 !text-white border-none">
            <p className="label-xs text-white/40 mb-3 normal-case tracking-wide">Prayer source</p>
            <p className="text-sm font-medium text-white/70 leading-relaxed">
              Times sourced from the <span className="text-accent font-bold">Aladhan API</span> using Muslim World League (MWL) standards. Accurate to ±1 minute for Doha.
            </p>
            <a href="https://aladhan.com" target="_blank" rel="noopener noreferrer" className="mt-4 inline-flex items-center gap-1.5 label-xs text-white/40 hover:text-white transition-colors normal-case tracking-wide">
              aladhan.com
              <span className="material-symbols-outlined" style={{ fontSize: "12px" }}>open_in_new</span>
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}
