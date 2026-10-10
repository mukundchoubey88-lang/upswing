import React, { useState } from 'react'
import { Bell, AlertTriangle, Calendar, Target, Info, Check, CheckCheck } from 'lucide-react'
import { formatDistanceToNow } from 'date-fns'
import MainLayout from '../layouts/MainLayout'
import { useNotificationStore, AppNotification } from '../store/notificationsStore'
import EmptyState from '../components/common/EmptyState'

type TabType = 'all' | 'unread' | 'high-risk' | 'attendance' | 'intervention'

const Notifications: React.FC = () => {
  const { notifications, unreadCount, markAsRead, markAllAsRead } = useNotificationStore()
  const [activeTab, setActiveTab] = useState<TabType>('all')

  const tabs: { key: TabType; label: string; count?: number }[] = [
    { key: 'all', label: 'All', count: notifications.length },
    { key: 'unread', label: 'Unread', count: unreadCount },
    { key: 'high-risk', label: 'High Risk', count: notifications.filter(n => n.type === 'high-risk').length },
    { key: 'attendance', label: 'Attendance', count: notifications.filter(n => n.type === 'attendance').length },
    { key: 'intervention', label: 'Interventions', count: notifications.filter(n => n.type === 'intervention').length },
  ]

  const filteredNotifications = notifications.filter(n => {
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

  const getNotificationIcon = (type: AppNotification['type']) => {
    switch (type) {
      case 'high-risk':
        return <AlertTriangle className="w-5 h-5 text-red-500" />
      case 'attendance':
        return <Calendar className="w-5 h-5 text-amber-500" />
      case 'intervention':
        return <Target className="w-5 h-5 text-blue-500" />
      case 'performance':
        return <Info className="w-5 h-5 text-purple-500" />
      default:
        return <Bell className="w-5 h-5 text-gray-500" />
    }
  }

  const getNotificationBg = (type: AppNotification['type'], read: boolean) => {
    if (read) return 'bg-white dark:bg-neutral-800'
    switch (type) {
      case 'high-risk':
        return 'bg-red-50/50 dark:bg-red-900/20'
      case 'attendance':
        return 'bg-amber-50/50 dark:bg-amber-900/20'
      case 'intervention':
        return 'bg-blue-50/50 dark:bg-blue-900/20'
      default:
        return 'bg-blue-50/50 dark:bg-blue-900/10'
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
              Stay updated on student alerts and interventions
            </p>
          </div>
          {unreadCount > 0 && (
            <button
              onClick={markAllAsRead}
              className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-primary-600 hover:text-primary-700 hover:bg-primary-50 dark:hover:bg-primary-900/20 rounded-lg transition-colors"
            >
              <CheckCheck className="w-4 h-4" />
              Mark all as read
            </button>
          )}
        </div>

        {/* Tabs */}
        <div className="bg-white dark:bg-neutral-800 rounded-card shadow-card border border-neutral-200/60 dark:border-neutral-700/60 p-1">
          <div className="flex gap-1 overflow-x-auto">
            {tabs.map((tab) => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                className={`flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-lg transition-colors whitespace-nowrap ${
                  activeTab === tab.key
                    ? 'bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300'
                    : 'text-neutral-600 dark:text-neutral-400 hover:bg-neutral-100 dark:hover:bg-neutral-700'
                }`}
              >
                {tab.label}
                {tab.count !== undefined && tab.count > 0 && (
                  <span className={`px-1.5 py-0.5 text-xs font-bold rounded-full ${
                    activeTab === tab.key
                      ? 'bg-primary-200 dark:bg-primary-800 text-primary-700 dark:text-primary-300'
                      : 'bg-neutral-200 dark:bg-neutral-600 text-neutral-600 dark:text-neutral-300'
                  }`}>
                    {tab.count}
                  </span>
                )}
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
              description={activeTab === 'unread' ? "You're all caught up!" : `No ${activeTab === 'all' ? '' : activeTab} notifications.`}
            />
          ) : (
            filteredNotifications.map((notification) => (
              <div
                key={notification.id}
                className={`rounded-card border border-neutral-200/60 dark:border-neutral-700/60 p-4 transition-all hover:shadow-card ${getNotificationBg(notification.type, notification.read)}`}
              >
                <div className="flex items-start gap-4">
                  <div className="mt-1">{getNotificationIcon(notification.type)}</div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <p className={`font-medium ${notification.read ? 'text-neutral-700 dark:text-neutral-300' : 'text-neutral-900 dark:text-neutral-100'}`}>
                        {notification.title}
                      </p>
                      {!notification.read && (
                        <span className="w-2 h-2 bg-blue-500 rounded-full flex-shrink-0 mt-1.5" />
                      )}
                    </div>
                    <p className="text-sm text-neutral-500 dark:text-neutral-400 mt-1">
                      {notification.message}
                    </p>
                    <div className="flex items-center justify-between mt-3">
                      <span className="text-xs text-neutral-400 dark:text-neutral-500">
                        {formatDistanceToNow(new Date(notification.createdAt), { addSuffix: true })}
                      </span>
                      {!notification.read && (
                        <button
                          onClick={() => markAsRead(notification.id)}
                          className="flex items-center gap-1 text-xs text-primary-600 hover:text-primary-700 font-medium"
                        >
                          <Check className="w-3 h-3" />
                          Mark as read
                        </button>
                      )}
                    </div>
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
