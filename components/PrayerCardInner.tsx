"use client";

import { useState, useEffect } from "react";

interface Prayer { name: string; time: string; }

function toMin(t: string) {
  const [h, m] = t.replace(/\s*\([^)]*\)/, "").trim().split(":").map(Number);
  return h * 60 + (m || 0);
}

const ICONS: Record<string, string> = {
  Fajr: "bedtime", Sunrise: "wb_twilight", Dhuhr: "wb_sunny",
  Asr: "light_mode", Maghrib: "wb_shade", Isha: "nightlight",
};

const AR_NAMES: Record<string, string> = {
  Fajr: "الفجر", Sunrise: "الشروق", Dhuhr: "الظهر",
  Asr: "العصر", Maghrib: "المغرب", Isha: "العشاء",
};

/** The 5 canonical prayers shown in the card (Sunrise omitted) */
const CARD_PRAYERS = ["Fajr", "Dhuhr", "Asr", "Maghrib", "Isha"];

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
  const countdown = h > 0 ? `${h}h ${m}m` : `${m}m`;

  const cardPrayers = prayers.filter((p) => CARD_PRAYERS.includes(p.name));

  return (
    <>
      {/* ── Header ─────────────────────────────────────── */}
      <div className="flex items-center justify-between mb-5">
        <div>
          <p className="label-xs text-primary mb-1">
            <span className="lang-en">Prayer Times</span>
            <span className="lang-ar">مواقيت الصلاة</span>
          </p>
          <h2 className="text-2xl font-black text-slate-900 dark:text-slate-100 leading-none">
            <span className="lang-en">{next.name}</span>
            <span className="lang-ar">{AR_NAMES[next.name] ?? next.name}</span>
            <span className="ml-2 text-sm font-bold text-slate-400">
              <span className="lang-en">is next</span>
              <span className="lang-ar">قادمة</span>
            </span>
          </h2>
        </div>
        {/* Countdown badge */}
        <div className="bg-primary text-white px-4 py-2.5 rounded-xl flex flex-col items-center shadow-lg shadow-primary/20 shrink-0 ml-3">
          <span className="text-xl font-black leading-none tabular-nums">{countdown}</span>
          <span className="label-xs text-white/50 mt-0.5 normal-case tracking-wider">
            <span className="lang-en">remaining</span>
            <span className="lang-ar">متبقية</span>
          </span>
        </div>
      </div>

      {/* ── Prayer list ────────────────────────────────── */}
      <div className="space-y-1.5">
        {cardPrayers.map((p) => {
          const isNext = p.name === next.name;
          const timeStr = p.time.replace(/\s*\([^)]*\)/, "").trim();
          return (
            <a
              key={p.name}
              href="/prayer"
              aria-label={`${p.name} prayer at ${timeStr}${isNext ? " — next prayer" : ""}`}
              className={`flex items-center justify-between px-4 py-3 rounded-2xl transition-all duration-300 cursor-pointer group/row ${
                isNext
                  ? "bg-primary text-white shadow-lg shadow-primary/20 hover:bg-primary-dark"
                  : "bg-slate-50 dark:bg-slate-800/60 hover:bg-slate-100 dark:hover:bg-slate-800"
              }`}
            >
              <div className="flex items-center gap-3">
                <span
                  className={`material-symbols-outlined text-xl shrink-0 transition-transform group-hover/row:scale-110 ${isNext ? "text-white" : "text-slate-400"}`}
                  style={{ fontVariationSettings: isNext ? "'FILL' 1" : "'FILL' 0" }}
                >
                  {ICONS[p.name] ?? "schedule"}
                </span>
                <span className={`font-bold text-sm ${isNext ? "text-white" : "text-slate-700 dark:text-slate-300"}`}>
                  <span className="lang-en">{p.name}</span>
                  <span className="lang-ar">{AR_NAMES[p.name] ?? p.name}</span>
                </span>
                {isNext && (
                  <span className="label-xs text-white/60 normal-case tracking-wider hidden sm:inline">
                    <span className="lang-en">· next</span>
                    <span className="lang-ar">· القادمة</span>
                  </span>
                )}
              </div>
              <div className="flex items-center gap-2">
                <span className={`font-mono font-black text-base tabular-nums ${isNext ? "text-white" : "text-slate-900 dark:text-slate-100"}`}>
                  {timeStr}
                </span>
                <span
                  className={`material-symbols-outlined text-base opacity-0 group-hover/row:opacity-100 transition-opacity ${isNext ? "text-white/60" : "text-slate-400"}`}
                  style={{ fontSize: "16px" }}
                >
                  arrow_forward
                </span>
              </div>
            </a>
          );
        })}
      </div>
    </>
  );
}
