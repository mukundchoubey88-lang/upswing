import React, { useRef, useState } from 'react'
import {
  AlertTriangle,
  BarChart3,
  Target,
  FileText,
  Database,
  Shield,
} from 'lucide-react'
import { Reveal } from '../../../components/common/Reveal'

interface FeatureCard {
  id: string
  icon: React.ReactNode
  title: string
  description: string
}

const Features: React.FC = () => {
  const [spotlight, setSpotlight] = useState<{ x: number; y: number } | null>(null)
  const cardRefs = useRef<(HTMLDivElement | null)[]>([])

  const features: FeatureCard[] = [
    {
      id: '1',
      icon: <AlertTriangle className="w-6 h-6" />,
      title: 'Early warning',
      description: 'Surface at-risk students before they fail',
    },
    {
      id: '2',
      icon: <BarChart3 className="w-6 h-6" />,
      title: 'Explainable risk scores',
      description: 'Know exactly why each student is flagged',
    },
    {
      id: '3',
      icon: <Target className="w-6 h-6" />,
      title: 'Intervention tracking',
      description: 'Log, assign, and close interventions in one place',
    },
    {
      id: '4',
      icon: <FileText className="w-6 h-6" />,
      title: 'Reports and exports',
      description: 'Download CSV reports for every cohort',
    },
    {
      id: '5',
      icon: <Database className="w-6 h-6" />,
      title: 'Data Center import',
      description: 'Bulk-upload attendance and grade data via CSV',
    },
    {
      id: '6',
      icon: <Shield className="w-6 h-6" />,
      title: 'Roles and privacy',
      description: 'Admin, Teacher, Counselor — scoped access by role',
    },
  ]

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>, index: number) => {
    const card = cardRefs.current[index]
    if (card) {
      const rect = card.getBoundingClientRect()
      setSpotlight({
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
      })
    }
  }

  const handleMouseLeave = () => {
    setSpotlight(null)
  }

  return (
    <section id="features" className="py-24 bg-white dark:bg-neutral-900">
      <div className="max-w-[1200px] mx-auto px-6">
        <Reveal variant="fade-up" delay={0} className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold text-neutral-900 dark:text-neutral-50 mb-4">
            Powerful features for educators
          </h2>
          <p className="text-lg text-neutral-600 dark:text-neutral-400 max-w-2xl mx-auto">
            Everything you need to detect risk early and intervene with precision.
          </p>
        </Reveal>

        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-3 gap-6 auto-rows-max">
          {features.map((feature, idx) => (
            <Reveal
              key={feature.id}
              variant="scale-in"
              delay={idx * 80}
              className={`${idx === 0 ? 'lg:col-span-2 lg:row-span-2' : idx === 1 ? 'lg:col-span-1 lg:row-span-2' : ''}`}
            >
              <div
                ref={(el) => {
                  cardRefs.current[idx] = el
                }}
                onMouseMove={(e) => handleMouseMove(e, idx)}
                onMouseLeave={handleMouseLeave}
                className="relative h-full bg-neutral-50 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-2xl p-6 transition-all duration-300 hover:border-primary-300 dark:hover:border-primary-600 group cursor-pointer overflow-hidden"
                style={{
                  '--spotlight-x': spotlight ? `${spotlight.x}px` : '0px',
                  '--spotlight-y': spotlight ? `${spotlight.y}px` : '0px',
                } as React.CSSProperties}
              >
                {/* Spotlight effect */}
                {spotlight && (
                  <div
                    className="absolute w-40 h-40 rounded-full pointer-events-none"
                    style={{
                      left: spotlight.x,
                      top: spotlight.y,
                      transform: 'translate(-50%, -50%)',
                      background: 'radial-gradient(circle, rgba(59, 130, 246, 0.1) 0%, transparent 70%)',
                    }}
                  />
                )}

                {/* Icon chip */}
                <div className="inline-flex p-3 bg-primary-100 dark:bg-primary-900/30 text-primary-600 dark:text-primary-400 rounded-lg mb-4 group-hover:scale-110 transition-transform duration-300">
                  {feature.icon}
                </div>

                {/* Content */}
                <h3 className="text-xl font-semibold text-neutral-900 dark:text-neutral-50 mb-2">
                  {feature.title}
                </h3>
                <p className="text-neutral-600 dark:text-neutral-400 text-sm leading-relaxed">
                  {feature.description}
                </p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}

export default Features
