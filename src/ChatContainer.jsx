import React from 'react';

function formatMessageContent(content) {
  // Basic markdown-like formatting
  return content
    .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
    .replace(/\*(.*?)\*/g, '<em>$1</em>')
    .replace(/`(.*?)`/g, '<code style="background: var(--bg-tertiary); padding: 0.125rem 0.25rem; border-radius: 0.25rem; font-family: monospace;">$1</code>')
    .replace(/\n/g, '<br>');
}

function Message({ message }) {
  const time = new Date(message.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  const icon = message.role === 'user'
    ? (<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>)
    : (<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>);
  return (
    <div className={`message ${message.role}`}>
      <div className="message-avatar">{icon}</div>
      <div className="message-content" dangerouslySetInnerHTML={{ __html: formatMessageContent(message.content) }} />
      <div className="message-time">{time}</div>
    </div>
  );
}

export default function ChatContainer({ messages }) {
  return (
    <div className="chat-container">
      <div className="message-list">
        {messages.length === 0 ? (
          <div className="welcome-message">
            <svg className="welcome-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
            </svg>
            <h3>Welcome to AI Chat</h3>
            <p>Select your preferred LLM provider and start chatting!</p>
          </div>
        ) : (
          messages.map((msg, i) => <Message key={i} message={msg} />)
        )}
      </div>
    </div>
  );
} 