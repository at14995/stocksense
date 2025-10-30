'use client';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useState } from 'react';
import { Loader2 } from 'lucide-react';

export default function RenameWatchlistDialog({
  name,
  onCancel,
  onConfirm,
}: {
  name: string;
  onCancel: () => void;
  onConfirm: (newName: string) => Promise<void> | void;
}) {
  const [val, setVal] = useState(name);
  const [isLoading, setIsLoading] = useState(false);
  const valid = val.trim().length >= 1 && val.trim().length <= 40;

  const handleSubmit = async () => {
    if (!valid) return;
    setIsLoading(true);
    try {
      await onConfirm(val.trim());
    } catch (e) {
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <Dialog open onOpenChange={(o) => !o && onCancel()}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Rename Watchlist</DialogTitle>
        </DialogHeader>
        <div className="mt-4 space-y-2">
           <Label htmlFor="rename-name">Name</Label>
          <Input
            id="rename-name"
            value={val}
            onChange={(e) => setVal(e.target.value)}
            maxLength={40}
          />
           {!valid && val.length > 0 && (
              <p className="text-xs text-destructive mt-1">
                Name must be between 1 and 40 characters.
              </p>
            )}
        </div>
        <DialogFooter className="pt-4">
          <Button variant="outline" onClick={onCancel}>
            Cancel
          </Button>
          <Button disabled={!valid || isLoading} onClick={handleSubmit}>
            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Save
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
