"use client";
import { useState, useEffect } from "react";
import Script from "next/script";
import Link from "next/link";

export default function CookieConsent() {
  const [consent, setConsent] = useState<boolean | null>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem("cookie-consent");
    if (stored === null) {
      setVisible(true);
    } else {
      setConsent(stored === "true");
    }
  }, []);

  function accept() {
    localStorage.setItem("cookie-consent", "true");
    setConsent(true);
    setVisible(false);
  }

  function decline() {
    localStorage.setItem("cookie-consent", "false");
    setConsent(false);
    setVisible(false);
  }

  return (
    <>
      {consent && (
        <>
          <Script
            src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-7212871157824722"
            strategy="afterInteractive"
            crossOrigin="anonymous"
          />
          <Script
            src="https://www.googletagmanager.com/gtag/js?id=G-VPREJS079K"
            strategy="afterInteractive"
          />
          <Script id="google-analytics" strategy="afterInteractive">{`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-VPREJS079K');
          `}</Script>
        </>
      )}
      {visible && (
        <div className="fixed bottom-[72px] left-0 right-0 z-[60] md:bottom-4 md:left-4 md:right-auto md:max-w-sm bg-slate-900 dark:bg-slate-950 text-white shadow-2xl md:rounded-2xl px-5 py-4 flex flex-col gap-4 border border-slate-800">
          <p className="text-sm leading-relaxed text-slate-300">
            <span className="lang-en block mb-1">
              We use cookies for analytics and personalised ads. See our{" "}
              <Link href="/privacy" className="underline hover:text-white transition-colors font-semibold">
                Privacy Policy
              </Link>.
            </span>
            <span className="lang-ar block">
              نحن نستخدم ملفات تعريف الارتباط للتحليلات والإعلانات المخصصة. راجع{" "}
              <Link href="/privacy" className="underline hover:text-white transition-colors font-semibold">
                سياسة الخصوصية
              </Link>.
            </span>
          </p>
          <div className="flex gap-3">
            <button
              onClick={accept}
              className="flex-1 bg-blue-600 hover:bg-blue-500 text-white text-sm font-bold py-2.5 rounded-xl transition-colors shadow-lg shadow-blue-500/20"
            >
              <span className="lang-en">Accept</span>
              <span className="lang-ar">قبول</span>
            </button>
            <button
              onClick={decline}
              className="flex-1 border border-slate-700 hover:border-slate-500 hover:bg-slate-800 text-sm font-bold py-2.5 rounded-xl transition-colors"
            >
              <span className="lang-en">Decline</span>
              <span className="lang-ar">رفض</span>
            </button>
          </div>
        </div>
      )}
    </>
  );
}
