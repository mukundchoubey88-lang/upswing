import React from 'react'
import { Link } from 'react-router-dom'
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell
} from 'recharts'
import {
  Mail,
  Phone,
  Calendar,
  BookOpen,
  AlertTriangle,
  Target,
  TrendingUp,
  TrendingDown,
  Minus,
  ExternalLink
} from 'lucide-react'
import Drawer from '../common/Drawer'
import RiskBadge from '../common/RiskBadge'
import { StudentRecord } from '../../data/students'

interface StudentDetailDrawerProps {
  student: StudentRecord | null
  open: boolean
  onClose: () => void
}

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

const getTrendIcon = (trend: string) => {
  switch (trend) {
    case 'Improving':
      return <TrendingUp className="w-4 h-4 text-green-600" />
    case 'Declining':
      return <TrendingDown className="w-4 h-4 text-red-600" />
    default:
      return <Minus className="w-4 h-4 text-gray-500" />
  }
}

const StudentDetailDrawer: React.FC<StudentDetailDrawerProps> = ({ student, open, onClose }) => {
  if (!student) return null

  const subjectData = [
    { subject: 'Math', score: student.mathScore, color: '#3b82f6' },
    { subject: 'Programming', score: student.programmingScore, color: '#8b5cf6' },
    { subject: 'AI/ML', score: student.aimlScore, color: '#06b6d4' },
  ]

  const getWhyFlagged = (): string[] => {
    const reasons: string[] = []
    if (student.attendance < 65) {
      reasons.push(`Attendance ${student.attendance}%, below 65% threshold`)
    }
    if (student.avgPerformance < 65) {
      reasons.push(`Avg Performance ${student.avgPerformance}%, below 65% threshold`)
    }
    if (student.failedSubjects > 0) {
      reasons.push(`${student.failedSubjects} failed subject${student.failedSubjects > 1 ? 's' : ''}`)
    }
    if (student.trend === 'Declining') {
      reasons.push('Trend: Declining')
    }
    if (reasons.length === 0) {
      reasons.push('Student is on track')
    }
    return reasons
  }

  const attendancePercentage = student.attendance
  const attendanceColor = attendancePercentage >= 75 ? 'bg-green-500' : attendancePercentage >= 65 ? 'bg-amber-500' : 'bg-red-500'

  return (
    <Drawer open={open} onClose={onClose} title="Student Details" width="lg">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-start gap-4">
          <div
            className={`w-14 h-14 rounded-xl flex items-center justify-center text-lg font-bold ${getRiskColor(
              student.riskLevel
            )}`}
          >
            {getInitials(student.name)}
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-2">
              <h2 className="text-xl font-bold text-neutral-900 dark:text-neutral-50">
                {student.name}
              </h2>
              <RiskBadge level={student.riskLevel} size="sm" />
            </div>
            <p className="text-sm text-neutral-500 dark:text-neutral-400 font-mono mt-0.5">
              {student.rollNumber}
            </p>
            <div className="flex items-center gap-2 mt-2">
              {getTrendIcon(student.trend)}
              <span className="text-sm text-neutral-600 dark:text-neutral-400">{student.trend}</span>
            </div>
          </div>
        </div>

        {/* Profile Info Grid */}
        <div className="grid grid-cols-2 gap-3">
          <div className="bg-neutral-50 dark:bg-neutral-700/30 rounded-lg p-3">
            <p className="text-xs text-neutral-500 dark:text-neutral-400">Department</p>
            <p className="text-sm font-medium text-neutral-900 dark:text-neutral-100">{student.department}</p>
          </div>
          <div className="bg-neutral-50 dark:bg-neutral-700/30 rounded-lg p-3">
            <p className="text-xs text-neutral-500 dark:text-neutral-400">Year / Section</p>
            <p className="text-sm font-medium text-neutral-900 dark:text-neutral-100">
              {student.year} ({student.section})
            </p>
          </div>
          <div className="bg-neutral-50 dark:bg-neutral-700/30 rounded-lg p-3 flex items-center gap-2">
            <Mail className="w-4 h-4 text-neutral-400" />
            <p className="text-sm text-neutral-600 dark:text-neutral-300 truncate">{student.email}</p>
          </div>
          <div className="bg-neutral-50 dark:bg-neutral-700/30 rounded-lg p-3 flex items-center gap-2">
            <Phone className="w-4 h-4 text-neutral-400" />
            <p className="text-sm text-neutral-600 dark:text-neutral-300">{student.phone}</p>
          </div>
        </div>

        {/* Subject Scores Chart */}
        <div className="bg-neutral-50 dark:bg-neutral-700/30 rounded-xl p-4">
          <h3 className="text-sm font-semibold text-neutral-900 dark:text-neutral-100 mb-3">
            Subject Scores
          </h3>
          <div className="h-40">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={subjectData} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} />
                <XAxis type="number" domain={[0, 100]} tick={{ fontSize: 12 }} />
                <YAxis type="category" dataKey="subject" tick={{ fontSize: 12 }} width={80} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'white',
                    border: '1px solid #e5e5e5',
                    borderRadius: '8px',
                  }}
                />
                <Bar dataKey="score" radius={[0, 4, 4, 0]}>
                  {subjectData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
          <div className="flex justify-between mt-2 text-sm">
            <span className="text-neutral-500 dark:text-neutral-400">Avg Performance</span>
            <span className="font-semibold text-neutral-900 dark:text-neutral-100">
              {student.avgPerformance}%
            </span>
          </div>
        </div>

        {/* Attendance Section */}
        <div className="space-y-3">
          <h3 className="text-sm font-semibold text-neutral-900 dark:text-neutral-100">Attendance</h3>
          <div className="flex items-center gap-3">
            <div className="flex-1">
              <div className="h-2 bg-neutral-200 dark:bg-neutral-700 rounded-full overflow-hidden">
                <div
                  className={`h-full ${attendanceColor} transition-all`}
                  style={{ width: `${attendancePercentage}%` }}
                />
              </div>
            </div>
            <span className="text-sm font-semibold text-neutral-900 dark:text-neutral-100">
              {student.attendance}%
            </span>
          </div>
          <div className="grid grid-cols-3 gap-2">
            <div className="bg-green-50 dark:bg-green-900/20 rounded-lg p-2 text-center">
              <Calendar className="w-4 h-4 text-green-600 mx-auto" />
              <p className="text-lg font-bold text-green-700 dark:text-green-400">{student.daysPresent}</p>
              <p className="text-xs text-green-600 dark:text-green-500">Present</p>
            </div>
            <div className="bg-red-50 dark:bg-red-900/20 rounded-lg p-2 text-center">
              <Calendar className="w-4 h-4 text-red-600 mx-auto" />
              <p className="text-lg font-bold text-red-700 dark:text-red-400">{student.daysAbsent}</p>
              <p className="text-xs text-red-600 dark:text-red-500">Absent</p>
            </div>
            <div className="bg-amber-50 dark:bg-amber-900/20 rounded-lg p-2 text-center">
              <Calendar className="w-4 h-4 text-amber-600 mx-auto" />
              <p className="text-lg font-bold text-amber-700 dark:text-amber-400">{student.lateCount}</p>
              <p className="text-xs text-amber-600 dark:text-amber-500">Late</p>
            </div>
          </div>
        </div>

        {/* Risk Section */}
        <div className="space-y-3">
          <h3 className="text-sm font-semibold text-neutral-900 dark:text-neutral-100">Risk Factors</h3>
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2">
              <BookOpen className="w-4 h-4 text-neutral-400" />
              <span className="text-sm text-neutral-600 dark:text-neutral-400">Failed Subjects:</span>
              <span
                className={`text-sm font-semibold ${
                  student.failedSubjects >= 3
                    ? 'text-red-600'
                    : student.failedSubjects > 0
                    ? 'text-amber-600'
                    : 'text-green-600'
                }`}
              >
                {student.failedSubjects}
              </span>
            </div>
          </div>
        </div>

        {/* Why Flagged */}
        <div
          className={`rounded-xl p-4 ${
            student.riskLevel === 'High'
              ? 'bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800'
              : student.riskLevel === 'Medium'
              ? 'bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800'
              : 'bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800'
          }`}
        >
          <div className="flex items-start gap-2">
            <AlertTriangle
              className={`w-5 h-5 mt-0.5 ${
                student.riskLevel === 'High'
                  ? 'text-red-600'
                  : student.riskLevel === 'Medium'
                  ? 'text-amber-600'
                  : 'text-green-600'
              }`}
            />
            <div>
              <h4 className="text-sm font-semibold text-neutral-900 dark:text-neutral-100">Why Flagged</h4>
              <ul className="mt-1 space-y-1">
                {getWhyFlagged().map((reason, i) => (
                  <li key={i} className="text-sm text-neutral-600 dark:text-neutral-300">
                    • {reason}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* Remarks */}
        {student.remarks && (
          <div className="bg-blue-50 dark:bg-blue-900/20 rounded-xl p-4 border border-blue-200 dark:border-blue-800">
            <h4 className="text-sm font-semibold text-neutral-900 dark:text-neutral-100 mb-1">Remarks</h4>
            <p className="text-sm text-neutral-600 dark:text-neutral-300">{student.remarks}</p>
          </div>
        )}

        {/* Actions */}
        <div className="flex gap-3 pt-2">
          <Link
            to={`/students/${student.id}`}
            onClick={onClose}
            className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 bg-primary-600 hover:bg-primary-700 text-white font-medium text-sm rounded-lg transition-colors"
          >
            View Full Profile
            <ExternalLink className="w-4 h-4" />
          </Link>
          {(student.riskLevel === 'High' || student.riskLevel === 'Medium') && (
            <Link
              to="/interventions"
              onClick={onClose}
              className="flex items-center gap-2 px-4 py-2.5 bg-neutral-100 dark:bg-neutral-700 hover:bg-neutral-200 dark:hover:bg-neutral-600 text-neutral-700 dark:text-neutral-200 font-medium text-sm rounded-lg transition-colors"
            >
              <Target className="w-4 h-4" />
              Create Intervention
            </Link>
          )}
        </div>
      </div>
    </Drawer>
  )
}

export default StudentDetailDrawer
