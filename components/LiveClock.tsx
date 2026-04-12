"use client";

import { useState, useEffect } from "react";

function useQatarTime() {
  const [time, setTime] = useState("──:──");
  const [dateEn, setDateEn] = useState("");
  const [dateAr, setDateAr] = useState("");

  useEffect(() => {
    function tick() {
      const now = new Date();
      setTime(
        now.toLocaleTimeString("en-US", {
          timeZone: "Asia/Qatar",
          hour: "2-digit",
          minute: "2-digit",
          hour12: false,
        })
      );
      setDateEn(
        now.toLocaleDateString("en-US", {
          timeZone: "Asia/Qatar",
          weekday: "long",
          day: "numeric",
          month: "long",
        })
      );
      setDateAr(
        now.toLocaleDateString("ar-QA", {
          timeZone: "Asia/Qatar",
          weekday: "long",
          day: "numeric",
          month: "long",
        })
      );
    }
    tick();
    const id = setInterval(tick, 30000);
    return () => clearInterval(id);
  }, []);

  return { time, dateEn, dateAr };
}

/** Date badge inside the hero */
export function HeroDatestamp() {
  const { dateEn, dateAr } = useQatarTime();
  return (
    <span className="bg-white/10 backdrop-blur-md px-3 sm:px-4 py-1.5 rounded-full text-white text-[10px] sm:text-xs font-semibold uppercase tracking-wider">
      <span className="lang-en">{dateEn}</span>
      <span className="lang-ar">{dateAr}</span>
    </span>
  );
}

/** Large clock value inside the hero */
export function HeroClock() {
  const { time } = useQatarTime();
  return (
    <span className="text-white text-4xl sm:text-5xl font-light tabular-nums tracking-tight">
      {time}
    </span>
  );
}
