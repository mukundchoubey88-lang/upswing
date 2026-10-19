import React, { useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { AreaChart, Area, PieChart, Pie, Cell, ResponsiveContainer } from 'recharts'
import studentService from '../../../services/studentService'
import { useCountUp } from '../../../hooks/useCountUp'
import { useReveal } from '../../../hooks/useReveal'
import { useTilt } from '../../../hooks/useTilt'
import { useMagnetic } from '../../../hooks/useMagnetic'
import { Reveal } from '../../../components/common/Reveal'

const Hero: React.FC = () => {
  const navigate = useNavigate()
  const [ref, isVisible] = useReveal<HTMLElement>(0.3)
  const { ref: tiltRef, style: tiltStyle, onMouseMove: onTiltMouseMove, onMouseLeave: onTiltMouseLeave } = useTilt(8)
  const { ref: magneticRef1, style: magneticStyle1, onMouseMove: onMag1Move, onMouseLeave: onMag1Leave } = useMagnetic(0.3)
  const { ref: magneticRef2, style: magneticStyle2, onMouseMove: onMag2Move, onMouseLeave: onMag2Leave } = useMagnetic(0.3)
  const cursorGlowRef = useRef<HTMLDivElement>(null)
  const stats = studentService.getStats()

  const countStudents = useCountUp(stats.total_students, 1000, isVisible)
  const countRiskFactors = useCountUp(stats.total_students * 12, 1200, isVisible)
  const countInterventions = useCountUp(stats.active_interventions, 1100, isVisible)

  // Cursor glow effect
  useEffect(() => {
    const container = tiltRef.current?.parentElement
    if (!container) return

    const handleMouseMove = (e: MouseEvent) => {
      if (cursorGlowRef.current) {
        const rect = container.getBoundingClientRect()
        const x = e.clientX - rect.left
        const y = e.clientY - rect.top
        cursorGlowRef.current.style.left = `${x}px`
        cursorGlowRef.current.style.top = `${y}px`
      }
    }

    container.addEventListener('mousemove', handleMouseMove)
    return () => container.removeEventListener('mousemove', handleMouseMove)
  }, [tiltRef])

  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches

  // Animated underline for "upswing"
  const underlineStyle = prefersReducedMotion
    ? { opacity: 1 }
    : {
        animation: 'swing-underline 1.2s ease-out 0.8s forwards',
        opacity: 0,
      }

  const trendData = [
    { name: 'W1', value: 65 },
    { name: 'W2', value: 68 },
    { name: 'W3', value: 70 },
    { name: 'W4', value: 72 },
    { name: 'W5', value: 75 },
    { name: 'W6', value: 78 },
    { name: 'W7', value: 82 },
    { name: 'W8', value: 85 },
  ]

  const riskData = [
    { name: 'High', value: stats.high_risk_count, fill: '#ef4444' },
    { name: 'Medium', value: stats.medium_risk_count, fill: '#f59e0b' },
    { name: 'Low', value: stats.low_risk_count, fill: '#10b981' },
  ]

  const statTiles = [
    { label: 'Total', value: stats.total_students, color: 'bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400' },
    { label: 'High', value: stats.high_risk_count, color: 'bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400' },
    { label: 'Medium', value: stats.medium_risk_count, color: 'bg-amber-50 dark:bg-amber-900/20 text-amber-600 dark:text-amber-400' },
    { label: 'Low', value: stats.low_risk_count, color: 'bg-green-50 dark:bg-green-900/20 text-green-600 dark:text-green-400' },
  ]

  return (
    <>
      <style>{`
        @keyframes swing-underline {
          0% { 
            width: 0;
            opacity: 0;
          }
          100% {
            width: 100%;
            opacity: 1;
          }
        }
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-8px); }
        }
        .floating-badge {
          animation: float 3s ease-in-out infinite;
        }
      `}</style>

      <section id="home" ref={ref} className="relative min-h-screen flex items-center justify-center pt-24 pb-12 overflow-hidden bg-white dark:bg-neutral-900">
        {/* Background elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {/* Radial glow */}
          <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-96 h-96 bg-primary-300/20 dark:bg-primary-500/10 rounded-full blur-3xl" />

          {/* SVG line drawing itself */}
          <svg className="absolute inset-0 w-full h-full" style={{ opacity: 0.3 }}>
            <path
              d="M 100 500 Q 300 300, 500 200 T 1000 100"
              stroke="currentColor"
              strokeWidth="2"
              fill="none"
              className="text-primary-300 dark:text-primary-600"
              style={{
                strokeDasharray: 1000,
                strokeDashoffset: 1000,
                animation: prefersReducedMotion ? 'none' : 'dash 2s ease-out 0.5s forwards',
              }}
            />
          </svg>

          {/* Dotted grid background */}
          <div
            className="absolute inset-0 opacity-20 dark:opacity-10"
            style={{
              backgroundImage: 'radial-gradient(circle, currentColor 1px, transparent 1px)',
              backgroundSize: '40px 40px',
              color: 'rgb(59, 130, 246)',
            }}
          />
        </div>

        <style>{`
          @keyframes dash {
            to {
              stroke-dashoffset: 0;
            }
          }
        `}</style>

        <div className="max-w-[1200px] mx-auto px-6 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center relative z-10">
          {/* Left column */}
          <Reveal variant="fade-up" delay={100}>
            <div className="space-y-6">
              <div className="inline-block">
                <span className="text-sm font-semibold text-primary-600 dark:text-primary-400 uppercase tracking-wider">
                  Early Warning System
                </span>
              </div>

              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold leading-tight text-neutral-900 dark:text-neutral-50">
                Spot the dip. Fuel the{' '}
                <span className="relative inline-block text-primary-600 dark:text-primary-400">
                  upswing
                  <svg className="absolute -bottom-2 left-0 w-full h-2 overflow-visible" viewBox="0 0 200 20" preserveAspectRatio="none">
                    <path
                      d="M 10 15 Q 50 5, 100 10 Q 150 15, 190 5"
                      stroke="currentColor"
                      strokeWidth="2"
                      fill="none"
                      strokeLinecap="round"
                      style={underlineStyle}
                    />
                  </svg>
                </span>
                .
              </h1>

              <p className="text-lg text-neutral-600 dark:text-neutral-400 max-w-lg">
                UPswing turns attendance and marks into early warnings, explains why each student is at risk, and tracks the interventions that bring them
                back up.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 pt-4">
                <button
                  ref={magneticRef1}
                  onClick={() => navigate('/login')}
                  style={magneticStyle1}
                  onMouseMove={onMag1Move}
                  onMouseLeave={onMag1Leave}
                  className="px-6 py-3 bg-primary-600 dark:bg-primary-500 text-white font-semibold rounded-lg hover:bg-primary-700 dark:hover:bg-primary-600 transition-colors focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 dark:focus:ring-offset-neutral-900"
                >
                  Launch demo
                </button>
                <button
                  ref={magneticRef2}
                  onClick={(e) => {
                    e.preventDefault()
                    const element = document.getElementById('how-it-works')
                    if (element) {
                      const offset = 80
                      const top = element.getBoundingClientRect().top + window.scrollY - offset
                      window.scrollTo({ top, behavior: 'smooth' })
                    }
                  }}
                  style={magneticStyle2}
                  onMouseMove={onMag2Move}
                  onMouseLeave={onMag2Leave}
                  className="px-6 py-3 border-2 border-primary-600 dark:border-primary-400 text-primary-600 dark:text-primary-400 font-semibold rounded-lg hover:bg-primary-50 dark:hover:bg-primary-900/20 transition-colors focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 dark:focus:ring-offset-neutral-900"
                >
                  See how it works
                </button>
              </div>
            </div>
          </Reveal>

          {/* Right column: Interactive preview card */}
          <Reveal variant="scale-in" delay={300}>
            <div className="relative h-full flex items-center justify-center" ref={tiltRef} style={tiltStyle} onMouseMove={onTiltMouseMove} onMouseLeave={onTiltMouseLeave}>
              {/* Cursor glow */}
              <div
                ref={cursorGlowRef}
                className="absolute w-64 h-64 bg-primary-400/20 dark:bg-primary-500/10 rounded-full blur-3xl pointer-events-none"
                style={{
                  transform: 'translate(-50%, -50%)',
                  transition: prefersReducedMotion ? 'none' : 'opacity 0.3s ease',
                }}
              />

              {/* Preview card */}
              <div className="relative w-full bg-white dark:bg-neutral-800 rounded-2xl border border-neutral-200 dark:border-neutral-700 shadow-2xl p-6 space-y-6">
                {/* Stat tiles */}
                <div className="grid grid-cols-2 gap-4">
                  {statTiles.map((tile, idx) => (
                    <div key={idx} className={`p-4 rounded-lg ${tile.color}`}>
                      <p className="text-xs font-medium opacity-75 mb-1">{tile.label}</p>
                      <p className="text-2xl font-bold">{tile.value}</p>
                    </div>
                  ))}
                </div>

                {/* Charts row */}
                <div className="grid grid-cols-2 gap-4">
                  {/* Risk donut */}
                  <div className="bg-neutral-50 dark:bg-neutral-900 rounded-lg p-4">
                    <p className="text-xs font-medium text-neutral-600 dark:text-neutral-400 mb-3">Risk Distribution</p>
                    <ResponsiveContainer width="100%" height={120}>
                      <PieChart>
                        <Pie
                          data={riskData}
                          cx="50%"
                          cy="50%"
                          innerRadius={30}
                          outerRadius={50}
                          dataKey="value"
                          startAngle={90}
                          endAngle={-270}
                        >
                          {riskData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.fill} />
                          ))}
                        </Pie>
                      </PieChart>
                    </ResponsiveContainer>
                  </div>

                  {/* Trend line */}
                  <div className="bg-neutral-50 dark:bg-neutral-900 rounded-lg p-4">
                    <p className="text-xs font-medium text-neutral-600 dark:text-neutral-400 mb-3">8-Week Trend</p>
                    <ResponsiveContainer width="100%" height={120}>
                      <AreaChart data={trendData}>
                        <Area type="monotone" dataKey="value" stroke="#3b82f6" fill="#3b82f6" fillOpacity={0.2} />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                {/* Floating badges */}
                <div className="space-y-2">
                  <div
                    className="floating-badge inline-flex items-center px-3 py-2 bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300 text-xs font-semibold rounded-full"
                    style={{ animationDelay: '0s' }}
                  >
                    ⚠️ High risk detected
                  </div>
                  <div
                    className="floating-badge inline-flex items-center px-3 py-2 ml-12 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 text-xs font-semibold rounded-full"
                    style={{ animationDelay: '0.5s' }}
                  >
                    ✓ Intervention planned
                  </div>
                </div>
              </div>
            </div>
          </Reveal>
        </div>

        {/* Trust strip */}
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-neutral-50 dark:from-neutral-800/50 to-transparent py-12">
          <div className="max-w-[1200px] mx-auto px-6 grid grid-cols-1 md:grid-cols-3 gap-8">
            <Reveal variant="fade-up" delay={0} className="text-center">
              <div className="text-3xl font-bold text-primary-600 dark:text-primary-400">{countStudents}+</div>
              <p className="text-sm text-neutral-600 dark:text-neutral-400 mt-2">Students monitored</p>
            </Reveal>
            <Reveal variant="fade-up" delay={100} className="text-center">
              <div className="text-3xl font-bold text-primary-600 dark:text-primary-400">{countRiskFactors}+</div>
              <p className="text-sm text-neutral-600 dark:text-neutral-400 mt-2">Risk factors analyzed</p>
            </Reveal>
            <Reveal variant="fade-up" delay={200} className="text-center">
              <div className="text-3xl font-bold text-primary-600 dark:text-primary-400">{countInterventions}+</div>
              <p className="text-sm text-neutral-600 dark:text-neutral-400 mt-2">Interventions tracked</p>
            </Reveal>
          </div>
        </div>
      </section>
    </>
  )
}

export default Hero
