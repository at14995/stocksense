'use client';
import { useState } from 'react';
import { Send, ShieldAlert } from 'lucide-react';
import { useUser } from '@/firebase';
import { createPost } from './marketplaceService';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent } from '@/components/ui/card';
import { useIsAnalyst } from './hooks/useIsAnalyst';
import { useRouter } from 'next/navigation';
import { Loader2 } from 'lucide-react';

export default function PostComposer() {
  const { user } = useUser();
  const isAnalyst = useIsAnalyst();
  const router = useRouter();

  const [text,setText]=useState('');
  const [sentiment,setSentiment]=useState<'bullish'|'bearish'|'neutral'>('neutral');
  const [tickers,setTickers]=useState('');
  const [error,setError]=useState('');

  const valid = text.trim().length>0 && text.trim().length<=500;

  async function handlePost() {
    if (!user || !valid || !isAnalyst) return;
    try {
      const tick = tickers.split(',').map(t=>t.trim().toUpperCase()).filter(Boolean);
      await createPost(user.uid, user.displayName || 'Anon', text.trim(), tick, sentiment);
      setText(''); setTickers('');
    } catch(e:any){ setError(e.message); }
  }

  if (isAnalyst === null) {
      return (
        <Card className="mb-6">
            <CardContent className="p-4 flex items-center justify-center h-24">
                <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
            </CardContent>
        </Card>
    );
  }

  if (!isAnalyst) {
    return (
        <Card className="mb-6">
            <CardContent className="p-6 text-center">
                <ShieldAlert className="h-8 w-8 mx-auto text-primary mb-2" />
                <h3 className="font-semibold">Become a Verified Analyst</h3>
                <p className="text-sm text-muted-foreground mt-1">You must have an active analyst subscription to share insights.</p>
                <Button onClick={() => router.push('/pricing')} className="mt-4">
                    View Subscription Plans
                </Button>
            </CardContent>
        </Card>
    );
  }

  return (
    <Card className="mb-6">
      <CardContent className="p-4">
        <Textarea value={text} onChange={e=>setText(e.target.value)} rows={3}
          placeholder="Share an insight or market prediction..."
          className="w-full resize-none"
        />
        <div className="flex flex-wrap gap-2 items-center justify-between mt-3">
          <Input value={tickers} onChange={e=>setTickers(e.target.value)} placeholder="Tickers (comma separated)" className="flex-1 text-sm"/>
          <Select value={sentiment} onValueChange={(v: any)=>setSentiment(v)}>
            <SelectTrigger className="w-[120px]">
              <SelectValue placeholder="Sentiment" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="bullish">Bullish</SelectItem>
              <SelectItem value="bearish">Bearish</SelectItem>
              <SelectItem value="neutral">Neutral</SelectItem>
            </SelectContent>
          </Select>
          <Button disabled={!valid} onClick={handlePost} >
            <Send className="h-4 w-4 mr-2"/> Post
          </Button>
        </div>
        {error && <p className="text-xs text-destructive mt-2">{error}</p>}
      </CardContent>
    </Card>
  );
}
