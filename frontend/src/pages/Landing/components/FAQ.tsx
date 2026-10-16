import React, { useState } from 'react'
import { ChevronDown } from 'lucide-react'
import { Reveal } from '../../../components/common/Reveal'

interface FAQItem {
  question: string
  answer: string
}

const FAQ: React.FC = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(null)

  const faqItems: FAQItem[] = [
    {
      question: 'How is risk calculated?',
      answer:
        'UPswing combines attendance, performance scores, and failed subjects into a weighted risk score. Trend data adjusts the score up or down. Thresholds are configurable in Settings.',
    },
    {
      question: 'Is student data private?',
      answer:
        'All data stays in your browser\'s local storage. Nothing is sent to external servers. Role-based access ensures teachers see only relevant students.',
    },
    {
      question: 'Can I import my own CSV?',
      answer:
        'Yes. The Data Center accepts CSV files with attendance and grade data. A template is available for download.',
    },
    {
      question: 'Do I need to install anything?',
      answer:
        'No installation required. UPswing runs entirely in the browser. Just open the app, import your data, and you\'re ready.',
    },
    {
      question: 'Can thresholds be changed?',
      answer:
        'Yes. Admins can adjust the risk score thresholds in the Settings page to match your institution\'s standards.',
    },
  ]

  return (
    <section id="faq" className="py-24 bg-neutral-50 dark:bg-neutral-800/50">
      <div className="max-w-[800px] mx-auto px-6">
        <Reveal variant="fade-up" delay={0} className="text-center mb-12">
          <h2 className="text-3xl sm:text-4xl font-bold text-neutral-900 dark:text-neutral-50 mb-4">
            Frequently asked questions
          </h2>
        </Reveal>

        <Reveal variant="fade-up" delay={100}>
          <div className="space-y-4">
            {faqItems.map((item, idx) => (
              <div
                key={idx}
                className="border border-neutral-200 dark:border-neutral-700 rounded-lg overflow-hidden transition-all duration-300"
              >
                <button
                  onClick={() => setOpenIndex(openIndex === idx ? null : idx)}
                  className="w-full px-6 py-4 flex items-center justify-between hover:bg-neutral-100 dark:hover:bg-neutral-700 transition-colors text-left"
                  aria-expanded={openIndex === idx}
                >
                  <span className="font-semibold text-neutral-900 dark:text-neutral-50">{item.question}</span>
                  <ChevronDown
                    className={`w-5 h-5 text-neutral-600 dark:text-neutral-400 transition-transform ${
                      openIndex === idx ? 'rotate-180' : ''
                    }`}
                  />
                </button>

                {openIndex === idx && (
                  <div className="px-6 py-4 bg-neutral-50 dark:bg-neutral-800 border-t border-neutral-200 dark:border-neutral-700">
                    <p className="text-neutral-600 dark:text-neutral-400 leading-relaxed">{item.answer}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </Reveal>
      </div>
    </section>
  )
}

export default FAQ
