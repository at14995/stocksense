
'use client';
import { useEffect, useState } from 'react';

export interface AssetItem {
    symbol: string;
    name: string;
}

export function useAssetsList() {
  const [assets, setAssets] = useState<AssetItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchAssets = async () => {
      try {
        const res = await fetch('/api/assets');
        if (!res.ok) throw new Error('Failed to fetch assets');

        const data = await res.json();
        setAssets(data);
      } catch (err) {
        console.error('Assets fetch error:', err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchAssets();
  }, []);

  return { assets, isLoading };
}
