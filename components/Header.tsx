import { Playfair_Display } from "next/font/google";
import { Moon } from "lucide-react";
import { getPrayerTimes } from "@/lib/prayer";
import MobileMenu from "./MobileMenu";

const playfair = Playfair_Display({ subsets: ["latin"], weight: ["700"], style: ["normal"] });

const PRAYER_ORDER = ["Fajr", "Sunrise", "Dhuhr", "Asr", "Maghrib", "Isha"] as const;

const NAV_LINKS = [
  { href: "/", label: "Home" },
  { href: "/prayer", label: "Prayer" },
  { href: "/weather", label: "Weather" },
  { href: "/currency", label: "Currency" },
  { href: "/news", label: "News" },
  { href: "/jobs", label: "Jobs" },
  { href: "/hijri-calendar", label: "Hijri" },
  { href: "/qatar-metro", label: "Metro" },
];

export default async function Header() {
  let nextPrayer: { name: string; time: string } | null = null;
  try {
    const times = await getPrayerTimes();
    const now = new Date().toLocaleString("en-US", {
      timeZone: "Asia/Qatar",
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    });
    const next = PRAYER_ORDER.find((name) => times[name] > now) ?? PRAYER_ORDER[0];
    nextPrayer = { name: next, time: times[next] };
  } catch { /* show nav without prayer time */ }

  return (
    <header
      className="sticky top-0 z-10 border-b"
      style={{
        background: "linear-gradient(135deg, #1E0A14 0%, #3A0E20 60%, #1A0818 100%)",
        borderColor: "rgba(139,26,60,0.35)",
      }}
    >
      <div className="w-full px-4 sm:px-6 lg:px-8 h-11 flex items-center justify-between">
        {/* Logo */}
        <a
          href="/"
          className={`${playfair.className} text-lg font-bold leading-none tracking-widest`}
          style={{ color: "#C8A84B" }}
        >
          QATAR
        </a>

        {/* Desktop nav + prayer pill */}
        <nav className="hidden sm:flex items-center gap-5">
          {NAV_LINKS.map(({ href, label }) => (
            <a
              key={href}
              href={href}
              className="text-[10px] font-bold tracking-widest uppercase transition-colors duration-150"
              style={{ color: "rgba(248,236,210,0.45)" }}
            >
              {label}
            </a>
          ))}
          {nextPrayer && (
            <>
              <span style={{ color: "rgba(139,26,60,0.5)" }}>|</span>
              <a
                href="/prayer"
                className="flex items-center gap-1.5 transition-colors duration-150"
                style={{ color: "rgba(248,236,210,0.55)" }}
              >
                <Moon size={11} style={{ color: "#C8A84B" }} />
                <span className="text-[10px] font-semibold tracking-wide">{nextPrayer.name}</span>
                <span className="text-[10px] font-mono tabular-nums" style={{ color: "#C8A84B" }}>{nextPrayer.time}</span>
              </a>
            </>
          )}
        </nav>

        {/* Mobile hamburger */}
        <MobileMenu />

      </div>
    </header>
  );
}
