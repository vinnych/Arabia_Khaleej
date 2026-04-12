"use client";

import { useState, useEffect } from "react";

interface Prayer { name: string; time: string; }

function toMin(t: string) {
  const [h, m] = t.replace(/\s*\([^)]*\)/, "").trim().split(":").map(Number);
  return h * 60 + (m || 0);
}

const MATERIAL_ICONS: Record<string, string> = {
  Fajr: "bedtime", Sunrise: "wb_twilight", Dhuhr: "wb_sunny", Asr: "wb_cloudy", Maghrib: "wb_twilight", Isha: "nightlight",
};

const GRID_PRAYERS = ["Fajr", "Dhuhr", "Maghrib", "Isha"];

const AR_NAMES: Record<string, string> = {
  Fajr: "الفجر", Dhuhr: "الظهر", Asr: "العصر", Maghrib: "المغرب", Isha: "العشاء",
};

export default function PrayerCardInner({ prayers }: { prayers: Prayer[] }) {
  const [now, setNow] = useState(new Date());

  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), 30000);
    return () => clearInterval(id);
  }, []);

  const qatarTime = new Date(now.toLocaleString("en-US", { timeZone: "Asia/Qatar" }));
  const localMin = qatarTime.getHours() * 60 + qatarTime.getMinutes();
  let nextIdx = prayers.findIndex((p) => toMin(p.time) > localMin);
  if (nextIdx === -1) nextIdx = 0;
  const next = prayers[nextIdx];

  let diffMin = toMin(next.time) - localMin;
  if (diffMin < 0) diffMin += 24 * 60;
  const h = Math.floor(diffMin / 60);
  const m = diffMin % 60;
  const countdown = h > 0 ? `${h}h ${m}m` : `${m}`;
  const countdownLabel = h > 0 ? "remaining" : "mins to go";

  const gridPrayers = prayers.filter((p) => GRID_PRAYERS.includes(p.name));

  return (
    <>
      {/* Header row */}
      <div className="flex justify-between items-start mb-8">
        <div>
          <p className="text-[11px] font-bold text-blue-600 dark:text-blue-400 uppercase tracking-[0.2em] mb-1">
            <span className="lang-en">Coming Up Next</span>
            <span className="lang-ar">الصلاة القادمة</span>
          </p>
          <h2 className="text-3xl sm:text-4xl font-black text-slate-900 dark:text-slate-100">
            <span className="lang-en">{next.name} Prayer</span>
            <span className="lang-ar">صلاة {AR_NAMES[next.name] ?? next.name}</span>
          </h2>
        </div>
        {/* Countdown badge */}
        <div className="bg-red-700 dark:bg-red-800 text-white px-5 py-3 rounded-2xl flex flex-col items-center shadow-lg shadow-red-700/20 shrink-0 ml-4">
          <span className="text-2xl font-black leading-none tabular-nums">{countdown}</span>
          <span className="text-[9px] font-bold uppercase tracking-tighter mt-1 text-white/80">
            <span className="lang-en">{countdownLabel}</span>
            <span className="lang-ar">دقيقة متبقية</span>
          </span>
        </div>
      </div>

      {/* Next prayer highlighted row */}
      <div className="flex items-center justify-between p-5 bg-blue-50 dark:bg-blue-900/20 rounded-2xl border border-blue-100 dark:border-blue-800/50 mb-3">
        <div className="flex items-center gap-4">
          <span
            className="material-symbols-outlined text-3xl text-blue-600 dark:text-blue-400"
            style={{ fontVariationSettings: "'FILL' 1" }}
          >
            {MATERIAL_ICONS[next.name] ?? "schedule"}
          </span>
          <span className="text-xl font-bold text-slate-900 dark:text-slate-100">
            <span className="lang-en">{next.name}</span>
            <span className="lang-ar">{AR_NAMES[next.name] ?? next.name}</span>
          </span>
        </div>
        <span className="font-mono font-bold text-2xl text-blue-600 dark:text-blue-400">
          {next.time.replace(/\s*\([^)]*\)/, "").trim()}
        </span>
      </div>

      {/* 2×2 grid */}
      <div className="grid grid-cols-2 gap-3">
        {gridPrayers.map((p) => (
          <div
            key={p.name}
            className="p-4 bg-slate-50 dark:bg-slate-800/50 rounded-2xl flex justify-between items-center opacity-70 hover:opacity-100 transition-opacity"
          >
            <span className="text-sm font-semibold text-slate-600 dark:text-slate-400">
              <span className="lang-en">{p.name}</span>
              <span className="lang-ar">{AR_NAMES[p.name] ?? p.name}</span>
            </span>
            <span className="font-mono font-bold text-sm tabular-nums text-slate-900 dark:text-slate-100">
              {p.time.replace(/\s*\([^)]*\)/, "").trim()}
            </span>
          </div>
        ))}
      </div>
    </>
  );
}
