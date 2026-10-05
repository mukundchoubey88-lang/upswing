import React from 'react'
import MainLayout from '../layouts/MainLayout'

const Reports: React.FC = () => {
  return (
    <MainLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-neutral-900 dark:text-neutral-50">
            Reports
          </h1>
          <p className="text-neutral-600 dark:text-neutral-400 mt-2">
            Generate and export academic reports
          </p>
        </div>

        <div className="bg-white dark:bg-neutral-800 p-8 rounded-lg shadow-sm border border-neutral-200 dark:border-neutral-700">
          <p className="text-neutral-600 dark:text-neutral-400">
            Reports generation implementation coming in Task 20.
          </p>
        </div>
      </div>
    </MainLayout>
  )
}

export default Reports
