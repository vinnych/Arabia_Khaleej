import { getDohaWeather } from "@/lib/weather";
import { Thermometer, Wind, Droplets } from "lucide-react";

function conditionGradient(condition: string): string {
  const c = condition.toLowerCase();
  if (c.includes("thunder"))                        return "from-slate-700 to-gray-800";
  if (c.includes("rain") || c.includes("drizzle")) return "from-slate-500 to-blue-700";
  if (c.includes("fog") || c.includes("haze") || c.includes("dust") || c.includes("sand"))
                                                    return "from-amber-500 to-orange-500";
  if (c.includes("overcast") || c.includes("cloudy")) return "from-slate-400 to-slate-500";
  if (c.includes("partly"))                         return "from-sky-400 to-slate-400";
  return "from-sky-400 to-blue-500"; // clear / default
}

export default async function WeatherWidget() {
  const weather = await getDohaWeather();

  if (!weather) {
    return (
      <div className="bg-white ring-1 ring-stone-900/5 shadow-ambient rounded-xl p-4 flex items-center justify-center text-xs text-gray-400 h-full">
        Weather unavailable
      </div>
    );
  }

  const grad = conditionGradient(weather.condition);

  return (
    <div className={`bg-gradient-to-br ${grad} rounded-xl p-3 sm:p-4 text-white shadow-lg h-full`}>
      {/* Temp + icon row */}
      <div className="flex items-start justify-between mb-2">
        <div>
          <div className="text-3xl sm:text-4xl font-bold leading-none tabular-nums tracking-tight">
            {weather.temperature}°
          </div>
          <div className="text-[10px] font-semibold text-white/75 mt-0.5 uppercase tracking-widest">Doha</div>
        </div>
        <span className="text-4xl sm:text-5xl leading-none">{weather.icon}</span>
      </div>

      {/* Condition */}
      <div className="text-[11px] font-medium text-white/90 mb-3 leading-tight">{weather.condition}</div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-1 border-t border-white/20 pt-2">
        <div className="flex flex-col items-center gap-0.5">
          <Thermometer size={10} className="text-white/70" />
          <span className="text-[9px] sm:text-[10px] font-bold tabular-nums">{weather.feelsLike}°</span>
          <span className="text-[8px] text-white/55">Feels</span>
        </div>
        <div className="flex flex-col items-center gap-0.5">
          <Droplets size={10} className="text-white/70" />
          <span className="text-[9px] sm:text-[10px] font-bold tabular-nums">{weather.humidity}%</span>
          <span className="text-[8px] text-white/55">Humid</span>
        </div>
        <div className="flex flex-col items-center gap-0.5">
          <Wind size={10} className="text-white/70" />
          <span className="text-[9px] sm:text-[10px] font-bold tabular-nums">{weather.windSpeed}</span>
          <span className="text-[8px] text-white/55">Wind</span>
        </div>
      </div>
    </div>
  );
}
