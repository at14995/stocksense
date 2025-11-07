import { NextResponse } from 'next/server';

const BINANCE_TICKER_URL = "https://api.binance.com/api/v3/ticker/24hr";
const TOP_SYMBOLS = ["BTCUSDT", "ETHUSDT", "SOLUSDT", "XRPUSDT", "DOGEUSDT"];

export async function GET() {
  try {
    const response = await fetch(BINANCE_TICKER_URL);
    if (!response.ok) {
      throw new Error(`Binance API failed with status: ${response.status}`);
    }
    const data = await response.json();
    
    // Filter for the top symbols and sort them
    const filteredData = data.filter((item: any) => TOP_SYMBOLS.includes(item.symbol))
      .sort((a: any, b: any) => TOP_SYMBOLS.indexOf(a.symbol) - TOP_SYMBOLS.indexOf(b.symbol));

    return NextResponse.json(filteredData);
  } catch (error: any) {
    console.error("Error fetching from Binance API:", error.message);
    return NextResponse.json(
      { error: "Failed to fetch Binance data" },
      { status: 500 }
    );
  }
}
