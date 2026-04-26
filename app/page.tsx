import { pageMeta } from "@/lib/seo";
import {
  OrganizationSchema,
  WebSiteSchema,
  DatasetSchema,
  WebPageSchema,
  FAQSchema,
} from "@/components/seo/StructuredData";
import HomeClient from "@/components/home/HomeClient";

export const metadata = pageMeta({
  title: "Arabia Khaleej | The GCC Standard — Regional Intelligence Portal",
  titleAr: "عربية خليج | المعيار الخليجي — بوابة الاستخبارات الإقليمية",
  description:
    "The definitive GCC reference: accurate Islamic prayer times for Qatar, UAE, Saudi Arabia, Kuwait, Oman & Bahrain. Live gold rates, GCC stock indices, and sovereign country guides.",
  descriptionAr:
    "المرجع الخليجي النهائي: مواقيت الصلاة الإسلامية لقطر والإمارات والسعودية والكويت وعمان والبحرين. أسعار الذهب المباشرة ومؤشرات الأسهم الخليجية وأدلة الدول.",
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

export default function Home() {
  const faqQuestions = [
    {
      question: "What is Arabia Khaleej?",
      answer:
        "Arabia Khaleej is an independent regional intelligence platform for the Gulf Cooperation Council (GCC). It provides accurate Islamic prayer times, live GCC market data (stocks, gold, currencies), and in-depth country guides for Qatar, UAE, Saudi Arabia, Kuwait, Oman, and Bahrain.",
    },
    {
      question: "Which countries does Arabia Khaleej cover?",
      answer:
        "Arabia Khaleej covers all six GCC member states: Qatar, United Arab Emirates, Saudi Arabia, Kuwait, Sultanate of Oman, and Kingdom of Bahrain.",
    },
    {
      question: "Does Arabia Khaleej have prayer times?",
      answer:
        "Yes. Arabia Khaleej provides daily Fajr, Sunrise, Dhuhr, Asr, Maghrib, and Isha prayer times for Doha, Dubai, Riyadh, Kuwait City, Muscat, and Manama — calculated using the Umm Al-Qura University method.",
    },
    {
      question: "Does Arabia Khaleej support Arabic?",
      answer:
        "Yes. Arabia Khaleej is fully bilingual in English and Arabic, with RTL (right-to-left) layout support, Arabic typography (Amiri font), and bilingual metadata for all GCC Arabic locales.",
    },
    {
      question: "What GCC market data does Arabia Khaleej provide?",
      answer:
        "Arabia Khaleej provides live data for major GCC stock indices (Tadawul/TASI, ADX, DFM, QE Index, Boursa Kuwait), gold spot price (XAU/USD), Brent crude oil, and all six GCC currency exchange rates versus the US Dollar.",
    },
  ];

  return (
    <>
      <WebPageSchema
        name="Arabia Khaleej — The GCC Standard"
        description="The definitive independent reference for the Gulf Cooperation Council. Prayer times, market data, and country guides for all 6 GCC states."
        url="/"
      />
      <DatasetSchema
        name="Arabia Khaleej GCC Regional Intelligence"
        description="Comprehensive structured data platform covering Islamic prayer schedules, GCC equity market indices, gold and commodity prices, GCC currency exchange rates, and sovereign country profiles for Qatar, UAE, Saudi Arabia, Kuwait, Oman, and Bahrain."
        url="/"
        keywords={[
          "GCC", "prayer times", "gold rates", "stock markets", "currencies",
          "Qatar", "UAE", "Saudi Arabia", "Kuwait", "Oman", "Bahrain",
          "مجلس التعاون", "مواقيت الصلاة", "أسعار الذهب",
        ]}
      />
      <FAQSchema questions={faqQuestions} />
      <HomeClient />
    </>
  );
}
