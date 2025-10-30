'use server';

/**
 * @fileOverview Sentiment analysis validation flow.
 *
 * - validateSentimentAnalysis - Validates sentiment analysis insights using an external tool.
 * - ValidateSentimentAnalysisInput - The input type for the validateSentimentAnalysis function.
 * - ValidateSentimentAnalysisOutput - The return type for the validateSentimentAnalysis function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const ValidateSentimentAnalysisInputSchema = z.object({
  stockTicker: z.string().describe('The stock ticker to validate sentiment for.'),
  sentimentSummary: z.string().describe('A summary of the sentiment analysis.'),
});
export type ValidateSentimentAnalysisInput = z.infer<
  typeof ValidateSentimentAnalysisInputSchema
>;

const ValidateSentimentAnalysisOutputSchema = z.object({
  isValid: z.boolean().describe('Whether the sentiment analysis is valid or not.'),
  validationReason: z
    .string()
    .describe('The reason why the sentiment analysis is valid or invalid.'),
});

export type ValidateSentimentAnalysisOutput = z.infer<
  typeof ValidateSentimentAnalysisOutputSchema
>;

export async function validateSentimentAnalysis(
  input: ValidateSentimentAnalysisInput
): Promise<ValidateSentimentAnalysisOutput> {
  return validateSentimentAnalysisFlow(input);
}

const validateSentimentAnalysisTool = ai.defineTool(
  {
    name: 'validateSentimentAnalysisTool',
    description:
      'Validates the sentiment analysis insights for a given stock ticker using external source before making trading decisions.',
    inputSchema: z.object({
      stockTicker: z
        .string()
        .describe('The stock ticker to validate sentiment for.'),
      sentimentSummary: z
        .string()
        .describe('A summary of the sentiment analysis.'),
    }),
    outputSchema: z.object({
      isValid: z
        .boolean()
        .describe('Whether the sentiment analysis is valid or not.'),
      validationReason: z
        .string()
        .describe('The reason why the sentiment analysis is valid or invalid.'),
    }),
  },
  async (input) => {
    // Dummy implementation: Always returns true for demonstration purposes.
    // In a real application, this would call an external API or perform some validation logic.
    console.log(
      `Validating sentiment analysis for ${input.stockTicker}: ${input.sentimentSummary}`
    );
    return {
      isValid: true,
      validationReason: 'Validated against external source successfully.',
    };
  }
);

const validateSentimentAnalysisPrompt = ai.definePrompt({
  name: 'validateSentimentAnalysisPrompt',
  tools: [validateSentimentAnalysisTool],
  input: {schema: ValidateSentimentAnalysisInputSchema},
  output: {schema: ValidateSentimentAnalysisOutputSchema},
  prompt: `You are a financial analyst. A user is about to make a trading decision based on the following sentiment analysis. Use the validateSentimentAnalysisTool tool to validate it before the user does so.

Stock ticker: {{stockTicker}}
Sentiment Summary: {{sentimentSummary}}

If the sentiment analysis is valid, return isValid: true, otherwise return isValid: false and provide reasoning for the decision. Return the results in JSON format.
`,
});

const validateSentimentAnalysisFlow = ai.defineFlow(
  {
    name: 'validateSentimentAnalysisFlow',
    inputSchema: ValidateSentimentAnalysisInputSchema,
    outputSchema: ValidateSentimentAnalysisOutputSchema,
  },
  async input => {
    const {output} = await validateSentimentAnalysisPrompt(input);
    return output!;
  }
);
