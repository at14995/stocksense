'use client';
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  updateDoc,
  query,
  where,
  orderBy,
  onSnapshot,
  serverTimestamp,
} from 'firebase/firestore';
import { initializeFirebase } from '@/firebase';
import type { Alert } from './types';

const { firestore: db } = initializeFirebase();

const COL = 'alerts';

export function listenUserAlerts(
  ownerUid: string,
  cb: (items: Alert[]) => void
) {
  if (process.env.NODE_ENV === 'development') {
    const dummyAlerts: Alert[] = [
      { id: '1', ownerUid, symbol: 'DUMMY', condition: 'above', target: 100, status: 'active' },
      { id: '2', ownerUid, symbol: 'TEST', condition: 'below', target: 50, status: 'triggered' },
    ];
    cb(dummyAlerts);
    return () => {}; // Return an empty unsubscribe function
  }

  const q = query(
    collection(db, COL),
    where('ownerUid', '==', ownerUid),
    orderBy('updatedAt', 'desc')
  );
  return onSnapshot(q, (snap) => {
    const list: Alert[] = [];
    snap.forEach((d) => list.push({ id: d.id, ...(d.data() as any) }));
    cb(list);
  });
}

export async function createAlert(
  ownerUid: string,
  symbol: string,
  condition: 'above' | 'below',
  target: number
) {
  const ref = await addDoc(collection(db, COL), {
    ownerUid,
    symbol: symbol.trim().toUpperCase(),
    condition,
    target,
    status: 'active',
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });
  return ref.id;
}

export async function updateAlertStatus(
  id: string,
  status: 'active' | 'triggered' | 'archived'
) {
  await updateDoc(doc(db, COL, id), { status, updatedAt: serverTimestamp() });
}

export async function deleteAlert(id: string) {
  await deleteDoc(doc(db, COL, id));
}
