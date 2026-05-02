import { pageMeta, SITE_NAME, SITE_NAME_AR } from "@/lib/seo";
import MarketInsightClient from "@/components/finance/MarketInsightClient";
import {
  BreadcrumbSchema,
  DatasetSchema,
  WebPageSchema,
  ExchangeRateSchema,
  CommoditySchema,
} from "@/components/seo/StructuredData";
import StructuredData from "@/components/seo/StructuredData";
import { getT } from "@/lib/i18n-server";

export const metadata = pageMeta({
  title: `Market Insight — GCC Stocks, Gold & Currencies | ${SITE_NAME}`,
  titleAr: `رؤى السوق — الأسهم الخليجية والذهب والعملات | ${SITE_NAME_AR}`,
  description:
    "Real-time GCC market data: Tadawul (TASI), ADX, DFM, QE Index. Gold XAU/USD spot prices. GCC currency rates vs USD. Updated every 30 seconds for executive precision.",
  descriptionAr:
    "بيانات السوق الخليجي الفورية: تداول (تاسي)، سوق أبوظبي، سوق دبي المالي، مؤشر قطر. أسعار الذهب والعملات. تحديث كل 30 ثانية لدقة التنفيذيين.",
  path: "/market-insight",
  keywords: [
    "GCC stocks", "Tadawul", "TASI", "ADX", "DFM", "QE Index", "Boursa Kuwait",
    "gold rates", "XAU/USD", "GCC currencies", "AED USD", "SAR USD", "QAR USD",
    "KWD USD", "OMR USD", "BHD USD", "Brent crude", "GCC economy",
    "أسهم الخليج", "تداول", "أسعار الذهب", "أسعار الصرف",
  ],
});

const STATIC_CURRENCIES = [
  { code: "AED", name: "UAE Dirham", nameAr: "درهم إماراتي", rate: 3.6725, country: "United Arab Emirates" },
  { code: "SAR", name: "Saudi Riyal", nameAr: "ريال سعودي", rate: 3.7500, country: "Saudi Arabia" },
  { code: "QAR", name: "Qatari Riyal", nameAr: "ريال قطري", rate: 3.6400, country: "Qatar" },
  { code: "KWD", name: "Kuwaiti Dinar", nameAr: "دينار كويتي", rate: 0.3070, country: "Kuwait" },
  { code: "OMR", name: "Omani Rial", nameAr: "ريال عماني", rate: 0.3850, country: "Oman" },
  { code: "BHD", name: "Bahraini Dinar", nameAr: "دينار بحريني", rate: 0.3770, country: "Bahrain" },
];

export default async function MarketInsightPage() {
  const t = await getT();
  const breadcrumbItems = [
    { name: t('home'), item: "/" },
    { name: t('marketInsights'), item: "/market-insight" },
  ];

  return (
    <>
      <WebPageSchema
        name="GCC Market Insight — Stocks, Gold & Currencies"
        description="Live GCC equity indices, gold spot price, Brent crude, and all GCC currency exchange rates vs USD."
        url="/market-insight"
      />
      <BreadcrumbSchema items={breadcrumbItems} />
      <DatasetSchema
        name="GCC Market Intelligence Dataset"
        description="Aggregated real-time and delayed data for GCC stock exchanges (Tadawul, ADX, DFM, QE, Boursa Kuwait), precious metals (Gold XAU/USD, Brent Crude), and all GCC currency exchange rates vs USD."
        url="/market-insight"
        keywords={["Tadawul", "ADX", "DFM", "QE Index", "gold", "Brent crude", "AED", "SAR", "QAR", "KWD", "OMR", "BHD"]}
      />
      <StructuredData
        type="ItemList"
        data={{
          name: "GCC Stock Market Indices",
          alternateName: "مؤشرات أسواق الأسهم الخليجية",
          description: "Major stock exchange indices across the Gulf Cooperation Council region.",
          numberOfItems: 5,
          itemListElement: [
            {
              "@type": "ListItem", position: 1,
              item: {
                "@type": "Thing", name: "Tadawul All Share Index (TASI)",
                description: "Saudi Arabia's main stock exchange index. Largest bourse in the MENA region.",
                url: "https://www.saudiexchange.sa",
                additionalProperty: [
                  { "@type": "PropertyValue", name: "Ticker", value: "TASI" },
                  { "@type": "PropertyValue", name: "Country", value: "Saudi Arabia" },
                  { "@type": "PropertyValue", name: "Currency", value: "SAR" },
                ],
              },
            },
            {
              "@type": "ListItem", position: 2,
              item: {
                "@type": "Thing", name: "ADX General Index",
                description: "Abu Dhabi Securities Exchange general index.",
                url: "https://www.adx.ae",
                additionalProperty: [
                  { "@type": "PropertyValue", name: "Ticker", value: "ADI" },
                  { "@type": "PropertyValue", name: "Country", value: "United Arab Emirates" },
                  { "@type": "PropertyValue", name: "Currency", value: "AED" },
                ],
              },
            },
            {
              "@type": "ListItem", position: 3,
              item: {
                "@type": "Thing", name: "Dubai Financial Market Index (DFMGI)",
                description: "Dubai Financial Market general index.",
                url: "https://www.dfm.ae",
                additionalProperty: [
                  { "@type": "PropertyValue", name: "Ticker", value: "DFMGI" },
                  { "@type": "PropertyValue", name: "Country", value: "United Arab Emirates" },
                  { "@type": "PropertyValue", name: "Currency", value: "AED" },
                ],
              },
            },
            {
              "@type": "ListItem", position: 4,
              item: {
                "@type": "Thing", name: "Qatar Exchange Index (QE)",
                description: "Qatar Stock Exchange main index.",
                url: "https://www.qe.com.qa",
                additionalProperty: [
                  { "@type": "PropertyValue", name: "Ticker", value: "QE" },
                  { "@type": "PropertyValue", name: "Country", value: "Qatar" },
                  { "@type": "PropertyValue", name: "Currency", value: "QAR" },
                ],
              },
            },
            {
              "@type": "ListItem", position: 5,
              item: {
                "@type": "Thing", name: "Boursa Kuwait All-Share Index",
                description: "Kuwait Stock Exchange all-share index.",
                url: "https://www.boursakuwait.com.kw",
                additionalProperty: [
                  { "@type": "PropertyValue", name: "Ticker", value: "KWSE" },
                  { "@type": "PropertyValue", name: "Country", value: "Kuwait" },
                  { "@type": "PropertyValue", name: "Currency", value: "KWD" },
                ],
              },
            },
          ],
        }}
      />
      <CommoditySchema
        name="Gold Spot Price"
        nameAr="سعر الذهب الفوري"
        symbol="XAU/USD"
        priceCurrency="USD"
        price={2385.40}
        change={1.20}
      />
      <CommoditySchema
        name="Brent Crude Oil"
        nameAr="خام برنت"
        symbol="OIL/USD"
        priceCurrency="USD"
        price={87.50}
        change={-0.45}
      />
      <ExchangeRateSchema currencies={STATIC_CURRENCIES} />
      <MarketInsightClient />
    </>
  );
}
