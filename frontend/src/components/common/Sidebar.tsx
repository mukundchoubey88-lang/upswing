import React, { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'

interface NavItem {
  path: string
  label: string
  icon: string
  roles: string[]
  divider?: boolean
}

const Sidebar: React.FC = () => {
  const { user } = useAuth()
  const location = useLocation()
  const [isOpen, setIsOpen] = useState(false)

  const isActive = (path: string) => location.pathname === path || location.pathname.startsWith(path + '/')

  const navItems: NavItem[] = [
    { path: '/', label: 'Dashboard', icon: '📊', roles: ['admin', 'teacher', 'student'] },
    { path: '/students', label: 'Students', icon: '👥', roles: ['admin', 'teacher'] },
    { path: '/risk-analysis', label: 'Risk Analysis', icon: '⚠️', roles: ['admin', 'teacher'] },
    { path: '/interventions', label: 'Interventions', icon: '🎯', roles: ['admin', 'teacher'] },
    { divider: true, path: '', label: '', icon: '', roles: [] },
    { path: '/notifications', label: 'Notifications', icon: '🔔', roles: ['admin', 'teacher', 'student'] },
    { path: '/reports', label: 'Reports', icon: '📄', roles: ['admin', 'teacher'] },
    { divider: true, path: '', label: '', icon: '', roles: [] },
    { path: '/data-center', label: 'Data Center', icon: '💾', roles: ['admin'] },
    { path: '/settings', label: 'Settings', icon: '⚙️', roles: ['admin'] },
  ]

  const visibleItems = navItems.filter((item) =>
    item.divider || item.roles.includes(user?.role || '')
  )

  return (
    <>
      {/* Mobile Menu Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="md:hidden fixed bottom-6 right-6 z-50 w-14 h-14 bg-primary-500 hover:bg-primary-600 text-white rounded-full shadow-lg flex items-center justify-center text-xl transition-transform"
      >
        {isOpen ? '✕' : '☰'}
      </button>

      {/* Sidebar */}
      <aside
        className={`${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        } md:translate-x-0 fixed md:relative w-64 h-screen bg-white dark:bg-neutral-800 border-r border-neutral-200 dark:border-neutral-700 flex flex-col transition-transform duration-300 z-40`}
      >
        {/* Logo */}
        <div className="p-6 border-b border-neutral-200 dark:border-neutral-700">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-br from-primary-500 to-primary-600 rounded-lg flex items-center justify-center text-white font-bold text-lg">
              E
            </div>
            <div>
              <h1 className="text-xl font-bold text-primary-900 dark:text-primary-50">EDUVISION</h1>
              <p className="text-xs text-neutral-600 dark:text-neutral-400">AI Detection</p>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-4 py-6 space-y-2 overflow-y-auto">
          {visibleItems.map((item, idx) => {
            if (item.divider) {
              return (
                <div key={`divider-${idx}`} className="my-4 border-t border-neutral-200 dark:border-neutral-700" />
              )
            }

            return (
              <Link
                key={item.path}
                to={item.path}
                onClick={() => setIsOpen(false)}
                className={`flex items-center space-x-3 px-4 py-3 rounded-lg text-sm font-medium transition-all ${
                  isActive(item.path)
                    ? 'bg-primary-100 dark:bg-primary-900 text-primary-900 dark:text-primary-50 shadow-sm'
                    : 'text-neutral-700 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-700'
                }`}
              >
                <span className="text-lg w-5 text-center">{item.icon}</span>
                <span>{item.label}</span>
                {isActive(item.path) && (
                  <span className="ml-auto w-1 h-1 bg-primary-500 rounded-full"></span>
                )}
              </Link>
            )
          })}
        </nav>

        {/* Footer */}
        <div className="p-4 border-t border-neutral-200 dark:border-neutral-700">
          <p className="text-xs text-neutral-600 dark:text-neutral-400 text-center">
            EDUVISION AI v1.0
          </p>
          <p className="text-xs text-neutral-500 dark:text-neutral-500 text-center mt-1">
            Early Warning System
          </p>
        </div>
      </aside>

      {/* Mobile Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 md:hidden z-30"
          onClick={() => setIsOpen(false)}
        />
      )}
    </>
  )
}

export default Sidebar
