import { NextResponse } from 'next/server';

const TICKER_PRICE_URL = "https://api.binance.com/api/v3/ticker/price";

export async function GET() {
  try {
    const response = await fetch(TICKER_PRICE_URL);
    if (!response.ok) {
      throw new Error(`Binance API failed with status: ${response.status}`);
    }
    const data = await response.json();
    return NextResponse.json(data);
  } catch (error: any) {
    console.error("Error fetching from Binance API:", error.message);
    return NextResponse.json(
      { error: "Failed to fetch Binance data" },
      { status: 500 }
    );
  }
}
