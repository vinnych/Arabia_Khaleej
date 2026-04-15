import NavControls from "./NavControls";

const TOOLS = [
  { href: "/prayer",   icon: "mosque",         en: "Prayer Times",   ar: "مواقيت الصلاة" },
  { href: "/weather",  icon: "wb_sunny",        en: "Weather",        ar: "الطقس" },
  { href: "/currency", icon: "payments",        en: "Currency",       ar: "العملات" },
  { href: "/sky",      icon: "nights_stay",     en: "Sky View",       ar: "رؤية السماء" },
];

const GUIDES = [
  { href: "/qatar-visa-requirements", icon: "id_card",       en: "Visa Requirements",  ar: "متطلبات التأشيرة" },
  { href: "/qatar-metro",             icon: "subway",        en: "Metro",              ar: "المترو" },
  { href: "/qatar-salary-guide",      icon: "bar_chart",     en: "Salary Guide",       ar: "دليل الرواتب" },
  { href: "/qatar-public-holidays",   icon: "calendar_month",en: "Public Holidays",    ar: "الإجازات الرسمية" },
  { href: "/qatar-labour-law",        icon: "gavel",         en: "Labour Law",         ar: "قانون العمل" },
  { href: "/cost-of-living-doha",     icon: "home_work",     en: "Cost of Living",     ar: "تكلفة المعيشة" },
  { href: "/work-in-qatar",           icon: "work",          en: "Work in Qatar",      ar: "العمل في قطر" },
  { href: "/emergency-numbers-qatar", icon: "emergency",     en: "Emergency Numbers",  ar: "أرقام الطوارئ" },
];

const SERVICES = [
  { href: "/qatar-services/qid",             icon: "badge",          en: "QID Application",  ar: "طلب البطاقة" },
  { href: "/qatar-services/work-visa",        icon: "work_history",   en: "Work Visa",         ar: "تأشيرة العمل" },
  { href: "/qatar-services/family-visa",      icon: "family_restroom",en: "Family Visa",       ar: "تأشيرة العائلة" },
  { href: "/qatar-services/driving-licence",  icon: "directions_car", en: "Driving Licence",   ar: "رخصة القيادة" },
];

type NavGroup = { label: { en: string; ar: string }; items: typeof TOOLS };

const NAV_GROUPS: NavGroup[] = [
  { label: { en: "Tools",    ar: "الأدوات"   }, items: TOOLS    },
  { label: { en: "Guides",   ar: "الأدلة"    }, items: GUIDES   },
  { label: { en: "Services", ar: "الخدمات"  }, items: SERVICES },
];

export default function HomeNav() {
  return (
    <header className="bg-white/90 dark:bg-slate-900/90 backdrop-blur-md sticky top-0 z-[100] border-b border-slate-200 dark:border-slate-800 transition-colors duration-300">
      <div className="flex justify-between items-center px-4 md:px-6 lg:px-12 py-3 md:py-4 max-w-7xl mx-auto">

        {/* Logo + desktop nav */}
        <div className="flex items-center gap-6 md:gap-10">
          <a href="/" className="text-lg md:text-xl font-extrabold tracking-tight text-primary shrink-0">
            <span className="lang-en">Qatar Insider</span>
            <span className="lang-ar">قطر إنسايدر</span>
          </a>

          {/* Desktop grouped nav */}
          <nav className="hidden md:flex items-center gap-1 text-sm font-semibold text-slate-600 dark:text-slate-400" role="navigation" aria-label="Main navigation">
            {NAV_GROUPS.map((group) => (
              <div key={group.label.en} className="relative group/nav">
                {/* Trigger */}
                <button className="flex items-center gap-1 px-3 py-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-slate-100 transition-all">
                  <span className="lang-en">{group.label.en}</span>
                  <span className="lang-ar">{group.label.ar}</span>
                  <span className="material-symbols-outlined text-base opacity-50 group-hover/nav:opacity-100 group-hover/nav:rotate-180 transition-all duration-200" style={{ fontSize: "16px" }}>
                    expand_more
                  </span>
                </button>

                {/* Dropdown panel */}
                <div className="absolute top-full left-0 pt-2 opacity-0 pointer-events-none group-hover/nav:opacity-100 group-hover/nav:pointer-events-auto transition-all duration-200 translate-y-1 group-hover/nav:translate-y-0 z-50">
                  <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-2xl shadow-black/10 dark:shadow-black/40 p-3 min-w-[200px]">
                    {group.items.map((item) => (
                      <a
                        key={item.href}
                        href={item.href}
                        className="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800 hover:text-primary transition-all group/item"
                      >
                        <span
                          className="material-symbols-outlined text-slate-400 group-hover/item:text-primary transition-colors shrink-0"
                          style={{ fontSize: "18px", fontVariationSettings: "'FILL' 0, 'wght' 400" }}
                        >
                          {item.icon}
                        </span>
                        <span className="text-sm font-medium text-slate-700 dark:text-slate-300 group-hover/item:text-slate-900 dark:group-hover/item:text-slate-100 transition-colors">
                          <span className="lang-en">{item.en}</span>
                          <span className="lang-ar">{item.ar}</span>
                        </span>
                      </a>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </nav>
        </div>

        {/* Right side: CTA + controls */}
        <div className="flex items-center gap-3">
          {/* "New to Qatar?" CTA — desktop only */}
          <a
            href="/work-in-qatar"
            className="hidden md:inline-flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-xl text-xs font-black uppercase tracking-wide hover:bg-primary-dark transition-all shadow-sm hover:shadow-md"
          >
            <span className="lang-en">New to Qatar?</span>
            <span className="lang-ar">جديد في قطر؟</span>
            <span className="material-symbols-outlined" style={{ fontSize: "14px" }}>arrow_forward</span>
          </a>

          {/* Theme / lang — client island */}
          <NavControls />
        </div>
      </div>
    </header>
  );
}
