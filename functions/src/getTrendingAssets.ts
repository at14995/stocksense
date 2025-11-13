
import { onRequest } from 'firebase-functions/v2/https';
import * as logger from 'firebase-functions/logger';
import axios from 'axios';

const BINANCE_EXCHANGE_INFO_URL = "https://api.binance.com/api/v3/exchangeInfo";

const staticStocks = [
    { symbol: 'AAPL', name: 'Apple Inc.' },
    { symbol: 'MSFT', name: 'Microsoft Corporation' },
    { symbol: 'GOOGL', name: 'Alphabet Inc.' },
    { symbol: 'AMZN', name: 'Amazon.com, Inc.' },
    { symbol: 'NVDA', name: 'NVIDIA Corporation' },
    { symbol: 'TSLA', name: 'Tesla, Inc.' },
    { symbol: 'META', name: 'Meta Platforms, Inc.' },
];

/**
 * A public Cloud Function that proxies a request to the Binance API
 * to get all tradable assets, avoiding client-side CORS issues.
 */
export const getTrendingAssets = onRequest(
  { cors: true }, // Automatically handle CORS headers, allowing all origins
  async (request, response) => {
    logger.info('getTrendingAssets function triggered to fetch all assets');

    try {
      // Fetch the full list of exchange information from Binance
      const binanceResponse = await axios.get(BINANCE_EXCHANGE_INFO_URL);

      if (binanceResponse.status !== 200) {
        logger.error('Binance API call failed with status:', binanceResponse.status);
        response.status(500).send('Error fetching data from Binance API');
        return;
      }
      
      const cryptoAssets = binanceResponse.data.symbols
        .filter((s: any) => s.status === 'TRADING' && s.quoteAsset === 'USDT')
        .map((s: any) => ({ symbol: s.symbol, name: `${s.baseAsset}/${s.quoteAsset}` }));

      const allAssets = [...staticStocks, ...cryptoAssets];

      // Send the formatted data back to the client
      response.status(200).json(allAssets);
    } catch (error) {
      logger.error('Error in getTrendingAssets function:', error);
      response.status(500).send('Internal Server Error');
    }
  }
);
