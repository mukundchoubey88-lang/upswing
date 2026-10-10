import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import studentService from '../services/studentService'


export interface AppNotification {
  id: string
  type: 'high-risk' | 'attendance' | 'intervention' | 'general' | 'performance'
  title: string
  message: string
  studentId?: number
  studentName?: string
  read: boolean
  createdAt: string
  priority: 'high' | 'medium' | 'low'
}

interface NotificationState {
  notifications: AppNotification[]
  unreadCount: number
  markAsRead: (id: string) => void
  markAllAsRead: () => void
  addNotification: (notification: Omit<AppNotification, 'id' | 'createdAt' | 'read'>) => void
  getNotificationsByType: (type: AppNotification['type']) => AppNotification[]
}

const generateInitialNotifications = (): AppNotification[] => {
  const students = studentService.getStudents()
  const notifications: AppNotification[] = []
  const now = new Date()

  const addNotification = (notification: Omit<AppNotification, 'id' | 'createdAt' | 'read'>) => {
    notifications.push({
      ...notification,
      id: `notif-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      createdAt: new Date(now.getTime() - Math.random() * 7 * 24 * 60 * 60 * 1000).toISOString(), // Random time in last 7 days
      read: Math.random() > 0.6, // 60% chance of being unread
    })
  }

  // High risk student notifications
  students.filter(s => s.riskLevel === 'High').forEach(student => {
    addNotification({
      type: 'high-risk',
      title: `${student.name} flagged as High Risk`,
      message: `Requires immediate attention. Attendance: ${student.attendance}%, Performance: ${student.avgPerformance}%`,
      studentId: student.id,
      studentName: student.name,
      priority: 'high',
    })
  })

  // Low attendance notifications
  students.filter(s => s.attendance < 65).forEach(student => {
    addNotification({
      type: 'attendance',
      title: `${student.name} attendance dropped to ${student.attendance}%`,
      message: `Attendance is below the 65% threshold. Action may be required.`,
      studentId: student.id,
      studentName: student.name,
      priority: 'high',
    })
  })

  // Declining trend notifications
  students.filter(s => s.trend === 'Declining').forEach(student => {
    addNotification({
      type: 'performance',
      title: `${student.name} is showing declining performance`,
      message: `Academic trend is declining. Consider intervention.`,
      studentId: student.id,
      studentName: student.name,
      priority: student.riskLevel === 'High' ? 'high' : 'medium',
    })
  })

  // Failed subjects notification
  students.filter(s => s.failedSubjects >= 3).forEach(student => {
    addNotification({
      type: 'general',
      title: `${student.name} has ${student.failedSubjects} failed subjects`,
      message: `Multiple failed subjects detected. Academic support recommended.`,
      studentId: student.id,
      studentName: student.name,
      priority: 'high',
    })
  })

  // Summary notifications
  const highRiskCount = students.filter(s => s.riskLevel === 'High').length
  if (highRiskCount > 0) {
    addNotification({
      type: 'general',
      title: `${highRiskCount} students need immediate attention`,
      message: `${highRiskCount} students are currently flagged as High Risk.`,
      priority: 'high',
    })
  }

  // Intervention reminder
  addNotification({
    type: 'intervention',
    title: 'Pending interventions require follow-up',
    message: 'Some interventions are overdue or need status updates.',
    priority: 'medium',
  })

  return notifications.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
}

export const useNotificationStore = create<NotificationState>()(
  persist(
    (set, get) => ({
      notifications: [],
      unreadCount: 0,

      markAsRead: (id) => {
        set((state) => {
          const notifications = state.notifications.map((n) =>
            n.id === id ? { ...n, read: true } : n
          )
          const unreadCount = notifications.filter((n) => !n.read).length
          return { notifications, unreadCount }
        })
      },

      markAllAsRead: () => {
        set((state) => ({
          notifications: state.notifications.map((n) => ({ ...n, read: true })),
          unreadCount: 0,
        }))
      },

      addNotification: (notification) => {
        const newNotification: AppNotification = {
          ...notification,
          id: `notif-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
          createdAt: new Date().toISOString(),
          read: false,
        }
        set((state) => ({
          notifications: [newNotification, ...state.notifications],
          unreadCount: state.unreadCount + 1,
        }))
      },

      getNotificationsByType: (type) => {
        return get().notifications.filter((n) => n.type === type)
      },
    }),
    {
      name: 'eduvision-notifications',
      onRehydrateStorage: () => (state) => {
        // Initialize with generated notifications if empty
        if (state && state.notifications.length === 0) {
          const notifications = generateInitialNotifications()
          state.notifications = notifications
          state.unreadCount = notifications.filter(n => !n.read).length
        }
      },
    }
  )
)

// Initialize notifications if empty
const currentState = useNotificationStore.getState()
if (currentState.notifications.length === 0) {
  const notifications = generateInitialNotifications()
  useNotificationStore.setState({
    notifications,
    unreadCount: notifications.filter(n => !n.read).length
  })
}
