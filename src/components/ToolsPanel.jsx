import React, { useState } from 'react';
import { BarChart3, Calculator, ArrowRightLeft, Sparkles, Send } from 'lucide-react';

export default function ToolsPanel({ onExecuteQuery }) {
  // Stock Quick Lookup State
  const [stockTicker, setStockTicker] = useState('AAPL');

  // ROI Calculator State
  const [initialInv, setInitialInv] = useState('1000');
  const [finalVal, setFinalVal] = useState('1450');

  // Currency Converter State
  const [currAmount, setCurrAmount] = useState('500');
  const [fromCurr, setFromCurr] = useState('USD');
  const [toCurr, setToCurr] = useState('EUR');

  // Computed Instant ROI Preview
  const initialNum = parseFloat(initialInv) || 0;
  const finalNum = parseFloat(finalVal) || 0;
  const profitLoss = finalNum - initialNum;
  const roiPct = initialNum > 0 ? ((profitLoss / initialNum) * 100).toFixed(2) : 0;
  const isProfitable = profitLoss >= 0;

  const handleStockLookup = (e) => {
    e.preventDefault();
    if (!stockTicker.trim()) return;
    onExecuteQuery(`What is the current stock price, company name, and P/E ratio for ${stockTicker.trim().toUpperCase()}?`);
  };

  const handleRoiQuery = (e) => {
    e.preventDefault();
    onExecuteQuery(`Calculate the Return on Investment (ROI) for an initial investment of $${initialInv} and a final value of $${finalVal}. Explain the return metrics.`);
  };

  const handleCurrencyQuery = (e) => {
    e.preventDefault();
    onExecuteQuery(`Convert ${currAmount} ${fromCurr.toUpperCase()} to ${toCurr.toUpperCase()} at the current live exchange rate.`);
  };

  return (
    <aside className="tools-panel">
      {/* Tool 1: Live Stock Lookup */}
      <div className="tool-card">
        <div className="tool-card-header">
          <div className="tool-card-title">
            <BarChart3 size={17} style={{ color: '#10b981' }} />
            <span>Stock Intelligence</span>
          </div>
          <span className="tool-badge">yfinance</span>
        </div>

        <form onSubmit={handleStockLookup} className="tool-form">
          <div className="form-group">
            <label className="form-label">Ticker Symbol</label>
            <input
              type="text"
              className="form-input"
              value={stockTicker}
              onChange={(e) => setStockTicker(e.target.value.toUpperCase())}
              placeholder="e.g. AAPL, TSLA, NVDA"
              maxLength={10}
            />
          </div>
          <button type="submit" className="tool-action-btn">
            <Sparkles size={14} />
            <span>Analyze Ticker</span>
          </button>
        </form>
      </div>

      {/* Tool 2: ROI Calculator */}
      <div className="tool-card">
        <div className="tool-card-header">
          <div className="tool-card-title">
            <Calculator size={17} style={{ color: '#6366f1' }} />
            <span>ROI Calculator</span>
          </div>
          <span className="tool-badge">Live Math</span>
        </div>

        <form onSubmit={handleRoiQuery} className="tool-form">
          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Initial ($)</label>
              <input
                type="number"
                className="form-input"
                value={initialInv}
                onChange={(e) => setInitialInv(e.target.value)}
                placeholder="1000"
              />
            </div>
            <div className="form-group">
              <label className="form-label">Final ($)</label>
              <input
                type="number"
                className="form-input"
                value={finalVal}
                onChange={(e) => setFinalVal(e.target.value)}
                placeholder="1450"
              />
            </div>
          </div>

          <div className="result-box">
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.78rem' }}>
              <span>Est. Net {isProfitable ? 'Profit' : 'Loss'}:</span>
              <strong style={{ color: isProfitable ? '#34d399' : '#fb7185' }}>
                {isProfitable ? '+' : '-'}${Math.abs(profitLoss).toLocaleString()}
              </strong>
            </div>
            <div className="result-highlight" style={{ color: isProfitable ? '#10b981' : '#f43f5e' }}>
              {isProfitable ? '+' : ''}{roiPct}% ROI
            </div>
          </div>

          <button type="submit" className="tool-action-btn">
            <Send size={13} />
            <span>Send to Agent</span>
          </button>
        </form>
      </div>

      {/* Tool 3: Currency Converter */}
      <div className="tool-card">
        <div className="tool-card-header">
          <div className="tool-card-title">
            <ArrowRightLeft size={17} style={{ color: '#06b6d4' }} />
            <span>FX Converter</span>
          </div>
          <span className="tool-badge">Exchange API</span>
        </div>

        <form onSubmit={handleCurrencyQuery} className="tool-form">
          <div className="form-group">
            <label className="form-label">Amount</label>
            <input
              type="number"
              className="form-input"
              value={currAmount}
              onChange={(e) => setCurrAmount(e.target.value)}
              placeholder="500"
            />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label className="form-label">From</label>
              <input
                type="text"
                className="form-input"
                value={fromCurr}
                onChange={(e) => setFromCurr(e.target.value.toUpperCase())}
                maxLength={4}
              />
            </div>
            <div className="form-group">
              <label className="form-label">To</label>
              <input
                type="text"
                className="form-input"
                value={toCurr}
                onChange={(e) => setToCurr(e.target.value.toUpperCase())}
                maxLength={4}
              />
            </div>
          </div>

          <button type="submit" className="tool-action-btn">
            <Sparkles size={14} />
            <span>Convert Live FX</span>
          </button>
        </form>
      </div>
    </aside>
  );
}
