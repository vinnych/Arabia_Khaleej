"use client";

import { useState, useRef } from "react";
import { useLanguage } from "@/lib/i18n";

export default function JoinClient() {
  const [inviteStatus, setInviteStatus] = useState<"idle" | "sending" | "sent" | "error">("idle");
  const emailRef = useRef<HTMLInputElement>(null);
  const nameRef = useRef<HTMLInputElement>(null);
  const { t, isRTL } = useLanguage();

  async function handleInvite(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const email = emailRef.current?.value?.trim();
    const name = nameRef.current?.value?.trim();
    if (!email) return;
    setInviteStatus("sending");
    try {
      const res = await fetch("https://arabiakhaleej-contact.asishchilakapati.workers.dev", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, name }),
      });
      setInviteStatus(res.ok ? "sent" : "error");
    } catch {
      setInviteStatus("error");
    }
  }

  return (
    <div className={`flex flex-col items-center justify-center min-h-screen pt-20 pb-20 px-4 relative ${isRTL ? 'font-serif-ar' : ''}`}>
      {/* Header */}
      <div className="mb-16 animate-in fade-in slide-in-from-top-4 duration-1000 text-center">
        <h1 className="text-xs tracking-[0.6em] uppercase font-bold text-accent mb-4">
          {isRTL ? 'تواصل' : 'Contact'}
        </h1>
        <p className="text-3xl font-black serif text-foreground">{t('boutiqueEnquiry')}</p>
      </div>

      <div className="w-full max-w-xl glass p-10 sm:p-16 rounded-[3rem] border-brand-gold/20 animate-in fade-in slide-in-from-bottom-8 duration-1000 delay-200 shadow-2xl">
        {inviteStatus === "sent" ? (
          <div className="text-center py-10">
            <div className="w-16 h-16 bg-green-500/10 text-green-600 rounded-full flex items-center justify-center mx-auto mb-6">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={3} stroke="currentColor" className="w-8 h-8">
                <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
              </svg>
            </div>
            <h2 className="text-2xl font-black serif text-foreground mb-4">{t('thankYou')}</h2>
            <p className="text-sm text-foreground/60 leading-relaxed font-bold uppercase tracking-widest">
              {t('submissionReceived')}
            </p>
          </div>
        ) : (
          <form className="space-y-6" onSubmit={handleInvite}>
            <div>
              <label className={`block text-[10px] font-black uppercase tracking-[0.3em] text-accent mb-3 ${isRTL ? 'mr-4 text-right' : 'ml-4'}`}>
                {t('fullName')}
              </label>
              <input
                ref={nameRef}
                type="text"
                placeholder={isRTL ? 'اسمك...' : 'Your Name...'}
                className={`w-full bg-white/70 dark:bg-brand-obsidian/40 border border-brand-gold/20 rounded-full px-8 py-4 text-sm focus:outline-none focus:border-brand-gold transition-all shadow-inner ${isRTL ? 'text-right' : ''}`}
              />
            </div>
            <div>
              <label className={`block text-[10px] font-black uppercase tracking-[0.3em] text-accent mb-3 ${isRTL ? 'mr-4 text-right' : 'ml-4'}`}>
                {t('emailAddress')}
              </label>
              <input
                ref={emailRef}
                type="email"
                placeholder={isRTL ? 'عنوان بريدك...' : 'Email address...'}
                className={`w-full bg-white/70 dark:bg-brand-obsidian/40 border border-brand-gold/20 rounded-full px-8 py-4 text-sm focus:outline-none focus:border-brand-gold transition-all shadow-inner ${isRTL ? 'text-right' : ''}`}
                required
              />
            </div>
            <button
              disabled={inviteStatus === "sending"}
              className="w-full gold-gradient text-white dark:text-brand-obsidian font-bold text-[11px] uppercase tracking-[0.3em] py-5 rounded-full hover:scale-105 transition-all disabled:opacity-50 shadow-xl mt-4"
            >
              {inviteStatus === "sending" ? (isRTL ? 'جاري المعالجة...' : 'Processing...') : t('submit')}
            </button>
            {inviteStatus === "error" && (
              <p className="text-center text-xs text-red-500 font-bold tracking-widest uppercase mt-4">
                {isRTL ? 'حدث خطأ ما. حاول مرة أخرى.' : 'Something went wrong. Please try again.'}
              </p>
            )}
          </form>
        )}
      </div>

      {/* Back to Home */}
      <div className="mt-20">
        <a href="/" className="text-[11px] font-bold uppercase tracking-[0.4em] text-accent hover:tracking-[0.6em] transition-all">
          {isRTL ? 'الرئيسية ←' : '← Home'}
        </a>
      </div>
    </div>
  );
}
