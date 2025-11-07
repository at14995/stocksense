
// A mapping for symbols that have different names on the icon CDN
const SYMBOL_OVERRIDE: Record<string, string> = {
  // Example: 'UNIUSDT': 'uni'
};

/**
 * Returns the URL for a crypto icon from a CDN.
 * @param symbol The crypto symbol (e.g., 'BTCUSDT').
 * @returns The URL of the icon.
 */
function getCryptoIconUrl(symbol: string): string {
  const normalizedSymbol = (SYMBOL_OVERRIDE[symbol] || symbol)
    .replace('USDT', '')
    .toLowerCase();
  return `https://cdn.jsdelivr.net/gh/atomiclabs/cryptocurrency-icons@1a63530be6e374711a8554f31b17e4cb92c25668/svg/color/${normalizedSymbol}.svg`;
}

/**
 * Returns the URL for a stock icon from a CDN.
 * @param symbol The stock ticker (e.g., 'AAPL').
 * @returns The URL of the icon.
 */
function getStockIconUrl(symbol: string): string {
  return `https://companiesmarketcap.com/img/company-logos/64/${symbol}.png`;
}

/**
 * Determines the asset type and returns the appropriate icon URL.
 * @param symbol The stock or crypto symbol.
 * @returns A URL for the asset's icon.
 */
export function getAssetIcon(symbol: string): string {
  if (!symbol) return '/default-icon.svg'; // A generic fallback

  const upperSymbol = symbol.toUpperCase();

  // Simple heuristic: if it ends with USDT or contains '/', it's likely crypto.
  if (upperSymbol.endsWith('USDT') || upperSymbol.includes('/')) {
    return getCryptoIconUrl(upperSymbol);
  }

  // Otherwise, assume it's a stock. This can be refined.
  return getStockIconUrl(upperSymbol);
}
