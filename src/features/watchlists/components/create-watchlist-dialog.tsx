'use client';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogClose,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { useState } from 'react';
import { Loader2 } from 'lucide-react';

export default function CreateWatchlistDialog({
  open,
  onOpenChange,
  onCreate,
}: {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  onCreate: (
    name: string,
    publicFlag: boolean
  ) => Promise<void> | void;
}) {
  const [name, setName] = useState('');
  const [pub, setPub] = useState(true);
  const [err, setErr] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const valid = name.trim().length >= 1 && name.trim().length <= 40;

  const handleSubmit = async () => {
    if (!valid) return;
    setIsLoading(true);
    setErr(null);
    try {
      await onCreate(name.trim(), pub);
    } catch (e: any) {
      setErr(e?.message ?? 'Failed to create watchlist.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>New Watchlist</DialogTitle>
        </DialogHeader>
        <div className="mt-4 space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Name</Label>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              maxLength={40}
            />
            {!valid && name.length > 0 && (
              <p className="text-xs text-destructive mt-1">
                Name must be between 1 and 40 characters.
              </p>
            )}
          </div>
          <div className="flex items-center space-x-2">
            <Checkbox id="public" checked={pub} onCheckedChange={(c) => setPub(!!c)} />
            <Label htmlFor="public" className="text-sm font-normal">
              Make this watchlist public on my profile
            </Label>
          </div>
          {err && <p className="text-sm text-destructive">{err}</p>}
        </div>
        <DialogFooter className="pt-4">
          <DialogClose asChild>
            <Button variant="outline">Cancel</Button>
          </DialogClose>
          <Button disabled={!valid || isLoading} onClick={handleSubmit}>
            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Create
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
