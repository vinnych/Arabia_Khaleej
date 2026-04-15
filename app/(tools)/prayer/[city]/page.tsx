import { getPrayerTimes, getMonthlyPrayerTimes } from "@/lib/prayer";
import PrayerSelector from "@/components/PrayerSelector";
import { safeJsonLd } from "@/lib/utils";
import type { Metadata } from "next";
import { notFound } from "next/navigation";

const SITE_URL = "https://qatar-portal.vercel.app";

const CITIES: Record<string, { city: string; country: string; label: string; countryCode: string; geoRegion: string; lat: number; lng: number }> = {
  dubai: { city: "Dubai", country: "UAE", label: "Dubai, UAE", countryCode: "AE", geoRegion: "AE-DU", lat: 25.2048, lng: 55.2708 },
  "abu-dhabi": { city: "Abu Dhabi", country: "UAE", label: "Abu Dhabi, UAE", countryCode: "AE", geoRegion: "AE-AZ", lat: 24.4539, lng: 54.3773 },
  riyadh: { city: "Riyadh", country: "Saudi Arabia", label: "Riyadh, Saudi Arabia", countryCode: "SA", geoRegion: "SA-01", lat: 24.7136, lng: 46.6753 },
  jeddah: { city: "Jeddah", country: "Saudi Arabia", label: "Jeddah, Saudi Arabia", countryCode: "SA", geoRegion: "SA-02", lat: 21.4858, lng: 39.1925 },
  "kuwait-city": { city: "Kuwait City", country: "Kuwait", label: "Kuwait City, Kuwait", countryCode: "KW", geoRegion: "KW-KU", lat: 29.3759, lng: 47.9774 },
  muscat: { city: "Muscat", country: "Oman", label: "Muscat, Oman", countryCode: "OM", geoRegion: "OM-MA", lat: 23.5880, lng: 58.3829 },
  manama: { city: "Manama", country: "Bahrain", label: "Manama, Bahrain", countryCode: "BH", geoRegion: "BH-13", lat: 26.2285, lng: 50.5860 },
  cairo: { city: "Cairo", country: "Egypt", label: "Cairo, Egypt", countryCode: "EG", geoRegion: "EG-C", lat: 30.0444, lng: 31.2357 },
  islamabad: { city: "Islamabad", country: "Pakistan", label: "Islamabad, Pakistan", countryCode: "PK", geoRegion: "PK-IS", lat: 33.6844, lng: 73.0479 },
  manila: { city: "Manila", country: "Philippines", label: "Manila, Philippines", countryCode: "PH", geoRegion: "PH-00", lat: 14.5995, lng: 120.9842 },
  dhaka: { city: "Dhaka", country: "Bangladesh", label: "Dhaka, Bangladesh", countryCode: "BD", geoRegion: "BD-C", lat: 23.8103, lng: 90.4125 },
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
    other: {
      "geo.region": entry.geoRegion,
      "geo.placename": `${entry.city}, ${entry.country}`,
      "geo.position": `${entry.lat};${entry.lng}`,
      "ICBM": `${entry.lat}, ${entry.lng}`,
    },
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
        name: `${entry.city} Prayer Times — Qatar Portal`,
        url: `${SITE_URL}/prayer/${slug}`,
        description: `Daily prayer times for ${entry.city}. Fajr: ${today.Fajr}, Dhuhr: ${today.Dhuhr}, Asr: ${today.Asr}, Maghrib: ${today.Maghrib}, Isha: ${today.Isha}.`,
        inLanguage: "en",
        isPartOf: { "@type": "WebSite", name: "Qatar Portal", url: SITE_URL },
        mainEntity: {
          "@type": "ItemList",
          itemListElement: [
            { "@type": "ListItem", position: 1, name: "Fajr", description: today.Fajr },
            { "@type": "ListItem", position: 2, name: "Dhuhr", description: today.Dhuhr },
            { "@type": "ListItem", position: 3, name: "Asr", description: today.Asr },
            { "@type": "ListItem", position: 4, name: "Maghrib", description: today.Maghrib },
            { "@type": "ListItem", position: 5, name: "Isha", description: today.Isha },
          ],
        },
        about: {
          "@type": "Place",
          name: `${entry.city}, ${entry.country}`,
          geo: { "@type": "GeoCoordinates", latitude: entry.lat, longitude: entry.lng },
          address: { "@type": "PostalAddress", addressLocality: entry.city, addressCountry: entry.countryCode },
        },
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
        <h1 className="font-serif text-xl font-bold text-on-surface mb-2">Prayer Times in {entry.label}</h1>
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
          <a href="/prayer" className="text-rose-700 hover:underline">Prayer Times & Hijri</a>
          {" · "}
          <a href="/qatar-public-holidays" className="text-rose-700 hover:underline">Ramadan 2026 Dates</a>
        </p>
      </div>
      <PrayerSelector defaultTimes={today} defaultCalendar={calendar} />
    </div>
  );
}
