import React, { useState, useRef, useEffect } from 'react';

export default function ChatHistorySidebar({ visible, chats, onSelect, onClose, profileName = 'User', onSettingsClick }) {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Close dropdown on outside click
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    }
    if (dropdownOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    } else {
      document.removeEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [dropdownOpen]);

  return (
    <div className={`chat-history-sidebar${visible ? ' visible' : ''}`}>
      <div className="sidebar-content-inner">
        <div className="sidebar-header">
          <span>Recents</span>
          <button className="sidebar-close-btn" onClick={onClose}>&times;</button>
        </div>
        <div className="sidebar-list">
          {chats.length === 0 ? (
            <div className="sidebar-empty">No previous chats</div>
          ) : (
            chats.map((chat, idx) => (
              <div
                key={chat.id}
                className="sidebar-chat-item"
                onClick={() => onSelect(chat.id)}
              >
                {chat.title || `Chat ${idx + 1}`}
              </div>
            ))
          )}
        </div>
        {/* If you have a separator, include it here */}
        {/* <div className="sidebar-separator" /> */}
      </div>
      {/* Profile/Settings Button at Bottom */}
      <div className="sidebar-profile-container">
        <button
          className="sidebar-profile-btn"
          onClick={() => setDropdownOpen((open) => !open)}
        >
          {/* Gear Icon */}
          <span className="sidebar-profile-icon">
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M10 13.333a3.333 3.333 0 1 0 0-6.666 3.333 3.333 0 0 0 0 6.666Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M17.158 11.05c.058-.36.092-.728.092-1.1 0-.372-.034-.74-.092-1.1l1.684-1.316a.417.417 0 0 0 .1-.53l-1.6-2.764a.417.417 0 0 0-.506-.192l-1.99.8a6.7 6.7 0 0 0-1.9-1.1l-.3-2.11A.417.417 0 0 0 11.417 2h-3.034a.417.417 0 0 0-.413.342l-.3 2.11a6.7 6.7 0 0 0-1.9 1.1l-1.99-.8a.417.417 0 0 0-.506.192l-1.6 2.764a.417.417 0 0 0 .1.53l1.684 1.316c-.058.36-.092.728-.092 1.1 0 .372.034.74.092 1.1l-1.684 1.316a.417.417 0 0 0-.1.53l1.6 2.764c.11.19.34.27.506.192l1.99-.8a6.7 6.7 0 0 0 1.9 1.1l.3 2.11c.05.23.25.342.413.342h3.034c.163 0 .363-.112.413-.342l.3-2.11a6.7 6.7 0 0 0 1.9-1.1l1.99.8c.166.078.396-.002.506-.192l1.6-2.764a.417.417 0 0 0-.1-.53l-1.684-1.316Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </span>
          <span className="sidebar-profile-name">{profileName}</span>
        </button>
        {/* Dropdown Menu */}
        <div
          ref={dropdownRef}
          className={`sidebar-profile-dropdown${dropdownOpen ? ' open' : ''}`}
        >
          <button
            className="sidebar-profile-dropdown-item"
            onClick={() => {
              setDropdownOpen(false);
              if (onSettingsClick) onSettingsClick();
            }}
          >
            Settings
          </button>
        </div>
      </div>
    </div>
  );
} 