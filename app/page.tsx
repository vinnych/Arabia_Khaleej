import { pageMeta, SITE_DESCRIPTION, SITE_DESCRIPTION_AR } from "@/lib/seo";
import {
  DatasetSchema,
  WebPageSchema,
  FAQSchema,
} from "@/components/seo/StructuredData";
import HomeClient from "@/components/home/HomeClient";
import { getServerLanguage, getT } from "@/lib/i18n-server";

import { getUnifiedInsights } from "@/lib/insights";

export const runtime = 'nodejs';

export async function generateMetadata() {
  const lang = await getServerLanguage();
  
  return pageMeta({
    title: "Arabia Khaleej | The GCC Standard — Regional Intelligence Portal",
    titleAr: "عربية خليج | المعيار الخليجي — بوابة الاستخبارات الإقليمية",
    description: SITE_DESCRIPTION,
    descriptionAr: SITE_DESCRIPTION_AR,
    path: "/",
    lang,
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
}

export default async function Home() {
  const t = await getT();
  const lang = await getServerLanguage();
  const insights = await getUnifiedInsights({ lang, limit: 4 });
  
  const faqQuestions = [
    {
      question: t("faqWhatIsTitle"),
      answer: t("faqWhatIsBody"),
    },
    {
      question: t("faqCountriesTitle"),
      answer: t("faqCountriesBody"),
    },
    {
      question: t("faqPrayerTitle"),
      answer: t("faqPrayerBody"),
    },
    {
      question: t("faqBilingualTitle"),
      answer: t("faqBilingualBody"),
    },
    {
      question: t("faqMarketTitle"),
      answer: t("faqMarketBody"),
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
          "مجلس التعاون", "مواقيت الصلاة", "أسعار الذهب",
        ]}
      />
      <FAQSchema questions={faqQuestions} />
      <HomeClient initialInsights={insights} />
    </>
  );
}
