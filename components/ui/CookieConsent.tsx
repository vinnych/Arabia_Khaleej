"use client";

import { useState, useEffect } from "react";
import { useLanguage } from "@/lib/i18n";
import { X, ShieldCheck } from "lucide-react";
// Next.js Link component is imported to allow client-side client-side navigation
// which is significantly faster and smoother than full-page reloads using native <a> tags.
import Link from "next/link";

export default function CookieConsent() {
  const [show, setShow] = useState(false);
  const { isRTL, language } = useLanguage();

  useEffect(() => {
    try {
      const consent = localStorage.getItem("ak_cookie_consent");
      if (!consent) {
        const timer = setTimeout(() => setShow(true), 2000);
        return () => clearTimeout(timer);
      }
    } catch (e) {
      console.warn("localStorage access denied for cookies");
    }
  }, []);

  const accept = () => {
    try {
      localStorage.setItem("ak_cookie_consent", "true");
    } catch (e) {
      // Ignore
    }
    setShow(false);
  };

  if (!show) return null;

  return (
    <div className="fixed bottom-6 left-6 right-6 md:left-auto md:right-8 md:w-[320px] z-[150] animate-in slide-in-from-bottom-8 duration-700">
      <div className="glass rounded-3xl p-5 border-brand-gold/20 shadow-2xl relative overflow-hidden">
        <div className="absolute -top-4 -right-4 p-4 opacity-[0.03] pointer-events-none rotate-12">
          <ShieldCheck size={100} />
        </div>
        
        <div className={`flex items-start gap-4 mb-5 ${isRTL ? 'flex-row-reverse text-right' : ''}`}>
          <div className="w-8 h-8 rounded-lg bg-brand-gold/10 flex items-center justify-center text-accent shrink-0">
            <ShieldCheck size={16} />
          </div>
          <div>
            <h3 className="text-[12px] font-black uppercase tracking-widest mb-1">
              {language === 'ar' ? 'الخصوصية' : 'Privacy'}
            </h3>
            <p className="text-[10px] font-medium text-foreground/50 leading-tight">
              {language === 'ar' 
                ? 'نستخدم ملفات تعريف الارتباط لضمان أمن البيانات وتحليل الزيارات.' 
                : 'We use cookies for data security, analytics, and targeted insights.'}
              {/* 
                We use the Next.js <Link> component instead of a standard HTML <a> tag.
                - Performance: It pre-fetches the page's code in the background for instant navigation.
                - UX: It updates the URL and switches components dynamically without a full document load.
                - Compatibility: Resolves the Next.js/ESLint "no-html-link-for-pages" warning that prevents builds.
              */}
              <Link href={`/${language}/privacy`} className="ml-1 text-brand-gold hover:underline">
                {language === 'ar' ? 'اعرف أكثر' : 'Learn more'}
              </Link>

            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button 
            onClick={accept}
            className="flex-1 py-2.5 rounded-xl bg-brand-gold text-brand-obsidian text-[9px] font-black uppercase tracking-widest hover:brightness-110 active:scale-95 transition-all shadow-md"
          >
            {language === 'ar' ? 'موافق' : 'Accept'}
          </button>
          <button 
            onClick={() => setShow(false)}
            className="p-2.5 rounded-xl glass border-brand-gold/10 text-foreground/40 hover:text-foreground transition-all"
          >
            <X size={14} />
          </button>
        </div>
      </div>
    </div>
  );
}
