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
    <div className="flex flex-col h-full">
      <PrayerCardInner prayers={prayers} />
      <a
        href="/prayer"
        className="mt-8 w-full py-4 font-bold text-sm rounded-2xl text-center block border-2 border-blue-100 dark:border-blue-900/50 hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-all text-blue-600 dark:text-blue-400"
      >
        <span className="lang-en">Full Prayer Calendar</span>
        <span className="lang-ar">جدول الصلاة الكامل</span>
      </a>
    </div>
  );
}
