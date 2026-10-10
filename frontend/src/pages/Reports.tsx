import React, { useState, useMemo } from 'react'
import {
  AlertTriangle,
  Calendar,
  BarChart3,
  Users,
  Target,
  Download,
  Printer,
  Eye,
} from 'lucide-react'
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from 'recharts'
import MainLayout from '../layouts/MainLayout'
import studentService from '../services/studentService'
import { useInterventionsStore } from '../store/interventionsStore'
import ChartCard from '../components/common/ChartCard'

type ReportType = 'risk-summary' | 'attendance' | 'performance' | 'department' | 'interventions'

interface ReportConfig {
  key: ReportType
  title: string
  description: string
  icon: React.ElementType
}

const reportConfigs: ReportConfig[] = [
  { key: 'risk-summary', title: 'Risk Summary Report', description: 'Overview of student risk distribution', icon: AlertTriangle },
  { key: 'attendance', title: 'Attendance Report', description: 'Student attendance analysis', icon: Calendar },
  { key: 'performance', title: 'Performance Report', description: 'Academic performance metrics', icon: BarChart3 },
  { key: 'department', title: 'Department-wise Report', description: 'Department performance comparison', icon: Users },
  { key: 'interventions', title: 'Intervention Report', description: 'Intervention tracking and status', icon: Target },
]

const Reports: React.FC = () => {
  const students = studentService.getStudents()
  const { interventions } = useInterventionsStore()
  const [selectedReport, setSelectedReport] = useState<ReportType | null>(null)

  const stats = studentService.getStats()

  // Report Data Generators
  const riskSummaryData = useMemo(() => {
    return students.map(s => ({
      Name: s.name,
      'Roll Number': s.rollNumber,
      'Risk Level': s.riskLevel,
      Attendance: s.attendance,
      'Avg Performance': s.avgPerformance,
      'Failed Subjects': s.failedSubjects,
      Trend: s.trend,
      Remarks: s.remarks,
    }))
  }, [students])

  const attendanceData = useMemo(() => {
    return students.map(s => ({
      Name: s.name,
      Department: s.department,
      Attendance: s.attendance,
      'Days Present': s.daysPresent,
      'Days Absent': s.daysAbsent,
      'Late Count': s.lateCount,
    }))
  }, [students])

  const performanceData = useMemo(() => {
    return students.map(s => ({
      Name: s.name,
      Department: s.department,
      'Math Score': s.mathScore,
      'Programming Score': s.programmingScore,
      'AI/ML Score': s.aimlScore,
      'Avg Performance': s.avgPerformance,
    }))
  }, [students])

  const departmentData = useMemo(() => {
    const departments = ['CSE', 'AI & ML', 'ECE', 'ISE']
    return departments.map(dept => {
      const deptStudents = students.filter(s => s.department === dept)
      return {
        Department: dept,
        'Student Count': deptStudents.length,
        'Avg Attendance': deptStudents.length > 0
          ? (deptStudents.reduce((sum, s) => sum + s.attendance, 0) / deptStudents.length).toFixed(1)
          : 0,
        'Avg Performance': deptStudents.length > 0
          ? (deptStudents.reduce((sum, s) => sum + s.avgPerformance, 0) / deptStudents.length).toFixed(1)
          : 0,
        'High Risk Count': deptStudents.filter(s => s.riskLevel === 'High').length,
      }
    })
  }, [students])

  const interventionReportData = useMemo(() => {
    return interventions.map(i => ({
      Student: i.studentName,
      Type: i.type,
      Status: i.status,
      Priority: i.priority,
      'Assigned To': i.assignedTo,
      'Due Date': i.dueDate,
      Notes: i.notes,
    }))
  }, [interventions])

  // Chart Data
  const riskChartData = [
    { name: 'High', value: stats.high_risk_count, color: '#ef4444' },
    { name: 'Medium', value: stats.medium_risk_count, color: '#f59e0b' },
    { name: 'Low', value: stats.low_risk_count, color: '#22c55e' },
  ]

  const departmentChartData = departmentData.map(d => ({
    department: d.Department,
    avgPerformance: Number(d['Avg Performance']),
    avgAttendance: Number(d['Avg Attendance']),
  }))

  // CSV Export
  const exportToCSV = (data: Record<string, unknown>[], filename: string) => {
    if (data.length === 0) return
    
    const headers = Object.keys(data[0])
    const csvContent = [
      headers.join(','),
      ...data.map(row =>
        headers.map(h => {
          const val = row[h]
          // Escape quotes and wrap in quotes if contains comma
          const str = String(val ?? '')
          if (str.includes(',') || str.includes('"') || str.includes('\n')) {
            return `"${str.replace(/"/g, '""')}"`
          }
          return str
        }).join(',')
      ),
    ].join('\n')

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
    const link = document.createElement('a')
    link.href = URL.createObjectURL(blob)
    link.download = `${filename}.csv`
    link.click()
    URL.revokeObjectURL(link.href)
  }

  const handleDownload = () => {
    if (!selectedReport) return
    
    const dataMap: Record<ReportType, { data: Record<string, unknown>[]; filename: string }> = {
      'risk-summary': { data: riskSummaryData, filename: 'risk_summary_report' },
      'attendance': { data: attendanceData, filename: 'attendance_report' },
      'performance': { data: performanceData, filename: 'performance_report' },
      'department': { data: departmentData, filename: 'department_report' },
      'interventions': { data: interventionReportData, filename: 'intervention_report' },
    }

    const { data, filename } = dataMap[selectedReport]
    exportToCSV(data, filename)
  }

  const handlePrint = () => {
    window.print()
  }

  const getPreviewData = () => {
    switch (selectedReport) {
      case 'risk-summary':
        return riskSummaryData.slice(0, 10)
      case 'attendance':
        return attendanceData.slice(0, 10)
      case 'performance':
        return performanceData.slice(0, 10)
      case 'department':
        return departmentData
      case 'interventions':
        return interventionReportData.slice(0, 10)
      default:
        return []
    }
  }

  const previewData = selectedReport ? getPreviewData() : []
  const previewHeaders = previewData.length > 0 ? Object.keys(previewData[0]) : []

  return (
    <MainLayout>
      <div className="space-y-6 page-enter">
        <div>
          <h1 className="text-3xl font-bold text-neutral-900 dark:text-neutral-50">
            Reports
          </h1>
          <p className="text-neutral-500 dark:text-neutral-400 mt-2">
            Generate and export academic reports
          </p>
        </div>

        {/* Report Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {reportConfigs.map((config) => (
            <div
              key={config.key}
              className={`bg-white dark:bg-neutral-800 rounded-card shadow-card border ${
                selectedReport === config.key
                  ? 'border-primary-500 ring-2 ring-primary-100 dark:ring-primary-900'
                  : 'border-neutral-200/60 dark:border-neutral-700/60'
              } p-5 hover:shadow-card-hover transition-all cursor-pointer`}
              onClick={() => setSelectedReport(config.key)}
            >
              <div className="flex items-start justify-between mb-3">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary-500 to-primary-600 flex items-center justify-center shadow-sm">
                  <config.icon className="w-5 h-5 text-white" />
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={(e) => {
                      e.stopPropagation()
                      setSelectedReport(config.key)
                      setTimeout(handleDownload, 100)
                    }}
                    className="p-1.5 text-neutral-400 hover:text-primary-600 hover:bg-primary-50 dark:hover:bg-primary-900/20 rounded-lg transition-colors"
                    title="Download CSV"
                  >
                    <Download className="w-4 h-4" />
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation()
                      setSelectedReport(config.key)
                      setTimeout(handlePrint, 100)
                    }}
                    className="p-1.5 text-neutral-400 hover:text-primary-600 hover:bg-primary-50 dark:hover:bg-primary-900/20 rounded-lg transition-colors"
                    title="Print"
                  >
                    <Printer className="w-4 h-4" />
                  </button>
                </div>
              </div>
              <h3 className="font-semibold text-neutral-900 dark:text-neutral-100">{config.title}</h3>
              <p className="text-sm text-neutral-500 dark:text-neutral-400 mt-1">{config.description}</p>
            </div>
          ))}
        </div>

        {/* Live Preview Section */}
        {selectedReport && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Eye className="w-5 h-5 text-neutral-400" />
                <h2 className="text-lg font-semibold text-neutral-900 dark:text-neutral-100">
                  {reportConfigs.find(r => r.key === selectedReport)?.title} Preview
                </h2>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={handleDownload}
                  className="flex items-center gap-2 px-4 py-2 bg-primary-600 hover:bg-primary-700 text-white font-medium text-sm rounded-lg transition-colors"
                >
                  <Download className="w-4 h-4" />
                  Download CSV
                </button>
                <button
                  onClick={handlePrint}
                  className="flex items-center gap-2 px-4 py-2 border border-neutral-300 dark:border-neutral-600 text-neutral-700 dark:text-neutral-300 font-medium text-sm rounded-lg hover:bg-neutral-100 dark:hover:bg-neutral-700 transition-colors"
                >
                  <Printer className="w-4 h-4" />
                  Print
                </button>
              </div>
            </div>

            {/* Chart Preview */}
            {selectedReport === 'risk-summary' && (
              <ChartCard title="Risk Distribution" height={250}>
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={riskChartData}
                      cx="50%"
                      cy="50%"
                      innerRadius={50}
                      outerRadius={80}
                      paddingAngle={2}
                      dataKey="value"
                    >
                      {riskChartData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </ChartCard>
            )}

            {selectedReport === 'department' && (
              <ChartCard title="Department Performance" height={250}>
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={departmentChartData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="department" tick={{ fontSize: 12 }} />
                    <YAxis domain={[0, 100]} tick={{ fontSize: 12 }} />
                    <Tooltip />
                    <Bar dataKey="avgPerformance" fill="#3b82f6" name="Avg Performance" radius={[4, 4, 0, 0]} />
                    <Bar dataKey="avgAttendance" fill="#22c55e" name="Avg Attendance" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </ChartCard>
            )}

            {/* Data Table Preview */}
            <div className="bg-white dark:bg-neutral-800 rounded-card shadow-card border border-neutral-200/60 dark:border-neutral-700/60 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="min-w-full text-sm">
                  <thead className="bg-neutral-50 dark:bg-neutral-900/50">
                    <tr>
                      {previewHeaders.map((header) => (
                        <th
                          key={header}
                          className="px-4 py-3 text-left text-xs font-semibold text-neutral-500 dark:text-neutral-400 uppercase tracking-wider whitespace-nowrap"
                        >
                          {header}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-neutral-200 dark:divide-neutral-700">
                    {previewData.map((row, idx) => (
                      <tr key={idx} className="hover:bg-neutral-50 dark:hover:bg-neutral-700/30">
                        {previewHeaders.map((header) => (
                          <td key={header} className="px-4 py-3 text-neutral-600 dark:text-neutral-300 whitespace-nowrap">
                            {String((row as Record<string, unknown>)[header] ?? '')}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              {previewData.length === 0 && (
                <div className="p-8 text-center text-neutral-500">
                  No data available for this report.
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </MainLayout>
  )
}

export default Reports
