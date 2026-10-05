/**
 * API Service Functions
 * Centralized API calls for all features
 */
import apiClient from '../lib/apiClient';

// ==================== AUTH ====================
export interface LoginCredentials {
  email: string;
  password: string;
}

export interface LoginResponse {
  success: boolean;
  data: {
    access_token: string;
    token_type: string;
    user: {
      id: string;
      email: string;
      name: string;
      role: string;
    };
  };
  message: string;
}

export interface User {
  id: string;
  email: string;
  name: string;
  role: string;
}

export const authApi = {
  login: async (credentials: LoginCredentials): Promise<LoginResponse> => {
    const response = await apiClient.post<LoginResponse>('/auth/login', credentials);
    return response.data;
  },

  logout: async (): Promise<void> => {
    await apiClient.post('/auth/logout');
  },

  getCurrentUser: async (): Promise<User> => {
    const response = await apiClient.get<User>('/auth/me');
    return response.data;
  },
};

// ==================== DASHBOARD ====================
export interface DashboardMetrics {
  total_students: number;
  high_risk_count: number;
  medium_risk_count: number;
  low_risk_count: number;
  improving_count: number;
  declining_count: number;
  active_interventions: number;
  average_attendance: number;
  average_performance: number;
}

export const dashboardApi = {
  getMetrics: async (): Promise<DashboardMetrics> => {
    const response = await apiClient.get<DashboardMetrics>('/dashboard/metrics');
    return response.data;
  },
};

// ==================== STUDENTS ====================
export interface Student {
  id: string;
  student_id: string;
  name: string;
  email: string;
  course: string;
  semester: number;
  department: string;
  attendance_percentage: number;
  current_average: number;
  previous_average: number;
  assignment_completion: number;
  risk_score: number;
  risk_level: 'low' | 'medium' | 'high';
  performance_trend: 'improving' | 'stable' | 'declining';
  created_at: string;
  updated_at: string;
}

export interface PaginatedStudents {
  items: Student[];
  total: number;
  page: number;
  page_size: number;
  total_pages: number;
}

export interface StudentFilters {
  page?: number;
  page_size?: number;
  risk_level?: 'low' | 'medium' | 'high';
  search?: string;
  semester?: number;
  department?: string;
}

export const studentsApi = {
  getAll: async (filters?: StudentFilters): Promise<PaginatedStudents> => {
    const response = await apiClient.get<PaginatedStudents>('/students', {
      params: filters,
    });
    return response.data;
  },

  getById: async (id: string): Promise<Student> => {
    const response = await apiClient.get<Student>(`/students/${id}`);
    return response.data;
  },

  getRiskFactors: async (id: string) => {
    const response = await apiClient.get(`/students/${id}/risk`);
    return response.data;
  },
};

// ==================== NOTIFICATIONS ====================
export interface Notification {
  id: string;
  user_id: string;
  student_id: string | null;
  type: string;
  message: string;
  priority: 'critical' | 'high' | 'medium' | 'low';
  read: boolean;
  created_at: string;
}

export const notificationsApi = {
  getAll: async (): Promise<Notification[]> => {
    const response = await apiClient.get<Notification[]>('/notifications');
    return response.data;
  },

  markAsRead: async (id: string): Promise<void> => {
    await apiClient.patch(`/notifications/${id}/read`);
  },
};
