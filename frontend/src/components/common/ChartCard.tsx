import React from 'react'
import { SkeletonCard } from './Skeleton'

interface ChartCardProps {
  title: string
  subtitle?: string
  children: React.ReactNode
  loading?: boolean
  className?: string
  height?: number | string
}

const ChartCard: React.FC<ChartCardProps> = ({
  title,
  subtitle,
  children,
  loading = false,
  className = '',
  height,
}) => {
  return (
    <div
      className={`
        bg-white dark:bg-neutral-800 rounded-card shadow-card
        border border-neutral-200/60 dark:border-neutral-700/60
        overflow-hidden
        ${className}
      `}
    >
      {/* Header */}
      <div className="px-5 py-4 border-b border-neutral-200/60 dark:border-neutral-700/60">
        <h3 className="text-base font-semibold text-neutral-900 dark:text-neutral-50">{title}</h3>
        {subtitle && (
          <p className="text-sm text-neutral-500 dark:text-neutral-400 mt-0.5">{subtitle}</p>
        )}
      </div>

      {/* Content */}
      <div className="p-4" style={height ? { height: typeof height === 'number' ? `${height}px` : height } : undefined}>
        {loading ? (
          <div className="flex items-center justify-center h-full">
            <SkeletonCard />
          </div>
        ) : (
          children
        )}
      </div>
    </div>
  )
}

export default ChartCard
