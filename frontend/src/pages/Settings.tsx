import React, { useState } from 'react'
import { Settings as SettingsIcon, Users, Bell, Moon, Sun, Sliders, ChevronDown, ChevronUp, Save } from 'lucide-react'
import MainLayout from '../layouts/MainLayout'
import { useSettingsStore } from '../store/settingsStore'

interface DemoUser {
  name: string
  email: string
  role: 'Admin' | 'Teacher' | 'Counselor'
  active: boolean
}

const demoUsers: DemoUser[] = [
  { name: 'Admin User', email: 'admin@eduvision.com', role: 'Admin', active: true },
  { name: 'Teacher User', email: 'teacher@eduvision.com', role: 'Teacher', active: true },
  { name: 'Counselor User', email: 'counselor@eduvision.com', role: 'Counselor', active: false },
]

const Settings: React.FC = () => {
  const { settings, updateSettings, updateNotificationPreference } = useSettingsStore()
  const [expandedCard, setExpandedCard] = useState<'general' | 'users' | null>('general')
  const [saved, setSaved] = useState(false)

  const handleSaveThresholds = () => {
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  const getRoleBadgeColor = (role: string) => {
    switch (role) {
      case 'Admin':
        return 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'
      case 'Teacher':
        return 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400'
      case 'Counselor':
        return 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400'
      default:
        return 'bg-neutral-100 text-neutral-700'
    }
  }

  return (
    <MainLayout>
      <div className="space-y-6 page-enter">
        <div>
          <h1 className="text-3xl font-bold text-neutral-900 dark:text-neutral-50">
            Settings
          </h1>
          <p className="text-neutral-500 dark:text-neutral-400 mt-2">
            Manage system settings and preferences
          </p>
        </div>

        <div className="grid grid-cols-1 gap-6">
          {/* General Settings Card */}
          <div className="bg-white dark:bg-neutral-800 rounded-card shadow-card border border-neutral-200/60 dark:border-neutral-700/60 overflow-hidden">
            <button
              onClick={() => setExpandedCard(expandedCard === 'general' ? null : 'general')}
              className="w-full flex items-center justify-between p-5 hover:bg-neutral-50 dark:hover:bg-neutral-700/30 transition-colors"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary-500 to-primary-600 flex items-center justify-center shadow-sm">
                  <SettingsIcon className="w-5 h-5 text-white" />
                </div>
                <div className="text-left">
                  <h2 className="text-lg font-semibold text-neutral-900 dark:text-neutral-50">
                    General Settings
                  </h2>
                  <p className="text-sm text-neutral-500 dark:text-neutral-400">
                    System preferences and configuration
                  </p>
                </div>
              </div>
              {expandedCard === 'general' ? (
                <ChevronUp className="w-5 h-5 text-neutral-400" />
              ) : (
                <ChevronDown className="w-5 h-5 text-neutral-400" />
              )}
            </button>

            {expandedCard === 'general' && (
              <div className="px-5 pb-5 border-t border-neutral-200 dark:border-neutral-700">
                {/* Risk Thresholds */}
                <div className="py-5 border-b border-neutral-200 dark:border-neutral-700">
                  <div className="flex items-center gap-2 mb-4">
                    <Sliders className="w-4 h-4 text-neutral-500" />
                    <h3 className="font-semibold text-neutral-900 dark:text-neutral-100">Risk Thresholds</h3>
                  </div>
                  <div className="space-y-6">
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <label className="text-sm text-neutral-600 dark:text-neutral-400">Attendance Cutoff</label>
                        <span className="text-sm font-semibold text-primary-600 dark:text-primary-400">
                          {settings.attendanceCutoff}%
                        </span>
                      </div>
                      <input
                        type="range"
                        min="50"
                        max="90"
                        step="5"
                        value={settings.attendanceCutoff}
                        onChange={(e) => updateSettings({ attendanceCutoff: parseInt(e.target.value) })}
                        className="w-full h-2 bg-neutral-200 dark:bg-neutral-700 rounded-lg appearance-none cursor-pointer accent-primary-500"
                      />
                      <p className="text-xs text-neutral-500 mt-1">
                        Students below this attendance will be flagged as at-risk
                      </p>
                    </div>
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <label className="text-sm text-neutral-600 dark:text-neutral-400">Performance Cutoff</label>
                        <span className="text-sm font-semibold text-primary-600 dark:text-primary-400">
                          {settings.performanceCutoff}%
                        </span>
                      </div>
                      <input
                        type="range"
                        min="50"
                        max="90"
                        step="5"
                        value={settings.performanceCutoff}
                        onChange={(e) => updateSettings({ performanceCutoff: parseInt(e.target.value) })}
                        className="w-full h-2 bg-neutral-200 dark:bg-neutral-700 rounded-lg appearance-none cursor-pointer accent-primary-500"
                      />
                      <p className="text-xs text-neutral-500 mt-1">
                        Students below this average will be flagged as at-risk
                      </p>
                    </div>
                  </div>
                </div>

                {/* Notification Preferences */}
                <div className="py-5 border-b border-neutral-200 dark:border-neutral-700">
                  <div className="flex items-center gap-2 mb-4">
                    <Bell className="w-4 h-4 text-neutral-500" />
                    <h3 className="font-semibold text-neutral-900 dark:text-neutral-100">Notification Preferences</h3>
                  </div>
                  <div className="space-y-3">
                    <label className="flex items-center justify-between cursor-pointer">
                      <span className="text-sm text-neutral-600 dark:text-neutral-400">High Risk Alerts</span>
                      <div className="relative">
                        <input
                          type="checkbox"
                          checked={settings.notifications.highRisk}
                          onChange={(e) => updateNotificationPreference('highRisk', e.target.checked)}
                          className="sr-only peer"
                        />
                        <div className="w-11 h-6 bg-neutral-200 dark:bg-neutral-700 rounded-full peer peer-checked:bg-primary-500 transition-colors"></div>
                        <div className="absolute left-1 top-1 w-4 h-4 bg-white rounded-full transition-transform peer-checked:translate-x-5"></div>
                      </div>
                    </label>
                    <label className="flex items-center justify-between cursor-pointer">
                      <span className="text-sm text-neutral-600 dark:text-neutral-400">Low Attendance Alerts</span>
                      <div className="relative">
                        <input
                          type="checkbox"
                          checked={settings.notifications.attendance}
                          onChange={(e) => updateNotificationPreference('attendance', e.target.checked)}
                          className="sr-only peer"
                        />
                        <div className="w-11 h-6 bg-neutral-200 dark:bg-neutral-700 rounded-full peer peer-checked:bg-primary-500 transition-colors"></div>
                        <div className="absolute left-1 top-1 w-4 h-4 bg-white rounded-full transition-transform peer-checked:translate-x-5"></div>
                      </div>
                    </label>
                    <label className="flex items-center justify-between cursor-pointer">
                      <span className="text-sm text-neutral-600 dark:text-neutral-400">Intervention Reminders</span>
                      <div className="relative">
                        <input
                          type="checkbox"
                          checked={settings.notifications.interventions}
                          onChange={(e) => updateNotificationPreference('interventions', e.target.checked)}
                          className="sr-only peer"
                        />
                        <div className="w-11 h-6 bg-neutral-200 dark:bg-neutral-700 rounded-full peer peer-checked:bg-primary-500 transition-colors"></div>
                        <div className="absolute left-1 top-1 w-4 h-4 bg-white rounded-full transition-transform peer-checked:translate-x-5"></div>
                      </div>
                    </label>
                    <label className="flex items-center justify-between cursor-pointer">
                      <span className="text-sm text-neutral-600 dark:text-neutral-400">Performance Alerts</span>
                      <div className="relative">
                        <input
                          type="checkbox"
                          checked={settings.notifications.performance}
                          onChange={(e) => updateNotificationPreference('performance', e.target.checked)}
                          className="sr-only peer"
                        />
                        <div className="w-11 h-6 bg-neutral-200 dark:bg-neutral-700 rounded-full peer peer-checked:bg-primary-500 transition-colors"></div>
                        <div className="absolute left-1 top-1 w-4 h-4 bg-white rounded-full transition-transform peer-checked:translate-x-5"></div>
                      </div>
                    </label>
                  </div>
                </div>

                {/* Theme Toggle */}
                <div className="py-5">
                  <div className="flex items-center gap-2 mb-4">
                    {settings.theme === 'dark' ? (
                      <Moon className="w-4 h-4 text-neutral-500" />
                    ) : (
                      <Sun className="w-4 h-4 text-neutral-500" />
                    )}
                    <h3 className="font-semibold text-neutral-900 dark:text-neutral-100">Theme</h3>
                  </div>
                  <div className="flex gap-3">
                    <button
                      onClick={() => updateSettings({ theme: 'light' })}
                      className={`flex-1 flex items-center justify-center gap-2 px-4 py-2 rounded-lg border transition-colors ${
                        settings.theme === 'light'
                          ? 'bg-primary-50 dark:bg-primary-900/30 border-primary-500 text-primary-700 dark:text-primary-300'
                          : 'border-neutral-300 dark:border-neutral-600 text-neutral-600 dark:text-neutral-400'
                      }`}
                    >
                      <Sun className="w-4 h-4" />
                      Light
                    </button>
                    <button
                      onClick={() => updateSettings({ theme: 'dark' })}
                      className={`flex-1 flex items-center justify-center gap-2 px-4 py-2 rounded-lg border transition-colors ${
                        settings.theme === 'dark'
                          ? 'bg-primary-50 dark:bg-primary-900/30 border-primary-500 text-primary-700 dark:text-primary-300'
                          : 'border-neutral-300 dark:border-neutral-600 text-neutral-600 dark:text-neutral-400'
                      }`}
                    >
                      <Moon className="w-4 h-4" />
                      Dark
                    </button>
                  </div>
                </div>

                {/* Save Button */}
                <div className="pt-4 border-t border-neutral-200 dark:border-neutral-700">
                  <button
                    onClick={handleSaveThresholds}
                    className="flex items-center gap-2 px-4 py-2 bg-primary-600 hover:bg-primary-700 text-white font-medium text-sm rounded-lg transition-colors"
                  >
                    <Save className="w-4 h-4" />
                    {saved ? 'Saved!' : 'Save Settings'}
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* User Management Card */}
          <div className="bg-white dark:bg-neutral-800 rounded-card shadow-card border border-neutral-200/60 dark:border-neutral-700/60 overflow-hidden">
            <button
              onClick={() => setExpandedCard(expandedCard === 'users' ? null : 'users')}
              className="w-full flex items-center justify-between p-5 hover:bg-neutral-50 dark:hover:bg-neutral-700/30 transition-colors"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-500 to-purple-600 flex items-center justify-center shadow-sm">
                  <Users className="w-5 h-5 text-white" />
                </div>
                <div className="text-left">
                  <h2 className="text-lg font-semibold text-neutral-900 dark:text-neutral-50">
                    User Management
                  </h2>
                  <p className="text-sm text-neutral-500 dark:text-neutral-400">
                    Manage system users and permissions
                  </p>
                </div>
              </div>
              {expandedCard === 'users' ? (
                <ChevronUp className="w-5 h-5 text-neutral-400" />
              ) : (
                <ChevronDown className="w-5 h-5 text-neutral-400" />
              )}
            </button>

            {expandedCard === 'users' && (
              <div className="px-5 pb-5 border-t border-neutral-200 dark:border-neutral-700">
                <div className="overflow-x-auto mt-4">
                  <table className="min-w-full text-sm">
                    <thead className="bg-neutral-50 dark:bg-neutral-900/50">
                      <tr>
                        <th className="px-4 py-3 text-left text-xs font-semibold text-neutral-500 dark:text-neutral-400 uppercase tracking-wider">
                          Name
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-semibold text-neutral-500 dark:text-neutral-400 uppercase tracking-wider">
                          Email
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-semibold text-neutral-500 dark:text-neutral-400 uppercase tracking-wider">
                          Role
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-semibold text-neutral-500 dark:text-neutral-400 uppercase tracking-wider">
                          Status
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-neutral-200 dark:divide-neutral-700">
                      {demoUsers.map((user, idx) => (
                        <tr key={idx} className="hover:bg-neutral-50 dark:hover:bg-neutral-700/30">
                          <td className="px-4 py-3 font-medium text-neutral-900 dark:text-neutral-100">
                            {user.name}
                          </td>
                          <td className="px-4 py-3 text-neutral-600 dark:text-neutral-400">
                            {user.email}
                          </td>
                          <td className="px-4 py-3">
                            <span className={`px-2.5 py-1 text-xs font-semibold rounded-full ${getRoleBadgeColor(user.role)}`}>
                              {user.role}
                            </span>
                          </td>
                          <td className="px-4 py-3">
                            <label className="relative inline-flex items-center cursor-pointer">
                              <input
                                type="checkbox"
                                checked={user.active}
                                readOnly
                                className="sr-only peer"
                              />
                              <div className="w-9 h-5 bg-neutral-200 dark:bg-neutral-700 rounded-full peer peer-checked:bg-green-500 transition-colors"></div>
                              <div className="absolute left-0.5 top-0.5 w-4 h-4 bg-white rounded-full transition-transform peer-checked:translate-x-4"></div>
                            </label>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-4">
                  * User management is demo-only. Full authentication system coming soon.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </MainLayout>
  )
}

export default Settings
