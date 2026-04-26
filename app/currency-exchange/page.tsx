import { pageMeta } from "@/lib/seo";
import { WebPageSchema, DatasetSchema } from "@/components/seo/StructuredData";
import CurrencyExchangeClient from "@/components/finance/CurrencyExchangeClient";

export const metadata = pageMeta({
  title: "Currency Exchange — Live GCC & World Currency Converter",
  titleAr: "تحويل العملات — محوّل العملات الخليجية والعالمية المباشر",
  description:
    "Convert between 40+ currencies with live exchange rates. GCC currencies (AED, SAR, QAR, KWD, OMR, BHD), major pairs (USD, EUR, GBP), and Asian currencies. Real-time rates updated every 30 minutes.",
  descriptionAr:
    "حوّل بين أكثر من 40 عملة بأسعار صرف مباشرة. عملات الخليج (درهم إماراتي، ريال سعودي، ريال قطري، دينار كويتي، ريال عماني، دينار بحريني) والعملات الرئيسية والعملات الآسيوية.",
  path: "/currency-exchange",
  keywords: [
    "currency exchange", "currency converter", "GCC exchange rates",
    "AED to USD", "SAR to USD", "QAR to USD", "KWD to USD",
    "live exchange rates", "money converter", "forex rates GCC",
    "تحويل العملات", "أسعار الصرف", "محول عملات",
    "سعر الدولار", "سعر الريال", "سعر الدرهم",
  ],
});

export default function CurrencyExchangePage() {
  return (
    <>
      <WebPageSchema
        name="Currency Exchange — Live GCC & World Currency Converter"
        description="Convert between 40+ currencies with live exchange rates. Featuring all GCC currencies, major global pairs, MENA, and Asian currencies."
        url="/currency-exchange"
      />
      <DatasetSchema
        name="Arabia Khaleej Live Currency Exchange Rates"
        description="Real-time exchange rates for 40+ currencies including all GCC currencies (AED, SAR, QAR, KWD, OMR, BHD), major pairs (USD, EUR, GBP, JPY, CHF), and regional currencies."
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
