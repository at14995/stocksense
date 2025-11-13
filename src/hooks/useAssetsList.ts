
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
      // Use the environment variable for the Cloud Function URL.
      // Fallback to the local API route for development if the env var isn't set.
      const url = process.env.NEXT_PUBLIC_TRENDING_ASSETS_URL || '/api/assets';

      try {
        const res = await fetch(url);
        if (!res.ok) {
          throw new Error(`Failed to fetch assets from ${url}. Status: ${res.status}`);
        }

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
