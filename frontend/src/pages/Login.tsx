import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

const Login: React.FC = () => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const { login } = useAuth()
  const navigate = useNavigate()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      await login(email, password)
      navigate('/')
    } catch (err: any) {
      setError(err.message || 'Login failed. Please try again.')
      console.error('Login error:', err)
    } finally {
      setLoading(false)
    }
  }

  const handleDemoLogin = async (demoEmail: string, password: string) => {
    setEmail(demoEmail)
    setError('')
    setLoading(true)

    try {
      await login(demoEmail, password)
      navigate('/')
    } catch (err: any) {
      setError(err.message || 'Login failed. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-primary-900 via-primary-800 to-primary-700">
      <div className="w-full max-w-md p-8 bg-white dark:bg-neutral-800 rounded-xl shadow-2xl border border-neutral-200 dark:border-neutral-700">
        {/* Header */}
        <div className="mb-8 text-center">
          <h1 className="text-4xl font-bold text-primary-900 dark:text-primary-50 mb-2">
            UPSWING
          </h1>
          <p className="text-sm text-neutral-600 dark:text-neutral-400">
            AI Academic Performance Detection
          </p>
          <p className="text-xs text-neutral-500 dark:text-neutral-500 mt-2">
            "Detect Early. Understand Why. Take Action. Improve Outcomes."
          </p>
        </div>

        {/* Error Alert */}
        {error && (
          <div className="mb-6 p-4 bg-risk-high text-white rounded-lg text-sm font-medium border border-red-600">
            <div className="flex items-start">
              <span className="mr-2">⚠️</span>
              <div>{error}</div>
            </div>
          </div>
        )}

        {/* Login Form */}
        <form onSubmit={handleSubmit} className="space-y-4 mb-6">
          <div>
            <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
              Email Address
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="teacher@school.com"
              className="w-full px-4 py-2 border border-neutral-300 dark:border-neutral-600 rounded-lg bg-white dark:bg-neutral-700 text-neutral-900 dark:text-neutral-50 placeholder-neutral-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              required
              disabled={loading}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full px-4 py-2 border border-neutral-300 dark:border-neutral-600 rounded-lg bg-white dark:bg-neutral-700 text-neutral-900 dark:text-neutral-50 placeholder-neutral-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              required
              disabled={loading}
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-2 px-4 bg-gradient-to-r from-primary-500 to-primary-600 hover:from-primary-600 hover:to-primary-700 disabled:from-neutral-400 disabled:to-neutral-400 text-white font-semibold rounded-lg transition-all duration-200 transform hover:scale-105 disabled:scale-100 disabled:cursor-not-allowed"
          >
            {loading ? (
              <span className="flex items-center justify-center">
                <span className="inline-block animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></span>
                Signing in...
              </span>
            ) : (
              'Sign In'
            )}
          </button>
        </form>

        {/* Divider */}
        <div className="mb-6 flex items-center">
          <div className="flex-1 border-t border-neutral-300 dark:border-neutral-600"></div>
          <span className="mx-4 text-sm text-neutral-500 dark:text-neutral-500">Demo</span>
          <div className="flex-1 border-t border-neutral-300 dark:border-neutral-600"></div>
        </div>

        {/* Demo Credentials */}
        <div className="space-y-2">
          <p className="text-xs font-semibold text-neutral-600 dark:text-neutral-400 uppercase tracking-wider">
            Quick Login
          </p>

          <button
            type="button"
            onClick={() => handleDemoLogin('admin@school.com', 'password123')}
            disabled={loading}
            className="w-full py-2 px-4 text-sm bg-neutral-100 hover:bg-neutral-200 dark:bg-neutral-700 dark:hover:bg-neutral-600 text-neutral-900 dark:text-neutral-50 font-medium rounded-lg transition-colors disabled:opacity-50"
          >
            👨‍💼 Admin
          </button>

          <button
            type="button"
            onClick={() => handleDemoLogin('teacher1@school.com', 'password123')}
            disabled={loading}
            className="w-full py-2 px-4 text-sm bg-neutral-100 hover:bg-neutral-200 dark:bg-neutral-700 dark:hover:bg-neutral-600 text-neutral-900 dark:text-neutral-50 font-medium rounded-lg transition-colors disabled:opacity-50"
          >
            👨‍🏫 Teacher
          </button>

          <button
            type="button"
            onClick={() => handleDemoLogin('student@school.com', 'password123')}
            disabled={loading}
            className="w-full py-2 px-4 text-sm bg-neutral-100 hover:bg-neutral-200 dark:bg-neutral-700 dark:hover:bg-neutral-600 text-neutral-900 dark:text-neutral-50 font-medium rounded-lg transition-colors disabled:opacity-50"
          >
            👨‍🎓 Student
          </button>
        </div>

        {/* Footer */}
        <div className="mt-6 pt-6 border-t border-neutral-200 dark:border-neutral-700 text-center">
          <p className="text-xs text-neutral-500 dark:text-neutral-500">
            UPSWING v1.0 • Early Warning System
          </p>
        </div>
      </div>
    </div>
  )
}

export default Login
