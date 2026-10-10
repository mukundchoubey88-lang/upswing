import React, { useState } from 'react'
import { Target, Plus, Calendar, Clock, CheckCircle2, Circle, Trash2, X } from 'lucide-react'
import MainLayout from '../layouts/MainLayout'
import studentService from '../services/studentService'
import { useInterventionsStore, Intervention } from '../store/interventionsStore'
import RiskBadge from '../components/common/RiskBadge'
import StatCard from '../components/common/StatCard'
import EmptyState from '../components/common/EmptyState'

const Interventions: React.FC = () => {
  const { interventions, addIntervention, updateStatus, deleteIntervention } = useInterventionsStore()
  const students = studentService.getStudents()
  
  const [showForm, setShowForm] = useState(false)
  const [statusFilter, setStatusFilter] = useState<string>('')
  const [priorityFilter, setPriorityFilter] = useState<string>('')
  const [searchQuery, setSearchQuery] = useState('')
  const [formData, setFormData] = useState({
    studentId: '',
    type: 'Academic Mentoring' as Intervention['type'],
    notes: '',
    dueDate: '',
    priority: 'Medium' as Intervention['priority'],
    assignedTo: 'Admin',
  })

  // Stats
  const totalInterventions = interventions.length
  const plannedCount = interventions.filter(i => i.status === 'Planned').length
  const inProgressCount = interventions.filter(i => i.status === 'In Progress').length
  const completedCount = interventions.filter(i => i.status === 'Completed').length

  // Filter interventions
  const filteredInterventions = interventions.filter(i => {
    if (statusFilter && i.status !== statusFilter) return false
    if (priorityFilter && i.priority !== priorityFilter) return false
    if (searchQuery && !i.studentName.toLowerCase().includes(searchQuery.toLowerCase())) return false
    return true
  })

  // Sort by priority and due date
  const sortedInterventions = [...filteredInterventions].sort((a, b) => {
    const priorityOrder = { High: 0, Medium: 1, Low: 2 }
    if (priorityOrder[a.priority] !== priorityOrder[b.priority]) {
      return priorityOrder[a.priority] - priorityOrder[b.priority]
    }
    return new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime()
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const student = students.find(s => s.id === parseInt(formData.studentId))
    if (!student) return

    addIntervention({
      studentId: student.id,
      studentName: student.name,
      type: formData.type,
      notes: formData.notes,
      dueDate: formData.dueDate,
      priority: formData.priority,
      assignedTo: formData.assignedTo,
      status: 'Planned',
    })

    setFormData({
      studentId: '',
      type: 'Academic Mentoring',
      notes: '',
      dueDate: '',
      priority: 'Medium',
      assignedTo: 'Admin',
    })
    setShowForm(false)
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'High':
        return 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'
      case 'Medium':
        return 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400'
      default:
        return 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
    }
  }

  const getStudentRisk = (studentId: number) => {
    const student = students.find(s => s.id === studentId)
    return student?.riskLevel || 'Low'
  }

  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)
  }

  const getRiskBgColor = (level: string) => {
    switch (level) {
      case 'High': return 'bg-red-100 dark:bg-red-900/30'
      case 'Medium': return 'bg-amber-100 dark:bg-amber-900/30'
      default: return 'bg-green-100 dark:bg-green-900/30'
    }
  }

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr)
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
  }

  const isOverdue = (dateStr: string, status: string) => {
    if (status === 'Completed') return false
    return new Date(dateStr) < new Date()
  }

  return (
    <MainLayout>
      <div className="space-y-6 page-enter">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-neutral-900 dark:text-neutral-50">
              Interventions
            </h1>
            <p className="text-neutral-500 dark:text-neutral-400 mt-2">
              Create and track student interventions
            </p>
          </div>
          <button
            onClick={() => setShowForm(true)}
            className="flex items-center gap-2 px-4 py-2.5 bg-primary-600 hover:bg-primary-700 text-white font-medium text-sm rounded-lg transition-colors"
          >
            <Plus className="w-4 h-4" />
            Create Intervention
          </button>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <StatCard
            title="Total Interventions"
            value={totalInterventions}
            icon={Target}
            color="blue"
          />
          <StatCard
            title="Planned"
            value={plannedCount}
            icon={Clock}
            color="amber"
          />
          <StatCard
            title="In Progress"
            value={inProgressCount}
            icon={Circle}
            color="blue"
          />
          <StatCard
            title="Completed"
            value={completedCount}
            icon={CheckCircle2}
            color="green"
          />
        </div>

        {/* Filters */}
        <div className="bg-white dark:bg-neutral-800 rounded-card shadow-card border border-neutral-200/60 dark:border-neutral-700/60 p-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <input
              type="search"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by student name..."
              className="px-4 py-2 border border-neutral-300 dark:border-neutral-600 rounded-lg bg-white dark:bg-neutral-700 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
            />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-4 py-2 border border-neutral-300 dark:border-neutral-600 rounded-lg bg-white dark:bg-neutral-700 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
            >
              <option value="">All Statuses</option>
              <option value="Planned">Planned</option>
              <option value="In Progress">In Progress</option>
              <option value="Completed">Completed</option>
            </select>
            <select
              value={priorityFilter}
              onChange={(e) => setPriorityFilter(e.target.value)}
              className="px-4 py-2 border border-neutral-300 dark:border-neutral-600 rounded-lg bg-white dark:bg-neutral-700 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
            >
              <option value="">All Priorities</option>
              <option value="High">High</option>
              <option value="Medium">Medium</option>
              <option value="Low">Low</option>
            </select>
          </div>
        </div>

        {/* Interventions List */}
        <div className="space-y-3">
          {sortedInterventions.length === 0 ? (
            <EmptyState
              icon={Target}
              title="No interventions found"
              description="Create your first intervention or adjust filters."
            />
          ) : (
            sortedInterventions.map((intervention) => {
              const studentRisk = getStudentRisk(intervention.studentId)
              const overdue = isOverdue(intervention.dueDate, intervention.status)

              return (
                <div
                  key={intervention.id}
                  className={`bg-white dark:bg-neutral-800 rounded-card shadow-card border ${
                    overdue ? 'border-red-300 dark:border-red-800' : 'border-neutral-200/60 dark:border-neutral-700/60'
                  } p-4 hover:shadow-card-hover transition-shadow`}
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex items-start gap-3 flex-1">
                      <div className={`w-10 h-10 rounded-lg flex items-center justify-center text-sm font-bold ${getRiskBgColor(studentRisk)}`}>
                        {getInitials(intervention.studentName)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <p className="font-semibold text-neutral-900 dark:text-neutral-100">{intervention.studentName}</p>
                          <RiskBadge level={studentRisk} size="sm" />
                          <span className={`px-2 py-0.5 text-xs font-medium rounded-full ${getPriorityColor(intervention.priority)}`}>
                            {intervention.priority}
                          </span>
                        </div>
                        <p className="text-sm text-neutral-600 dark:text-neutral-400 mt-1">
                          <span className="font-medium text-primary-600 dark:text-primary-400">{intervention.type}</span>
                          {intervention.notes && ` - ${intervention.notes}`}
                        </p>
                        <div className="flex items-center gap-4 mt-2 text-xs text-neutral-500 dark:text-neutral-400">
                          <span className="flex items-center gap-1">
                            <Calendar className="w-3 h-3" />
                            {formatDate(intervention.dueDate)}
                            {overdue && <span className="text-red-500 font-medium ml-1">(Overdue)</span>}
                          </span>
                          <span>Assigned to: {intervention.assignedTo}</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <select
                        value={intervention.status}
                        onChange={(e) => updateStatus(intervention.id, e.target.value as Intervention['status'])}
                        className={`text-xs font-medium px-2 py-1 rounded-lg border ${
                          intervention.status === 'Completed'
                            ? 'bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-400 border-green-200 dark:border-green-800'
                            : intervention.status === 'In Progress'
                            ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-400 border-blue-200 dark:border-blue-800'
                            : 'bg-neutral-50 dark:bg-neutral-700 text-neutral-600 dark:text-neutral-300 border-neutral-200 dark:border-neutral-600'
                        }`}
                      >
                        <option value="Planned">Planned</option>
                        <option value="In Progress">In Progress</option>
                        <option value="Completed">Completed</option>
                      </select>
                      <button
                        onClick={() => deleteIntervention(intervention.id)}
                        className="p-1.5 text-neutral-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                        title="Delete"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              )
            })
          )}
        </div>
      </div>

      {/* Create Intervention Modal */}
      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/50" onClick={() => setShowForm(false)} />
          <div className="relative bg-white dark:bg-neutral-800 rounded-card shadow-xl max-w-md w-full p-6 z-10">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-neutral-900 dark:text-neutral-100">Create Intervention</h2>
              <button onClick={() => setShowForm(false)} className="text-neutral-400 hover:text-neutral-600">
                <X className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1">Student</label>
                <select
                  value={formData.studentId}
                  onChange={(e) => setFormData({ ...formData, studentId: e.target.value })}
                  required
                  className="w-full px-4 py-2 border border-neutral-300 dark:border-neutral-600 rounded-lg bg-white dark:bg-neutral-700 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
                >
                  <option value="">Select student</option>
                  {students.map(s => (
                    <option key={s.id} value={s.id}>{s.name} ({s.rollNumber})</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1">Intervention Type</label>
                <select
                  value={formData.type}
                  onChange={(e) => setFormData({ ...formData, type: e.target.value as Intervention['type'] })}
                  className="w-full px-4 py-2 border border-neutral-300 dark:border-neutral-600 rounded-lg bg-white dark:bg-neutral-700 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
                >
                  <option value="Attendance Counseling">Attendance Counseling</option>
                  <option value="Academic Mentoring">Academic Mentoring</option>
                  <option value="Parent Meeting">Parent Meeting</option>
                  <option value="Extra Tutoring">Extra Tutoring</option>
                  <option value="Performance Monitoring">Performance Monitoring</option>
                  <option value="Other">Other</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1">Notes</label>
                <textarea
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  rows={3}
                  className="w-full px-4 py-2 border border-neutral-300 dark:border-neutral-600 rounded-lg bg-white dark:bg-neutral-700 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
                  placeholder="Add details about the intervention..."
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1">Due Date</label>
                  <input
                    type="date"
                    value={formData.dueDate}
                    onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
                    required
                    className="w-full px-4 py-2 border border-neutral-300 dark:border-neutral-600 rounded-lg bg-white dark:bg-neutral-700 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1">Priority</label>
                  <select
                    value={formData.priority}
                    onChange={(e) => setFormData({ ...formData, priority: e.target.value as Intervention['priority'] })}
                    className="w-full px-4 py-2 border border-neutral-300 dark:border-neutral-600 rounded-lg bg-white dark:bg-neutral-700 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
                  >
                    <option value="High">High</option>
                    <option value="Medium">Medium</option>
                    <option value="Low">Low</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1">Assigned To</label>
                <select
                  value={formData.assignedTo}
                  onChange={(e) => setFormData({ ...formData, assignedTo: e.target.value })}
                  className="w-full px-4 py-2 border border-neutral-300 dark:border-neutral-600 rounded-lg bg-white dark:bg-neutral-700 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
                >
                  <option value="Admin">Admin</option>
                  <option value="Teacher">Teacher</option>
                  <option value="Mentor">Mentor</option>
                  <option value="Counselor">Counselor</option>
                </select>
              </div>
              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowForm(false)}
                  className="flex-1 px-4 py-2 border border-neutral-300 dark:border-neutral-600 rounded-lg text-neutral-700 dark:text-neutral-300 font-medium text-sm hover:bg-neutral-100 dark:hover:bg-neutral-700 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 px-4 py-2 bg-primary-600 hover:bg-primary-700 text-white font-medium text-sm rounded-lg transition-colors"
                >
                  Create Intervention
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </MainLayout>
  )
}

export default Interventions
