import type { Metadata } from "next";
import { safeJsonLd } from "@/lib/utils";
import HijriNav from "@/components/HijriNav";

const SITE_URL = "https://qatar-portal.vercel.app";

export const revalidate = 86400;

export const metadata: Metadata = {
  title: "Hijri Calendar 2026 — Islamic Date Today | Qatar Portal",
  description: "Today's Hijri (Islamic) date, full Hijri calendar for 1447–1448 AH with Gregorian dates. Convert between Islamic and Gregorian calendars.",
  keywords: ["Hijri calendar 2026", "Islamic date today", "Hijri date", "Islamic calendar Qatar", "1447 hijri", "1448 hijri", "Hijri Gregorian converter"],
  alternates: { canonical: `${SITE_URL}/hijri-calendar` },
  openGraph: {
    title: "Hijri Calendar 2026 — Islamic Date Today",
    description: "Today's Hijri date and full Islamic calendar with Gregorian conversion.",
    url: `${SITE_URL}/hijri-calendar`,
    siteName: "Qatar Portal",
    type: "website",
    images: [{ url: `${SITE_URL}/opengraph-image`, width: 1200, height: 630 }],
  },
  twitter: { card: "summary_large_image", title: "Hijri Calendar 2026 — Islamic Date Today", description: "Today's Hijri date and full Islamic calendar with Gregorian conversion." },
};

const HIJRI_MONTHS = [
  "Muharram", "Safar", "Rabi al-Awwal", "Rabi al-Thani",
  "Jumada al-Awwal", "Jumada al-Thani", "Rajab", "Sha'ban",
  "Ramadan", "Shawwal", "Dhu al-Qi'dah", "Dhu al-Hijjah",
];

const DAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

// Islamic holidays (approx Gregorian dates 2026)
const ISLAMIC_HOLIDAYS: Record<string, string> = {
  "2026-03-20": "Eid Al-Fitr",
  "2026-03-21": "Eid Al-Fitr",
  "2026-03-22": "Eid Al-Fitr",
  "2026-05-27": "Eid Al-Adha",
  "2026-05-28": "Eid Al-Adha",
  "2026-05-29": "Eid Al-Adha",
  "2026-06-16": "Islamic New Year",
  "2026-08-25": "Prophet's Birthday",
  "2026-12-18": "Qatar National Day",
};

interface AladhanDay {
  date: {
    gregorian: { date: string; day: string; month: { en: string }; year: string; weekday: { en: string } };
    hijri: { date: string; day: string; month: { en: string; number: number }; year: string };
  };
}

async function fetchCalendar(year: number, month: number): Promise<AladhanDay[]> {
  try {
    const res = await fetch(
      `https://api.aladhan.com/v1/calendarByCity/${year}/${month}?city=Doha&country=Qatar&method=2`,
      { next: { revalidate: 86400 } }
    );
    if (!res.ok) return [];
    const json = await res.json();
    return json.data ?? [];
  } catch {
    return [];
  }
}

export default async function HijriCalendarPage({
  searchParams,
}: {
  searchParams: Promise<{ year?: string; month?: string }>;
}) {
  const sp = await searchParams;
  const now = new Date();
  const year = parseInt(sp.year ?? String(now.getFullYear()), 10) || now.getFullYear();
  const month = parseInt(sp.month ?? String(now.getMonth() + 1), 10) || now.getMonth() + 1;
  const clampedMonth = Math.max(1, Math.min(12, month));
  const clampedYear = Math.max(2020, Math.min(2030, year));

  const days = await fetchCalendar(clampedYear, clampedMonth);

  const todayStr = now.toLocaleDateString("en-CA"); // YYYY-MM-DD
  const firstDay = days[0];
  const hijriMonthName = firstDay?.date.hijri.month.en ?? "";
  const hijriYear = firstDay?.date.hijri.year ?? "";

  // Determine start weekday offset for the grid
  const firstGreg = firstDay ? new Date(firstDay.date.gregorian.date.split("-").reverse().join("-")) : null;
  const startOffset = firstGreg ? firstGreg.getDay() : 0;

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: [
      {
        "@type": "Question",
        name: "What is today's Hijri date?",
        acceptedAnswer: {
          "@type": "Answer",
          text: firstDay
            ? `Today in the Hijri calendar is ${firstDay.date.hijri.day} ${firstDay.date.hijri.month.en} ${firstDay.date.hijri.year} AH.`
            : "The Hijri (Islamic) date is calculated based on the lunar calendar. Each Hijri year is approximately 354 days.",
        },
      },
      {
        "@type": "Question",
        name: "How does the Hijri calendar work?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "The Hijri (Islamic) calendar is a lunar calendar with 12 months of 29 or 30 days. The year is about 354 days, making it 11 days shorter than the Gregorian year. It started from the Prophet Muhammad's migration (Hijra) from Mecca to Medina in 622 CE.",
        },
      },
      {
        "@type": "Question",
        name: "What are the 12 months of the Islamic calendar?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "The 12 Hijri months are: Muharram, Safar, Rabi al-Awwal, Rabi al-Thani, Jumada al-Awwal, Jumada al-Thani, Rajab, Sha'ban, Ramadan, Shawwal, Dhu al-Qi'dah, and Dhu al-Hijjah.",
        },
      },
    ],
  };

  return (
    <div className="max-w-3xl mx-auto">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: safeJsonLd(jsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: safeJsonLd({ "@context": "https://schema.org", "@type": "BreadcrumbList", itemListElement: [{ "@type": "ListItem", position: 1, name: "Home", item: "https://qatar-portal.vercel.app" }, { "@type": "ListItem", position: 2, name: "Hijri Calendar", item: "https://qatar-portal.vercel.app/hijri-calendar" }] }) }} />

      <h1 className="text-xl font-bold text-gray-900 mb-1">Hijri Calendar</h1>
      <p className="text-xs text-gray-400 mb-3">
        Islamic (Hijri) dates alongside Gregorian — based on Doha, Qatar moon sighting method.
      </p>

      {/* Today highlight */}
      {days.length > 0 && (() => {
        const todayEntry = days.find(d => {
          const g = d.date.gregorian;
          const parts = g.date.split("-");
          const isoDate = `${parts[2]}-${parts[1]}-${parts[0]}`;
          return isoDate === todayStr;
        });
        if (!todayEntry) return null;
        return (
          <div className="bg-amber-50 border border-amber-200 rounded-lg p-3 mb-3 flex items-center gap-4">
            <div className="text-4xl">🌙</div>
            <div>
              <p className="text-xs text-amber-700 font-medium uppercase tracking-wide">Today&apos;s Hijri Date</p>
              <p className="text-2xl font-bold text-gray-900">
                {todayEntry.date.hijri.day} {todayEntry.date.hijri.month.en} {todayEntry.date.hijri.year} AH
              </p>
              <p className="text-sm text-gray-500">
                {todayEntry.date.gregorian.weekday.en}, {todayEntry.date.gregorian.day} {todayEntry.date.gregorian.month.en} {todayEntry.date.gregorian.year}
              </p>
            </div>
          </div>
        );
      })()}

      {/* Month navigation */}
      <HijriNav year={clampedYear} month={clampedMonth} hijriMonth={hijriMonthName} hijriYear={hijriYear} />

      {/* Calendar grid */}
      {days.length > 0 ? (
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
          {/* Day headers */}
          <div className="grid grid-cols-7 bg-gray-50 border-b border-gray-100">
            {DAYS.map((d) => (
              <div key={d} className={`text-center text-xs font-semibold py-2 ${d === "Fri" ? "text-emerald-700" : "text-gray-500"}`}>
                {d}
              </div>
            ))}
          </div>

          {/* Calendar cells */}
          <div className="grid grid-cols-7">
            {/* Empty cells before first day */}
            {Array.from({ length: startOffset }).map((_, i) => (
              <div key={`empty-${i}`} className="min-h-[52px] border-b border-r border-gray-50" />
            ))}

            {days.map((d) => {
              const g = d.date.gregorian;
              const parts = g.date.split("-");
              const isoDate = `${parts[2]}-${parts[1]}-${parts[0]}`;
              const isToday = isoDate === todayStr;
              const isFriday = g.weekday.en === "Friday";
              const holiday = ISLAMIC_HOLIDAYS[isoDate];

              return (
                <div
                  key={isoDate}
                  className={`min-h-[52px] p-1 border-b border-r border-gray-50 flex flex-col ${
                    isToday ? "bg-amber-50" : isFriday ? "bg-emerald-50/40" : ""
                  }`}
                >
                  <span className={`text-sm font-semibold ${isToday ? "text-amber-700" : isFriday ? "text-emerald-700" : "text-gray-800"}`}>
                    {g.day}
                  </span>
                  <span className="text-xs text-gray-400 leading-tight">{d.date.hijri.day} {d.date.hijri.month.en.slice(0, 3)}</span>
                  {holiday && <span className="text-[10px] text-rose-600 leading-tight mt-0.5 font-medium">{holiday}</span>}
                  {isToday && <span className="text-[10px] text-amber-600 font-bold">Today</span>}
                </div>
              );
            })}
          </div>
        </div>
      ) : (
        <p className="text-gray-500 text-center py-12">Could not load calendar. Please try again.</p>
      )}

      {/* Month names reference */}
      <div className="mt-5 bg-white rounded-lg border border-gray-100 shadow-sm p-3">
        <h2 className="text-sm font-semibold text-gray-700 mb-2">The 12 Hijri Months</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
          {HIJRI_MONTHS.map((m, i) => (
            <div key={m} className="flex items-center gap-2 text-sm">
              <span className="text-gray-400 font-mono w-5 text-right">{i + 1}.</span>
              <span className={m === hijriMonthName ? "font-semibold text-amber-700" : "text-gray-700"}>{m}</span>
              {m === hijriMonthName && <span className="text-xs text-amber-500">← now</span>}
            </div>
          ))}
        </div>
      </div>

      {/* FAQ */}
      <div className="mt-4 bg-white rounded-lg border border-gray-100 shadow-sm p-3">
        <h2 className="text-xs font-medium text-gray-400 uppercase tracking-wide mb-2">FAQ</h2>
        <div className="space-y-3">
          {[
            { q: "How many days are in a Hijri year?", a: "A Hijri year has 354 or 355 days (12 lunar months). It is about 11 days shorter than the Gregorian year, which is why Islamic holidays shift earlier each year." },
            { q: "When does the Hijri day start?", a: "In the Islamic calendar, the day starts at sunset — not midnight. So Friday begins at sunset on Thursday evening." },
            { q: "What year is it in the Islamic calendar?", a: `The current Hijri year is ${hijriYear || "1447"} AH. The Hijri calendar began in 622 CE when the Prophet Muhammad migrated from Mecca to Medina.` },
          ].map(({ q, a }) => (
            <details key={q} className="group">
              <summary className="cursor-pointer text-xs font-medium text-gray-700 py-2 list-none flex justify-between items-center">
                {q}
                <span className="text-gray-400 group-open:rotate-180 transition-transform">▼</span>
              </summary>
              <p className="text-xs text-gray-500 pt-1 pb-3">{a}</p>
            </details>
          ))}
        </div>
      </div>

      <p className="mt-6 text-xs text-gray-400 text-center">
        Dates based on Doha moon sighting · Muslim World League calculation method · <a href="/prayer" className="text-rose-700 hover:underline">Prayer times →</a>
      </p>
    </div>
  );
}
