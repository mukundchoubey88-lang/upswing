import React from 'react'

interface RiskBadgeProps {
  level: 'High' | 'Medium' | 'Low'
  size?: 'sm' | 'md'
  className?: string
}

const RiskBadge: React.FC<RiskBadgeProps> = ({ level, size = 'md', className = '' }) => {
  const colorMap = {
    High: 'bg-red-100 text-red-700 border-red-200 dark:bg-red-900/30 dark:text-red-400 dark:border-red-800',
    Medium: 'bg-amber-100 text-amber-700 border-amber-200 dark:bg-amber-900/30 dark:text-amber-400 dark:border-amber-800',
    Low: 'bg-green-100 text-green-700 border-green-200 dark:bg-green-900/30 dark:text-green-400 dark:border-green-800',
  }

  const sizeMap = {
    sm: 'px-2 py-0.5 text-xs',
    md: 'px-2.5 py-1 text-xs',
  }

  return (
    <span
      className={`
        inline-flex items-center font-semibold rounded-full border
        ${colorMap[level]}
        ${sizeMap[size]}
        ${className}
      `}
    >
      {level}
    </span>
  )
}

export default RiskBadge
