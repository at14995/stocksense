'use client';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Eye, EyeOff } from 'lucide-react';

export default function PublicToggle({
  id,
  value,
  onChange,
}: {
  id: string;
  value: boolean;
  onChange: (v: boolean) => void;
}) {
  return (
    <div className="flex items-center space-x-2">
      <Switch
        id={`public-toggle-${id}`}
        checked={value}
        onCheckedChange={onChange}
        aria-label="Toggle watchlist privacy"
      />
      <Label htmlFor={`public-toggle-${id}`} className="flex items-center gap-1 text-xs text-muted-foreground">
        {value ? <Eye className="h-3 w-3" /> : <EyeOff className="h-3 w-3" />}
        {value ? 'Public' : 'Private'}
      </Label>
    </div>
  );
}
