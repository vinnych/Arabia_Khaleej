export interface GCCCountry {
  name: string;
  slug: string;
  capital: string;
  lat: number;
  lng: number;
  region: string;
  flag: string;
}

export const GCC_COUNTRIES: GCCCountry[] = [
  {
    name: "Qatar",
    slug: "qatar",
    capital: "Doha",
    lat: 25.2854,
    lng: 51.5310,
    region: "QA-DA",
    flag: "🇶🇦",
  },
  {
    name: "United Arab Emirates",
    slug: "uae",
    capital: "Dubai",
    lat: 25.2048,
    lng: 55.2708,
    region: "AE-DU",
    flag: "🇦🇪",
  },
  {
    name: "Saudi Arabia",
    slug: "saudi-arabia",
    capital: "Riyadh",
    lat: 24.7136,
    lng: 46.6753,
    region: "SA-01",
    flag: "🇸🇦",
  },
  {
    name: "Kuwait",
    slug: "kuwait",
    capital: "Kuwait City",
    lat: 29.3759,
    lng: 47.9774,
    region: "KW-KU",
    flag: "🇰🇼",
  },
  {
    name: "Oman",
    slug: "oman",
    capital: "Muscat",
    lat: 23.5859,
    lng: 58.4059,
    region: "OM-MA",
    flag: "🇴🇲",
  },
  {
    name: "Bahrain",
    slug: "bahrain",
    capital: "Manama",
    lat: 26.2285,
    lng: 50.5860,
    region: "BH-13",
    flag: "🇧🇭",
  },
];

export function getCountryBySlug(slug: string) {
  return GCC_COUNTRIES.find((c) => c.slug === slug);
}
