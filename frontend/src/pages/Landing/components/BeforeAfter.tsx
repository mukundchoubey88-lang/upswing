import React, { useState, useRef, useEffect } from 'react'
import { Reveal } from '../../../components/common/Reveal'

const BeforeAfter: React.FC = () => {
  const [sliderPos, setSliderPos] = useState(50)
  const containerRef = useRef<HTMLDivElement>(null)
  const isDragging = useRef(false)

  const handleMouseDown = () => {
    isDragging.current = true
  }

  useEffect(() => {
    const handleMouseUp = () => {
      isDragging.current = false
    }

    const handleMouseMove = (e: MouseEvent) => {
      if (!isDragging.current || !containerRef.current) return

      const rect = containerRef.current.getBoundingClientRect()
      const newPos = Math.max(0, Math.min(100, ((e.clientX - rect.left) / rect.width) * 100))
      setSliderPos(newPos)
    }

    document.addEventListener('mouseup', handleMouseUp)
    document.addEventListener('mousemove', handleMouseMove)

    return () => {
      document.removeEventListener('mouseup', handleMouseUp)
      document.removeEventListener('mousemove', handleMouseMove)
    }
  }, [])

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowLeft') {
      setSliderPos((p) => Math.max(0, p - 5))
    } else if (e.key === 'ArrowRight') {
      setSliderPos((p) => Math.min(100, p + 5))
    }
  }

  return (
    <section className="py-24 bg-white dark:bg-neutral-900">
      <div className="max-w-[1200px] mx-auto px-6">
        <Reveal variant="fade-up" delay={0} className="text-center mb-12">
          <h2 className="text-3xl sm:text-4xl font-bold text-neutral-900 dark:text-neutral-50 mb-4">
            Interventions that work, measured
          </h2>
          <p className="text-lg text-neutral-600 dark:text-neutral-400">
            Track real improvements in student performance after intervention.
          </p>
        </Reveal>

        <Reveal variant="scale-in" delay={100}>
          <div className="max-w-2xl mx-auto">
            <div
              ref={containerRef}
              className="relative w-full h-96 rounded-2xl overflow-hidden bg-neutral-100 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 cursor-col-resize"
              onMouseDown={handleMouseDown}
            >
              {/* Before side - red declining line */}
              <div className="absolute inset-0">
                <svg className="w-full h-full" viewBox="0 0 400 300" preserveAspectRatio="xMidYMid slice">
                  {/* Grid */}
                  <defs>
                    <pattern id="grid" width="40" height="30" patternUnits="userSpaceOnUse">
                      <path d="M 40 0 L 0 0 0 30" fill="none" stroke="rgba(0,0,0,0.05)" strokeWidth="0.5" />
                    </pattern>
                  </defs>
                  <rect width="400" height="300" fill="url(#grid)" />

                  {/* Before line - declining */}
                  <polyline
                    points="40,80 80,70 120,60 160,75 200,90 240,110 280,130 320,150 360,170"
                    fill="none"
                    stroke="#ef4444"
                    strokeWidth="3"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />

                  {/* Area under before line */}
                  <polygon
                    points="40,80 80,70 120,60 160,75 200,90 240,110 280,130 320,150 360,170 360,300 40,300"
                    fill="rgba(239, 68, 68, 0.1)"
                  />

                  {/* Y-axis label */}
                  <text x="15" y="30" fontSize="12" fill="rgba(0,0,0,0.4)" fontFamily="sans-serif">
                    Risk
                  </text>
                  <text x="15" y="290" fontSize="12" fill="rgba(0,0,0,0.4)" fontFamily="sans-serif">
                    Low
                  </text>

                  {/* Before label */}
                  <text x="50" y="30" fontSize="14" fontWeight="bold" fill="#ef4444" fontFamily="sans-serif">
                    BEFORE
                  </text>
                </svg>
              </div>

              {/* After side - green improving line */}
              <div className="absolute inset-0" style={{ clipPath: `inset(0 ${100 - sliderPos}% 0 0)` }}>
                <svg className="w-full h-full" viewBox="0 0 400 300" preserveAspectRatio="xMidYMid slice">
                  {/* Grid */}
                  <rect width="400" height="300" fill="url(#grid)" />

                  {/* After line - declining then improving */}
                  <polyline
                    points="40,80 80,70 120,60 160,75 200,90 200,100 240,80 280,50 320,30 360,20"
                    fill="none"
                    stroke="#10b981"
                    strokeWidth="3"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />

                  {/* Area under after line */}
                  <polygon
                    points="40,80 80,70 120,60 160,75 200,90 200,100 240,80 280,50 320,30 360,20 360,300 40,300"
                    fill="rgba(16, 185, 129, 0.1)"
                  />

                  {/* After label */}
                  <text x="50" y="30" fontSize="14" fontWeight="bold" fill="#10b981" fontFamily="sans-serif">
                    AFTER
                  </text>

                  {/* Intervention marker */}
                  <circle cx="200" cy="95" r="6" fill="#10b981" />
                  <text x="200" y="115" fontSize="11" fill="#10b981" textAnchor="middle" fontFamily="sans-serif">
                    Intervention
                  </text>
                </svg>
              </div>

              {/* Divider handle */}
              <div
                className="absolute top-0 bottom-0 w-1 bg-primary-600 dark:bg-primary-400 cursor-col-resize transition-all"
                style={{ left: `${sliderPos}%` }}
              >
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-12 h-12 flex items-center justify-center">
                  <div className="w-10 h-10 rounded-full bg-primary-600 dark:bg-primary-400 flex items-center justify-center text-white shadow-lg">
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M8 5a1 1 0 011-1h2a1 1 0 011 1v4h4a1 1 0 011 1v2a1 1 0 01-1 1h-4v4a1 1 0 01-1 1h-2a1 1 0 01-1-1v-4H4a1 1 0 01-1-1v-2a1 1 0 011-1h4V5z" />
                    </svg>
                  </div>
                </div>
              </div>

              {/* Focus label for accessibility */}
              <div
                className="absolute bottom-4 left-1/2 -translate-x-1/2 text-xs text-neutral-600 dark:text-neutral-400"
                onKeyDown={handleKeyDown}
                tabIndex={0}
                role="slider"
                aria-label="Comparison slider, use arrow keys to adjust"
                aria-valuemin={0}
                aria-valuemax={100}
                aria-valuenow={sliderPos}
              />
            </div>

            {/* Caption */}
            <div className="mt-6 text-center">
              <p className="text-sm font-medium text-neutral-600 dark:text-neutral-400 mb-2">
                Drag to compare, or use arrow keys
              </p>
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-amber-50 dark:bg-amber-900/30 text-amber-700 dark:text-amber-300 rounded-full text-xs font-semibold">
                <span>📊</span> Illustrative data
              </div>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  )
}

export default BeforeAfter
