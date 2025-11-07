
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
import AssetIcon from '@/components/ui/AssetIcon';

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
    post.sentiment === 'bullish' ? 'bg-green-500/20 text-green-400 border-green-500/20' :
    post.sentiment === 'bearish' ? 'bg-red-500/20 text-red-400 border-red-500/20' :
    'bg-gray-500/20 text-gray-400 border-gray-500/20';

  return (
    <Card className="bg-[#121521]/95 border border-white/10 rounded-2xl p-6 md:p-8 shadow-xl shadow-black/30 animate-fadeIn">
      <CardHeader className="flex flex-row items-start justify-between">
        <div className="flex items-center gap-3">
          <Avatar>
            <AvatarFallback>{post.username.charAt(0)}</AvatarFallback>
          </Avatar>
          <div>
            <h3 className="font-semibold text-white">{post.username}</h3>
            <p className="text-xs text-gray-400">{new Date(post.createdAt?.toDate()).toLocaleString()}</p>
          </div>
        </div>
        {user?.uid===post.ownerUid && (
          <Button variant="ghost" size="icon" onClick={()=>deletePost(post.id)} className="h-8 w-8 text-gray-400 hover:text-red-500 hover:bg-red-500/10">
            <Trash2 className="h-4 w-4"/>
          </Button>
        )}
      </CardHeader>
      <CardContent>
        <p className="whitespace-pre-line text-gray-300">{post.content}</p>
        <div className="mt-4 flex flex-wrap items-center gap-2">
            {post.tickers.map((t: string) => (
              <Badge key={t} variant="secondary" className="flex items-center gap-1.5">
                <AssetIcon symbol={t} size={14} />
                {t}
              </Badge>
            ))}
            <Badge variant="outline" className={sentimentColor}>{post.sentiment}</Badge>
        </div>
      </CardContent>
      <CardFooter className="flex-col items-start pt-4">
        <Button variant="link" onClick={()=>setOpen(o=>!o)} className="p-0 h-auto text-gray-400 hover:text-indigo-400">
          <MessageSquare className="h-4 w-4 mr-2"/> {open ? 'Hide Comments' : `Comments (${post.commentCount || 0})`}
        </Button>

        {open && (
          <div className="mt-4 w-full transition-all duration-300 ease-in-out">
            <CommentList comments={comments} onDelete={(id)=>deleteComment(id,post.id)}/>
            {user && (
              <div className="flex gap-2 mt-4">
                <Input value={commentText} onChange={e=>setCommentText(e.target.value)} placeholder="Write a comment..." className="flex-1 h-10"/>
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
