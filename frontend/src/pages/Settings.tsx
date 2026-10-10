import React, { useState } from 'react'
import { ChevronDown, ChevronUp, Save, RotateCcw } from 'lucide-react'
import MainLayout from '../layouts/MainLayout'
import { useSettingsStore } from '../store/settingsStore'

const Settings: React.FC = () => {
  const { settings, updateSettings, resetToDefaults } = useSettingsStore()
  const [generalOpen, setGeneralOpen] = useState(true)
  const [usersOpen, setUsersOpen] = useState(false)
  const [localAttendance, setLocalAttendance] = useState(settings.attendanceThreshold)
  const [localPerformance, setLocalPerformance] = useState(settings.performanceThreshold)
  const [localNotifications, setLocalNotifications] = useState(settings.notificationsEnabled)
  const [localTheme, setLocalTheme] = useState<'light' | 'dark'>(settings.theme)
  const [users, setUsers] = useState([
    { name: 'Admin User', email: 'admin@eduvision.local', role: 'Admin' as const, active: true },
    { name: 'Teacher User', email: 'teacher@eduvision.local', role: 'Teacher' as const, active: true },
    { name: 'Counselor User', email: 'counselor@eduvision.local', role: 'Counselor' as const, active: false },
  ])

  const handleSave = () => {
    updateSettings({
      attendanceThreshold: localAttendance,
      performanceThreshold: localPerformance,
      notificationsEnabled: localNotifications,
      theme: localTheme,
    })
  }

  const handleReset = () => {
    resetToDefaults()
    setLocalAttendance(65)
    setLocalPerformance(65)
    setLocalNotifications(true)
    setLocalTheme('light')
  }

  const toggleUserStatus = (index: number) => {
    setUsers(prev => prev.map((u, i) => i === index ? { ...u, active: !u.active } : u))
  }

  const getRoleBadgeColor = (role: string) => {
    switch (role) {
      case 'Admin':
        return 'bg-red-100 text-red-700'
      case 'Teacher':
        return 'bg-blue-100 text-blue-700'
      case 'Counselor':
        return 'bg-green-100 text-green-700'
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
            Customize your experience and manage users
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* General Settings Card */}
          <div className="bg-white dark:bg-neutral-800 rounded-card shadow-card border border-neutral-200/60 dark:border-neutral-700/60 overflow-hidden">
            <button
              onClick={() => setGeneralOpen(!generalOpen)}
              className="w-full flex items-center justify-between p-5 hover:bg-neutral-50 dark:hover:bg-neutral-700/30 transition-colors"
              aria-label={generalOpen ? 'Collapse' : 'Expand'}
            >
              <div className="text-left">
                <h2 className="text-lg font-semibold text-neutral-900 dark:text-neutral-50">
                  General Settings
                </h2>
                <p className="text-sm text-neutral-500 dark:text-neutral-400">
                  System preferences and configuration
                </p>
              </div>
              {generalOpen ? (
                <ChevronUp className="w-5 h-5 text-neutral-400" />
              ) : (
                <ChevronDown className="w-5 h-5 text-neutral-400" />
              )}
            </button>

            <div className={`transition-all duration-300 ease-in-out overflow-hidden ${
              generalOpen ? 'max-h-[800px] opacity-100' : 'max-h-0 opacity-0'
            }`}>
              <div className="px-5 pb-5 border-t border-neutral-200 dark:border-neutral-700">
                {/* Attendance Threshold */}
                <div className="py-5 border-b border-neutral-200 dark:border-neutral-700">
                  <div className="flex items-center justify-between mb-2">
                    <label className="text-sm font-medium text-neutral-900 dark:text-neutral-100">
                      Attendance Threshold
                    </label>
                    <span className="text-sm font-semibold text-blue-600 dark:text-blue-400">
                      {localAttendance}%
                    </span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="100"
                    step="1"
                    value={localAttendance}
                    onChange={(e) => setLocalAttendance(parseInt(e.target.value))}
                    className="w-full h-2 bg-neutral-200 dark:bg-neutral-700 rounded-lg appearance-none cursor-pointer accent-blue-500"
                  />
                  <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-1">
                    Minimum attendance for low-risk classification
                  </p>
                </div>

                {/* Performance Threshold */}
                <div className="py-5 border-b border-neutral-200 dark:border-neutral-700">
                  <div className="flex items-center justify-between mb-2">
                    <label className="text-sm font-medium text-neutral-900 dark:text-neutral-100">
                      Performance Threshold
                    </label>
                    <span className="text-sm font-semibold text-blue-600 dark:text-blue-400">
                      {localPerformance}%
                    </span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="100"
                    step="1"
                    value={localPerformance}
                    onChange={(e) => setLocalPerformance(parseInt(e.target.value))}
                    className="w-full h-2 bg-neutral-200 dark:bg-neutral-700 rounded-lg appearance-none cursor-pointer accent-blue-500"
                  />
                  <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-1">
                    Minimum average performance for low-risk classification
                  </p>
                </div>

                {/* Notifications Toggle */}
                <div className="py-5 border-b border-neutral-200 dark:border-neutral-700">
                  <div className="flex items-center justify-between">
                    <div>
                      <label className="text-sm font-medium text-neutral-900 dark:text-neutral-100">
                        Notifications
                      </label>
                      <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-1">
                        Enable notifications for high-risk alerts
                      </p>
                    </div>
                    <button
                      onClick={() => setLocalNotifications(!localNotifications)}
                      className={`relative w-11 h-6 rounded-full transition-colors ${
                        localNotifications ? 'bg-blue-500' : 'bg-neutral-300 dark:bg-neutral-600'
                      }`}
                      role="switch"
                      aria-checked={localNotifications}
                    >
                      <span
                        className={`absolute left-1 top-1 w-4 h-4 bg-white rounded-full transition-transform ${
                          localNotifications ? 'translate-x-5' : 'translate-x-0'
                        }`}
                      />
                    </button>
                  </div>
                </div>

                {/* Theme Selector */}
                <div className="py-5 border-b border-neutral-200 dark:border-neutral-700">
                  <label className="text-sm font-medium text-neutral-900 dark:text-neutral-100">
                    Theme
                  </label>
                  <div className="flex gap-3 mt-3">
                    <button
                      onClick={() => setLocalTheme('light')}
                      className={`flex-1 px-4 py-2 rounded-lg border transition-colors ${
                        localTheme === 'light'
                          ? 'bg-blue-50 border-blue-500 text-blue-700'
                          : 'border-neutral-300 text-neutral-600'
                      }`}
                    >
                      Light
                    </button>
                    <button
                      onClick={() => setLocalTheme('dark')}
                      className={`flex-1 px-4 py-2 rounded-lg border transition-colors ${
                        localTheme === 'dark'
                          ? 'bg-blue-50 border-blue-500 text-blue-700'
                          : 'border-neutral-300 text-neutral-600'
                      }`}
                    >
                      Dark
                    </button>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="pt-5 flex gap-3">
                  <button
                    onClick={handleSave}
                    className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium text-sm rounded-lg transition-colors"
                  >
                    <Save className="w-4 h-4" />
                    Save
                  </button>
                  <button
                    onClick={handleReset}
                    className="flex items-center gap-2 px-4 py-2 border border-neutral-300 hover:bg-neutral-50 text-neutral-600 font-medium text-sm rounded-lg transition-colors"
                  >
                    <RotateCcw className="w-4 h-4" />
                    Reset to Defaults
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* User Management Card */}
          <div className="bg-white dark:bg-neutral-800 rounded-card shadow-card border border-neutral-200/60 dark:border-neutral-700/60 overflow-hidden">
            <button
              onClick={() => setUsersOpen(!usersOpen)}
              className="w-full flex items-center justify-between p-5 hover:bg-neutral-50 dark:hover:bg-neutral-700/30 transition-colors"
              aria-label={usersOpen ? 'Collapse' : 'Expand'}
            >
              <div className="text-left">
                <h2 className="text-lg font-semibold text-neutral-900 dark:text-neutral-50">
                  User Management
                </h2>
                <p className="text-sm text-neutral-500 dark:text-neutral-400">
                  Manage system users and permissions
                </p>
              </div>
              {usersOpen ? (
                <ChevronUp className="w-5 h-5 text-neutral-400" />
              ) : (
                <ChevronDown className="w-5 h-5 text-neutral-400" />
              )}
            </button>

            <div className={`transition-all duration-300 ease-in-out overflow-hidden ${
              usersOpen ? 'max-h-[800px] opacity-100' : 'max-h-0 opacity-0'
            }`}>
              <div className="px-5 pb-5 border-t border-neutral-200 dark:border-neutral-700">
                <div className="overflow-x-auto mt-4">
                  <table className="min-w-full text-sm">
                    <thead className="bg-neutral-50 dark:bg-neutral-900/50">
                      <tr>
                        <th className="px-4 py-3 text-left text-xs font-semibold text-neutral-500 dark:text-neutral-400 uppercase tracking-wider">
                          Username
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
                      {users.map((user, idx) => (
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
                            <button
                              onClick={() => toggleUserStatus(idx)}
                              className={`px-2.5 py-1 text-xs font-semibold rounded-full ${
                                user.active
                                  ? 'bg-green-100 text-green-700'
                                  : 'bg-neutral-100 text-neutral-600'
                              }`}
                            >
                              {user.active ? 'Active' : 'Inactive'}
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  )
}

export default Settings
