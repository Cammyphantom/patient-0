import React, { useState } from 'react';
import Header from './Header';
import SettingsPanel from './SettingsPanel';
import ChatContainer from './ChatContainer';
import InputArea from './InputArea';
import StatusBar from './StatusBar';
import ChatHistorySidebar from './ChatHistorySidebar';

const DEFAULT_SETTINGS = {
  llmProvider: 'openai',
  model: 'gpt-4',
  apiKey: '',
  temperature: 0.7,
  mcpServers: []
};

function App() {
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [input, setInput] = useState('');
  const [status, setStatus] = useState('Ready');
  const [typing, setTyping] = useState(false);
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [settings, setSettings] = useState(DEFAULT_SETTINGS);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [chatHistory, setChatHistory] = useState([]); // [{id, title, messages}]
  const [currentChatId, setCurrentChatId] = useState(null);
  const [hasSentMessage, setHasSentMessage] = useState(false);

  async function getAIResponse(message) {
    const { llmProvider, model, apiKey, temperature } = settings;
    if (!apiKey && llmProvider !== 'ollama') {
      throw new Error('API key is required');
    }
    const requestBody = {
      model: model,
      messages: [
        ...messages.slice(-10),
        { role: 'user', content: message }
      ],
      temperature: temperature
    };
    let apiUrl, headers;
    switch (llmProvider) {
      case 'openai':
        apiUrl = 'https://api.openai.com/v1/chat/completions';
        headers = {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${apiKey}`
        };
        break;
      case 'anthropic':
        apiUrl = 'https://api.anthropic.com/v1/messages';
        headers = {
          'Content-Type': 'application/json',
          'x-api-key': apiKey,
          'anthropic-version': '2023-06-01'
        };
        requestBody.messages = requestBody.messages.map(msg => ({
          role: msg.role === 'assistant' ? 'assistant' : 'user',
          content: msg.content
        }));
        requestBody.max_tokens = 1000;
        break;
      case 'openrouter':
        apiUrl = 'https://openrouter.ai/api/v1/chat/completions';
        headers = {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${apiKey}`,
          'HTTP-Referer': window.location.origin,
          'X-Title': 'AI Chat Sidebar'
        };
        break;
      case 'ollama':
        apiUrl = 'http://localhost:11434/api/chat';
        headers = {
          'Content-Type': 'application/json'
        };
        requestBody.stream = false;
        break;
      case 'custom':
        apiUrl = window.prompt('Enter custom API endpoint:');
        if (!apiUrl) throw new Error('Custom API endpoint required');
        headers = {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${apiKey}`
        };
        break;
      default:
        throw new Error('Unsupported LLM provider');
    }
    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: headers,
      body: JSON.stringify(requestBody)
    });
    if (!response.ok) {
      throw new Error(`API request failed: ${response.status} ${response.statusText}`);
    }
    const data = await response.json();
    switch (llmProvider) {
      case 'openai':
        return data.choices[0]?.message?.content || 'No response received';
      case 'anthropic':
        return data.content[0]?.text || 'No response received';
      case 'openrouter':
        return data.choices[0]?.message?.content || 'No response received';
      case 'ollama':
        return data.message?.content || 'No response received';
      case 'custom':
        return data.choices?.[0]?.message?.content || data.response || 'No response received';
      default:
        return 'Unsupported response format';
    }
  }

  const handleSend = async () => {
    const message = input.trim();
    if (!message || loading) return;
    if (!hasSentMessage) setHasSentMessage(true);
    const userMsg = {
      role: 'user',
      content: message,
      timestamp: new Date().toISOString(),
    };
    setMessages((msgs) => [...msgs, userMsg]);
    setInput('');
    setLoading(true);
    setStatus('AI is typing...');
    setTyping(true);
    try {
      const aiContent = await getAIResponse(message);
      const aiMsg = {
        role: 'assistant',
        content: aiContent,
        timestamp: new Date().toISOString(),
      };
      setMessages((msgs) => [...msgs, aiMsg]);
    } catch (error) {
      setMessages((msgs) => [...msgs, {
        role: 'assistant',
        content: 'Sorry, I encountered an error. Please check your settings and try again.',
        timestamp: new Date().toISOString(),
      }]);
      setStatus('Error');
    } finally {
      setLoading(false);
      setStatus('Ready');
      setTyping(false);
    }
  };

  const handleClear = () => {
    if (window.confirm('Are you sure you want to clear the chat history?')) {
      setMessages([]);
      setHasSentMessage(false);
    }
  };

  const handleExport = () => {
    if (messages.length === 0) {
      window.alert('No messages to export');
      return;
    }
    const chatData = {
      exported: new Date().toISOString(),
      settings,
      messages,
    };
    const blob = new Blob([JSON.stringify(chatData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `chat-export-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  // Save chat to history when a new chat starts
  React.useEffect(() => {
    if (messages.length > 0 && !currentChatId) {
      // New chat, add to history
      const newId = Date.now();
      setChatHistory((h) => [
        { id: newId, title: messages[0]?.content?.slice(0, 20) || 'New Chat', messages },
        ...h,
      ]);
      setCurrentChatId(newId);
    } else if (currentChatId) {
      // Update existing chat
      setChatHistory((h) => h.map(chat =>
        chat.id === currentChatId ? { ...chat, messages } : chat
      ));
    }
    // eslint-disable-next-line
  }, [messages]);

  const handleSelectChat = (id) => {
    const chat = chatHistory.find(c => c.id === id);
    if (chat) {
      setMessages(chat.messages);
      setCurrentChatId(id);
      setSidebarOpen(false);
    }
  };

  return (
    <div id="app">
      {/* Sidebar toggle button at top left corner */}
      <button className="sidebar-toggle-btn" onClick={() => setSidebarOpen(v => !v)} style={{position: 'absolute', left: 11, top: 8, width: 32, height: 32, zIndex: 1100, padding: 0}} title="Show chat history">
        <svg className="header-icon" viewBox="0 0 512 512" width="20" height="20" fill="none" stroke="var(--primary-color)" strokeWidth="32">
          <rect x="64" y="64" width="384" height="384" rx="96" fill="none" stroke="var(--primary-color)" strokeWidth="32"/>
          <line x1="160" y1="64" x2="160" y2="448" stroke="var(--primary-color)" strokeWidth="32"/>
          <polyline points="304 336 208 256 304 176" fill="none" stroke="var(--primary-color)" strokeWidth="32" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      </button>
      <div className="app-flex-container">
        <ChatHistorySidebar
          visible={sidebarOpen}
          chats={chatHistory}
          onSelect={handleSelectChat}
          onClose={() => setSidebarOpen(false)}
          profileName={settings.profileName || 'User'}
          onSettingsClick={() => setSettingsOpen(true)}
        />
        <div className="main-content">
          <SettingsPanel
            visible={settingsOpen}
            onClose={() => setSettingsOpen(false)}
            settings={settings}
            onChange={setSettings}
            onSave={() => setSettingsOpen(false)}
          />
          <ChatContainer messages={messages} />
          <InputArea
            value={input}
            onChange={e => setInput(e.target.value)}
            onSend={handleSend}
            disabled={!input.trim() || loading}
            onClear={handleClear}
            onExport={handleExport}
            hasSentMessage={hasSentMessage}
          />
          {/* StatusBar removed */}
        </div>
      </div>
    </div>
  );
}

export default App; 