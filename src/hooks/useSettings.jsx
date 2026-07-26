import { createContext, useContext, useEffect, useState } from 'react';

const SettingsContext = createContext(null);

const DEFAULTS = {
  darkMode: true,
  language: 'fa', // 'fa' | 'en'
  brightness: 100, // 40-100 (%)
  soundEnabled: true,
  musicEnabled: false
};

const STORAGE_KEY = 'eve-matters-settings';

function loadSettings() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? { ...DEFAULTS, ...JSON.parse(raw) } : DEFAULTS;
  } catch {
    return DEFAULTS;
  }
}

export function SettingsProvider({ children }) {
  const [settings, setSettings] = useState(loadSettings);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(settings));
    document.documentElement.style.filter = `brightness(${settings.brightness}%)`;
    document.documentElement.dir = settings.language === 'fa' ? 'rtl' : 'ltr';
    document.documentElement.lang = settings.language;
  }, [settings]);

  const update = (patch) => setSettings((prev) => ({ ...prev, ...patch }));

  return (
    <SettingsContext.Provider value={{ settings, update }}>
      {children}
    </SettingsContext.Provider>
  );
}

export function useSettings() {
  const ctx = useContext(SettingsContext);
  if (!ctx) throw new Error('useSettings must be used within SettingsProvider');
  return ctx;
}
