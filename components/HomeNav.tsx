import NavControls from "./NavControls";

const HOME_NAV = [
  { href: "/prayer", en: "Prayer", ar: "الصلاة" },
  { href: "/weather", en: "Weather", ar: "الطقس" },
  { href: "/currency", en: "Currency", ar: "العملات" },
  { href: "/news", en: "News", ar: "الأخبار" },
];

export default function HomeNav() {
  return (
    <header className="bg-white/90 dark:bg-slate-900/90 backdrop-blur-md sticky top-0 z-[100] border-b border-slate-200 dark:border-slate-800 transition-colors duration-300">
      <div className="flex justify-between items-center px-4 md:px-6 lg:px-12 py-3 md:py-4 max-w-7xl mx-auto">

        {/* Logo + desktop nav */}
        <div className="flex items-center gap-6 md:gap-10">
          <a href="/" className="text-lg md:text-xl font-extrabold tracking-tight text-blue-600 dark:text-blue-400 shrink-0">
            <span className="lang-en">Qatar Insider</span>
            <span className="lang-ar">قطر إنسايدر</span>
          </a>

          <nav className="hidden md:flex items-center gap-8 text-sm font-semibold text-slate-600 dark:text-slate-400">
            {HOME_NAV.map(({ href, en, ar }) => (
              <a
                key={href}
                href={href}
                className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
              >
                <span className="lang-en">{en}</span>
                <span className="lang-ar">{ar}</span>
              </a>
            ))}
          </nav>
        </div>

        {/* Theme / lang / search — client island */}
        <NavControls />
      </div>
    </header>
  );
}
