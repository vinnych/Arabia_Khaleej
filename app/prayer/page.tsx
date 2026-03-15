import { getPrayerTimes, getMonthlyPrayerTimes } from "@/lib/prayer";
import PrayerSelector from "@/components/PrayerSelector";
import { safeJsonLd } from "@/lib/utils";
import type { Metadata } from "next";

const SITE_URL = "https://qatar-portal.vercel.app";

export const metadata: Metadata = {
  title: "Prayer Times for Muslim Countries — Doha, Mecca, Dubai & More | Qatar Portal",
  description:
    "Accurate Fajr, Sunrise, Dhuhr, Asr, Maghrib and Isha prayer times for Doha and 35+ Muslim cities worldwide — today and full monthly calendar.",
  alternates: { canonical: `${SITE_URL}/prayer` },
  openGraph: {
    title: "Prayer Times for Muslim Countries — Doha, Mecca, Dubai | Qatar Portal",
    description: "Accurate Fajr, Dhuhr, Asr, Maghrib and Isha prayer times for Doha and 35+ Muslim cities worldwide.",
    url: `${SITE_URL}/prayer`,
    siteName: "Qatar Portal",
    type: "website",
    images: [{ url: `${SITE_URL}/opengraph-image`, width: 1200, height: 630 }],
  },
  twitter: { card: "summary_large_image", title: "Prayer Times for Muslim Countries | Qatar Portal", description: "Accurate prayer times for Doha and 35+ Muslim cities." },
  keywords: [
    "Doha prayer times",
    "Qatar prayer times today",
    "Fajr time Doha",
    "Isha time Qatar",
    `prayer times ${new Date().getFullYear()} Qatar`,
    "salah times Doha",
    "Mecca prayer times",
    "Dubai prayer times",
    "Muslim prayer times",
  ],
};

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
        name: `Doha Prayer Times — ${today.date}`,
        url: `${SITE_URL}/prayer`,
        description: `Fajr: ${today.Fajr}, Dhuhr: ${today.Dhuhr}, Asr: ${today.Asr}, Maghrib: ${today.Maghrib}, Isha: ${today.Isha}`,
        inLanguage: "en",
        isPartOf: { "@type": "WebSite", name: "Qatar Portal", url: SITE_URL },
      }
    : null;

  if (!today) {
    return <p className="text-red-500">Could not load prayer times. Please try again later.</p>;
  }

  return (
    <div>
      {jsonLd && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: safeJsonLd(jsonLd) }}
        />
      )}
      <h1 className="sr-only">Prayer Times for Muslim Countries — Doha, Mecca, Dubai &amp; More</h1>
      <PrayerSelector defaultTimes={today} defaultCalendar={calendar} />
    </div>
  );
}
