import React, { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { UpswingMark } from '../UpswingIntro'
import UpswingWordmark from '../UpswingWordmark'
import studentService from '../../services/studentService'
import {
  LayoutDashboard,
  Users,
  AlertTriangle,
  Target,
  Bell,
  FileText,
  Database,
  Settings
} from 'lucide-react'

interface NavItem {
  path: string
  label: string
  icon: React.ReactNode
  roles: string[]
  badge?: number
  divider?: boolean
}

const Sidebar: React.FC = () => {
  const { user } = useAuth()
  const location = useLocation()
  const [isOpen, setIsOpen] = useState(false)

  const stats = studentService.getStats()
  const highRiskCount = stats.high_risk_count

  const isActive = (path: string) => location.pathname === path || location.pathname.startsWith(path + '/')

  const navItems: NavItem[] = [
    { path: '/dashboard', label: 'Dashboard', icon: <LayoutDashboard className="w-5 h-5" />, roles: ['admin', 'teacher', 'student'] },
    { path: '/students', label: 'Students', icon: <Users className="w-5 h-5" />, roles: ['admin', 'teacher'] },
    { path: '/risk-analysis', label: 'Risk Analysis', icon: <AlertTriangle className="w-5 h-5" />, roles: ['admin', 'teacher'], badge: highRiskCount },
    { path: '/interventions', label: 'Interventions', icon: <Target className="w-5 h-5" />, roles: ['admin', 'teacher'] },
    { divider: true, path: '', label: '', icon: null, roles: [] },
    { path: '/notifications', label: 'Notifications', icon: <Bell className="w-5 h-5" />, roles: ['admin', 'teacher', 'student'] },
    { path: '/reports', label: 'Reports', icon: <FileText className="w-5 h-5" />, roles: ['admin', 'teacher'] },
    { divider: true, path: '', label: '', icon: null, roles: [] },
    { path: '/data-center', label: 'Data Center', icon: <Database className="w-5 h-5" />, roles: ['admin'] },
    { path: '/settings', label: 'Settings', icon: <Settings className="w-5 h-5" />, roles: ['admin'] },
  ]

  const visibleItems = navItems.filter((item) =>
    item.divider || item.roles.includes(user?.role || '')
  )

  return (
    <>
      {/* Mobile Menu Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="md:hidden fixed bottom-6 right-6 z-50 w-14 h-14 bg-gradient-to-br from-primary-500 to-primary-600 hover:from-primary-600 hover:to-primary-700 text-white rounded-full shadow-lg flex items-center justify-center text-xl transition-all"
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
          <Link to="/dashboard" className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-br from-primary-500 to-primary-700 rounded-xl flex items-center justify-center text-white font-bold text-lg shadow-md overflow-visible">
              <UpswingMark size={26} className="text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-neutral-900 dark:text-neutral-50">
                <UpswingWordmark />
              </h1>
              <p className="text-xs text-neutral-500 dark:text-neutral-400">Early Warning System</p>
            </div>
          </Link>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
          {visibleItems.map((item, idx) => {
            if (item.divider) {
              return (
                <div key={`divider-${idx}`} className="my-3 border-t border-neutral-200 dark:border-neutral-700" />
              )
            }

            const active = isActive(item.path)
            return (
              <Link
                key={item.path}
                to={item.path}
                onClick={() => setIsOpen(false)}
                className={`
                  flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all relative
                  ${active
                    ? 'bg-primary-50 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300 shadow-sm'
                    : 'text-neutral-600 dark:text-neutral-400 hover:bg-neutral-100 dark:hover:bg-neutral-700/50 hover:text-neutral-900 dark:hover:text-neutral-200'
                  }
                `}
              >
                {/* Active accent bar */}
                {active && (
                  <span className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-6 bg-primary-500 rounded-r-full" />
                )}
                <span className={`${active ? 'text-primary-600 dark:text-primary-400' : ''}`}>
                  {item.icon}
                </span>
                <span className="flex-1">{item.label}</span>
                {item.badge !== undefined && item.badge > 0 && (
                  <span className="px-2 py-0.5 text-xs font-bold bg-red-100 text-red-700 dark:bg-red-900/50 dark:text-red-300 rounded-full">
                    {item.badge}
                  </span>
                )}
              </Link>
            )
          })}
        </nav>

        {/* Footer */}
        <div className="p-4 border-t border-neutral-200 dark:border-neutral-700">
          <p className="text-xs text-neutral-500 dark:text-neutral-400 text-center">
            UPswing v1.0 · © 2026 UPswing
          </p>
          <p className="text-xs text-neutral-400 dark:text-neutral-500 text-center mt-1">
            Early Warning System
          </p>
        </div>
      </aside>

      {/* Mobile Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 md:hidden z-30"
          onClick={() => setIsOpen(false)}
        />
      )}
    </>
  )
}

export default Sidebar
