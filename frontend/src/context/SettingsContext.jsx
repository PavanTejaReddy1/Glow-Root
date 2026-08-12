import { createContext, useContext, useEffect, useState } from 'react';
import { settingsService } from '../services/settingsService.js';

const SettingsContext = createContext({});

export function SettingsProvider({ children }) {
  const [settings, setSettings] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    settingsService.getPublicSettings()
      .then(s => setSettings(s))
      .catch(() => setSettings({}))
      .finally(() => setLoading(false));
  }, []);

  return (
    <SettingsContext.Provider value={{ settings, loading, setSettings }}>
      {children}
    </SettingsContext.Provider>
  );
}

export function useSettings() {
  return useContext(SettingsContext);
}
