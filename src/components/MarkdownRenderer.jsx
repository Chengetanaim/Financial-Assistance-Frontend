import React from 'react';

/**
 * Minimalist markdown formatter for shadcn UI aesthetic.
 */
export default function MarkdownRenderer({ content }) {
  if (!content) return null;

  const lines = content.split('\n');
  const elements = [];
  let inList = false;
  let listItems = [];

  const flushList = () => {
    if (listItems.length > 0) {
      elements.push(
        <ul key={`list-${elements.length}`} style={{ margin: '0.4rem 0 0.65rem 1.25rem' }}>
          {listItems.map((item, idx) => (
            <li key={idx} style={{ marginBottom: '0.25rem' }}>
              {parseInline(item)}
            </li>
          ))}
        </ul>
      );
      listItems = [];
      inList = false;
    }
  };

  lines.forEach((line, index) => {
    const trimmed = line.trim();

    if (trimmed.startsWith('### ')) {
      flushList();
      elements.push(
        <h4 key={index} style={{ fontSize: '0.9rem', fontWeight: '600', color: '#ffffff', margin: '0.65rem 0 0.25rem' }}>
          {parseInline(trimmed.substring(4))}
        </h4>
      );
    } else if (trimmed.startsWith('## ')) {
      flushList();
      elements.push(
        <h3 key={index} style={{ fontSize: '1rem', fontWeight: '600', color: '#ffffff', margin: '0.75rem 0 0.35rem' }}>
          {parseInline(trimmed.substring(3))}
        </h3>
      );
    } else if (trimmed.startsWith('# ')) {
      flushList();
      elements.push(
        <h2 key={index} style={{ fontSize: '1.125rem', fontWeight: '600', color: '#ffffff', margin: '0.85rem 0 0.45rem' }}>
          {parseInline(trimmed.substring(2))}
        </h2>
      );
    } else if (trimmed.startsWith('- ') || trimmed.startsWith('* ')) {
      inList = true;
      listItems.push(trimmed.substring(2));
    } else if (/^\d+\.\s/.test(trimmed)) {
      inList = true;
      listItems.push(trimmed.replace(/^\d+\.\s/, ''));
    } else if (trimmed.length > 0) {
      flushList();
      elements.push(
        <p key={index} style={{ marginBottom: '0.5rem' }}>
          {parseInline(trimmed)}
        </p>
      );
    } else {
      flushList();
    }
  });

  flushList();

  return <div className="markdown-wrapper">{elements}</div>;
}

function parseInline(text) {
  if (!text) return '';

  const parts = [];
  const regex = /(\*\*[^*]+\*\*|`[^`]+`)/g;
  let match;
  let lastIdx = 0;
  let keyIdx = 0;

  while ((match = regex.exec(text)) !== null) {
    const start = match.index;
    const token = match[0];

    if (start > lastIdx) {
      parts.push(text.substring(lastIdx, start));
    }

    if (token.startsWith('**') && token.endsWith('**')) {
      parts.push(
        <strong key={keyIdx++} style={{ color: '#ffffff', fontWeight: '600' }}>
          {token.slice(2, -2)}
        </strong>
      );
    } else if (token.startsWith('`') && token.endsWith('`')) {
      parts.push(
        <code key={keyIdx++}>
          {token.slice(1, -1)}
        </code>
      );
    }

    lastIdx = regex.lastIndex;
  }

  if (lastIdx < text.length) {
    parts.push(text.substring(lastIdx));
  }

  return parts.length > 0 ? parts : text;
}
