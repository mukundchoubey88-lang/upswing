export interface User {
  id: string
  email: string
  name: string
  role: 'admin' | 'teacher' | 'student'
  created_at: string
}

export interface Student {
  id: string
  name: string
  email: string
  student_id: string
  class_semester: string
  enrollment_status: 'active' | 'inactive' | 'graduated'
  created_at: string
  updated_at: string
}

export interface RiskScore {
  id: string
  student_id: string
  overall_score: number
  attendance_factor: number
  performance_factor: number
  history_factor: number
  assignment_factor: number
  trend_factor: number
  risk_level: 'low' | 'medium' | 'high'
  created_at: string
}

export interface RiskFactor {
  id: string
  risk_score_id: string
  factor_name: string
  contribution_points: number
  explanation: string
  created_at: string
}

export interface Intervention {
  id: string
  student_id: string
  assigned_teacher_id: string
  problem: string
  intervention_type: string
  start_date: string
  follow_up_date: string
  status: 'planned' | 'in_progress' | 'completed' | 'monitoring'
  notes: string
  outcome: string
  risk_score_before: number
  risk_score_after: number
  created_at: string
  updated_at: string
}

export interface Notification {
  id: string
  user_id: string
  student_id: string
  type: string
  message: string
  priority: 'critical' | 'high' | 'medium' | 'low'
  read: boolean
  created_at: string
}

export interface DashboardMetrics {
  total_students: number
  high_risk_count: number
  medium_risk_count: number
  low_risk_count: number
  improving_count: number
  declining_count: number
  active_interventions: number
}

export interface PaginatedResponse<T> {
  items: T[]
  total: number
  page: number
  page_size: number
  total_pages: number
}

export interface ApiResponse<T> {
  success: boolean
  data?: T
  error?: string
  message?: string
}
