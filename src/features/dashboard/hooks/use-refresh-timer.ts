'use client';

import { useEffect, useState } from 'react';

export function useRefreshTimer(intervalMs = 30000) {
  const [remaining, setRemaining] = useState(intervalMs);

  useEffect(() => {
    // Reset timer immediately when intervalMs changes
    setRemaining(intervalMs);

    const tick = setInterval(() => {
      setRemaining((r) => (r <= 1000 ? intervalMs : r - 1000));
    }, 1000);
    
    return () => clearInterval(tick);
  }, [intervalMs]);

  return remaining;
}
