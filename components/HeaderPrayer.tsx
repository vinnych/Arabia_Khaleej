import { getPrayerTimes } from "@/lib/prayer";
import { Moon } from "lucide-react";

const PRAYER_ORDER = ["Fajr", "Sunrise", "Dhuhr", "Asr", "Maghrib", "Isha"] as const;

export default async function HeaderPrayer() {
  try {
    const times = await getPrayerTimes();

    // Current Doha time as "HH:MM" string for comparison
    const now = new Date().toLocaleString("en-US", {
      timeZone: "Asia/Qatar",
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    });

    const next = PRAYER_ORDER.find((name) => times[name] > now) ?? PRAYER_ORDER[0];

    return (
      <a
        href="/prayer"
        className="hidden sm:flex items-center gap-1.5 text-white/60 hover:text-white/90 transition-colors duration-150"
      >
        <Moon size={12} className="text-amber-300/80" />
        <span className="text-[10px] font-semibold tracking-wide text-white/70">{next}</span>
        <span className="text-[10px] font-mono tabular-nums text-amber-300">{times[next]}</span>
      </a>
    );
  } catch {
    return null;
  }
}
