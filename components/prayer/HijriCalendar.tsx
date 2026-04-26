"use client";

import { useEffect, useState } from "react";
import { X, Calendar as CalendarIcon, Clock } from "lucide-react";
import { Coordinates, CalculationMethod, PrayerTimes } from "adhan";

interface HijriDate {
  gregorian: string;
  hijri: string;
  day: string;
  timings: {
    Fajr: string;
    Dhuhr: string;
    Asr: string;
    Maghrib: string;
    Isha: string;
  };
}

// Robust local Hijri conversion algorithm (Kuwaiti/Civil)
function getLocalHijriDate(date: Date): string {
  const m = date.getMonth() + 1;
  const y = date.getFullYear();
  const d = date.getDate();

  const jd = Math.floor(367 * y - Math.floor((7 * (y + 5001 + Math.floor((m - 9) / 7))) / 4) + Math.floor((275 * m) / 9) + d + 1729777);
  let l = jd - 1948440 + 10632;
  const n = Math.floor((l - 1) / 10631);
  l = l - 10631 * n + 354;
  const j = (Math.floor((10985 - l) / 5316)) * (Math.floor((50 * l) / 17719)) + (Math.floor(l / 5670)) * (Math.floor((43 * l) / 15238));
  l = l - (Math.floor((30 - j) / 15)) * (Math.floor((17719 * j) / 50)) - (Math.floor(j / 16)) * (Math.floor((15238 * j) / 43)) + 29;
  const hm = Math.floor((24 * l) / 709);
  const hd = l - Math.floor((709 * hm) / 24);
  const hy = 30 * n + j - 30;

  const months = ["Muharram", "Safar", "Rabi' al-Awwal", "Rabi' al-Thani", "Jumada al-Ula", "Jumada al-Akhira", "Rajab", "Sha'ban", "Ramadan", "Shawwal", "Dhu al-Qi'dah", "Dhu al-Hijjah"];
  return `${hd} ${months[hm - 1]} ${hy}`;
}

export default function HijriCalendar({ 
  isOpen, 
  onClose,
  lat,
  lng
}: { 
  isOpen: boolean; 
  onClose: () => void;
  lat: number;
  lng: number;
}) {
  const [calendar, setCalendar] = useState<HijriDate[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!isOpen) return;

    async function fetchHijriDates() {
      setLoading(true);
      const gregFormatter = new Intl.DateTimeFormat("en-US", { day: "numeric", month: "short" });
      const dayFormatter = new Intl.DateTimeFormat("en-US", { weekday: "long" });
      const timeFormatter = (d: Date) => d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false });

      const coords = new Coordinates(lat, lng);
      const params = CalculationMethod.UmmAlQura();
      
      let finalDates: HijriDate[] = [];

      try {
        const month = new Date().getMonth() + 1;
        const year = new Date().getFullYear();
        const res = await fetch(`https://api.aladhan.com/v1/gToHCalendar/${month}/${year}`);
        const data = await res.json();
        
        for (let i = 0; i < 7; i++) {
          const date = new Date();
          date.setDate(date.getDate() + i);
          
          const prayerTimes = new PrayerTimes(coords, date, params);
          const timings = {
            Fajr: timeFormatter(prayerTimes.fajr),
            Dhuhr: timeFormatter(prayerTimes.dhuhr),
            Asr: timeFormatter(prayerTimes.asr),
            Maghrib: timeFormatter(prayerTimes.maghrib),
            Isha: timeFormatter(prayerTimes.isha),
          };

          let hijri = "";
          if (data && data.code === 200) {
            const dayData = data.data.find((d: any) => parseInt(d.gregorian.day) === date.getDate());
            hijri = dayData ? `${dayData.hijri.day} ${dayData.hijri.month.en} ${dayData.hijri.year}` : getLocalHijriDate(date);
          } else {
            hijri = getLocalHijriDate(date);
          }

          finalDates.push({
            day: dayFormatter.format(date),
            gregorian: gregFormatter.format(date),
            hijri,
            timings
          });
        }
      } catch (e) {
        console.warn("Hijri API failed, using local calculation");
        finalDates = []; // Reset and use fallback for all 7 days
        for (let i = 0; i < 7; i++) {
          const date = new Date();
          date.setDate(date.getDate() + i);
          const prayerTimes = new PrayerTimes(coords, date, params);
          finalDates.push({
            day: dayFormatter.format(date),
            gregorian: gregFormatter.format(date),
            hijri: getLocalHijriDate(date),
            timings: {
              Fajr: timeFormatter(prayerTimes.fajr),
              Dhuhr: timeFormatter(prayerTimes.dhuhr),
              Asr: timeFormatter(prayerTimes.asr),
              Maghrib: timeFormatter(prayerTimes.maghrib),
              Isha: timeFormatter(prayerTimes.isha),
            }
          });
        }
      }
      setCalendar(finalDates);
      setLoading(false);
    }

    fetchHijriDates();
  }, [isOpen, lat, lng]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-300">
      <div className="relative w-full max-w-2xl glass p-6 sm:p-10 rounded-[3rem] border-brand-gold/30 shadow-2xl animate-in zoom-in duration-500 overflow-hidden flex flex-col max-h-[90vh]">
        <button 
          onClick={onClose}
          className="absolute top-6 right-6 p-2 rounded-full bg-white/10 hover:bg-white/20 text-accent transition-all hover:rotate-90 z-10"
        >
          <X size={20} />
        </button>

        <div className="flex items-center gap-3 mb-8">
          <div className="p-3 rounded-2xl bg-brand-gold/10 text-accent">
            <CalendarIcon size={24} />
          </div>
          <div>
            <h3 className="text-[11px] font-black uppercase tracking-[0.4em] text-accent mb-1">Calendar</h3>
            <p className="text-xl font-black serif text-foreground">7-Day Hijri & Prayer Schedule</p>
          </div>
        </div>

        <div className="space-y-4 overflow-y-auto pr-2 custom-scrollbar">
          {calendar.map((date, idx) => (
            <div 
              key={idx} 
              className={`flex flex-col p-5 rounded-3xl border transition-all ${
                idx === 0 
                ? "bg-brand-gold/10 border-brand-gold/30 shadow-lg" 
                : "bg-white/5 dark:bg-brand-obsidian/20 border-brand-gold/10"
              }`}
            >
              <div className="flex items-center justify-between mb-4">
                <div className="flex flex-col">
                  <span className={`text-[10px] font-black uppercase tracking-widest ${idx === 0 ? "text-accent" : "text-foreground/40"}`}>
                    {date.day} {idx === 0 && "(Today)"}
                  </span>
                  <span className="text-xs font-bold text-foreground/60">{date.gregorian}</span>
                </div>
                <div className="text-right">
                  <p className="text-lg font-black serif text-brand-gold">{date.hijri}</p>
                </div>
              </div>

              <div className="grid grid-cols-5 gap-2 pt-3 border-t border-brand-gold/10">
                {date.timings && Object.entries(date.timings).map(([name, time]) => (
                  <div key={name} className="flex flex-col items-center">
                    <span className="text-[8px] uppercase font-bold text-accent/60 tracking-tighter mb-1">{name}</span>
                    <span className="text-[11px] font-black tabular-nums text-foreground/80">{time}</span>
                  </div>
                ))}
              </div>
            </div>
          ))}
          {loading && calendar.length === 0 && (
             <div className="flex justify-center py-10">
               <div className="w-8 h-8 border-2 border-brand-gold/30 border-t-brand-gold rounded-full animate-spin" />
             </div>
          )}
        </div>

        <div className="mt-8 pt-6 border-t border-brand-gold/10 flex items-center justify-between text-[10px] text-foreground/30 font-bold uppercase tracking-[0.2em]">
          <div className="flex items-center gap-2">
            <Clock size={12} />
            <span>Umm Al-Qura Unified</span>
          </div>
          <span>ARABIA KHALEEJ PORTAL</span>
        </div>
      </div>
    </div>
  );
}
