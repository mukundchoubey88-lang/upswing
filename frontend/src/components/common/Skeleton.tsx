import React from 'react'

interface SkeletonProps {
  className?: string
  variant?: 'text' | 'card' | 'circle'
  width?: string | number
  height?: string | number
  lines?: number
}

const Skeleton: React.FC<SkeletonProps> = ({
  className = '',
  variant = 'text',
  width,
  height,
  lines,
}) => {
  const baseClasses = 'skeleton rounded'

  const variantClasses = {
    text: 'h-4 w-full rounded',
    card: 'h-32 w-full rounded-card',
    circle: 'w-10 h-10 rounded-full',
  }

  if (variant === 'text' && lines && lines > 1) {
    return (
      <div className={`space-y-2 ${className}`}>
        {Array.from({ length: lines }).map((_, i) => (
          <div
            key={i}
            className={`${baseClasses} ${variantClasses.text}`}
            style={{ width: i === lines - 1 ? '75%' : '100%' }}
          />
        ))}
      </div>
    )
  }

  const style: React.CSSProperties = {}
  if (width) style.width = typeof width === 'number' ? `${width}px` : width
  if (height) style.height = typeof height === 'number' ? `${height}px` : height

  return (
    <div
      className={`${baseClasses} ${variantClasses[variant]} ${className}`}
      style={style}
    />
  )
}

// Skeleton Card component for loading states
export const SkeletonCard: React.FC<{ className?: string }> = ({ className = '' }) => {
  return (
    <div className={`bg-white dark:bg-neutral-800 rounded-card shadow-card border border-neutral-200/60 dark:border-neutral-700/60 p-5 ${className}`}>
      <div className="flex items-start justify-between">
        <div className="flex-1 space-y-3 w-full">
          <Skeleton variant="text" />
          <Skeleton variant="text" />
          <Skeleton variant="text" width="50%" />
        </div>
        <Skeleton variant="circle" />
      </div>
    </div>
  )
}

// Skeleton Table Row
export const SkeletonTableRow: React.FC<{ columns?: number; className?: string }> = ({
  columns = 5,
  className = '',
}) => {
  return (
    <tr className={`border-t border-neutral-200 dark:border-neutral-700 ${className}`}>
      {Array.from({ length: columns }).map((_, i) => (
        <td key={i} className="px-4 py-3">
          <Skeleton variant="text" width={i === 0 ? 100 : i === columns - 1 ? 60 : 80} />
        </td>
      ))}
    </tr>
  )
}

export default Skeleton
