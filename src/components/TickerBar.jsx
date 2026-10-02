import React from 'react';
import { TrendingUp, TrendingDown } from 'lucide-react';

const DEFAULT_TICKERS = [
  { symbol: 'AAPL', name: 'Apple', price: '232.15', change: '+1.42%', up: true },
  { symbol: 'NVDA', name: 'Nvidia', price: '124.60', change: '+3.85%', up: true },
  { symbol: 'TSLA', name: 'Tesla', price: '218.40', change: '-0.92%', up: false },
  { symbol: 'MSFT', name: 'Microsoft', price: '428.90', change: '+0.65%', up: true },
  { symbol: 'BTC/USD', name: 'Bitcoin', price: '64,250', change: '+2.10%', up: true },
  { symbol: 'EUR/USD', name: 'Euro', price: '1.0845', change: '-0.15%', up: false },
  { symbol: 'AMZN', name: 'Amazon', price: '186.30', change: '+1.18%', up: true },
  { symbol: 'GOOGL', name: 'Alphabet', price: '168.20', change: '-0.40%', up: false },
];

export default function TickerBar({ onSelectTicker }) {
  // Duplicate for seamless infinite scroll
  const displayItems = [...DEFAULT_TICKERS, ...DEFAULT_TICKERS];

  return (
    <div className="ticker-container">
      <div className="ticker-track">
        {displayItems.map((item, index) => (
          <div
            key={`${item.symbol}-${index}`}
            className="ticker-item"
            onClick={() => onSelectTicker && onSelectTicker(item.symbol)}
            title={`Ask agent about ${item.symbol}`}
          >
            <span className="ticker-symbol">{item.symbol}</span>
            <span className="ticker-price">${item.price}</span>
            <span className={`ticker-change ${item.up ? 'up' : 'down'}`}>
              {item.up ? <TrendingUp size={13} /> : <TrendingDown size={13} />}
              {item.change}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
