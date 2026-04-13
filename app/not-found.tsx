import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Page Not Found | Qatar Portal",
  description: "The page you are looking for could not be found.",
};

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-4 bg-slate-50 dark:bg-slate-950">
      <p className="text-[120px] font-black text-blue-600/10 dark:text-blue-400/10 leading-none mb-6">404</p>
      <h1 className="text-3xl sm:text-4xl font-black tracking-tight text-slate-900 dark:text-slate-100 mb-4">
        <span className="lang-en">Page Not Found</span>
        <span className="lang-ar">الصفحة غير موجودة</span>
      </h1>
      <p className="text-sm font-medium text-slate-500 dark:text-slate-400 mb-8 max-w-sm mx-auto leading-relaxed">
        <span className="lang-en">The page you are looking for may have been removed or is no longer available.</span>
        <span className="lang-ar">ربما تمت إزالة الصفحة التي تبحث عنها أو لم تعد متاحة.</span>
      </p>
      <div className="flex flex-wrap gap-3 justify-center">
        <Link href="/" className="bg-blue-600 dark:bg-blue-500 text-white rounded-xl px-6 py-3 text-sm font-bold shadow-lg shadow-blue-500/20 hover:bg-blue-700 dark:hover:bg-blue-600 hover:-translate-y-0.5 transition-all active:scale-95">
          <span className="lang-en">Go to Home</span>
          <span className="lang-ar">الصفحة الرئيسية</span>
        </Link>
        <Link href="/news" className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl px-6 py-3 text-sm font-bold text-slate-900 dark:text-slate-100 hover:bg-slate-50 dark:hover:bg-slate-800 hover:-translate-y-0.5 transition-all shadow-sm">
          <span className="lang-en">Latest News</span>
          <span className="lang-ar">آخر الأخبار</span>
        </Link>
        <Link href="/jobs" className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl px-6 py-3 text-sm font-bold text-slate-900 dark:text-slate-100 hover:bg-slate-50 dark:hover:bg-slate-800 hover:-translate-y-0.5 transition-all shadow-sm">
          <span className="lang-en">Jobs in Qatar</span>
          <span className="lang-ar">وظائف في قطر</span>
        </Link>
      </div>
    </div>
  );
}
