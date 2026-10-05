import axios from 'axios'
import { User } from '../types'

const API_URL = import.meta.env.VITE_API_URL || '/api/v1'

const api = axios.create({
  baseURL: API_URL,
  withCredentials: true,
})

// Token management
let token: string | null = localStorage.getItem('access_token')

// Add token to all requests
api.interceptors.request.use((config) => {
  token = localStorage.getItem('access_token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

// Handle token expiry
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Token expired or invalid
      localStorage.removeItem('access_token')
      window.location.href = '/login'
    }
    return Promise.reject(error)
  }
)

export const authService = {
  async login(email: string, password: string): Promise<User> {
    try {
      const response = await api.post<any>('/auth/login', {
        email,
        password,
      })

      if (response.data.success && response.data.data) {
        const { access_token, user } = response.data.data
        localStorage.setItem('access_token', access_token)
        token = access_token
        return user
      }
      throw new Error('Login failed')
    } catch (error) {
      throw error
    }
  },

  async logout(): Promise<void> {
    try {
      await api.post('/auth/logout')
    } catch (error) {
      console.error('Logout error:', error)
    } finally {
      localStorage.removeItem('access_token')
      token = null
    }
  },

  async getCurrentUser(): Promise<User> {
    try {
      const response = await api.get<any>('/auth/me')
      if (response.data) {
        return response.data
      }
      throw new Error('Failed to get current user')
    } catch (error) {
      // Not authenticated
      localStorage.removeItem('access_token')
      throw error
    }
  },

  getToken(): string | null {
    return localStorage.getItem('access_token')
  },

  setToken(newToken: string): void {
    localStorage.setItem('access_token', newToken)
    token = newToken
  },

  clearToken(): void {
    localStorage.removeItem('access_token')
    token = null
  },

  isAuthenticated(): boolean {
    return !!localStorage.getItem('access_token')
  },
}

export default api
