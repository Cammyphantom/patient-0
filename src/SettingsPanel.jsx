import React, { useState } from 'react';

const PROVIDERS = [
  { value: 'openai', label: 'OpenAI' },
  { value: 'anthropic', label: 'Anthropic' },
  { value: 'openrouter', label: 'OpenRouter' },
  { value: 'ollama', label: 'Ollama (Local)' },
  { value: 'custom', label: 'Custom API' },
];

const MODELS = {
  openai: [
    { value: 'gpt-4', label: 'GPT-4' },
    { value: 'gpt-4-turbo', label: 'GPT-4 Turbo' },
    { value: 'gpt-3.5-turbo', label: 'GPT-3.5 Turbo' },
  ],
  anthropic: [
    { value: 'claude-3-opus-20240229', label: 'Claude 3 Opus' },
    { value: 'claude-3-sonnet-20240229', label: 'Claude 3 Sonnet' },
    { value: 'claude-3-haiku-20240307', label: 'Claude 3 Haiku' },
  ],
  openrouter: [
    { value: 'openai/gpt-4o', label: 'GPT-4o' },
    { value: 'openai/gpt-4o-mini', label: 'GPT-4o Mini' },
    { value: 'openai/gpt-4-turbo', label: 'GPT-4 Turbo' },
    { value: 'anthropic/claude-3.5-sonnet', label: 'Claude 3.5 Sonnet' },
    { value: 'anthropic/claude-3-opus', label: 'Claude 3 Opus' },
    { value: 'anthropic/claude-3-haiku', label: 'Claude 3 Haiku' },
    { value: 'google/gemini-pro-1.5', label: 'Gemini Pro 1.5' },
    { value: 'google/gemini-flash-1.5', label: 'Gemini Flash 1.5' },
    { value: 'meta-llama/llama-3.1-405b-instruct', label: 'Llama 3.1 405B' },
    { value: 'meta-llama/llama-3.1-70b-instruct', label: 'Llama 3.1 70B' },
    { value: 'meta-llama/llama-3.1-8b-instruct', label: 'Llama 3.1 8B' },
    { value: 'mistralai/mistral-large', label: 'Mistral Large' },
    { value: 'mistralai/mistral-medium', label: 'Mistral Medium' },
    { value: 'mistralai/mistral-small', label: 'Mistral Small' },
    { value: 'cohere/command-r-plus', label: 'Command R+' },
    { value: 'cohere/command-r', label: 'Command R' },
    { value: 'perplexity/llama-3.1-sonar-large-128k-online', label: 'Sonar Large Online' },
    { value: 'perplexity/llama-3.1-sonar-small-128k-online', label: 'Sonar Small Online' },
    { value: 'qwen/qwen-2.5-72b-instruct', label: 'Qwen 2.5 72B' },
    { value: 'deepseek/deepseek-chat', label: 'DeepSeek Chat' },
    { value: 'nvidia/llama-3.1-nemotron-70b-instruct', label: 'Nemotron 70B' },
    { value: 'liquid/lfm-40b', label: 'Liquid LFM 40B' },
    { value: 'openrouter/auto', label: 'Auto (Best Available)' },
  ],
  ollama: [
    { value: 'llama2', label: 'Llama 2' },
    { value: 'codellama', label: 'Code Llama' },
    { value: 'mistral', label: 'Mistral' },
    { value: 'neural-chat', label: 'Neural Chat' },
  ],
  custom: [
    { value: 'custom-model', label: 'Custom Model' },
  ],
};

export default function SettingsPanel({ visible, onClose, settings, onChange, onSave }) {
  const [localSettings, setLocalSettings] = useState(settings);
  const [saved, setSaved] = useState(false);
  const [section, setSection] = useState('model');

  React.useEffect(() => {
    setLocalSettings(settings);
    setSection('model');
  }, [settings, visible]);

  const handleProviderChange = (e) => {
    const llmProvider = e.target.value;
    setLocalSettings((s) => ({
      ...s,
      llmProvider,
      model: MODELS[llmProvider][0].value,
    }));
  };

  const handleModelChange = (e) => {
    setLocalSettings((s) => ({ ...s, model: e.target.value }));
  };

  const handleInputChange = (e) => {
    setLocalSettings((s) => ({ ...s, apiKey: e.target.value }));
  };

  const handleTempChange = (e) => {
    setLocalSettings((s) => ({ ...s, temperature: parseFloat(e.target.value) }));
  };

  const handleSave = () => {
    onChange(localSettings);
    setSaved(true);
    setTimeout(() => setSaved(false), 1500);
    if (onSave) onSave();
  };

  // MCP server management (simplified)
  const handleAddMcp = () => {
    const name = window.prompt('MCP Server Name:');
    if (!name) return;
    const url = window.prompt('MCP Server URL:');
    if (!url) return;
    setLocalSettings((s) => ({
      ...s,
      mcpServers: [...(s.mcpServers || []), { id: Date.now(), name, url, enabled: true }],
    }));
  };
  const handleRemoveMcp = (id) => {
    setLocalSettings((s) => ({
      ...s,
      mcpServers: (s.mcpServers || []).filter((srv) => srv.id !== id),
    }));
  };

  return (
    <div className={`settings-panel${visible ? ' visible' : ' hidden'}`}>
      {/* Modal Header */}
      <div className="settings-modal-header" style={{position: 'relative', padding: '1.25rem 2.5rem 1.25rem 2.5rem', textAlign: 'center', borderTopLeftRadius: '1.25rem', borderTopRightRadius: '1.25rem', background: 'var(--bg-secondary)', fontWeight: 600, fontSize: '1.25rem', letterSpacing: '0.01em'}}>
        <span>Settings</span>
        <button className="settings-close-btn" onClick={onClose} title="Close" style={{position: 'absolute', top: '50%', right: 24, transform: 'translateY(-50%)', background: 'none', border: 'none', color: 'var(--text-muted)', fontSize: '1.5rem', cursor: 'pointer', zIndex: 2}}>
          &times;
        </button>
      </div>
      <div className="settings-header-separator" style={{height: 1, background: 'var(--border-color)', opacity: 0.2, width: '100%'}} />
      <div className="settings-content" style={{display: 'flex', flexDirection: 'row', minHeight: 340}}>
        {/* Sidebar */}
        <div className="settings-sidebar" style={{width: 140, marginRight: 0, display: 'flex', flexDirection: 'column', gap: 8}}>
          <button className={`settings-section-btn${section === 'model' ? ' active' : ''}`} onClick={() => setSection('model')}>Model</button>
          <button className={`settings-section-btn${section === 'mcp' ? ' active' : ''}`} onClick={() => setSection('mcp')}>MCP Settings</button>
        </div>
        <div className="settings-sidebar-separator" style={{width: 1, background: 'var(--border-color)', opacity: 0.2, margin: '0 1.5rem', borderRadius: 2}} />
        {/* Main Content */}
        <div style={{flex: 1, minWidth: 0}}>
        {section === 'model' && <>
          {/* LLM Provider Selection */}
          <div className="setting-group">
            <label className="setting-label">LLM Provider</label>
            <select className="setting-select" value={localSettings.llmProvider} onChange={handleProviderChange}>
              {PROVIDERS.map((p) => (
                <option key={p.value} value={p.value}>{p.label}</option>
              ))}
            </select>
          </div>
          {/* Model Selection */}
          <div className="setting-group">
            <label className="setting-label">Model{localSettings.llmProvider === 'openrouter' ? ' ID' : ''}</label>
            {localSettings.llmProvider === 'openrouter' ? (
              <input
                className="setting-input"
                type="text"
                placeholder="openai/gpt-4o"
                style={{'::placeholder': {opacity: 0.5}}}
                value={localSettings.model}
                onChange={e => setLocalSettings(s => ({ ...s, model: e.target.value }))}
              />
            ) : (
              <select className="setting-select" value={localSettings.model} onChange={handleModelChange}>
                {MODELS[localSettings.llmProvider].map((m) => (
                  <option key={m.value} value={m.value}>{m.label}</option>
                ))}
              </select>
            )}
          </div>
          {/* API Key */}
          <div className="setting-group">
            <label className="setting-label">API Key</label>
            <input
              type="password"
              className="setting-input"
              placeholder={localSettings.llmProvider === 'openrouter' ? 'sk-or-v1-xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx' : 'Enter your API key'}
              style={localSettings.llmProvider === 'openrouter' ? {'::placeholder': {opacity: 0.5}} : {}}
              value={localSettings.apiKey}
              onChange={handleInputChange}
            />
          </div>
          {/* Temperature Setting */}
          <div className="setting-group">
            <label className="setting-label">Temperature: <span>{localSettings.temperature}</span></label>
            <input type="range" className="setting-range" min="0" max="2" step="0.1" value={localSettings.temperature} onChange={handleTempChange} />
          </div>
        </>}
        {section === 'mcp' && <>
          {/* MCP Settings */}
          <div className="setting-group">
            <label className="setting-label">MCP Servers</label>
            <div className="mcp-list">
              {(localSettings.mcpServers && localSettings.mcpServers.length > 0) ? (
                localSettings.mcpServers.map((srv) => (
                  <div className="mcp-item" key={srv.id}>
                    <div className="mcp-info">
                      <div className="mcp-name">{srv.name}</div>
                      <div className="mcp-url">{srv.url}</div>
                    </div>
                    <button className="mcp-remove" onClick={() => handleRemoveMcp(srv.id)}>
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <line x1="18" y1="6" x2="6" y2="18"/>
                        <line x1="6" y1="6" x2="18" y2="18"/>
                      </svg>
                    </button>
                  </div>
                ))
              ) : (
                <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem', textAlign: 'center', padding: '1rem' }}>No MCP servers configured</p>
              )}
            </div>
            <button className="add-mcp-btn" onClick={handleAddMcp}>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <line x1="12" y1="5" x2="12" y2="19"/>
                <line x1="5" y1="12" x2="19" y2="12"/>
              </svg>
              Add MCP Server
            </button>
          </div>
        </>}
        <button className="save-btn" onClick={handleSave}>{saved ? 'Saved!' : 'Save Settings'}</button>
        </div>
      </div>
    </div>
  );
} 