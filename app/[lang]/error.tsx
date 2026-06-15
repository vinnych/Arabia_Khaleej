'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { getLocalizedHref } from '@/lib/i18n/i18n';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  const pathname = usePathname();
  // Why: Since error is rendering on any path, we extract the lang prefix from current pathname (e.g. /ar/... -> ar)
  const lang = pathname?.startsWith('/ar') ? 'ar' : 'en';

  useEffect(() => {
    // Log the error to an error reporting service
    console.error(error);
  }, [error]);

  return (
    <div className="min-h-[80vh] flex flex-col items-center justify-center px-4 text-center">
      <div className="glass p-10 md:p-16 rounded-[3rem] border-brand-gold/20 shadow-2xl max-w-2xl w-full relative overflow-hidden">
        {/* Background Blur */}
        <div className="absolute top-[-20%] right-[-10%] w-[50%] h-[50%] bg-red-900/10 blur-[80px] rounded-full pointer-events-none"></div>

        <h2 className="text-3xl md:text-5xl font-display font-bold text-foreground mb-4">
          {lang === 'ar' ? 'عطل غير متوقع' : 'Unexpected Disturbance'}
        </h2>
        <p className="text-muted-foreground/80 mb-10 max-w-md mx-auto">
          {lang === 'ar' 
            ? 'واجهنا مشكلة أثناء جلب المعلومات الإقليمية. لقد سجلت أنظمتنا هذا الحدث.' 
            : 'We encountered an anomaly while fetching regional intelligence. Our systems have logged this event.'}
        </p>
        
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 flex-wrap">
          <button
            onClick={() => reset()}
            className="gold-liquid px-8 py-3 rounded-full font-bold text-sm tracking-widest uppercase w-full sm:w-auto"
          >
            {lang === 'ar' ? 'محاولة الاستعادة' : 'Attempt Recovery'}
          </button>
          <button
            onClick={() => {
              fetch('/api/admin/clear-cache?secret=sherly')
                .then(() => window.location.reload())
                .catch(console.error);
            }}
            className="glass px-8 py-3 rounded-full font-bold text-sm tracking-widest uppercase text-red-400 hover:bg-red-900/20 border-red-900/50 transition-colors w-full sm:w-auto"
            title={lang === 'ar' ? 'مسح ذاكرة التخزين المؤقت للخادم' : 'Purge Next.js Server Cache'}
          >
            {lang === 'ar' ? 'مسح الذاكرة المؤقتة' : 'Purge Cache'}
          </button>
          <Link
            href={getLocalizedHref("/", lang)}
            className="glass px-8 py-3 rounded-full font-bold text-sm tracking-widest uppercase text-foreground hover:bg-white/5 transition-colors w-full sm:w-auto"
          >
            {lang === 'ar' ? 'العودة للرئيسية' : 'Return to Base'}
          </Link>
        </div>
      </div>
    </div>
  );
}
