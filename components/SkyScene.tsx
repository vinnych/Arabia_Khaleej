"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Sunrise, Sun, CloudSun, Sunset, Moon, Clock } from "lucide-react";

interface Prayer { name: string; time: string; icon: string; }

function getSkyConfig(hour: number) {
  if (hour >= 4 && hour < 6)
    return { bg: "from-indigo-900 via-orange-400 to-rose-300", bodyBg: "bg-indigo-900", label: "Dawn", isSun: true, sunColor: "bg-orange-300", horizonY: 75 };
  if (hour >= 6 && hour < 11)
    return { bg: "from-sky-400 via-sky-300 to-amber-100", bodyBg: "bg-sky-400", label: "Morning", isSun: true, sunColor: "bg-yellow-300", horizonY: 55 };
  if (hour >= 11 && hour < 15)
    return { bg: "from-sky-500 via-sky-400 to-sky-200", bodyBg: "bg-sky-500", label: "Midday", isSun: true, sunColor: "bg-yellow-200", horizonY: 25 };
  if (hour >= 15 && hour < 18)
    return { bg: "from-sky-400 via-amber-200 to-orange-200", bodyBg: "bg-sky-400", label: "Afternoon", isSun: true, sunColor: "bg-orange-400", horizonY: 55 };
  if (hour >= 18 && hour < 20)
    return { bg: "from-orange-500 via-rose-400 to-indigo-700", bodyBg: "bg-orange-500", label: "Sunset", isSun: true, sunColor: "bg-orange-500", horizonY: 80 };
  return { bg: "from-indigo-950 via-indigo-900 to-slate-800", bodyBg: "bg-indigo-950", label: "Night", isSun: false, sunColor: "", horizonY: 100 };
}

function getSunX(hour: number): number {
  const pct = Math.max(0, Math.min(1, (hour - 6) / 12.5));
  return 5 + pct * 90;
}

function getPrayerIcon(name: string) {
  const props = { size: 14, strokeWidth: 1.5 };
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

export default function SkyScene({ prayers, date, currentHour }: {
  prayers: Prayer[];
  date: string;
  currentHour: number;
}) {
  const sky = getSkyConfig(currentHour);
  const sunX = getSunX(currentHour);
  const isNight = !sky.isSun;

  const toMin = (t: string) => {
    const clean = t.replace(/\s*\([^)]*\)/, "").trim();
    const [h, m] = clean.split(":").map(Number);
    return h * 60 + (m || 0);
  };

  const dohaOffset = 3 * 60;
  const nowMin = (new Date().getUTCHours() * 60 + new Date().getUTCMinutes() + dohaOffset) % (24 * 60);
  let currentPrayer = prayers[prayers.length - 1].name;
  for (let i = 0; i < prayers.length; i++) {
    if (nowMin < toMin(prayers[i].time)) {
      currentPrayer = i === 0 ? prayers[prayers.length - 1].name : prayers[i - 1].name;
      break;
    }
  }

  const [countdown, setCountdown] = useState("");
  const [nextPrayerName, setNextPrayerName] = useState("");

  useEffect(() => {
    const tick = () => {
      const now = new Date();
      const dohaMin = (now.getUTCHours() * 60 + now.getUTCMinutes() + 3 * 60) % (24 * 60);
      const dohaSec = now.getUTCSeconds();

      let nextIdx = prayers.findIndex((p) => toMin(p.time) > dohaMin);
      if (nextIdx === -1) nextIdx = 0;

      const nextPrayer = prayers[nextIdx];
      const nextPrayerMin = toMin(nextPrayer.time);

      let totalSec: number;
      if (nextPrayerMin > dohaMin) {
        totalSec = (nextPrayerMin - dohaMin) * 60 - dohaSec;
      } else {
        totalSec = (24 * 60 - dohaMin + nextPrayerMin) * 60 - dohaSec;
      }
      if (totalSec < 0) totalSec = 0;

      const h = Math.floor(totalSec / 3600);
      const m = Math.floor((totalSec % 3600) / 60);
      const s = totalSec % 60;

      setNextPrayerName(nextPrayer.name);
      setCountdown(
        `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`
      );
    };

    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="overflow-hidden shadow-xl">
      {/* Sky */}
      <div className={`relative bg-gradient-to-b ${sky.bg} h-24 sm:h-36 overflow-hidden`}>

        {/* Stars (night only) */}
        {isNight && (
          <>
            {[{x:10,y:15,d:0},{x:25,y:8,d:0.5},{x:45,y:20,d:1},{x:60,y:10,d:0.3},{x:75,y:18,d:0.8},{x:88,y:6,d:1.2}].map((s)=>(
              <div key={`${s.x}-${s.y}`} className="star-twinkle absolute w-1 h-1 bg-white rounded-full"
                style={{left:`${s.x}%`, top:`${s.y}%`, animationDelay:`${s.d}s`}} />
            ))}
          </>
        )}

        {/* Moon (night) */}
        {isNight && (
          <div className="sun-glow absolute w-10 h-10 rounded-full bg-slate-200 border-2 border-slate-300"
            style={{left:"70%", top:"18%"}}>
            <div className="absolute w-7 h-7 rounded-full bg-indigo-900 -top-1 -right-1" />
          </div>
        )}

        {/* Sun (day) */}
        {sky.isSun && (
          <div className="absolute" style={{left:`${sunX}%`, top:`${sky.horizonY - 20}%`, transform:"translate(-50%, -50%)"}}>
            <div className="absolute rounded-full opacity-25 blur-xl pointer-events-none"
              style={{width:80, height:80, top:"50%", left:"50%", transform:"translate(-50%,-50%)",
                background: sky.sunColor.includes("orange") ? "#fb923c" : "#fde68a"}} />
            <div className="rays-spin absolute" style={{width:0, height:0, top:"50%", left:"50%"}}>
              {[
                {deg:0,   len:13, w:2,   op:0.55},
                {deg:25,  len:7,  w:1.5, op:0.28},
                {deg:45,  len:14, w:2,   op:0.50},
                {deg:70,  len:7,  w:1.5, op:0.28},
                {deg:90,  len:13, w:2,   op:0.55},
                {deg:115, len:7,  w:1.5, op:0.28},
                {deg:135, len:14, w:2,   op:0.50},
                {deg:160, len:7,  w:1.5, op:0.28},
                {deg:180, len:13, w:2,   op:0.55},
                {deg:205, len:7,  w:1.5, op:0.28},
                {deg:225, len:14, w:2,   op:0.50},
                {deg:250, len:7,  w:1.5, op:0.28},
                {deg:270, len:13, w:2,   op:0.55},
                {deg:295, len:7,  w:1.5, op:0.28},
                {deg:315, len:14, w:2,   op:0.50},
                {deg:340, len:7,  w:1.5, op:0.28},
              ].map(({deg, len, w, op}) => (
                <div key={deg}
                  className="absolute rounded-full bg-yellow-100"
                  style={{
                    width: w,
                    height: len,
                    top: -(16 + 5 + len),
                    left: -w / 2,
                    opacity: op,
                    transformOrigin: `${w / 2}px ${16 + 5 + len}px`,
                    transform: `rotate(${deg}deg)`,
                  }}
                />
              ))}
            </div>
            <div className={`sun-glow relative w-8 h-8 rounded-full ${sky.sunColor}`}
              style={{boxShadow:"0 0 10px 3px rgba(253,230,138,0.45)"}} />
          </div>
        )}

        {/* Clouds (day/morning) */}
        {!isNight && currentHour >= 6 && currentHour < 19 && (
          <>
            <div className="cloud-float absolute opacity-80" style={{left:"15%", top:"30%"}}>
              <div className="relative w-20 h-6">
                <div className="absolute w-12 h-6 bg-white rounded-full top-0 left-2" />
                <div className="absolute w-8 h-5 bg-white rounded-full top-1 left-0" />
                <div className="absolute w-8 h-5 bg-white rounded-full top-1 right-0" />
              </div>
            </div>
            <div className="cloud-float absolute opacity-60" style={{left:"60%", top:"20%", animationDelay:"3s"}}>
              <div className="relative w-14 h-5">
                <div className="absolute w-9 h-5 bg-white rounded-full top-0 left-2" />
                <div className="absolute w-6 h-4 bg-white rounded-full top-1 left-0" />
              </div>
            </div>
          </>
        )}

        {/* Horizon line */}
        <div className="absolute bottom-0 left-0 right-0 h-8 bg-gradient-to-t from-rose-900/80 to-transparent" />

        <div className="absolute bottom-2 left-3 text-white/70 text-[10px] font-medium">{date}</div>
      </div>

      {/* Prayer cards */}
      <div className="bg-rose-900 px-3 py-3 sm:px-4">
        {/* Countdown */}
        {countdown && (
          <motion.div
            className="flex items-center justify-center gap-1.5 mb-2.5"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6 }}
          >
            <Clock size={11} className="text-white/50" />
            <span className="text-white/60 text-[10px]">Next: {nextPrayerName} in</span>
            <span className="text-amber-300 text-[10px] font-mono tabular-nums font-bold">{countdown}</span>
          </motion.div>
        )}

        <motion.div
          className="grid grid-cols-3 sm:grid-cols-6 gap-2"
          initial="hidden"
          animate="visible"
          variants={{ visible: { transition: { staggerChildren: 0.07 } } }}
        >
          {prayers.map((p) => {
            const isCurrent = p.name === currentPrayer;
            return (
              <motion.div
                key={p.name}
                variants={{ hidden: { opacity: 0, y: 8 }, visible: { opacity: 1, y: 0 } }}
                transition={{ duration: 0.3 }}
                className={`flex flex-col items-center rounded-xl py-2.5 px-1.5 backdrop-blur-sm transition-all ${
                  isCurrent
                    ? "bg-white/20 border border-white/30 text-white shadow-lg ring-2 ring-secondary-accent/70"
                    : "bg-white/10 border border-white/20"
                }`}
              >
                <span className={`mb-1 ${isCurrent ? "text-white" : "text-rose-200"}`}>
                  {getPrayerIcon(p.name)}
                </span>
                <span className={`text-[11px] font-semibold ${isCurrent ? "text-white" : "text-rose-100"}`}>{p.name}</span>
                <span className={`text-xs font-bold mt-0.5 tabular-nums ${isCurrent ? "text-secondary-accent" : "text-amber-300"}`}>{p.time}</span>
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </div>
  );
}
