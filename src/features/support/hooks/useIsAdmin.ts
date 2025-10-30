'use client';
import { useEffect, useState } from 'react';
import { doc, onSnapshot } from 'firebase/firestore';
import { useUser, useFirestore } from '@/firebase';

export function useIsAdmin() {
  const { user } = useUser();
  const db = useFirestore();
  const [isAdmin, setIsAdmin] = useState<boolean | null>(null);

  useEffect(() => {
    if (!user) {
      setIsAdmin(false);
      return;
    }
    const unsub = onSnapshot(doc(db, 'roles', user.uid), (snap) => {
      setIsAdmin(snap.exists() && snap.data()?.role === 'admin');
    });
    return () => unsub && unsub();
  }, [user, db]);

  return isAdmin;
}
