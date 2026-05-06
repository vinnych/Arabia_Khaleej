export const runtime = 'edge';
import { NextResponse } from 'next/server';

// GCC Market Data (Mocked for premium feel, could be replaced with real APIs like Sahmk)
const STOCK_MARKETS = [
  { id: 'tasi', name: 'Tadawul (TASI)', country: 'Saudi Arabia', value: 12450.20, change: +0.45, trend: 'up' },
  { id: 'adx', name: 'ADX General', country: 'UAE (Abu Dhabi)', value: 9230.15, change: -0.12, trend: 'down' },
  { id: 'dfm', name: 'DFM Index', country: 'UAE (Dubai)', value: 4210.80, change: +0.85, trend: 'up' },
  { id: 'qe', name: 'QE Index', country: 'Qatar', value: 10150.45, change: +0.22, trend: 'up' },
  { id: 'kwse', name: 'Boursa Kuwait', country: 'Kuwait', value: 7890.30, change: -0.05, trend: 'down' },
];

const COMMODITIES = [
  { id: 'gold', name: 'Gold Spot', symbol: 'XAU/USD', value: 2385.40, change: +1.20, trend: 'up' },
  { id: 'oil', name: 'Brent Crude', symbol: 'OIL/USD', value: 87.50, change: -0.45, trend: 'down' },
];

function getMarketStatus() {
  const now = new Date();
  // GCC Time is roughly UTC+3 (KSA/Qatar) and UTC+4 (UAE)
  // For simplicity, we'll use UTC+3 as the baseline for "GCC Trading Hours"
  const utc = now.getTime() + (now.getTimezoneOffset() * 60000);
  const gccTime = new Date(utc + (3600000 * 3));
  
  const day = gccTime.getDay(); // 0: Sun, 1: Mon, ..., 5: Fri, 6: Sat
  const hour = gccTime.getHours();
  
  // Saudi/Qatar: Sun-Thu, 10am-3pm
  const isSundayToThursday = day >= 0 && day <= 4;
  const isTradingHours = hour >= 10 && hour < 15;
  
  return (isSundayToThursday && isTradingHours) ? 'open' : 'closed';
}

export async function GET() {
  try {
    const marketStatus = getMarketStatus();
    // Fetch live currency rates (Real data)
    const currencyRes = await fetch('https://open.er-api.com/v6/latest/USD', {
      next: { revalidate: 3600 } // Cache for 1 hour
    });
    if (!currencyRes.ok) {
      throw new Error(`Currency API failed: ${currencyRes.status}`);
    }
    const currencyData = await currencyRes.json();

    const gccCurrencies = [
      { code: 'AED', name: 'UAE Dirham', rate: currencyData.rates?.AED ?? 3.6725 },
      { code: 'SAR', name: 'Saudi Riyal', rate: currencyData.rates?.SAR ?? 3.7500 },
      { code: 'QAR', name: 'Qatari Riyal', rate: currencyData.rates?.QAR ?? 3.6400 },
      { code: 'KWD', name: 'Kuwaiti Dinar', rate: currencyData.rates?.KWD ?? 0.3070 },
      { code: 'OMR', name: 'Omani Rial', rate: currencyData.rates?.OMR ?? 0.3845 },
      { code: 'BHD', name: 'Bahraini Dinar', rate: currencyData.rates?.BHD ?? 0.3760 },
    ];

    // Simulate some randomness for stocks/commodities to feel "live"
    const randomizedStocks = STOCK_MARKETS.map(s => ({
      ...s,
      value: s.value + (Math.random() - 0.5) * 10,
      change: s.change + (Math.random() - 0.5) * 0.1
    }));

    const randomizedCommodities = COMMODITIES.map(c => ({
      ...c,
      value: c.value + (Math.random() - 0.5) * 2,
      change: c.change + (Math.random() - 0.5) * 0.05
    }));

    return NextResponse.json({
      timestamp: new Date().toISOString(),
      marketStatus,
      stocks: randomizedStocks,
      commodities: randomizedCommodities,
      currencies: gccCurrencies,
      status: 'success'
    });
  } catch (error) {
    return NextResponse.json({ status: 'error', message: 'Failed to fetch market data' }, { status: 500 });
  }
}


