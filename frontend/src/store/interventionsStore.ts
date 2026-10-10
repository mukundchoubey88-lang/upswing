import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import studentService from '../services/studentService'

export interface Intervention {
  id: string
  studentId: number
  studentName: string
  type: 'Attendance Counseling' | 'Academic Mentoring' | 'Parent Meeting' | 'Extra Tutoring' | 'Performance Monitoring' | 'Other'
  status: 'Planned' | 'In Progress' | 'Completed'
  priority: 'High' | 'Medium' | 'Low'
  assignedTo: string
  dueDate: string
  notes: string
  createdAt: string
}

interface InterventionState {
  interventions: Intervention[]
  addIntervention: (intervention: Omit<Intervention, 'id' | 'createdAt'>) => void
  updateIntervention: (id: string, updates: Partial<Intervention>) => void
  deleteIntervention: (id: string) => void
  updateStatus: (id: string, status: Intervention['status']) => void
  getInterventionsByStudent: (studentId: number) => Intervention[]
}

const generateInitialInterventions = (): Intervention[] => {
  const students = studentService.getStudents()
  const highAndMediumRisk = students.filter(s => s.riskLevel === 'High' || s.riskLevel === 'Medium')
  const interventions: Intervention[] = []
  const now = new Date()

  const addDays = (date: Date, days: number): string => {
    const result = new Date(date)
    result.setDate(result.getDate() + days)
    return result.toISOString().split('T')[0]
  }

  highAndMediumRisk.forEach(student => {
    if (student.riskLevel === 'High') {
      // High risk students get more intensive interventions
      interventions.push({
        id: `int-${student.id}-1`,
        studentId: student.id,
        studentName: student.name,
        type: 'Attendance Counseling',
        status: 'Planned',
        priority: 'High',
        assignedTo: 'Admin',
        dueDate: addDays(now, 3),
        notes: `Address attendance rate of ${student.attendance}%`,
        createdAt: now.toISOString(),
      })
      interventions.push({
        id: `int-${student.id}-2`,
        studentId: student.id,
        studentName: student.name,
        type: 'Academic Mentoring',
        status: 'Planned',
        priority: 'High',
        assignedTo: 'Mentor',
        dueDate: addDays(now, 5),
        notes: `Improve academic performance, current avg: ${student.avgPerformance}%`,
        createdAt: now.toISOString(),
      })
      interventions.push({
        id: `int-${student.id}-3`,
        studentId: student.id,
        studentName: student.name,
        type: 'Parent Meeting',
        status: 'Planned',
        priority: 'Medium',
        assignedTo: 'Admin',
        dueDate: addDays(now, 7),
        notes: 'Discuss student progress and support plan',
        createdAt: now.toISOString(),
      })
    } else {
      // Medium risk students
      interventions.push({
        id: `int-${student.id}-1`,
        studentId: student.id,
        studentName: student.name,
        type: 'Performance Monitoring',
        status: 'Planned',
        priority: 'Medium',
        assignedTo: 'Teacher',
        dueDate: addDays(now, 7),
        notes: `Monitor progress, current avg: ${student.avgPerformance}%`,
        createdAt: now.toISOString(),
      })
      interventions.push({
        id: `int-${student.id}-2`,
        studentId: student.id,
        studentName: student.name,
        type: 'Extra Tutoring',
        status: 'Planned',
        priority: 'Low',
        assignedTo: 'Tutor',
        dueDate: addDays(now, 14),
        notes: 'Additional tutoring support for improvement',
        createdAt: now.toISOString(),
      })
    }
  })

  return interventions
}

export const useInterventionsStore = create<InterventionState>()(
  persist(
    (set, get) => ({
      interventions: [],

      addIntervention: (intervention) => {
        const newIntervention: Intervention = {
          ...intervention,
          id: `int-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
          createdAt: new Date().toISOString(),
        }
        set((state) => ({
          interventions: [...state.interventions, newIntervention],
        }))
      },

      updateIntervention: (id, updates) => {
        set((state) => ({
          interventions: state.interventions.map((int) =>
            int.id === id ? { ...int, ...updates } : int
          ),
        }))
      },

      deleteIntervention: (id) => {
        set((state) => ({
          interventions: state.interventions.filter((int) => int.id !== id),
        }))
      },

      updateStatus: (id, status) => {
        set((state) => ({
          interventions: state.interventions.map((int) =>
            int.id === id ? { ...int, status } : int
          ),
        }))
      },

      getInterventionsByStudent: (studentId) => {
        return get().interventions.filter((int) => int.studentId === studentId)
      },
    }),
    {
      name: 'eduvision-interventions',
      onRehydrateStorage: () => (state) => {
        // Initialize with generated interventions if empty
        if (state && state.interventions.length === 0) {
          state.interventions = generateInitialInterventions()
        }
      },
    }
  )
)

// Initialize interventions if empty
if (useInterventionsStore.getState().interventions.length === 0) {
  useInterventionsStore.setState({ interventions: generateInitialInterventions() })
}
