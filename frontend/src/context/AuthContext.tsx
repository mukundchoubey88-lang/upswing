import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import { authApi, type User } from '../services/api'
import toast from 'react-hot-toast'

interface AuthContextType {
  user: User | null
  loading: boolean
  error: string | null
  login: (email: string, password: string) => Promise<void>
  logout: () => Promise<void>
  isAuthenticated: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Check if user is already logged in on mount
  useEffect(() => {
    const checkAuth = async () => {
      try {
        setLoading(true)
        setError(null)
        
        // Check if token exists
        const token = localStorage.getItem('access_token')
        if (!token) {
          setUser(null)
          setLoading(false)
          return
        }

        // Try to get current user
        const currentUser = await authApi.getCurrentUser()
        setUser(currentUser)
      } catch (err) {
        console.error('Auth check failed:', err)
        // Clear invalid token
        localStorage.removeItem('access_token')
        localStorage.removeItem('user')
        setUser(null)
        setError('Session expired')
      } finally {
        setLoading(false)
      }
    }

    checkAuth()
  }, [])

  const login = async (email: string, password: string) => {
    setLoading(true)
    setError(null)
    try {
      const response = await authApi.login({ email, password })
      
      if (response.success && response.data) {
        // Store token
        localStorage.setItem('access_token', response.data.access_token)
        localStorage.setItem('user', JSON.stringify(response.data.user))
        
        // Set user
        setUser(response.data.user)
        
        toast.success('Login successful!')
      } else {
        throw new Error('Login failed')
      }
    } catch (err: any) {
      const message = err.response?.data?.detail || err.message || 'Login failed'
      setError(message)
      toast.error(message)
      throw new Error(message)
    } finally {
      setLoading(false)
    }
  }

  const logout = async () => {
    setLoading(true)
    try {
      await authApi.logout()
    } catch (err) {
      console.error('Logout error:', err)
    } finally {
      // Clear everything
      localStorage.removeItem('access_token')
      localStorage.removeItem('user')
      setUser(null)
      setError(null)
      setLoading(false)
      toast.success('Logged out successfully')
    }
  }

  const value: AuthContextType = {
    user,
    loading,
    error,
    login,
    logout,
    isAuthenticated: !!user,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
