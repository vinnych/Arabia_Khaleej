"use client";

import { useState, useEffect } from "react";
import { Coordinates, CalculationMethod, PrayerTimes } from "adhan";
import Link from "next/link";
import { GCC_COUNTRIES } from "@/lib/countries";
import HijriCalendar from "@/components/HijriCalendar";
import { Calendar as CalendarIcon } from "lucide-react";
import { useLanguage } from "@/lib/i18n";
import { Breadcrumbs } from "@/lib/seo";
import MobileFAB from "./MobileFAB";
import { useRouter, usePathname } from "next/navigation";
import { ChevronLeft } from "lucide-react";

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
  const router = useRouter();
  const pathname = usePathname();
  
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
      let isSubscribed = true;

      async function detectLocation() {
        try {
          const res = await fetch("/api/geolocation", {
            signal: AbortSignal.timeout(5000) // 5s timeout
          });
          
          if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
          
          const data = await res.json();
          if (isSubscribed && data.latitude && data.longitude) {
            const name = data.cityName || t('yourLocation');
            setDetectedCity(name);
            setSelectedCity({ 
              name, 
              lat: data.latitude, 
              lng: data.longitude, 
              isAuto: true 
            });
          }
        } catch (e) {
          // Only log if it's not a common network/abort error to reduce console noise
          if (isSubscribed) {
            console.warn("Prayer Times: IP geolocation unavailable (falling back to default)", e);
          }
        }
      }
      
      detectLocation();
      return () => { isSubscribed = false; };
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
        // API 1: Internal Proxy to Aladhan API (Primary)
        const res = await fetch(`/api/prayer-times?lat=${selectedCity.lat}&lng=${selectedCity.lng}&method=4`, {
          signal: AbortSignal.timeout(8000) // 8s timeout
        });
        
        if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
        
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
        console.warn("Prayer Times: Aladhan API unavailable, using local engine", e);
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

  const breadcrumbItems = [
    { name: t('home'), href: "/" },
    { name: t('prayerTimes'), href: "/prayer" }
  ];

  if (selectedCity.slug && !selectedCity.isAuto) {
    breadcrumbItems.push({ 
      name: getTranslatedCountryName(selectedCity.slug, selectedCity.country), 
      href: `/prayer/${selectedCity.slug}` 
    });
  }

  return (
    <div className={`flex flex-col items-center justify-start min-h-screen pt-24 pb-32 px-4 relative ${isRTL ? 'font-serif-ar' : ''}`}>
      {/* Mobile Back FAB - Ergonomic */}
      <MobileFAB 
        icon={ChevronLeft} 
        onClick={() => {
          if (pathname === '/prayer') {
            router.push('/');
          } else {
            router.back();
          }
        }} 
        label={t('back')}
        className={isRTL ? "[&_svg]:rotate-180" : ""}
      />
      <div className="w-full max-w-4xl mx-auto mb-8">
        <Breadcrumbs items={breadcrumbItems} isRTL={isRTL} />
      </div>
      <HijriCalendar 
        isOpen={showCalendar} 
        onClose={() => setShowCalendar(false)} 
        lat={selectedCity.lat}
        lng={selectedCity.lng}
      />

      {/* Header */}
      <div className="mb-10 animate-in fade-in slide-in-from-top-4 duration-1000 text-center">
        <h1 className="text-[10px] tracking-[0.4em] uppercase font-black text-accent/80 mb-8">{t('prayerTimes')}</h1>
        <div className="flex flex-wrap justify-center gap-2.5 max-w-2xl mx-auto px-2">
          {/* Detected City Button */}
          {detectedCity && (
            <button
              onClick={() => setSelectedCity((prev: any) => ({ ...prev, isAuto: true }))}
              className={`text-[9px] uppercase font-black tracking-[0.15em] px-5 py-2.5 rounded-full border transition-all flex items-center gap-2 ${
                selectedCity.isAuto
                  ? "bg-accent text-white border-accent shadow-lg scale-105"
                  : "bg-white/50 dark:bg-brand-obsidian/20 border-brand-gold/20 text-foreground/60 dark:text-brand-gold/70 hover:border-brand-gold hover:text-accent"
              }`}
            >
              <div className={`w-1.5 h-1.5 rounded-full ${selectedCity.isAuto ? "bg-white animate-pulse" : "bg-accent"}`} />
              {detectedCity === "Your Location" ? t('yourLocation') : detectedCity}
            </button>
          )}

          {GCC_COUNTRIES.map((country) => (
            <Link
              key={country.slug}
              href={`/prayer/${country.slug}`}
              className={`text-[9px] uppercase font-black tracking-[0.15em] px-5 py-2.5 rounded-full border transition-all ${
                selectedCity.slug === country.slug && !selectedCity.isAuto
                  ? "bg-brand-gold text-brand-obsidian border-brand-gold shadow-lg scale-105"
                  : "bg-white/50 dark:bg-brand-obsidian/20 border-brand-gold/20 text-foreground/60 dark:text-brand-gold/70 hover:border-brand-gold hover:text-accent"
              }`}
            >
              {getTranslatedCountryName(country.slug, country.name)}
            </Link>
          ))}
        </div>
      </div>

      {/* Prayer Cards Container */}
      <div className="w-full max-w-4xl glass p-6 sm:p-12 rounded-[2.5rem] border-brand-gold/15 animate-in fade-in slide-in-from-bottom-8 duration-1000 delay-200 shadow-2xl overflow-hidden">
        {!times ? (
          <div className="flex justify-center items-center py-20">
            <div className="w-8 h-8 border-2 border-brand-gold/30 border-t-brand-gold rounded-full animate-spin" />
          </div>
        ) : (
          <>
            <div className="w-full text-center mb-12 relative">
              <button 
                onClick={() => setShowCalendar(true)}
                className={`absolute -top-2 ${isRTL ? 'left-0' : 'right-0'} p-3 rounded-xl bg-brand-gold/10 text-accent hover:bg-brand-gold hover:text-brand-obsidian transition-all shadow-md group`}
                title={t('viewHijri')}
              >
                <CalendarIcon size={18} className="group-hover:rotate-12 transition-transform" />
              </button>
              <p className="text-[9px] text-accent/60 font-black uppercase tracking-[0.3em] mb-2">{t('scheduleFor')}</p>
              <h2 className="text-3xl font-black text-foreground tracking-tight">
                {selectedCity.slug ? getTranslatedCityName(selectedCity.name) : selectedCity.name} 
                <span className="text-foreground/30 font-medium ml-2">
                  {selectedCity.slug && `| ${getTranslatedCountryName(selectedCity.slug, selectedCity.country)}`}
                </span>
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
                      className={`flex flex-col items-center p-6 rounded-[2rem] border transition-all duration-500 relative overflow-hidden select-none active:scale-95 ${
                        isActive 
                        ? "bg-brand-gold text-brand-obsidian border-brand-gold shadow-[0_10px_40px_rgba(212,175,55,0.4)] scale-110 z-10" 
                        : "bg-white/5 dark:bg-brand-obsidian/40 border-brand-gold/10 hover:border-brand-gold/30 shadow-sm"
                      }`}
                    >
                      {/* Premium Glow for Active Card */}
                      {isActive && (
                        <div className="absolute inset-0 bg-gradient-to-tr from-white/20 to-transparent pointer-events-none" />
                      )}
                      
                      {isActive && (
                        <div className={`absolute top-2 ${isRTL ? 'left-3' : 'right-3'} flex items-center gap-1.5`}>
                          <div className="w-1.5 h-1.5 rounded-full bg-brand-obsidian animate-pulse" />
                        </div>
                      )}
                      
                      <span className={`text-[9px] uppercase tracking-[0.25em] font-black mb-3 ${isActive ? "text-brand-obsidian/70" : "text-brand-gold"}`}>
                        {displayName}
                      </span>
                      <span className="text-xl sm:text-2xl font-black tabular-nums tracking-tighter">
                        {time}
                      </span>
                      
                      {/* Active Label (Mobile only) */}
                      {isActive && (
                        <span className="absolute bottom-2 text-[6px] font-black uppercase tracking-widest opacity-40">Active</span>
                      )}
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



      {/* Back to Home */}
      <div className="mt-16">
        <Link href="/" className="text-[11px] font-bold uppercase tracking-[0.4em] text-accent hover:tracking-[0.6em] transition-all">
          {isRTL ? 'الرئيسية ←' : '← Home'}
        </Link>
      </div>
    </div>
  );
}

