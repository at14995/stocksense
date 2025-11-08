
'use client';

import Image from 'next/image';
import { getAssetIcon } from '@/lib/icon-mapper';
import { useState } from 'react';

interface AssetIconProps {
  symbol: string;
  size?: number;
  className?: string;
}

export default function AssetIcon({ symbol, size = 24, className }: AssetIconProps) {
  const [src, setSrc] = useState(getAssetIcon(symbol));
  
  // A generic, locally-hosted default icon
  const defaultIcon = '/icons/default-icon.svg';

  return (
    <Image
      src={src}
      alt={`${symbol} icon`}
      width={size}
      height={size}
      className={`rounded-full bg-[#1A1D2A] p-0.5 ${className || ''}`}
      unoptimized // Recommended for small, numerous external images if performance is an issue
      onError={() => {
        // Do not set src to defaultIcon directly if it's already the default, to prevent loops
        if (src !== defaultIcon) {
            setSrc(defaultIcon); 
        }
      }}
    />
  );
}
