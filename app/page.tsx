import { pageMeta, SITE_DESCRIPTION, SITE_DESCRIPTION_AR } from "@/lib/seo";
import {
  DatasetSchema,
  WebPageSchema,
  FAQSchema,
} from "@/components/seo/StructuredData";
import HomeClient from "@/components/home/HomeClient";
import { translations } from "@/lib/i18n-data";
import { getServerLanguage } from "@/lib/i18n-server";

export const metadata = pageMeta({
  title: "Arabia Khaleej | The GCC Standard — Regional Intelligence Portal",
  titleAr: "عربية خليج | المعيار الخليجي — بوابة الاستخبارات الإقليمية",
  description: SITE_DESCRIPTION,
  descriptionAr: SITE_DESCRIPTION_AR,
  path: "/",
  keywords: [
    "Arabia Khaleej", "GCC guide", "Gulf Cooperation Council",
    "prayer times GCC", "GCC gold rates", "GCC stock markets",
    "Qatar guide", "UAE guide", "Saudi Arabia guide",
    "Kuwait guide", "Oman guide", "Bahrain guide",
    "expat GCC", "GCC regional intelligence",
    "عربية خليج", "دليل الخليج", "مواقيت الصلاة", "أسعار الذهب",
    "مجلس التعاون الخليجي",
  ],
});

import { getT } from "@/lib/i18n-server";

export default async function Home() {
  const lang = await getServerLanguage();
  const t = await getT();
  
  const faqQuestions = [
    {
      question: translations.faqWhatIsTitle[lang],
      answer: translations.faqWhatIsBody[lang],
    },
    {
      question: translations.faqCountriesTitle[lang],
      answer: translations.faqCountriesBody[lang],
    },
    {
      question: translations.faqPrayerTitle[lang],
      answer: translations.faqPrayerBody[lang],
    },
    {
      question: translations.faqBilingualTitle[lang],
      answer: translations.faqBilingualBody[lang],
    },
    {
      question: translations.faqMarketTitle[lang],
      answer: translations.faqMarketBody[lang],
    },
  ];

  return (
    <>
      <WebPageSchema
        name={t("homeSchemaName")}
        description={t("homeSchemaDesc")}
        url="/"
      />
      <DatasetSchema
        name={t("homeDatasetName")}
        description={t("homeDatasetDesc")}
        url="/"
        keywords={[
          "GCC", "prayer times", "gold rates", "stock markets", "currencies",
          "Qatar", "UAE", "Saudi Arabia", "Kuwait", "Oman", "Bahrain",
          "Ù…Ø¬Ù„Ø³ Ø§Ù„ØªØ¹Ø§ÙˆÙ†", "Ù…ÙˆØ§Ù‚ÙŠØª Ø§Ù„ØµÙ„Ø§Ø©", "Ø£Ø³Ø¹Ø§Ø± Ø§Ù„Ø°Ù‡Ø¨",
        ]}
      />
      <FAQSchema questions={faqQuestions} />
      <HomeClient />
    </>
  );
}

