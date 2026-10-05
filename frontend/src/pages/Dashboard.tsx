import React from 'react'
import { Link } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import MainLayout from '../layouts/MainLayout'
import { useAuth } from '../context/AuthContext'
import { dashboardApi } from '../services/api'

const Dashboard: React.FC = () => {
  const { user } = useAuth()
  const { data, isLoading, isError, error } = useQuery({
    queryKey: ['dashboard-metrics'],
    queryFn: dashboardApi.getMetrics,
  })

  return (
    <MainLayout>
      <div className="space-y-8">
        <div>
          <h1 className="text-3xl md:text-4xl font-bold text-neutral-900 dark:text-neutral-50">
            Welcome, {user?.name}
          </h1>
          <p className="text-neutral-600 dark:text-neutral-400 mt-2">
            Academic Intelligence Dashboard
          </p>
        </div>

        {isError && (
          <div className="p-4 rounded-lg bg-red-50 text-red-700 border border-red-200">
            Could not load dashboard metrics. {(error as Error)?.message || 'Check that the backend is running.'}
          </div>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <MetricCard title="Total Students" value={isLoading ? '…' : data?.total_students ?? 0} icon="👥" color="blue" />
          <MetricCard title="High Risk" value={isLoading ? '…' : data?.high_risk_count ?? 0} icon="🔴" color="red" />
          <MetricCard title="Medium Risk" value={isLoading ? '…' : data?.medium_risk_count ?? 0} icon="🟡" color="yellow" />
          <MetricCard title="Low Risk" value={isLoading ? '…' : data?.low_risk_count ?? 0} icon="🟢" color="green" />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <MetricCard title="Improving" value={isLoading ? '…' : data?.improving_count ?? 0} icon="📈" color="green" />
          <MetricCard title="Declining" value={isLoading ? '…' : data?.declining_count ?? 0} icon="📉" color="red" />
          <MetricCard title="Avg Attendance" value={isLoading ? '…' : `${data?.average_attendance ?? 0}%`} icon="📅" color="blue" />
          <MetricCard title="Avg Performance" value={isLoading ? '…' : `${data?.average_performance ?? 0}%`} icon="📝" color="yellow" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <QuickLink title="View Students" description="Manage and monitor student performance" icon="👥" href="/students" />
          <QuickLink title="Risk Analysis" description="Analyze student academic risk" icon="⚠️" href="/risk-analysis" />
          <QuickLink title="Interventions" description="Create and track interventions" icon="🎯" href="/interventions" />
        </div>
      </div>
    </MainLayout>
  )
}

interface MetricCardProps {
  title: string
  value: string | number
  icon: string
  color: 'blue' | 'red' | 'yellow' | 'green'
}

const MetricCard: React.FC<MetricCardProps> = ({ title, value, icon, color }) => {
  const colorClasses = {
    blue: 'bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-400',
    red: 'bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-400',
    yellow: 'bg-yellow-50 dark:bg-yellow-900/20 text-yellow-700 dark:text-yellow-400',
    green: 'bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-400',
  }

  return (
    <div className={`${colorClasses[color]} p-6 rounded-lg`}>
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium opacity-75">{title}</p>
          <p className="text-3xl font-bold mt-2">{value}</p>
        </div>
        <span className="text-4xl opacity-30">{icon}</span>
      </div>
    </div>
  )
}

interface QuickLinkProps {
  title: string
  description: string
  icon: string
  href: string
}

const QuickLink: React.FC<QuickLinkProps> = ({ title, description, icon, href }) => {
  return (
    <Link
      to={href}
      className="bg-white dark:bg-neutral-800 p-6 rounded-lg shadow-sm border border-neutral-200 dark:border-neutral-700 hover:shadow-md hover:border-primary-300 dark:hover:border-primary-700 transition-all"
    >
      <div className="flex items-start justify-between">
        <div>
          <h3 className="text-lg font-semibold text-neutral-900 dark:text-neutral-50">
            {title}
          </h3>
          <p className="text-sm text-neutral-600 dark:text-neutral-400 mt-1">
            {description}
          </p>
        </div>
        <span className="text-2xl">{icon}</span>
      </div>
    </Link>
  )
}

export default Dashboard
