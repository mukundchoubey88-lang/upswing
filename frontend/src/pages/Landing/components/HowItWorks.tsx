import React from 'react'
import { BarChart3, Database, Target, AlertTriangle } from 'lucide-react'
import { useScrollProgress } from '../../../hooks/useScrollProgress'
import { Reveal } from '../../../components/common/Reveal'

const HowItWorks: React.FC = () => {
  const [ref, progress] = useScrollProgress<HTMLElement>()

  const steps = [
    {
      icon: <Database className="w-6 h-6" />,
      title: 'Import your data',
      description: 'Upload attendance and grade data via CSV from your student management system.',
    },
    {
      icon: <BarChart3 className="w-6 h-6" />,
      title: 'Detect risk',
      description: 'UPswing analyzes patterns and computes a real-time risk score for every student.',
    },
    {
      icon: <AlertTriangle className="w-6 h-6" />,
      title: 'Understand why',
      description: 'Get transparent explanations of the top factors driving each student\'s risk.',
    },
    {
      icon: <Target className="w-6 h-6" />,
      title: 'Intervene and track',
      description: 'Assign support, log progress, and measure the impact of your interventions.',
    },
  ]

  const activeStep = Math.min(Math.floor(progress * 4), 3)

  return (
    <section id="how-it-works" ref={ref} className="py-24 bg-neutral-50 dark:bg-neutral-800/50">
      <div className="max-w-[1200px] mx-auto px-6">
        <Reveal variant="fade-up" delay={0} className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold text-neutral-900 dark:text-neutral-50 mb-4">
            How it works
          </h2>
          <p className="text-lg text-neutral-600 dark:text-neutral-400">
            Four simple steps to early intervention.
          </p>
        </Reveal>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Steps */}
          {steps.map((step, idx) => (
            <Reveal key={idx} variant="fade-up" delay={idx * 100}>
              <div className="relative">
                {/* Progress indicator */}
                <div
                  className="flex items-center justify-center w-16 h-16 rounded-full mx-auto mb-4 transition-all duration-300"
                  style={{
                    backgroundColor: idx <= activeStep ? 'rgb(37, 99, 235)' : 'rgb(229, 231, 235)',
                    color: idx <= activeStep ? 'white' : 'rgb(107, 114, 128)',
                    transform: idx <= activeStep ? 'scale(1.1)' : 'scale(1)',
                  }}
                >
                  {step.icon}
                </div>

                {/* Step title and description */}
                <h3 className="text-lg font-semibold text-neutral-900 dark:text-neutral-50 text-center mb-2">
                  {step.title}
                </h3>
                <p className="text-sm text-neutral-600 dark:text-neutral-400 text-center leading-relaxed">
                  {step.description}
                </p>

                {/* Connector line (except for last step) */}
                {idx < steps.length - 1 && (
                  <div className="hidden lg:block absolute top-8 left-[calc(50%+2rem)] right-[calc(-50%-2rem)] w-12 h-1 bg-neutral-200 dark:bg-neutral-700" />
                )}
              </div>
            </Reveal>
          ))}
        </div>

        {/* Progress bar */}
        <div className="mt-12 h-2 bg-neutral-200 dark:bg-neutral-700 rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-primary-500 to-primary-600 transition-all duration-300"
            style={{ width: `${progress * 100}%` }}
          />
        </div>
      </div>
    </section>
  )
}

export default HowItWorks
