import { pageMeta, SITE_NAME, SITE_NAME_AR } from "@/lib/seo";
import PrayerClient from "@/components/prayer/PrayerClient";
import {
  BreadcrumbSchema,
  DatasetSchema,
  WebPageSchema,
  FAQSchema,
} from "@/components/seo/StructuredData";
import StructuredData from "@/components/seo/StructuredData";
import { getT } from "@/lib/i18n-server";

export const metadata = pageMeta({
  title: `Prayer Times GCC — Qatar, UAE, Saudi Arabia, Kuwait, Oman, Bahrain | ${SITE_NAME}`,
  titleAr: `مواقيت الصلاة في دول الخليج — قطر، الإمارات، السعودية، الكويت، عمان، البحرين | ${SITE_NAME_AR}`,
  description:
    "Accurate daily prayer times (Fajr, Dhuhr, Asr, Maghrib, Isha) for all 6 GCC countries. Calculated using the Umm Al-Qura University method. Covers Doha, Dubai, Riyadh, Kuwait City, Muscat, and Manama.",
  descriptionAr:
    "مواقيت الصلاة اليومية الدقيقة (الفجر، الظهر، العصر، المغرب، العشاء) لجميع دول مجلس التعاون الستة. محسوبة بطريقة جامعة أم القرى. تشمل الدوحة ودبي والرياض ومدينة الكويت ومسقط والمنامة.",
  path: "/prayer",
  keywords: [
    "prayer times", "salat times", "adhan", "GCC prayer times",
    "Fajr time Doha", "Dhuhr Dubai", "Asr Riyadh", "Maghrib Kuwait",
    "Isha Muscat", "prayer times Manama", "Umm Al-Qura calculation",
    "hijri calendar", "Islamic dates GCC",
    "مواقيت الصلاة", "الأذان", "التقويم الهجري", "صلاة الفجر الدوحة",
  ],
  geo: {
    latitude: 25.2854,
    longitude: 51.5310,
    region: "GCC",
    placename: "Gulf Cooperation Council",
  },
});

export default async function PrayerPage() {
  const t = await getT();
  const breadcrumbItems = [
    { name: t('home'), item: "/" },
    { name: t('prayerTimes'), item: "/prayer" },
  ];

  const faqQuestions = [
    {
      question: "How are prayer times calculated on Arabia Khaleej?",
      answer:
        "Prayer times are calculated using the Umm Al-Qura University (Makkah) method, the official standard for Saudi Arabia and widely used across the GCC. A local engine (Adhan.js) is used as a failover if the primary API is unreachable.",
    },
    {
      question: "Which GCC cities have prayer times on this site?",
      answer:
        "Arabia Khaleej provides prayer times for Doha (Qatar), Dubai and Abu Dhabi (UAE), Riyadh (Saudi Arabia), Kuwait City (Kuwait), Muscat (Oman), and Manama (Bahrain).",
    },
    {
      question: "What prayers are listed?",
      answer:
        "The five daily prayers plus Sunrise are listed: Fajr (pre-dawn), Sunrise (Shuruq), Dhuhr (midday), Asr (afternoon), Maghrib (sunset), and Isha (night).",
    },
    {
      question: "Does Arabia Khaleej show the Hijri calendar?",
      answer:
        "Yes. A full 7-day Hijri (Islamic) calendar is available for each city, showing the corresponding Hijri dates alongside Gregorian dates.",
    },
    {
      question: "How often are prayer times updated?",
      answer:
        "Prayer times are refreshed every 60 seconds from the Al-Adhan API. The next upcoming prayer is highlighted in real time.",
    },
  ];

  return (
    <>
      <WebPageSchema
        name="GCC Prayer Times Portal — Arabia Khaleej"
        description="Daily Islamic prayer times for all 6 GCC countries. Fajr, Dhuhr, Asr, Maghrib, Isha. Calculated by Umm Al-Qura method."
        url="/prayer"
      />
      <BreadcrumbSchema items={breadcrumbItems} />
      <DatasetSchema
        name="GCC Regional Prayer Times & Hijri Calendar"
        description="Daily prayer schedules (Fajr, Sunrise, Dhuhr, Asr, Maghrib, Isha) for Doha, Dubai, Riyadh, Kuwait City, Muscat, and Manama. Calculated using Umm Al-Qura University method. Includes 7-day Hijri calendar."
        url="/prayer"
        keywords={[
          "prayer times", "salat", "adhan", "Fajr", "Dhuhr", "Asr", "Maghrib", "Isha",
          "Hijri calendar", "Islamic dates", "Doha", "Dubai", "Riyadh", "Kuwait City", "Muscat", "Manama",
          "مواقيت الصلاة", "التقويم الهجري",
        ]}
      />
      <StructuredData
        type="Service"
        data={{
          name: "GCC Prayer Information Portal",
          alternateName: "بوابة مواقيت الصلاة الخليجية",
          description:
            "Comprehensive daily Islamic prayer time service for all Gulf Cooperation Council countries. Covers Qatar, UAE, Saudi Arabia, Kuwait, Oman, and Bahrain.",
          serviceType: "Religious Information Service",
          provider: { "@id": `https://arabiakhaleej.com/#organization` },
          areaServed: [
            { "@type": "Country", name: "Qatar" },
            { "@type": "Country", name: "Saudi Arabia" },
            { "@type": "Country", name: "United Arab Emirates" },
            { "@type": "Country", name: "Kuwait" },
            { "@type": "Country", name: "Oman" },
            { "@type": "Country", name: "Bahrain" },
          ],
          availableLanguage: [
            { "@type": "Language", name: "English" },
            { "@type": "Language", name: "Arabic", alternateName: "العربية" },
          ],
          additionalProperty: [
            { "@type": "PropertyValue", name: "Calculation Method", value: "Umm Al-Qura University, Makkah" },
            { "@type": "PropertyValue", name: "Prayers Covered", value: "Fajr, Sunrise, Dhuhr, Asr, Maghrib, Isha" },
            { "@type": "PropertyValue", name: "Update Frequency", value: "Every 60 seconds" },
            { "@type": "PropertyValue", name: "Calendar Included", value: "7-day Hijri (Islamic) Calendar" },
            { "@type": "PropertyValue", name: "Countries Covered", value: "Qatar, UAE, Saudi Arabia, Kuwait, Oman, Bahrain" },
            { "@type": "PropertyValue", name: "Cities Covered", value: "Doha, Dubai, Riyadh, Kuwait City, Muscat, Manama" },
          ],
          url: "https://arabiakhaleej.com/prayer",
        }}
      />
      <FAQSchema questions={faqQuestions} />
      <PrayerClient />
    </>
  );
}
