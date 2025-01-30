'use client'

import './globals.css'
import { Inter } from 'next/font/google'
import { Analytics } from '@vercel/analytics/react'
import Nav from '@/components/nav'
import { useState } from 'react'
import { usePathname } from 'next/navigation'

const inter = Inter({ subsets: ['latin'] })

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const [isOpen, setIsOpen] = useState(false)
  const pathname = usePathname()

  const getPageTitle = () => {
    switch (pathname) {
      case '/dashboard':
        return 'Dashboard'
      case '/tasks':
        return 'Tasks'
      case '/ai-chat':
        return 'AI Chat'
      default:
        return ''
    }
  }

  const toggleMenu = () => {
    setIsOpen(!isOpen)
  }

  return (
    <html lang="en">
      <body className={`${inter.className} min-h-screen bg-gray-50`}>
        {/* Mobile Header */}
        <header className="
          fixed top-0 left-0 right-0 
          h-16 bg-white border-b 
          z-40 md:hidden
        ">
          <div className="h-full">
            <div className="
              flex items-center h-full 
              pl-6
            ">
              <button 
                onClick={toggleMenu}
                className="
                  -ml-2 p-2 
                  hover:bg-gray-100 rounded-lg
                "
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  {isOpen ? (
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  ) : (
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                  )}
                </svg>
              </button>
              <h1 className="text-xl font-bold">{getPageTitle()}</h1>
            </div>
          </div>
        </header>

        {/* Desktop Navigation */}
        <div className="hidden md:block fixed inset-y-0 left-0">
          <Nav isOpen={false} setIsOpen={setIsOpen} />
        </div>

        {/* Mobile Navigation */}
        {isOpen && (
          <div className="md:hidden">
            <Nav isOpen={isOpen} setIsOpen={setIsOpen} />
          </div>
        )}

        {/* Main Content */}
        <main className="md:ml-64">
          <div className="
            max-w-8xl mx-auto 
            md:px-6
          ">
            <div className="
              pt-16 md:pt-6 
              pl-6 pr-6
            ">
              {children}
            </div>
          </div>
        </main>
        
        <Analytics />
      </body>
    </html>
  )
}
