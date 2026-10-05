import React from 'react'
import MainLayout from '../layouts/MainLayout'

const Settings: React.FC = () => {
  return (
    <MainLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-neutral-900 dark:text-neutral-50">
            Settings
          </h1>
          <p className="text-neutral-600 dark:text-neutral-400 mt-2">
            Manage system settings and preferences
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* General Settings */}
          <div className="bg-white dark:bg-neutral-800 p-6 rounded-lg shadow-sm border border-neutral-200 dark:border-neutral-700">
            <h2 className="text-lg font-semibold text-neutral-900 dark:text-neutral-50 mb-4">
              General Settings
            </h2>
            <p className="text-sm text-neutral-600 dark:text-neutral-400">
              System preferences and configuration
            </p>
          </div>

          {/* User Management */}
          <div className="bg-white dark:bg-neutral-800 p-6 rounded-lg shadow-sm border border-neutral-200 dark:border-neutral-700">
            <h2 className="text-lg font-semibold text-neutral-900 dark:text-neutral-50 mb-4">
              User Management
            </h2>
            <p className="text-sm text-neutral-600 dark:text-neutral-400">
              Manage system users and permissions
            </p>
          </div>
        </div>
      </div>
    </MainLayout>
  )
}

export default Settings
