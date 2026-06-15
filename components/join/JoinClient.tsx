"use client";

import { useState, useRef } from "react";
import Link from "next/link";
import { useLanguage, getLocalizedHref } from '@/lib/i18n/i18n';

export default function JoinClient() {
  const [inviteStatus, setInviteStatus] = useState<"idle" | "sending" | "sent" | "error">("idle");
  const emailRef = useRef<HTMLInputElement>(null);
  const nameRef = useRef<HTMLInputElement>(null);
  const { t, isRTL, language } = useLanguage();

  async function handleInvite(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const email = emailRef.current?.value?.trim();
    const name = nameRef.current?.value?.trim();
    if (!email) return;
    setInviteStatus("sending");
    try {
      const res = await fetch("/api/invite", {
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
      {/* Decorative Background Elements */}
      <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-brand-gold/5 rounded-full blur-[100px] animate-float" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-brand-accent/5 rounded-full blur-[120px] animate-float" style={{ animationDelay: '-2s' }} />

      {/* Header */}
      <div className="mb-16 animate-reveal text-center">
        <h1 className="text-xs tracking-[0.6em] uppercase font-bold text-brand-gold mb-4">
          {t('contact')}
        </h1>
        <p className="text-3xl sm:text-4xl font-black serif text-foreground tracking-tight">{t('boutiqueEnquiry')}</p>
        <div className="w-12 h-1 bg-brand-gold/30 mx-auto mt-6 rounded-full" />
      </div>

      <div className="w-full max-w-xl glass p-10 sm:p-16 rounded-[3.5rem] border-brand-gold/10 animate-reveal delay-200 shadow-2xl relative overflow-hidden">
        {/* Shimmer overlay */}
        <div className="absolute inset-0 shimmer-bg pointer-events-none opacity-50" />
        
        {inviteStatus === "sent" ? (
          <div className="text-center py-10 relative z-10">
            <div className="w-20 h-20 bg-brand-gold/10 text-brand-gold rounded-full flex items-center justify-center mx-auto mb-8 shadow-glow animate-reveal">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-10 h-10">
                <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
              </svg>
            </div>
            <h2 className="text-3xl font-black serif text-foreground mb-4 animate-reveal delay-300">{t('thankYou')}</h2>
            <p className="text-xs text-foreground/50 leading-relaxed font-bold uppercase tracking-[0.2em] animate-reveal delay-500 max-w-sm mx-auto">
              {t('submissionReceived')}
            </p>
          </div>
        ) : (
          <form className="space-y-8 relative z-10" onSubmit={handleInvite}>
            <div className="space-y-4">
              <label htmlFor="full-name" className={`block text-[10px] font-black uppercase tracking-[0.4em] text-brand-gold/60 ${isRTL ? 'mr-6 text-right' : 'ml-6'}`}>
                {t('fullName')}
              </label>
              <div className="relative group">
                <input
                  id="full-name"
                  name="full-name"
                  ref={nameRef}
                  type="text"
                  placeholder={t('yourFullName')}
                  className={`w-full bg-white/5 dark:bg-black/20 border border-brand-gold/10 rounded-3xl px-8 py-5 text-sm focus:outline-none focus:border-brand-gold focus:ring-4 focus:ring-brand-gold/5 transition-all shadow-inner group-hover:border-brand-gold/30 ${isRTL ? 'text-right' : ''}`}
                />
              </div>
            </div>
            <div className="space-y-4">
              <label htmlFor="email-address" className={`block text-[10px] font-black uppercase tracking-[0.4em] text-brand-gold/60 ${isRTL ? 'mr-6 text-right' : 'ml-6'}`}>
                {t('emailAddress')}
              </label>
              <div className="relative group">
                <input
                  id="email-address"
                  name="email-address"
                  ref={emailRef}
                  type="email"
                  placeholder={t('professionalEmail')}
                  className={`w-full bg-white/5 dark:bg-black/20 border border-brand-gold/10 rounded-3xl px-8 py-5 text-sm focus:outline-none focus:border-brand-gold focus:ring-4 focus:ring-brand-gold/5 transition-all shadow-inner group-hover:border-brand-gold/30 ${isRTL ? 'text-right' : ''}`}
                  required
                />
              </div>
            </div>
            <button
              disabled={inviteStatus === "sending"}
              className="w-full gold-gradient text-brand-obsidian font-black text-[10px] uppercase tracking-[0.4em] py-6 rounded-3xl hover:scale-[1.02] hover:shadow-glow active:scale-[0.98] transition-all disabled:opacity-50 shadow-2xl mt-6 relative overflow-hidden group"
            >
              <span className="relative z-10">
                {inviteStatus === "sending" ? t('transmitting') : t('submit')}
              </span>
              <div className="absolute inset-0 bg-white/20 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000 skew-x-12" />
            </button>
            {inviteStatus === "error" && (
              <p className="text-center text-[9px] text-red-500/80 font-black tracking-[0.3em] uppercase mt-6 animate-pulse">
                {t('systemError')}
              </p>
            )}
          </form>
        )}
      </div>

      {/* Back to Home */}
      <div className="mt-16 animate-reveal delay-1000">
        <Link href={getLocalizedHref("/", language)} className="group flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.5em] text-brand-gold hover:text-brand-accent transition-all">
          <span className={`transition-transform duration-300 ${isRTL ? 'group-hover:translate-x-2' : 'group-hover:-translate-x-2'}`}>
            {isRTL ? `← ${t('returnHome')}` : `← ${t('returnHome')}`}
          </span>
        </Link>
      </div>
    </div>
  );
}
