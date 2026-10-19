import React from 'react'
import { useNavigate } from 'react-router-dom'
import { UpswingMark } from '../../../components/UpswingIntro'
import { useReveal } from '../../../hooks/useReveal'
import { useMagnetic } from '../../../hooks/useMagnetic'
import { Reveal } from '../../../components/common/Reveal'

const FinalCTA: React.FC = () => {
  const navigate = useNavigate()
  const [ref, isVisible] = useReveal<HTMLElement>(0.3)
  const { ref: buttonRef, style: magneticStyle, onMouseMove, onMouseLeave } = useMagnetic(0.3)

  return (
    <section ref={ref} className="py-24 bg-white dark:bg-neutral-900 border-t border-neutral-200 dark:border-neutral-700">
      <div className="max-w-[1200px] mx-auto px-6">
        <Reveal variant="scale-in" delay={0} className="text-center space-y-8">
          {/* Animated mark */}
          <div className="flex justify-center" style={{ opacity: isVisible ? 1 : 0, transition: 'opacity 0.5s ease-out' }}>
            <div
              style={{
                animation: isVisible ? 'draw-mark 1.5s ease-out 0.3s forwards' : 'none',
                opacity: 0,
              }}
            >
              <UpswingMark size={80} />
            </div>
            <style>{`
              @keyframes draw-mark {
                to {
                  opacity: 1;
                }
              }
            `}</style>
          </div>

          {/* Heading */}
          <h2 className="text-3xl sm:text-5xl font-bold text-neutral-900 dark:text-neutral-50">
            Ready to lift every student?
          </h2>

          {/* Subtext */}
          <p className="text-lg text-neutral-600 dark:text-neutral-400 max-w-2xl mx-auto">
            Start detecting risk early and intervening with precision today.
          </p>

          {/* CTA Button */}
          <button
            ref={buttonRef}
            onClick={() => navigate('/login')}
            style={magneticStyle}
            onMouseMove={onMouseMove}
            onMouseLeave={onMouseLeave}
            className="inline-flex px-8 py-4 bg-primary-600 dark:bg-primary-500 text-white font-semibold text-lg rounded-lg hover:bg-primary-700 dark:hover:bg-primary-600 transition-colors focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 dark:focus:ring-offset-neutral-900"
          >
            Launch demo
          </button>
        </Reveal>
      </div>
    </section>
  )
}

export default FinalCTA
