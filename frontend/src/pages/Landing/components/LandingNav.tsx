import React, { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Menu, X, Sun, Moon } from 'lucide-react'
import { UpswingMark } from '../../../components/UpswingIntro'
import UpswingWordmark from '../../../components/UpswingWordmark'
import { useTheme } from '../../../context/ThemeContext'
import { useMagnetic } from '../../../hooks/useMagnetic'

const LandingNav: React.FC = () => {
  const navigate = useNavigate()
  const [scrollY, setScrollY] = useState(0)
  const [isOpen, setIsOpen] = useState(false)
  const [activeSection, setActiveSection] = useState('home')
  const { theme, toggleTheme } = useTheme()
  const { ref: buttonRef, style: magneticStyle, onMouseMove, onMouseLeave } = useMagnetic(0.3)

  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY)
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  useEffect(() => {
    const sections = ['home', 'features', 'how-it-works', 'try-it', 'roles', 'faq']
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveSection(entry.target.id)
          }
        })
      },
      { threshold: 0.5 }
    )

    sections.forEach((id) => {
      const el = document.getElementById(id)
      if (el) observer.observe(el)
    })

    return () => observer.disconnect()
  }, [])

  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, sectionId: string) => {
    e.preventDefault()
    const element = document.getElementById(sectionId)
    if (element) {
      const offset = 80
      const top = element.getBoundingClientRect().top + window.scrollY - offset
      window.scrollTo({ top, behavior: 'smooth' })
      setIsOpen(false)
    }
  }

  const handleLaunchDemo = () => {
    // Check if user might be logged in (check auth context or just go to login/dashboard)
    navigate('/login')
  }

  const navLinks = [
    { label: 'Features', id: 'features' },
    { label: 'How it works', id: 'how-it-works' },
    { label: 'Try it', id: 'try-it' },
    { label: 'Roles', id: 'roles' },
    { label: 'FAQ', id: 'faq' },
  ]

  const isScrolled = scrollY > 24

  return (
    <header
      role="banner"
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled
          ? 'bg-white/80 dark:bg-neutral-900/80 backdrop-blur-md border-b border-neutral-200 dark:border-neutral-700'
          : 'bg-transparent'
      }`}
    >
      <nav
        className="max-w-[1200px] mx-auto px-6 py-4 flex items-center justify-between"
        aria-label="Main navigation"
      >
        {/* Logo */}
        <Link to="/" className="flex items-center space-x-2 hover:opacity-80 transition-opacity">
          <div className="w-8 h-8 bg-gradient-to-br from-primary-500 to-primary-600 rounded-lg flex items-center justify-center text-white">
            <UpswingMark size={20} className="text-white" />
          </div>
          <span className="hidden sm:block text-sm font-bold text-neutral-900 dark:text-neutral-50">
            <UpswingWordmark />
          </span>
        </Link>

        {/* Desktop Nav Links */}
        <div className="hidden md:flex items-center space-x-8">
          {navLinks.map((link) => (
            <a
              key={link.id}
              href={`#${link.id}`}
              onClick={(e) => handleNavClick(e, link.id)}
              className={`text-sm font-medium transition-colors ${
                activeSection === link.id
                  ? 'text-primary-600 dark:text-primary-400'
                  : 'text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-200'
              }`}
              aria-current={activeSection === link.id ? 'page' : undefined}
            >
              {link.label}
            </a>
          ))}
        </div>

        {/* Right side: Theme toggle + CTA + Mobile menu */}
        <div className="flex items-center space-x-3">
          <button
            onClick={toggleTheme}
            className="p-2 rounded-lg hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors text-neutral-600 dark:text-neutral-400"
            aria-label="Toggle theme"
          >
            {theme === 'light' ? (
              <Moon className="w-5 h-5" />
            ) : (
              <Sun className="w-5 h-5" />
            )}
          </button>

          <button
            ref={buttonRef}
            onClick={handleLaunchDemo}
            style={magneticStyle}
            onMouseMove={onMouseMove}
            onMouseLeave={onMouseLeave}
            className="hidden md:inline-flex px-5 py-2 bg-primary-600 dark:bg-primary-500 text-white text-sm font-semibold rounded-lg hover:bg-primary-700 dark:hover:bg-primary-600 transition-colors focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 dark:focus:ring-offset-neutral-900"
          >
            Launch demo
          </button>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden p-2 rounded-lg hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors text-neutral-600 dark:text-neutral-400"
            aria-label={isOpen ? 'Close menu' : 'Open menu'}
          >
            {isOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </nav>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden bg-white dark:bg-neutral-800 border-b border-neutral-200 dark:border-neutral-700 px-6 py-4 space-y-4">
          {navLinks.map((link) => (
            <a
              key={link.id}
              href={`#${link.id}`}
              onClick={(e) => handleNavClick(e, link.id)}
              className={`block text-sm font-medium transition-colors ${
                activeSection === link.id
                  ? 'text-primary-600 dark:text-primary-400'
                  : 'text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-200'
              }`}
            >
              {link.label}
            </a>
          ))}
          <button
            onClick={handleLaunchDemo}
            className="w-full px-5 py-2 bg-primary-600 dark:bg-primary-500 text-white text-sm font-semibold rounded-lg hover:bg-primary-700 dark:hover:bg-primary-600 transition-colors"
          >
            Launch demo
          </button>
        </div>
      )}
    </header>
  )
}

export default LandingNav
