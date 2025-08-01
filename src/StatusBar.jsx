import React from 'react';

export default function StatusBar({ status, typing }) {
  return (
    <div className="status-bar">
      <span>{status}</span>
      <div className={`typing-indicator${typing ? '' : ' hidden'}`}>
        <div className="typing-dot"></div>
        <div className="typing-dot"></div>
        <div className="typing-dot"></div>
      </div>
    </div>
  );
} 