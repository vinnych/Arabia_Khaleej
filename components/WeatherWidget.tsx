import { getDohaWeather } from "@/lib/weather";
import { Thermometer, Wind, Droplets } from "lucide-react";

export default async function WeatherWidget() {
  const weather = await getDohaWeather();

  if (!weather) {
    return (
      <div className="bg-white ring-1 ring-stone-900/5 shadow-ambient rounded-xl p-4 flex items-center justify-center text-xs text-gray-400">
        Weather unavailable
      </div>
    );
  }

  return (
    <div className="bg-white ring-1 ring-stone-900/5 shadow-ambient rounded-xl p-4 flex items-center gap-4">
      <span className="text-4xl shrink-0 leading-none">{weather.icon}</span>
      <div className="flex-1 min-w-0">
        <div className="flex items-baseline gap-2.5">
          <span className="text-3xl font-bold text-gray-900 leading-none tabular-nums">{weather.temperature}°C</span>
          <span className="text-xs text-gray-400 font-medium">{weather.condition}</span>
        </div>
        <div className="flex flex-wrap gap-x-3 gap-y-0.5 mt-2">
          <span className="text-[10px] text-gray-400 flex items-center gap-0.5"><Thermometer size={10} /><span className="text-gray-600 font-medium">{weather.feelsLike}°C</span> feels like</span>
          <span className="text-[10px] text-gray-400 flex items-center gap-0.5"><Droplets size={10} /><span className="text-gray-600 font-medium">{weather.humidity}%</span></span>
          <span className="text-[10px] text-gray-400 flex items-center gap-0.5"><Wind size={10} /><span className="text-gray-600 font-medium">{weather.windSpeed}</span> km/h</span>
        </div>
      </div>
    </div>
  );
}
