'use server';

import { analyzeStockSentiment, AnalyzeStockSentimentOutput } from '@/ai/flows/analyze-stock-sentiment';
import { validateSentimentAnalysis, ValidateSentimentAnalysisOutput } from '@/ai/flows/validate-sentiment-analysis';
import { z } from 'zod';
import { initializeFirebase } from '@/firebase';
import { addDoc, collection, serverTimestamp } from 'firebase/firestore';

const TickerSchema = z.string().min(1, "Ticker is required").max(10, "Ticker is too long");

async function saveSentimentAnalysis(ticker: string, analysis: AnalyzeStockSentimentOutput) {
  try {
    const { firestore } = initializeFirebase();
    // Note: Firestore security rules should be configured to allow this write.
    // We are writing to a subcollection of a "stocks" document.
    // This assumes a document for the ticker exists at /stocks/{ticker}.
    // In a real app, you might need to create it if it doesn't exist.
    const sentimentCollectionRef = collection(firestore, 'stocks', ticker, 'sentimentAnalysis');
    
    let sentimentScore = 0;
    if (analysis.sentiment.toLowerCase() === 'positive') sentimentScore = 0.5;
    if (analysis.sentiment.toLowerCase() === 'negative') sentimentScore = -0.5;
    
    await addDoc(sentimentCollectionRef, {
      stockId: ticker,
      analysisDate: serverTimestamp(),
      sentimentScore: sentimentScore,
      summary: analysis.reason,
    });
  } catch (error) {
    // In a real app, you'd want more robust error handling/logging here.
    console.error(`Failed to save sentiment for ${ticker}:`, error);
  }
}


export async function getSentimentAnalysis(ticker: string): Promise<{ data?: AnalyzeStockSentimentOutput; error?: string }> {
  const validation = TickerSchema.safeParse(ticker);
  if (!validation.success) {
    return { error: validation.error.errors[0].message };
  }

  try {
    const result = await analyzeStockSentiment({ ticker: validation.data });
    // Don't block the user response while saving.
    saveSentimentAnalysis(validation.data, result);
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
