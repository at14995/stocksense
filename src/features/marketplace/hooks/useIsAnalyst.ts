'use client';
import { useEffect, useState } from 'react';
import { doc, onSnapshot } from 'firebase/firestore';
import { useUser, useFirestore } from '@/firebase';

export function useIsAnalyst() {
  const { user } = useUser();
  const db = useFirestore();
  const [isAnalyst, setIsAnalyst] = useState<boolean | null>(null);

  useEffect(() => {
    if (!user) {
      setIsAnalyst(false);
      return;
    }
    const unsub = onSnapshot(doc(db, 'roles', user.uid), (snap) => {
      const data = snap.data();
      const hasFullAnalystRole = snap.exists() && 
                                  data?.role === 'analyst' && 
                                  data?.isVerified === true && 
                                  data?.subscriptionActive === true;
      setIsAnalyst(hasFullAnalystRole);
    });
    return () => unsub && unsub();
  }, [user, db]);

  return isAnalyst;
}
