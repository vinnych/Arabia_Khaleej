export interface WeatherData {
  temperature: number;
  feelsLike: number;
  humidity: number;
  windSpeed: number;
  weatherCode: number;
  condition: string;
  icon: string;
}

export interface ForecastDay {
  date: string;
  dayLabel: string;
  maxTemp: number;
  minTemp: number;
  weatherCode: number;
  condition: string;
  icon: string;
  maxWind: number;
}

export interface FullWeather {
  current: WeatherData;
  forecast: ForecastDay[];
}

const WMO_CODES: Record<number, { condition: string; icon: string }> = {
  0: { condition: "Clear Sky", icon: "☀️" },
  1: { condition: "Mainly Clear", icon: "🌤️" },
  2: { condition: "Partly Cloudy", icon: "⛅" },
  3: { condition: "Overcast", icon: "☁️" },
  45: { condition: "Foggy", icon: "🌫️" },
  48: { condition: "Icy Fog", icon: "🌫️" },
  51: { condition: "Light Drizzle", icon: "🌦️" },
  53: { condition: "Drizzle", icon: "🌦️" },
  55: { condition: "Heavy Drizzle", icon: "🌦️" },
  61: { condition: "Light Rain", icon: "🌧️" },
  63: { condition: "Rain", icon: "🌧️" },
  65: { condition: "Heavy Rain", icon: "🌧️" },
  71: { condition: "Light Snow", icon: "❄️" },
  73: { condition: "Snow", icon: "❄️" },
  75: { condition: "Heavy Snow", icon: "❄️" },
  80: { condition: "Rain Showers", icon: "🌦️" },
  81: { condition: "Rain Showers", icon: "🌦️" },
  82: { condition: "Heavy Showers", icon: "🌦️" },
  95: { condition: "Thunderstorm", icon: "⛈️" },
  96: { condition: "Thunderstorm", icon: "⛈️" },
  99: { condition: "Thunderstorm", icon: "⛈️" },
};

export function parseWeatherCode(code: number): { condition: string; icon: string } {
  return WMO_CODES[code] ?? WMO_CODES[Math.floor(code / 10) * 10] ?? { condition: "Unknown", icon: "🌡️" };
}

const DOHA_LAT = 25.2854;
const DOHA_LON = 51.531;

export async function getDohaWeather(): Promise<WeatherData | null> {
  if (process.env.MAINTENANCE_MODE === "true") return null;
  try {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), 5000);
    const res = await fetch(
      `https://api.open-meteo.com/v1/forecast?latitude=${DOHA_LAT}&longitude=${DOHA_LON}&current=temperature_2m,apparent_temperature,relative_humidity_2m,wind_speed_10m,weather_code&timezone=Asia%2FQatar&forecast_days=1`,
      { signal: controller.signal, next: { revalidate: 1800 } }
    );
    clearTimeout(timer);
    if (!res.ok) return null;
    const data = await res.json();
    const c = data?.current;
    if (!c) return null;
    const { condition, icon } = parseWeatherCode(c.weather_code);
    return {
      temperature: Math.round(c.temperature_2m),
      feelsLike: Math.round(c.apparent_temperature),
      humidity: Math.round(c.relative_humidity_2m),
      windSpeed: Math.round(c.wind_speed_10m),
      weatherCode: c.weather_code,
      condition,
      icon,
    };
  } catch {
    return null;
  }
}

export async function getFullWeather(): Promise<FullWeather | null> {
  if (process.env.MAINTENANCE_MODE === "true") return null;
  try {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), 5000);
    const res = await fetch(
      `https://api.open-meteo.com/v1/forecast?latitude=${DOHA_LAT}&longitude=${DOHA_LON}&current=temperature_2m,apparent_temperature,relative_humidity_2m,wind_speed_10m,weather_code&daily=temperature_2m_max,temperature_2m_min,weather_code,wind_speed_10m_max&timezone=Asia%2FQatar&forecast_days=7`,
      { signal: controller.signal, next: { revalidate: 1800 } }
    );
    clearTimeout(timer);
    if (!res.ok) return null;
    const data = await res.json();
    const c = data?.current;
    const d = data?.daily;
    if (!c || !d) return null;

    const { condition, icon } = parseWeatherCode(c.weather_code);
    const current: WeatherData = {
      temperature: Math.round(c.temperature_2m),
      feelsLike: Math.round(c.apparent_temperature),
      humidity: Math.round(c.relative_humidity_2m),
      windSpeed: Math.round(c.wind_speed_10m),
      weatherCode: c.weather_code,
      condition,
      icon,
    };

    const forecast: ForecastDay[] = (d.time as string[]).map((dateStr: string, i: number) => {
      const code = d.weather_code[i];
      const wmo = parseWeatherCode(code);
      const dt = new Date(dateStr);
      const dayLabel = i === 0
        ? "Today"
        : dt.toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric" });
      return {
        date: dateStr,
        dayLabel,
        maxTemp: Math.round(d.temperature_2m_max[i]),
        minTemp: Math.round(d.temperature_2m_min[i]),
        weatherCode: code,
        condition: wmo.condition,
        icon: wmo.icon,
        maxWind: Math.round(d.wind_speed_10m_max[i]),
      };
    });

    return { current, forecast };
  } catch {
    return null;
  }
}
