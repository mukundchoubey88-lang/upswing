import React from 'react'
import { Reveal } from '../../../components/common/Reveal'

const ProblemSolution: React.FC = () => {
  const problems = [
    'Attendance dips go unnoticed until it\'s too late.',
    'Grade drops are visible only after exams.',
    'At-risk students fall through the gaps.',
  ]

  const solutions = [
    'Real-time attendance tracking triggers instant alerts.',
    'Continuous performance monitoring, not just exam scores.',
    'Automated risk scoring surfaces every at-risk student.',
  ]

  return (
    <section className="py-24 bg-neutral-50 dark:bg-neutral-800/50">
      <div className="max-w-[1200px] mx-auto px-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Problem column */}
          <Reveal variant="fade-up" delay={0}>
            <div>
              <h2 className="text-3xl sm:text-4xl font-bold text-neutral-900 dark:text-neutral-50 mb-8">
                Students slip quietly.
              </h2>
              <div className="space-y-6">
                {problems.map((problem, idx) => (
                  <Reveal key={idx} variant="fade-up" delay={100 * (idx + 1)}>
                    <div className="flex gap-4">
                      <div className="flex-shrink-0 w-6 h-6 rounded-full bg-red-100 dark:bg-red-900/30 flex items-center justify-center mt-1">
                        <div className="w-2 h-2 bg-red-600 dark:bg-red-400 rounded-full" />
                      </div>
                      <p className="text-neutral-600 dark:text-neutral-400 leading-relaxed">{problem}</p>
                    </div>
                  </Reveal>
                ))}
              </div>
            </div>
          </Reveal>

          {/* Solution column */}
          <Reveal variant="fade-up" delay={200}>
            <div>
              <h2 className="text-3xl sm:text-4xl font-bold text-neutral-900 dark:text-neutral-50 mb-8">
                UPswing notices early.
              </h2>
              <div className="space-y-6">
                {solutions.map((solution, idx) => (
                  <Reveal key={idx} variant="fade-up" delay={100 * (idx + 1)}>
                    <div className="flex gap-4">
                      <div className="flex-shrink-0 w-6 h-6 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center mt-1">
                        <div className="w-2 h-2 bg-green-600 dark:bg-green-400 rounded-full" />
                      </div>
                      <p className="text-neutral-600 dark:text-neutral-400 leading-relaxed">{solution}</p>
                    </div>
                  </Reveal>
                ))}
              </div>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  )
}

export default ProblemSolution
