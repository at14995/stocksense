'use client';
import { useEffect, useMemo, useState } from 'react';
import {
  Plus,
  MoreVertical,
  Trash2,
  Edit,
  Eye,
  EyeOff,
  List,
} from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useUser } from '@/firebase';
import {
  listenUserWatchlists,
  createWatchlist,
  deleteWatchlist,
  renameWatchlist,
  setWatchlistPublic,
} from '../watchlist-service';
import CreateWatchlistDialog from './create-watchlist-dialog';
import RenameWatchlistDialog from './rename-watchlist-dialog';
import DeleteWatchlistDialog from './delete-watchlist-dialog';
import SymbolEditor from './symbol-editor';
import PublicToggle from './public-toggle';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Watchlist } from '../types';

export default function WatchlistPanel() {
  const { user } = useUser();
  const [items, setItems] = useState<Watchlist[]>([]);
  const [activeId, setActiveId] = useState<string | null>(null);
  const [openCreate, setOpenCreate] = useState(false);
  const [rename, setRename] = useState<{ id: string; name: string } | null>(
    null
  );
  const [deleting, setDeleting] = useState<string | null>(null);

  useEffect(() => {
    if (!user) return;
    const unsub = listenUserWatchlists(user.uid, (lists) => {
      setItems(lists);
      if (!activeId && lists.length) setActiveId(lists[0].id);
      if (activeId && !lists.some(l => l.id === activeId)) {
        setActiveId(lists[0]?.id || null);
      }
    });
    return () => unsub && unsub();
  }, [user, activeId]);

  const active = useMemo(() => items.find((x) => x.id === activeId), [
    items,
    activeId,
  ]);

  if (!user) return null;

  return (
    <div className="grid gap-6">
      <Card>
        <CardContent className="p-4 md:p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <List className="h-5 w-5" />
              <h2 className="font-semibold text-lg">My Watchlists</h2>
            </div>
            <Button
              onClick={() => setOpenCreate(true)}
              aria-label="Create watchlist"
            >
              <Plus className="h-4 w-4 mr-2" /> New
            </Button>
          </div>
          {/* Tabs-like selector */}
          <div className="mt-4 flex flex-wrap gap-2 border-b pb-4">
            {items.map((wl: any) => (
              <button
                key={wl.id}
                className={`px-3 py-1.5 rounded-full border text-sm transition-colors ${
                  activeId === wl.id
                    ? 'bg-primary text-primary-foreground border-primary'
                    : 'border-border hover:bg-accent'
                }`}
                onClick={() => setActiveId(wl.id)}
              >
                <span>{wl.name}</span>
              </button>
            ))}
            {items.length === 0 && (
              <p className="text-sm text-muted-foreground pt-2">
                No watchlists yet. Create your first one.
              </p>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Active watchlist editor */}
      {active && (
        <Card>
          <CardContent className="p-4 md:p-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <h3 className="font-semibold text-xl">{active.name}</h3>
                <PublicToggle
                  id={active.id}
                  value={!!active.public}
                  onChange={(v) => setWatchlistPublic(active.id, v)}
                />
                <span className="text-sm text-muted-foreground">
                  {active.symbols?.length ?? 0} symbols
                </span>
              </div>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" aria-label="Watchlist options">
                    <MoreVertical className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem
                    onClick={() => setRename({ id: active.id, name: active.name })}
                    className="flex items-center gap-2 cursor-pointer"
                  >
                    <Edit className="h-4 w-4" /> Rename
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() => setDeleting(active.id)}
                    className="text-red-600 flex items-center gap-2 cursor-pointer focus:bg-red-500/10 focus:text-red-600"
                  >
                    <Trash2 className="h-4 w-4" /> Delete
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>

            <SymbolEditor
              watchlistId={active.id}
              symbols={active.symbols || []}
            />
          </CardContent>
        </Card>
      )}

      <CreateWatchlistDialog
        open={openCreate}
        onOpenChange={setOpenCreate}
        onCreate={async (name, publicFlag) => {
          if (!user) return;
          const id = await createWatchlist(user.uid, name, publicFlag);
          setOpenCreate(false);
          setActiveId(id);
        }}
      />

      {rename && (
        <RenameWatchlistDialog
          name={rename.name}
          onCancel={() => setRename(null)}
          onConfirm={async (newName) => {
            await renameWatchlist(rename!.id, newName);
            setRename(null);
          }}
        />
      )}

      {deleting && (
        <DeleteWatchlistDialog
          onCancel={() => setDeleting(null)}
          onConfirm={async () => {
            await deleteWatchlist(deleting);
            const remain = items.filter((x: any) => x.id !== deleting);
            setActiveId(remain[0]?.id ?? null);
            setDeleting(null);
          }}
        />
      )}
    </div>
  );
}
