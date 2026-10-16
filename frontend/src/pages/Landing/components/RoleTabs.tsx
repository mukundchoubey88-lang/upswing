import React, { useState } from 'react'
import { Reveal } from '../../../components/common/Reveal'

const RoleTabs: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'admin' | 'teacher' | 'counselor'>('admin')

  const roles = {
    admin: {
      title: 'Admin',
      features: [
        'Full system access',
        'Import and manage student data',
        'Configure risk thresholds',
        'Generate system-wide reports',
        'Manage user roles and access',
      ],
    },
    teacher: {
      title: 'Teacher',
      features: [
        'View all students and risk profiles',
        'Log and track interventions',
        'Monitor attendance trends',
        'Access cohort reports',
        'Coordinate with counselors',
      ],
    },
    counselor: {
      title: 'Counselor',
      features: [
        'Receive high-risk student alerts',
        'View intervention history',
        'Coordinate with teachers',
        'Track student progress',
        'Manage follow-up notes',
      ],
    },
  }

  const handleKeyDown = (e: React.KeyboardEvent, role: 'admin' | 'teacher' | 'counselor') => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault()
      setActiveTab(role)
    }
  }

  return (
    <section id="roles" className="py-24 bg-neutral-50 dark:bg-neutral-800/50">
      <div className="max-w-[1200px] mx-auto px-6">
        <Reveal variant="fade-up" delay={0} className="text-center mb-12">
          <h2 className="text-3xl sm:text-4xl font-bold text-neutral-900 dark:text-neutral-50 mb-4">
            Built for every role
          </h2>
          <p className="text-lg text-neutral-600 dark:text-neutral-400">
            Tailored dashboards and access controls for educators at every level.
          </p>
        </Reveal>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Tabs */}
          <Reveal variant="fade-up" delay={100}>
            <div className="flex flex-col gap-4">
              <div role="tablist" className="flex flex-col gap-3">
                {(['admin', 'teacher', 'counselor'] as const).map((role) => (
                  <button
                    key={role}
                    onClick={() => setActiveTab(role)}
                    onKeyDown={(e) => handleKeyDown(e, role)}
                    role="tab"
                    aria-selected={activeTab === role}
                    aria-controls={`${role}-panel`}
                    className={`px-6 py-4 text-left rounded-lg font-semibold transition-all ${
                      activeTab === role
                        ? 'bg-primary-600 dark:bg-primary-500 text-white shadow-lg'
                        : 'bg-neutral-100 dark:bg-neutral-700 text-neutral-900 dark:text-neutral-50 hover:bg-neutral-200 dark:hover:bg-neutral-600'
                    }`}
                  >
                    {roles[role].title}
                  </button>
                ))}
              </div>
            </div>
          </Reveal>

          {/* Content */}
          <Reveal variant="fade-in" delay={200}>
            <div
              id={`${activeTab}-panel`}
              role="tabpanel"
              aria-labelledby={activeTab}
              className="space-y-6"
            >
              <h3 className="text-2xl font-bold text-neutral-900 dark:text-neutral-50">
                {roles[activeTab].title} Features
              </h3>
              <ul className="space-y-4">
                {roles[activeTab].features.map((feature, idx) => (
                  <li key={idx} className="flex items-start gap-3">
                    <div className="w-5 h-5 rounded-full bg-primary-100 dark:bg-primary-900/30 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <div className="w-2 h-2 bg-primary-600 dark:bg-primary-400 rounded-full" />
                    </div>
                    <span className="text-neutral-600 dark:text-neutral-400">{feature}</span>
                  </li>
                ))}
              </ul>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  )
}

export default RoleTabs
