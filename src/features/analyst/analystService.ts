'use client';
import {
  addDoc, collection, doc, deleteDoc, getDoc, getDocs, onSnapshot,
  orderBy, query, serverTimestamp, updateDoc, where, increment
} from 'firebase/firestore';
import { initializeFirebase } from '@/firebase';
import { Post, Comment } from './types';

const { firestore: db } = initializeFirebase();

const POSTS = 'posts';
const COMMENTS = 'comments';
const FOLLOWS = 'follows';

export function listenPosts(cb:(p:Post[])=>void) {
  const q = query(collection(db, POSTS), orderBy('createdAt','desc'));
  return onSnapshot(q, snap=>{
    const out:Post[]=[];
    snap.forEach(d=>out.push({id:d.id,...(d.data() as any)}));
    cb(out);
  });
}

export async function createPost(ownerUid:string, username:string, content:string, tickers:string[], sentiment:'bullish'|'bearish'|'neutral') {
  await addDoc(collection(db, POSTS), {
    ownerUid, username, content, tickers, sentiment,
    likeCount:0, commentCount:0,
    createdAt: serverTimestamp(), updatedAt: serverTimestamp(),
  });
}

export async function deletePost(id:string) {
  await deleteDoc(doc(db, POSTS, id));
}

export function listenComments(postId:string, cb:(c:Comment[])=>void) {
  const q = query(collection(db, COMMENTS), where('postId','==',postId), orderBy('createdAt','asc'));
  return onSnapshot(q, snap=>{
    const out:Comment[]=[];
    snap.forEach(d=>out.push({id:d.id,...(d.data() as any)}));
    cb(out);
  });
}

export async function createComment(postId:string, ownerUid:string, username:string, content:string) {
  await addDoc(collection(db, COMMENTS), {
    postId, ownerUid, username, content, createdAt:serverTimestamp()
  });
  await updateDoc(doc(db, POSTS, postId), { commentCount: increment(1) });
}

export async function deleteComment(id:string, postId:string) {
  await deleteDoc(doc(db, COMMENTS, id));
  await updateDoc(doc(db, POSTS, postId), { commentCount: increment(-1) });
}

export async function followUser(followerUid:string, followingUid:string) {
  await addDoc(collection(db, FOLLOWS), { followerUid, followingUid, createdAt:serverTimestamp() });
}

export async function unfollowUser(followerUid:string, followingUid:string) {
  const q = query(collection(db, FOLLOWS), where('followerUid','==',followerUid), where('followingUid','==',followingUid));
  const snap = await getDocs(q);
  snap.forEach(async d=>await deleteDoc(d.ref));
}
