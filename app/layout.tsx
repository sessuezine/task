'use client'

import './globals.css'
import { Inter } from 'next/font/google'
import { Analytics } from '@vercel/analytics/react'
import Nav from '@/components/nav'
import { useState } from 'react'
import { usePathname } from 'next/navigation'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { redirect } from 'next/navigation'

const inter = Inter({ subsets: ['latin'] })

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const [isOpen, setIsOpen] = useState(false)
  const supabase = createClientComponentClient()

  return (
    <html lang="en">
      <body>
        {/* Mobile Menu Button */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="md:hidden fixed top-4 left-4 z-20 p-2 rounded-lg hover:bg-gray-100"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>

        <div className="flex">
          {/* Desktop Navigation */}
          <div className="hidden md:block w-64 shrink-0">
            <Nav isOpen={false} setIsOpen={setIsOpen} />
          </div>

          {/* Mobile Navigation */}
          {isOpen && (
            <Nav isOpen={isOpen} setIsOpen={setIsOpen} />
          )}

          {/* Main Content */}
          <main className="flex-1 min-h-screen">
            <div className="max-w-7xl mx-auto">
              <div className="pt-16 md:pt-6 px-6">
                {children}
              </div>
            </div>
          </main>
        </div>
      </body>
    </html>
  )
}
