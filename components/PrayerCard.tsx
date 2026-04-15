import { getPrayerTimes } from "@/lib/prayer";
import PrayerCardInner from "./PrayerCardInner";

export default async function PrayerCard() {
  let times;
  try {
    times = await getPrayerTimes();
  } catch {
    return (
      <div className="flex items-center justify-center h-full text-sm py-12 text-slate-400">
        Prayer times unavailable
      </div>
    );
  }

  const prayers = (["Fajr", "Sunrise", "Dhuhr", "Asr", "Maghrib", "Isha"] as const).map(
    (name) => ({ name, time: times[name] })
  );

  return (
    <div className="flex flex-col h-full p-6 sm:p-8">
      <PrayerCardInner prayers={prayers} />
      <a
        href="/prayer"
        className="mt-auto pt-6 w-full py-4 font-black text-xs uppercase tracking-widest rounded-2xl text-center block border-2 border-primary/20 hover:bg-primary hover:text-white hover:border-primary text-primary transition-all duration-300"
      >
        <span className="lang-en">Full Prayer Calendar →</span>
        <span className="lang-ar">جدول الصلاة الكامل →</span>
      </a>
    </div>
  );
}
