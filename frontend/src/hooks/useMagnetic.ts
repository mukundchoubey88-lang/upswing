import { useRef, useState, useCallback, CSSProperties } from 'react'

export function useMagnetic(strength = 0.35): {
  ref: React.RefObject<HTMLButtonElement>
  style: CSSProperties
  onMouseMove: (e: React.MouseEvent<HTMLButtonElement>) => void
  onMouseLeave: () => void
} {
  const ref = useRef<HTMLButtonElement>(null)
  const [style, setStyle] = useState<CSSProperties>({
    transform: 'translate(0, 0)',
    transition: 'transform 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)',
  })

  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches

  const handleMouseMove = useCallback(
    (e: React.MouseEvent<HTMLButtonElement>) => {
      if (prefersReducedMotion || !ref.current) return

      const rect = ref.current.getBoundingClientRect()
      const centerX = rect.left + rect.width / 2
      const centerY = rect.top + rect.height / 2

      const x = e.clientX - centerX
      const y = e.clientY - centerY

      const distance = Math.sqrt(x * x + y * y)
      const maxDistance = Math.sqrt(rect.width * rect.width + rect.height * rect.height)

      if (distance < maxDistance * 2) {
        const translateX = (x / maxDistance) * strength * 40
        const translateY = (y / maxDistance) * strength * 40

        setStyle({
          transform: `translate(${translateX}px, ${translateY}px)`,
          transition: 'none',
        })
      }
    },
    [strength, prefersReducedMotion]
  )

  const handleMouseLeave = useCallback(() => {
    setStyle({
      transform: 'translate(0, 0)',
      transition: 'transform 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)',
    })
  }, [])

  return {
    ref,
    style,
    onMouseMove: handleMouseMove,
    onMouseLeave: handleMouseLeave,
  }
}
