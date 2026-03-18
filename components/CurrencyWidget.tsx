import { getQARRates } from "@/lib/currency";

export default async function CurrencyWidget() {
  const data = await getQARRates();

  if (!data) {
    return (
      <div className="bg-white border border-stone-200 rounded-xl p-4 flex items-center justify-center text-xs text-gray-400">
        Exchange rates unavailable
      </div>
    );
  }

  return (
    <div className="bg-white border border-stone-100 shadow-sm rounded-xl p-4">
      <div className="flex items-center justify-between mb-3">
        <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">1 QAR equals</span>
        <span className="text-sm">🇶🇦</span>
      </div>
      <div className="grid grid-cols-2 gap-1">
        {data.rates.map((rate) => (
          <div
            key={rate.code}
            className="flex items-center justify-between px-2.5 py-2 rounded-lg hover:bg-stone-50 transition-colors"
          >
            <span className="flex items-center gap-1.5 text-xs text-gray-500">
              <span className="text-sm leading-none">{rate.flag}</span>
              <span className="font-semibold text-gray-700">{rate.code}</span>
            </span>
            <span className="text-xs font-bold text-gray-900 tabular-nums">
              {rate.value < 1 ? rate.value.toFixed(4) : rate.value.toFixed(2)}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
