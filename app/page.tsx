"use client";

import Image from "next/image";
import { useTheme } from "next-themes";
import { useEffect, useState, useRef } from "react";

export default function Home() {
  const { theme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [inviteStatus, setInviteStatus] = useState<"idle" | "sending" | "sent" | "error">("idle");
  const emailRef = useRef<HTMLInputElement>(null);

  useEffect(() => setMounted(true), []);

  async function handleInvite(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const email = emailRef.current?.value?.trim();
    if (!email) return;
    setInviteStatus("sending");
    try {
      const res = await fetch("https://arabiakhaleej.com/api/invite", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      setInviteStatus(res.ok ? "sent" : "error");
    } catch {
      setInviteStatus("error");
    }
  }

  // Prevent hydration flicker
  const currentTheme = mounted ? theme : "dark";

  return (
    <div className="flex flex-col items-center justify-center min-h-[90vh] text-center px-4 overflow-hidden relative">
      {/* Decorative Glows */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-brand-gold/5 blur-[120px] rounded-full -z-10 animate-pulse" />
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-brand-accent/5 blur-[120px] rounded-full -z-10 animate-pulse delay-1000" />

      {/* Visual Accent */}
      <div className="mb-8 animate-in fade-in zoom-in duration-1000 slide-in-from-top-12">
        <div className="w-24 h-1 bg-brand-gold/30 mx-auto rounded-full blur-sm" />
      </div>

      {/* Main Title Section */}
      <div className="relative mb-12 animate-in fade-in slide-in-from-bottom-8 duration-700 delay-200 fill-mode-both">
        <div className="relative w-72 sm:w-[600px] h-40 sm:h-60 mx-auto transition-all duration-1000">
          <Image 
            src="/logo-premium-gold.png" 
            alt="Arabia Khaleej Logo" 
            fill 
            className="object-contain drop-shadow-[0_0_15px_rgba(212,175,55,0.15)]"
            priority
          />
        </div>
        
        <div className="w-32 h-[1px] bg-gradient-to-r from-transparent via-brand-gold/50 to-transparent mx-auto mt-6" />
      </div>

      {/* Description */}
      <div className="max-w-2xl glass p-10 rounded-3xl animate-in fade-in slide-in-from-bottom-12 duration-1000 delay-500 fill-mode-both relative z-10 border-brand-gold/5">
        <p className="text-xl sm:text-2xl font-light leading-relaxed italic italic serif opacity-80 mb-6">
          "Redefining the standard of luxury and community across the GCC region."
        </p>
        
        {/* Newsletter Section: Gilded Access */}
        <div className="mt-8 pt-8 border-t border-brand-gold/10">
          <h2 className="text-xs tracking-[0.3em] uppercase font-bold mb-6 opacity-60">Gilded Access</h2>
          {inviteStatus === "sent" ? (
            <p className="text-sm text-brand-gold/80 tracking-widest uppercase">Request received — we'll be in touch.</p>
          ) : (
            <form className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto" onSubmit={handleInvite}>
              <input
                ref={emailRef}
                type="email"
                placeholder="Your email for exclusive access..."
                className="flex-grow bg-brand-slate/10 dark:bg-brand-obsidian/40 border border-brand-gold/20 rounded-full px-6 py-3 text-sm focus:outline-none focus:border-brand-gold transition-colors placeholder:opacity-50"
                required
              />
              <button
                disabled={inviteStatus === "sending"}
                className="gold-gradient text-brand-obsidian font-bold text-xs uppercase tracking-widest px-8 py-3 rounded-full hover:shadow-[0_0_20px_rgba(212,175,55,0.4)] transition-all active:scale-95 disabled:opacity-60"
              >
                {inviteStatus === "sending" ? "Sending..." : "Request Invite"}
              </button>
            </form>
          )}
          {inviteStatus === "error" && (
            <p className="mt-2 text-xs text-red-400 opacity-70">Something went wrong — please try again.</p>
          )}
          <p className="mt-4 text-[10px] opacity-40 uppercase tracking-widest">
            Premier Digital Experience Arriving Soon
          </p>
        </div>
      </div>

      {/* Bottom Visual Bar */}
      <div className="mt-16 w-full max-w-sm h-[1px] bg-gradient-to-r from-transparent via-brand-gold/20 to-transparent mx-auto" />
    </div>
  );
}
