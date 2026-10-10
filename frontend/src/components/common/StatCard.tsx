import React, { useState, useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import { LucideIcon } from 'lucide-react'

interface StatCardProps {
  title: string
  value: number | string
  icon: LucideIcon
  color: 'blue' | 'red' | 'amber' | 'green'
  trend?: string
  trendLabel?: string
  to?: string
  className?: string
}

const colorConfig = {
  blue: {
    bg: 'bg-gradient-to-br from-blue-500 to-blue-600',
    light: 'bg-blue-50 dark:bg-blue-900/20',
    text: 'text-blue-700 dark:text-blue-400',
    gradient: 'from-blue-500 to-blue-600',
  },
  red: {
    bg: 'bg-gradient-to-br from-red-500 to-red-600',
    light: 'bg-red-50 dark:bg-red-900/20',
    text: 'text-red-700 dark:text-red-400',
    gradient: 'from-red-500 to-red-600',
  },
  amber: {
    bg: 'bg-gradient-to-br from-amber-500 to-amber-600',
    light: 'bg-amber-50 dark:bg-amber-900/20',
    text: 'text-amber-700 dark:text-amber-400',
    gradient: 'from-amber-500 to-amber-600',
  },
  green: {
    bg: 'bg-gradient-to-br from-green-500 to-green-600',
    light: 'bg-green-50 dark:bg-green-900/20',
    text: 'text-green-700 dark:text-green-400',
    gradient: 'from-green-500 to-green-600',
  },
}

const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  icon: Icon,
  color,
  trend,
  trendLabel,
  to,
  className = '',
}) => {
  const [displayValue, setDisplayValue] = useState<number | string>(typeof value === 'number' ? 0 : value)
  const rafRef = useRef<number | null>(null)
  const startTimeRef = useRef<number | null>(null)
  
  const config = colorConfig[color]

  // Count-up animation for numeric values
  useEffect(() => {
    if (typeof value !== 'number') {
      setDisplayValue(value)
      return
    }

    const targetValue = value
    const duration = 500 // ms
    
    const animate = (timestamp: number) => {
      if (!startTimeRef.current) {
        startTimeRef.current = timestamp
      }
      
      const progress = Math.min((timestamp - startTimeRef.current) / duration, 1)
      const easeOutProgress = 1 - Math.pow(1 - progress, 3) // Ease out cubic
      const currentValue = Math.round(targetValue * easeOutProgress)
      
      setDisplayValue(currentValue)
      
      if (progress < 1) {
        rafRef.current = requestAnimationFrame(animate)
      }
    }
    
    rafRef.current = requestAnimationFrame(animate)
    
    return () => {
      if (rafRef.current) {
        cancelAnimationFrame(rafRef.current)
      }
    }
  }, [value])

  const cardContent = (
    <div
      className={`
        bg-white dark:bg-neutral-800 rounded-card shadow-card border border-neutral-200/60 dark:border-neutral-700/60
        p-5 transition-all duration-150
        ${to ? 'cursor-pointer hover:-translate-y-0.5 hover:shadow-card-hover' : ''}
        ${className}
      `}
    >
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <p className="text-sm font-medium text-neutral-500 dark:text-neutral-400">
            {title}
          </p>
          <p className="text-3xl font-bold text-neutral-900 dark:text-neutral-50 mt-2 tabular-nums">
            {typeof value === 'number' ? displayValue : value}
            {typeof value === 'number' && String(value).includes('%') ? '' : ''}
          </p>
          {(trend || trendLabel) && (
            <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-2">
              {trend && <span className="font-medium">{trend}</span>}
              {trend && trendLabel && ' '}
              {trendLabel && <span>{trendLabel}</span>}
            </p>
          )}
        </div>
        <div className={`w-12 h-12 rounded-xl ${config.bg} flex items-center justify-center shadow-sm`}>
          <Icon className="w-6 h-6 text-white" />
        </div>
      </div>
    </div>
  )

  if (to) {
    return (
      <Link to={to} className="block">
        {cardContent}
      </Link>
    )
  }

  return cardContent
}

export default StatCard
