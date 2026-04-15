import { HeroDatestamp, HeroClock } from "./LiveClock";

export default function HomeHero() {
  return (
    <section 
      className="relative rounded-[2.5rem] overflow-hidden min-h-[440px] sm:min-h-[520px] lg:min-h-[600px] flex items-center shadow-2xl shadow-primary/20 ambient-glow"
      style={{ background: "linear-gradient(135deg, #1e1b4b 0%, #8A1538 100%)" }}
    >
      {/* Decorative Blur Orbs */}
      <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-primary/20 rounded-full blur-[120px] animate-pulse" />
      <div className="absolute bottom-0 left-0 w-[300px] h-[300px] bg-indigo-500/10 rounded-full blur-[100px]" />

      <div className="relative z-10 w-full px-8 sm:px-12 md:px-20 lg:px-24 py-12">
        {/* Badge row */}
        <div className="flex items-center gap-3 mb-10 overflow-hidden">
          <HeroDatestamp />
          <div className="h-px w-8 bg-white/20 hidden sm:block" />
          <span className="flex items-center gap-1.5 bg-white/10 backdrop-blur-md border border-white/20 px-4 py-2 rounded-full text-white text-xs font-black uppercase tracking-[0.2em]">
            <span className="w-1.5 h-1.5 bg-green-400 rounded-full animate-pulse" />
            <span className="lang-en">Independent Portal</span>
            <span className="lang-ar">بوابة مستقلة</span>
          </span>
        </div>

        {/* Title */}
        <h1 className="text-white mb-8 sm:mb-10 lg:mb-12">
          <span className="national-title block text-6xl sm:text-8xl md:text-9xl lg:text-[10rem]">
            <span className="lang-en">Qatar</span>
            <span className="lang-ar">قطر</span>
          </span>
          <span className="block mt-4 text-sm sm:text-lg md:text-xl font-medium tracking-wide text-white/70 max-w-3xl leading-relaxed">
            <span className="lang-en">
              Your independent guide to Qatar — prayer times, visa requirements, labour law, metro, currency rates, and more. No fluff. No registration.
            </span>
            <span className="lang-ar">
              دليلك المستقل في قطر — أوقات الصلاة، متطلبات التأشيرة، قانون العمل، المترو، أسعار الصرف، والمزيد.
            </span>
          </span>
        </h1>

        {/* Clock Section */}
        <div className="flex flex-col sm:flex-row sm:items-center gap-6 sm:gap-10 mb-12 border-t border-white/10 pt-8 max-w-xl">
          <div className="flex items-baseline gap-4">
            <HeroClock />
            <span className="text-primary-light/60 text-xs font-black uppercase tracking-[0.3em] text-white/40">AST (GMT+3)</span>
          </div>
          <div className="hidden sm:block h-8 w-px bg-white/10" />
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-white/40 text-lg">public</span>
            <span className="text-white/60 text-xs font-bold uppercase tracking-widest">Doha, QA</span>
          </div>
        </div>

        {/* CTA + intent chips */}
        <div className="flex flex-col gap-4 pt-4">
          <div className="flex flex-wrap gap-3">
            <a
              href="/prayer"
              className="inline-flex items-center gap-2 bg-white/10 hover:bg-white hover:text-primary text-white border border-white/20 px-5 py-3 rounded-xl font-bold text-sm transition-all active:scale-95"
            >
              <span className="material-symbols-outlined text-lg" style={{ fontVariationSettings: "'FILL' 1" }}>mosque</span>
              <span className="lang-en">Prayer Times</span>
              <span className="lang-ar">مواقيت الصلاة</span>
            </a>
            <a
              href="/work-in-qatar"
              className="inline-flex items-center gap-2 bg-white text-primary px-5 py-3 rounded-xl font-black text-sm shadow-xl hover:shadow-[0_20px_40px_rgba(0,0,0,0.3)] hover:bg-slate-50 transition-all active:scale-95"
            >
              <span className="material-symbols-outlined text-lg">work</span>
              <span className="lang-en">Moving to Qatar?</span>
              <span className="lang-ar">الانتقال إلى قطر؟</span>
            </a>
            <a
              href="/currency"
              className="inline-flex items-center gap-2 bg-white/10 hover:bg-white hover:text-primary text-white border border-white/20 px-5 py-3 rounded-xl font-bold text-sm transition-all active:scale-95"
            >
              <span className="material-symbols-outlined text-lg">payments</span>
              <span className="lang-en">Today&apos;s Rates</span>
              <span className="lang-ar">أسعار اليوم</span>
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
