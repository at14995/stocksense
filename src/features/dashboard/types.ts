export interface MarketDataItem {
  symbol: string;
  price: string;
  change: string;
}

export interface OverviewDataItem extends MarketDataItem {}

export interface SentimentDataItem {
  symbol: string;
  label: 'Positive' | 'Neutral' | 'Negative';
  score: number;
}

export interface AlertItem {
    id: number;
    condition: string;
    status: 'Active' | 'Triggered' | 'Resolved';
}
