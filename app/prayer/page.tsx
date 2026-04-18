import { pageMeta, SITE_NAME } from "@/lib/seo";
import PrayerClient from "@/components/PrayerClient";
import StructuredData from "@/components/StructuredData";

export const metadata = pageMeta({
  title: `Prayer Times GCC — Qatar, UAE, Saudi Arabia, Kuwait, Oman, Bahrain | ${SITE_NAME}`,
  description: "Comprehensive prayer times for all GCC countries. Accurate schedules for Doha, Dubai, Riyadh, Kuwait City, Muscat, and Manama using the Umm Al-Qura calculation method.",
  path: "/prayer",
  keywords: ["prayer times", "salat times", "adhan", "GCC", "Middle East", "hijri calendar", "Doha", "Dubai", "Riyadh", "Kuwait", "Oman", "Bahrain", "Islamic schedule"],
  geo: {
    latitude: 25.2854,
    longitude: 51.5310,
    region: "GCC",
    placename: "Gulf Cooperation Council",
  },
});


export default function PrayerPage() {
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
      }
    ]
  };

  const datasetData = {
    "@type": "Dataset",
    "name": "GCC Regional Prayer Times & Hijri Calendar",
    "description": "Consolidated prayer time schedules and Hijri calendar data for the entire Gulf Cooperation Council region, including Saudi Arabia, UAE, Qatar, Kuwait, Oman, and Bahrain.",
    "url": "https://arabiakhaleej.com/prayer",
    "spatialCoverage": "GCC",
    "isAccessibleForFree": true,
    "creator": {
      "@type": "Organization",
      "name": SITE_NAME
    }
  };

  const serviceData = {
    "@type": "Service",
    "serviceType": "Religious Information Service",
    "name": "GCC Prayer Information Portal",
    "provider": {
      "@type": "Organization",
      "name": SITE_NAME
    },
    "areaServed": ["QA", "SA", "AE", "KW", "OM", "BH"],
  };

  return (
    <>
      <StructuredData type="BreadcrumbList" data={breadcrumbData} />
      <StructuredData type="Dataset" data={datasetData} />
      <StructuredData type="Service" data={serviceData} />
      <PrayerClient />
    </>
  );
}

