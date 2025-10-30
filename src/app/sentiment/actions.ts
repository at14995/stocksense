'use server';

import { analyzeStockSentiment, AnalyzeStockSentimentOutput } from '@/ai/flows/analyze-stock-sentiment';
import { validateSentimentAnalysis, ValidateSentimentAnalysisOutput } from '@/ai/flows/validate-sentiment-analysis';
import { z } from 'zod';

const TickerSchema = z.string().min(1, "Ticker is required").max(10, "Ticker is too long");

export async function getSentimentAnalysis(ticker: string): Promise<{ data?: AnalyzeStockSentimentOutput; error?: string }> {
  const validation = TickerSchema.safeParse(ticker);
  if (!validation.success) {
    return { error: validation.error.errors[0].message };
  }

  try {
    const result = await analyzeStockSentiment({ ticker: validation.data });
    return { data: result };
  } catch (e) {
    console.error(e);
    return { error: 'Failed to analyze sentiment. Please try again later.' };
  }
}

export async function getValidation(stockTicker: string, sentimentSummary: string): Promise<{ data?: ValidateSentimentAnalysisOutput; error?: string }> {
  if (!stockTicker || !sentimentSummary) {
    return { error: 'Stock ticker and sentiment summary are required for validation.' };
  }
  try {
    const result = await validateSentimentAnalysis({ stockTicker, sentimentSummary });
    return { data: result };
  } catch (e) {
    console.error(e);
    return { error: 'Failed to validate sentiment. Please try again later.' };
  }
}
