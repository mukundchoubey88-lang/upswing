import React, { useState, useMemo } from 'react'
import { Link } from 'react-router-dom'
import { AlertTriangle, Target, Info, Users, TrendingUp, TrendingDown, Minus } from 'lucide-react'
import MainLayout from '../layouts/MainLayout'
import studentService from '../services/studentService'
import { StudentRecord } from '../data/students'
import StatCard from '../components/common/StatCard'

const RiskAnalysis: React.FC = () => {
  const students = studentService.getStudents()
  const [activeTab, setActiveTab] = useState<'High' | 'Medium' | 'Low'>('High')

  // Calculate stats
  const stats = useMemo(() => {
    const total = students.length
    const high = students.filter(s => s.riskLevel === 'High').length
    const medium = students.filter(s => s.riskLevel === 'Medium').length
    const low = students.filter(s => s.riskLevel === 'Low').length
    return { total, high, medium, low }
  }, [students])

  // Group students by risk level and sort by attendance
  const studentsByRisk = useMemo(() => {
    return {
      High: students.filter(s => s.riskLevel === 'High').sort((a, b) => a.attendance - b.attendance),
      Medium: students.filter(s => s.riskLevel === 'Medium').sort((a, b) => a.attendance - b.attendance),
      Low: students.filter(s => s.riskLevel === 'Low').sort((a, b) => a.attendance - b.attendance),
    }
  }, [students])

  // Calculate risk score (0-100)
  const calculateRiskScore = (student: StudentRecord): number => {
    const attendanceImpact = (100 - student.attendance) * 0.4
    const performanceImpact = (100 - student.avgPerformance) * 0.35
    const failedImpact = Math.min(student.failedSubjects * 5, 25)
    const trendImpact = student.trend === 'Declining' ? 10 : student.trend === 'Stable' ? 5 : 0
    return Math.min(Math.round(attendanceImpact + performanceImpact + failedImpact + trendImpact), 100)
  }

  // Get contributing factors
  const getContributingFactors = (student: StudentRecord) => {
    const factors = []
    factors.push({
      label: 'Attendance',
      value: ((100 - student.attendance) * 0.4).toFixed(1),
      color: student.attendance < 65 ? 'bg-red-500' : student.attendance < 75 ? 'bg-amber-500' : 'bg-green-500'
    })
    factors.push({
      label: 'Performance',
      value: ((100 - student.avgPerformance) * 0.35).toFixed(1),
      color: student.avgPerformance < 65 ? 'bg-red-500' : student.avgPerformance < 75 ? 'bg-amber-500' : 'bg-green-500'
    })
    factors.push({
      label: 'Failed Subjects',
      value: Math.min(student.failedSubjects * 5, 25).toFixed(1),
      color: student.failedSubjects >= 3 ? 'bg-red-500' : student.failedSubjects > 0 ? 'bg-amber-500' : 'bg-green-500'
    })
    return factors
  }

  // Get recommended action
  const getRecommendedAction = (riskLevel: string): string => {
    switch (riskLevel) {
      case 'High':
        return 'Immediate intervention required'
      case 'Medium':
        return 'Monitor and provide additional support'
      default:
        return 'Continue current approach'
    }
  }

  const getInitials = (name: string): string => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)
  }

  const getRiskBgColor = (level: string): string => {
    switch (level) {
      case 'High': return 'bg-red-100 dark:bg-red-900/30'
      case 'Medium': return 'bg-amber-100 dark:bg-amber-900/30'
      default: return 'bg-green-100 dark:bg-green-900/30'
    }
  }

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'Improving': return <TrendingUp className="w-4 h-4 text-green-600" />
      case 'Declining': return <TrendingDown className="w-4 h-4 text-red-600" />
      default: return <Minus className="w-4 h-4 text-gray-500" />
    }
  }

  return (
    <MainLayout>
      <div className="space-y-5 page-enter">
        <div>
          <h1 className="text-3xl font-bold text-neutral-900 dark:text-neutral-50">
            Risk Analysis
          </h1>
          <p className="text-neutral-500 dark:text-neutral-400 mt-2">
            Student academic risk assessment and classification
          </p>
        </div>

        {/* Classification Rules Banner */}
        <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-card p-4">
          <div className="flex items-start gap-3">
            <Info className="w-5 h-5 text-blue-600 dark:text-blue-400 mt-0.5" />
            <div className="text-sm text-blue-800 dark:text-blue-200">
              <p className="font-semibold mb-2">Classification Rules:</p>
              <ul className="space-y-1 text-blue-700 dark:text-blue-300">
                <li><span className="font-medium text-red-600">High Risk:</span> attendance below 65% OR avg performance below 65 OR 3+ failed subjects</li>
                <li><span className="font-medium text-amber-600">Medium Risk:</span> attendance 65-75% OR avg performance 65-75 OR 1-2 failed subjects</li>
                <li><span className="font-medium text-green-600">Low Risk:</span> attendance 75%+ AND avg performance 75%+ AND 0 failed subjects</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Summary Strip */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <StatCard
            title="High Risk Students"
            value={stats.high}
            icon={AlertTriangle}
            color="red"
            trend={`${((stats.high / stats.total) * 100).toFixed(0)}%`}
            trendLabel="of total"
          />
          <StatCard
            title="Medium Risk Students"
            value={stats.medium}
            icon={Info}
            color="amber"
            trend={`${((stats.medium / stats.total) * 100).toFixed(0)}%`}
            trendLabel="of total"
          />
          <StatCard
            title="Low Risk Students"
            value={stats.low}
            icon={Users}
            color="green"
            trend={`${((stats.low / stats.total) * 100).toFixed(0)}%`}
            trendLabel="of total"
          />
        </div>

        {/* Tabs */}
        <div className="border-b border-neutral-200 dark:border-neutral-700">
          <div className="flex gap-4">
            {(['High', 'Medium', 'Low'] as const).map((level) => (
              <button
                key={level}
                onClick={() => setActiveTab(level)}
                className={`pb-3 px-1 text-sm font-medium border-b-2 transition-colors ${
                  activeTab === level
                    ? level === 'High'
                      ? 'border-red-500 text-red-600 dark:text-red-400'
                      : level === 'Medium'
                      ? 'border-amber-500 text-amber-600 dark:text-amber-400'
                      : 'border-green-500 text-green-600 dark:text-green-400'
                    : 'border-transparent text-neutral-500 hover:text-neutral-700 dark:hover:text-neutral-300'
                }`}
              >
                {level} Risk ({studentsByRisk[level].length})
              </button>
            ))}
          </div>
        </div>

        {/* Student Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {studentsByRisk[activeTab].length === 0 ? (
            <div className="col-span-full text-center py-12 text-neutral-500">
              No students in this risk category.
            </div>
          ) : (
            studentsByRisk[activeTab].map((student) => {
              const riskScore = calculateRiskScore(student)
              const factors = getContributingFactors(student)

              return (
                <div
                  key={student.id}
                  className="bg-white dark:bg-neutral-800 rounded-card shadow-card border border-neutral-200/60 dark:border-neutral-700/60 p-4 hover:shadow-card-hover transition-shadow"
                >
                  {/* Header */}
                  <div className="flex items-center gap-3 mb-4">
                    <div className={`w-10 h-10 rounded-lg flex items-center justify-center text-sm font-bold ${getRiskBgColor(student.riskLevel)}`}>
                      {getInitials(student.name)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-neutral-900 dark:text-neutral-100 truncate">{student.name}</p>
                      <p className="text-xs text-neutral-500 dark:text-neutral-400">{student.department} • {student.year}</p>
                    </div>
                    {getTrendIcon(student.trend)}
                  </div>

                  {/* Risk Score Gauge */}
                  <div className="mb-4">
                    <div className="flex items-center justify-between text-xs mb-1">
                      <span className="text-neutral-500 dark:text-neutral-400">Risk Score</span>
                      <span className={`font-bold ${
                        riskScore >= 70 ? 'text-red-600' : riskScore >= 40 ? 'text-amber-600' : 'text-green-600'
                      }`}>
                        {riskScore}/100
                      </span>
                    </div>
                    <div className="h-2 bg-neutral-200 dark:bg-neutral-700 rounded-full overflow-hidden">
                      <div
                        className={`h-full transition-all ${
                          riskScore >= 70 ? 'bg-red-500' : riskScore >= 40 ? 'bg-amber-500' : 'bg-green-500'
                        }`}
                        style={{ width: `${riskScore}%` }}
                      />
                    </div>
                  </div>

                  {/* Contributing Factors */}
                  <div className="space-y-2 mb-4">
                    {factors.map((factor, idx) => (
                      <div key={idx}>
                        <div className="flex items-center justify-between text-xs mb-0.5">
                          <span className="text-neutral-500 dark:text-neutral-400">{factor.label}</span>
                          <span className="text-neutral-600 dark:text-neutral-300">{factor.value}</span>
                        </div>
                        <div className="h-1.5 bg-neutral-200 dark:bg-neutral-700 rounded-full overflow-hidden">
                          <div
                            className={`h-full ${factor.color}`}
                            style={{ width: `${Math.min(parseFloat(factor.value) * 4, 100)}%` }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Stats */}
                  <div className="grid grid-cols-3 gap-2 mb-4 text-center">
                    <div className="bg-neutral-50 dark:bg-neutral-700/30 rounded-lg p-2">
                      <p className="text-xs text-neutral-500 dark:text-neutral-400">Attendance</p>
                      <p className="text-sm font-semibold text-neutral-900 dark:text-neutral-100">{student.attendance}%</p>
                    </div>
                    <div className="bg-neutral-50 dark:bg-neutral-700/30 rounded-lg p-2">
                      <p className="text-xs text-neutral-500 dark:text-neutral-400">Performance</p>
                      <p className="text-sm font-semibold text-neutral-900 dark:text-neutral-100">{student.avgPerformance}%</p>
                    </div>
                    <div className="bg-neutral-50 dark:bg-neutral-700/30 rounded-lg p-2">
                      <p className="text-xs text-neutral-500 dark:text-neutral-400">Failed</p>
                      <p className="text-sm font-semibold text-neutral-900 dark:text-neutral-100">{student.failedSubjects}</p>
                    </div>
                  </div>

                  {/* Recommended Action */}
                  <div className={`text-xs p-2 rounded-lg ${
                    student.riskLevel === 'High'
                      ? 'bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-300'
                      : student.riskLevel === 'Medium'
                      ? 'bg-amber-50 dark:bg-amber-900/20 text-amber-700 dark:text-amber-300'
                      : 'bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-300'
                  }`}>
                    <span className="font-medium">Recommendation:</span> {getRecommendedAction(student.riskLevel)}
                  </div>

                  {/* Action Button */}
                  {(student.riskLevel === 'High' || student.riskLevel === 'Medium') && (
                    <Link
                      to="/interventions"
                      className="mt-3 w-full flex items-center justify-center gap-2 px-3 py-2 bg-primary-600 hover:bg-primary-700 text-white text-sm font-medium rounded-lg transition-colors"
                    >
                      <Target className="w-4 h-4" />
                      Create Intervention
                    </Link>
                  )}
                </div>
              )
            })
          )}
        </div>
      </div>
    </MainLayout>
  )
}

export default RiskAnalysis
