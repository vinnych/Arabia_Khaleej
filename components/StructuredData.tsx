import { SITE_URL, SITE_NAME, SITE_DESCRIPTION } from "@/lib/seo";

interface StructuredDataProps {
  type: string;
  data: Record<string, unknown>;
  id?: string;
}

export default function StructuredData({ type, data, id }: StructuredDataProps) {
  const schema: Record<string, unknown> = {
    "@context": "https://schema.org",
    "@type": type,
    ...(id ? { "@id": id } : {}),
    ...data,
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}

// ─── Organization (full) ────────────────────────────────────────────────────
export function OrganizationSchema() {
  const data = {
    "@id": `${SITE_URL}/#organization`,
    name: SITE_NAME,
    alternateName: "عربية خليج",
    description: SITE_DESCRIPTION,
    url: SITE_URL,
    logo: {
      "@type": "ImageObject",
      url: `${SITE_URL}/logo-premium-gold.png`,
      width: 512,
      height: 512,
    },
    image: `${SITE_URL}/opengraph-image`,
    foundingDate: "2024",
    foundingLocation: {
      "@type": "Place",
      name: "Doha, Qatar",
      address: {
        "@type": "PostalAddress",
        addressLocality: "Doha",
        addressCountry: "QA",
      },
    },
    areaServed: [
      { "@type": "Country", name: "Qatar", sameAs: "https://www.wikidata.org/wiki/Q846" },
      { "@type": "Country", name: "Saudi Arabia", sameAs: "https://www.wikidata.org/wiki/Q851" },
      { "@type": "Country", name: "United Arab Emirates", sameAs: "https://www.wikidata.org/wiki/Q878" },
      { "@type": "Country", name: "Kuwait", sameAs: "https://www.wikidata.org/wiki/Q817" },
      { "@type": "Country", name: "Oman", sameAs: "https://www.wikidata.org/wiki/Q842" },
      { "@type": "Country", name: "Bahrain", sameAs: "https://www.wikidata.org/wiki/Q398" },
    ],
    contactPoint: {
      "@type": "ContactPoint",
      contactType: "Customer Support",
      areaServed: ["QA", "SA", "AE", "KW", "OM", "BH"],
      availableLanguage: [
        { "@type": "Language", name: "English" },
        { "@type": "Language", name: "Arabic", alternateName: "العربية" },
      ],
    },
    sameAs: [
      "https://twitter.com/arabiakhaleej",
      "https://instagram.com/arabiakhaleej",
    ],
    knowsAbout: [
      "Gulf Cooperation Council",
      "Islamic Prayer Times",
      "GCC Financial Markets",
      "Arabian Peninsula",
      "Sovereign Wealth Funds",
      "Vision 2030",
    ],
    hasOfferCatalog: {
      "@type": "OfferCatalog",
      name: "Arabia Khaleej Services",
      itemListElement: [
        { "@type": "Offer", itemOffered: { "@type": "Service", name: "GCC Prayer Times Portal" } },
        { "@type": "Offer", itemOffered: { "@type": "Service", name: "GCC Market Intelligence" } },
        { "@type": "Offer", itemOffered: { "@type": "Service", name: "Regional Country Guides" } },
      ],
    },
  };

  return <StructuredData type="Organization" data={data} />;
}

// ─── WebSite ─────────────────────────────────────────────────────────────────
export function WebSiteSchema() {
  const data = {
    "@id": `${SITE_URL}/#website`,
    name: SITE_NAME,
    alternateName: "عربية خليج | المعيار الخليجي",
    url: SITE_URL,
    description: SITE_DESCRIPTION,
    inLanguage: ["en", "ar"],
    publisher: { "@id": `${SITE_URL}/#organization` },
    copyrightYear: 2024,
    copyrightHolder: { "@id": `${SITE_URL}/#organization` },
  };

  return <StructuredData type="WebSite" data={data} />;
}

// ─── WebPage (use on every page) ─────────────────────────────────────────────
export function WebPageSchema({
  name,
  description,
  url,
  datePublished = "2024-01-01T00:00:00Z",
  dateModified,
  breadcrumb,
}: {
  name: string;
  description: string;
  url: string;
  datePublished?: string;
  dateModified?: string;
  breadcrumb?: string;
}) {
  const data: Record<string, unknown> = {
    "@id": `${SITE_URL}${url}#webpage`,
    name,
    description,
    url: `${SITE_URL}${url}`,
    isPartOf: { "@id": `${SITE_URL}/#website` },
    publisher: { "@id": `${SITE_URL}/#organization` },
    inLanguage: ["en", "ar"],
    datePublished,
    dateModified: dateModified ?? new Date().toISOString(),
    potentialAction: {
      "@type": "ReadAction",
      target: [`${SITE_URL}${url}`],
    },
  };
  if (breadcrumb) data.breadcrumb = breadcrumb;
  return <StructuredData type="WebPage" data={data} />;
}

// ─── NewsArticle ─────────────────────────────────────────────────────────────
export function NewsArticleSchema({
  title,
  description,
  image,
  datePublished,
  dateModified,
  authorName = SITE_NAME,
  publisherName = SITE_NAME,
  publisherLogo = `${SITE_URL}/favicon-emblem.png`,
  url,
}: {
  title: string;
  description: string;
  image?: string;
  datePublished: string;
  dateModified?: string;
  authorName?: string;
  publisherName?: string;
  publisherLogo?: string;
  url: string;
}) {
  const data = {
    headline: title,
    description,
    image: image ? [image] : [`${SITE_URL}/opengraph-image`],
    datePublished,
    dateModified: dateModified ?? datePublished,
    author: {
      "@type": "Organization",
      name: authorName,
      url: SITE_URL,
    },
    publisher: {
      "@type": "Organization",
      name: publisherName,
      logo: {
        "@type": "ImageObject",
        url: publisherLogo,
      },
    },
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": `${SITE_URL}${url}`,
    },
  };
  return <StructuredData type="NewsArticle" data={data} />;
}

// ─── BreadcrumbList ───────────────────────────────────────────────────────────
export function BreadcrumbSchema({ items }: { items: { name: string; item: string }[] }) {
  const data = {
    itemListElement: items.map((i, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: i.name,
      item: `${SITE_URL}${i.item}`,
    })),
  };
  return <StructuredData type="BreadcrumbList" data={data} />;
}

// ─── Country / AdministrativeArea (full sovereign data) ──────────────────────
export function CountrySchema({
  name,
  nameAr,
  description,
  capital,
  iso2,
  population,
  gdp,
  currency,
  currencyCode,
  officialLanguage,
  nationalVision,
  geo,
  url,
  wikidata,
}: {
  name: string;
  nameAr: string;
  description: string;
  capital: string;
  iso2: string;
  population: string;
  gdp: string;
  currency: string;
  currencyCode: string;
  officialLanguage: string;
  nationalVision: string;
  geo: { latitude: number; longitude: number };
  url: string;
  wikidata: string;
}) {
  const data = {
    name,
    alternateName: nameAr,
    description,
    url: `${SITE_URL}${url}`,
    sameAs: wikidata,
    containsPlace: {
      "@type": "City",
      name: capital,
      containedInPlace: { "@type": "Country", name },
    },
    geo: {
      "@type": "GeoCoordinates",
      latitude: geo.latitude,
      longitude: geo.longitude,
    },
    address: {
      "@type": "PostalAddress",
      addressLocality: capital,
      addressCountry: iso2,
    },
    additionalProperty: [
      {
        "@type": "PropertyValue",
        name: "Population",
        value: population,
        unitCode: "C62",
      },
      {
        "@type": "PropertyValue",
        name: "GDP (Nominal)",
        value: gdp,
        unitCode: "USD",
      },
      {
        "@type": "PropertyValue",
        name: "Official Currency",
        value: currency,
        valueReference: currencyCode,
      },
      {
        "@type": "PropertyValue",
        name: "Official Language",
        value: officialLanguage,
      },
      {
        "@type": "PropertyValue",
        name: "National Development Vision",
        value: nationalVision,
      },
    ],
    knowsAbout: [
      { "@type": "Thing", name: nationalVision },
      { "@type": "Thing", name: `${name} Economy` },
      { "@type": "Thing", name: `${name} Prayer Times` },
    ],
  };
  return <StructuredData type="Country" data={data} />;
}

// ─── Place ────────────────────────────────────────────────────────────────────
export function PlaceSchema({
  name,
  description,
  geo,
}: {
  name: string;
  description: string;
  geo: { latitude: number; longitude: number; placename?: string };
}) {
  const data = {
    name,
    description,
    geo: {
      "@type": "GeoCoordinates",
      latitude: geo.latitude,
      longitude: geo.longitude,
    },
    address: {
      "@type": "PostalAddress",
      addressLocality: geo.placename?.split(",")[0],
      addressCountry: geo.placename?.split(",").pop()?.trim(),
    },
  };
  return <StructuredData type="Place" data={data} />;
}

// ─── Dataset ─────────────────────────────────────────────────────────────────
export function DatasetSchema({
  name,
  description,
  url,
  keywords,
}: {
  name: string;
  description: string;
  url: string;
  keywords?: string[];
}) {
  const data: Record<string, unknown> = {
    name,
    description,
    url: `${SITE_URL}${url}`,
    license: `${SITE_URL}/terms`,
    creator: { "@id": `${SITE_URL}/#organization` },
    publisher: { "@id": `${SITE_URL}/#organization` },
    inLanguage: ["en", "ar"],
    isAccessibleForFree: true,
    dateModified: new Date().toISOString(),
  };
  if (keywords?.length) data.keywords = keywords;
  return <StructuredData type="Dataset" data={data} />;
}

// ─── Prayer Times Service ─────────────────────────────────────────────────────
export function PrayerServiceSchema({
  cityName,
  countryName,
  countryCode,
  lat,
  lng,
}: {
  cityName: string;
  countryName: string;
  countryCode: string;
  lat: number;
  lng: number;
}) {
  const data = {
    name: `Islamic Prayer Times — ${cityName}, ${countryName}`,
    alternateName: `مواقيت الصلاة — ${cityName}`,
    description: `Daily Fajr, Dhuhr, Asr, Maghrib and Isha prayer times for ${cityName}, ${countryName}. Calculated using the Umm Al-Qura method.`,
    serviceType: "Religious Information Service",
    provider: { "@id": `${SITE_URL}/#organization` },
    areaServed: {
      "@type": "City",
      name: cityName,
      containedInPlace: { "@type": "Country", name: countryName },
    },
    serviceLocation: {
      "@type": "Place",
      name: cityName,
      geo: { "@type": "GeoCoordinates", latitude: lat, longitude: lng },
      address: {
        "@type": "PostalAddress",
        addressLocality: cityName,
        addressCountry: countryCode,
      },
    },
    availableLanguage: [
      { "@type": "Language", name: "English" },
      { "@type": "Language", name: "Arabic", alternateName: "العربية" },
    ],
    additionalProperty: [
      {
        "@type": "PropertyValue",
        name: "Calculation Method",
        value: "Umm Al-Qura University, Makkah",
      },
      {
        "@type": "PropertyValue",
        name: "Update Frequency",
        value: "Daily",
      },
      {
        "@type": "PropertyValue",
        name: "Prayers Covered",
        value: "Fajr, Sunrise, Dhuhr, Asr, Maghrib, Isha",
      },
    ],
    url: `${SITE_URL}/prayer/${countryCode.toLowerCase()}`,
  };
  return <StructuredData type="Service" data={data} />;
}

// ─── GCC Stock Market ─────────────────────────────────────────────────────────
export function StockExchangeSchema({
  name,
  ticker,
  country,
  currency,
  value,
  change,
}: {
  name: string;
  ticker: string;
  country: string;
  currency: string;
  value: number;
  change: number;
}) {
  const data = {
    name,
    tickerSymbol: ticker,
    exchangeCode: ticker,
    description: `${name} stock market index for ${country}`,
    url: `${SITE_URL}/market-insight`,
    provider: { "@id": `${SITE_URL}/#organization` },
    areaServed: { "@type": "Country", name: country },
    additionalProperty: [
      { "@type": "PropertyValue", name: "Last Value", value, unitCode: currency },
      { "@type": "PropertyValue", name: "Daily Change (%)", value: change },
      { "@type": "PropertyValue", name: "Currency", value: currency },
    ],
  };
  return <StructuredData type="Service" data={data} />;
}

// ─── Currency Exchange Rate ───────────────────────────────────────────────────
export function ExchangeRateSchema({
  currencies,
}: {
  currencies: { code: string; name: string; nameAr: string; rate: number; country: string }[];
}) {
  const data = {
    name: "GCC Currency Exchange Rates vs USD",
    alternateName: "أسعار صرف العملات الخليجية مقابل الدولار",
    description:
      "Live exchange rates for all Gulf Cooperation Council currencies against the US Dollar, including AED, SAR, QAR, KWD, OMR, and BHD.",
    url: `${SITE_URL}/market-insight`,
    provider: { "@id": `${SITE_URL}/#organization` },
    dateModified: new Date().toISOString(),
    additionalProperty: currencies.map((c) => ({
      "@type": "PropertyValue",
      name: `${c.name} (${c.code}) / USD`,
      alternateName: c.nameAr,
      value: c.rate,
      description: `1 USD = ${c.rate.toFixed(4)} ${c.code}. Currency of ${c.country}.`,
    })),
  };
  return <StructuredData type="Dataset" data={data} />;
}

// ─── Gold / Commodity ─────────────────────────────────────────────────────────
export function CommoditySchema({
  name,
  nameAr,
  symbol,
  priceCurrency,
  price,
  change,
}: {
  name: string;
  nameAr: string;
  symbol: string;
  priceCurrency: string;
  price: number;
  change: number;
}) {
  const data = {
    name,
    alternateName: nameAr,
    description: `Live spot price for ${name} (${symbol}). Widely tracked commodity in GCC financial markets.`,
    tickerSymbol: symbol,
    url: `${SITE_URL}/market-insight`,
    provider: { "@id": `${SITE_URL}/#organization` },
    additionalProperty: [
      { "@type": "PropertyValue", name: "Spot Price", value: price, unitCode: priceCurrency },
      { "@type": "PropertyValue", name: "Daily Change (%)", value: change },
      { "@type": "PropertyValue", name: "Currency", value: priceCurrency },
    ],
  };
  return <StructuredData type="Service" data={data} />;
}

// ─── FAQ Page ─────────────────────────────────────────────────────────────────
export function FAQSchema({
  questions,
}: {
  questions: { question: string; answer: string }[];
}) {
  const data = {
    mainEntity: questions.map((q) => ({
      "@type": "Question",
      name: q.question,
      acceptedAnswer: { "@type": "Answer", text: q.answer },
    })),
  };
  return <StructuredData type="FAQPage" data={data} />;
}

// ─── Contact / Inquiry Page ───────────────────────────────────────────────────
export function ContactPageSchema() {
  const data = {
    "@id": `${SITE_URL}/join#contactpage`,
    name: "Arabia Khaleej — Direct Inquiry",
    alternateName: "عربية خليج — استفسار مباشر",
    description:
      "Submit partnership proposals and regional inquiries directly to the Arabia Khaleej team.",
    url: `${SITE_URL}/join`,
    isPartOf: { "@id": `${SITE_URL}/#website` },
    publisher: { "@id": `${SITE_URL}/#organization` },
    contactOption: "TollFree",
    areaServed: ["QA", "SA", "AE", "KW", "OM", "BH"],
    availableLanguage: [
      { "@type": "Language", name: "English" },
      { "@type": "Language", name: "Arabic" },
    ],
  };
  return <StructuredData type="ContactPage" data={data} />;
}
