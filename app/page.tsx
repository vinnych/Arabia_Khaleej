import { Suspense } from "react";
import PrayerTimes from "@/components/PrayerTimes";
import NewsFeed from "@/components/NewsFeed";
import JobList from "@/components/JobList";
import WeatherWidget from "@/components/WeatherWidget";
import CurrencyWidget from "@/components/CurrencyWidget";
import FadeIn from "@/components/FadeIn";
import { safeJsonLd } from "@/lib/utils";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Doha Prayer Times Today — Qatar News & Jobs | Qatar Portal",
  description: "Accurate Doha prayer times for today including Fajr, Dhuhr, Asr, Maghrib and Isha. Plus latest Qatar news and job listings.",
  keywords: ["Doha prayer times today", "Fajr time Doha", "Qatar prayer times", "Qatar news today", "jobs in Qatar", "Maghrib time Doha", "Qatar Portal"],
  alternates: { canonical: "https://qatar-portal.vercel.app" },
  openGraph: {
    title: "Doha Prayer Times Today — Qatar News & Jobs | Qatar Portal",
    description: "Accurate Doha prayer times for today including Fajr, Dhuhr, Asr, Maghrib and Isha. Plus latest Qatar news and job listings.",
    url: "https://qatar-portal.vercel.app",
    siteName: "Qatar Portal",
    type: "website",
    images: [{ url: "https://qatar-portal.vercel.app/opengraph-image", width: 1200, height: 630 }],
  },
  twitter: { card: "summary_large_image", title: "Doha Prayer Times Today | Qatar Portal", description: "Accurate Doha prayer times for today. Plus latest Qatar news and job listings." },
};

const homeJsonLd = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "name": "Doha Prayer Times Today — Qatar News & Jobs | Qatar Portal",
  "url": "https://qatar-portal.vercel.app",
  "mainEntity": [
    { "@type": "Question", "name": "What time is Fajr in Doha today?", "acceptedAnswer": { "@type": "Answer", "text": "Fajr prayer time in Doha today can be found on Qatar Portal, updated daily from the Aladhan API using the Muslim World League calculation method." } },
    { "@type": "Question", "name": "What time is Maghrib in Doha today?", "acceptedAnswer": { "@type": "Answer", "text": "Maghrib prayer time in Doha today is available on Qatar Portal, updated daily with accurate sunset-based calculation." } },
    { "@type": "Question", "name": "What are today's prayer times in Qatar?", "acceptedAnswer": { "@type": "Answer", "text": "Today's prayer times in Qatar (Fajr, Dhuhr, Asr, Maghrib, Isha) are listed on Qatar Portal's homepage and prayer page, updated daily." } },
    { "@type": "Question", "name": "Where can I find jobs in Qatar?", "acceptedAnswer": { "@type": "Answer", "text": "Qatar Portal lists the latest job vacancies in Doha and Qatar, updated daily from top Gulf job boards." } },
  ],
};

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex items-center gap-3 mb-2">
      <span className="text-[10px] font-bold text-gray-500 uppercase tracking-widest whitespace-nowrap">{children}</span>
      <div className="flex-1 h-px bg-stone-200" />
    </div>
  );
}

export default async function Home() {
  return (
    <div>
      <script type="application/ld+json" dangerouslySetInnerHTML={{__html: safeJsonLd(homeJsonLd)}} />

      {/* Prayer Times Hero — full-bleed, flush to header */}
      <section className="-mx-4 sm:-mx-6 -mt-4 sm:-mt-5">
        <Suspense fallback={<div className="bg-rose-900/10 h-52 animate-pulse" />}>
          <PrayerTimes />
        </Suspense>
      </section>

      {/* Quick-link shortcuts — horizontal scroll on mobile */}
      <div className="flex gap-2 overflow-x-auto hide-scrollbar -mx-4 px-4 sm:mx-0 sm:px-0 sm:flex-wrap mt-4 pb-1">
        {[
          { href: "/prayer",         label: "Prayer",   icon: "🕌" },
          { href: "/news",           label: "News",     icon: "📰" },
          { href: "/jobs",           label: "Jobs",     icon: "💼" },
          { href: "/weather",        label: "Weather",  icon: "🌤️" },
          { href: "/currency",       label: "Currency", icon: "💱" },
          { href: "/hijri-calendar", label: "Hijri",    icon: "🗓️" },
          { href: "/qatar-metro",    label: "Metro",    icon: "🚇" },
        ].map(({ href, label, icon }) => (
          <a
            key={href}
            href={href}
            className="flex items-center gap-1.5 shrink-0 px-3 py-1.5 bg-white rounded-full border border-stone-200 text-xs font-semibold text-gray-700 hover:border-primary hover:text-primary transition-colors shadow-sm active:scale-95"
          >
            <span>{icon}</span>
            <span>{label}</span>
          </a>
        ))}
      </div>

      <div className="space-y-5 mt-5">
        {/* Weather + Currency — always 2-col, they're compact */}
        <FadeIn delay={0.1}>
          <div className="grid grid-cols-2 gap-3">
            <section>
              <a href="/weather" className="block hover:opacity-90 transition-opacity">
                <SectionLabel>Weather</SectionLabel>
                <Suspense fallback={<div className="bg-stone-100 rounded-2xl h-24 animate-pulse" />}>
                  <WeatherWidget />
                </Suspense>
              </a>
            </section>
            <section>
              <a href="/currency" className="block hover:opacity-90 transition-opacity">
                <SectionLabel>QAR Rates</SectionLabel>
                <Suspense fallback={<div className="bg-stone-100 rounded-2xl h-24 animate-pulse" />}>
                  <CurrencyWidget />
                </Suspense>
              </a>
            </section>
          </div>
        </FadeIn>

        {/* News */}
        <FadeIn delay={0.2}>
          <section>
            <div className="flex items-center justify-between mb-2">
              <SectionLabel>Latest News</SectionLabel>
              <a href="/news" className="text-xs font-medium text-gray-500 hover:text-primary transition-colors">View all →</a>
            </div>
            <Suspense fallback={<div className="grid gap-4 sm:grid-cols-2"><div className="bg-stone-100 rounded-2xl h-40 animate-pulse" /><div className="bg-stone-100 rounded-2xl h-40 animate-pulse" /></div>}>
              <NewsFeed limit={6} />
            </Suspense>
          </section>
        </FadeIn>

        {/* Jobs */}
        <FadeIn delay={0.25}>
          <section>
            <div className="flex items-center justify-between mb-2">
              <SectionLabel>Jobs in Qatar</SectionLabel>
              <a href="/jobs" className="text-xs font-medium text-gray-500 hover:text-primary transition-colors">View all →</a>
            </div>
            <Suspense fallback={<div className="space-y-2"><div className="bg-stone-100 rounded-xl h-16 animate-pulse" /><div className="bg-stone-100 rounded-xl h-16 animate-pulse" /></div>}>
              <JobList limit={5} />
            </Suspense>
          </section>
        </FadeIn>

        {/* FAQ */}
        <FadeIn delay={0.3}>
          <section className="-mx-4 sm:-mx-6 px-4 sm:px-6 py-5 bg-surface-low">
            <SectionLabel>FAQ</SectionLabel>
            <div className="divide-y divide-stone-200/60">
              {[
                { q: "What time is Fajr in Doha today?", a: "Fajr prayer time in Doha is updated daily using the Muslim World League calculation method via Aladhan." },
                { q: "What time is Maghrib in Doha today?", a: "Maghrib prayer time in Doha is calculated based on sunset time for Qatar, updated daily." },
                { q: "What are today's prayer times in Qatar?", a: "All five daily prayer times for Qatar (Fajr, Dhuhr, Asr, Maghrib, Isha) are updated daily." },
                { q: "Where can I find jobs in Qatar?", a: "Qatar Portal lists the latest job vacancies in Doha and Qatar, updated daily from top Gulf job boards." },
              ].map(({ q, a }) => (
                <details key={q} className="group">
                  <summary className="cursor-pointer list-none flex items-center justify-between text-sm font-medium text-gray-700 hover:text-primary transition-colors py-3.5 min-h-[44px]">
                    <span>{q}</span>
                    <span className="text-gray-300 group-open:rotate-180 transition-transform text-xs ml-3 shrink-0">▼</span>
                  </summary>
                  <p className="text-sm text-gray-500 pb-4 leading-relaxed">{a}</p>
                </details>
              ))}
            </div>
          </section>
        </FadeIn>
      </div>
    </div>
  );
}
