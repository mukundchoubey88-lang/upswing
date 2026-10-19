import React from 'react'
import LandingNav from './components/LandingNav'

interface LandingLayoutProps {
  children: React.ReactNode
}

const LandingLayout: React.FC<LandingLayoutProps> = ({ children }) => {
  return (
    <div className="min-h-screen bg-white dark:bg-neutral-900">
      <LandingNav />
      {children}
    </div>
  )
}

export default LandingLayout
