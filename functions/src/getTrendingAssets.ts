import { onRequest } from 'firebase-functions/v2/https';
import * as logger from 'firebase-functions/logger';
import axios from 'axios';

const BINANCE_PRICE_URL = 'https://api.binance.com/api/v3/ticker/price';

// Helper function to normalize crypto symbols (e.g., BTCUSDT -> BTC)
const normalizeSymbol = (symbol: string): string => {
  if (symbol.endsWith('USDT')) {
    return symbol.slice(0, -4);
  }
  return symbol;
};

/**
 * A public Cloud Function that proxies a request to the Binance API
 * to get trending assets, avoiding client-side CORS issues.
 */
export const getTrendingAssets = onRequest(
  { cors: true }, // Automatically handle CORS headers, allowing all origins
  async (request, response) => {
    logger.info('getTrendingAssets function triggered');

    try {
      // Fetch the full list of asset prices from Binance
      const binanceResponse = await axios.get(BINANCE_PRICE_URL);

      if (binanceResponse.status !== 200) {
        logger.error('Binance API call failed with status:', binanceResponse.status);
        response.status(500).send('Error fetching data from Binance API');
        return;
      }

      // Take the first 50 assets and format them
      const trendingAssets = binanceResponse.data
        .slice(0, 50)
        .map((asset: { symbol: string; price: string }) => ({
          symbol: asset.symbol,
          name: `${normalizeSymbol(asset.symbol)}/USDT`, // Create a readable name
        }));

      // Send the formatted data back to the client
      response.status(200).json(trendingAssets);
    } catch (error) {
      logger.error('Error in getTrendingAssets function:', error);
      response.status(500).send('Internal Server Error');
    }
  }
);
