'use client';
import {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from 'react';
import { useUser, useFirestore } from '@/firebase';
import { doc, updateDoc, getDoc } from 'firebase/firestore';

const SYMBOL_MAP: Record<string, string> = {
  USD: '$',
  EUR: '€',
  GBP: '£',
  JPY: '¥',
  INR: '₹',
};


type CurrencyContextType = {
  currency: string;
  symbol: string;
  setCurrency: (value: string) => void;
};

const CurrencyContext = createContext<CurrencyContextType>({
  currency: 'USD',
  symbol: '$',
  setCurrency: () => {},
});

export const useCurrency = () => useContext(CurrencyContext);

export function CurrencyProvider({ children }: { children: ReactNode }) {
  const { user } = useUser();
  const firestore = useFirestore();
  const [currency, setCurrencyState] = useState('USD');
  const [isInitialized, setIsInitialized] = useState(false);

  const symbol = SYMBOL_MAP[currency] || '$';

  const setCurrency = async (newCurrency: string) => {
    setCurrencyState(newCurrency);
    localStorage.setItem('currency', newCurrency);
    if (user && firestore) {
      const userRef = doc(firestore, 'users', user.uid);
      try {
        await updateDoc(userRef, { preferredCurrency: newCurrency });
      } catch (error) {
        console.error('Failed to update currency in Firestore:', error);
      }
    }
  };

  useEffect(() => {
    const initializeCurrency = async () => {
      if (user && firestore) {
        const userRef = doc(firestore, 'users', user.uid);
        const snap = await getDoc(userRef);
        if (snap.exists() && snap.data()?.preferredCurrency) {
          setCurrencyState(snap.data().preferredCurrency);
        } else {
          // If no preference in Firestore, check localStorage
          const localCurrency = localStorage.getItem('currency');
          if (localCurrency) {
            setCurrencyState(localCurrency);
          }
        }
      } else {
        // Guest user
        const localCurrency = localStorage.getItem('currency');
        if (localCurrency) {
          setCurrencyState(localCurrency);
        }
      }
      setIsInitialized(true);
    };

    initializeCurrency();
  }, [user, firestore]);

  if (!isInitialized) {
    // You can return a loader here if you want to avoid a flash of default content
    return null; 
  }
  
  return (
    <CurrencyContext.Provider value={{ currency, symbol, setCurrency }}>
      {children}
    </CurrencyContext.Provider>
  );
}
