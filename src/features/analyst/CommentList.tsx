'use client';
import { useUser } from '@/firebase';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Trash2 } from 'lucide-react';
import type { Comment } from './types';

export default function CommentList({
  comments,
  onDelete,
}: {
  comments: Comment[];
  onDelete: (id: string) => void;
}) {
  const { user } = useUser();

  return (
    <div className="space-y-3">
      {comments.map((c) => (
        <div
          key={c.id}
          className="flex items-start justify-between gap-3 bg-muted/30 p-3 rounded-lg"
        >
          <div className="flex items-start gap-3">
            <Avatar className="h-8 w-8">
              <AvatarFallback>{c.username.charAt(0)}</AvatarFallback>
            </Avatar>
            <div>
              <p className="text-sm font-semibold">{c.username}</p>
              <p className="text-sm text-muted-foreground">{c.content}</p>
            </div>
          </div>
          {user?.uid === c.ownerUid && (
            <Button
              size="icon"
              variant="ghost"
              onClick={() => onDelete(c.id)}
              className="h-8 w-8 text-muted-foreground hover:text-destructive shrink-0"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          )}
        </div>
      ))}
    </div>
  );
}
