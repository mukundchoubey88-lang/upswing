import React, { useState, useEffect, useRef } from 'react'
import { useAuth } from '../../context/AuthContext'
import { useTheme } from '../../context/ThemeContext'
import { useNavigate } from 'react-router-dom'
import { Bell, Settings, HelpCircle, LogOut, AlertTriangle, Calendar, Target, Info, Sun, Moon } from 'lucide-react'
import { UpswingMark } from '../UpswingIntro'
import UpswingWordmark from '../UpswingWordmark'
import { useNotificationStore, AppNotification } from '../../store/notificationsStore'
import { formatDistanceToNow } from 'date-fns'

const Header: React.FC = () => {
  const { user, logout } = useAuth()
  const { theme, toggleTheme } = useTheme()
  const navigate = useNavigate()
  const [showUserMenu, setShowUserMenu] = useState(false)
  const [showNotifications, setShowNotifications] = useState(false)
  const { notifications, unreadCount, markAsRead, markAllAsRead } = useNotificationStore()
  
  const userMenuRef = useRef<HTMLDivElement>(null)
  const notifRef = useRef<HTMLDivElement>(null)

  // Close dropdowns on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target as Node)) {
        setShowUserMenu(false)
      }
      if (notifRef.current && !notifRef.current.contains(event.target as Node)) {
        setShowNotifications(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  // Close on Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setShowUserMenu(false)
        setShowNotifications(false)
      }
    }
    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [])

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
        return 'bg-red-100 dark:bg-red-900 text-red-700 dark:text-red-300'
      case 'teacher':
        return 'bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300'
      case 'student':
        return 'bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300'
      default:
        return 'bg-neutral-100 dark:bg-neutral-700'
    }
  }

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'risk':
        return <AlertTriangle className="w-4 h-4 text-red-500" />
      case 'attendance':
        return <Calendar className="w-4 h-4 text-amber-500" />
      case 'intervention':
        return <Target className="w-4 h-4 text-blue-500" />
      case 'performance':
        return <Info className="w-4 h-4 text-purple-500" />
      default:
        return <Info className="w-4 h-4 text-gray-500" />
    }
  }

  const latestNotifications = notifications.slice(0, 5)

  return (
    <header className="bg-white dark:bg-neutral-800 border-b border-neutral-200 dark:border-neutral-700 shadow-sm sticky top-0 z-40">
      <div className="flex items-center justify-between h-14 px-6 md:px-8">
        {/* Left: Logo/Title (mobile/tablet only) */}
        <div className="flex items-center space-x-2 lg:hidden">
          <div className="w-7 h-7 bg-gradient-to-br from-primary-500 to-primary-600 rounded-lg flex items-center justify-center text-white font-bold text-sm">
            <UpswingMark size={18} className="text-white" />
          </div>
          <h1 className="text-sm font-bold text-neutral-900 dark:text-neutral-50 hidden sm:block">
            <UpswingWordmark />
          </h1>
        </div>

        {/* Right: User Menu */}
        <div className="flex items-center space-x-3 ml-auto">
          {/* Theme Toggle */}
          <button
            onClick={toggleTheme}
            className="relative p-2 text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-100 transition-colors rounded-lg hover:bg-neutral-100 dark:hover:bg-neutral-700"
            aria-label="Toggle theme"
          >
            {theme === 'light' ? (
              <Moon className="w-5 h-5" />
            ) : (
              <Sun className="w-5 h-5" />
            )}
          </button>

          {/* Notifications */}
          <div className="relative" ref={notifRef}>
            <button
              onClick={() => setShowNotifications(!showNotifications)}
              className="relative p-2 text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-100 transition-colors rounded-lg hover:bg-neutral-100 dark:hover:bg-neutral-700"
              aria-label="Notifications"
            >
              <Bell className="w-5 h-5" />
              {unreadCount > 0 && (
                <span className="absolute -right-1 top-0 min-w-[20px] h-5 px-1.5 bg-red-500 text-white text-xs font-bold rounded-full flex items-center justify-center ring-2 ring-white dark:ring-neutral-800">
                  {unreadCount > 9 ? '9+' : unreadCount}
                </span>
              )}
            </button>

            {/* Notifications Dropdown */}
            {showNotifications && (
              <div className="absolute right-0 mt-2 w-80 bg-white dark:bg-neutral-800 rounded-xl shadow-lg border border-neutral-200 dark:border-neutral-700 py-2 z-50">
                <div className="flex items-center justify-between px-4 py-2 border-b border-neutral-200 dark:border-neutral-700">
                  <h3 className="text-sm font-semibold text-neutral-900 dark:text-neutral-50">Notifications</h3>
                  {unreadCount > 0 && (
                    <button
                      onClick={() => markAllAsRead()}
                      className="text-xs text-primary-600 hover:text-primary-700 font-medium"
                    >
                      Mark all read
                    </button>
                  )}
                </div>
                <div className="max-h-64 overflow-y-auto">
                  {latestNotifications.length === 0 ? (
                    <div className="px-4 py-6 text-center text-sm text-neutral-500">
                      No notifications
                    </div>
                  ) : (
                    latestNotifications.map((notif: AppNotification) => (
                      <div
                        key={notif.id}
                        className={`px-4 py-3 hover:bg-neutral-50 dark:hover:bg-neutral-700/50 cursor-pointer ${
                          !notif.read ? 'bg-blue-50/50 dark:bg-blue-900/20' : ''
                        }`}
                        onClick={() => markAsRead(notif.id)}
                      >
                        <div className="flex items-start gap-3">
                          <div className="mt-0.5">{getNotificationIcon(notif.type)}</div>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-neutral-900 dark:text-neutral-100 truncate">
                              {notif.title}
                            </p>
                            <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-0.5 line-clamp-2">
                              {notif.message}
                            </p>
                            <p className="text-xs text-neutral-400 dark:text-neutral-500 mt-1">
                              {formatDistanceToNow(new Date(notif.createdAt), { addSuffix: true })}
                            </p>
                          </div>
                          {!notif.read && (
                            <span className="w-2 h-2 bg-blue-500 rounded-full flex-shrink-0 mt-1.5" />
                          )}
                        </div>
                      </div>
                    ))
                  )}
                </div>
                <div className="px-4 py-2 border-t border-neutral-200 dark:border-neutral-700">
                  <button
                    onClick={() => {
                      navigate('/notifications')
                      setShowNotifications(false)
                    }}
                    className="w-full text-center text-sm text-primary-600 hover:text-primary-700 font-medium"
                  >
                    View all notifications
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* User Menu Dropdown */}
          <div className="relative" ref={userMenuRef}>
            <button
              onClick={() => setShowUserMenu(!showUserMenu)}
              className="flex items-center space-x-2 px-3 py-2 rounded-lg hover:bg-neutral-100 dark:hover:bg-neutral-700 transition-colors"
            >
              <div className="text-right hidden sm:block">
                <p className="text-sm font-medium text-neutral-900 dark:text-neutral-50 leading-none">
                  {user?.name}
                </p>
                <p className={`text-xs font-semibold uppercase tracking-wide mt-1 px-2 py-0.5 rounded ${getRoleColor(user?.role || '')}`}>
                  {user?.role}
                </p>
              </div>
              <div className="w-8 h-8 bg-gradient-to-br from-primary-400 to-primary-600 rounded-full flex items-center justify-center text-white font-semibold text-sm">
                {user?.name?.charAt(0).toUpperCase()}
              </div>
            </button>

            {/* Dropdown Menu */}
            {showUserMenu && (
              <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-neutral-800 rounded-xl shadow-lg border border-neutral-200 dark:border-neutral-700 py-1 z-50">
                <div className="px-4 py-3 border-b border-neutral-200 dark:border-neutral-700">
                  <p className="text-sm font-medium text-neutral-900 dark:text-neutral-50">{user?.name}</p>
                  <p className="text-xs text-neutral-500 dark:text-neutral-400">{user?.email}</p>
                </div>

                <button
                  onClick={() => {
                    navigate('/settings')
                    setShowUserMenu(false)
                  }}
                  className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-neutral-700 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-700"
                >
                  <Settings className="w-4 h-4" />
                  Settings
                </button>

                <button
                  onClick={() => {
                    setShowUserMenu(false)
                  }}
                  className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-neutral-700 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-700"
                >
                  <HelpCircle className="w-4 h-4" />
                  Help
                </button>

                <div className="border-t border-neutral-200 dark:border-neutral-700 my-1"></div>

                <button
                  onClick={handleLogout}
                  className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-red-600 dark:text-red-400 hover:bg-neutral-100 dark:hover:bg-neutral-700 font-medium"
                >
                  <LogOut className="w-4 h-4" />
                  Logout
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
