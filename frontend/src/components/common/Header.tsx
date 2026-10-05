import React, { useState } from 'react'
import { useAuth } from '../../context/AuthContext'
import { useNavigate } from 'react-router-dom'

const Header: React.FC = () => {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const [showUserMenu, setShowUserMenu] = useState(false)

  const handleLogout = async () => {
    try {
      await logout()
      navigate('/login')
    } catch (error) {
      console.error('Logout error:', error)
    }
  }

  const getRoleColor = (role: string): string => {
    switch (role) {
      case 'admin':
        return 'bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-100'
      case 'teacher':
        return 'bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-100'
      case 'student':
        return 'bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-100'
      default:
        return 'bg-neutral-100 dark:bg-neutral-700'
    }
  }

  const getRoleIcon = (role: string): string => {
    switch (role) {
      case 'admin':
        return '👨‍💼'
      case 'teacher':
        return '👨‍🏫'
      case 'student':
        return '👨‍🎓'
      default:
        return '👤'
    }
  }

  return (
    <header className="bg-white dark:bg-neutral-800 border-b border-neutral-200 dark:border-neutral-700 shadow-sm sticky top-0 z-40">
      <div className="flex items-center justify-between h-16 px-6 md:px-8">
        {/* Left: Logo/Title */}
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 bg-gradient-to-br from-primary-500 to-primary-600 rounded-lg flex items-center justify-center text-white font-bold">
            E
          </div>
          <h1 className="text-lg font-bold text-neutral-900 dark:text-neutral-50 hidden sm:block">
            EDUVISION
          </h1>
        </div>

        {/* Right: User Menu */}
        <div className="flex items-center space-x-4">
          {/* Notifications (placeholder) */}
          <button className="relative p-2 text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-100 transition-colors rounded-lg hover:bg-neutral-100 dark:hover:bg-neutral-700">
            <span className="text-lg">🔔</span>
            <span className="absolute top-0 right-0 w-2 h-2 bg-risk-high rounded-full"></span>
          </button>

          {/* User Menu Dropdown */}
          <div className="relative">
            <button
              onClick={() => setShowUserMenu(!showUserMenu)}
              className="flex items-center space-x-2 px-3 py-2 rounded-lg hover:bg-neutral-100 dark:hover:bg-neutral-700 transition-colors"
            >
              <div className="text-right hidden sm:block">
                <p className="text-sm font-medium text-neutral-900 dark:text-neutral-50 leading-none">
                  {user?.name}
                </p>
                <p className={`text-xs font-semibold uppercase tracking-wide mt-1 px-2 py-0.5 rounded ${getRoleColor(user?.role || '')}`}>
                  {getRoleIcon(user?.role || '')} {user?.role}
                </p>
              </div>
              <div className="w-8 h-8 bg-gradient-to-br from-primary-400 to-primary-600 rounded-full flex items-center justify-center text-white font-semibold text-sm">
                {user?.name?.charAt(0).toUpperCase()}
              </div>
            </button>

            {/* Dropdown Menu */}
            {showUserMenu && (
              <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-neutral-800 rounded-lg shadow-lg border border-neutral-200 dark:border-neutral-700 py-1 z-50">
                <div className="px-4 py-2 border-b border-neutral-200 dark:border-neutral-700">
                  <p className="text-sm font-medium text-neutral-900 dark:text-neutral-50">{user?.name}</p>
                  <p className="text-xs text-neutral-600 dark:text-neutral-400">{user?.email}</p>
                </div>

                <button
                  onClick={() => {
                    navigate('/settings')
                    setShowUserMenu(false)
                  }}
                  className="w-full text-left px-4 py-2 text-sm text-neutral-700 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-700"
                >
                  ⚙️ Settings
                </button>

                <button
                  onClick={() => {
                    navigate('/help')
                    setShowUserMenu(false)
                  }}
                  className="w-full text-left px-4 py-2 text-sm text-neutral-700 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-700"
                >
                  ❓ Help
                </button>

                <div className="border-t border-neutral-200 dark:border-neutral-700"></div>

                <button
                  onClick={handleLogout}
                  className="w-full text-left px-4 py-2 text-sm text-risk-high hover:bg-neutral-100 dark:hover:bg-neutral-700 font-medium"
                >
                  🚪 Logout
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  )
}

export default Header
