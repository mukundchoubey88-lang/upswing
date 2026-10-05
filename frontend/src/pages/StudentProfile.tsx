import React from 'react'
import MainLayout from '../layouts/MainLayout'
import { useParams } from 'react-router-dom'

const StudentProfile: React.FC = () => {
  const { studentId } = useParams()

  return (
    <MainLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-neutral-900 dark:text-neutral-50">
            Student Profile
          </h1>
          <p className="text-neutral-600 dark:text-neutral-400 mt-2">
            Student ID: {studentId}
          </p>
        </div>

        <div className="bg-white dark:bg-neutral-800 p-8 rounded-lg shadow-sm border border-neutral-200 dark:border-neutral-700">
          <p className="text-neutral-600 dark:text-neutral-400">
            Student profile with AI analysis implementation coming in Task 11.
          </p>
        </div>
      </div>
    </MainLayout>
  )
}

export default StudentProfile
