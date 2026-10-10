import React from 'react'
import { Link } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import {
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ScatterChart,
  Scatter,
  Legend,
} from 'recharts'
import {
  Users,
  AlertTriangle,
  TrendingUp,
  TrendingDown,
  Calendar,
  BarChart3,
  Target,
  UserCheck,
  Activity,
} from 'lucide-react'
import MainLayout from '../layouts/MainLayout'
import { useAuth } from '../context/AuthContext'
import { dashboardApi } from '../services/api'
import studentService from '../services/studentService'
import StatCard from '../components/common/StatCard'
import RiskBadge from '../components/common/RiskBadge'
import TrendIcon from '../components/common/TrendIcon'
import ChartCard from '../components/common/ChartCard'

const Dashboard: React.FC = () => {
  const { user } = useAuth()
  const { data, isLoading, isError, error } = useQuery({
    queryKey: ['dashboard-metrics'],
    queryFn: dashboardApi.getMetrics,
  })

  // Get all students for charts
  const students = studentService.getStudents()
  const stats = studentService.getStats()

  // Risk Distribution Data
  const riskData = [
    { name: 'High Risk', value: stats.high_risk_count, color: '#ef4444' },
    { name: 'Medium Risk', value: stats.medium_risk_count, color: '#f59e0b' },
    { name: 'Low Risk', value: stats.low_risk_count, color: '#22c55e' },
  ]

  // Trend Distribution Data
  const trendData = [
    { name: 'Improving', value: stats.improving_count, color: '#22c55e' },
    { name: 'Stable', value: stats.stable_count, color: '#94a3b8' },
    { name: 'Declining', value: stats.declining_count, color: '#ef4444' },
  ]

  // Performance by Department
  const departmentPerformance = () => {
    const departments = ['CSE', 'AI & ML', 'ECE', 'ISE']
    return departments.map((dept) => {
      const deptStudents = students.filter((s) => s.department === dept)
      const avgPerf =
        deptStudents.length > 0
          ? (deptStudents.reduce((sum, s) => sum + s.avgPerformance, 0) / deptStudents.length).toFixed(1)
          : 0
      return {
        department: dept,
        avgPerformance: Number(avgPerf),
        count: deptStudents.length,
      }
    })
  }

  // Attendance vs Performance Scatter Data
  const scatterData = students.map((s) => ({
    name: s.name,
    attendance: s.attendance,
    performance: s.avgPerformance,
    risk: s.riskLevel,
  }))

  // Top 5 At-Risk Students
  const topAtRiskStudents = students
    .filter((s) => s.riskLevel === 'High')
    .sort((a, b) => a.attendance - b.attendance)
    .slice(0, 5)

  // Needs Attention Students (High risk AND Declining)
  const needsAttentionStudents = students.filter(
    (s) => s.riskLevel === 'High' && s.trend === 'Declining'
  )

  const getInitials = (name: string): string => {
    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2)
  }

  const getRiskColor = (level: string): string => {
    switch (level) {
      case 'High':
        return 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'
      case 'Medium':
        return 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400'
      default:
        return 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
    }
  }

  return (
    <MainLayout>
      <div className="space-y-8 page-enter">
        <div>
          <h1 className="text-3xl md:text-4xl font-bold text-neutral-900 dark:text-neutral-50">
            Welcome, {user?.name}
          </h1>
          <p className="text-neutral-500 dark:text-neutral-400 mt-2">
            Academic Intelligence Dashboard
          </p>
        </div>

        {isError && (
          <div className="p-4 rounded-lg bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-400 border border-red-200 dark:border-red-800">
            Could not load dashboard metrics. {(error as Error)?.message || 'Check that the backend is running.'}
          </div>
        )}

        {/* First Row - 4 Stat Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard
            title="Total Students"
            value={isLoading ? 0 : data?.total_students ?? 0}
            icon={Users}
            color="blue"
            trend={`${stats.total_students} enrolled`}
            to="/students"
          />
          <StatCard
            title="High Risk"
            value={isLoading ? 0 : data?.high_risk_count ?? 0}
            icon={AlertTriangle}
            color="red"
            trend={`${((stats.high_risk_count / stats.total_students) * 100).toFixed(0)}% of students`}
            to="/students?risk_level=High"
          />
          <StatCard
            title="Medium Risk"
            value={isLoading ? 0 : data?.medium_risk_count ?? 0}
            icon={Activity}
            color="amber"
            trend={`${((stats.medium_risk_count / stats.total_students) * 100).toFixed(0)}% of students`}
            to="/students?risk_level=Medium"
          />
          <StatCard
            title="Low Risk"
            value={isLoading ? 0 : data?.low_risk_count ?? 0}
            icon={UserCheck}
            color="green"
            trend={`${((stats.low_risk_count / stats.total_students) * 100).toFixed(0)}% of students`}
            to="/students?risk_level=Low"
          />
        </div>

        {/* Second Row - 4 Stat Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard
            title="Improving"
            value={isLoading ? 0 : data?.improving_count ?? 0}
            icon={TrendingUp}
            color="green"
            trend="Positive trajectory"
          />
          <StatCard
            title="Declining"
            value={isLoading ? 0 : data?.declining_count ?? 0}
            icon={TrendingDown}
            color="red"
            trend="Needs attention"
          />
          <StatCard
            title="Avg Attendance"
            value={`${isLoading ? 0 : data?.average_attendance ?? 0}%`}
            icon={Calendar}
            color="blue"
            trend="Overall attendance"
          />
          <StatCard
            title="Avg Performance"
            value={`${isLoading ? 0 : data?.average_performance ?? 0}%`}
            icon={BarChart3}
            color="amber"
            trend="Academic average"
          />
        </div>

        {/* Quick Links - 3 Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <QuickLink title="View Students" description="Manage and monitor student performance" icon={Users} href="/students" />
          <QuickLink title="Risk Analysis" description="Analyze student academic risk" icon={AlertTriangle} href="/risk-analysis" />
          <QuickLink title="Interventions" description="Create and track interventions" icon={Target} href="/interventions" />
        </div>

        {/* Charts Row 1 - Risk Distribution & Trend Distribution */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <ChartCard title="Risk Distribution" subtitle="Students by risk level" height={280}>
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={riskData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  paddingAngle={2}
                  dataKey="value"
                  label={({ name, percent }) => `${name} (${(percent * 100).toFixed(0)}%)`}
                  labelLine={false}
                >
                  {riskData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </ChartCard>

          <ChartCard title="Performance Trend" subtitle="Students by academic trend" height={280}>
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={trendData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  paddingAngle={2}
                  dataKey="value"
                  label={({ name, percent }) => `${name} (${(percent * 100).toFixed(0)}%)`}
                  labelLine={false}
                >
                  {trendData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </ChartCard>
        </div>

        {/* Charts Row 2 - Department Performance & Scatter Plot */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <ChartCard title="Avg Performance by Department" subtitle="Department-wise academic performance" height={280}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={departmentPerformance()}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="department" tick={{ fontSize: 12 }} />
                <YAxis domain={[0, 100]} tick={{ fontSize: 12 }} />
                <Tooltip />
                <Bar dataKey="avgPerformance" fill="#3b82f6" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </ChartCard>

          <ChartCard title="Attendance vs Performance" subtitle="Correlation analysis by risk level" height={280}>
            <ResponsiveContainer width="100%" height="100%">
              <ScatterChart margin={{ top: 10, right: 10, bottom: 10, left: 10 }}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis type="number" dataKey="attendance" name="Attendance" domain={[40, 100]} tick={{ fontSize: 12 }} />
                <YAxis type="number" dataKey="performance" name="Performance" domain={[40, 100]} tick={{ fontSize: 12 }} />
                <Tooltip cursor={{ strokeDasharray: '3 3' }} />
                <Legend />
                <Scatter name="High Risk" data={scatterData.filter(d => d.risk === 'High')} fill="#ef4444" />
                <Scatter name="Medium Risk" data={scatterData.filter(d => d.risk === 'Medium')} fill="#f59e0b" />
                <Scatter name="Low Risk" data={scatterData.filter(d => d.risk === 'Low')} fill="#22c55e" />
              </ScatterChart>
            </ResponsiveContainer>
          </ChartCard>
        </div>

        {/* Top 5 At-Risk Students Table */}
        <div className="bg-white dark:bg-neutral-800 rounded-card shadow-card border border-neutral-200/60 dark:border-neutral-700/60 overflow-hidden">
          <div className="px-5 py-4 border-b border-neutral-200/60 dark:border-neutral-700/60">
            <h3 className="text-base font-semibold text-neutral-900 dark:text-neutral-50">Top 5 At-Risk Students</h3>
            <p className="text-sm text-neutral-500 dark:text-neutral-400 mt-0.5">Students requiring immediate attention</p>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full text-sm">
              <thead className="bg-neutral-50 dark:bg-neutral-900/50">
                <tr>
                  <th className="px-5 py-3 text-left text-xs font-semibold text-neutral-500 dark:text-neutral-400 uppercase tracking-wider">Student</th>
                  <th className="px-5 py-3 text-left text-xs font-semibold text-neutral-500 dark:text-neutral-400 uppercase tracking-wider">Department</th>
                  <th className="px-5 py-3 text-left text-xs font-semibold text-neutral-500 dark:text-neutral-400 uppercase tracking-wider">Attendance</th>
                  <th className="px-5 py-3 text-left text-xs font-semibold text-neutral-500 dark:text-neutral-400 uppercase tracking-wider">Avg Performance</th>
                  <th className="px-5 py-3 text-left text-xs font-semibold text-neutral-500 dark:text-neutral-400 uppercase tracking-wider">Risk</th>
                  <th className="px-5 py-3 text-left text-xs font-semibold text-neutral-500 dark:text-neutral-400 uppercase tracking-wider">Reason</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-200 dark:divide-neutral-700">
                {topAtRiskStudents.map((student) => (
                  <tr key={student.id} className="hover:bg-neutral-50 dark:hover:bg-neutral-700/30 transition-colors">
                    <td className="px-5 py-3">
                      <div className="flex items-center gap-3">
                        <div className={`w-8 h-8 rounded-lg flex items-center justify-center text-xs font-bold ${getRiskColor(student.riskLevel)}`}>
                          {getInitials(student.name)}
                        </div>
                        <div>
                          <p className="font-medium text-neutral-900 dark:text-neutral-100">{student.name}</p>
                          <p className="text-xs text-neutral-500 dark:text-neutral-400 font-mono">{student.rollNumber}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-5 py-3 text-neutral-600 dark:text-neutral-300">{student.department}</td>
                    <td className="px-5 py-3">
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-neutral-900 dark:text-neutral-100">{student.attendance}%</span>
                        <div className="w-16 h-1.5 bg-neutral-200 dark:bg-neutral-700 rounded-full overflow-hidden">
                          <div
                            className={`h-full ${student.attendance >= 75 ? 'bg-green-500' : student.attendance >= 65 ? 'bg-amber-500' : 'bg-red-500'}`}
                            style={{ width: `${student.attendance}%` }}
                          />
                        </div>
                      </div>
                    </td>
                    <td className="px-5 py-3 font-semibold text-neutral-900 dark:text-neutral-100">{student.avgPerformance}%</td>
                    <td className="px-5 py-3">
                      <RiskBadge level={student.riskLevel} size="sm" />
                    </td>
                    <td className="px-5 py-3 text-neutral-500 dark:text-neutral-400 text-xs max-w-xs truncate">{student.remarks}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Needs Attention Panel */}
        {needsAttentionStudents.length > 0 && (
          <div className="bg-gradient-to-r from-red-50 to-amber-50 dark:from-red-900/20 dark:to-amber-900/20 rounded-card border border-red-200 dark:border-red-800 p-5">
            <div className="flex items-center gap-2 mb-4">
              <AlertTriangle className="w-5 h-5 text-red-600" />
              <h3 className="text-base font-semibold text-neutral-900 dark:text-neutral-50">Needs Immediate Attention</h3>
              <span className="ml-auto px-2 py-0.5 bg-red-100 dark:bg-red-900/50 text-red-700 dark:text-red-300 text-xs font-bold rounded-full">
                {needsAttentionStudents.length} students
              </span>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {needsAttentionStudents.map((student) => (
                <div
                  key={student.id}
                  className="bg-white dark:bg-neutral-800 rounded-xl p-4 shadow-sm border border-neutral-200 dark:border-neutral-700"
                >
                  <div className="flex items-center gap-3 mb-3">
                    <div className={`w-10 h-10 rounded-lg flex items-center justify-center text-sm font-bold ${getRiskColor(student.riskLevel)}`}>
                      {getInitials(student.name)}
                    </div>
                    <div>
                      <p className="font-medium text-neutral-900 dark:text-neutral-100">{student.name}</p>
                      <p className="text-xs text-neutral-500 dark:text-neutral-400">{student.department}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4 text-sm mb-3">
                    <div>
                      <span className="text-neutral-500 dark:text-neutral-400">Attendance: </span>
                      <span className="font-semibold text-neutral-900 dark:text-neutral-100">{student.attendance}%</span>
                    </div>
                    <TrendIcon trend={student.trend} size="sm" />
                  </div>
                  <Link
                    to="/interventions"
                    className="w-full flex items-center justify-center gap-2 px-3 py-2 bg-primary-600 hover:bg-primary-700 text-white text-sm font-medium rounded-lg transition-colors"
                  >
                    <Target className="w-4 h-4" />
                    Create Intervention
                  </Link>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </MainLayout>
  )
}

interface QuickLinkProps {
  title: string
  description: string
  icon: React.ElementType
  href: string
}

const QuickLink: React.FC<QuickLinkProps> = ({ title, description, icon: Icon, href }) => {
  return (
    <Link
      to={href}
      className="bg-white dark:bg-neutral-800 p-5 rounded-card shadow-card border border-neutral-200/60 dark:border-neutral-700/60 hover:shadow-card-hover hover:-translate-y-0.5 transition-all group"
    >
      <div className="flex items-start justify-between">
        <div>
          <h3 className="text-base font-semibold text-neutral-900 dark:text-neutral-50 group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors">
            {title}
          </h3>
          <p className="text-sm text-neutral-500 dark:text-neutral-400 mt-1">
            {description}
          </p>
        </div>
        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary-500 to-primary-600 flex items-center justify-center shadow-sm">
          <Icon className="w-5 h-5 text-white" />
        </div>
      </div>
    </Link>
  )
}

export default Dashboard
