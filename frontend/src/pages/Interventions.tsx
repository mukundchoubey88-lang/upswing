import React, { useState, useEffect } from 'react'
import { Target, Plus, Calendar, Clock, CheckCircle2, Circle, Trash2, X } from 'lucide-react'
import { useInterventionsStore, Intervention } from '../store/interventionsStore'
import { studentService } from '../services/studentService'
import { StudentRecord } from '../data/students'
import StatCard from '../components/common/StatCard'
import RiskBadge from '../components/common/RiskBadge'
import EmptyState from '../components/common/EmptyState'

const Interventions: React.FC = () => {
  const { interventions, addIntervention, updateStatus, deleteIntervention, initializeInterventions } = useInterventionsStore()
  const [students, setStudents] = useState<StudentRecord[]>([])
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('All')
  const [priorityFilter, setPriorityFilter] = useState('All')
  const [showModal, setShowModal] = useState(false)
  
  // Form fields
  const [formStudentId, setFormStudentId] = useState<string>('')
  const [formType, setFormType] = useState<string>('Attendance Counseling')
  const [formNotes, setFormNotes] = useState<string>('')
  const [formDueDate, setFormDueDate] = useState<string>('')
  const [formPriority, setFormPriority] = useState<string>('High')
  const [formAssignedTo, setFormAssignedTo] = useState<string>('Admin')

  useEffect(() => { initializeInterventions() }, [])
  useEffect(() => { setStudents(studentService.getStudents()) }, [])

  const priorityOrder: Record<string, number> = { High: 0, Medium: 1, Low: 2 }

  const filtered = interventions
    .filter(iv => {
      const matchSearch = iv.studentName.toLowerCase().includes(search.toLowerCase())
      const matchStatus = statusFilter === 'All' || iv.status === statusFilter
      const matchPriority = priorityFilter === 'All' || iv.priority === priorityFilter
      return matchSearch && matchStatus && matchPriority
    })
    .sort((a, b) => {
      const pd = priorityOrder[a.priority] - priorityOrder[b.priority]
      if (pd !== 0) return pd
      return new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime()
    })

  const isOverdue = (iv: Intervention) =>
    iv.status !== 'Completed' && new Date(iv.dueDate) < new Date(new Date().toDateString())

  const riskBg: Record<string, string> = { High: 'bg-red-500', Medium: 'bg-amber-500', Low: 'bg-green-500' }

  const formatDate = (dateStr: string) => {
    const d = new Date(dateStr)
    return d.toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' })
  }

  // Stats
  const totalInterventions = interventions.length
  const plannedCount = interventions.filter(iv => iv.status === 'Planned').length
  const inProgressCount = interventions.filter(iv => iv.status === 'In Progress').length
  const completedCount = interventions.filter(iv => iv.status === 'Completed').length

  const handleCreateIntervention = () => {
    if (!formStudentId || !formType || !formDueDate || !formPriority || !formAssignedTo) {
      alert('Please fill in all required fields')
      return
    }

    const student = students.find(s => s.id.toString() === formStudentId)
    if (!student) return

    addIntervention({
      studentId: student.id,
      studentName: student.name,
      type: formType as Intervention['type'],
      notes: formNotes,
      status: 'Planned',
      priority: formPriority as Intervention['priority'],
      assignedTo: formAssignedTo,
      dueDate: formDueDate,
    })

    // Reset form and close modal
    setFormStudentId('')
    setFormType('Attendance Counseling')
    setFormNotes('')
    setFormDueDate('')
    setFormPriority('High')
    setFormAssignedTo('Admin')
    setShowModal(false)
  }

  const closeModal = () => {
    setShowModal(false)
    setFormStudentId('')
    setFormType('Attendance Counseling')
    setFormNotes('')
    setFormDueDate('')
    setFormPriority('High')
    setFormAssignedTo('Admin')
  }

  return (
    <div className="page-bg">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-neutral-900 dark:text-neutral-50">Interventions</h1>
          <p className="text-neutral-500 dark:text-neutral-400 mt-1">Create and track student interventions</p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors"
        >
          <Plus className="w-4 h-4" />
          Create Intervention
        </button>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <StatCard title="Total Interventions" value={totalInterventions} icon={Target} color="blue" />
        <StatCard title="Planned" value={plannedCount} icon={Clock} color="amber" />
        <StatCard title="In Progress" value={inProgressCount} icon={Circle} color="blue" />
        <StatCard title="Completed" value={completedCount} icon={CheckCircle2} color="green" />
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-3 mb-6">
        <input
          type="text"
          placeholder="Search by student name..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="flex-1 min-w-[200px] border border-neutral-200 dark:border-neutral-700 rounded-lg px-3 py-2 text-sm bg-white dark:bg-neutral-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="appearance-none border border-neutral-200 dark:border-neutral-700 rounded-lg px-3 py-2 text-sm bg-white dark:bg-neutral-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="All">All Status</option>
          <option value="Planned">Planned</option>
          <option value="In Progress">In Progress</option>
          <option value="Completed">Completed</option>
        </select>
        <select
          value={priorityFilter}
          onChange={(e) => setPriorityFilter(e.target.value)}
          className="appearance-none border border-neutral-200 dark:border-neutral-700 rounded-lg px-3 py-2 text-sm bg-white dark:bg-neutral-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="All">All Priority</option>
          <option value="High">High</option>
          <option value="Medium">Medium</option>
          <option value="Low">Low</option>
        </select>
      </div>

      {/* Interventions List */}
      {filtered.length === 0 ? (
        <EmptyState
          icon={Target}
          title="No interventions found"
          description="Try adjusting your filters or create a new intervention"
        />
      ) : (
        <div className="space-y-4">
          {filtered.map((iv) => {
            const studentRisk = students.find(s => s.id === iv.studentId)?.riskLevel ?? 'Low'
            const initials = iv.studentName.split(' ').map(w => w[0]).slice(0, 2).join('').toUpperCase()

            const priorityColors: Record<string, string> = {
              High: 'bg-red-100 text-red-700 border-red-200 dark:bg-red-900/30 dark:text-red-400 dark:border-red-800',
              Medium: 'bg-amber-100 text-amber-700 border-amber-200 dark:bg-amber-900/30 dark:text-amber-400 dark:border-amber-800',
              Low: 'bg-green-100 text-green-700 border-green-200 dark:bg-green-900/30 dark:text-green-400 dark:border-green-800',
            }

            return (
              <div
                key={iv.id}
                className="bg-white dark:bg-neutral-800 rounded-card shadow-card border border-neutral-200/60 dark:border-neutral-700/60 p-4"
              >
                <div className="flex flex-col lg:flex-row lg:items-center gap-4">
                  {/* Left side - Avatar and info */}
                  <div className="flex items-start gap-3 flex-1">
                    {/* Avatar */}
                    <div
                      className={`w-10 h-10 rounded-full flex items-center justify-center text-white font-semibold text-sm ${riskBg[studentRisk]}`}
                    >
                      {initials}
                    </div>

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <div className="flex flex-wrap items-center gap-2 mb-1">
                        <span className="font-semibold text-neutral-900 dark:text-neutral-50">
                          {iv.studentName}
                        </span>
                        <span className="text-neutral-500 text-xs">Risk:</span>
                        <RiskBadge level={studentRisk} size="sm" />
                        <span className="text-neutral-500 text-xs">Priority:</span>
                        <span
                          className={`inline-flex items-center font-semibold rounded-full border text-xs px-2 py-0.5 ${priorityColors[iv.priority]}`}
                        >
                          {iv.priority}
                        </span>
                      </div>

                      <p className="text-neutral-500 text-sm">{iv.type}</p>

                      {iv.notes && (
                        <p className="text-neutral-600 dark:text-neutral-400 text-sm italic truncate mt-1">
                          {iv.notes}
                        </p>
                      )}

                      <div className="flex flex-wrap items-center gap-4 mt-2 text-sm text-neutral-500 dark:text-neutral-400">
                        <span className="inline-flex items-center gap-1">
                          <Calendar className="w-4 h-4" />
                          {formatDate(iv.dueDate)}
                          {isOverdue(iv) && (
                            <span className="text-red-600 dark:text-red-400 font-medium ml-1">(Overdue)</span>
                          )}
                        </span>
                        <span>
                          <span className="text-neutral-500 text-xs">Assigned to:</span>{' '}
                          <span className="text-neutral-700 dark:text-neutral-300">{iv.assignedTo}</span>
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Right side - Status and Delete */}
                  <div className="flex items-center gap-3 lg:flex-shrink-0">
                    <select
                      value={iv.status}
                      onChange={(e) => updateStatus(iv.id, e.target.value as Intervention['status'])}
                      className="appearance-none border border-neutral-200 dark:border-neutral-700 rounded-lg px-3 py-2 text-sm bg-white dark:bg-neutral-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="Planned">Planned</option>
                      <option value="In Progress">In Progress</option>
                      <option value="Completed">Completed</option>
                    </select>

                    <button
                      onClick={() => deleteIntervention(iv.id)}
                      className="p-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      )}

      {/* Create Intervention Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-neutral-800 rounded-card shadow-xl w-full max-w-lg">
            {/* Modal Header */}
            <div className="flex items-center justify-between p-4 border-b border-neutral-200 dark:border-neutral-700">
              <h2 className="text-lg font-semibold text-neutral-900 dark:text-neutral-50">
                Create Intervention
              </h2>
              <button
                onClick={closeModal}
                className="p-1 text-neutral-500 hover:text-neutral-700 dark:hover:text-neutral-300 rounded"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-4 space-y-4">
              {/* Student */}
              <div>
                <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1">
                  Student <span className="text-red-500">*</span>
                </label>
                <select
                  value={formStudentId}
                  onChange={(e) => setFormStudentId(e.target.value)}
                  className="appearance-none w-full border border-neutral-200 dark:border-neutral-700 rounded-lg px-3 py-2 text-sm bg-white dark:bg-neutral-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Select a student</option>
                  {students.map((s) => (
                    <option key={s.id} value={s.id.toString()}>
                      {s.name} ({s.rollNumber})
                    </option>
                  ))}
                </select>
              </div>

              {/* Intervention Type */}
              <div>
                <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1">
                  Intervention Type <span className="text-red-500">*</span>
                </label>
                <select
                  value={formType}
                  onChange={(e) => setFormType(e.target.value)}
                  className="appearance-none w-full border border-neutral-200 dark:border-neutral-700 rounded-lg px-3 py-2 text-sm bg-white dark:bg-neutral-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="Attendance Counseling">Attendance Counseling</option>
                  <option value="Academic Mentoring">Academic Mentoring</option>
                  <option value="Parent Meeting">Parent Meeting</option>
                  <option value="Extra Tutoring">Extra Tutoring</option>
                  <option value="Performance Monitoring">Performance Monitoring</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              {/* Notes */}
              <div>
                <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1">
                  Notes
                </label>
                <textarea
                  value={formNotes}
                  onChange={(e) => setFormNotes(e.target.value)}
                  placeholder="Add notes..."
                  rows={3}
                  className="w-full border border-neutral-200 dark:border-neutral-700 rounded-lg px-3 py-2 text-sm bg-white dark:bg-neutral-800 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                />
              </div>

              {/* Due Date */}
              <div>
                <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1">
                  Due Date <span className="text-red-500">*</span>
                </label>
                <input
                  type="date"
                  value={formDueDate}
                  onChange={(e) => setFormDueDate(e.target.value)}
                  className="w-full border border-neutral-200 dark:border-neutral-700 rounded-lg px-3 py-2 text-sm bg-white dark:bg-neutral-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              {/* Priority */}
              <div>
                <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1">
                  Priority <span className="text-red-500">*</span>
                </label>
                <select
                  value={formPriority}
                  onChange={(e) => setFormPriority(e.target.value)}
                  className="appearance-none w-full border border-neutral-200 dark:border-neutral-700 rounded-lg px-3 py-2 text-sm bg-white dark:bg-neutral-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="High">High</option>
                  <option value="Medium">Medium</option>
                  <option value="Low">Low</option>
                </select>
              </div>

              {/* Assigned To */}
              <div>
                <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1">
                  Assigned To <span className="text-red-500">*</span>
                </label>
                <select
                  value={formAssignedTo}
                  onChange={(e) => setFormAssignedTo(e.target.value)}
                  className="appearance-none w-full border border-neutral-200 dark:border-neutral-700 rounded-lg px-3 py-2 text-sm bg-white dark:bg-neutral-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="Admin">Admin</option>
                  <option value="Teacher">Teacher</option>
                  <option value="Mentor">Mentor</option>
                  <option value="Counselor">Counselor</option>
                </select>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="flex items-center justify-end gap-3 p-4 border-t border-neutral-200 dark:border-neutral-700">
              <button
                onClick={closeModal}
                className="px-4 py-2 text-sm font-medium text-neutral-700 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-700 rounded-lg transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleCreateIntervention}
                className="px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors"
              >
                Create Intervention
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default Interventions
