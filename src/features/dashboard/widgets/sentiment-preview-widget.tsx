'use client';

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { motion } from 'framer-motion';
import { MessageSquare } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Skeleton } from '@/components/ui/skeleton';
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

const mockSentiment = [
  { symbol: 'BTC', label: 'Positive', score: 0.68 },
  { symbol: 'AAPL', label: 'Neutral', score: 0.02 },
  { symbol: 'TSLA', label: 'Negative', score: -0.44 },
];

function getBarColor(score: number) {
  if (score > 0.2) return 'bg-green-500';
  if (score < -0.2) return 'bg-red-500';
  return 'bg-gray-400';
}

export function SentimentPreviewWidget() {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 1500);
    return () => clearTimeout(timer);
  }, []);


  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="flex items-center gap-2 text-lg">
          <MessageSquare className="h-5 w-5" />
          <span>AI Sentiment Snapshot</span>
        </CardTitle>
        <Button variant="outline" size="sm" asChild>
          <Link href="/sentiment">View Details</Link>
        </Button>
      </CardHeader>
      <CardContent>
        {isLoading ? (
            <div className="space-y-4">
              <Skeleton className="h-8 w-full" />
              <Skeleton className="h-8 w-full" />
              <Skeleton className="h-8 w-full" />
            </div>
        ) : (
        <div className="space-y-4">
          {mockSentiment.map((item) => (
            <div key={item.symbol} className="grid grid-cols-4 items-center gap-4 text-sm">
              <span className="font-semibold">{item.symbol}</span>
              <div className="col-span-2 h-2 rounded-full bg-muted overflow-hidden">
                <motion.div
                  className={cn('h-full', getBarColor(item.score))}
                  initial={{ width: 0 }}
                  animate={{ width: `${Math.abs(item.score) * 100}%` }}
                  transition={{ duration: 0.8, ease: 'easeOut' }}
                />
              </div>
              <span className="text-right text-muted-foreground">{item.label}</span>
            </div>
          ))}
        </div>
        )}
      </CardContent>
    </Card>
  );
}
