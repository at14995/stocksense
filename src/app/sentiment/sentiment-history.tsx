'use client';

import { useCollection, useFirestore, useMemoFirebase } from '@/firebase';
import { collection, query, orderBy, limit } from 'firebase/firestore';
import { useEffect, useMemo, useState } from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from 'recharts';
import { Skeleton } from '@/components/ui/skeleton';

export default function SentimentHistory({ ticker }: { ticker: string }) {
  const firestore = useFirestore();

  const sentimentsQuery = useMemoFirebase(() => {
    if (!firestore || !ticker) return null;
    return query(
      collection(firestore, 'stocks', ticker, 'sentimentAnalysis'),
      orderBy('analysisDate', 'desc'),
      limit(20) // Limit to the last 20 sentiments for performance
    );
  }, [firestore, ticker]);

  const { data: rawData, isLoading } = useCollection(sentimentsQuery);

  const chartData = useMemo(() => {
    if (!rawData) return [];
    // Reverse to show oldest first on the chart
    return rawData.slice().reverse().map((item: any) => ({
      ...item,
      // Format timestamp for display on the X-axis
      date: item.analysisDate
        ? new Date(item.analysisDate.seconds * 1000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        : 'N/A',
    }));
  }, [rawData]);

  if (isLoading) {
    return (
      <div className="w-full h-64 p-4 bg-[#0E0E12]/95 rounded-xl border border-white/10">
        <h3 className="text-lg font-semibold text-white mb-3">Sentiment History</h3>
        <Skeleton className="w-full h-[calc(100%-2rem)]" />
      </div>
    );
  }
  
  if (!isLoading && chartData.length === 0) {
     return (
      <div className="w-full h-64 p-4 bg-[#0E0E12]/95 rounded-xl border border-white/10 flex flex-col items-center justify-center">
        <h3 className="text-lg font-semibold text-white mb-3">Sentiment History</h3>
        <p className="text-muted-foreground">Not enough data to display history.</p>
        <p className="text-xs text-muted-foreground">Run a few more analyses to see the trend.</p>
      </div>
    );
  }

  return (
    <div className="w-full h-64 p-4 bg-[#0E0E12]/95 rounded-xl border border-white/10">
      <h3 className="text-lg font-semibold text-white mb-3">Sentiment History</h3>
      <ResponsiveContainer width="100%" height="calc(100% - 2rem)">
        <LineChart
          data={chartData}
          margin={{ top: 5, right: 20, left: -10, bottom: 5 }}
        >
          <CartesianGrid strokeDasharray="3 3" strokeOpacity={0.2} />
          <XAxis dataKey="date" stroke="#888888" fontSize={12} tickLine={false} axisLine={false} />
          <YAxis domain={[-1, 1]} stroke="#888888" fontSize={12} tickLine={false} axisLine={false} />
          <Tooltip
            contentStyle={{
              backgroundColor: 'rgba(15, 23, 42, 0.8)',
              borderColor: 'rgba(255, 255, 255, 0.2)',
              color: '#ffffff',
            }}
            labelStyle={{ fontWeight: 'bold' }}
          />
          <Line
            type="monotone"
            dataKey="sentimentScore"
            name="Score"
            stroke="#3b82f6"
            strokeWidth={2}
            dot={{ r: 4, fill: '#3b82f6' }}
            activeDot={{ r: 6, stroke: '#ffffff' }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
