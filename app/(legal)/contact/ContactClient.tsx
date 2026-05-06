"use client";

import { useLanguage } from "@/lib/i18n";
import { useState } from "react";
import { Send, CheckCircle, Mail, MapPin, Globe } from "lucide-react";

export default function ContactClient() {
  const { t, isRTL, language } = useLanguage();
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const email = formData.get('email') as string;
    const name = formData.get('name') as string;
    const message = formData.get('message') as string;

    setLoading(true);
    try {
      const res = await fetch("/api/invite", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, name, message }),
      });
      if (res.ok) {
        setSubmitted(true);
      } else {
        alert(t('systemError'));
      }
    } catch (err) {
      alert(t('systemError'));
    } finally {
      setLoading(false);
    }
  };

  if (submitted) {
    return (
      <div className={`min-h-[60vh] flex flex-col items-center justify-center text-center px-4 ${isRTL ? 'font-serif-ar' : ''}`}>
        <div className="w-20 h-20 rounded-full bg-brand-gold/10 flex items-center justify-center text-brand-gold mb-8 animate-bounce">
          <CheckCircle size={40} />
        </div>
        <h2 className="text-3xl font-black mb-4">{t('thankYou')}</h2>
        <p className="text-foreground/60 max-w-md leading-loose">
          {t('submissionReceived')}
        </p>
        <button 
          onClick={() => setSubmitted(false)}
          className="mt-12 px-8 py-3 rounded-2xl glass border-brand-gold/20 text-brand-gold font-bold uppercase tracking-widest hover:bg-brand-gold/10 transition-all"
        >
          {t('back')}
        </button>
      </div>
    );
  }

  return (
    <div className={isRTL ? 'font-serif-ar' : ''}>
      {/* Header */}
      <header className={`mb-16 ${isRTL ? 'text-right' : ''}`}>
        <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-brand-gold/50 mb-5">
          {t('legal')}
        </p>
        <h1 className="text-4xl sm:text-5xl font-black tracking-tight leading-tight mb-6">
          {t('contactTitle')}
        </h1>
        <div className={`w-16 h-[2px] bg-gradient-to-r ${isRTL ? 'from-transparent to-brand-gold mr-auto ml-0' : 'from-brand-gold to-transparent'} rounded-full mb-8`} />
        <p className={`text-base sm:text-lg font-light leading-relaxed opacity-70 max-w-xl ${isRTL ? 'text-right' : ''}`}>
          {t('contactDesc')}
        </p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
        {/* Info Cards */}
        <div className="space-y-6">
          <div className={`glass rounded-2xl p-8 border border-brand-gold/10 flex ${isRTL ? 'flex-row-reverse text-right' : ''} gap-6 items-center`}>
            <div className="w-12 h-12 rounded-xl bg-brand-gold/10 flex items-center justify-center text-brand-gold flex-shrink-0">
              <Mail size={24} />
            </div>
            <div>
              <p className="text-[10px] font-black uppercase tracking-widest opacity-40 mb-1">{t('email')}</p>
              <p className="text-lg font-bold">press@arabiakhaleej.com</p>
            </div>
          </div>

          <div className={`glass rounded-2xl p-8 border border-brand-gold/10 flex ${isRTL ? 'flex-row-reverse text-right' : ''} gap-6 items-center`}>
            <div className="w-12 h-12 rounded-xl bg-brand-gold/10 flex items-center justify-center text-brand-gold flex-shrink-0">
              <MapPin size={24} />
            </div>
            <div>
              <p className="text-[10px] font-black uppercase tracking-widest opacity-40 mb-1">{t('hq')}</p>
              <p className="text-lg font-bold">{t('dohaQatar')}</p>
            </div>
          </div>

          <div className={`glass rounded-2xl p-8 border border-brand-gold/10 flex ${isRTL ? 'flex-row-reverse text-right' : ''} gap-6 items-center`}>
            <div className="w-12 h-12 rounded-xl bg-brand-gold/10 flex items-center justify-center text-brand-gold flex-shrink-0">
              <Globe size={24} />
            </div>
            <div>
              <p className="text-[10px] font-black uppercase tracking-widest opacity-40 mb-1">{t('status')}</p>
              <p className="text-lg font-bold">{t('independentGccRef')}</p>
            </div>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="glass rounded-[2rem] p-8 sm:p-10 border border-brand-gold/15 shadow-2xl space-y-6">
          <div className="space-y-2">
            <label className={`block text-[10px] font-black uppercase tracking-widest opacity-50 ${isRTL ? 'text-right' : ''}`}>
              {t('fullName')}
            </label>
            <input 
              required
              name="name"
              className={`w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-brand-gold/50 transition-colors ${isRTL ? 'text-right' : ''}`}
            />
          </div>

          <div className="space-y-2">
            <label className={`block text-[10px] font-black uppercase tracking-widest opacity-50 ${isRTL ? 'text-right' : ''}`}>
              {t('emailAddress')}
            </label>
            <input 
              required
              name="email"
              className={`w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-brand-gold/50 transition-colors ${isRTL ? 'text-right' : ''}`}
            />
          </div>

          <div className="space-y-2">
            <label className={`block text-[10px] font-black uppercase tracking-widest opacity-50 ${isRTL ? 'text-right' : ''}`}>
              {t('message')}
            </label>
            <textarea 
              required
              name="message"
              placeholder={t('messagePlaceholder')}
              className={`w-full bg-white/5 border border-white/10 rounded-xl px-4 py-4 text-sm focus:outline-none focus:border-brand-gold/50 transition-colors resize-none ${isRTL ? 'text-right' : ''}`}
            />
          </div>

          <button 
            type="submit"
            disabled={loading}
            className="w-full py-4 rounded-2xl bg-brand-gold text-brand-obsidian font-black uppercase tracking-[0.2em] text-xs hover:bg-accent transition-all active:scale-[0.98] flex items-center justify-center gap-3 disabled:opacity-50"
          >
            {loading ? (
              <div className="w-5 h-5 border-2 border-brand-obsidian/30 border-t-brand-obsidian rounded-full animate-spin" />
            ) : (
              <>
                <Send size={16} />
                {t('sendMessage')}
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
