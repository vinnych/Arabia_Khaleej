import { getPrayerTimes, getMonthlyPrayerTimes } from "@/lib/prayer";
import PrayerPageClient from "@/components/PrayerPageClient";
import { safeJsonLd } from "@/lib/utils";
import { pageMeta, SITE_URL } from "@/lib/seo";

export const metadata = pageMeta({
  title: "Prayer Times & Hijri Calendar Registry | Arabia Khaleej",
  description: "Accurate Fajr, Dhuhr, Asr, Maghrib and Isha prayer times for Doha, Riyadh, Dubai and the GCC region. Full monthly Hijri calendar and Islamic date registry.",
  path: "/prayer",
  keywords: ["GCC prayer times registry", "Arabia prayer times today", "Fajr time Dubai", "Islamic calendar Arabia", "Arabia Khaleej prayer"],
});

export default async function PrayerPage() {
  const now = new Date();
  const year = now.getFullYear();
  const month = now.getMonth() + 1;

  let today = null;
  let calendar: Awaited<ReturnType<typeof getMonthlyPrayerTimes>> = [];

  try {
    [today, calendar] = await Promise.all([
      getPrayerTimes(),
      getMonthlyPrayerTimes(year, month),
    ]);
  } catch {
    /* show error state below */
  }

  const jsonLd = today
    ? {
        "@context": "https://schema.org",
        "@type": "WebPage",
        name: "Prayer Times & Hijri Calendar — Arabia Khaleej",
        url: `${SITE_URL}/prayer`,
        description: `Today's prayer times in the GCC. Fajr: ${today.Fajr}, Dhuhr: ${today.Dhuhr}, Asr: ${today.Asr}, Maghrib: ${today.Maghrib}, Isha: ${today.Isha}. Hijri: ${today.hijriDate} ${today.hijriMonth} ${today.hijriYear} AH.`,
        inLanguage: "en",
        isPartOf: { "@type": "WebSite", name: "Arabia Khaleej", url: SITE_URL },
        about: {
          "@type": "Place",
          name: "Arabia Khaleej",
          geo: { "@type": "GeoCoordinates", latitude: 25.2854, longitude: 51.5310 },
          address: { "@type": "PostalAddress", addressLocality: "Doha", addressCountry: "QA" },
        },
      }
    : null;

  const faqJsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: [
      {
        "@type": "Question",
        name: "What time is Fajr in Doha today?",
        acceptedAnswer: { "@type": "Answer", text: today ? `Fajr prayer time in Doha today is ${today.Fajr}.` : "Fajr prayer time in Doha is updated daily." },
      },
      {
        "@type": "Question",
        name: "What is today's Hijri date?",
        acceptedAnswer: { "@type": "Answer", text: today ? `Today's Hijri date is ${today.hijriDate} ${today.hijriMonth} ${today.hijriYear} AH.` : "The Hijri date is updated daily." },
      },
      {
        "@type": "Question",
        name: "How does the Hijri calendar work?",
        acceptedAnswer: { "@type": "Answer", text: "The Hijri (Islamic) calendar is a lunar calendar with 12 months of 29 or 30 days. The year is about 354 days, making it 11 days shorter than the Gregorian year." },
      },
    ],
  };

  if (!today) {
    return (
      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400 px-6 py-4 rounded-xl text-sm font-medium">
          Could not load prayer times. Please try again later.
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-6 py-2 sm:py-12">
      {jsonLd && (
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: safeJsonLd(jsonLd) }} />
      )}
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: safeJsonLd(faqJsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: safeJsonLd({ "@context": "https://schema.org", "@type": "BreadcrumbList", itemListElement: [{ "@type": "ListItem", position: 1, name: "Home", item: SITE_URL }, { "@type": "ListItem", position: 2, name: "Prayer Times & Hijri Calendar", item: `${SITE_URL}/prayer` }] }) }} />
      <PrayerPageClient defaultTimes={today} defaultCalendar={calendar} />
    </div>
  );
}
