import { Suspense } from "react";
import PrayerTimes from "@/components/PrayerTimes";
import NewsFeed from "@/components/NewsFeed";
import JobList from "@/components/JobList";
import WeatherWidget from "@/components/WeatherWidget";
import CurrencyWidget from "@/components/CurrencyWidget";
import DohaTime from "@/components/DohaTime";
import AdUnit from "@/components/AdUnit";
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
      <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest whitespace-nowrap">{children}</span>
      <div className="flex-1 h-px bg-stone-200" />
    </div>
  );
}

export default async function Home() {
  return (
    <div className="space-y-8">
      <script type="application/ld+json" dangerouslySetInnerHTML={{__html: safeJsonLd(homeJsonLd)}} />

      {/* Title row */}
      <div className="flex items-center justify-between pb-4 border-b border-stone-200">
        <h1 className="text-sm font-semibold text-gray-500 tracking-wide">Qatar Portal — Doha</h1>
        <DohaTime />
      </div>

      {/* Prayer Times */}
      <section>
        <SectionLabel>Prayer Times · Doha</SectionLabel>
        <Suspense fallback={<div className="bg-rose-900/10 rounded-2xl h-40 animate-pulse" />}>
          <PrayerTimes />
        </Suspense>
      </section>

      {/* Weather + Currency */}
      <div className="grid md:grid-cols-2 gap-4">
        <section>
          <a href="/weather" className="block hover:opacity-90 transition-opacity">
            <SectionLabel>Weather · Doha</SectionLabel>
            <Suspense fallback={<div className="bg-stone-100 rounded-2xl h-24 animate-pulse" />}>
              <WeatherWidget />
            </Suspense>
          </a>
        </section>
        <section>
          <a href="/currency" className="block hover:opacity-90 transition-opacity">
            <SectionLabel>QAR Exchange Rates</SectionLabel>
            <Suspense fallback={<div className="bg-stone-100 rounded-2xl h-24 animate-pulse" />}>
              <CurrencyWidget />
            </Suspense>
          </a>
        </section>
      </div>

      <AdUnit slot="REPLACE_WITH_SLOT_ID" />

      {/* News + Jobs */}
      <div className="grid lg:grid-cols-3 gap-6 lg:gap-8">
        <section className="lg:col-span-2">
          <div className="flex items-center justify-between mb-4">
            <SectionLabel>Latest News</SectionLabel>
            <a href="/news" className="text-xs font-medium text-gray-400 hover:text-rose-800 transition-colors">View all →</a>
          </div>
          <Suspense fallback={<div className="grid gap-4 sm:grid-cols-2"><div className="bg-stone-100 rounded-2xl h-40 animate-pulse" /><div className="bg-stone-100 rounded-2xl h-40 animate-pulse" /></div>}>
            <NewsFeed limit={12} />
          </Suspense>
        </section>

        <section>
          <div className="flex items-center justify-between mb-4">
            <SectionLabel>Jobs in Qatar</SectionLabel>
            <a href="/jobs" className="text-xs font-medium text-gray-400 hover:text-rose-800 transition-colors">View all →</a>
          </div>
          <Suspense fallback={<div className="space-y-2"><div className="bg-stone-100 rounded-xl h-16 animate-pulse" /><div className="bg-stone-100 rounded-xl h-16 animate-pulse" /></div>}>
            <JobList limit={8} />
          </Suspense>
        </section>
      </div>

      {/* FAQ */}
      <section>
        <SectionLabel>FAQ</SectionLabel>
        <div className="divide-y divide-stone-100">
          {[
            { q: "What time is Fajr in Doha today?", a: "Today's Fajr prayer time in Doha is shown at the top of this page, updated daily using the Muslim World League calculation method." },
            { q: "What time is Maghrib in Doha today?", a: "Today's Maghrib prayer time in Doha is displayed above, calculated based on sunset time for Qatar." },
            { q: "What are today's prayer times in Qatar?", a: "All five daily prayer times for Qatar (Fajr, Dhuhr, Asr, Maghrib, Isha) are shown above, updated daily." },
            { q: "Where can I find jobs in Qatar?", a: "Browse the latest job vacancies in Doha and Qatar in the Jobs section above, updated daily from top Gulf job boards." },
          ].map(({ q, a }) => (
            <details key={q} className="group">
              <summary className="cursor-pointer list-none flex items-center justify-between text-sm font-medium text-gray-700 hover:text-rose-800 transition-colors py-3.5 min-h-[44px]">
                <span>{q}</span>
                <span className="text-gray-300 group-open:rotate-180 transition-transform text-xs ml-3 shrink-0">▼</span>
              </summary>
              <p className="text-sm text-gray-500 pb-4 leading-relaxed">{a}</p>
            </details>
          ))}
        </div>
      </section>
    </div>
  );
}
