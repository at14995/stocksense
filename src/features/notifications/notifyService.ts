'use client';
import { addDoc, collection, serverTimestamp } from 'firebase/firestore';
import { initializeFirebase } from '@/firebase';

const { firestore: db } = initializeFirebase();

export async function notify(
  uid: string,
  type: string,
  title: string,
  body: string,
  href?: string
) {
  await addDoc(collection(db, 'notifications'), {
    uid,
    type,
    title,
    body,
    href: href || null,
    read: false,
    createdAt: serverTimestamp(),
  });
}
