"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MapPin, Clock, Moon, Sunrise, Sun, CloudSun, Sunset, Menu, X, LocateFixed, Loader2 } from "lucide-react";
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

function getPrayerIcon(name: string) {
  const props = { size: 16, strokeWidth: 1.5 };
  switch (name) {
    case "Fajr":    return <Sunrise {...props} />;
    case "Sunrise": return <Sun {...props} />;
    case "Dhuhr":   return <Sun {...props} />;
    case "Asr":     return <CloudSun {...props} />;
    case "Maghrib": return <Sunset {...props} />;
    case "Isha":    return <Moon {...props} />;
    default:        return <Sun {...props} />;
  }
}

export default function SkyScene({ prayers: defaultPrayers, date }: {
  prayers: Prayer[];
  date: string;
  currentHour: number;
}) {
  const toMin = (t: string) => {
    const [h, m] = t.replace(/\s*\([^)]*\)/, "").trim().split(":").map(Number);
    return h * 60 + (m || 0);
  };

  const [prayers, setPrayers] = useState<Prayer[]>(defaultPrayers);
  const [locationName, setLocationName] = useState("Doha, Qatar");
  const [locationStatus, setLocationStatus] = useState<LocationStatus>("idle");

  const [nextPrayer, setNextPrayer] = useState<{ name: string; time: string } | null>(null);
  const [countdown, setCountdown] = useState("");
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
  // At 12:00 sun is at top (0°), at 00:00 moon is at top (±180°)
  const rotationAngle = (timeInHours - 12) * 15;

  const getPrayerTime = (name: string) =>
    prayers.find((p) => p.name === name)?.time.replace(/\s*\([^)]*\)/, "").trim() ?? null;

  const fajrTime    = getPrayerTime("Fajr")    ?? "04:30";
  const sunriseTime = getPrayerTime("Sunrise") ?? "05:45";
  const maghribTime = getPrayerTime("Maghrib") ?? "17:45";
  const ishaTime    = getPrayerTime("Isha")    ?? "19:15";

  let bgGradient = "linear-gradient(135deg, #1E0A14 0%, #2D0E1C 45%, #180820 100%)"; // Night
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

  // Recalculate countdown whenever prayers change (default or location-based)
  useEffect(() => {
    const tick = () => {
      const now = new Date();
      // Use local device time offset for countdown — works for any timezone
      const localMin = now.getHours() * 60 + now.getMinutes();
      const localSec = now.getSeconds();

      let nextIdx = prayers.findIndex((p) => toMin(p.time) > localMin);
      if (nextIdx === -1) nextIdx = 0;

      const next = prayers[nextIdx];
      const nextMin = toMin(next.time);

      let totalSec = nextMin > localMin
        ? (nextMin - localMin) * 60 - localSec
        : (24 * 60 - localMin + nextMin) * 60 - localSec;
      if (totalSec < 0) totalSec = 0;

      const h = Math.floor(totalSec / 3600);
      const m = Math.floor((totalSec % 3600) / 60);
      const s = totalSec % 60;

      setNextPrayer({ name: next.name, time: next.time });
      setCountdown(`${String(h).padStart(2,"0")}:${String(m).padStart(2,"0")}:${String(s).padStart(2,"0")}`);
    };

    tick();
    const id = setInterval(tick, 1000);
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
          // Fetch prayer times for the detected coordinates
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

          // Reverse geocode city name via Nominatim (free, no key)
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
      className="relative w-full overflow-hidden text-white"
      animate={{ background: bgGradient }}
      transition={{ duration: 2, ease: "easeInOut" }}
      id="prayer"
    >
      {/* Stars — fade out during the day */}
      <motion.div
        className="absolute inset-0 pointer-events-none"
        animate={{ opacity: isNight ? 1 : 0.08 }}
        transition={{ duration: 2 }}
      >
        <div className="absolute top-[8%]  left-[10%] w-1   h-1   bg-white rounded-full shadow-[0_0_5px_white]" />
        <div className="absolute top-[15%] right-[18%] w-1.5 h-1.5 bg-white rounded-full shadow-[0_0_5px_white]" />
        <div className="absolute top-[22%] left-[32%] w-1   h-1   bg-white rounded-full shadow-[0_0_5px_white]" />
        <div className="absolute top-[28%] right-[28%] w-2   h-2   bg-white rounded-full shadow-[0_0_8px_white] opacity-80" />
        <div className="absolute top-[45%] left-[22%] w-1   h-1   bg-white rounded-full shadow-[0_0_5px_white]" />
        <div className="absolute top-[12%] left-[62%] w-1.5 h-1.5 bg-white rounded-full shadow-[0_0_6px_white] opacity-60" />
        <div className="absolute top-[35%] left-[50%] w-1   h-1   bg-white rounded-full shadow-[0_0_4px_white] opacity-70" />
        <div className="absolute top-[5%]  right-[40%] w-1  h-1   bg-white rounded-full shadow-[0_0_4px_white]" />
      </motion.div>

      {/* Sun / Moon orbit */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-70">
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
        className="absolute -top-40 -right-32 w-[500px] h-[500px] rounded-full pointer-events-none"
        style={{ background: "radial-gradient(circle, rgba(139,26,60,0.45) 0%, transparent 70%)", filter: "blur(60px)" }}
        animate={{ scale: [1, 1.12, 1], opacity: [0.35, 0.55, 0.35] }}
        transition={{ duration: 9, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="absolute -bottom-32 -left-32 w-[420px] h-[420px] rounded-full pointer-events-none"
        style={{ background: "radial-gradient(circle, rgba(200,168,75,0.15) 0%, transparent 70%)", filter: "blur(60px)" }}
        animate={{ scale: [1, 1.2, 1], opacity: [0.15, 0.28, 0.15] }}
        transition={{ duration: 12, repeat: Infinity, ease: "easeInOut", delay: 1.5 }}
      />
      <motion.div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] rounded-full pointer-events-none"
        style={{ background: "radial-gradient(ellipse, rgba(107,14,42,0.18) 0%, transparent 70%)", filter: "blur(50px)" }}
        animate={{ scaleX: [1, 1.08, 1] }}
        transition={{ duration: 15, repeat: Infinity, ease: "easeInOut", delay: 3 }}
      />

      <div className="relative z-10 w-full px-4 sm:px-6 lg:px-8">

        {/* Top navigation */}
        <div
          className="h-16 flex items-center justify-between"
          style={{ borderBottom: "1px solid rgba(139,26,60,0.30)" }}
        >
          {/* Logo */}
          <a
            href="/"
            className={`${playfair.className} text-2xl font-bold leading-none tracking-widest`}
            style={{ color: "#C8A84B" }}
          >
            QATAR
          </a>

          {/* Desktop nav */}
          <nav className="hidden md:flex items-center gap-6">
            {NAV_LINKS.map(({ href, label }) => (
              <a
                key={href}
                href={href}
                className="text-[10px] font-bold tracking-widest uppercase transition-colors duration-150 hover:text-[#C8A84B]"
                style={{ color: "rgba(248,236,210,0.40)" }}
              >
                {label}
              </a>
            ))}
          </nav>

          {/* Mobile hamburger */}
          <button
            className="md:hidden p-2 -mr-2 transition-colors"
            style={{ color: "rgba(200,168,75,0.65)" }}
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle menu"
            aria-expanded={mobileMenuOpen}
          >
            {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>

        {/* Mobile dropdown */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div
              key="mobile-menu"
              initial={{ opacity: 0, y: -6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ duration: 0.15 }}
              className="absolute left-0 right-0 z-20 md:hidden"
              style={{
                background: "rgba(20,6,14,0.97)",
                borderBottom: "1px solid rgba(139,26,60,0.35)",
                backdropFilter: "blur(12px)",
              }}
            >
              <nav className="w-full px-4 sm:px-6 lg:px-8 py-2 flex flex-col">
                {NAV_LINKS.map(({ href, label }) => (
                  <a
                    key={href}
                    href={href}
                    onClick={() => setMobileMenuOpen(false)}
                    className="text-[11px] font-bold tracking-widest uppercase py-3.5 transition-colors hover:text-[#C8A84B]"
                    style={{
                      color: "rgba(248,236,210,0.55)",
                      borderBottom: "1px solid rgba(139,26,60,0.18)",
                    }}
                  >
                    {label}
                  </a>
                ))}
              </nav>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Hero — compact */}
        <div className="pt-4 pb-5">

          {/* Row: location pill + countdown */}
          <motion.div
            className="flex items-center justify-between mb-3"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            {/* Location pill */}
            <button
              onClick={handleLocationClick}
              disabled={locationStatus === "loading"}
              className="inline-flex items-center gap-1.5 text-[10px] font-bold tracking-widest uppercase px-2.5 py-1 rounded-full transition-all duration-200"
              style={{
                color: locationStatus === "denied" ? "rgba(248,100,100,0.8)" : "#C8A84B",
                border: `1px solid ${locationStatus === "denied" ? "rgba(248,100,100,0.3)" : "rgba(200,168,75,0.22)"}`,
                background: locationStatus === "granted" ? "rgba(200,168,75,0.10)" : "rgba(200,168,75,0.04)",
              }}
              title="Click to use your location"
            >
              {locationStatus === "loading" ? <Loader2 size={10} className="animate-spin" /> :
               locationStatus === "granted" ? <LocateFixed size={10} /> : <MapPin size={10} />}
              <AnimatePresence mode="wait">
                <motion.span key={locationName}
                  initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                  transition={{ duration: 0.15 }}
                >
                  {locationStatus === "loading" ? "Detecting…" :
                   locationStatus === "denied" ? "Location denied" : locationName}
                </motion.span>
              </AnimatePresence>
            </button>

            {/* Countdown — inline, no badge box */}
            {countdown && (
              <motion.div
                className="flex items-center gap-1.5"
                initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.2 }}
              >
                <Clock size={11} style={{ color: "rgba(200,168,75,0.5)" }} />
                <span className="text-[10px] font-mono tabular-nums font-bold" style={{ color: "rgba(200,168,75,0.6)" }}>
                  {countdown}
                </span>
              </motion.div>
            )}
          </motion.div>

          {/* Next prayer — elegant inline row */}
          <AnimatePresence mode="wait">
            <motion.div
              key={nextPrayer?.name}
              className="flex items-baseline gap-3 mb-4"
              initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
              transition={{ duration: 0.4 }}
            >
              <h2 className={`${playfair.className} text-4xl sm:text-5xl font-bold italic leading-none`}
                style={{ color: "#F8ECD2" }}>
                {nextPrayer?.name ?? "Prayer Times"}
              </h2>
              {nextPrayer && (
                <span className="font-mono text-xl font-bold tabular-nums" style={{ color: "#C8A84B" }}>
                  {nextPrayer.time}
                </span>
              )}
            </motion.div>
          </AnimatePresence>

          {/* Prayer grid — compact cards */}
          <motion.div
            className="grid grid-cols-3 sm:grid-cols-6 gap-2"
            initial="hidden" animate="visible"
            variants={{ visible: { transition: { staggerChildren: 0.06 } } }}
          >
            {prayers.map((p) => {
              const isNext = nextPrayer?.name === p.name;
              return (
                <motion.div
                  key={p.name}
                  variants={{ hidden: { opacity: 0, y: 8 }, visible: { opacity: 1, y: 0 } }}
                  transition={{ duration: 0.3 }}
                  className="relative overflow-hidden flex flex-col items-center justify-center py-2.5 px-2 rounded-xl transition-all duration-300"
                  style={isNext ? {
                    background: "rgba(139,26,60,0.22)",
                    border: "1px solid rgba(200,168,75,0.45)",
                    boxShadow: "0 0 20px rgba(200,168,75,0.15)",
                    transform: "scale(1.05)",
                  } : {
                    background: "rgba(255,255,255,0.04)",
                    border: "1px solid rgba(139,26,60,0.20)",
                  }}
                >
                  <span className="mb-1" style={{ color: isNext ? "#C8A84B" : "rgba(248,200,160,0.28)" }}>
                    {getPrayerIcon(p.name)}
                  </span>
                  <span className="text-[9px] font-bold tracking-widest uppercase mb-1"
                    style={{ color: isNext ? "rgba(248,236,210,0.85)" : "rgba(248,210,185,0.35)" }}>
                    {p.name}
                  </span>
                  <AnimatePresence mode="wait">
                    <motion.span key={p.time}
                      className="font-mono text-sm font-semibold tabular-nums"
                      style={{ color: isNext ? "#C8A84B" : "rgba(200,168,75,0.50)" }}
                      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                      transition={{ duration: 0.15 }}
                    >
                      {p.time}
                    </motion.span>
                  </AnimatePresence>
                </motion.div>
              );
            })}
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
}
