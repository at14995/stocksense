'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { useState } from 'react';
import { getSentimentAnalysis, getValidation } from './actions';
import type { AnalyzeStockSentimentOutput } from '@/ai/flows/analyze-stock-sentiment';
import type { ValidateSentimentAnalysisOutput } from '@/ai/flows/validate-sentiment-analysis';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, Info, Loader2, Shield, XCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';
import SentimentHistory from './sentiment-history';

const FormSchema = z.object({
  ticker: z.string().min(1, {
    message: 'Ticker symbol must not be empty.',
  }).max(10, {
    message: 'Ticker symbol must be 10 characters or less.',
  }).regex(/^[A-Z]+$/, {
    message: 'Ticker must be uppercase letters only.',
  }),
});

export function SentimentForm() {
  const [analysis, setAnalysis] = useState<AnalyzeStockSentimentOutput | null>(null);
  const [validation, setValidation] = useState<ValidateSentimentAnalysisOutput | null>(null);
  const [isLoadingAnalysis, setIsLoadingAnalysis] = useState(false);
  const [isLoadingValidation, setIsLoadingValidation] = useState(false);
  const { toast } = useToast();

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      ticker: '',
    },
  });

  async function onSubmit(data: z.infer<typeof FormSchema>) {
    setIsLoadingAnalysis(true);
    setAnalysis(null);
    setValidation(null);

    const result = await getSentimentAnalysis(data.ticker);
    if (result.error) {
      toast({
        variant: 'destructive',
        title: 'Analysis Error',
        description: result.error,
      });
    } else {
      setAnalysis(result.data!);
    }
    setIsLoadingAnalysis(false);
  }

  async function handleValidation() {
    if (!analysis || !form.getValues('ticker')) return;
    setIsLoadingValidation(true);
    setValidation(null);

    const result = await getValidation(form.getValues('ticker'), analysis.reason);
    if (result.error) {
       toast({
        variant: 'destructive',
        title: 'Validation Error',
        description: result.error,
      });
    } else {
      setValidation(result.data!);
    }
    setIsLoadingValidation(false);
  }

  const sentimentColor =
    analysis?.sentiment.toLowerCase() === 'positive' ? 'bg-green-500/10 text-green-700 border-green-500/20' :
    analysis?.sentiment.toLowerCase() === 'negative' ? 'bg-red-500/10 text-red-700 border-red-500/20' :
    'bg-yellow-500/10 text-yellow-700 border-yellow-500/20';

  return (
    <>
      <Card className="max-w-2xl mx-auto">
        <CardHeader>
            <CardTitle>Analyze Stock</CardTitle>
            <CardDescription>Enter a stock ticker (e.g., AAPL, GOOG) to begin.</CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="flex items-start gap-4">
              <FormField
                control={form.control}
                name="ticker"
                render={({ field }) => (
                  <FormItem className="flex-grow">
                    <FormLabel className="sr-only">Ticker</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter stock ticker..." {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit" disabled={isLoadingAnalysis} className="w-32">
                {isLoadingAnalysis ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Analyze'}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>

      {analysis && (
        <Card className="max-w-2xl mx-auto mt-8 animate-in fade-in">
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span>Analysis for {form.getValues('ticker')}</span>
              <Badge className={cn('text-sm', sentimentColor)}>{analysis.sentiment}</Badge>
            </CardTitle>
            <CardDescription>
              AI-generated sentiment analysis and recommendation.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h3 className="font-semibold mb-2">Reasoning</h3>
              <p className="text-muted-foreground text-sm">{analysis.reason}</p>
            </div>
            <div>
              <h3 className="font-semibold mb-2">Recommendation</h3>
              <Alert>
                <Info className="h-4 w-4"/>
                <AlertTitle>Trading Action</AlertTitle>
                <AlertDescription>
                  {analysis.recommendation}
                </AlertDescription>
              </Alert>
            </div>
             <div className="pt-4">
              <SentimentHistory ticker={form.getValues('ticker')} />
            </div>
          </CardContent>
          <CardFooter className="flex flex-col items-stretch gap-4">
            {validation && (
               <Alert variant={validation.isValid ? "default" : "destructive"}>
                {validation.isValid ? <CheckCircle className="h-4 w-4"/> : <XCircle className="h-4 w-4"/>}
                <AlertTitle>Validation Result: {validation.isValid ? "Passed" : "Failed"}</AlertTitle>
                <AlertDescription>
                  {validation.validationReason}
                </AlertDescription>
              </Alert>
            )}
            <Button onClick={handleValidation} disabled={isLoadingValidation || !!validation}>
              {isLoadingValidation ? <Loader2 className="h-4 w-4 animate-spin" /> : <><Shield className="mr-2 h-4 w-4" /> Validate Before Trading</>}
            </Button>
          </CardFooter>
        </Card>
      )}
    </>
  );
}
