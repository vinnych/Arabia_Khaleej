"use client";

import { usePrayerTimes } from "@/lib/hooks/use-prayer-times";

export default function MobileDashboardClient() {
  const { nextPrayer } = usePrayerTimes("Doha", "Qatar");

  return (
    <div className="min-h-screen bg-[#faf9f6] dark:bg-[#0a0a0f] text-slate-900 dark:text-slate-100 font-sans pb-32">
      {/* ── Concierge Header ─────────────────────────────── */}
      <header className="px-6 pt-12 pb-8 sticky top-0 bg-[#faf9f6]/80 dark:bg-[#0a0a0f]/80 backdrop-blur-xl z-40 transition-all border-b border-slate-200/50 dark:border-slate-800/50">
        <div className="flex justify-between items-center">
          <div>
            <p className="text-[10px] font-black uppercase tracking-[0.3em] text-primary mb-1">State of Qatar</p>
            <h1 className="national-title text-4xl italic leading-none">Concierge</h1>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-white dark:bg-slate-900 shadow-xl flex items-center justify-center border border-slate-100 dark:border-slate-800">
            <span className="material-symbols-outlined text-primary">person</span>
          </div>
        </div>
      </header>

      <main className="px-6 space-y-12">
        {/* ── Primary Utility Row ──────────────────────────── */}
        <section className="grid grid-cols-2 gap-4">
          <div className="bento-tile !p-6 flex flex-col justify-between min-h-[160px] bg-primary !text-white border-none shadow-primary/20">
            <div>
              <p className="text-[9px] font-black uppercase tracking-widest text-white/50 mb-1">Next Prayer</p>
              <h3 className="text-xl font-black italic">{nextPrayer?.name || "..."}</h3>
            </div>
            <div className="flex justify-between items-end">
              <span className="text-3xl font-black italic">{nextPrayer?.time || "--:--"}</span>
              <span className="material-symbols-outlined text-white/40">mosque</span>
            </div>
          </div>
          <div className="bento-tile !p-6 flex flex-col justify-between min-h-[160px] bg-slate-900 !text-white border-none shadow-2xl">
            <div>
              <p className="text-[9px] font-black uppercase tracking-widest text-white/30 mb-1">Weather</p>
              <h3 className="text-xl font-black italic">Doha City</h3>
            </div>
            <div className="flex justify-between items-end">
              <span className="text-3xl font-black italic">28°C</span>
              <span className="material-symbols-outlined text-white/30">sunny</span>
            </div>
          </div>
        </section>

        {/* ── Discovery Hub (Icon Grid) ────────────────────── */}
        <section className="space-y-4">
          <h3 className="text-sm font-black uppercase tracking-[0.2em] text-slate-400 pl-1">Essential Guides</h3>
          <div className="grid grid-cols-4 gap-4">
            {[
              { i: "flight_takeoff", l: "Visa", h: "/qatar-visa-requirements" },
              { i: "directions_subway", l: "Metro", h: "/qatar-metro" },
              { i: "payments", l: "Rates", h: "/currency" },
              { i: "emergency", l: "Help", h: "/emergency-numbers-qatar" },
              { i: "account_balance", l: "Salary", h: "/qatar-salary-guide" },
              { i: "receipt_long", l: "Costs", h: "/cost-of-living-doha" },
              { i: "apps", l: "All", h: "/qatar-services" },
            ].map((tool) => (
              <a key={tool.l} href={tool.h} className="flex flex-col items-center gap-2 group active:scale-90 transition-transform">
                <div className="w-14 h-14 rounded-2xl bg-white dark:bg-slate-900 shadow-md flex items-center justify-center border border-slate-100 dark:border-slate-800 group-hover:border-primary/30 group-hover:shadow-primary/5">
                  <span className="material-symbols-outlined text-slate-400 group-hover:text-primary transition-colors text-2xl">{tool.i}</span>
                </div>
                <span className="text-[9px] font-black uppercase tracking-widest text-slate-500">{tool.l}</span>
              </a>
            ))}
          </div>
        </section>

        {/* ── Real-time Feed ───────────────────────────────── */}
        <section className="bento-tile bg-gradient-to-br from-emerald-900 to-slate-950 !text-white border-none !p-8 relative overflow-hidden shadow-2xl">
          <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/10 rounded-full blur-3xl" />
          <div className="relative z-10">
            <p className="text-[10px] font-black uppercase tracking-[0.2em] text-emerald-400/60 mb-6">Market Update</p>
            <div className="flex justify-between items-center">
              <div>
                <h3 className="text-2xl font-black italic mb-1 tracking-tighter">QAR / USD</h3>
                <p className="text-xs font-medium text-white/40">Fixed Exchange Rate</p>
              </div>
              <span className="text-4xl font-black italic text-emerald-400">3.64</span>
            </div>
          </div>
        </section>

        {/* ── Essential Services ───────────────────────────── */}
        <section className="space-y-4">
          <h3 className="text-sm font-black uppercase tracking-[0.2em] text-slate-400">Essential Services</h3>
          <div className="grid grid-cols-1 gap-3">
            {[
              { href: "/qatar-services/qid",       icon: "badge",          en: "QID Application",  sub: "7–30 days · QAR 100" },
              { href: "/qatar-services/work-visa",  icon: "work_history",   en: "Work Visa",        sub: "14–30 days · Varies" },
            ].map((item) => (
              <a key={item.href} href={item.href} className="bento-tile !p-5 !rounded-2xl flex items-center gap-4 active:scale-[0.98] border-none shadow-md">
                <div className="w-12 h-12 bg-primary/5 rounded-xl flex items-center justify-center border border-primary/10 shrink-0">
                  <span className="material-symbols-outlined text-primary">{item.icon}</span>
                </div>
                <div className="flex-1">
                  <h4 className="font-bold text-slate-900 dark:text-slate-100 text-sm">{item.en}</h4>
                  <p className="text-xs text-slate-400">{item.sub}</p>
                </div>
                <span className="material-symbols-outlined text-slate-300">east</span>
              </a>
            ))}
          </div>
        </section>

        {/* ── Support & Help ───────────────────────────────── */}
        <section className="bento-tile bg-slate-50 dark:bg-slate-950/20 border-dashed border-slate-200 dark:border-slate-800 p-8 text-center pb-12">
            <span className="material-symbols-outlined text-primary text-4xl mb-4">help</span>
            <h3 className="text-xl font-black italic mb-2 leading-none">Digital Support</h3>
            <p className="text-xs text-slate-500 font-medium mb-8 leading-relaxed">Access direct assistance for residency, licensing, and professional onboarding.</p>
            <button className="w-full py-4 bg-primary text-white rounded-2xl font-black text-[10px] uppercase tracking-[0.2em] shadow-xl shadow-primary/20">Contact Concierge</button>
        </section>
      </main>

      {/* ── Mobile Tab Bar (Bottom) ─────────────────────────── */}
      <nav className="fixed bottom-0 w-full z-50 bg-white/90 dark:bg-slate-950/90 backdrop-blur-xl border-t border-slate-200/50 dark:border-slate-800/50 pb-safe shadow-2xl">
        <div className="flex justify-around items-center h-20">
          <a href="/" className="flex flex-col items-center gap-1 text-slate-400">
            <span className="material-symbols-outlined">home</span>
            <span className="text-[10px] font-bold">Home</span>
          </a>
          <a href="/prayer" className="flex flex-col items-center gap-1 text-slate-400">
            <span className="material-symbols-outlined">mosque</span>
            <span className="text-[10px] font-bold">Prayer</span>
          </a>
          <div className="w-16 h-16 -mt-10 rounded-full bg-primary flex items-center justify-center shadow-xl shadow-primary/30 border-4 border-[#faf9f6] dark:border-[#0a0a0f]">
            <span className="material-symbols-outlined text-white text-3xl">bolt</span>
          </div>
          <a href="/qatar-services" className="flex flex-col items-center gap-1 text-slate-400">
            <span className="material-symbols-outlined">folder_open</span>
            <span className="text-xs font-bold">Services</span>
          </a>
          <a href="/mobile" className="flex flex-col items-center gap-1 text-primary">
            <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>grid_view</span>
            <span className="text-[10px] font-bold">Hub</span>
          </a>
        </div>
      </nav>
    </div>
  );
}
