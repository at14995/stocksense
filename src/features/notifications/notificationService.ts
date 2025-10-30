'use client';
import {
  collection,
  onSnapshot,
  query,
  where,
  orderBy,
  updateDoc,
  doc,
  serverTimestamp,
  addDoc,
} from 'firebase/firestore';
import { useEffect, useState } from 'react';
import { initializeFirebase } from '@/firebase';

const { firestore: db } = initializeFirebase();

export type Notification = {
  id: string;
  uid: string;
  type: 'alert' | 'ticket' | 'system';
  title: string;
  body: string;
  href?: string;
  read: boolean;
  createdAt?: any;
  emailSent?: boolean;
};

export function useUserNotifications(uid: string | null) {
  const [items, setItems] = useState<Notification[]>([]);
  useEffect(() => {
    if (!uid) {
      setItems([]);
      return;
    };
    const q = query(
      collection(db, 'notifications'),
      where('uid', '==', uid),
      orderBy('createdAt', 'desc')
    );
    const unsub = onSnapshot(q, (snap) => {
      const out: Notification[] = [];
      snap.forEach((d) => out.push({ id: d.id, ...(d.data() as any) }));
      setItems(out);
    });
    return () => unsub && unsub();
  }, [uid]);
  return items;
}

export async function markAsRead(id: string) {
  await updateDoc(doc(db, 'notifications', id), { read: true });
}

export async function createNotification(
  uid: string,
  type: 'alert' | 'ticket' | 'system',
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
    emailSent: false,
  });
}
