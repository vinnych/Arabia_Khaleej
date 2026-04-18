import { SITE_URL, SITE_NAME, SITE_DESCRIPTION } from "@/lib/seo";

interface StructuredDataProps {
  type: "Organization" | "LocalBusiness" | "WebSite" | "BreadcrumbList" | "Place" | "Dataset" | "Service" | "ItemList";
  data: any;
}

export default function StructuredData({ type, data }: StructuredDataProps) {
  const baseData = {
    "@context": "https://schema.org",
    "@type": type,
    ...data,
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(baseData) }}
    />
  );
}

export function OrganizationSchema() {
  const data = {
    "name": SITE_NAME,
    "description": SITE_DESCRIPTION,
    "url": SITE_URL,
    "logo": `${SITE_URL}/logo-premium-gold.png`,
    "sameAs": [
      "https://twitter.com/arabiakhaleej",
      "https://instagram.com/arabiakhaleej"
    ],
    "address": {
      "@type": "PostalAddress",
      "addressLocality": "Doha",
      "addressCountry": "QA"
    },
    "geo": {
      "@type": "GeoCoordinates",
      "latitude": 25.2854,
      "longitude": 51.5310
    }
  };

  return <StructuredData type="Organization" data={data} />;
}

export function WebSiteSchema() {
  const data = {
    "name": SITE_NAME,
    "url": SITE_URL,
    "potentialAction": {
      "@type": "SearchAction",
      "target": {
        "@type": "EntryPoint",
        "urlTemplate": `${SITE_URL}/search?q={search_term_string}`
      },
      "query-input": "required name=search_term_string"
    }
  };

  return <StructuredData type="WebSite" data={data} />;
}
