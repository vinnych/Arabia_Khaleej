import { HeroDatestamp, HeroClock } from "./LiveClock";

export default function HomeHero() {
  return (
    <section className="relative rounded-[2.5rem] overflow-hidden h-[320px] sm:h-[420px] md:h-[460px] flex items-center shadow-2xl shadow-blue-500/10"
      style={{ background: "linear-gradient(135deg, #003fa4 0%, #0056d2 100%)" }}
    >
      {/* Skyline overlay */}
      <img
        src="https://lh3.googleusercontent.com/aida-public/AB6AXuBoyZkxuMUYQDKIkeudGeZ_UkhD85SkfcGBgc_hHXAgIn5rnk9XuIO4Tx3vknH0pqbfxJpMU77-ZXbXiQjZRxsvfD3tnkOFkF9LDrsCbRlV7HCjRws30ckj54Rb7jNE8IsgqQWZO4yLmzu2_vHXK83FRNIbjfBTb3av3oAJYRH22bbZ8o7T7CUJFrwKUVfaNsBqEO_Ems53AYF1kVrdUessYBFP9UkbF22ggtqYxk1qriBY-9k5jbSCwNJBShzXDHkaNx0sSmLMOKE"
        alt="West Bay Doha skyline"
        className="absolute inset-0 w-full h-full object-cover mix-blend-overlay opacity-30"
      />

      <div className="relative z-10 w-full px-8 sm:px-12 md:px-20">
        {/* Badge row */}
        <div className="flex items-center gap-3 mb-6">
          <HeroDatestamp />
          <span className="flex items-center gap-1.5 bg-red-600 px-3 py-1.5 rounded-full text-white text-[10px] font-bold uppercase tracking-widest animate-pulse">
            <span className="w-1.5 h-1.5 bg-white rounded-full" />
            <span className="lang-en">Live</span>
            <span className="lang-ar">مباشر</span>
          </span>
        </div>

        {/* Title */}
        <h1 className="text-white font-black tracking-tighter mb-4 leading-[0.9]">
          <span className="text-4xl sm:text-6xl md:text-8xl block">
            <span className="lang-en">Doha, Qatar</span>
            <span className="lang-ar">الدوحة، قطر</span>
          </span>
          <span className="text-base sm:text-lg md:text-xl font-semibold tracking-normal text-blue-100/70 block mt-2">
            <span className="lang-en">Prayer Times · Jobs · News · Services</span>
            <span className="lang-ar">مواقيت الصلاة · وظائف · أخبار · خدمات</span>
          </span>
        </h1>

        {/* Clock */}
        <div className="flex items-baseline gap-4 mb-8 sm:mb-10">
          <HeroClock />
          <span className="text-blue-100/80 text-base sm:text-lg font-medium">AST (GMT+3)</span>
        </div>

        {/* CTA */}
        <a
          href="#widgets"
          className="inline-flex bg-white text-blue-600 px-8 sm:px-10 py-4 sm:py-5 rounded-2xl font-bold text-base sm:text-lg hover:bg-slate-50 transition-all active:scale-95 shadow-xl hover:shadow-2xl items-center gap-3 group"
        >
          <span className="lang-en">Explore Local Services</span>
          <span className="lang-ar">اكتشف الخدمات المحلية</span>
          <span className="material-symbols-outlined group-hover:translate-x-1 transition-transform rtl:rotate-180">arrow_forward</span>
        </a>
      </div>
    </section>
  );
}
