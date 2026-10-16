import { useRef, useState, useCallback, CSSProperties } from 'react'

export function useTilt(maxDeg = 12): {
  ref: React.RefObject<HTMLDivElement>
  style: CSSProperties
  onMouseMove: (e: React.MouseEvent<HTMLDivElement>) => void
  onMouseLeave: () => void
} {
  const ref = useRef<HTMLDivElement>(null)
  const [style, setStyle] = useState<CSSProperties>({
    transform: 'rotateX(0deg) rotateY(0deg)',
    transition: 'transform 0.3s ease-out',
  })

  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches

  const handleMouseMove = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      if (prefersReducedMotion || !ref.current) return

      const rect = ref.current.getBoundingClientRect()
      const centerX = rect.left + rect.width / 2
      const centerY = rect.top + rect.height / 2

      const x = e.clientX - centerX
      const y = e.clientY - centerY

      const rotateX = -(y / rect.height) * maxDeg
      const rotateY = (x / rect.width) * maxDeg

      setStyle({
        transform: `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`,
        transition: 'none',
      })
    },
    [maxDeg, prefersReducedMotion]
  )

  const handleMouseLeave = useCallback(() => {
    setStyle({
      transform: 'rotateX(0deg) rotateY(0deg)',
      transition: 'transform 0.3s ease-out',
    })
  }, [])

  return {
    ref,
    style,
    onMouseMove: handleMouseMove,
    onMouseLeave: handleMouseLeave,
  }
}
