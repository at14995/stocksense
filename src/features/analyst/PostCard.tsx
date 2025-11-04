'use client';
import { useState, useEffect } from 'react';
import { MessageSquare, Trash2 } from 'lucide-react';
import { useUser } from '@/firebase';
import { deletePost, listenComments, createComment, deleteComment } from './analystService';
import CommentList from './CommentList';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';

export default function PostCard({ post }:{ post:any }) {
  const { user } = useUser();
  const [open,setOpen]=useState(false);
  const [comments,setComments]=useState([]);
  const [commentText,setCommentText]=useState('');

  useEffect(()=>{
    if (!open) return;
    const unsub = listenComments(post.id,setComments);
    return ()=>unsub && unsub();
  },[open,post.id]);
  
  const sentimentColor = 
    post.sentiment === 'bullish' ? 'bg-green-500/20 text-green-700 dark:text-green-300 border-green-500/20' :
    post.sentiment === 'bearish' ? 'bg-red-500/20 text-red-700 dark:text-red-300 border-red-500/20' :
    'bg-gray-500/20 text-gray-700 dark:text-gray-300 border-gray-500/20';

  return (
    <Card>
      <CardHeader className="flex flex-row items-start justify-between">
        <div className="flex items-center gap-3">
          <Avatar>
            <AvatarFallback>{post.username.charAt(0)}</AvatarFallback>
          </Avatar>
          <div>
            <h3 className="font-semibold">{post.username}</h3>
            <p className="text-xs text-muted-foreground">{new Date(post.createdAt?.toDate()).toLocaleString()}</p>
          </div>
        </div>
        {user?.uid===post.ownerUid && (
          <Button variant="ghost" size="icon" onClick={()=>deletePost(post.id)} className="h-8 w-8 text-muted-foreground hover:text-destructive">
            <Trash2 className="h-4 w-4"/>
          </Button>
        )}
      </CardHeader>
      <CardContent>
        <p className="whitespace-pre-line">{post.content}</p>
        <div className="mt-4 flex gap-2">
            {post.tickers.map((t: string) => <Badge key={t} variant="secondary">{t}</Badge>)}
            <Badge variant="outline" className={sentimentColor}>{post.sentiment}</Badge>
        </div>
      </CardContent>
      <CardFooter className="flex-col items-start">
        <Button variant="link" onClick={()=>setOpen(o=>!o)} className="p-0 h-auto text-muted-foreground">
          <MessageSquare className="h-4 w-4 mr-2"/> {open ? 'Hide Comments' : `Comments (${post.commentCount || 0})`}
        </Button>

        {open && (
          <div className="mt-4 w-full">
            <CommentList comments={comments} onDelete={(id)=>deleteComment(id,post.id)}/>
            {user && (
              <div className="flex gap-2 mt-4">
                <Input value={commentText} onChange={e=>setCommentText(e.target.value)} placeholder="Write a comment..." className="flex-1"/>
                <Button disabled={!commentText.trim()} onClick={async()=>{
                  await createComment(post.id,user.uid,user.displayName || 'Anon',commentText.trim());
                  setCommentText('');
                }}>Send</Button>
              </div>
            )}
          </div>
        )}
      </CardFooter>
    </Card>
  );
}
