import { pageMeta } from "@/lib/seo";
import AboutClient from "./AboutClient";
import { BreadcrumbSchema, WebPageSchema } from "@/components/seo/StructuredData";
import StructuredData from "@/components/seo/StructuredData";

export const metadata = pageMeta({
  title: "About Arabia Khaleej | The GCC Standard",
  titleAr: "حول عربية خليج | المعيار الخليجي",
  description:
    "Arabia Khaleej is a premier independent digital platform for the Gulf Cooperation Council — providing prayer times, market data, and country guides across Qatar, UAE, Saudi Arabia, Kuwait, Oman, and Bahrain.",
  descriptionAr:
    "عربية خليج منصة رقمية متميزة ومستقلة لدول مجلس التعاون الخليجي — توفر مواقيت الصلاة وبيانات السوق وأدلة الدول في قطر والإمارات والسعودية والكويت وعمان والبحرين.",
  path: "/about",
});

export default function Page() {
  const breadcrumbItems = [
    { name: "Home", item: "/" },
    { name: "About", item: "/about" },
  ];

  return (
    <>
      <WebPageSchema
        name="About Arabia Khaleej | The GCC Standard"
        description="Learn about Arabia Khaleej — the independent regional intelligence platform for the Gulf Cooperation Council."
        url="/about"
      />
      <BreadcrumbSchema items={breadcrumbItems} />
      <StructuredData
        type="AboutPage"
        data={{
          name: "About Arabia Khaleej",
          alternateName: "حول عربية خليج",
          description:
            "Arabia Khaleej is a premier independent digital platform for the Gulf Cooperation Council. Our mission: aggregate, simplify, and surface authoritative regional information — prayer schedules, market intelligence, and sovereign country data — for residents and visitors across the GCC.",
          url: "https://arabiakhaleej.com/about",
          isPartOf: { "@id": "https://arabiakhaleej.com/#website" },
          publisher: { "@id": "https://arabiakhaleej.com/#organization" },
          about: { "@id": "https://arabiakhaleej.com/#organization" },
          inLanguage: ["en", "ar"],
        }}
      />
      <AboutClient />
    </>
  );
}
