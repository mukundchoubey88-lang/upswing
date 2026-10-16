import React, { useEffect } from 'react'
import LandingLayout from './LandingLayout'
import Hero from './components/Hero'
import ProblemSolution from './components/ProblemSolution'
import Features from './components/Features'
import HowItWorks from './components/HowItWorks'
import RiskChecker from './components/RiskChecker'
import RoleTabs from './components/RoleTabs'
import BeforeAfter from './components/BeforeAfter'
import FAQ from './components/FAQ'
import FinalCTA from './components/FinalCTA'
import Footer from './components/Footer'

const Landing: React.FC = () => {
  useEffect(() => {
    // Set document title
    document.title = 'UPswing | AI Student Academic Performance Detection & Early Warning System'

    // Set meta description
    let metaDescription = document.querySelector('meta[name="description"]')
    if (!metaDescription) {
      metaDescription = document.createElement('meta')
      metaDescription.setAttribute('name', 'description')
      document.head.appendChild(metaDescription)
    }
    metaDescription.setAttribute(
      'content',
      'UPswing turns attendance and marks into early warnings. Detect academic risk early, understand why each student is at risk, and track interventions that bring them back up.'
    )

    // Set Open Graph tags
    const ogTags = [
      { property: 'og:title', content: 'UPswing | Early Warning System' },
      {
        property: 'og:description',
        content:
          'Detect academic risk early with UPswing. Spot the dip. Fuel the upswing.',
      },
      { property: 'og:type', content: 'website' },
      { property: 'og:url', content: window.location.origin },
    ]

    ogTags.forEach(({ property, content }) => {
      let tag = document.querySelector(`meta[property="${property}"]`)
      if (!tag) {
        tag = document.createElement('meta')
        tag.setAttribute('property', property)
        document.head.appendChild(tag)
      }
      tag.setAttribute('content', content)
    })

    // Scroll to top on mount
    window.scrollTo(0, 0)
  }, [])

  return (
    <LandingLayout>
      <main className="min-h-screen bg-white dark:bg-neutral-900">
        <Hero />
        <ProblemSolution />
        <Features />
        <HowItWorks />
        <RiskChecker />
        <RoleTabs />
        <BeforeAfter />
        <FAQ />
        <FinalCTA />
        <Footer />
      </main>
    </LandingLayout>
  )
}

export default Landing
