import { getT } from "@/lib/i18n-server";
import { pageMeta } from "@/lib/seo";
import AboutClient from "./AboutClient";
import { BreadcrumbSchema, WebPageSchema } from "@/components/seo/StructuredData";
import StructuredData from "@/components/seo/StructuredData";

export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }) {
  const resolvedParams = await params;
  const lang = resolvedParams.lang === 'ar' ? 'ar' : 'en';
  return pageMeta({
    title: "About Arabia Khaleej | The GCC Standard",
    titleAr: "حول عربية خليج | المعيار الخليجي",
    description:
      "Arabia Khaleej is a premier independent digital platform for the Gulf Cooperation Council — providing prayer times, currency exchange rates, and country guides across Qatar, UAE, Saudi Arabia, Kuwait, Oman, and Bahrain.",
    descriptionAr:
      "عربية خليج منصة رقمية متميزة ومستقلة لدول مجلس التعاون الخليجي — توفر مواقيت الصلاة وأسعار الصرف وأدلة الدول في قطر والإمارات والسعودية والكويت وعمان والبحرين.",
    path: "/about",
    lang,
  });
}



export default async function Page({ params }: { params: Promise<{ lang: string }> }) {
  const resolvedParams = await params;
  const lang = resolvedParams.lang === 'ar' ? 'ar' : 'en';
  const t = await getT(lang);
  const breadcrumbItems = [
    { name: t('home'), item: "/" },
    { name: t('about'), item: "/about" },
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
            "Arabia Khaleej is a premier independent digital platform for the Gulf Cooperation Council. Our mission: aggregate, simplify, and surface authoritative regional information — prayer schedules, currency exchange dynamics, and sovereign country data — for residents and visitors across the GCC.",
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

