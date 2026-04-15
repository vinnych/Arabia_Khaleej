import { HeroDatestamp, HeroClock } from "./LiveClock";

export default function HomeHero() {
  return (
    <section className="relative rounded-[2.5rem] overflow-hidden h-[360px] sm:h-[480px] md:h-[520px] flex items-center shadow-2xl shadow-primary/20"
      style={{ background: "linear-gradient(135deg, #1e1b4b 0%, #8A1538 100%)" }}
    >
      {/* Decorative Blur Orbs */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-primary/20 rounded-full blur-[100px] animate-pulse" />
      <div className="absolute bottom-0 left-0 w-64 h-64 bg-indigo-500/10 rounded-full blur-[100px]" />

      <div className="relative z-10 w-full px-8 sm:px-12 md:px-20">
        {/* Badge row */}
        <div className="flex items-center gap-3 mb-8">
          <HeroDatestamp />
          <span className="flex items-center gap-1.5 bg-white/10 backdrop-blur-md border border-white/20 px-3 py-1.5 rounded-full text-white text-[10px] font-black uppercase tracking-widest">
            <span className="w-1.5 h-1.5 bg-green-400 rounded-full animate-pulse" />
            <span className="lang-en">Network Active</span>
            <span className="lang-ar">الشبكة نشطة</span>
          </span>
        </div>

        {/* Title */}
        <h1 className="text-white font-black tracking-tighter mb-6 leading-[0.85]">
          <span className="text-5xl sm:text-7xl md:text-9xl block">
            <span className="lang-en">Doha, Qatar</span>
            <span className="lang-ar">الدوحة، قطر</span>
          </span>
          <span className="text-lg sm:text-xl md:text-2xl font-medium tracking-normal text-white/60 block mt-6 max-w-2xl leading-relaxed">
            <span className="lang-en">Your intelligent gateway to Qatar's essential services, live news, and career opportunities.</span>
            <span className="lang-ar">بوابتك الذكية لخدمات قطر الأساسية، الأخبار المباشرة، وفرص العمل.</span>
          </span>
        </h1>

        {/* Clock */}
        <div className="flex items-baseline gap-4 mb-10">
          <HeroClock />
          <span className="text-white/40 text-sm sm:text-base font-bold uppercase tracking-widest">AST (GMT+3)</span>
        </div>

        {/* CTA */}
        <div className="flex flex-wrap gap-4">
          <a
            href="#widgets"
            className="inline-flex bg-white text-primary px-8 sm:px-10 py-4 sm:py-5 rounded-2xl font-black text-sm sm:text-base hover:bg-slate-50 transition-all active:scale-95 shadow-xl hover:shadow-2xl items-center gap-3 group"
          >
            <span className="lang-en">Explore Portal</span>
            <span className="lang-ar">استكشاف البوابة</span>
            <span className="material-symbols-outlined group-hover:translate-x-1 transition-transform rtl:rotate-180">arrow_forward</span>
          </a>
        </div>
      </div>
    </section>
  );
}
