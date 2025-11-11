'use client';
import { doc, onSnapshot } from 'firebase/firestore';
import { useEffect, useState } from 'react';
import { useUser, useFirestore } from '@/firebase';

export type UserRole = 'free' | 'trader' | 'analyst' | 'admin';

export function useRole() {
  const { user } = useUser();
  const db = useFirestore();
  const [role, setRole] = useState<UserRole>('free');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      setRole('free');
      setLoading(false);
      return;
    }
    setLoading(true);
    const unsub = onSnapshot(doc(db, 'roles', user.uid), (snap) => {
      if (snap.exists()) {
        // Ensure role is one of the defined types, default to 'free'
        const roleData = snap.data().role;
        if (['free', 'trader', 'analyst', 'admin'].includes(roleData)) {
          setRole(roleData);
        } else {
          setRole('free');
        }
      } else {
        // If no role document, default to 'free'
        setRole('free');
      }
      setLoading(false);
    }, (error) => {
        console.error("Error fetching user role:", error);
        setRole('free'); // Default to 'free' on error
        setLoading(false);
    });
    
    return () => unsub();
  }, [user, db]);

  return { role, loading };
}
