import React, { useState, useEffect } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { Users, Search, Filter, ChevronUp, ChevronDown, X } from 'lucide-react'
import MainLayout from '../layouts/MainLayout'
import studentService from '../services/studentService'
import { StudentRecord } from '../data/students'
import RiskBadge from '../components/common/RiskBadge'
import TrendIcon from '../components/common/TrendIcon'
import EmptyState from '../components/common/EmptyState'
import StudentDetailDrawer from '../components/students/StudentDetailDrawer'

type SortField = 'name' | 'attendance' | 'avgPerformance' | 'riskLevel'
type SortDirection = 'asc' | 'desc'

const StudentList: React.FC = () => {
  const [searchParams] = useSearchParams()
  const initialRisk = searchParams.get('risk_level') || searchParams.get('risk') || ''

  const [search, setSearch] = useState('')
  const [riskLevel, setRiskLevel] = useState<string>(initialRisk)
  const [department, setDepartment] = useState<string>('')
  const [year, setYear] = useState<string>('')
  const [section, setSection] = useState<string>('')
  const [page, setPage] = useState(1)
  const [sortField, setSortField] = useState<SortField>('name')
  const [sortDirection, setSortDirection] = useState<SortDirection>('asc')
  const [selectedStudent, setSelectedStudent] = useState<StudentRecord | null>(null)
  const [drawerOpen, setDrawerOpen] = useState(false)

  useEffect(() => {
    if (initialRisk) {
      setRiskLevel(initialRisk)
    }
  }, [initialRisk])

  const res = studentService.filterStudents({
    search,
    department: department || undefined,
    section: section || undefined,
    riskLevel: riskLevel || undefined,
    page,
    pageSize: 10,
  })

  // Sort the results
  const sortedItems = [...res.items].sort((a, b) => {
    let aVal: string | number = ''
    let bVal: string | number = ''

    switch (sortField) {
      case 'name':
        aVal = a.name.toLowerCase()
        bVal = b.name.toLowerCase()
        break
      case 'attendance':
        aVal = a.attendance
        bVal = b.attendance
        break
      case 'avgPerformance':
        aVal = a.avgPerformance
        bVal = b.avgPerformance
        break
      case 'riskLevel':
        const riskOrder = { High: 0, Medium: 1, Low: 2 }
        aVal = riskOrder[a.riskLevel]
        bVal = riskOrder[b.riskLevel]
        break
    }

    if (sortDirection === 'asc') {
      return aVal < bVal ? -1 : aVal > bVal ? 1 : 0
    } else {
      return aVal > bVal ? -1 : aVal < bVal ? 1 : 0
    }
  })

  const totalAllStudents = studentService.getStudents().length
  const isGenuinelyEmpty = totalAllStudents === 0

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc')
    } else {
      setSortField(field)
      setSortDirection('asc')
    }
  }

  const handleRowClick = (student: StudentRecord) => {
    setSelectedStudent(student)
    setDrawerOpen(true)
  }

  const getInitials = (name: string): string => {
    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2)
  }

  const getRiskBgColor = (level: string): string => {
    switch (level) {
      case 'High':
        return 'bg-red-100 dark:bg-red-900/30'
      case 'Medium':
        return 'bg-amber-100 dark:bg-amber-900/30'
      default:
        return 'bg-green-100 dark:bg-green-900/30'
    }
  }

  const clearFilters = () => {
    setSearch('')
    setRiskLevel('')
    setDepartment('')
    setYear('')
    setSection('')
    setPage(1)
  }

  const hasActiveFilters = search || riskLevel || department || year || section

  return (
    <MainLayout>
      <div className="space-y-5 page-enter">
        <div>
          <h1 className="text-3xl font-bold text-neutral-900 dark:text-neutral-50">
            Students
          </h1>
          <p className="text-neutral-500 dark:text-neutral-400 mt-2">
            Manage and monitor student performance
          </p>
        </div>

        {/* Filters & Search */}
        <div className="bg-white dark:bg-neutral-800 rounded-card shadow-card border border-neutral-200/60 dark:border-neutral-700/60 p-4">
          <div className="flex items-center gap-2 mb-3">
            <Filter className="w-4 h-4 text-neutral-400" />
            <span className="text-sm font-medium text-neutral-700 dark:text-neutral-300">Filters</span>
            {hasActiveFilters && (
              <button
                onClick={clearFilters}
                className="ml-auto text-xs text-primary-600 hover:text-primary-700 font-medium flex items-center gap-1"
              >
                <X className="w-3 h-3" /> Clear all
              </button>
            )}
          </div>
          <div className="grid grid-cols-1 md:grid-cols-5 gap-3">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
              <input
                type="search"
                value={search}
                onChange={(e) => {
                  setSearch(e.target.value)
                  setPage(1)
                }}
                placeholder="Search name, roll no..."
                className="w-full pl-9 pr-4 py-2 border border-neutral-300 dark:border-neutral-600 rounded-lg bg-white dark:bg-neutral-700 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
              />
            </div>

            <select
              value={department}
              onChange={(e) => {
                setDepartment(e.target.value)
                setPage(1)
              }}
              className="px-4 py-2 border border-neutral-300 dark:border-neutral-600 rounded-lg bg-white dark:bg-neutral-700 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 appearance-none pr-8"
            >
              <option value="">All Departments</option>
              <option value="CSE">CSE</option>
              <option value="AI & ML">AI & ML</option>
              <option value="ECE">ECE</option>
              <option value="ISE">ISE</option>
            </select>

            <select
              value={year}
              onChange={(e) => {
                setYear(e.target.value)
                setPage(1)
              }}
              className="px-4 py-2 border border-neutral-300 dark:border-neutral-600 rounded-lg bg-white dark:bg-neutral-700 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 appearance-none pr-8"
            >
              <option value="">All Years</option>
              <option value="2nd Year">2nd Year</option>
              <option value="3rd Year">3rd Year</option>
            </select>

            <select
              value={section}
              onChange={(e) => {
                setSection(e.target.value)
                setPage(1)
              }}
              className="px-4 py-2 border border-neutral-300 dark:border-neutral-600 rounded-lg bg-white dark:bg-neutral-700 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 appearance-none pr-8"
            >
              <option value="">All Sections</option>
              <option value="A">Section A</option>
              <option value="B">Section B</option>
              <option value="C">Section C</option>
            </select>

            <select
              value={riskLevel}
              onChange={(e) => {
                setRiskLevel(e.target.value)
                setPage(1)
              }}
              className="px-4 py-2 border border-neutral-300 dark:border-neutral-600 rounded-lg bg-white dark:bg-neutral-700 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 appearance-none pr-8"
            >
              <option value="">All Risk Levels</option>
              <option value="High">High Risk</option>
              <option value="Medium">Medium Risk</option>
              <option value="Low">Low Risk</option>
            </select>
          </div>
        </div>

        {/* Table / Content */}
        <div className="bg-white dark:bg-neutral-800 rounded-card shadow-card border border-neutral-200/60 dark:border-neutral-700/60 overflow-hidden">
          {isGenuinelyEmpty ? (
            <EmptyState
              icon={Users}
              title="No students yet"
              description="Import student data CSV from the Data Center to start monitoring."
              action={
                <Link
                  to="/data-center"
                  className="inline-block mt-4 px-4 py-2 bg-primary-600 hover:bg-primary-700 text-white font-medium text-sm rounded-lg"
                >
                  Import Students (CSV)
                </Link>
              }
            />
          ) : (
            <>
              <div className="overflow-x-auto">
                <table className="min-w-full text-sm">
                  <thead className="bg-neutral-50 dark:bg-neutral-900/50">
                    <tr>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-neutral-500 dark:text-neutral-400 uppercase tracking-wider">
                        Student
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-neutral-500 dark:text-neutral-400 uppercase tracking-wider">
                        Roll No
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-neutral-500 dark:text-neutral-400 uppercase tracking-wider">
                        Department
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-neutral-500 dark:text-neutral-400 uppercase tracking-wider">
                        Year / Sec
                      </th>
                      <th
                        className="px-4 py-3 text-left text-xs font-semibold text-neutral-500 dark:text-neutral-400 uppercase tracking-wider cursor-pointer hover:text-neutral-700 dark:hover:text-neutral-300"
                        onClick={() => handleSort('attendance')}
                      >
                        <div className="flex items-center gap-1">
                          Attendance
                          {sortField === 'attendance' && (
                            sortDirection === 'asc' ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />
                          )}
                        </div>
                      </th>
                      <th
                        className="px-4 py-3 text-left text-xs font-semibold text-neutral-500 dark:text-neutral-400 uppercase tracking-wider cursor-pointer hover:text-neutral-700 dark:hover:text-neutral-300"
                        onClick={() => handleSort('avgPerformance')}
                      >
                        <div className="flex items-center gap-1">
                          Avg Perf
                          {sortField === 'avgPerformance' && (
                            sortDirection === 'asc' ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />
                          )}
                        </div>
                      </th>
                      <th
                        className="px-4 py-3 text-left text-xs font-semibold text-neutral-500 dark:text-neutral-400 uppercase tracking-wider cursor-pointer hover:text-neutral-700 dark:hover:text-neutral-300"
                        onClick={() => handleSort('riskLevel')}
                      >
                        <div className="flex items-center gap-1">
                          Risk Level
                          {sortField === 'riskLevel' && (
                            sortDirection === 'asc' ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />
                          )}
                        </div>
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-neutral-500 dark:text-neutral-400 uppercase tracking-wider">
                        Trend
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-neutral-200 dark:divide-neutral-700">
                    {sortedItems.length === 0 ? (
                      <tr>
                        <td colSpan={8} className="px-4 py-8 text-center text-neutral-500">
                          No students match the selected filter criteria.
                        </td>
                      </tr>
                    ) : (
                      sortedItems.map((student: StudentRecord) => (
                        <tr
                          key={student.id}
                          onClick={() => handleRowClick(student)}
                          className="hover:bg-primary-50 dark:hover:bg-primary-900/10 cursor-pointer transition-colors"
                        >
                          <td className="px-4 py-3">
                            <div className="flex items-center gap-3">
                              <div className={`w-8 h-8 rounded-lg flex items-center justify-center text-xs font-bold ${getRiskBgColor(student.riskLevel)}`}>
                                {getInitials(student.name)}
                              </div>
                              <div>
                                <p className="font-semibold text-neutral-900 dark:text-neutral-100">{student.name}</p>
                                <p className="text-xs text-neutral-500 dark:text-neutral-400">{student.email}</p>
                              </div>
                            </div>
                          </td>
                          <td className="px-4 py-3 font-mono text-xs text-neutral-600 dark:text-neutral-300">{student.rollNumber}</td>
                          <td className="px-4 py-3 text-neutral-600 dark:text-neutral-300">{student.department}</td>
                          <td className="px-4 py-3 text-neutral-600 dark:text-neutral-300">{student.year} ({student.section})</td>
                          <td className="px-4 py-3">
                            <div className="flex items-center gap-2">
                              <span className="font-semibold text-neutral-900 dark:text-neutral-100">{student.attendance}%</span>
                              <div className="w-12 h-1.5 bg-neutral-200 dark:bg-neutral-700 rounded-full overflow-hidden">
                                <div
                                  className={`h-full ${
                                    student.attendance >= 75
                                      ? 'bg-green-500'
                                      : student.attendance >= 65
                                      ? 'bg-amber-500'
                                      : 'bg-red-500'
                                  }`}
                                  style={{ width: `${student.attendance}%` }}
                                />
                              </div>
                            </div>
                          </td>
                          <td className="px-4 py-3 font-semibold text-neutral-900 dark:text-neutral-100">{student.avgPerformance}%</td>
                          <td className="px-4 py-3">
                            <RiskBadge level={student.riskLevel} size="sm" />
                          </td>
                          <td className="px-4 py-3">
                            <TrendIcon trend={student.trend} size="sm" />
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>

              {/* Pagination */}
              <div className="flex items-center justify-between px-4 py-3 border-t border-neutral-200 dark:border-neutral-700 text-sm">
                <span className="text-neutral-500 dark:text-neutral-400">
                  Showing {((page - 1) * 10) + 1} to {Math.min(page * 10, res.total)} of {res.total} students
                </span>
                <div className="flex items-center gap-2">
                  <button
                    disabled={page <= 1}
                    onClick={() => setPage((p) => Math.max(1, p - 1))}
                    className="px-3 py-1.5 rounded-lg border border-neutral-300 dark:border-neutral-600 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-neutral-100 dark:hover:bg-neutral-700 transition-colors"
                  >
                    Previous
                  </button>
                  <span className="px-3 py-1.5 text-neutral-600 dark:text-neutral-300">
                    Page {res.page} of {res.totalPages}
                  </span>
                  <button
                    disabled={page >= res.totalPages}
                    onClick={() => setPage((p) => p + 1)}
                    className="px-3 py-1.5 rounded-lg border border-neutral-300 dark:border-neutral-600 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-neutral-100 dark:hover:bg-neutral-700 transition-colors"
                  >
                    Next
                  </button>
                </div>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Student Detail Drawer */}
      <StudentDetailDrawer
        student={selectedStudent}
        open={drawerOpen}
        onClose={() => {
          setDrawerOpen(false)
          setSelectedStudent(null)
        }}
      />
    </MainLayout>
  )
}

export default StudentList
