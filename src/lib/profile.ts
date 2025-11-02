import { doc, setDoc, serverTimestamp, Firestore, updateDoc, deleteDoc } from 'firebase/firestore';
import { Auth, updateProfile, deleteUser } from 'firebase/auth';

export async function ensureUserProfile(db: Firestore, uid: string, data: { displayName: string | null, email: string | null }) {
  if (!uid) return;
  const ref = doc(db, 'users', uid);
  await setDoc(
    ref,
    {
      displayName: data.displayName || '',
      email: data.email || '',
      photoURL: '',
      preferredCurrency: 'USD',
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    },
    { merge: true }
  );
}


export async function updateUserProfile(
  db: Firestore,
  auth: Auth,
  uid: string,
  data: { displayName: string }
) {
  if (!uid || !auth.currentUser) throw new Error('User not authenticated.');
  if (auth.currentUser.uid !== uid) throw new Error('Permission denied.');

  const userDocRef = doc(db, 'users', uid);
  await updateDoc(userDocRef, {
    displayName: data.displayName,
    updatedAt: serverTimestamp(),
  });

  await updateProfile(auth.currentUser, {
    displayName: data.displayName,
  });
}

export async function deleteUserAccount(db: Firestore, auth: Auth, uid: string) {
  if (!auth.currentUser) throw new Error('User not authenticated.');
  if (auth.currentUser.uid !== uid) throw new Error('Permission denied.');

  // 1. Delete Firestore document
  const userDocRef = doc(db, 'users', uid);
  await deleteDoc(userDocRef);

  // 2. Delete Firebase Auth user
  await deleteUser(auth.currentUser);
}
