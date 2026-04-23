
/**
 * Market Fetcher Utility
 * Fetches real-time stock data for Indian and Global markets.
 */

export interface StockItem {
  symbol: string;
  name: string;
  price: string;
  change: string;
  percentChange: string;
  up: boolean;
  timestamp: string;
}

export const MOCK_STOCKS: StockItem[] = [
  { symbol: "NSEI", name: "নিফটি ৫০ (NIFTY 50)", price: "২২,৪৫৩.২০", change: "১৫৬.৪০", percentChange: "০.৭০", up: true, timestamp: new Date().toISOString() },
  { symbol: "BSESN", name: "সেনসেক্স (SENSEX)", price: "৭৩,৭৩৮.৪৫", change: "৫৯৮.৩০", percentChange: "০.৮২", up: true, timestamp: new Date().toISOString() },
  { symbol: "RELIANCE", name: "রিলায়েন্স", price: "২,৯৪০.৫০", change: "৪৫.২০", percentChange: "১.৫৬", up: true, timestamp: new Date().toISOString() },
  { symbol: "TCS", name: "টিসিএস", price: "৩,৮৯০.১৫", change: "১২.৩০", percentChange: "০.৩১", up: false, timestamp: new Date().toISOString() },
  { symbol: "HDFCBANK", name: "এইচডিএফসি ব্যাংক", price: "১,৫৩০.৮০", change: "৮.৯০", percentChange: "০.৫৮", up: true, timestamp: new Date().toISOString() },
  { symbol: "INFY", name: "ইনফোসিস", price: "১,৪২০.৬৫", change: "১৫.৪০", percentChange: "১.০৭", up: false, timestamp: new Date().toISOString() }
];

const STOCK_SYMBOLS = [
  { symbol: "^NSEI", name: "নিফটি ৫০ (NIFTY 50)" },
  { symbol: "^BSESN", name: "সেনসেক্স (SENSEX)" },
  { symbol: "RELIANCE.NS", name: "রিলায়েন্স" },
  { symbol: "TCS.NS", name: "টিসিএস" },
  { symbol: "HDFCBANK.NS", name: "এইচডিএফসি ব্যাংক" },
  { symbol: "INFY.NS", name: "ইনফোসিস" }
];

export async function fetchStockData(): Promise<StockItem[]> {
  try {
    const results: StockItem[] = [];
    
    // We fetch one by one to avoid overwhelming proxies and ensure some data returns
    for (const item of STOCK_SYMBOLS) {
      try {
        const url = `https://query1.finance.yahoo.com/v8/finance/chart/${item.symbol}?interval=1d&range=1d`;
        // Use a single, most reliable proxy first
        const response = await fetch(`https://api.allorigins.win/get?url=${encodeURIComponent(url)}`);
        
        if (response.ok) {
          const json = await response.json();
          const data = JSON.parse(json.contents);
          const meta = data.chart.result[0].meta;
          
          const price = meta.regularMarketPrice;
          const prevClose = meta.chartPreviousClose;
          const change = price - prevClose;
          const percentChange = (change / prevClose) * 100;
          
          results.push({
            symbol: item.symbol,
            name: item.name,
            price: price.toLocaleString('en-IN', { maximumFractionDigits: 2 }),
            change: Math.abs(change).toLocaleString('en-IN', { maximumFractionDigits: 2 }),
            percentChange: Math.abs(percentChange).toFixed(2),
            up: change >= 0,
            timestamp: new Date().toISOString()
          });
        }
      } catch (e) {
        console.warn(`Failed to fetch ${item.symbol}`);
      }
    }

    if (results.length > 0) return results;
  } catch (err) {
    console.error("Global Stock Fetch Error", err);
  }

  return MOCK_STOCKS;
}
