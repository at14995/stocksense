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
  data: Omit<Alert, 'id' | 'ownerUid' | 'status' | 'createdAt' | 'updatedAt'>
) {
  const ref = await addDoc(collection(db, COL), {
    ownerUid,
    ...data,
    status: 'active',
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });
  return ref.id;
}

export async function updateAlert(id: string, data: Partial<Pick<Alert, 'target' | 'notificationMethod' | 'exchange'>>) {
  await updateDoc(doc(db, COL, id), {
    ...data,
    updatedAt: serverTimestamp(),
  });
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
