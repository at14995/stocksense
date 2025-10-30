'use client';
import { Trash2 } from 'lucide-react';
import { useUser } from '@/firebase';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';

export default function CommentList({ comments, onDelete }:{ comments:any[], onDelete:(id:string)=>void }) {
  const { user } = useUser();
  return (
    <div className="space-y-3 pt-3">
      {comments.map(c=>(
        <div key={c.id}>
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm font-semibold">{c.username}</p>
              <p className="text-sm text-muted-foreground">{c.content}</p>
            </div>
            {user?.uid===c.ownerUid && (
              <Button variant="ghost" size="icon" onClick={()=>onDelete(c.id)} className="h-7 w-7 text-muted-foreground hover:text-destructive">
                <Trash2 className="h-4 w-4"/>
              </Button>
            )}
          </div>
        </div>
      ))}
      {comments.length===0 && <p className="text-sm text-center text-muted-foreground py-4">No comments yet.</p>}
    </div>
  );
}
