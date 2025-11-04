'use client';
import {
  addDoc,
  collection,
  doc,
  updateDoc,
  deleteDoc,
  onSnapshot,
  query,
  where,
  orderBy,
  serverTimestamp,
  getDocs,
} from 'firebase/firestore';
import { initializeFirebase } from '@/firebase';
import { Ticket, TicketStatus, TicketPriority } from './types';

const { firestore: db } = initializeFirebase();
const COL = 'tickets';

export function listenMyTickets(uid: string, cb: (items: Ticket[]) => void) {
  if (!uid.startsWith('guest_') && process.env.NODE_ENV === 'development') {
    const dummyTickets: Ticket[] = [
      { id: '1', ownerUid: uid, subject: 'Dev Ticket', message: 'My app is in dev mode.', status: 'open', priority: 'normal', lastActor: 'user' },
    ];
    cb(dummyTickets);
    return () => {}; // Return an empty unsubscribe function
  }

  const q = query(
    collection(db, COL),
    where('ownerUid', '==', uid),
    orderBy('updatedAt', 'desc')
  );
  return onSnapshot(q, (snap) => {
    const out: Ticket[] = [];
    snap.forEach((d) => out.push({ id: d.id, ...(d.data() as any) }));
    cb(out);
  });
}

export function listenAllTicketsByStatus(
  status: TicketStatus | 'all',
  cb: (items: Ticket[]) => void
) {
  if (process.env.NODE_ENV === 'development') {
    const dummyTickets: Ticket[] = [
      { id: '1', ownerUid: 'dummy-user-id', subject: 'Admin Dev Ticket', message: 'This is a placeholder for admins.', status: 'open', priority: 'high', lastActor: 'user' },
    ];
    cb(dummyTickets.filter(t => status === 'all' || t.status === status));
    return () => {};
  }
  
  const base = collection(db, COL);
  const qy =
    status === 'all'
      ? query(base, orderBy('status', 'asc'), orderBy('updatedAt', 'desc'))
      : query(base, where('status', '==', status), orderBy('updatedAt', 'desc'));
  return onSnapshot(qy, (snap) => {
    const out: Ticket[] = [];
    snap.forEach((d) => out.push({ id: d.id, ...(d.data() as any) }));
    cb(out);
  });
}

export async function createTicket(
  ownerUid: string,
  subject: string,
  message: string,
  priority: TicketPriority = 'normal'
) {
  const ref = await addDoc(collection(db, COL), {
    ownerUid,
    subject: subject.trim(),
    message: message.trim(),
    status: 'open',
    priority,
    lastActor: 'user',
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });
  return ref.id;
}

export async function updateTicketUser(
  id: string,
  subject: string,
  message: string
) {
  await updateDoc(doc(db, COL, id), {
    subject: subject.trim(),
    message: message.trim(),
    lastActor: 'user',
    updatedAt: serverTimestamp(),
  });
}

export async function adminUpdateTicket(
  id: string,
  patch: Partial<
    Pick<
      Ticket,
      'status' | 'priority' | 'adminAssigneeUid' | 'resolutionNotes'
    >
  >
) {
  await updateDoc(doc(db, COL, id), {
    ...patch,
    lastActor: 'admin',
    updatedAt: serverTimestamp(),
  });
}

export async function deleteTicket(id: string) {
  await deleteDoc(doc(db, COL, id));
}
