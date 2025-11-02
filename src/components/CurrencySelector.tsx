'use client';

import { useCurrency } from '@/context/CurrencyContext';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

const CURRENCIES = ['USD', 'EUR', 'GBP', 'JPY', 'INR'];

export function CurrencySelector() {
  const { currency, setCurrency } = useCurrency();

  return (
    <Select value={currency} onValueChange={setCurrency}>
      <SelectTrigger className="w-24 bg-transparent border-gray-700 h-9 text-sm focus:ring-primary">
        <SelectValue placeholder="Currency" />
      </SelectTrigger>
      <SelectContent>
        {CURRENCIES.map((cur) => (
          <SelectItem key={cur} value={cur}>
            {cur}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
