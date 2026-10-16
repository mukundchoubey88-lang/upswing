import { useState, useEffect, useRef } from 'react'

export function useCountUp(target: number, duration = 1200, start = true): number {
  const [value, setValue] = useState(0)
  const frameRef = useRef<number>()
  const startTimeRef = useRef<number>()
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches

  useEffect(() => {
    if (!start) return

    if (prefersReducedMotion) {
      setValue(target)
      return
    }

    const animate = (timestamp: number) => {
      if (!startTimeRef.current) {
        startTimeRef.current = timestamp
      }

      const elapsed = timestamp - startTimeRef.current
      const progress = Math.min(elapsed / duration, 1)

      // Easing function: ease-out-quad
      const easeProgress = 1 - (1 - progress) * (1 - progress)
      const currentValue = Math.floor(target * easeProgress)

      setValue(currentValue)

      if (progress < 1) {
        frameRef.current = requestAnimationFrame(animate)
      }
    }

    frameRef.current = requestAnimationFrame(animate)

    return () => {
      if (frameRef.current) {
        cancelAnimationFrame(frameRef.current)
      }
    }
  }, [target, duration, start, prefersReducedMotion])

  return value
}
