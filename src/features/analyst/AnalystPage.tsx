'use client';
import { useEffect, useState } from 'react';
import { listenPosts } from './analystService';
import PostComposer from './PostComposer';
import PostCard from './PostCard';
import { motion } from 'framer-motion';

export default function AnalystPage() {
  const [posts,setPosts]=useState([]);
  useEffect(()=>{ const unsub = listenPosts(setPosts); return ()=>unsub&&unsub(); },[]);
  
  return (
    <motion.div 
      className="container mx-auto max-w-3xl py-8" 
      initial={{opacity:0,y:10}} 
      animate={{opacity:1,y:0}} 
      transition={{duration:0.3}}
    >
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold tracking-tight">Analyst Hub</h1>
        <p className="text-muted-foreground mt-2">Discover insights and predictions from top analysts.</p>
      </div>
      <PostComposer />
      <div className="space-y-4">
        {posts.map((p: any)=><PostCard key={p.id} post={p}/>)}
      </div>
      {posts.length===0 && <p className="text-center text-muted-foreground mt-12">No posts yet. Be the first to share an insight.</p>}
    </motion.div>
  );
}
