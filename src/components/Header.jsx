import React from 'react';
import { Sparkles, Trash2, ExternalLink, Activity, Terminal } from 'lucide-react';

export default function Header({ isOnline, apiUrl = 'http://127.0.0.1:8000', onClearChat, messageCount }) {
  return (
    <header className="header-wrapper">
      <div className="brand-section">
        <div className="brand-logo-badge">
          <Terminal size={22} />
        </div>
        <div>
          <h1 className="brand-title">
            FinAgent <span style={{ color: '#10b981' }}>AI</span>
            <span className="brand-pill">Gemini 3.5 Agent</span>
          </h1>
        </div>
      </div>

      <div className="header-actions">
        <div className={`status-badge ${isOnline ? 'online' : 'offline'}`} title={`Backend status at ${apiUrl}`}>
          <span className="pulse-dot"></span>
          <span>{isOnline ? 'API Connected' : 'API Offline'}</span>
        </div>

        <a
          href={`${apiUrl}/docs`}
          target="_blank"
          rel="noopener noreferrer"
          className="icon-btn"
          title="Open FastAPI Swagger Docs"
        >
          <ExternalLink size={17} />
        </a>

        {messageCount > 0 && (
          <button
            onClick={onClearChat}
            className="icon-btn"
            title="Clear Chat History"
          >
            <Trash2 size={17} />
          </button>
        )}
      </div>
    </header>
  );
}
