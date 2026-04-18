import { pageMeta, SITE_NAME } from "@/lib/seo";
import PrayerClient from "@/components/PrayerClient";
import StructuredData from "@/components/StructuredData";
import { GCC_COUNTRIES, getCountryBySlug } from "@/lib/countries";
import { notFound } from "next/navigation";

export function generateStaticParams() {
  return GCC_COUNTRIES.map((country) => ({
    country: country.slug,
  }));
}

export async function generateMetadata({ params }: { params: Promise<{ country: string }> }) {
  const { country: countrySlug } = await params;
  const country = getCountryBySlug(countrySlug);
  if (!country) return {};

  return pageMeta({
    title: `Prayer Times in ${country.name} — ${country.capital} | ${SITE_NAME}`,
    description: `Accurate prayer times for ${country.name} (${country.capital}). Daily schedules for Fajr, Dhuhr, Asr, Maghrib, and Isha based on Umm Al-Qura calculation.`,
    path: `/prayer/${country.slug}`,
    keywords: [`prayer times ${country.name}`, `salat times ${country.capital}`, `adhan ${country.name}`, `hijri calendar ${country.name}`, `islamic dates ${country.capital}`, country.name, country.capital],
    geo: {
      latitude: country.lat,
      longitude: country.lng,
      region: country.region,
      placename: `${country.capital}, ${country.name}`,
    },
  });
}

export default async function CountryPrayerPage({ params }: { params: Promise<{ country: string }> }) {
  const { country: countrySlug } = await params;
  const country = getCountryBySlug(countrySlug);
  if (!country) notFound();

  const breadcrumbData = {
    "@type": "BreadcrumbList",
    "itemListElement": [
      {
        "@type": "ListItem",
        "position": 1,
        "name": "Home",
        "item": "https://arabiakhaleej.com"
      },
      {
        "@type": "ListItem",
        "position": 2,
        "name": "Prayer Times",
        "item": "https://arabiakhaleej.com/prayer"
      },
      {
        "@type": "ListItem",
        "position": 3,
        "name": country.name,
        "item": `https://arabiakhaleej.com/prayer/${country.slug}`
      }
    ]
  };

  const placeData = {
    "@type": "Place",
    "name": `${country.capital}, ${country.name}`,
    "address": {
      "@type": "PostalAddress",
      "addressLocality": country.capital,
      "addressCountry": country.slug === "uae" ? "AE" : country.slug === "saudi-arabia" ? "SA" : country.slug === "kuwait" ? "KW" : country.slug === "oman" ? "OM" : country.slug === "bahrain" ? "BH" : "QA"
    },
    "geo": {
      "@type": "GeoCoordinates",
      "latitude": country.lat,
      "longitude": country.lng
    }
  };

  const datasetData = {
    "@type": "Dataset",
    "name": `Prayer Times and Hijri Calendar for ${country.capital}, ${country.name}`,
    "description": `Official daily prayer times schedule and 7-day Hijri calendar for ${country.capital}, ${country.name}. Based on the Unified Umm Al-Qura calculation method.`,
    "url": `https://arabiakhaleej.com/prayer/${country.slug}`,
    "temporalCoverage": `${new Date().getFullYear()}`,
    "isAccessibleForFree": true,
    "creator": {
      "@type": "Organization",
      "name": "Arabia Khaleej"
    },
    "keywords": ["Prayer Times", "Hijri Calendar", "Salat", "Umm Al-Qura", country.name]
  };

  const hijriDatasetData = {
    "@type": "Dataset",
    "name": `Unified Hijri Calendar for ${country.name}`,
    "description": `7-day Islamic Hijri calendar for ${country.name} (${country.capital}), synchronized with the Umm Al-Qura unified system.`,
    "spatialCoverage": {
      "@type": "Place",
      "name": country.name
    },
    "license": "https://creativecommons.org/licenses/by/4.0/"
  };

  const serviceData = {
    "@type": "Service",
    "serviceType": "Information Service",
    "name": `Prayer & Hijri Service — ${country.capital}`,
    "provider": {
      "@type": "Organization",
      "name": SITE_NAME
    },
    "areaServed": {
      "@type": "City",
      "name": country.capital
    }
  };

  return (
    <>
      <StructuredData type="BreadcrumbList" data={breadcrumbData} />
      <StructuredData type="Place" data={placeData} />
      <StructuredData type="Dataset" data={datasetData} />
      <StructuredData type="Dataset" data={hijriDatasetData} />
      <StructuredData type="Service" data={serviceData} />
      <PrayerClient 
        initialCity={{
          name: country.capital,
          country: country.name,
          lat: country.lat,
          lng: country.lng,
          slug: country.slug
        }} 
      />
    </>
  );
}
