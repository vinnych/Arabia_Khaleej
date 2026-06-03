import { getT } from "@/lib/i18n-server";
import { pageMeta } from "@/lib/seo";
import TermsClient from "./TermsClient";
import { BreadcrumbSchema } from "@/components/seo/StructuredData";

export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }) {
  const resolvedParams = await params;
  const lang = resolvedParams.lang === 'ar' ? 'ar' : 'en';
  return pageMeta({
    title: "Terms & Conditions | Arabia Khaleej",
    titleAr: "الشروط والأحكام | عربية خليج",
    description:
      "Official terms of service for the Arabia Khaleej regional platform. Understanding our standards and your usage of the GCC Standard.",
    descriptionAr:
      "الشروط الرسمية لخدمة منصة عربية خليج الإقليمية. فهم معاييرنا واستخدامك للمعيار الخليجي.",
    path: "/terms",
    lang,
  });
}



export default async function Page({ params }: { params: Promise<{ lang: string }> }) {
  const resolvedParams = await params;
  const lang = resolvedParams.lang === 'ar' ? 'ar' : 'en';
  const t = await getT(lang);
  const breadcrumbItems = [
    { name: t('home'), item: "/" },
    { name: t('terms'), item: "/terms" },
  ];

  return (
    <>
      <BreadcrumbSchema items={breadcrumbItems} />
      <TermsClient />
    </>
  );
}

