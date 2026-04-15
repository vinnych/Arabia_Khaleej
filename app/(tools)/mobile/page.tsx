"use client";

import { Suspense } from "react";
import Image from "next/image";
import { getFullWeather } from "@/lib/weather";
import { getQARRates } from "@/lib/currency";
import { getJobs } from "@/lib/jobs";

export default async function MobileHome() {
  const [weather, currency, jobs] = await Promise.allSettled([
    getFullWeather(),
    getQARRates(),
    getJobs(5),
  ]);

  const fullWeather = weather.status === "fulfilled" ? weather.value : null;
  const weatherData = fullWeather?.current ?? null;
  const currencyData = currency.status === "fulfilled" ? currency.value : null;
  const jobsData = jobs.status === "fulfilled" ? jobs.value : [];
  const topRates = currencyData?.rates?.slice(0, 3) ?? [];

  const now = new Date();
  const hour = now.getHours();
  let greeting = "Good Evening";
  if (hour < 12) greeting = "Good Morning";
  else if (hour < 17) greeting = "Good Afternoon";

  const timeString = now.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit", hour12: false });

  return (
    <div className="min-h-screen bg-[#f9f9ff] dark:bg-[#0a0a0f] text-[#161c27] dark:text-[#ecf0ff] pb-24 transition-colors duration-300">
      <header className="fixed top-0 w-full z-50 bg-[#f9f9ff]/80 dark:bg-[#0a0a0f]/80 backdrop-blur-md flex justify-between items-center px-6 h-16 border-b border-[#c2c6d7]/10">
        <div className="flex items-center gap-3">
          <span className="material-symbols-outlined text-[#004cbc] dark:text-[#b2c5ff] active:scale-95 transition-transform cursor-pointer">grid_view</span>
          <h1 className="text-xl font-black text-[#004cbc] dark:text-[#b2c5ff] tracking-tighter">Qatar Insider</h1>
        </div>
        <div className="flex items-center gap-4">
          <button className="w-10 h-10 rounded-full bg-[#e3e8f9] dark:bg-[#dde2f3] flex items-center justify-center active:scale-95 transition-transform" onClick={() => document.documentElement.classList.toggle('dark')}>
            <span className="material-symbols-outlined text-[#424655] dark:text-[#ecf0ff] dark:hidden">dark_mode</span>
            <span className="material-symbols-outlined text-[#424655] dark:text-[#ecf0ff] hidden dark:block">light_mode</span>
          </button>
          <button className="h-10 px-3 rounded-xl bg-[#e3e8f9] dark:bg-[#dde2f3] flex items-center justify-center active:scale-95 transition-transform" onClick={() => {
            const html = document.documentElement;
            html.dir = html.dir === 'rtl' ? 'ltr' : 'rtl';
            html.lang = html.lang === 'ar' ? 'en' : 'ar';
          }}>
            <span className="text-xs font-bold text-[#424655] dark:text-[#ecf0ff] uppercase tracking-wider">
              <span className="block dark:hidden">AR</span>
              <span className="hidden dark:block">EN</span>
            </span>
          </button>
        </div>
      </header>

      <main className="mt-20 px-5 space-y-8">
        <section className="space-y-1">
          <div className="flex justify-between items-end">
            <div>
              <p className="text-[#424655] dark:text-[#c2c6d7] text-sm font-medium tracking-wide uppercase">Doha, Qatar</p>
              <h2 className="text-3xl font-extrabold tracking-tight text-[#161c27] dark:text-[#ffffff]">{greeting}</h2>
            </div>
            <div className="text-right rtl:text-left">
              <p className="text-4xl font-black tracking-tighter text-[#004cbc] dark:text-[#b2c5ff]">{timeString}</p>
              <p className="text-xs font-mono text-[#737786] dark:text-[#c2c6d7] uppercase tracking-widest">Local Time</p>
            </div>
          </div>
        </section>

        <section className="grid grid-cols-2 gap-4">
          <div className="col-span-1 bg-[#ffffff] dark:bg-[#1a1c24] p-5 rounded-[1.5rem] shadow-[0_10px_40px_rgba(22,28,39,0.05)] flex flex-col justify-between aspect-square">
            <div className="flex justify-between items-start">
              <span className="material-symbols-outlined text-[#9c2545] dark:text-[#ffb2bd] bg-[#9c2545]/10 p-2 rounded-xl">mosque</span>
              <span className="text-[10px] font-bold uppercase tracking-widest text-[#9c2545] dark:text-[#ffb2bd] bg-[#9c2545]/10 px-2 py-0.5 rounded-full">Live</span>
            </div>
            <div>
              <p className="text-xs font-bold text-[#737786] dark:text-[#c2c6d7] uppercase tracking-wider">Next Prayer</p>
              <h3 className="text-xl font-extrabold text-[#161c27] dark:text-[#ffffff]">Isha</h3>
              <div className="mt-1 flex items-center gap-1.5">
                <span className="material-symbols-outlined text-xs text-[#9c2545] dark:text-[#ffb2bd]" style={{ fontVariationSettings: "'FILL' 1" }}>timer</span>
                <p className="text-sm font-semibold text-[#424655] dark:text-[#c2c6d7]">in 42m</p>
              </div>
            </div>
          </div>

          <div className="col-span-1 bg-[#ffffff] dark:bg-[#1a1c24] p-5 rounded-[1.5rem] shadow-[0_10px_40px_rgba(22,28,39,0.05)] flex flex-col justify-between aspect-square">
            <div className="flex justify-between items-start">
              <span className="material-symbols-outlined text-[#004cbc] dark:text-[#b2c5ff] bg-[#004cbc]/10 p-2 rounded-xl">cloudy</span>
              <p className="text-xs font-bold text-[#161c27] dark:text-[#ffffff]">{weatherData?.temperature ?? 24}°C</p>
            </div>
            <div>
              <p className="text-xs font-bold text-[#737786] dark:text-[#c2c6d7] uppercase tracking-wider">Doha Sky</p>
              <h3 className="text-xl font-extrabold text-[#161c27] dark:text-[#ffffff]">{weatherData?.condition ?? "Partly Clear"}</h3>
              <p className="text-[10px] font-mono text-[#737786] dark:text-[#c2c6d7] mt-1">Humidity: {weatherData?.humidity ?? 45}%</p>
            </div>
          </div>

          <div className="col-span-2 bg-[#f1f3ff] dark:bg-[#1a1c24] p-5 rounded-[1.5rem] flex flex-col gap-4">
            <div className="flex justify-between items-center">
              <p className="text-xs font-bold text-[#737786] dark:text-[#c2c6d7] uppercase tracking-wider">Currency Rates</p>
              <span className="material-symbols-outlined text-[#737786] dark:text-[#c2c6d7] text-lg" style={{ fontVariationSettings: "'FILL' 1" }}>payments</span>
            </div>
            <div className="flex justify-between items-center overflow-x-auto gap-6">
              {topRates.map((rate) => (
                <div key={rate.code} className="flex flex-col flex-shrink-0">
                  <span className="text-[10px] font-bold text-[#424655] dark:text-[#c2c6d7] uppercase">{rate.code} / QAR</span>
                  <span className="font-mono text-lg font-bold text-[#004cbc] dark:text-[#b2c5ff]">
                    {rate.value < 1 ? rate.value.toFixed(4) : rate.value.toFixed(2)}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </section>


        <section className="space-y-4">
          <div className="flex justify-between items-end">
            <h3 className="text-xl font-black tracking-tight text-[#161c27] dark:text-[#ffffff]">Work in Qatar</h3>
            <span className="material-symbols-outlined text-[#737786] dark:text-[#c2c6d7]" style={{ fontVariationSettings: "'FILL' 1" }}>work</span>
          </div>
          <div className="space-y-3">
            {jobsData.slice(0, 3).map((job) => (
              <a key={job.link} href={`/jobs/${job.slug}`} className="bg-[#ffffff] dark:bg-[#1a1c24] p-4 rounded-2xl flex items-center gap-4 group active:scale-95 transition-transform cursor-pointer">
                <div className="w-12 h-12 bg-[#004cbc]/5 dark:bg-[#b2c5ff]/10 rounded-xl flex items-center justify-center">
                  <span className="material-symbols-outlined text-[#004cbc] dark:text-[#b2c5ff]">engineering</span>
                </div>
                <div className="flex-1">
                  <h4 className="font-bold text-[#161c27] dark:text-[#ecf0ff] text-sm">{job.title}</h4>
                  <p className="text-xs text-[#424655] dark:text-[#c2c6d7]">{job.company} • {job.location}</p>
                </div>
                <span className="material-symbols-outlined text-[#c2c6d7] group-hover:text-[#004cbc] dark:group-hover:text-[#b2c5ff] transition-colors">chevron_right</span>
              </a>
            ))}
            {jobsData.length === 0 && (
              <p className="text-sm text-[#737786]">No job listings available right now.</p>
            )}
          </div>
        </section>

        <section className="pb-10">
          <div className="bg-[#d4daea]/20 dark:bg-[#1a1c24]/50 rounded-[2rem] p-6 space-y-6">
            <div className="text-center space-y-1">
              <h3 className="text-lg font-black text-[#161c27] dark:text-[#ffffff]">Support & FAQ</h3>
              <p className="text-xs text-[#424655] dark:text-[#c2c6d7] font-medium">We're here to guide your journey.</p>
            </div>
            <div className="space-y-2">
              {["Entry Visa Requirements", "Healthcare Card Registration", "Driving License Conversion"].map((item) => (
                <div key={item} className="bg-[#ffffff] dark:bg-[#2a303d] rounded-xl p-4 flex justify-between items-center cursor-pointer">
                  <span className="text-sm font-bold text-[#161c27] dark:text-[#ecf0ff]">{item}</span>
                  <span className="material-symbols-outlined text-[#004cbc] dark:text-[#b2c5ff] text-sm" style={{ fontVariationSettings: "'FILL' 1" }}>add</span>
                </div>
              ))}
            </div>
            <button className="w-full bg-gradient-to-r from-[#004cbc] to-[#0e63eb] dark:from-[#004cbc] dark:to-[#0e63eb] text-white py-4 rounded-2xl font-bold text-sm tracking-wide shadow-lg active:scale-[0.98] transition-transform">
              Contact Digital Concierge
            </button>
          </div>
        </section>
      </main>

      <nav className="fixed bottom-0 left-0 w-full z-50 flex justify-around items-center px-4 pb-6 pt-3 bg-white dark:bg-[#12121a] shadow-[0_-10px_40px_rgba(22,28,39,0.05)] rounded-t-3xl border-t border-[#c2c6d7]/15">
        <a className="flex flex-col items-center justify-center text-[#004cbc] dark:text-[#b2c5ff] bg-[#f1f3ff] dark:bg-[#b2c5ff]/10 rounded-2xl px-3 py-1.5 duration-200 active:scale-90" href="/mobile">
          <span className="material-symbols-outlined mb-0.5" style={{ fontVariationSettings: "'FILL' 1" }}>dashboard</span>
          <span className="font-['Inter'] text-[11px] font-bold tracking-wide uppercase">Hub</span>
        </a>
        <a className="flex flex-col items-center justify-center text-slate-500 dark:text-[#c2c6d7] px-3 py-1.5 hover:text-[#0e63eb] dark:hover:text-[#b2c5ff] transition-all active:scale-90 duration-200" href="/prayer">
          <span className="material-symbols-outlined mb-0.5">mosque</span>
          <span className="font-['Inter'] text-[11px] font-medium tracking-wide uppercase">Prayer</span>
        </a>
        <a className="flex flex-col items-center justify-center text-slate-500 dark:text-[#c2c6d7] px-3 py-1.5 hover:text-[#0e63eb] dark:hover:text-[#b2c5ff] transition-all active:scale-90 duration-200" href="/weather">
          <span className="material-symbols-outlined mb-0.5">cloudy</span>
          <span className="font-['Inter'] text-[11px] font-medium tracking-wide uppercase">Weather</span>
        </a>
        <a className="flex flex-col items-center justify-center text-slate-500 dark:text-[#c2c6d7] px-3 py-1.5 hover:text-[#0e63eb] dark:hover:text-[#b2c5ff] transition-all active:scale-90 duration-200" href="/currency">
          <span className="material-symbols-outlined mb-0.5">payments</span>
          <span className="font-['Inter'] text-[11px] font-medium tracking-wide uppercase">Rates</span>
        </a>
      </nav>
    </div>
  );
}
