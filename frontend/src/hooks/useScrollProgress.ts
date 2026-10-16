import { useRef, useState, useEffect } from 'react'

export function useScrollProgress<T extends Element>(): [React.RefObject<T>, number] {
  const ref = useRef<T>(null)
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    const element = ref.current
    if (!element) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          // Calculate progress: 0 when element enters, 1 when element leaves
          const { top, height } = entry.boundingClientRect
          const viewportHeight = window.innerHeight

          // When element top is at viewport top, progress = 0
          // When element bottom is at viewport bottom, progress = 1
          const elementStart = top
          const elementEnd = top + height

          // Calculate how much of the element is visible
          const visibleStart = Math.max(elementStart, 0)
          const visibleEnd = Math.min(elementEnd, viewportHeight)

          // Progress from when element enters to when it leaves
          const totalTravel = height + viewportHeight
          const currentTravel = viewportHeight - elementStart

          const calculatedProgress = Math.max(0, Math.min(1, currentTravel / totalTravel))
          setProgress(calculatedProgress)
        }
      },
      { threshold: [0, 0.25, 0.5, 0.75, 1] }
    )

    observer.observe(element)

    return () => {
      observer.unobserve(element)
    }
  }, [])

  return [ref, progress]
}
