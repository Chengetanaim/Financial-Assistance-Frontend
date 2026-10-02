import React, { useState, useEffect, useRef } from 'react';
import MarkdownRenderer from './components/MarkdownRenderer';
import { CornerDownLeft, ExternalLink, RotateCcw, Copy, Check, Cpu, Terminal } from 'lucide-react';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://127.0.0.1:8000';

const SUGGESTED_PROMPTS = [
  'What is Apple\'s (AAPL) current stock price & P/E ratio?',
  'Calculate ROI for $2,500 initial investment resulting in $4,100.',
  'Convert 750 USD to EUR at current rate.',
  'What is Tesla\'s (TSLA) current valuation and metrics?',
];

export default function App() {
  const [messages, setMessages] = useState([
    {
      id: 'welcome',
      sender: 'assistant',
      text: 'Hello. I am your **Financial Assistant** powered by LangChain and Google Gemini.\n\nAsk any question regarding **stock market prices**, **portfolio ROI calculations**, or **currency conversions**.',
      tools_used: [],
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    },
  ]);

  const [inputQuery, setInputQuery] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [copiedId, setCopiedId] = useState(null);

  const messagesEndRef = useRef(null);
  const textareaRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  const handleSend = async (queryText) => {
    const query = (queryText || inputQuery).trim();
    if (!query || isLoading) return;

    const userMessage = {
      id: Date.now().toString(),
      sender: 'user',
      text: query,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputQuery('');
    setIsLoading(true);

    try {
      const response = await fetch(`${API_BASE_URL}/api/v1/query`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ query }),
      });

      if (!response.ok) {
        throw new Error(`API returned status ${response.status}`);
      }

      const data = await response.json();

      const assistantMessage = {
        id: (Date.now() + 1).toString(),
        sender: 'assistant',
        text: data.answer || 'Received empty response from assistant.',
        tools_used: data.tools_used || [],
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };

      setMessages((prev) => [...prev, assistantMessage]);
    } catch (err) {
      const errorMessage = {
        id: (Date.now() + 1).toString(),
        sender: 'assistant',
        text: 'Unable to process your request at this time. Please check your connection and try again in a moment.',
        tools_used: [],
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleCopy = (id, text) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleReset = () => {
    setMessages([]);
  };

  return (
    <div className="app-container">
      {/* Navigation Bar */}
      <header className="navbar">
        <div className="nav-brand">
          <div className="brand-icon">
            <span>F</span>
          </div>
          <span className="brand-name">FinAgent</span>
          <span className="badge badge-secondary">v1.0</span>
        </div>

        <div className="nav-actions">
          <a
            href={`${API_BASE_URL}/docs`}
            target="_blank"
            rel="noopener noreferrer"
            className="btn btn-outline"
            title="FastAPI Swagger Documentation"
          >
            <span>API Docs</span>
            <ExternalLink size={12} />
          </a>

          {messages.length > 0 && (
            <button
              onClick={handleReset}
              className="btn btn-ghost"
              title="Reset conversation"
            >
              <RotateCcw size={14} />
            </button>
          )}
        </div>
      </header>

      {/* Hero Header */}
      <section className="hero-container">
        <h1 className="hero-title">Financial Assistant</h1>
        <p className="hero-description">
          Real-time stock market data, investment ROI analytics, and fiat currency conversions.
        </p>
      </section>

      {/* Prompt Badges */}
      <div className="prompts-container">
        {SUGGESTED_PROMPTS.map((prompt, idx) => (
          <button
            key={idx}
            className="prompt-pill"
            onClick={() => handleSend(prompt)}
            disabled={isLoading}
          >
            <span>{prompt}</span>
          </button>
        ))}
      </div>

      {/* shadcn Textarea Input Card */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleSend();
        }}
        className="input-card"
      >
        <textarea
          ref={textareaRef}
          className="query-input"
          value={inputQuery}
          onChange={(e) => setInputQuery(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Ask a question about stocks, ROI calculation, or currency..."
          rows={2}
          disabled={isLoading}
        />
        <div className="input-actions">
          <span className="hint-text">Enter to send, Shift+Enter for new line</span>
          <button
            type="submit"
            className="btn btn-primary"
            disabled={isLoading || !inputQuery.trim()}
          >
            <span>Send</span>
            <CornerDownLeft size={12} />
          </button>
        </div>
      </form>

      {/* Message Thread */}
      <div className="thread-list">
        {messages.map((msg) =>
          msg.sender === 'user' ? (
            <div key={msg.id} className="user-card">
              <span className="user-badge">User</span>
              <p className="user-text">{msg.text}</p>
            </div>
          ) : (
            <div key={msg.id} className="assistant-card">
              <div className="card-header-bar">
                <div className="card-header-meta">
                  <span className="card-header-title">Assistant</span>
                  <span className="model-badge">gemini-3.5-flash-lite</span>
                </div>
                <button
                  onClick={() => handleCopy(msg.id, msg.text)}
                  className="btn btn-ghost"
                  title="Copy answer"
                >
                  {copiedId === msg.id ? (
                    <Check size={13} style={{ color: '#34d399' }} />
                  ) : (
                    <Copy size={13} />
                  )}
                </button>
              </div>

              <div className="markdown-wrapper">
                <MarkdownRenderer content={msg.text} />
              </div>

              <div className="card-footer-bar">
                {msg.tools_used && msg.tools_used.length > 0 ? (
                  <div className="tool-badges-list">
                    {msg.tools_used.map((tool, idx) => (
                      <span key={idx} className="tool-badge-item active-tool">
                        <Cpu size={12} />
                        <span className="tool-badge-name">{tool.name}</span>
                        {tool.args && Object.keys(tool.args).length > 0 && (
                          <span className="tool-badge-args">
                            ({Object.entries(tool.args).map(([k, v]) => `${k}=${JSON.stringify(v)}`).join(', ')})
                          </span>
                        )}
                      </span>
                    ))}
                  </div>
                ) : (
                  <span className="tool-badge-item">
                    <Terminal size={12} />
                    <span className="tool-badge-name">Direct Reasoning</span>
                  </span>
                )}

                <span className="timestamp-text">{msg.timestamp}</span>
              </div>
            </div>
          )
        )}

        {isLoading && (
          <div className="loading-card">
            <div className="spinner-icon"></div>
            <span>Executing agent tools &amp; synthesizing response...</span>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Minimal Footer */}
      <footer className="page-footer">
        <p>FinAgent — LangChain &amp; Google Gemini Integration</p>
      </footer>
    </div>
  );
}
