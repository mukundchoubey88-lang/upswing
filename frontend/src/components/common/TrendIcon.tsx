import React from 'react'
import { TrendingUp, TrendingDown, Minus } from 'lucide-react'

interface TrendIconProps {
  trend: 'Improving' | 'Stable' | 'Declining'
  showLabel?: boolean
  size?: 'sm' | 'md'
  className?: string
}

const TrendIcon: React.FC<TrendIconProps> = ({ trend, showLabel = true, size = 'md', className = '' }) => {
  const config = {
    Improving: {
      icon: TrendingUp,
      color: 'text-green-600 dark:text-green-400',
      bgColor: 'bg-green-50 dark:bg-green-900/20',
    },
    Declining: {
      icon: TrendingDown,
      color: 'text-red-600 dark:text-red-400',
      bgColor: 'bg-red-50 dark:bg-red-900/20',
    },
    Stable: {
      icon: Minus,
      color: 'text-gray-500 dark:text-gray-400',
      bgColor: 'bg-gray-50 dark:bg-gray-900/20',
    },
  }

  const { icon: Icon, color, bgColor } = config[trend]
  const sizeMap = {
    sm: 'w-3.5 h-3.5',
    md: 'w-4 h-4',
  }

  return (
    <span className={`inline-flex items-center gap-1 ${className}`}>
      <span className={`p-1 rounded ${bgColor}`}>
        <Icon className={`${sizeMap[size]} ${color}`} />
      </span>
      {showLabel && <span className={`text-xs font-medium ${color}`}>{trend}</span>}
    </span>
  )
}

export default TrendIcon
