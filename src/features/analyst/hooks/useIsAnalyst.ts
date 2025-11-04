'use client';
import { useEffect, useState } from 'react';
import { doc, onSnapshot } from 'firebase/firestore';
import { useUser, useFirestore } from '@/firebase';

/**
 * Custom hook to check if the current user has analyst privileges.
 * Returns boolean for the user's analyst status, or null while loading.
 */
export function useIsAnalyst() {
  const { user } = useUser();
  const db = useFirestore();
  const [isAnalyst, setIsAnalyst] = useState<boolean | null>(null);

  useEffect(() => {
    if (!user) {
      setIsAnalyst(false);
      return;
    }
    
    // Listen to the user's role document in real-time.
    const unsub = onSnapshot(doc(db, 'roles', user.uid), (snap) => {
      const isAnalystRole = snap.exists() && snap.data()?.role === 'analyst' && snap.data()?.isVerified === true && snap.data()?.subscriptionActive === true;
      setIsAnalyst(isAnalystRole);
    }, (error) => {
      console.error("Error fetching user role:", error);
      setIsAnalyst(false);
    });
    
    return () => unsub();
  }, [user, db]);

  return isAnalyst;
}
