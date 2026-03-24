import { getQARRates } from "@/lib/currency";

const FLAGS: Record<string, string> = {
  USD: "🇺🇸", EUR: "🇪🇺", GBP: "🇬🇧", INR: "🇮🇳",
  PKR: "🇵🇰", PHP: "🇵🇭", EGP: "🇪🇬", BDT: "🇧🇩",
};

export default async function CurrencyWidget() {
  const data = await getQARRates();

  if (!data) {
    return (
      <div className="bg-white ring-1 ring-stone-900/5 shadow-ambient rounded-xl p-4 flex items-center justify-center text-xs text-gray-400 h-full">
        Exchange rates unavailable
      </div>
    );
  }

  return (
    <div className="bg-white ring-1 ring-stone-900/5 shadow-ambient rounded-xl p-3 sm:p-4 h-full">
      <div className="flex items-center justify-between mb-2">
        <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">1 QAR =</span>
        <span className="text-[9px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-1.5 py-0.5 rounded-full tracking-wide">
          LIVE
        </span>
      </div>
      <div className="flex flex-col gap-0.5">
        {data.rates.map((rate) => (
          <div
            key={rate.code}
            className="flex items-center justify-between px-1.5 py-[3px] rounded-lg hover:bg-stone-50 transition-colors"
          >
            <div className="flex items-center gap-1.5">
              <span className="text-sm leading-none">{FLAGS[rate.code] ?? "💱"}</span>
              <span className="text-[10px] font-semibold text-gray-500">{rate.code}</span>
            </div>
            <span className="text-[11px] font-bold text-gray-900 tabular-nums">
              {rate.value < 1 ? rate.value.toFixed(4) : rate.value.toFixed(2)}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
