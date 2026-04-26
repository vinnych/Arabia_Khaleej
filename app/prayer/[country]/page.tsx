import { pageMeta, SITE_NAME, SITE_NAME_AR } from "@/lib/seo";
import PrayerClient from "@/components/prayer/PrayerClient";
import {
  BreadcrumbSchema,
  DatasetSchema,
  PlaceSchema,
  WebPageSchema,
  PrayerServiceSchema,
  FAQSchema,
} from "@/components/seo/StructuredData";
import { GCC_COUNTRIES, getCountryBySlug } from "@/lib/countries";
import { notFound } from "next/navigation";

export function generateStaticParams() {
  return GCC_COUNTRIES.map((country) => ({ country: country.slug }));
}

// Rich per-country metadata
const COUNTRY_META: Record<
  string,
  { nameAr: string; capitalAr: string; code: string }
> = {
  "saudi-arabia": { nameAr: "السعودية", capitalAr: "الرياض", code: "SA" },
  "uae":          { nameAr: "الإمارات", capitalAr: "أبوظبي", code: "AE" },
  "qatar":        { nameAr: "قطر", capitalAr: "الدوحة", code: "QA" },
  "kuwait":       { nameAr: "الكويت", capitalAr: "مدينة الكويت", code: "KW" },
  "oman":         { nameAr: "عمان", capitalAr: "مسقط", code: "OM" },
  "bahrain":      { nameAr: "البحرين", capitalAr: "المنامة", code: "BH" },
};

export async function generateMetadata({
  params,
}: {
  params: Promise<{ country: string }>;
}) {
  const { country: countrySlug } = await params;
  const country = getCountryBySlug(countrySlug);
  if (!country) return {};

  const meta = COUNTRY_META[countrySlug] ?? { nameAr: country.name, capitalAr: country.capital, code: "QA" };

  return pageMeta({
    title: `Prayer Times in ${country.name} — ${country.capital} | ${SITE_NAME}`,
    titleAr: `مواقيت الصلاة في ${meta.nameAr} — ${meta.capitalAr} | ${SITE_NAME_AR}`,
    description: `Accurate daily prayer times for ${country.capital}, ${country.name}. Fajr, Sunrise, Dhuhr, Asr, Maghrib and Isha schedules calculated using the Umm Al-Qura University method. Includes Hijri calendar.`,
    descriptionAr: `مواقيت الصلاة اليومية الدقيقة لـ ${meta.capitalAr}، ${meta.nameAr}. جداول الفجر والشروق والظهر والعصر والمغرب والعشاء. تشمل التقويم الهجري.`,
    path: `/prayer/${country.slug}`,
    keywords: [
      `prayer times ${country.name}`,
      `salat times ${country.capital}`,
      `adhan ${country.name}`,
      `Fajr ${country.capital}`,
      `Dhuhr ${country.capital}`,
      `Asr ${country.capital}`,
      `Maghrib ${country.capital}`,
      `Isha ${country.capital}`,
      `hijri calendar ${country.name}`,
      `islamic dates ${country.capital}`,
      country.name,
      country.capital,
      "مواقيت الصلاة",
      meta.nameAr,
      meta.capitalAr,
    ],
    geo: {
      latitude: country.lat,
      longitude: country.lng,
      region: country.region,
      placename: `${country.capital}, ${country.name}`,
    },
  });
}

export default async function CountryPrayerPage({
  params,
}: {
  params: Promise<{ country: string }>;
}) {
  const { country: countrySlug } = await params;
  const country = getCountryBySlug(countrySlug);
  if (!country) notFound();

  const meta = COUNTRY_META[countrySlug] ?? { nameAr: country.name, capitalAr: country.capital, code: "QA" };

  const breadcrumbItems = [
    { name: "Home", item: "/" },
    { name: "Prayer Times", item: "/prayer" },
    { name: country.name, item: `/prayer/${country.slug}` },
  ];

  const geo = {
    latitude: country.lat,
    longitude: country.lng,
    placename: `${country.capital}, ${country.name}`,
  };

  const faqQuestions = [
    {
      question: `What are today's prayer times in ${country.capital}?`,
      answer: `Prayer times in ${country.capital}, ${country.name} are calculated daily using the Umm Al-Qura University method. Fajr, Sunrise, Dhuhr, Asr, Maghrib and Isha times are displayed and updated every 60 seconds on Arabia Khaleej.`,
    },
    {
      question: `What is the Fajr time in ${country.capital}?`,
      answer: `Fajr (pre-dawn prayer) time in ${country.capital} varies daily based on solar position. Check the live display on Arabia Khaleej for today's exact Fajr time in ${country.capital}, ${country.name}.`,
    },
    {
      question: `What calculation method is used for prayer times in ${country.name}?`,
      answer: `The Umm Al-Qura University, Makkah calculation method is used — the official standard for ${country.name} and widely adopted across the Gulf Cooperation Council.`,
    },
    {
      question: `Is there a Hijri calendar for ${country.name}?`,
      answer: `Yes. Arabia Khaleej provides a 7-day Hijri (Islamic lunar) calendar for ${country.capital}, ${country.name}, showing corresponding Gregorian and Hijri dates.`,
    },
  ];

  return (
    <>
      <WebPageSchema
        name={`Prayer Times — ${country.capital}, ${country.name} | Arabia Khaleej`}
        description={`Daily Islamic prayer times for ${country.capital}, ${country.name}. Fajr, Sunrise, Dhuhr, Asr, Maghrib, Isha. Umm Al-Qura method. Includes Hijri calendar.`}
        url={`/prayer/${country.slug}`}
      />
      <BreadcrumbSchema items={breadcrumbItems} />
      <PlaceSchema
        name={`${country.capital}, ${country.name}`}
        description={`${country.capital} is the capital city of ${country.name}. Prayer times are provided for this location using the Umm Al-Qura calculation method.`}
        geo={geo}
      />
      <PrayerServiceSchema
        cityName={country.capital}
        countryName={country.name}
        countryCode={meta.code}
        lat={country.lat}
        lng={country.lng}
      />
      <DatasetSchema
        name={`Prayer Times & Hijri Calendar — ${country.capital}, ${country.name}`}
        description={`Daily Fajr, Sunrise, Dhuhr, Asr, Maghrib and Isha prayer schedules for ${country.capital}, ${country.name}. Umm Al-Qura calculation. 7-day Hijri calendar included. Updated every 60 seconds.`}
        url={`/prayer/${country.slug}`}
        keywords={[
          `prayer times ${country.name}`,
          `salat ${country.capital}`,
          `adhan ${country.capital}`,
          `hijri calendar ${country.name}`,
          meta.nameAr,
          meta.capitalAr,
          "مواقيت الصلاة",
        ]}
      />
      <FAQSchema questions={faqQuestions} />
      <PrayerClient
        initialCity={{
          name: country.capital,
          country: country.name,
          lat: country.lat,
          lng: country.lng,
          slug: country.slug,
        }}
      />
    </>
  );
}
