import { getT } from '@/lib/i18n/i18n-server';
import { pageMeta, SITE_NAME, SITE_NAME_AR } from '@/lib/seo/seo';
import CurrencyExchangeClient from "@/components/finance/CurrencyExchangeClient";
import { WebPageSchema, DatasetSchema, BreadcrumbSchema } from "@/components/seo/StructuredData";

export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }) {
  const resolvedParams = await params;
  const lang = resolvedParams.lang === 'ar' ? 'ar' : 'en';
  return pageMeta({
    title: "Currency Exchange — Live GCC & World Currency Converter",
    titleAr: "تحويل العملات — محوّل العملات الخليجية والعالمية المباشر",
    description:
      "Convert between 40+ currencies with live exchange rates. GCC currencies (AED, SAR, QAR, KWD, OMR, BHD), major pairs (USD, EUR, GBP), and Asian currencies. Real-time rates updated every 30 minutes.",
    descriptionAr:
      "حوّل بين أكثر من 40 عملة بأسعار صرف مباشرة. عملات الخليج (درهم إماراتي، ريال سعودي، ريال قطري، دينار كويتي، ريال عماني، دينار بحريني) والعملات الرئيسية والعملات الآسيوية.",
    path: "/currency-exchange",
    lang,
    keywords: [
      "currency exchange", "currency converter", "GCC exchange rates",
      "AED to USD", "SAR to USD", "QAR to USD", "KWD to USD",
      "live exchange rates", "money converter", "forex rates GCC",
      "تحويل العملات", "أسعار الصرف", "محول عملات",
      "سعر الدولار", "سعر الريال", "سعر الدرهم",
    ],
  });
}



export default async function CurrencyExchangePage({ params }: { params: Promise<{ lang: string }> }) {
  const resolvedParams = await params;
  const lang = resolvedParams.lang === 'ar' ? 'ar' : 'en';
  const t = await getT(lang);
  const breadcrumbItems = [
    { name: t("home"), item: "/" },
    { name: t("currencyExchange"), item: "/currency-exchange" },
  ];

  return (
    <>
      <WebPageSchema
        name={t("currencyExchangeSchemaName")}
        description={t("currencyExchangeSchemaDesc")}
        url="/currency-exchange"
      />
      <BreadcrumbSchema items={breadcrumbItems} />
      <DatasetSchema
        name={t("currencyExchangeDatasetName")}
        description={t("currencyExchangeDatasetDesc")}
        url="/currency-exchange"
        keywords={[
          "exchange rates", "currency converter", "GCC currencies",
          "forex", "live rates", "تحويل العملات", "أسعار الصرف",
        ]}
      />
      <CurrencyExchangeClient />
    </>
  );
}
