import React, { useState } from 'react'
import { AlertTriangle, Calendar, Target, Bell, CheckCheck } from 'lucide-react'
import { formatDistanceToNow } from 'date-fns'
import MainLayout from '../layouts/MainLayout'
import { useNotificationStore } from '../store/notificationsStore'
import type { AppNotification } from '../store/notificationsStore'
import EmptyState from '../components/common/EmptyState'

type TabType = 'all' | 'unread' | 'high-risk' | 'attendance' | 'intervention'

const Notifications: React.FC = () => {
  const { notifications, markAsRead, markAllAsRead } = useNotificationStore()
  const [activeTab, setActiveTab] = useState<TabType>('all')

  const tabs: { key: TabType; label: string }[] = [
    { key: 'all', label: 'All' },
    { key: 'unread', label: 'Unread' },
    { key: 'high-risk', label: 'High Risk' },
    { key: 'attendance', label: 'Attendance' },
    { key: 'intervention', label: 'Interventions' },
  ]

  const filteredNotifications = notifications
    .filter((n: AppNotification) => {
      switch (activeTab) {
        case 'unread':
          return !n.read
        case 'high-risk':
          return n.type === 'high-risk'
        case 'attendance':
          return n.type === 'attendance'
        case 'intervention':
          return n.type === 'intervention'
        default:
          return true
      }
    })
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())

  const getNotificationIcon = (type: AppNotification['type']) => {
    switch (type) {
      case 'high-risk':
        return <AlertTriangle className="w-5 h-5 text-red-500" />
      case 'attendance':
        return <Calendar className="w-5 h-5 text-amber-500" />
      case 'intervention':
        return <Target className="w-5 h-5 text-blue-500" />
      default:
        return <Bell className="w-5 h-5 text-gray-500" />
    }
  }

  const handleCardClick = (notification: AppNotification) => {
    if (!notification.read) {
      markAsRead(notification.id)
    }
  }

  const getEmptyDescription = () => {
    switch (activeTab) {
      case 'unread':
        return "You're all caught up!"
      case 'high-risk':
        return "No high-risk alerts at this time."
      case 'attendance':
        return "No attendance alerts at this time."
      case 'intervention':
        return "No intervention notifications at this time."
      default:
        return "No notifications to display."
    }
  }

  return (
    <MainLayout>
      <div className="space-y-5 page-enter">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-neutral-900 dark:text-neutral-50">
              Notifications
            </h1>
            <p className="text-neutral-500 dark:text-neutral-400 mt-2">
              Stay informed about student alerts and interventions
            </p>
          </div>
          <button
            onClick={markAllAsRead}
            className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-primary-600 hover:text-primary-700 hover:bg-primary-50 dark:hover:bg-primary-900/20 rounded-lg transition-colors"
          >
            <CheckCheck className="w-4 h-4" />
            Mark all as read
          </button>
        </div>

        {/* Tabs - Blue underline style */}
        <div className="border-b border-neutral-200 dark:border-neutral-700">
          <div className="flex gap-6 overflow-x-auto">
            {tabs.map((tab) => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                className={`pb-3 text-sm font-medium whitespace-nowrap transition-colors ${
                  activeTab === tab.key
                    ? 'text-blue-600 border-b-2 border-blue-600'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Notification List */}
        <div className="space-y-2">
          {filteredNotifications.length === 0 ? (
            <EmptyState
              icon={Bell}
              title="No notifications"
              description={getEmptyDescription()}
            />
          ) : (
            filteredNotifications.map((notification: AppNotification) => (
              <div
                key={notification.id}
                onClick={() => handleCardClick(notification)}
                className={`rounded-card border border-neutral-200/60 dark:border-neutral-700/60 p-4 transition-all cursor-pointer ${
                  notification.read
                    ? 'bg-white dark:bg-neutral-800 hover:bg-gray-50 dark:hover:bg-neutral-700/50'
                    : 'bg-blue-50 dark:bg-blue-900/20 hover:bg-blue-100 dark:hover:bg-blue-900/30'
                }`}
              >
                <div className="flex items-start gap-3">
                  {/* Unread indicator dot on LEFT */}
                  <div className="flex flex-col items-center gap-2 pt-1">
                    <span
                      className={`w-2 h-2 rounded-full flex-shrink-0 ${
                        notification.read ? 'bg-gray-200' : 'bg-blue-500'
                      }`}
                    />
                    {getNotificationIcon(notification.type)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p
                      className={`text-neutral-900 dark:text-neutral-100 ${
                        notification.read ? 'font-normal' : 'font-bold'
                      }`}
                    >
                      {notification.studentName}
                    </p>
                    <p className="text-sm text-neutral-500 dark:text-neutral-400 mt-1">
                      {notification.message}
                    </p>
                    <span className="text-xs text-neutral-400 dark:text-neutral-500 mt-2 block">
                      {formatDistanceToNow(new Date(notification.createdAt), { addSuffix: true })}
                    </span>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </MainLayout>
  )
}

export default Notifications
