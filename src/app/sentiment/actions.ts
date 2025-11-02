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
    // This assumes a document for the ticker exists at /stocks/{ticker}.
    // In a real app, you might need to create it if it doesn't exist.
    const sentimentCollectionRef = collection(firestore, 'stocks', ticker, 'sentimentAnalysis');
    
    let sentimentScore = 0;
    if (analysis.sentiment.toLowerCase().includes('positive') || analysis.sentiment.toLowerCase().includes('bullish')) sentimentScore = 0.5;
    if (analysis.sentiment.toLowerCase().includes('negative') || analysis.sentiment.toLowerCase().includes('bearish')) sentimentScore = -0.5;
    
    // Non-blocking write
    addDoc(sentimentCollectionRef, {
      stockId: ticker,
      analysisDate: serverTimestamp(),
      sentimentScore: sentimentScore,
      summary: analysis.reason,
    }).catch(err => {
      // Log error internally, but don't block user response
      console.error(`Failed to save sentiment for ${ticker}:`, err);
    });

  } catch (error) {
    // In a real app, you'd want more robust error handling/logging here.
    console.error(`Failed to initialize Firebase or save sentiment for ${ticker}:`, error);
    // This error is not returned to the user as saving is a background task.
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
  } catch (e: any) {
    console.error('Error in getSentimentAnalysis:', e);
    return { error: e.message || 'Failed to analyze sentiment. The AI model may be temporarily unavailable.' };
  }
}

export async function getValidation(stockTicker: string, sentimentSummary: string): Promise<{ data?: ValidateSentimentAnalysisOutput; error?: string }> {
  if (!stockTicker || !sentimentSummary) {
    return { error: 'Stock ticker and sentiment summary are required for validation.' };
  }
  try {
    const result = await validateSentimentAnalysis({ stockTicker, sentimentSummary });
    return { data: result };
  } catch (e: any) {
    console.error('Error in getValidation:', e);
    return { error: e.message || 'Failed to validate sentiment. The validation service may be temporarily unavailable.' };
  }
}
