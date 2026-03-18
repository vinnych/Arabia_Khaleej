import { getDohaWeather } from "@/lib/weather";

export default async function WeatherWidget() {
  const weather = await getDohaWeather();

  if (!weather) {
    return (
      <div className="bg-white border border-stone-200 rounded-xl p-4 flex items-center justify-center text-xs text-gray-400">
        Weather unavailable
      </div>
    );
  }

  return (
    <div className="bg-white border border-stone-100 shadow-sm rounded-xl p-4 flex items-center gap-4">
      <span className="text-4xl shrink-0 leading-none">{weather.icon}</span>
      <div className="flex-1 min-w-0">
        <div className="flex items-baseline gap-2.5">
          <span className="text-3xl font-bold text-gray-900 leading-none tabular-nums">{weather.temperature}°C</span>
          <span className="text-xs text-gray-400 font-medium">{weather.condition}</span>
        </div>
        <div className="flex flex-wrap gap-x-3 gap-y-0.5 mt-2">
          <span className="text-[10px] text-gray-400">Feels <span className="text-gray-600 font-medium">{weather.feelsLike}°C</span></span>
          <span className="text-[10px] text-gray-400"><span className="text-gray-600 font-medium">{weather.humidity}%</span> humidity</span>
          <span className="text-[10px] text-gray-400"><span className="text-gray-600 font-medium">{weather.windSpeed}</span> km/h</span>
        </div>
      </div>
    </div>
  );
}
