import React from 'react'
import { useReveal } from '../../hooks/useReveal'

interface RevealProps {
  children: React.ReactNode
  variant?: 'fade-up' | 'fade-in' | 'scale-in'
  delay?: number
  once?: boolean
  className?: string
}

export const Reveal: React.FC<RevealProps> = ({
  children,
  variant = 'fade-up',
  delay = 0,
  className = '',
}) => {
  const [ref, isVisible] = useReveal<HTMLDivElement>(0.15)
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches

  const getAnimationStyle = (): React.CSSProperties => {
    if (prefersReducedMotion) {
      return { opacity: 1 }
    }

    if (!isVisible && !prefersReducedMotion) {
      // Initial state
      if (variant === 'fade-up') {
        return {
          opacity: 0,
          transform: 'translateY(24px)',
          transition: 'none',
        }
      } else if (variant === 'fade-in') {
        return {
          opacity: 0,
          transition: 'none',
        }
      } else if (variant === 'scale-in') {
        return {
          opacity: 0,
          transform: 'scale(0.92)',
          transition: 'none',
        }
      }
    }

    // Visible state
    if (variant === 'fade-up') {
      return {
        opacity: 1,
        transform: 'translateY(0)',
        transition: `opacity 0.5s ease-out, transform 0.5s ease-out`,
        transitionDelay: `${delay}ms`,
      }
    } else if (variant === 'fade-in') {
      return {
        opacity: 1,
        transition: `opacity 0.5s ease-out`,
        transitionDelay: `${delay}ms`,
      }
    } else if (variant === 'scale-in') {
      return {
        opacity: 1,
        transform: 'scale(1)',
        transition: `opacity 0.5s ease-out, transform 0.5s ease-out`,
        transitionDelay: `${delay}ms`,
      }
    }

    return {}
  }

  return (
    <div ref={ref} className={className} style={getAnimationStyle()}>
      {children}
    </div>
  )
}
