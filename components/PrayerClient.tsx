"use client";

import { useState, useEffect } from "react";
import { Coordinates, CalculationMethod, PrayerTimes } from "adhan";
import FinanceTicker from "@/components/FinanceTicker";
import Link from "next/link";
import { GCC_COUNTRIES } from "@/lib/countries";
import HijriCalendar from "@/components/HijriCalendar";
import { Calendar as CalendarIcon } from "lucide-react";
import { useLanguage } from "@/lib/i18n";

interface PrayerClientProps {
  initialCity?: {
    name: string;
    country?: string;
    lat: number;
    lng: number;
    slug?: string;
  };
}

export default function PrayerClient({ initialCity }: PrayerClientProps) {
  const { t, isRTL, language } = useLanguage();
  
  const [selectedCity, setSelectedCity] = useState<any>(initialCity || {
    name: GCC_COUNTRIES[0].capital,
    country: GCC_COUNTRIES[0].name,
    lat: GCC_COUNTRIES[0].lat,
    lng: GCC_COUNTRIES[0].lng,
    slug: GCC_COUNTRIES[0].slug
  });
  const [times, setTimes] = useState<any>(null);
  const [activePrayer, setActivePrayer] = useState<string | null>(null);
  const [mounted, setMounted] = useState(false);
  const [detectedCity, setDetectedCity] = useState<string | null>(null);
  const [showCalendar, setShowCalendar] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    // IP-based Geolocation only if no initialCity was provided
    if (mounted && !initialCity) {
      async function detectLocation() {
        try {
          const res = await fetch("https://freeipapi.com/api/json");
          const data = await res.json();
          if (data.latitude && data.longitude) {
            const name = data.cityName || t('yourLocation');
            setDetectedCity(name);
            setSelectedCity({ name, lat: data.latitude, lng: data.longitude, isAuto: true });
          }
        } catch (e) {
          console.log("IP detection failed");
        }
      }
      detectLocation();
    }
  }, [mounted, initialCity, t]);

  useEffect(() => {
    if (!mounted) return;
    
    const format = (d: Date) => d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false });

    async function getPrayerTimes() {
      // Local calculation for upcoming highlight
      const coords = new Coordinates(selectedCity.lat, selectedCity.lng);
      const params = CalculationMethod.UmmAlQura();
      const date = new Date();
      const prayerTimes = new PrayerTimes(coords, date, params);
      
      const next = prayerTimes.nextPrayer();
      // If next is 'none', it's likely after Isha, so next is Fajr
      setActivePrayer(next === "none" ? "Fajr" : next.charAt(0).toUpperCase() + next.slice(1));

      try {
        // API 1: Aladhan API (Primary)
        const res = await fetch(`https://api.aladhan.com/v1/timings?latitude=${selectedCity.lat}&longitude=${selectedCity.lng}&method=4`);
        const data = await res.json();
        
        if (data && data.code === 200) {
          const t = data.data.timings;
          setTimes({
            Fajr: t.Fajr,
            Sunrise: t.Sunrise,
            Dhuhr: t.Dhuhr,
            Asr: t.Asr,
            Maghrib: t.Maghrib,
            Isha: t.Isha,
            source: "Cloud"
          });
          return;
        }
      } catch (e) {
        console.log("Primary API failed, falling back to local engine");
      }

      // API 2: Adhan Local Engine (Failover)
      setTimes({
        Fajr: format(prayerTimes.fajr),
        Sunrise: format(prayerTimes.sunrise),
        Dhuhr: format(prayerTimes.dhuhr),
        Asr: format(prayerTimes.asr),
        Maghrib: format(prayerTimes.maghrib),
        Isha: format(prayerTimes.isha),
        source: "Local"
      });
    }

    getPrayerTimes();
    const interval = setInterval(getPrayerTimes, 60000); // Refresh every minute
    return () => clearInterval(interval);
  }, [selectedCity, mounted]);

  if (!mounted) return null;

  // Helper to get translated names
  const getTranslatedCountryName = (slug: string, fallback: string) => {
    const key = slug === "saudi-arabia" ? "saudiArabia" : slug;
    const translated = t(key);
    return translated !== key ? translated : fallback;
  };

  const getTranslatedCityName = (capital: string) => {
    const key = capital.toLowerCase().replace(' ', '');
    const translated = t(key);
    return translated !== key ? translated : capital;
  };

  return (
    <div className={`flex flex-col items-center justify-start min-h-screen pt-20 pb-20 px-4 relative ${isRTL ? 'font-serif-ar' : ''}`}>
      <HijriCalendar 
        isOpen={showCalendar} 
        onClose={() => setShowCalendar(false)} 
        lat={selectedCity.lat}
        lng={selectedCity.lng}
      />

      {/* Header */}
      <div className="mb-12 animate-in fade-in slide-in-from-top-4 duration-1000">
        <h1 className="text-xs tracking-[0.6em] uppercase font-bold text-accent mb-6 text-center">{t('prayerTimes')}</h1>
        <div className="flex flex-wrap justify-center gap-3 max-w-2xl mx-auto">
          {/* Detected City Button (if found) */}
          {detectedCity && (
            <button
              onClick={() => {
                setSelectedCity((prev: any) => ({ ...prev, isAuto: true }));
              }}
              className={`text-[10px] uppercase font-bold tracking-[0.2em] px-5 py-2.5 rounded-full border transition-all flex items-center gap-2 ${
                selectedCity.isAuto
                  ? "bg-accent text-white border-accent shadow-xl scale-105"
                  : "bg-white/50 dark:bg-brand-obsidian/20 border-brand-gold/30 text-foreground/70 dark:text-brand-gold hover:border-brand-gold hover:text-accent"
              }`}
            >
              <span className={`w-1.5 h-1.5 rounded-full ${selectedCity.isAuto ? "bg-white animate-pulse" : "bg-accent"}`} />
              {detectedCity === "Your Location" ? t('yourLocation') : detectedCity}
            </button>
          )}

          {GCC_COUNTRIES.map((country) => (
            <Link
              key={country.slug}
              href={`/prayer/${country.slug}`}
              className={`text-[10px] uppercase font-bold tracking-[0.2em] px-5 py-2.5 rounded-full border transition-all ${
                selectedCity.slug === country.slug && !selectedCity.isAuto
                  ? "bg-brand-gold text-brand-obsidian border-brand-gold shadow-xl scale-105"
                  : "bg-white/50 dark:bg-brand-obsidian/20 border-brand-gold/30 text-foreground/70 dark:text-brand-gold hover:border-brand-gold hover:text-accent"
              }`}
            >
              {getTranslatedCountryName(country.slug, country.name)}
            </Link>
          ))}
        </div>
      </div>

      {/* Prayer Cards Container */}
      <div className="w-full max-w-4xl glass p-8 sm:p-12 rounded-[3rem] border-brand-gold/20 animate-in fade-in slide-in-from-bottom-8 duration-1000 delay-200 shadow-2xl">
        {!times ? (
          <div className="flex justify-center items-center py-20">
            <div className="w-8 h-8 border-2 border-brand-gold/30 border-t-brand-gold rounded-full animate-spin" />
          </div>
        ) : (
          <>
            <div className="w-full text-center mb-10 relative">
              <button 
                onClick={() => setShowCalendar(true)}
                className={`absolute top-0 ${isRTL ? 'left-0' : 'right-0'} p-4 rounded-2xl bg-brand-gold/10 text-accent hover:bg-brand-gold hover:text-brand-obsidian transition-all shadow-lg hover:rotate-12`}
                title={t('viewHijri')}
              >
                <CalendarIcon size={20} />
              </button>
              <p className="text-[10px] text-accent font-bold uppercase tracking-[0.4em] mb-1">{t('scheduleFor')}</p>
              <h2 className="text-2xl font-black serif text-foreground">
                {selectedCity.slug ? getTranslatedCityName(selectedCity.name) : selectedCity.name} 
                {selectedCity.slug && ` — ${getTranslatedCountryName(selectedCity.slug, selectedCity.country)}`}
              </h2>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-4 sm:gap-6">
              {Object.entries(times)
                .filter(([key]) => key !== "source")
                .map(([name, time]: [string, any]) => {
                  const isActive = activePrayer === name;
                  const displayName = t(name.toLowerCase());
                  return (
                    <div 
                      key={name} 
                      className={`flex flex-col items-center p-5 rounded-3xl border transition-all relative overflow-hidden ${
                        isActive 
                        ? "bg-brand-gold text-brand-obsidian border-brand-gold shadow-xl scale-110 z-10" 
                        : "bg-white/60 dark:bg-brand-obsidian/20 border-brand-gold/10 hover:border-brand-gold/30 shadow-sm"
                      }`}
                    >
                      {isActive && (
                        <div className={`absolute top-2 ${isRTL ? 'left-2' : 'right-2'} flex items-center gap-1.5`}>
                          <span className="text-[7px] font-black uppercase tracking-tighter opacity-40">{t('upcoming')}</span>
                          <div className="w-1.5 h-1.5 rounded-full bg-brand-obsidian animate-pulse" />
                        </div>
                      )}
                      <span className={`text-[10px] uppercase tracking-[0.3em] font-bold mb-3 ${isActive ? "text-brand-obsidian/60" : "text-accent"}`}>{displayName}</span>
                      <span className="text-xl sm:text-2xl font-black tabular-nums">{time}</span>
                    </div>
                  );
                })}
            </div>
          </>
        )}

        <div className="mt-12 text-center">
          <p className="text-[11px] text-foreground/70 font-bold uppercase tracking-[0.4em]">
            {t('calculationMethod')}
          </p>
        </div>
      </div>

      {/* Finance Ticker */}
      <div className="mt-12 w-full">
        <FinanceTicker />
      </div>

      {/* Back to Home */}
      <div className="mt-16">
        <Link href="/" className="text-[11px] font-bold uppercase tracking-[0.4em] text-accent hover:tracking-[0.6em] transition-all">
          {isRTL ? 'الرئيسية ←' : '← Home'}
        </Link>
      </div>
    </div>
  );
}

