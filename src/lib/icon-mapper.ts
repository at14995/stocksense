
// A mapping for symbols that have different names on the icon CDN
const SYMBOL_OVERRIDE: Record<string, string> = {
  USDT: 'tether',
  BUSD: 'binance-usd',
  DAI: 'dai',
  WBTC: 'wrapped-bitcoin',
  // add only if a symbol doesn’t match the CDN ID
};


/**
 * Returns the URL for a crypto icon from a CDN.
 * @param symbol The crypto symbol (e.g., 'BTCUSDT').
 * @returns The URL of the icon.
 */
export function getCryptoIconUrl(symbol: string): string {
  if (!symbol) return '/icons/default-icon.svg';

  // Normalize symbol: remove /USDT, USDT, slashes, lowercase
  let normalized = symbol
    .replace('/USDT', '')
    .replace('USDT', '')
    .replace('/', '')
    .toLowerCase();

  // Apply overrides for special cases
  normalized = SYMBOL_OVERRIDE[normalized] || normalized;
  
  // Latest unpinned CDN URL (avoids missing icons from old commits)
  return `https://cdn.jsdelivr.net/gh/atomiclabs/cryptocurrency-icons/svg/color/${normalized}.svg`;
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
// List of known crypto symbols
const KNOWN_CRYPTO = [
  'BTC','ETH','BNB','ADA','SOL','DOGE','XRP',
  'USDT','USDC','LINK','DOT','AVAX',
  'LTC','UNI','MATIC','BCH','XLM',
  'TRX','NEO','ETC','ZEC','FIL',
  'XTZ','ATOM','ALGO','VET','HBAR',
  'ICP','SUI','MANA','AXS','KSM',
  'WBTC','WBETH','TON','PEPE','MKR',
  'SHIB','GRT','APE','CRV','AAVE',
  'FTM','NEAR','GALA','CHZ','ENJ',
  'EOS','DASH','ZIL','OMG','BAT',
  'CAKE','COMP','SNX','RVN','QTUM',
  'GRT','LSK','ICX','ONT','ZRX',
  'KAVA','CELR','HNT','IOTA','DGB',
  'KNC','ONE','ANKR','HEDERA','RVN',
  'SC','NANO','QTUM','AR','MINA',
  'FTT','RUNE','STX','AXS','SAND',
  'FLOW','ALCHEMY','MATIC','CRO','XDC'
];


export function getAssetIcon(symbol: string): string {
  if (!symbol) return '/icons/default-icon.svg';

  const upperSymbol = symbol.toUpperCase();

  // Treat as crypto if symbol ends with USDT, contains '/', or is in KNOWN_CRYPTO
  if (upperSymbol.endsWith('USDT') || upperSymbol.includes('/') || KNOWN_CRYPTO.includes(upperSymbol)) {
    return getCryptoIconUrl(upperSymbol);
  }

  // Otherwise assume stock
  return getStockIconUrl(upperSymbol);
}

