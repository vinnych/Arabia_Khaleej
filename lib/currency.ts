export interface CurrencyRate {
  code: string;
  flag: string;
  name: string;
  value: number;
}

export interface CurrencyData {
  date: string;
  rates: CurrencyRate[];
}

const DISPLAY_CURRENCIES: { code: string; flag: string; name: string }[] = [
  { code: "USD", flag: "🇺🇸", name: "US Dollar" },
  { code: "EUR", flag: "🇪🇺", name: "Euro" },
  { code: "GBP", flag: "🇬🇧", name: "Brit. Pound" },
  { code: "INR", flag: "🇮🇳", name: "Indian Rupee" },
  { code: "PKR", flag: "🇵🇰", name: "Pak. Rupee" },
  { code: "PHP", flag: "🇵🇭", name: "Phil. Peso" },
  { code: "EGP", flag: "🇪🇬", name: "Egyptian Pound" },
  { code: "BDT", flag: "🇧🇩", name: "Bangladeshi Taka" },
];

export async function getQARRates(): Promise<CurrencyData | null> {
  if (process.env.MAINTENANCE_MODE === "true") return null;
  try {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), 5000);
    const res = await fetch(
      "https://open.er-api.com/v6/latest/QAR",
      { signal: controller.signal, next: { revalidate: 3600 } }
    );
    clearTimeout(timer);
    if (!res.ok) return null;
    const data = await res.json();
    if (data?.result !== "success" || !data?.rates) return null;
    const rates: CurrencyRate[] = DISPLAY_CURRENCIES.map(({ code, flag, name }) => ({
      code,
      flag,
      name,
      value: data.rates[code] ?? 0,
    })).filter((r) => r.value > 0);
    return { date: data.time_last_update_utc ?? "", rates };
  } catch {
    return null;
  }
}
