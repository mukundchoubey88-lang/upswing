import React, { ReactNode } from 'react'
import Sidebar from '../components/common/Sidebar'
import Header from '../components/common/Header'

interface MainLayoutProps {
  children: ReactNode
}

const MainLayout: React.FC<MainLayoutProps> = ({ children }) => {
  return (
    <div className="flex h-screen bg-neutral-50 dark:bg-neutral-900 overflow-hidden">
      {/* Sidebar */}
      <Sidebar />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <Header />

        {/* Page Content */}
        <main className="flex-1 overflow-auto">
          <div className="p-6 md:p-8 pt-5 md:pt-6">
            {children}
          </div>
        </main>
      </div>
    </div>
  )
}

export default MainLayout
