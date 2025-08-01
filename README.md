# Chatbot (React/Electron Desktop App)

A lightweight, modern AI chat desktop app for macOS (and cross-platform), supporting multiple LLM providers (OpenAI, Anthropic, OpenRouter, Ollama, and custom APIs) with Model Context Protocol (MCP) support. Built with React and Electron.

## Features
- Chat with multiple AI language models
- Supports OpenAI, Anthropic, OpenRouter, Ollama (local), and custom APIs
- Model Context Protocol (MCP) server management
- Settings for provider, model, API key, temperature, and MCP servers
- Chat history, clear and export chat
- Modern, responsive UI

## Getting Started

### Prerequisites
- [Node.js](https://nodejs.org/) (v16 or newer recommended)

### Install dependencies
```
npm install
```

### Run the app (development)
```
npm start
```
This will build the React app and launch Electron.

### Build the React app only
```
npm run build
```

## Packaging for Distribution
You can use [electron-builder](https://www.electron.build/) or [electron-forge](https://www.electronforge.io/) to package the app as a `.dmg` for macOS or for other platforms. (Ask for setup if you want this!)

## Project Structure
- `src/` - React source code (components, logic)
- `public/` - HTML template for React
- `styles.css` - App-wide styles
- `main.js` - Electron main process
- `dist/` - Webpack build output
- `icons/` - App icons

## License
MIT