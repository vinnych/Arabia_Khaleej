"use client";

import { useState, useEffect } from "react";
import type { PrayerTimes } from "@/lib/prayer";

const PRAYERS = ["Fajr", "Sunrise", "Dhuhr", "Asr", "Maghrib", "Isha"] as const;

function toMin(t: string) {
  if (!t) return 0;
  const clean = t.replace(/\s*\([^)]*\)/, "").trim();
  const [h, m] = clean.split(":").map(Number);
  return h * 60 + (m || 0);
}

export function usePrayerTimes(city: string = "Doha", country: string = "Qatar") {
  const [times, setTimes] = useState<PrayerTimes | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchTimes() {
      try {
        const res = await fetch(`/api/prayer?city=${city}&country=${country}`);
        const data = await res.json();
        setTimes(data);
      } catch (err) {
        console.error("usePrayerTimes error:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchTimes();
  }, [city, country]);

  const nextPrayer = (() => {
    if (!times) return null;
    const now = new Date();
    const qatarTime = new Date(now.toLocaleString("en-US", { timeZone: "Asia/Qatar" }));
    const nowMin = qatarTime.getHours() * 60 + qatarTime.getMinutes();

    for (const name of PRAYERS) {
      const t = times[name as keyof PrayerTimes] as string;
      if (t && toMin(t) > nowMin) return { name, time: t.replace(/\s*\([^)]*\)/, "").trim() };
    }
    // If all passed, it's Fajr tomorrow
    return { name: "Fajr", time: (times.Fajr as string).replace(/\s*\([^)]*\)/, "").trim() };
  })();

  return { times, nextPrayer, loading };
}
