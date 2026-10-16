import React, { useState } from 'react'
import { calculateRisk } from '../../../utils/riskCalculator'
import { Reveal } from '../../../components/common/Reveal'

interface RiskState {
  attendance: number
  performance: number
  failedSubjects: number
  trend: 'improving' | 'stable' | 'declining'
}

const RiskChecker: React.FC = () => {
  const [risk, setRisk] = useState<RiskState>({
    attendance: 75,
    performance: 65,
    failedSubjects: 1,
    trend: 'stable',
  })

  const result = calculateRisk(risk)

  const handleReset = () => {
    setRisk({
      attendance: 75,
      performance: 65,
      failedSubjects: 1,
      trend: 'stable',
    })
  }

  const presets = [
    { label: 'Thriving', attendance: 92, performance: 85, failedSubjects: 0, trend: 'improving' as const },
    { label: 'Needs attention', attendance: 68, performance: 55, failedSubjects: 2, trend: 'stable' as const },
    { label: 'Critical', attendance: 45, performance: 30, failedSubjects: 4, trend: 'declining' as const },
  ]

  const getRiskColor = () => {
    if (result.level === 'high') return 'text-red-600 dark:text-red-400'
    if (result.level === 'medium') return 'text-amber-600 dark:text-amber-400'
    return 'text-green-600 dark:text-green-400'
  }

  const getRiskBgColor = () => {
    if (result.level === 'high') return 'bg-red-100 dark:bg-red-900/30'
    if (result.level === 'medium') return 'bg-amber-100 dark:bg-amber-900/30'
    return 'bg-green-100 dark:bg-green-900/30'
  }

  return (
    <section id="try-it" className="py-24 bg-white dark:bg-neutral-900">
      <div className="max-w-[800px] mx-auto px-6">
        <Reveal variant="fade-up" delay={0} className="text-center mb-12">
          <h2 className="text-3xl sm:text-4xl font-bold text-neutral-900 dark:text-neutral-50 mb-4">
            Try the risk checker
          </h2>
          <p className="text-lg text-neutral-600 dark:text-neutral-400">
            Experiment with student data to see how risk is calculated.
          </p>
        </Reveal>

        <Reveal variant="scale-in" delay={100}>
          <div className="bg-neutral-50 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-2xl p-8 space-y-8">
            {/* Sliders */}
            <div className="space-y-6">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="text-sm font-semibold text-neutral-900 dark:text-neutral-50">
                    Attendance: {risk.attendance}%
                  </label>
                </div>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={risk.attendance}
                  onChange={(e) => setRisk({ ...risk, attendance: Number(e.target.value) })}
                  className="w-full h-2 bg-neutral-200 dark:bg-neutral-700 rounded-lg appearance-none cursor-pointer accent-primary-600"
                  aria-label="Attendance percentage"
                />
              </div>

              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="text-sm font-semibold text-neutral-900 dark:text-neutral-50">
                    Average Performance: {risk.performance}%
                  </label>
                </div>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={risk.performance}
                  onChange={(e) => setRisk({ ...risk, performance: Number(e.target.value) })}
                  className="w-full h-2 bg-neutral-200 dark:bg-neutral-700 rounded-lg appearance-none cursor-pointer accent-primary-600"
                  aria-label="Average performance percentage"
                />
              </div>

              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="text-sm font-semibold text-neutral-900 dark:text-neutral-50">
                    Failed Subjects: {risk.failedSubjects}
                  </label>
                </div>
                <input
                  type="range"
                  min="0"
                  max="6"
                  value={risk.failedSubjects}
                  onChange={(e) => setRisk({ ...risk, failedSubjects: Number(e.target.value) })}
                  className="w-full h-2 bg-neutral-200 dark:bg-neutral-700 rounded-lg appearance-none cursor-pointer accent-primary-600"
                  aria-label="Failed subjects count"
                />
              </div>

              <div>
                <label className="text-sm font-semibold text-neutral-900 dark:text-neutral-50 block mb-3">
                  Trend
                </label>
                <div className="grid grid-cols-3 gap-3" role="radiogroup">
                  {['improving', 'stable', 'declining'].map((t) => (
                    <button
                      key={t}
                      onClick={() => setRisk({ ...risk, trend: t as any })}
                      className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                        risk.trend === t
                          ? 'bg-primary-600 dark:bg-primary-500 text-white'
                          : 'bg-neutral-200 dark:bg-neutral-700 text-neutral-700 dark:text-neutral-300 hover:bg-neutral-300 dark:hover:bg-neutral-600'
                      }`}
                      role="radio"
                      aria-checked={risk.trend === t}
                    >
                      {t.charAt(0).toUpperCase() + t.slice(1)}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Results */}
            <div className="border-t border-neutral-200 dark:border-neutral-700 pt-8 space-y-6">
              {/* Risk badge */}
              <div className="text-center">
                <div className={`inline-flex px-4 py-2 rounded-lg font-bold text-sm mb-4 ${getRiskBgColor()} ${getRiskColor()}`}>
                  {result.level.toUpperCase()} RISK
                </div>
                <div className="text-4xl font-bold text-neutral-900 dark:text-neutral-50 mb-2">
                  {result.score}
                </div>
                <p className="text-sm text-neutral-600 dark:text-neutral-400">Risk Score (0-100)</p>
              </div>

              {/* Contributing factors */}
              <div>
                <h3 className="text-sm font-semibold text-neutral-900 dark:text-neutral-50 mb-4">
                  Top Contributing Factors
                </h3>
                <div className="space-y-3">
                  {result.factors.map((factor, idx) => (
                    <div key={idx}>
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-xs font-medium text-neutral-700 dark:text-neutral-300">
                          {factor.label}
                        </span>
                        <span className={`text-xs font-bold ${factor.direction === 'risk' ? 'text-red-600' : 'text-green-600'}`}>
                          {factor.direction === 'risk' ? '↑ Risk' : '↓ Protective'}
                        </span>
                      </div>
                      <div className="w-full h-2 bg-neutral-200 dark:bg-neutral-700 rounded-full overflow-hidden">
                        <div
                          className={`h-full transition-all duration-300 ${
                            factor.direction === 'risk'
                              ? 'bg-red-500'
                              : 'bg-green-500'
                          }`}
                          style={{ width: `${factor.weight * 100}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Suggestion */}
              <div className="bg-primary-50 dark:bg-primary-900/20 border border-primary-200 dark:border-primary-800 rounded-lg p-4">
                <p className="text-sm font-medium text-primary-700 dark:text-primary-300">
                  💡 {result.suggestion}
                </p>
              </div>

              {/* Presets */}
              <div>
                <p className="text-xs font-semibold text-neutral-600 dark:text-neutral-400 mb-3">
                  Try a preset:
                </p>
                <div className="flex gap-2">
                  {presets.map((preset) => (
                    <button
                      key={preset.label}
                      onClick={() =>
                        setRisk({
                          attendance: preset.attendance,
                          performance: preset.performance,
                          failedSubjects: preset.failedSubjects,
                          trend: preset.trend,
                        })
                      }
                      className="text-xs px-3 py-2 rounded-lg border border-neutral-300 dark:border-neutral-600 text-neutral-700 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-700 transition-colors"
                    >
                      {preset.label}
                    </button>
                  ))}
                  <button
                    onClick={handleReset}
                    className="text-xs px-3 py-2 rounded-lg border border-neutral-300 dark:border-neutral-600 text-neutral-700 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-700 transition-colors ml-auto"
                  >
                    Reset
                  </button>
                </div>
              </div>

              {/* Demo note */}
              <p className="text-xs text-neutral-500 dark:text-neutral-400 text-center italic">
                Demo using the same risk rules as the dashboard.
              </p>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  )
}

export default RiskChecker
