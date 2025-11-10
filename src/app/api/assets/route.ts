
import { NextResponse } from 'next/server';

const BINANCE_EXCHANGE_INFO_URL = "https://api.binance.com/api/v3/exchangeInfo";

const staticStocks = [
    { symbol: 'AAPL', name: 'Apple Inc.' },
    { symbol: 'MSFT', name: 'Microsoft Corporation' },
    { symbol: 'GOOGL', name: 'Alphabet Inc.' },
    { symbol: 'AMZN', name: 'Amazon.com, Inc.' },
    { symbol: 'NVDA', name: 'NVIDIA Corporation' },
    { symbol: 'TSLA', name: 'Tesla, Inc.' },
    { symbol: 'META', name: 'Meta Platforms, Inc.' },
];


export async function GET() {
  try {
    const response = await fetch(BINANCE_EXCHANGE_INFO_URL);
    if (!response.ok) {
      throw new Error(`Binance API failed with status: ${response.status}`);
    }
    const data = await response.json();
    
    const cryptoAssets = data.symbols
        .filter((s: any) => s.status === 'TRADING' && s.quoteAsset === 'USDT')
        .map((s: any) => ({ symbol: s.symbol, name: `${s.baseAsset}/${s.quoteAsset}` }));

    const allAssets = [...staticStocks, ...cryptoAssets];

    return NextResponse.json(allAssets);
  } catch (error: any) {
    console.error("Error fetching from Binance API:", error.message);
    return NextResponse.json(
      { error: "Failed to fetch asset data" },
      { status: 500 }
    );
  }
}
