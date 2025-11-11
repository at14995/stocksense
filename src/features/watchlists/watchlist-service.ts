'use client';
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDocs,
  orderBy,
  query,
  serverTimestamp,
  updateDoc,
  where,
  onSnapshot,
  getDoc,
  limit
} from 'firebase/firestore';
import { getFirestore } from 'firebase/firestore';
import type { Watchlist } from './types';
import { initializeFirebase } from '@/firebase';

const { firestore } = initializeFirebase();
const db = firestore;

const COL = 'watchlists';

export function listenUserWatchlists(
  ownerUid: string,
  cb: (items: Watchlist[]) => void,
  onError?: (err: Error) => void
) {
  const q = query(
    collection(db, COL),
    where('ownerUid', '==', ownerUid),
    orderBy('updatedAt', 'desc')
  );

  return onSnapshot(
    q,
    (snap) => {
      const out: Watchlist[] = [];
      snap.forEach((d) => out.push({ id: d.id, ...(d.data() as any) }));
      cb(out);
    },
    (err: any) => {
      console.error('Error listening to watchlists:', err);
      if (onError) onError(err);
    }
  );
}

export async function createWatchlist(
  ownerUid: string,
  name: string,
  publicFlag = true
) {
  const ref = await addDoc(collection(db, COL), {
    ownerUid,
    name: name.trim(),
    symbols: [],
    public: publicFlag,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });
  return ref.id;
}

export async function renameWatchlist(id: string, name: string) {
  await updateDoc(doc(db, COL, id), {
    name: name.trim(),
    updatedAt: serverTimestamp(),
  });
}

export async function setWatchlistPublic(id: string, publicFlag: boolean) {
  await updateDoc(doc(db, COL, id), {
    public: publicFlag,
    updatedAt: serverTimestamp(),
  });
}

export async function deleteWatchlist(id: string) {
  await deleteDoc(doc(db, COL, id));
}

async function getSymbols(id: string): Promise<string[]> {
  const snapshot = await getDoc(doc(db, COL, id));
  return (snapshot.exists() ? snapshot.data().symbols ?? [] : []) as string[];
}

export function normalizeSymbol(input: string) {
  return input
    .trim()
    .toUpperCase()
    .replace(/[^A-Z0-9:_\-./]/g, '');
}


export async function addSymbol(id: string, symbol: string) {
  const s = normalizeSymbol(symbol);
  const current = await getSymbols(id);
  if (current.includes(s)) return;
  await updateDoc(doc(db, COL, id), {
    symbols: [...current, s],
    updatedAt: serverTimestamp(),
  });
}

export async function removeSymbol(id: string, symbol: string) {
  const s = normalizeSymbol(symbol);
  const current = await getSymbols(id);
  await updateDoc(doc(db, COL, id), {
    symbols: current.filter((x) => x !== s),
    updatedAt: serverTimestamp(),
  });
}

export async function addSymbolToWatchlist(ownerUid: string, symbol: string) {
    const s = normalizeSymbol(symbol);
    const q = query(
        collection(db, COL),
        where('ownerUid', '==', ownerUid),
        orderBy('createdAt', 'asc'),
        limit(1)
    );

    const snapshot = await getDocs(q);
    if (snapshot.empty) {
        throw new Error("No watchlist found for the user.");
    }
    
    const watchlistDoc = snapshot.docs[0];
    const watchlistId = watchlistDoc.id;
    const currentSymbols = watchlistDoc.data().symbols || [];

    if (currentSymbols.includes(s)) {
        throw new Error(`${s} is already in your watchlist.`);
    }

    await updateDoc(doc(db, COL, watchlistId), {
        symbols: [...currentSymbols, s],
        updatedAt: serverTimestamp(),
    });
}

export async function addSymbolToWatchlistToId(watchlistId: string, symbol: string) {
  const s = normalizeSymbol(symbol);

  const docRef = doc(db, 'watchlists', watchlistId);
  const snap = await getDoc(docRef);

  if (!snap.exists()) {
    throw new Error('Watchlist not found');
  }

  const currentSymbols: string[] = snap.data().symbols ?? [];

  if (currentSymbols.includes(s)) {
    throw new Error(`${s} is already in this watchlist`);
  }

  await updateDoc(docRef, {
    symbols: [...currentSymbols, s],
    updatedAt: serverTimestamp(),
  });
}