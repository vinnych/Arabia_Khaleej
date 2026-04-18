import { pageMeta, SITE_NAME } from "@/lib/seo";
import FinanceClient from "@/components/FinanceClient";
import StructuredData from "@/components/StructuredData";

export const metadata = pageMeta({
  title: `Market Insights — GCC Gold & Currency Rates | ${SITE_NAME}`,
  description: "Live GCC market insights including gold rates and currency exchange for QAR, SAR, AED, KWD, BHD, and OMR.",
  path: "/finance",
  keywords: ["GCC finance", "gold rates", "currency exchange", "market insights", "Qatari Riyal", "Saudi Riyal", "UAE Dirham", "Kuwaiti Dinar", "Omani Rial", "Bahraini Dinar", "GCC economy"],
  geo: {
    latitude: 25.2854,
    longitude: 51.5310,
    region: "GCC",
    placename: "Gulf Cooperation Council",
  },
});

export default function FinancePage() {
  const breadcrumbData = {
    "@type": "BreadcrumbList",
    "itemListElement": [
      {
        "@type": "ListItem",
        "position": 1,
        "name": "Home",
        "item": "https://arabiakhaleej.com"
      },
      {
        "@type": "ListItem",
        "position": 2,
        "name": "Market Insights",
        "item": "https://arabiakhaleej.com/finance"
      }
    ]
  };

  const datasetData = {
    "@type": "Dataset",
    "name": "GCC Market & Exchange Rates",
    "description": "Real-time currency exchange rates and gold prices for the Gulf Cooperation Council region.",
    "url": "https://arabiakhaleej.com/finance",
    "spatialCoverage": "GCC",
    "temporalCoverage": "2024",
    "isAccessibleForFree": true,
    "creator": {
      "@type": "Organization",
      "name": SITE_NAME
    }
  };

  const serviceData = {
    "@type": "Service",
    "serviceType": "Financial Information Service",
    "provider": {
      "@type": "Organization",
      "name": SITE_NAME
    },
    "areaServed": ["QA", "SA", "AE", "KW", "OM", "BH"],
    "hasOfferCatalog": {
      "@type": "OfferCatalog",
      "name": "Market Data",
      "itemListElement": [
        { "@type": "Offer", "itemOffered": { "@type": "Service", "name": "Gold Rates" } },
        { "@type": "Offer", "itemOffered": { "@type": "Service", "name": "Currency Exchange" } }
      ]
    }
  };

  return (
    <>
      <StructuredData type="BreadcrumbList" data={breadcrumbData} />
      <StructuredData type="Dataset" data={datasetData} />
      <StructuredData type="Service" data={serviceData} />
      <FinanceClient />
    </>
  );
}

