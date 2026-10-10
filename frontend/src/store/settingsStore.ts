import { create } from 'zustand';

export interface Settings {
  attendanceThreshold: number;
  performanceThreshold: number;
  attendanceCutoff: number;
  performanceCutoff: number;
  notificationsEnabled: boolean;
  notifications: {
    highRisk: boolean;
    attendance: boolean;
    interventions: boolean;
    performance: boolean;
  };
  theme: 'light' | 'dark';
}

const STORAGE_KEY = 'eduvision_settings';

const DEFAULT_SETTINGS: Settings = {
  attendanceThreshold: 65,
  performanceThreshold: 65,
  attendanceCutoff: 65,
  performanceCutoff: 65,
  notificationsEnabled: true,
  notifications: {
    highRisk: true,
    attendance: true,
    interventions: true,
    performance: true,
  },
  theme: 'light',
};

const saveToStorage = (settings: Settings) => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(settings));
  } catch (e) {
    console.warn('Failed to save settings to localStorage', e);
  }
};

const loadFromStorage = (): Settings => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      const parsed = JSON.parse(stored);
      if (parsed && typeof parsed === 'object') {
        return { ...DEFAULT_SETTINGS, ...parsed };
      }
    }
  } catch (e) {
    console.warn('Failed to load settings from localStorage', e);
  }
  return { ...DEFAULT_SETTINGS };
};

interface SettingsState {
  settings: Settings;
  updateSettings: (updates: Partial<Settings>) => void;
  updateNotificationPreference: (key: keyof Settings['notifications'], value: boolean) => void;
  resetToDefaults: () => void;
}

export const useSettingsStore = create<SettingsState>(() => ({
  settings: loadFromStorage(),

  updateSettings: (updates) => {
    useSettingsStore.setState(state => {
      const updated = { ...state.settings, ...updates };
      saveToStorage(updated);
      return { settings: updated };
    });
  },

  updateNotificationPreference: (key, value) => {
    useSettingsStore.setState(state => {
      const updated = {
        ...state.settings,
        notifications: {
          ...state.settings.notifications,
          [key]: value,
        },
      };
      saveToStorage(updated);
      return { settings: updated };
    });
  },

  resetToDefaults: () => {
    const defaults = { ...DEFAULT_SETTINGS };
    saveToStorage(defaults);
    useSettingsStore.setState({ settings: defaults });
  },
}));

export default useSettingsStore;
