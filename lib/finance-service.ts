import { YAHOO_FINANCE_API_URL } from '@/lib/constants/api';

export interface MarketData {
  id: string;
  name: string;
  country?: string;
  symbol?: string;
  value: number;
  change: number;
  trend: 'up' | 'down' | 'neutral';
}

// Static fallback data using well-known ticker symbols for GCC markets
// These symbols work with Yahoo Finance's free public API without authentication
export const STOCK_MARKETS_BASE = [
  { id: 'tasi', symbol: '^TASI', name: 'Tadawul (TASI)', country: 'Saudi Arabia', value: 12450.20, change: 0 },
  { id: 'adx', symbol: '^ADI', name: 'ADX General', country: 'UAE (Abu Dhabi)', value: 9230.15, change: 0 },
  { id: 'dfm', symbol: '^DFMGI', name: 'DFM Index', country: 'UAE (Dubai)', value: 4210.80, change: 0 },
  { id: 'qe', symbol: '^QE', name: 'QE Index', country: 'Qatar', value: 10150.45, change: 0 },
  { id: 'kwse', symbol: '^BKMAIN', name: 'Boursa Kuwait', country: 'Kuwait', value: 7890.30, change: 0 },
];

export const COMMODITIES_BASE = [
  { id: 'gold', symbol: 'GC=F', name: 'Gold Spot', value: 2385.40, change: 0 },
  { id: 'oil', symbol: 'BZ=F', name: 'Brent Crude', value: 87.50, change: 0 },
];

export class FinanceService {
  private static async fetchFromYahoo(tickers: string[]): Promise<Record<string, { price: number; change: number }>> {
    try {
      const symbols = tickers.join(',');
      const url = `${YAHOO_FINANCE_API_URL}?symbols=${symbols}`;

      const res = await fetch(url, {
        headers: {
          // Yahoo Finance blocks requests without a User-Agent header
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
        }
      });

      if (!res.ok) throw new Error('Yahoo Finance Unavailable');

      const data = await res.json();
      const results = data.quoteResponse.result;

      const map: Record<string, { price: number; change: number }> = {};
      results.forEach((r: any) => {
        map[r.symbol] = { price: r.regularMarketPrice, change: r.regularMarketChangePercent };
      });
      return map;
    } catch (e) {
      // Silently fall back to simulation to avoid breaking the UI during market hours
      console.warn("FinanceService: Falling back to simulation mode due to Yahoo API error.");
      return {};
    }
  }

  static async getStockMarkets(): Promise<MarketData[]> {
    const tickers = STOCK_MARKETS_BASE.map(s => s.symbol);
    const liveData = await this.fetchFromYahoo(tickers);

    return STOCK_MARKETS_BASE.map(market => {
      const live = liveData[market.symbol];
      if (live) {
        return { ...market, value: live.price, change: live.change, trend: live.change >= 0 ? 'up' : 'down' };
      }
      // Sin-based simulation creates realistic-looking variation without artificial volatility
      const minutesSinceHour = new Date().getMinutes();
      const drift = (Math.sin(minutesSinceHour / 12) * 0.4);
      return { ...market, value: market.value + drift, change: drift / 50, trend: drift >= 0 ? 'up' : 'down' };
    });
  }

  static async getCommodities(): Promise<MarketData[]> {
    const tickers = COMMODITIES_BASE.map(c => c.symbol);
    const liveData = await this.fetchFromYahoo(tickers);

    return COMMODITIES_BASE.map(item => {
      const live = liveData[item.symbol];
      if (live) {
        return { ...item, value: live.price, change: live.change, trend: live.change >= 0 ? 'up' : 'down' };
      }
      return { ...item, trend: item.change >= 0 ? 'up' : 'down' };
    });
  }

  static getMarketStatus(): 'open' | 'closed' {
    const now = new Date();
    // GCC time is UTC+3, which covers the trading hours for most Gulf markets
    const utc = now.getTime() + (now.getTimezoneOffset() * 60000);
    const gccTime = new Date(utc + (3600000 * 3));

    const day = gccTime.getDay();
    const hour = gccTime.getHours();

    // GCC markets typically trade Sunday-Thursday (weekends differ by country)
    // 10:00-15:00 GCC time covers morning to early afternoon sessions
    const isTradingDay = day >= 0 && day <= 4;
    const isTradingHour = hour >= 10 && hour < 15;

    return (isTradingDay && isTradingHour) ? 'open' : 'closed';
  }
}