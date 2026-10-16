import React from 'react'
import { Link } from 'react-router-dom'
import { Sun, Moon } from 'lucide-react'
import { UpswingMark } from '../../../components/UpswingIntro'
import UpswingWordmark from '../../../components/UpswingWordmark'
import { useTheme } from '../../../context/ThemeContext'

const Footer: React.FC = () => {
  const { theme, toggleTheme } = useTheme()

  const handleSmoothScroll = (e: React.MouseEvent<HTMLAnchorElement>, sectionId: string) => {
    e.preventDefault()
    const element = document.getElementById(sectionId)
    if (element) {
      const offset = 80
      const top = element.getBoundingClientRect().top + window.scrollY - offset
      window.scrollTo({ top, behavior: 'smooth' })
    }
  }

  const currentYear = new Date().getFullYear()

  return (
    <footer className="bg-neutral-900 dark:bg-neutral-950 text-neutral-50 border-t border-neutral-800">
      <div className="max-w-[1200px] mx-auto px-6 py-12">
        {/* Top section: Logo + Description */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 pb-12 border-b border-neutral-800">
          <div className="md:col-span-2">
            <div className="flex items-center space-x-2 mb-4">
              <div className="w-10 h-10 bg-gradient-to-br from-primary-500 to-primary-600 rounded-lg flex items-center justify-center text-white">
                <UpswingMark size={24} className="text-white" />
              </div>
              <span className="text-lg font-bold">
                <UpswingWordmark />
              </span>
            </div>
            <p className="text-neutral-400 text-sm leading-relaxed max-w-sm">
              Early warning system for academic performance. Detect risk early, understand why students struggle, and track interventions that work.
            </p>
          </div>

          {/* Link columns */}
          <div>
            <h3 className="font-semibold text-sm uppercase tracking-wider mb-4 text-neutral-300">
              Product
            </h3>
            <ul className="space-y-2 text-sm">
              <li>
                <a
                  href="#features"
                  onClick={(e) => handleSmoothScroll(e, 'features')}
                  className="text-neutral-400 hover:text-neutral-200 transition-colors"
                >
                  Features
                </a>
              </li>
              <li>
                <a
                  href="#how-it-works"
                  onClick={(e) => handleSmoothScroll(e, 'how-it-works')}
                  className="text-neutral-400 hover:text-neutral-200 transition-colors"
                >
                  How it works
                </a>
              </li>
              <li>
                <a href="/login" className="text-neutral-400 hover:text-neutral-200 transition-colors">
                  Try Demo
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold text-sm uppercase tracking-wider mb-4 text-neutral-300">
              Resources
            </h3>
            <ul className="space-y-2 text-sm">
              <li>
                <a href="#" className="text-neutral-400 hover:text-neutral-200 transition-colors">
                  Documentation
                </a>
              </li>
              <li>
                <a href="#" className="text-neutral-400 hover:text-neutral-200 transition-colors">
                  Support
                </a>
              </li>
              <li>
                <a href="#" className="text-neutral-400 hover:text-neutral-200 transition-colors">
                  FAQ
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom section: Copyright + Theme toggle */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-8">
          <p className="text-sm text-neutral-400">
            © {currentYear} UPswing. All rights reserved.
          </p>
          <button
            onClick={toggleTheme}
            className="p-2 rounded-lg hover:bg-neutral-800 transition-colors text-neutral-400 hover:text-neutral-200"
            aria-label="Toggle theme"
          >
            {theme === 'light' ? <Moon className="w-5 h-5" /> : <Sun className="w-5 h-5" />}
          </button>
        </div>
      </div>
    </footer>
  )
}

export default Footer
