/**
 * Arabia Khaleej — Market Intelligence API
 * Provides real-time regional and global financial data.
 */

import { NextResponse } from 'next/server';
import { FinanceService } from '@/lib/finance-service';
import { OPEN_ER_API_BASE } from '@/lib/constants/api';

export const runtime = 'edge';

export async function GET() {
  try {
    const marketStatus = FinanceService.getMarketStatus();
    const stocks = await FinanceService.getStockMarkets();
    const commodities = await FinanceService.getCommodities();

    const currencyRes = await fetch(`${OPEN_ER_API_BASE}/latest/USD`, {
      next: { revalidate: 3600 }
    });
    const currencyData = await currencyRes.json();

    const gccCurrencies = [
      { code: 'AED', name: 'UAE Dirham', rate: currencyData.rates?.AED ?? 3.6725 },
      { code: 'SAR', name: 'Saudi Riyal', rate: currencyData.rates?.SAR ?? 3.7500 },
      { code: 'QAR', name: 'Qatari Riyal', rate: currencyData.rates?.QAR ?? 3.6400 },
      { code: 'KWD', name: 'Kuwaiti Dinar', rate: currencyData.rates?.KWD ?? 0.3070 },
      { code: 'OMR', name: 'Omani Rial', rate: currencyData.rates?.OMR ?? 0.3845 },
      { code: 'BHD', name: 'Bahraini Dinar', rate: currencyData.rates?.BHD ?? 0.3760 },
    ];

    return NextResponse.json({
      timestamp: new Date().toISOString(),
      marketStatus,
      stocks,
      commodities,
      currencies: gccCurrencies,
      status: 'success'
    });
  } catch (error) {
    return NextResponse.json({ status: 'error', message: 'Failed to fetch market data' }, { status: 500 });
  }
}


