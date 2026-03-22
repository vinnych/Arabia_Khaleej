"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MapPin, Menu, X, LocateFixed, Loader2 } from "lucide-react";
import { Playfair_Display } from "next/font/google";

const playfair = Playfair_Display({
  subsets: ["latin"],
  weight: ["700"],
  style: ["normal", "italic"],
});

const NAV_LINKS = [
  { href: "/", label: "Home" },
  { href: "/prayer", label: "Prayer" },
  { href: "/weather", label: "Weather" },
  { href: "/currency", label: "Currency" },
  { href: "/news", label: "News" },
  { href: "/jobs", label: "Jobs" },
  { href: "/hijri-calendar", label: "Hijri" },
  { href: "/ramadan-2026", label: "Ramadan" },
];

const PRAYER_NAMES = ["Fajr", "Sunrise", "Dhuhr", "Asr", "Maghrib", "Isha"] as const;

interface Prayer { name: string; time: string; icon: string; }

type LocationStatus = "idle" | "loading" | "granted" | "denied";

function toMin(t: string) {
  const [h, m] = t.replace(/\s*\([^)]*\)/, "").trim().split(":").map(Number);
  return h * 60 + (m || 0);
}

export default function SkyScene({ prayers: defaultPrayers }: {
  prayers: Prayer[];
  date: string;
  currentHour: number;
}) {

  const [prayers, setPrayers] = useState<Prayer[]>(defaultPrayers);
  const [locationName, setLocationName] = useState("Doha, Qatar");
  const [locationStatus, setLocationStatus] = useState<LocationStatus>("idle");

  const [nextPrayer, setNextPrayer] = useState<{ name: string; time: string } | null>(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Sky state — updates every minute to keep sun/moon synced
  const [now, setNow] = useState(new Date());
  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), 60000);
    return () => clearInterval(id);
  }, []);

  const hours = now.getHours();
  const minutes = now.getMinutes();
  const timeInHours = hours + minutes / 60;
  const timeStr = `${String(hours).padStart(2, "0")}:${String(minutes).padStart(2, "0")}`;
  const rotationAngle = (timeInHours - 12) * 15;

  const getPrayerTime = (name: string) =>
    prayers.find((p) => p.name === name)?.time.replace(/\s*\([^)]*\)/, "").trim() ?? null;

  const fajrTime    = getPrayerTime("Fajr")    ?? "04:30";
  const sunriseTime = getPrayerTime("Sunrise") ?? "05:45";
  const maghribTime = getPrayerTime("Maghrib") ?? "17:45";
  const ishaTime    = getPrayerTime("Isha")    ?? "19:15";

  let bgGradient = "linear-gradient(to bottom right, #0f172a, #1e1b4b, #020617)"; // Night
  let isNight = true;

  if (timeStr >= fajrTime && timeStr < sunriseTime) {
    bgGradient = "linear-gradient(to bottom right, #1e3a8a, #9d174d, #f59e0b)"; // Dawn
    isNight = false;
  } else if (timeStr >= sunriseTime && timeStr < maghribTime) {
    bgGradient = "linear-gradient(to bottom right, #0ea5e9, #2563eb, #0284c7)"; // Day
    isNight = false;
  } else if (timeStr >= maghribTime && timeStr < ishaTime) {
    bgGradient = "linear-gradient(to bottom right, #4c1d95, #be123c, #ea580c)"; // Dusk
    isNight = false;
  }

  // Recalculate next prayer whenever prayers change
  useEffect(() => {
    const tick = () => {
      const n = new Date();
      const localMin = n.getHours() * 60 + n.getMinutes();
      let nextIdx = prayers.findIndex((p) => toMin(p.time) > localMin);
      if (nextIdx === -1) nextIdx = 0;
      const next = prayers[nextIdx];
      setNextPrayer({ name: next.name, time: next.time });
    };
    tick();
    const id = setInterval(tick, 60000);
    return () => clearInterval(id);
  }, [prayers]);

  const handleLocationClick = () => {
    if (locationStatus === "loading") return;
    if (!navigator.geolocation) {
      setLocationStatus("denied");
      return;
    }

    setLocationStatus("loading");

    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        const { latitude, longitude } = pos.coords;
        try {
          const prayerRes = await fetch(
            `https://api.aladhan.com/v1/timings?latitude=${latitude}&longitude=${longitude}&method=8`,
            { signal: AbortSignal.timeout(8000) }
          );
          if (!prayerRes.ok) throw new Error("Prayer API failed");
          const prayerData = await prayerRes.json();
          const t = prayerData?.data?.timings;
          if (!t) throw new Error("No timings in response");

          const newPrayers: Prayer[] = PRAYER_NAMES.map((name) => ({
            name,
            time: t[name].replace(/ \([^)]*\)$/, ""),
            icon: "",
          }));
          setPrayers(newPrayers);
          setLocationStatus("granted");

          try {
            const geoRes = await fetch(
              `https://nominatim.openstreetmap.org/reverse?lat=${latitude}&lon=${longitude}&format=json`,
              { headers: { "Accept-Language": "en" }, signal: AbortSignal.timeout(5000) }
            );
            const geoData = await geoRes.json();
            const city =
              geoData?.address?.city ||
              geoData?.address?.town ||
              geoData?.address?.village ||
              geoData?.address?.state ||
              "Your Location";
            const country = geoData?.address?.country_code?.toUpperCase() ?? "";
            setLocationName(`${city}${country ? `, ${country}` : ""}`);
          } catch {
            setLocationName("Your Location");
          }
        } catch {
          setLocationStatus("denied");
        }
      },
      () => {
        setLocationStatus("denied");
      },
      { timeout: 10000 }
    );
  };

  return (
    <motion.div
      className="relative w-full overflow-hidden text-white shadow-2xl"
      animate={{ background: bgGradient }}
      transition={{ duration: 2, ease: "easeInOut" }}
      id="prayer"
    >
      {/* Stars */}
      <motion.div
        className="absolute inset-0 pointer-events-none"
        animate={{ opacity: isNight ? 1 : 0.1 }}
        transition={{ duration: 2 }}
      >
        {[
          { top: "8%",  left: "10%",  size: "w-1 h-1",     delay: "0s",   dur: "2.1s" },
          { top: "15%", right: "18%", size: "w-1.5 h-1.5", delay: "0.7s", dur: "3.2s" },
          { top: "22%", left: "32%",  size: "w-1 h-1",     delay: "1.4s", dur: "2.8s" },
          { top: "28%", right: "28%", size: "w-2 h-2",     delay: "0.3s", dur: "1.9s" },
          { top: "45%", left: "22%",  size: "w-1 h-1",     delay: "2.1s", dur: "3.5s" },
          { top: "12%", left: "62%",  size: "w-1.5 h-1.5", delay: "1.1s", dur: "2.4s" },
        ].map((s, i) => (
          <div
            key={i}
            className={`absolute ${s.size} bg-white rounded-full shadow-[0_0_5px_white] star-twinkle`}
            style={{ top: s.top, left: (s as { left?: string }).left, right: (s as { right?: string }).right, animationDelay: s.delay, animationDuration: s.dur }}
          />
        ))}
      </motion.div>

      {/* Sun / Moon orbit */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-80">
        <motion.div
          className="absolute top-[30%] left-1/2 w-[800px] h-[800px] -ml-[400px] rounded-full border border-white/5"
          animate={{ rotate: rotationAngle }}
          transition={{ type: "spring", stiffness: 20, damping: 15 }}
        >
          {/* Sun */}
          <div className="absolute -top-8 left-1/2 -ml-8 w-16 h-16 bg-gradient-to-br from-yellow-100 via-yellow-300 to-orange-500 rounded-full shadow-[0_0_80px_rgba(253,224,71,1)]" />
          {/* Moon */}
          <div className="absolute -bottom-8 left-1/2 -ml-8 w-16 h-16 bg-gradient-to-br from-slate-100 to-slate-400 rounded-full shadow-[0_0_60px_rgba(241,245,249,0.6)]">
            <div className="absolute top-3 right-4 w-4 h-4 bg-black/10 rounded-full" />
            <div className="absolute bottom-4 left-3 w-3 h-3 bg-black/10 rounded-full" />
            <div className="absolute top-7 left-4 w-2 h-2 bg-black/10 rounded-full" />
          </div>
        </motion.div>
      </div>

      {/* Atmospheric orbs */}
      <motion.div
        className="absolute -top-40 -right-40 w-96 h-96 bg-primary rounded-full blur-[120px] opacity-40 pointer-events-none"
        animate={{ scale: [1, 1.1, 1], opacity: [0.3, 0.5, 0.3] }}
        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="absolute -bottom-40 -left-40 w-96 h-96 bg-secondary-accent rounded-full blur-[120px] opacity-20 pointer-events-none"
        animate={{ scale: [1, 1.2, 1], opacity: [0.2, 0.4, 0.2] }}
        transition={{ duration: 10, repeat: Infinity, ease: "easeInOut", delay: 1 }}
      />

      <div className="relative z-10 w-full px-4 sm:px-6 lg:px-8">

        {/* Top navigation */}
        <div className="h-16 flex items-center justify-between border-b border-white/10">
          {/* Logo */}
          <div className="flex items-center gap-3">
            <a
              href="/"
              className={`${playfair.className} text-2xl font-bold leading-none tracking-wide bg-clip-text text-transparent bg-gradient-to-r from-white to-sky-200`}
            >
              QATAR
            </a>
            <span className="text-[9px] font-medium text-white/55 uppercase tracking-[0.2em] mt-1 hidden sm:inline-block border border-white/25 rounded-full px-2 py-0.5">
              Portal
            </span>
          </div>

          {/* Desktop nav */}
          <nav className="hidden md:flex items-center gap-5 text-[10px] font-semibold tracking-widest uppercase text-white/80">
            {NAV_LINKS.map(({ href, label }) => (
              <a
                key={href}
                href={href}
                className="hover:text-white transition-colors"
              >
                {label}
              </a>
            ))}
          </nav>

          {/* Mobile hamburger */}
          <button
            className="md:hidden p-2 -mr-2 transition-colors text-white/80"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle menu"
            aria-expanded={mobileMenuOpen}
          >
            {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>

        {/* Mobile menu — fixed overlay, never shifts layout */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <>
              {/* Backdrop */}
              <motion.div
                key="backdrop"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.15 }}
                className="fixed inset-0 z-40 md:hidden bg-black/40"
                onClick={() => setMobileMenuOpen(false)}
              />
              {/* Sheet — slides in from top-right, compact */}
              <motion.div
                key="sheet"
                initial={{ opacity: 0, scale: 0.95, y: -8 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: -8 }}
                transition={{ duration: 0.15 }}
                className="fixed top-4 right-4 z-50 md:hidden rounded-2xl overflow-hidden shadow-2xl"
                style={{
                  background: "rgba(14,4,10,0.96)",
                  border: "1px solid rgba(200,168,75,0.18)",
                  backdropFilter: "blur(20px)",
                  minWidth: "180px",
                }}
              >
                <nav className="flex flex-col py-2">
                  {NAV_LINKS.map(({ href, label }) => (
                    <a
                      key={href}
                      href={href}
                      onClick={() => setMobileMenuOpen(false)}
                      className="px-5 py-2.5 text-[11px] font-bold tracking-widest uppercase text-white/80 hover:text-white hover:bg-white/5 transition-colors"
                    >
                      {label}
                    </a>
                  ))}
                </nav>
              </motion.div>
            </>
          )}
        </AnimatePresence>

        {/* Hero content */}
        <div className="pb-8 pt-4">
          {/* Row: location button + date/time */}
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-4">
            <div>
              <button
                onClick={handleLocationClick}
                disabled={locationStatus === "loading"}
                className="flex items-center gap-2 bg-white/10 hover:bg-white/20 backdrop-blur-md border border-white/20 px-4 py-2 rounded-full text-white transition-all text-xs md:text-sm font-medium uppercase tracking-wider group active:scale-95 shadow-sm"
                title="Click to update location"
              >
                {locationStatus === "loading" ? (
                  <Loader2 className="w-4 h-4 md:w-5 md:h-5 animate-spin" />
                ) : locationStatus === "granted" ? (
                  <LocateFixed className="w-4 h-4 md:w-5 md:h-5 group-hover:scale-110 transition-transform" />
                ) : (
                  <MapPin className="w-4 h-4 md:w-5 md:h-5 group-hover:scale-110 transition-transform" />
                )}
                <AnimatePresence mode="wait">
                  <motion.span
                    key={locationName + locationStatus}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.15 }}
                  >
                    {locationStatus === "loading"
                      ? "Locating..."
                      : locationStatus === "denied"
                      ? "Location denied"
                      : locationName}
                  </motion.span>
                </AnimatePresence>
              </button>
            </div>
            <div className="sm:text-right">
              <div className="text-sm md:text-base font-medium text-white/90">
                {now.toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric" })}
              </div>
              <div className="text-xs text-white/75 font-mono mt-0.5 tracking-widest">{timeStr}</div>
            </div>
          </div>

          {/* Prayer cards — horizontal scroll on mobile, 6-col grid on sm+ */}
          <div className="flex overflow-x-auto sm:grid sm:grid-cols-6 gap-2 md:gap-3 pb-2 snap-x snap-mandatory hide-scrollbar -mx-4 px-4 sm:mx-0 sm:px-0">
            {prayers.map((p) => {
              const isNext = nextPrayer?.name === p.name;
              return (
                <div
                  key={p.name}
                  className={`relative overflow-hidden p-3 rounded-xl flex flex-col items-center justify-center transition-all duration-300 min-w-[110px] sm:min-w-0 snap-center active:scale-95 border ${
                    isNext
                      ? "bg-primary/40 border-primary shadow-[0_0_20px_rgba(138,21,56,0.4)] scale-105 active:scale-100"
                      : "bg-white/5 backdrop-blur-md border-white/10 hover:bg-white/10"
                  }`}
                >
                  {isNext && (
                    <div className="absolute inset-0 bg-gradient-to-b from-primary/20 to-transparent pointer-events-none" />
                  )}
                  <span
                    className={`text-[10px] font-semibold uppercase tracking-widest mb-1 ${
                      isNext ? "text-white" : "text-white/70"
                    }`}
                  >
                    {p.name}
                  </span>
                  <AnimatePresence mode="wait">
                    <motion.span
                      key={p.time}
                      className={`font-mono text-base md:text-lg ${
                        isNext ? "font-bold text-white" : "font-medium text-white/90"
                      }`}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.15 }}
                    >
                      {p.time}
                    </motion.span>
                  </AnimatePresence>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* City silhouette */}
      <div className="absolute bottom-0 left-0 right-0 pointer-events-none" aria-hidden="true">
        <svg
          viewBox="0 0 1440 72"
          xmlns="http://www.w3.org/2000/svg"
          preserveAspectRatio="none"
          width="100%"
          height="72"
        >
          <defs>
            <linearGradient id="silhouetteFade" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="rgba(0,0,0,0)" />
              <stop offset="100%" stopColor="rgba(0,0,0,0.55)" />
            </linearGradient>
          </defs>
          <path
            d="M0 72 L0 52 L28 52 L28 44 L48 44 L48 38 L62 38 L62 30 L75 30 L75 38 L88 38 L88 52 L112 52 L112 42 L122 42 L122 34 L128 28 L131 21 L133 14 L134 8 L135 14 L137 21 L140 28 L146 34 L156 42 L168 42 L168 52 L195 52 L195 42 L208 42 L208 35 L220 35 L220 42 L232 42 L232 52 L258 52 L258 40 L270 40 L270 32 L282 32 L282 40 L295 40 L295 52 L320 52 L320 42 L332 42 L332 34 L345 34 L345 42 L358 42 L358 52 L385 52 L385 40 L398 40 L398 52 L418 52 L418 38 L430 38 L430 30 L442 30 L442 38 L455 38 L455 52 L480 52 L480 40 L492 40 L492 32 L505 32 L505 40 L518 40 L518 52 L545 52 L545 42 L558 42 L558 34 L568 30 L572 24 L574 17 L575 10 L576 4 L577 10 L579 17 L581 24 L585 30 L595 34 L605 42 L615 52 L640 52 L640 40 L652 40 L652 32 L665 32 L665 40 L678 40 L678 52 L703 52 L703 40 L715 40 L715 32 L728 32 L728 40 L740 40 L740 52 L768 52 L768 40 L780 40 L780 52 L800 52 L800 40 L812 40 L812 32 L825 32 L825 40 L838 40 L838 52 L865 52 L865 40 L878 40 L878 32 L890 32 L890 40 L902 40 L902 52 L928 52 L928 40 L942 40 L942 32 L955 32 L955 40 L968 40 L968 52 L995 52 L995 40 L1008 40 L1008 32 L1020 32 L1020 40 L1032 40 L1032 52 L1060 52 L1060 44 L1072 44 L1072 36 L1085 36 L1085 44 L1098 44 L1098 52 L1125 52 L1125 40 L1138 40 L1138 32 L1150 32 L1150 40 L1162 40 L1162 52 L1190 52 L1190 40 L1202 40 L1202 52 L1222 52 L1222 40 L1235 40 L1235 32 L1248 32 L1248 40 L1260 40 L1260 52 L1288 52 L1288 40 L1300 40 L1300 32 L1312 32 L1312 40 L1325 40 L1325 52 L1352 52 L1352 44 L1365 44 L1365 36 L1378 36 L1378 44 L1390 44 L1390 52 L1415 52 L1415 44 L1428 44 L1428 52 L1440 52 L1440 72 Z"
            fill="url(#silhouetteFade)"
          />
          <path
            d="M0 72 L0 52 L28 52 L28 44 L48 44 L48 38 L62 38 L62 30 L75 30 L75 38 L88 38 L88 52 L112 52 L112 42 L122 42 L122 34 L128 28 L131 21 L133 14 L134 8 L135 14 L137 21 L140 28 L146 34 L156 42 L168 42 L168 52 L195 52 L195 42 L208 42 L208 35 L220 35 L220 42 L232 42 L232 52 L258 52 L258 40 L270 40 L270 32 L282 32 L282 40 L295 40 L295 52 L320 52 L320 42 L332 42 L332 34 L345 34 L345 42 L358 42 L358 52 L385 52 L385 40 L398 40 L398 52 L418 52 L418 38 L430 38 L430 30 L442 30 L442 38 L455 38 L455 52 L480 52 L480 40 L492 40 L492 32 L505 32 L505 40 L518 40 L518 52 L545 52 L545 42 L558 42 L558 34 L568 30 L572 24 L574 17 L575 10 L576 4 L577 10 L579 17 L581 24 L585 30 L595 34 L605 42 L615 52 L640 52 L640 40 L652 40 L652 32 L665 32 L665 40 L678 40 L678 52 L703 52 L703 40 L715 40 L715 32 L728 32 L728 40 L740 40 L740 52 L768 52 L768 40 L780 40 L780 52 L800 52 L800 40 L812 40 L812 32 L825 32 L825 40 L838 40 L838 52 L865 52 L865 40 L878 40 L878 32 L890 32 L890 40 L902 40 L902 52 L928 52 L928 40 L942 40 L942 32 L955 32 L955 40 L968 40 L968 52 L995 52 L995 40 L1008 40 L1008 32 L1020 32 L1020 40 L1032 40 L1032 52 L1060 52 L1060 44 L1072 44 L1072 36 L1085 36 L1085 44 L1098 44 L1098 52 L1125 52 L1125 40 L1138 40 L1138 32 L1150 32 L1150 40 L1162 40 L1162 52 L1190 52 L1190 40 L1202 40 L1202 52 L1222 52 L1222 40 L1235 40 L1235 32 L1248 32 L1248 40 L1260 40 L1260 52 L1288 52 L1288 40 L1300 40 L1300 32 L1312 32 L1312 40 L1325 40 L1325 52 L1352 52 L1352 44 L1365 44 L1365 36 L1378 36 L1378 44 L1390 44 L1390 52 L1415 52 L1415 44 L1428 44 L1428 52 L1440 52 L1440 72 Z"
            fill="rgba(5,10,25,0.45)"
          />
        </svg>
      </div>
    </motion.div>
  );
}
