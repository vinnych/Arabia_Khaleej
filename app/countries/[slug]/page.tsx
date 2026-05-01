import { pageMeta, SITE_NAME } from "@/lib/seo";
import CountryClient from "./Client";
import {
  BreadcrumbSchema,
  CountrySchema,
  DatasetSchema,
  WebPageSchema,
} from "@/components/seo/StructuredData";
import { getT } from "@/lib/i18n-server";

type Props = {
  params: Promise<{ slug: string }>;
};

const COUNTRY_INFO: Record<
  string,
  {
    name: string;
    nameAr: string;
    capital: string;
    iso2: string;
    population: string;
    gdp: string;
    currency: string;
    currencyCode: string;
    officialLanguage: string;
    nationalVision: string;
    wikidata: string;
    geo: { latitude: number; longitude: number; region: string; placename: string };
  }
> = {
  "saudi-arabia": {
    name: "Saudi Arabia",
    nameAr: "المملكة العربية السعودية",
    capital: "Riyadh",
    iso2: "SA",
    population: "36,400,000",
    gdp: "$1.1 Trillion USD",
    currency: "Saudi Riyal",
    currencyCode: "SAR",
    officialLanguage: "Arabic",
    nationalVision: "Vision 2030",
    wikidata: "https://www.wikidata.org/wiki/Q851",
    geo: { latitude: 24.7136, longitude: 46.6753, region: "SA-01", placename: "Riyadh, Saudi Arabia" },
  },
  "united-arab-emirates": {
    name: "United Arab Emirates",
    nameAr: "الإمارات العربية المتحدة",
    capital: "Abu Dhabi",
    iso2: "AE",
    population: "9,900,000",
    gdp: "$507 Billion USD",
    currency: "UAE Dirham",
    currencyCode: "AED",
    officialLanguage: "Arabic",
    nationalVision: "UAE Centennial 2071",
    wikidata: "https://www.wikidata.org/wiki/Q878",
    geo: { latitude: 24.4539, longitude: 54.3773, region: "AE-AZ", placename: "Abu Dhabi, UAE" },
  },
  "qatar": {
    name: "Qatar",
    nameAr: "دولة قطر",
    capital: "Doha",
    iso2: "QA",
    population: "2,900,000",
    gdp: "$237 Billion USD",
    currency: "Qatari Riyal",
    currencyCode: "QAR",
    officialLanguage: "Arabic",
    nationalVision: "National Vision 2030",
    wikidata: "https://www.wikidata.org/wiki/Q846",
    geo: { latitude: 25.2854, longitude: 51.5310, region: "QA-DA", placename: "Doha, Qatar" },
  },
  "kuwait": {
    name: "Kuwait",
    nameAr: "دولة الكويت",
    capital: "Kuwait City",
    iso2: "KW",
    population: "4,300,000",
    gdp: "$184 Billion USD",
    currency: "Kuwaiti Dinar",
    currencyCode: "KWD",
    officialLanguage: "Arabic",
    nationalVision: "New Kuwait 2035",
    wikidata: "https://www.wikidata.org/wiki/Q817",
    geo: { latitude: 29.3759, longitude: 47.9774, region: "KW-KU", placename: "Kuwait City, Kuwait" },
  },
  "oman": {
    name: "Oman",
    nameAr: "سلطنة عُمان",
    capital: "Muscat",
    iso2: "OM",
    population: "5,200,000",
    gdp: "$104 Billion USD",
    currency: "Omani Rial",
    currencyCode: "OMR",
    officialLanguage: "Arabic",
    nationalVision: "Oman 2040",
    wikidata: "https://www.wikidata.org/wiki/Q842",
    geo: { latitude: 23.5859, longitude: 58.4059, region: "OM-MA", placename: "Muscat, Oman" },
  },
  "bahrain": {
    name: "Bahrain",
    nameAr: "مملكة البحرين",
    capital: "Manama",
    iso2: "BH",
    population: "1,500,000",
    gdp: "$44 Billion USD",
    currency: "Bahraini Dinar",
    currencyCode: "BHD",
    officialLanguage: "Arabic",
    nationalVision: "Economic Vision 2030",
    wikidata: "https://www.wikidata.org/wiki/Q398",
    geo: { latitude: 26.2285, longitude: 50.5860, region: "BH-13", placename: "Manama, Bahrain" },
  },
};

export async function generateMetadata({ params }: Props) {
  const { slug } = await params;
  const t = await getT();
  const info = COUNTRY_INFO[slug] ?? COUNTRY_INFO["qatar"];
  
  const countryName = t(
    slug === 'saudi-arabia' ? 'saudiArabia' : 
    slug === 'united-arab-emirates' ? 'uae' : 
    slug === 'qatar' ? 'qatar' : 
    slug === 'kuwait' ? 'kuwait' : 
    slug === 'oman' ? 'oman' : 
    slug === 'bahrain' ? 'bahrain' : slug as any
  );

  const capitalName = t(
    slug === 'saudi-arabia' ? 'riyadh' : 
    slug === 'united-arab-emirates' ? 'abuDhabi' : 
    slug === 'qatar' ? 'doha' : 
    slug === 'kuwait' ? 'kuwaitCity' : 
    slug === 'oman' ? 'muscat' : 
    slug === 'bahrain' ? 'manama' : 'doha'
  );

  const keyPrefix = slug === 'united-arab-emirates' ? 'uae' : slug.split('-')[0];

  return pageMeta({
    title: `${countryName} | ${t('regionalGuides')} | ${SITE_NAME}`,
    description: `${t('guideDesc')}: ${countryName}. ${t('capital')}: ${capitalName}. ${t('vision')}: ${t(keyPrefix + 'Vision' as any)}.`,
    path: `/countries/${slug}`,
    type: "article",
  });
}

export default async function Page({ params }: Props) {
  const { slug } = await params;
  const info = COUNTRY_INFO[slug] ?? COUNTRY_INFO["qatar"];
  const t = await getT();

  const countryName = t(
    slug === 'saudi-arabia' ? 'saudiArabia' : 
    slug === 'united-arab-emirates' ? 'uae' : 
    slug === 'qatar' ? 'qatar' : 
    slug === 'kuwait' ? 'kuwait' : 
    slug === 'oman' ? 'oman' : 
    slug === 'bahrain' ? 'bahrain' : slug as any
  );

  const capitalName = t(
    slug === 'saudi-arabia' ? 'riyadh' : 
    slug === 'united-arab-emirates' ? 'abuDhabi' : 
    slug === 'qatar' ? 'doha' : 
    slug === 'kuwait' ? 'kuwaitCity' : 
    slug === 'oman' ? 'muscat' : 
    slug === 'bahrain' ? 'manama' : 'doha'
  );

  const breadcrumbItems = [
    { name: t('home'), item: "/" },
    { name: t('countries'), item: "/#countries" },
    { name: countryName, item: `/countries/${slug}` },
  ];

  const keyPrefix = slug === 'united-arab-emirates' ? 'uae' : slug.split('-')[0];

  return (
    <>
      <WebPageSchema
        name={`${countryName} ${t('regionalGuides')} | ${SITE_NAME}`}
        description={`${t('guideDesc')} for ${countryName}. ${t('population')} ${t(keyPrefix + 'Pop' as any)}, ${t('economy')} ${t(keyPrefix + 'Gdp' as any)}, ${t('capital')} ${capitalName}.`}
        url={`/countries/${slug}`}
        datePublished="2024-01-01T00:00:00Z"
      />
      <BreadcrumbSchema items={breadcrumbItems} />
      <CountrySchema
        name={info.name}
        nameAr={info.nameAr}
        description={`${countryName} ${t(keyPrefix + 'Intro' as any)}`}
        capital={capitalName}
        iso2={info.iso2}
        population={t(keyPrefix + 'Pop' as any)}
        gdp={t(keyPrefix + 'Gdp' as any)}
        currency={t(keyPrefix + 'CurrencyName' as any)}
        currencyCode={info.currencyCode}
        officialLanguage={t('language')}
        nationalVision={t(keyPrefix + 'Vision' as any)}
        geo={info.geo}
        url={`/countries/${slug}`}
        wikidata={info.wikidata}
      />
      <DatasetSchema
        name={`${countryName} ${t('regionalIntelligence')}`}
        description={`${t('guideDesc')} for ${countryName}: ${t('population')} ${t(keyPrefix + 'Pop' as any)}, ${t('economy')} ${t(keyPrefix + 'Gdp' as any)}.`}
        url={`/countries/${slug}`}
      />
      <CountryClient />
    </>
  );
}
