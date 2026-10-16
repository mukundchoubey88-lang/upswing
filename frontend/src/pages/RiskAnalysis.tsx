import React, { useState, useMemo } from 'react'
import { AlertTriangle, AlertCircle, CheckCircle2, Info, ChevronDown, ChevronUp } from 'lucide-react'
import MainLayout from '../layouts/MainLayout'
import studentService from '../services/studentService'
import { StudentRecord } from '../data/students'
import StatCard from '../components/common/StatCard'

const RiskAnalysis: React.FC = () => {
  const students = studentService.getStudents()
  const [rulesOpen, setRulesOpen] = useState(false)

  // Calculate stats
  const stats = useMemo(() => {
    const total = students.length
    const high = students.filter(s => s.riskLevel === 'High').length
    const medium = students.filter(s => s.riskLevel === 'Medium').length
    const low = students.filter(s => s.riskLevel === 'Low').length
    return { total, high, medium, low }
  }, [students])

  // Group students by risk level and sort by attendance (ascending)
  const studentsByRisk = useMemo(() => {
    return {
      High: students.filter(s => s.riskLevel === 'High').sort((a, b) => a.attendance - b.attendance),
      Medium: students.filter(s => s.riskLevel === 'Medium').sort((a, b) => a.attendance - b.attendance),
      Low: students.filter(s => s.riskLevel === 'Low').sort((a, b) => a.attendance - b.attendance),
    }
  }, [students])

  // Calculate risk score (0-100)
  const calculateRiskScore = (student: StudentRecord): number => {
    const score = Math.round(
      (100 - student.attendance) * 0.4 +
      (100 - student.avgPerformance) * 0.4 +
      student.failedSubjects * 5
    )
    return Math.min(score, 100)
  }

  // Get contributing factors
  const getContributingFactors = (student: StudentRecord) => {
    return [
      {
        label: 'Attendance',
        value: student.attendance,
        weight: (100 - student.attendance) * 0.4,
      },
      {
        label: 'Performance',
        value: student.avgPerformance,
        weight: (100 - student.avgPerformance) * 0.4,
      },
      {
        label: 'Failed Subjects',
        value: student.failedSubjects,
        weight: student.failedSubjects * 5,
      },
    ]
  }

  // Get bar color based on weight
  const getBarColor = (weight: number): string => {
    if (weight > 70) return 'bg-red-500'
    if (weight >= 40) return 'bg-amber-500'
    return 'bg-green-500'
  }

  // Get initials from name
  const getInitials = (name: string): string => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)
  }

  // Get risk level colors
  const getRiskColors = (level: 'High' | 'Medium' | 'Low') => {
    switch (level) {
      case 'High':
        return {
          bg: 'bg-red-100 dark:bg-red-900/30',
          text: 'text-red-700 dark:text-red-300',
          header: 'text-red-600 dark:text-red-400',
        }
      case 'Medium':
        return {
          bg: 'bg-amber-100 dark:bg-amber-900/30',
          text: 'text-amber-700 dark:text-amber-300',
          header: 'text-amber-600 dark:text-amber-400',
        }
      case 'Low':
        return {
          bg: 'bg-green-100 dark:bg-green-900/30',
          text: 'text-green-700 dark:text-green-300',
          header: 'text-green-600 dark:text-green-400',
        }
    }
  }

  // Get recommendation text
  const getRecommendation = (level: 'High' | 'Medium' | 'Low'): string => {
    switch (level) {
      case 'High':
        return 'Start tutoring + attendance plan'
      case 'Medium':
        return 'Monitor closely and provide support'
      case 'Low':
        return 'Keep up the good work'
    }
  }

  // Get recommendation colors
  const getRecommendationColors = (level: 'High' | 'Medium' | 'Low') => {
    switch (level) {
      case 'High':
        return 'bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-300'
      case 'Medium':
        return 'bg-amber-50 dark:bg-amber-900/20 text-amber-700 dark:text-amber-300'
      case 'Low':
        return 'bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-300'
    }
  }

  const highCount = stats.high
  const mediumCount = stats.medium
  const lowCount = stats.low
  const pct = stats.total > 0 ? Math.round((highCount / stats.total) * 100) : 0

  // Render a student card
  const renderStudentCard = (student: StudentRecord) => {
    const riskScore = calculateRiskScore(student)
    const factors = getContributingFactors(student)
    const colors = getRiskColors(student.riskLevel)

    return (
      <div
        key={student.id}
        className="bg-white dark:bg-neutral-700 rounded-lg shadow-sm border border-neutral-200/60 dark:border-neutral-600/60 p-4 cursor-pointer hover:shadow-md transition-shadow"
      >
        {/* Avatar row */}
        <div className="flex items-center gap-3 mb-3">
          <div className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold ${colors.bg} ${colors.text}`}>
            {getInitials(student.name)}
          </div>
          <div className="flex-1 min-w-0">
            <p className="font-semibold text-neutral-900 dark:text-neutral-100 truncate">{student.name}</p>
            <p className="text-xs text-neutral-500 dark:text-neutral-400">{student.department} • {student.year}</p>
          </div>
        </div>

        {/* Risk score gauge */}
        <div className="mb-3">
          <div className="flex items-center justify-between text-xs mb-1">
            <span className="text-neutral-500 dark:text-neutral-400">Risk Score</span>
            <span className={`font-bold ${
              riskScore > 70 ? 'text-red-600 dark:text-red-400' :
              riskScore >= 40 ? 'text-amber-600 dark:text-amber-400' :
              'text-green-600 dark:text-green-400'
            }`}>
              {riskScore}/100
            </span>
          </div>
          <div className="h-2 bg-neutral-200 dark:bg-neutral-600 rounded-full overflow-hidden">
            <div
              className={`h-full transition-all ${getBarColor(riskScore)}`}
              style={{ width: `${riskScore}%` }}
            />
          </div>
        </div>

        {/* Contributing factors */}
        <div className="space-y-2 mb-3">
          {factors.map((factor, idx) => (
            <div key={idx}>
              <div className="flex items-center justify-between text-xs mb-0.5">
                <span className="text-neutral-500 dark:text-neutral-400">{factor.label}</span>
                <span className="text-neutral-600 dark:text-neutral-300">
                  {factor.label === 'Failed Subjects' ? factor.value : `${factor.value}%`}
                </span>
              </div>
              <div className="h-1.5 bg-neutral-200 dark:bg-neutral-600 rounded-full overflow-hidden">
                <div
                  className={`h-full ${getBarColor(factor.weight)}`}
                  style={{ width: `${Math.min(factor.weight, 100)}%` }}
                />
              </div>
            </div>
          ))}
        </div>

        {/* Recommendation */}
        <div className={`text-xs p-2 rounded-lg ${getRecommendationColors(student.riskLevel)}`}>
          {getRecommendation(student.riskLevel)}
        </div>
      </div>
    )
  }

  // Render a risk column
  const renderRiskColumn = (
    level: 'High' | 'Medium' | 'Low',
    icon: React.ReactNode,
    count: number
  ) => {
    const colors = getRiskColors(level)
    const levelStudents = studentsByRisk[level]

    return (
      <div className="bg-white dark:bg-neutral-800 rounded-card shadow-card border border-neutral-200/60 dark:border-neutral-700/60">
        {/* Column header */}
        <div className={`p-4 border-b border-neutral-200/60 dark:border-neutral-700/60 ${colors.header}`}>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              {icon}
              <span className="font-semibold">{level} Risk</span>
            </div>
            <span className="text-sm font-medium">{count} students</span>
          </div>
        </div>

        {/* Student list */}
        <div className="max-h-[600px] overflow-y-auto space-y-3 p-4">
          {levelStudents.length === 0 ? (
            <div className="text-center py-8 text-neutral-500 dark:text-neutral-400 text-sm">
              No students in this category
            </div>
          ) : (
            levelStudents.map(student => renderStudentCard(student))
          )}
        </div>
      </div>
    )
  }

  return (
    <MainLayout>
      <div className="space-y-5 page-enter">
        {/* Page header */}
        <div>
          <h1 className="text-3xl font-bold text-neutral-900 dark:text-neutral-50">
            Risk Analysis
          </h1>
          <p className="text-neutral-500 dark:text-neutral-400 mt-2">
            Identify and analyze at-risk students
          </p>
        </div>

        {/* Summary strip */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <StatCard
            title="High Risk"
            value={highCount}
            icon={AlertTriangle}
            color="red"
            trend={`${pct}%`}
            trendLabel="of total students"
          />
          <StatCard
            title="Medium Risk"
            value={mediumCount}
            icon={AlertCircle}
            color="amber"
          />
          <StatCard
            title="Low Risk"
            value={lowCount}
            icon={CheckCircle2}
            color="green"
          />
        </div>

        {/* Three-column layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
          {renderRiskColumn(
            'High',
            <AlertTriangle className="w-5 h-5" />,
            highCount
          )}
          {renderRiskColumn(
            'Medium',
            <AlertCircle className="w-5 h-5" />,
            mediumCount
          )}
          {renderRiskColumn(
            'Low',
            <CheckCircle2 className="w-5 h-5" />,
            lowCount
          )}
        </div>

        {/* Classification rules panel */}
        <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-card">
          <button
            onClick={() => setRulesOpen(!rulesOpen)}
            className="w-full p-4 flex items-center justify-between text-left"
          >
            <div className="flex items-center gap-2">
              <Info className="w-5 h-5 text-blue-600 dark:text-blue-400" />
              <span className="font-semibold text-blue-800 dark:text-blue-200">Classification Rules</span>
            </div>
            {rulesOpen ? (
              <ChevronUp className="w-5 h-5 text-blue-600 dark:text-blue-400" />
            ) : (
              <ChevronDown className="w-5 h-5 text-blue-600 dark:text-blue-400" />
            )}
          </button>
          {rulesOpen && (
            <div className="px-4 pb-4 text-sm text-blue-800 dark:text-blue-200">
              <ul className="space-y-2">
                <li>
                  <span className="font-medium text-red-600 dark:text-red-400">High Risk:</span>{' '}
                  Attendance &lt; 65% OR Avg Performance &lt; 65% OR Failed Subjects ≥ 3 AND Trend is not 'Improving'
                </li>
                <li>
                  <span className="font-medium text-amber-600 dark:text-amber-400">Medium Risk:</span>{' '}
                  Attendance &lt; 75% OR Avg Performance &lt; 75% OR Failed Subjects ≥ 2
                </li>
                <li>
                  <span className="font-medium text-green-600 dark:text-green-400">Low Risk:</span>{' '}
                  All other students
                </li>
              </ul>
            </div>
          )}
        </div>
      </div>
    </MainLayout>
  )
}

export default RiskAnalysis
