import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export interface Settings {
  attendanceCutoff: number
  performanceCutoff: number
  notifications: {
    highRisk: boolean
    attendance: boolean
    interventions: boolean
    performance: boolean
  }
  theme: 'light' | 'dark'
}

interface SettingsState {
  settings: Settings
  updateSettings: (updates: Partial<Settings>) => void
  updateNotificationPreference: (key: keyof Settings['notifications'], value: boolean) => void
  resetToDefaults: () => void
}

const defaultSettings: Settings = {
  attendanceCutoff: 65,
  performanceCutoff: 65,
  notifications: {
    highRisk: true,
    attendance: true,
    interventions: true,
    performance: true,
  },
  theme: 'light',
}

export const useSettingsStore = create<SettingsState>()(
  persist(
    (set) => ({
      settings: defaultSettings,

      updateSettings: (updates) => {
        set((state) => ({
          settings: { ...state.settings, ...updates },
        }))
      },

      updateNotificationPreference: (key, value) => {
        set((state) => ({
          settings: {
            ...state.settings,
            notifications: { ...state.settings.notifications, [key]: value },
          },
        }))
      },

      resetToDefaults: () => {
        set({ settings: defaultSettings })
      },
    }),
    {
      name: 'eduvision-settings',
    }
  )
)
