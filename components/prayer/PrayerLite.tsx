"use client";

import { useState, useEffect } from "react";
import { Coordinates, CalculationMethod, PrayerTimes } from "adhan";

import { useLanguage } from "@/lib/i18n";
import { getGeolocation } from "@/lib/api";

export default function PrayerLite() {
  const { t, isRTL } = useLanguage();
  const [state, setState] = useState<{
    next: { name: string; time: string } | null;
    locationName: string;
    mounted: boolean;
  }>({
    next: null,
    locationName: t('dubai'),
    mounted: false,
  });

  useEffect(() => {
    let isMounted = true;

    function calculate(lat: number, lng: number, name: string = t('yourLocation')) {
      const coords = new Coordinates(lat, lng);
      const params = CalculationMethod.UmmAlQura();
      const date = new Date();
      const prayerTimes = new PrayerTimes(coords, date, params);

      const nextPrayerName = prayerTimes.nextPrayer();
      let nextTime = "";
      let nextName = "";

      const format = (d: Date) => d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false });

      if (nextPrayerName !== "none") {
        const time = prayerTimes.timeForPrayer(nextPrayerName);
        if (time) {
          nextTime = format(time);
          nextName = nextPrayerName.charAt(0).toUpperCase() + nextPrayerName.slice(1);
        }
      } else {
        const tomorrow = new Date();
        tomorrow.setDate(tomorrow.getDate() + 1);
        const tomorrowTimes = new PrayerTimes(coords, tomorrow, params);
        nextTime = format(tomorrowTimes.fajr);
        nextName = "Fajr";
      }

      if (isMounted) {
        setState({
          next: { name: nextName, time: nextTime },
          locationName: name,
          mounted: true
        });
      }
    }

    // 1. Initial Default (Dubai)
    calculate(25.2048, 55.2708, t('dubai'));

    // 2. IP-based Geolocation (No popup)
    async function fetchIPLocation() {
      try {
        const data = await getGeolocation();
        if (data.latitude && data.longitude) {
          calculate(data.latitude, data.longitude, data.cityName || t('yourLocation'));
        }
      } catch (e) {
        console.error("IP Geolocation unavailable, staying with default");
      }
    }
    
    fetchIPLocation();

    return () => { isMounted = false; };
  }, [t]);

  if (!state.mounted || !state.next) return (
    <div className="h-9 w-40 bg-brand-gold/5 animate-pulse rounded-full border border-brand-gold/10" />
  );

  return (
    <div className={`flex flex-wrap justify-center items-center gap-3 px-6 py-2.5 rounded-full glass border-brand-gold/15 shadow-sm animate-in fade-in slide-in-from-top-2 duration-700 group hover:border-brand-gold/40 transition-all cursor-default ${isRTL ? 'flex-row-reverse font-serif-ar' : ''}`}>
      <span className="w-1.5 h-1.5 rounded-full bg-brand-gold animate-pulse shadow-[0_0_8px_rgba(212,175,55,0.4)] flex-shrink-0" />
      <span className="text-xs font-bold uppercase tracking-[0.2em] text-foreground/80">
        {state.locationName}: <span className="text-accent">{t(state.next.name.toLowerCase())}</span>
      </span>
      <span className="text-xs font-black tracking-tight text-foreground bg-brand-gold/10 px-2.5 py-0.5 rounded-md">
        {state.next.time}
      </span>
    </div>
  );
}
