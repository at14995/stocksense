'use server';

/**
 * @fileOverview This file defines a Genkit flow for analyzing the sentiment of a given stock.
 *
 * It includes:
 * - `analyzeStockSentiment`: The main function to trigger the sentiment analysis flow.
 * - `AnalyzeStockSentimentInput`: The input type for the `analyzeStockSentiment` function, defining the stock ticker.
 * - `AnalyzeStockSentimentOutput`: The output type for the `analyzeStockSentiment` function, providing the sentiment analysis result.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const AnalyzeStockSentimentInputSchema = z.object({
  ticker: z
    .string()
    .describe('The ticker symbol of the stock to analyze, e.g., AAPL.'),
});
export type AnalyzeStockSentimentInput = z.infer<
  typeof AnalyzeStockSentimentInputSchema
>;

const AnalyzeStockSentimentOutputSchema = z.object({
  sentiment: z.string().describe('The overall sentiment towards the stock.'),
  reason: z
    .string()
    .describe(
      'The reasons behind the sentiment, including positive and negative factors.'
    ),
  recommendation: z
    .string()
    .describe(
      'A recommendation based on the sentiment analysis, e.g., buy, sell, or hold.'
    ),
});
export type AnalyzeStockSentimentOutput = z.infer<
  typeof AnalyzeStockSentimentOutputSchema
>;

export async function analyzeStockSentiment(
  input: AnalyzeStockSentimentInput
): Promise<AnalyzeStockSentimentOutput> {
  return analyzeStockSentimentFlow(input);
}

const analyzeStockSentimentPrompt = ai.definePrompt({
  name: 'analyzeStockSentimentPrompt',
  input: {schema: AnalyzeStockSentimentInputSchema},
  output: {schema: AnalyzeStockSentimentOutputSchema},
  prompt: `Analyze the sentiment for {{ticker}} stock and provide a recommendation. Consider market trends and news.

      Ticker: {{ticker}}
      Sentiment: 
      Reason: 
      Recommendation: `,
});

const analyzeStockSentimentFlow = ai.defineFlow(
  {
    name: 'analyzeStockSentimentFlow',
    inputSchema: AnalyzeStockSentimentInputSchema,
    outputSchema: AnalyzeStockSentimentOutputSchema,
  },
  async input => {
    const {output} = await analyzeStockSentimentPrompt(input);
    return output!;
  }
);
