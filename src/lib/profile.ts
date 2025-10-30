import { doc, setDoc, serverTimestamp, Firestore } from 'firebase/firestore';

export async function ensureUserProfile(db: Firestore, uid: string, data: { displayName: string | null, email: string | null }) {
  if (!uid) return;
  const ref = doc(db, 'users', uid);
  await setDoc(
    ref,
    {
      displayName: data.displayName || '',
      email: data.email || '',
      photoURL: '',
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    },
    { merge: true }
  );
}
