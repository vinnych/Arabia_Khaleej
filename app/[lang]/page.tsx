import { pageMeta, SITE_DESCRIPTION, SITE_DESCRIPTION_AR } from '@/lib/seo/seo';
import {
  DatasetSchema,
  WebPageSchema,
  FAQSchema,
} from "@/components/seo/StructuredData";
import HomeClient from "@/components/home/HomeClient";
import { getT } from '@/lib/i18n/i18n-server';
import { getUnifiedInsights } from '@/lib/database/insights';
import { headers } from 'next/headers';
import { Coordinates, CalculationMethod, PrayerTimes } from 'adhan';

export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }) {
  const resolvedParams = await params;
  const lang = resolvedParams.lang === 'ar' ? 'ar' : 'en';
  
  return pageMeta({
    title: "Arabia Khaleej | The GCC Standard — Regional Intelligence Portal",
    titleAr: "عربية خليج | المعيار الخليجي — بوابة الاستخبارات الإقليمية",
    description: SITE_DESCRIPTION,
    descriptionAr: SITE_DESCRIPTION_AR,
    path: "/",
    lang,
    keywords: [
      "Arabia Khaleej", "GCC guide", "Gulf Cooperation Council",
      "prayer times GCC", "GCC currency rates", "GCC currency dynamics",
      "Qatar guide", "UAE guide", "Saudi Arabia guide",
      "Kuwait guide", "Oman guide", "Bahrain guide",
      "expat GCC", "GCC regional intelligence",
      "عربية خليج", "دليل الخليج", "مواقيت الصلاة", "أسعار صرف العملات",
      "مجلس التعاون الخليجي",
    ],
  });
}

export default async function Home({ params }: { params: Promise<{ lang: string }> }) {
  const resolvedParams = await params;
  const lang = resolvedParams.lang === 'ar' ? 'ar' : 'en';
  const t = await getT(lang);
  const insights = await getUnifiedInsights({ lang, limit: 4 });

  // 1. Resolve geolocation from Cloudflare headers
  const headList = await headers();
  const country = headList.get('cf-ipcountry') || 'AE';
  const city = headList.get('cf-ipcity') || (lang === 'ar' ? 'دبي' : 'Dubai');
  const latStr = headList.get('cf-iplatitude');
  const lngStr = headList.get('cf-iplongitude');
  
  const lat = latStr ? parseFloat(latStr) : 25.2048;
  const lng = lngStr ? parseFloat(lngStr) : 55.2708;
  const locationName = latStr && lngStr ? city : (lang === 'ar' ? 'دبي' : 'Dubai');

  // 2. Precompute next prayer time on the server to prevent Cumulative Layout Shift (CLS)
  const coords = new Coordinates(lat, lng);
  const prayerParams = CalculationMethod.UmmAlQura();
  const date = new Date();
  const prayerTimes = new PrayerTimes(coords, date, prayerParams);

  const nextPrayerName = prayerTimes.nextPrayer();
  let nextTime = '';
  let nextName = '';

  const timeFormat = (d: Date) => d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false });

  if (nextPrayerName !== 'none') {
    const time = prayerTimes.timeForPrayer(nextPrayerName);
    if (time) {
      nextTime = timeFormat(time);
      nextName = nextPrayerName.charAt(0).toUpperCase() + nextPrayerName.slice(1);
    }
  } else {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    const tomorrowTimes = new PrayerTimes(coords, tomorrow, prayerParams);
    nextTime = timeFormat(tomorrowTimes.fajr);
    nextName = 'Fajr';
  }

  const initialPrayerData = {
    next: { name: nextName, time: nextTime },
    locationName,
  };

  // 3. Fetch live exchange rates with robust default pegs as fallbacks
  const ratesRes = await fetch('https://open.er-api.com/v6/latest/USD', {
    next: { revalidate: 1800 } // Cache for 30 minutes
  }).catch(() => null);
  const ratesData = ratesRes ? await ratesRes.json().catch(() => null) : null;
  const rates = ratesData?.rates || {
    AED: 3.6725,
    SAR: 3.75,
    QAR: 3.64,
    KWD: 0.307,
    OMR: 0.384,
    BHD: 0.376,
    EUR: 0.92,
    GBP: 0.79,
    JPY: 155.0,
    CNY: 7.24,
    INR: 83.3,
  };

  const faqQuestions = [
    {
      question: t("faqWhatIsTitle"),
      answer: t("faqWhatIsBody"),
    },
    {
      question: t("faqCountriesTitle"),
      answer: t("faqCountriesBody"),
    },
    {
      question: t("faqPrayerTitle"),
      answer: t("faqPrayerBody"),
    },
    {
      question: t("faqBilingualTitle"),
      answer: t("faqBilingualBody"),
    },
    {
      question: t("faqMarketTitle"),
      answer: t("faqMarketBody"),
    },
  ];

  return (
    <>
      <WebPageSchema
        name={t("homeSchemaName")}
        description={t("homeSchemaDesc")}
        url="/"
      />
      <DatasetSchema
        name={t("homeDatasetName")}
        description={t("homeDatasetDesc")}
        url="/"
        keywords={[
          "GCC", "prayer times", "currency exchange", "currency dynamics", "currencies",
          "Qatar", "UAE", "Saudi Arabia", "Kuwait", "Oman", "Bahrain",
          "مجلس التعاون", "مواقيت الصلاة", "أسعار صرف العملات",
        ]}
      />
      <FAQSchema questions={faqQuestions} />
      <HomeClient 
        initialInsights={insights} 
        initialPrayerData={initialPrayerData}
        initialRates={rates}
      />
    </>
  );
}

