import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import MainLayout from '../layouts/MainLayout'
import { studentsApi, type Student } from '../services/api'

const riskBadge = (level: string) => {
  if (level === 'high') return 'bg-red-100 text-red-800'
  if (level === 'medium') return 'bg-yellow-100 text-yellow-800'
  return 'bg-green-100 text-green-800'
}

const StudentList: React.FC = () => {
  const [search, setSearch] = useState('')
  const [riskLevel, setRiskLevel] = useState<'low' | 'medium' | 'high' | ''>('')
  const [page, setPage] = useState(1)

  const { data, isLoading, isError, error } = useQuery({
    queryKey: ['students', page, search, riskLevel],
    queryFn: () =>
      studentsApi.getAll({
        page,
        page_size: 20,
        search: search || undefined,
        risk_level: riskLevel || undefined,
      }),
  })

  return (
    <MainLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-neutral-900 dark:text-neutral-50">
            Students
          </h1>
          <p className="text-neutral-600 dark:text-neutral-400 mt-2">
            Manage and monitor student performance
          </p>
        </div>

        <div className="flex flex-col md:flex-row gap-3">
          <input
            type="search"
            value={search}
            onChange={(e) => {
              setSearch(e.target.value)
              setPage(1)
            }}
            placeholder="Search by name, ID, or email"
            className="flex-1 px-4 py-2 border border-neutral-300 rounded-lg bg-white dark:bg-neutral-800"
          />
          <select
            value={riskLevel}
            onChange={(e) => {
              setRiskLevel(e.target.value as typeof riskLevel)
              setPage(1)
            }}
            className="px-4 py-2 border border-neutral-300 rounded-lg bg-white dark:bg-neutral-800"
          >
            <option value="">All risk levels</option>
            <option value="high">High</option>
            <option value="medium">Medium</option>
            <option value="low">Low</option>
          </select>
        </div>

        <div className="bg-white dark:bg-neutral-800 rounded-lg shadow-sm border border-neutral-200 dark:border-neutral-700 overflow-x-auto">
          {isError && (
            <p className="p-6 text-red-600">{(error as Error)?.message || 'Failed to load students'}</p>
          )}
          {isLoading && <p className="p-6 text-neutral-500">Loading students…</p>}
          {!isLoading && data && (
            <>
              <table className="min-w-full text-sm">
                <thead className="bg-neutral-50 dark:bg-neutral-900 text-left">
                  <tr>
                    <th className="px-4 py-3">Student</th>
                    <th className="px-4 py-3">ID</th>
                    <th className="px-4 py-3">Department</th>
                    <th className="px-4 py-3">Attendance</th>
                    <th className="px-4 py-3">Average</th>
                    <th className="px-4 py-3">Risk</th>
                  </tr>
                </thead>
                <tbody>
                  {data.items.map((student: Student) => (
                    <tr key={student.id} className="border-t border-neutral-200 dark:border-neutral-700">
                      <td className="px-4 py-3">
                        <Link to={`/students/${student.id}`} className="font-medium text-primary-500 hover:underline">
                          {student.name}
                        </Link>
                        <div className="text-xs text-neutral-500">{student.email}</div>
                      </td>
                      <td className="px-4 py-3">{student.student_id}</td>
                      <td className="px-4 py-3">{student.department || '—'}</td>
                      <td className="px-4 py-3">{student.attendance_percentage}%</td>
                      <td className="px-4 py-3">{student.current_average}%</td>
                      <td className="px-4 py-3">
                        <span className={`px-2 py-1 rounded text-xs font-semibold uppercase ${riskBadge(student.risk_level)}`}>
                          {student.risk_level} ({student.risk_score})
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <div className="flex items-center justify-between px-4 py-3 border-t border-neutral-200 dark:border-neutral-700">
                <span className="text-sm text-neutral-500">
                  {data.total} students · page {data.page} of {data.total_pages}
                </span>
                <div className="space-x-2">
                  <button
                    disabled={page <= 1}
                    onClick={() => setPage((p) => Math.max(1, p - 1))}
                    className="px-3 py-1 rounded border disabled:opacity-40"
                  >
                    Previous
                  </button>
                  <button
                    disabled={page >= data.total_pages}
                    onClick={() => setPage((p) => p + 1)}
                    className="px-3 py-1 rounded border disabled:opacity-40"
                  >
                    Next
                  </button>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </MainLayout>
  )
}

export default StudentList
