import { getPrayerTimes, getMonthlyPrayerTimes } from "@/lib/prayer";
import PrayerSelector from "@/components/PrayerSelector";
import { safeJsonLd } from "@/lib/utils";
import type { Metadata } from "next";
import { notFound } from "next/navigation";

const SITE_URL = "https://qatar-portal.vercel.app";

const CITIES: Record<string, { city: string; country: string; label: string }> = {
  dubai: { city: "Dubai", country: "UAE", label: "Dubai, UAE" },
  "abu-dhabi": { city: "Abu Dhabi", country: "UAE", label: "Abu Dhabi, UAE" },
  riyadh: { city: "Riyadh", country: "Saudi Arabia", label: "Riyadh, Saudi Arabia" },
  jeddah: { city: "Jeddah", country: "Saudi Arabia", label: "Jeddah, Saudi Arabia" },
  "kuwait-city": { city: "Kuwait City", country: "Kuwait", label: "Kuwait City, Kuwait" },
  muscat: { city: "Muscat", country: "Oman", label: "Muscat, Oman" },
  manama: { city: "Manama", country: "Bahrain", label: "Manama, Bahrain" },
  cairo: { city: "Cairo", country: "Egypt", label: "Cairo, Egypt" },
  islamabad: { city: "Islamabad", country: "Pakistan", label: "Islamabad, Pakistan" },
  manila: { city: "Manila", country: "Philippines", label: "Manila, Philippines" },
  dhaka: { city: "Dhaka", country: "Bangladesh", label: "Dhaka, Bangladesh" },
};

export async function generateStaticParams() {
  return Object.keys(CITIES).map((slug) => ({ city: slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ city: string }> }): Promise<Metadata> {
  const { city: slug } = await params;
  const entry = CITIES[slug];
  if (!entry) return {};
  return {
    title: `Prayer Times in ${entry.city} Today — ${entry.label} | Qatar Portal`,
    description: `Accurate Fajr, Dhuhr, Asr, Maghrib and Isha prayer times for ${entry.city}, ${entry.country} — today and monthly calendar.`,
    keywords: [`${entry.city} prayer times`, `prayer times ${entry.city} today`, `Fajr time ${entry.city}`, `salah times ${entry.city}`],
    alternates: { canonical: `${SITE_URL}/prayer/${slug}` },
    openGraph: {
      title: `Prayer Times in ${entry.city} Today | Qatar Portal`,
      description: `Accurate prayer times for ${entry.city}, ${entry.country}.`,
      url: `${SITE_URL}/prayer/${slug}`,
      siteName: "Qatar Portal",
      type: "website",
      images: [{ url: `${SITE_URL}/opengraph-image`, width: 1200, height: 630 }],
    },
    twitter: { card: "summary_large_image" as const, title: `Prayer Times in ${entry.city} Today | Qatar Portal`, description: `Accurate Fajr, Dhuhr, Asr, Maghrib and Isha prayer times for ${entry.city}.` },
  };
}

export default async function CityPrayerPage({ params }: { params: Promise<{ city: string }> }) {
  const { city: slug } = await params;
  const entry = CITIES[slug];
  if (!entry) notFound();

  const now = new Date();
  const year = now.getFullYear();
  const month = now.getMonth() + 1;

  let today = null;
  let calendar: Awaited<ReturnType<typeof getMonthlyPrayerTimes>> = [];

  try {
    [today, calendar] = await Promise.all([
      getPrayerTimes(entry.city, entry.country),
      getMonthlyPrayerTimes(year, month, entry.city, entry.country),
    ]);
  } catch {
    /* show error state below */
  }

  const jsonLd = today
    ? {
        "@context": "https://schema.org",
        "@type": "WebPage",
        name: `${entry.city} Prayer Times — ${today.date}`,
        url: `${SITE_URL}/prayer/${slug}`,
        description: `Fajr: ${today.Fajr}, Dhuhr: ${today.Dhuhr}, Asr: ${today.Asr}, Maghrib: ${today.Maghrib}, Isha: ${today.Isha}`,
        inLanguage: "en",
        isPartOf: { "@type": "WebSite", name: "Qatar Portal", url: SITE_URL },
      }
    : null;

  if (!today) {
    return <p className="text-red-500">Could not load prayer times for {entry.city}. Please try again later.</p>;
  }

  return (
    <div>
      {jsonLd && (
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: safeJsonLd(jsonLd) }} />
      )}
      <div className="mb-4">
        <h1 className="text-xl font-bold text-gray-900 mb-2">Prayer Times in {entry.label}</h1>
        <p className="text-sm text-gray-500 mt-1">
          Also see: <a href="/prayer" className="text-rose-700 hover:underline">Doha, Qatar prayer times</a>
          {" · "}
          {Object.entries(CITIES)
            .filter(([s]) => s !== slug)
            .slice(0, 3)
            .map(([s, e]) => (
              <span key={s}>
                <a href={`/prayer/${s}`} className="text-rose-700 hover:underline">{e.city}</a>
                {" · "}
              </span>
            ))}
        </p>
        <p className="text-sm text-gray-500 mt-1">
          <a href="/hijri-calendar" className="text-rose-700 hover:underline">Hijri Calendar</a>
          {" · "}
          <a href="/ramadan-2026" className="text-rose-700 hover:underline">Ramadan 2026 Guide</a>
        </p>
      </div>
      <PrayerSelector defaultTimes={today} defaultCalendar={calendar} />
    </div>
  );
}
