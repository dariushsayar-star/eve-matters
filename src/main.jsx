import React from 'react';
import ReactDOM from 'react-dom/client';
import { HashRouter } from 'react-router-dom';
import App from './App.jsx';
import { SettingsProvider } from './hooks/useSettings.jsx';
import './styles/index.css';

// HashRouter is used (not BrowserRouter) because the production build is
// loaded via file:// inside Electron, where history-API routing breaks.
ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <SettingsProvider>
      <HashRouter>
        <App />
      </HashRouter>
    </SettingsProvider>
  </React.StrictMode>
);
