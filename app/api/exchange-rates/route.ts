export const runtime = 'edge';
import { NextResponse } from 'next/server';

// Popular world currencies with metadata
const CURRENCY_META: Record<string, { name: string; nameAr: string; symbol: string; flag: string; region: string }> = {
  // GCC Currencies
  AED: { name: 'UAE Dirham', nameAr: 'درهم إماراتي', symbol: 'د.إ', flag: '🇦🇪', region: 'gcc' },
  SAR: { name: 'Saudi Riyal', nameAr: 'ريال سعودي', symbol: 'ر.س', flag: '🇸🇦', region: 'gcc' },
  QAR: { name: 'Qatari Riyal', nameAr: 'ريال قطري', symbol: 'ر.ق', flag: '🇶🇦', region: 'gcc' },
  KWD: { name: 'Kuwaiti Dinar', nameAr: 'دينار كويتي', symbol: 'د.ك', flag: '🇰🇼', region: 'gcc' },
  OMR: { name: 'Omani Rial', nameAr: 'ريال عماني', symbol: 'ر.ع', flag: '🇴🇲', region: 'gcc' },
  BHD: { name: 'Bahraini Dinar', nameAr: 'دينار بحريني', symbol: 'د.ب', flag: '🇧🇭', region: 'gcc' },
  // Major World Currencies
  USD: { name: 'US Dollar', nameAr: 'دولار أمريكي', symbol: '$', flag: '🇺🇸', region: 'major' },
  EUR: { name: 'Euro', nameAr: 'يورو', symbol: '€', flag: '🇪🇺', region: 'major' },
  GBP: { name: 'British Pound', nameAr: 'جنيه إسترليني', symbol: '£', flag: '🇬🇧', region: 'major' },
  JPY: { name: 'Japanese Yen', nameAr: 'ين ياباني', symbol: '¥', flag: '🇯🇵', region: 'major' },
  CHF: { name: 'Swiss Franc', nameAr: 'فرنك سويسري', symbol: 'CHF', flag: '🇨🇭', region: 'major' },
  CAD: { name: 'Canadian Dollar', nameAr: 'دولار كندي', symbol: 'C$', flag: '🇨🇦', region: 'major' },
  AUD: { name: 'Australian Dollar', nameAr: 'دولار أسترالي', symbol: 'A$', flag: '🇦🇺', region: 'major' },
  CNY: { name: 'Chinese Yuan', nameAr: 'يوان صيني', symbol: '¥', flag: '🇨🇳', region: 'major' },
  INR: { name: 'Indian Rupee', nameAr: 'روبية هندية', symbol: '₹', flag: '🇮🇳', region: 'asia' },
  PKR: { name: 'Pakistani Rupee', nameAr: 'روبية باكستانية', symbol: '₨', flag: '🇵🇰', region: 'asia' },
  BDT: { name: 'Bangladeshi Taka', nameAr: 'تاكا بنغلاديشية', symbol: '৳', flag: '🇧🇩', region: 'asia' },
  PHP: { name: 'Philippine Peso', nameAr: 'بيزو فلبيني', symbol: '₱', flag: '🇵🇭', region: 'asia' },
  LKR: { name: 'Sri Lankan Rupee', nameAr: 'روبية سريلانكية', symbol: 'Rs', flag: '🇱🇰', region: 'asia' },
  NPR: { name: 'Nepalese Rupee', nameAr: 'روبية نيبالية', symbol: 'रू', flag: '🇳🇵', region: 'asia' },
  EGP: { name: 'Egyptian Pound', nameAr: 'جنيه مصري', symbol: 'E£', flag: '🇪🇬', region: 'mena' },
  JOD: { name: 'Jordanian Dinar', nameAr: 'دينار أردني', symbol: 'JD', flag: '🇯🇴', region: 'mena' },
  TRY: { name: 'Turkish Lira', nameAr: 'ليرة تركية', symbol: '₺', flag: '🇹🇷', region: 'mena' },
  SGD: { name: 'Singapore Dollar', nameAr: 'دولار سنغافوري', symbol: 'S$', flag: '🇸🇬', region: 'asia' },
  MYR: { name: 'Malaysian Ringgit', nameAr: 'رينغيت ماليزي', symbol: 'RM', flag: '🇲🇾', region: 'asia' },
  IDR: { name: 'Indonesian Rupiah', nameAr: 'روبية إندونيسية', symbol: 'Rp', flag: '🇮🇩', region: 'asia' },
  THB: { name: 'Thai Baht', nameAr: 'بات تايلاندي', symbol: '฿', flag: '🇹🇭', region: 'asia' },
  KRW: { name: 'South Korean Won', nameAr: 'وون كوري', symbol: '₩', flag: '🇰🇷', region: 'asia' },
  ZAR: { name: 'South African Rand', nameAr: 'راند جنوب أفريقي', symbol: 'R', flag: '🇿🇦', region: 'other' },
  BRL: { name: 'Brazilian Real', nameAr: 'ريال برازيلي', symbol: 'R$', flag: '🇧🇷', region: 'other' },
  MXN: { name: 'Mexican Peso', nameAr: 'بيزو مكسيكي', symbol: 'Mex$', flag: '🇲🇽', region: 'other' },
  SEK: { name: 'Swedish Krona', nameAr: 'كرونة سويدية', symbol: 'kr', flag: '🇸🇪', region: 'major' },
  NOK: { name: 'Norwegian Krone', nameAr: 'كرونة نرويجية', symbol: 'kr', flag: '🇳🇴', region: 'major' },
  NZD: { name: 'New Zealand Dollar', nameAr: 'دولار نيوزيلندي', symbol: 'NZ$', flag: '🇳🇿', region: 'major' },
  HKD: { name: 'Hong Kong Dollar', nameAr: 'دولار هونغ كونغ', symbol: 'HK$', flag: '🇭🇰', region: 'asia' },
  TWD: { name: 'Taiwan Dollar', nameAr: 'دولار تايواني', symbol: 'NT$', flag: '🇹🇼', region: 'asia' },
  RUB: { name: 'Russian Ruble', nameAr: 'روبل روسي', symbol: '₽', flag: '🇷🇺', region: 'other' },
  PLN: { name: 'Polish Zloty', nameAr: 'زلوتي بولندي', symbol: 'zł', flag: '🇵🇱', region: 'other' },
  CZK: { name: 'Czech Koruna', nameAr: 'كرونة تشيكية', symbol: 'Kč', flag: '🇨🇿', region: 'other' },
  HUF: { name: 'Hungarian Forint', nameAr: 'فورنت مجري', symbol: 'Ft', flag: '🇭🇺', region: 'other' },
  IQD: { name: 'Iraqi Dinar', nameAr: 'دينار عراقي', symbol: 'ع.د', flag: '🇮🇶', region: 'mena' },
  LBP: { name: 'Lebanese Pound', nameAr: 'ليرة لبنانية', symbol: 'ل.ل', flag: '🇱🇧', region: 'mena' },
  MAD: { name: 'Moroccan Dirham', nameAr: 'درهم مغربي', symbol: 'MAD', flag: '🇲🇦', region: 'mena' },
  TND: { name: 'Tunisian Dinar', nameAr: 'دينار تونسي', symbol: 'DT', flag: '🇹🇳', region: 'mena' },
};

export async function GET() {
  try {
    const res = await fetch('https://open.er-api.com/v6/latest/USD', {
      next: { revalidate: 1800 } // Cache for 30 minutes
    });
    const data = await res.json();

    if (!data || !data.rates) {
      return NextResponse.json({ status: 'error', message: 'Invalid API response' }, { status: 500 });
    }

    // Build enriched currency list
    const currencies = Object.entries(CURRENCY_META).map(([code, meta]) => ({
      code,
      ...meta,
      rate: data.rates[code] || null,
    })).filter(c => c.rate !== null);

    return NextResponse.json({
      status: 'success',
      timestamp: data.time_last_update_utc || new Date().toISOString(),
      base: 'USD',
      rates: data.rates, // Full rate map for conversion calculations
      currencies, // Curated list with metadata
    });
  } catch (error) {
    return NextResponse.json({ status: 'error', message: 'Failed to fetch exchange rates' }, { status: 500 });
  }
}


