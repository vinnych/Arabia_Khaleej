"use client";

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
  // Map 6am–18:30 to 5%–95% across sky
  const pct = Math.max(0, Math.min(1, (hour - 6) / 12.5));
  return 5 + pct * 90;
}

export default function SkyScene({ prayers, date, currentHour }: {
  prayers: Prayer[];
  date: string;
  currentHour: number;
}) {
  const sky = getSkyConfig(currentHour);
  const sunX = getSunX(currentHour);
  const isNight = !sky.isSun;

  // Find current prayer — Aladhan returns 24-hour format (e.g. "05:14")
  const toMin = (t: string) => {
    const clean = t.replace(/\s*\([^)]*\)/, "").trim(); // strip timezone suffix e.g. " (AST)"
    const [h, m] = clean.split(":").map(Number);
    return h * 60 + (m || 0);
  };
  // Use Doha local time (UTC+3) to match prayer times
  const dohaOffset = 3 * 60;
  const nowMin = (new Date().getUTCHours() * 60 + new Date().getUTCMinutes() + dohaOffset) % (24 * 60);
  let currentPrayer = prayers[prayers.length - 1].name;
  for (let i = 0; i < prayers.length; i++) {
    if (nowMin < toMin(prayers[i].time)) {
      currentPrayer = i === 0 ? prayers[prayers.length - 1].name : prayers[i - 1].name;
      break;
    }
  }

  return (
    <div className="rounded-2xl overflow-hidden shadow-xl">
      {/* Sky */}
      <div className={`relative bg-gradient-to-b ${sky.bg} h-40 overflow-hidden`}>

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
            {/* Soft outer glow */}
            <div className="absolute rounded-full opacity-25 blur-xl pointer-events-none"
              style={{width:80, height:80, top:"50%", left:"50%", transform:"translate(-50%,-50%)",
                background: sky.sunColor.includes("orange") ? "#fb923c" : "#fde68a"}} />
            {/* Rays — pivot at sun center (0×0 anchor), rays radiate outward */}
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
                    /* top of ray starts at gap (5px) beyond sun radius (16px) */
                    top: -(16 + 5 + len),
                    left: -w / 2,
                    opacity: op,
                    transformOrigin: `${w / 2}px ${16 + 5 + len}px`,
                    transform: `rotate(${deg}deg)`,
                  }}
                />
              ))}
            </div>
            {/* Core */}
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

        {/* Date label */}
        <div className="absolute top-3 right-4 text-white/70 text-xs font-medium bg-black/20 px-2 py-1 rounded-full">
          {date}
        </div>
        <div className="absolute bottom-3 left-4 text-white text-sm font-semibold">
          <span aria-hidden="true">🕌</span> Prayer Times — Doha
        </div>
      </div>

      {/* Prayer cards */}
      <div className="bg-rose-900 p-4">
        <div className="grid grid-cols-3 sm:grid-cols-6 gap-1.5 sm:gap-2">
          {prayers.map((p) => {
            const isCurrent = p.name === currentPrayer;
            return (
              <div key={p.name}
                className={`flex flex-col items-center rounded-xl py-2 px-1.5 sm:py-3 sm:px-2 transition-all ${
                  isCurrent
                    ? "bg-amber-400 shadow-lg scale-105 border-2 border-amber-200"
                    : "bg-rose-800 border border-rose-700"
                }`}>
                <span className="text-lg sm:text-xl mb-1">{p.icon}</span>
                <span className={`text-xs font-medium ${isCurrent ? "text-rose-900" : "text-rose-200"}`}>{p.name}</span>
                <span className={`text-sm font-bold mt-1 ${isCurrent ? "text-rose-900" : "text-amber-300"}`}>{p.time}</span>
                {isCurrent && <span className="text-[11px] sm:text-xs text-rose-800 font-semibold mt-0.5">Now</span>}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
