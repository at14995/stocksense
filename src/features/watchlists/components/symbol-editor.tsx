'use client';
import { useState } from 'react';
import { X, PlusCircle } from 'lucide-react';
import { addSymbol, removeSymbol, normalizeSymbol } from '../watchlist-service';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';

export default function SymbolEditor({
  watchlistId,
  symbols,
}: {
  watchlistId: string;
  symbols: string[];
}) {
  const [input, setInput] = useState('');
  const [err, setErr] = useState<string | null>(null);
  const { toast } = useToast();

  function validate(s: string) {
    if (!/^[A-Z0-9:._-]{1,15}$/.test(s))
      return 'Invalid symbol format. Use A–Z, 0–9, and special chars like : . _ - up to 15 chars.';
    if (symbols.includes(s)) return 'Symbol is already in the list.';
    if (symbols.length >= 100) return 'Maximum of 100 symbols reached.';
    return null;
  }

  const handleAddSymbol = async () => {
    const s = normalizeSymbol(input);
    const validationError = validate(s);
    if (validationError) {
      setErr(validationError);
      return;
    }
    try {
      await addSymbol(watchlistId, s);
      setInput('');
      setErr(null);
      toast({ title: 'Symbol Added', description: `${s} has been added to your watchlist.` });
    } catch (e) {
      setErr('Failed to add symbol. Please try again.');
    }
  };

  const handleRemoveSymbol = async (sym: string) => {
    try {
        await removeSymbol(watchlistId, sym);
        toast({ title: 'Symbol Removed', description: `${sym} has been removed.` });
    } catch(e) {
        toast({ variant: 'destructive', title: 'Error', description: 'Failed to remove symbol.' });
    }
  }

  return (
    <div className="mt-6">
      <div className="flex gap-2">
        <Input
          value={input}
          onChange={(e) => {
            setInput(e.target.value);
            setErr(null);
          }}
          onKeyUp={(e) => e.key === 'Enter' && handleAddSymbol()}
          placeholder="e.g., BTC/USDT or AAPL"
          aria-label="Add symbol"
          maxLength={20}
        />
        <Button onClick={handleAddSymbol} disabled={!input.trim()}>
          <PlusCircle className="h-4 w-4 mr-2" /> Add
        </Button>
      </div>
      {err && <p className="text-xs text-destructive mt-2">{err}</p>}

      <div className="mt-4 flex flex-wrap gap-2">
        {symbols.map((sym) => (
          <Badge variant="secondary" key={sym} className="text-base font-normal">
            {sym}
            <button
              aria-label={`Remove ${sym}`}
              onClick={() => handleRemoveSymbol(sym)}
              className="ml-2 rounded-full p-0.5 hover:bg-destructive/20 text-muted-foreground hover:text-destructive"
            >
              <X className="h-3 w-3" />
            </button>
          </Badge>
        ))}
        {symbols.length === 0 && (
          <p className="text-sm text-muted-foreground w-full text-center py-4">
            No symbols yet. Add one to get started.
          </p>
        )}
      </div>
    </div>
  );
}
