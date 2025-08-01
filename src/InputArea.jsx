import React from 'react';

export default function InputArea({ value, onChange, onSend, disabled, onClear, onExport, hasSentMessage }) {
  return (
    <div className={`input-area${hasSentMessage ? ' input-area-active' : ''}`}>
      <textarea
        className="message-input-full"
        placeholder="Type your message..."
        value={value}
        onChange={onChange}
        style={{width: '100%', height: '100%', resize: 'none', boxSizing: 'border-box', paddingRight: '8rem'}}
      />
      <div className="input-actions-inline">
        <div className="left-actions">
          <button className="action-btn" title="Clear chat" onClick={onClear}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <polyline points="3,6 5,6 21,6"/>
              <path d="m19,6v14a2,2 0 0,1-2,2H7a2,2 0 0,1-2-2V6m3,0V4a2,2 0 0,1 2-2h4a2,2 0 0,1 2,2v2"/>
            </svg>
          </button>
          <button className="action-btn" title="Export chat" onClick={onExport}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
              <polyline points="7,10 12,15 17,10"/>
              <line x1="12" y1="15" x2="12" y2="3"/>
            </svg>
          </button>
        </div>
        <button className="send-btn send-btn-abs" onClick={onSend} disabled={disabled}>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <line x1="22" y1="2" x2="11" y2="13"/>
            <polygon points="22,2 15,22 11,13 2,9"/>
          </svg>
        </button>
      </div>
    </div>
  );
} 