import { NextResponse } from 'next/server';

export const runtime = 'edge';

// We heavily cache this endpoint since historical daily data only changes once a day
export const revalidate = 43200; // 12 hours

async function fetchHistorical(code: string) {
  if (code === 'USD') {
    return Array(7).fill(1.0);
  }
  
  try {
    const res = await fetch(`https://query1.finance.yahoo.com/v8/finance/chart/${code}=X?range=7d&interval=1d`, {
      next: { revalidate: 43200 }
    });
    
    if (!res.ok) throw new Error('Failed to fetch from Yahoo Finance');
    
    const data = await res.json();
    const result = data.chart?.result?.[0];
    
    if (!result || !result.indicators?.quote?.[0]?.close) {
      throw new Error('Invalid data format');
    }

    const closePrices = result.indicators.quote[0].close as (number | null)[];
    // Filter out nulls and get the last 7 valid days
    const validPrices = closePrices.filter(p => p !== null) as number[];
    
    // If not enough data, just return an array of 1s to prevent breaking
    if (validPrices.length === 0) return Array(7).fill(1.0);
    
    // Fill up to 7 if we have fewer
    while (validPrices.length < 7) {
      validPrices.unshift(validPrices[0]);
    }
    
    return validPrices.slice(-7);
  } catch (error) {
    console.error(`Historical fetch error for ${code}:`, error);
    return Array(7).fill(1.0); // Safe fallback
  }
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const fromCode = searchParams.get('from')?.toUpperCase() || 'USD';
    const toCode = searchParams.get('to')?.toUpperCase() || 'QAR';

    // If they are the same, the historical rate is a flat line at 1.0
    if (fromCode === toCode) {
      return NextResponse.json({
        status: 'success',
        rates: Array(7).fill(1.0),
      });
    }

    // Fetch both simultaneously
    const [fromRates, toRates] = await Promise.all([
      fetchHistorical(fromCode),
      fetchHistorical(toCode)
    ]);

    // Calculate cross rates: ToRate / FromRate
    const crossRates = [];
    for (let i = 0; i < 7; i++) {
      const fr = fromRates[i] || 1;
      const tr = toRates[i] || 1;
      crossRates.push(tr / fr);
    }

    return NextResponse.json({
      status: 'success',
      rates: crossRates,
    });
  } catch (error) {
    return NextResponse.json({ 
      status: 'error', 
      message: 'Failed to fetch historical rates' 
    }, { status: 500 });
  }
}
