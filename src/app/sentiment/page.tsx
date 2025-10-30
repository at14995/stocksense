import { Bot } from 'lucide-react';
import { SentimentForm } from './sentiment-form';

export default function SentimentPage() {
  return (
    <div className="container mx-auto max-w-4xl px-4 py-8 md:py-12">
      <div className="flex flex-col items-center text-center">
        <div className="mb-4 flex items-center justify-center rounded-full bg-primary/10 p-4">
          <Bot className="h-10 w-10 text-primary" />
        </div>
        <h1 className="font-headline text-3xl font-bold tracking-tight md:text-4xl">
          AI-Powered Sentiment Analysis
        </h1>
        <p className="mt-2 text-muted-foreground">
          Enter a stock ticker to analyze market sentiment and get trading
          recommendations.
        </p>
      </div>

      <div className="mt-12">
        <SentimentForm />
      </div>
    </div>
  );
}
