'use client'

import './globals.css'
import { Inter } from 'next/font/google'
import { Analytics } from '@vercel/analytics/react'
import Nav from '@/components/nav'
import { useState } from 'react'
import { usePathname } from 'next/navigation'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { redirect } from 'next/navigation'
import Link from 'next/link'

const inter = Inter({ subsets: ['latin'] })

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const [isOpen, setIsOpen] = useState(false)
  const supabase = createClientComponentClient()
  const pathname = usePathname()

  return (
    <html lang="en">
      <body>
        {/* Mobile menu button */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="fixed top-4 left-4 z-[51] md:hidden"  // z-51 to be above nav's z-50
        >
          <svg
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4 6h16M4 12h16M4 18h16"
            />
          </svg>
        </button>

        <div className="flex">
          {/* Desktop Navigation */}
          <div className="hidden md:block w-64 shrink-0">
            <Nav isOpen={false} setIsOpen={setIsOpen}>
              <Link 
                href="/schedule" 
                className={`flex items-center gap-3 px-4 py-2 text-[--text-secondary] hover:text-[--text] hover:bg-[--bg-hover] rounded-lg transition-colors ${
                  pathname === '/schedule' ? 'bg-[--bg-hover] text-[--text]' : ''
                }`}
              >
                <svg width="15" height="15" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M4.5 1C4.77614 1 5 1.22386 5 1.5V2H10V1.5C10 1.22386 10.2239 1 10.5 1C10.7761 1 11 1.22386 11 1.5V2H12.5C13.3284 2 14 2.67157 14 3.5V12.5C14 13.3284 13.3284 14 12.5 14H2.5C1.67157 14 1 13.3284 1 12.5V3.5C1 2.67157 1.67157 2 2.5 2H4V1.5C4 1.22386 4.22386 1 4.5 1ZM10 3V3.5C10 3.77614 10.2239 4 10.5 4C10.7761 4 11 3.77614 11 3.5V3H12.5C12.7761 3 13 3.22386 13 3.5V5H2V3.5C2 3.22386 2.22386 3 2.5 3H4V3.5C4 3.77614 4.22386 4 4.5 4C4.77614 4 5 3.77614 5 3.5V3H10ZM2 6V12.5C2 12.7761 2.22386 13 2.5 13H12.5C12.7761 13 13 12.7761 13 12.5V6H2Z" fill="currentColor" fillRule="evenodd" clipRule="evenodd"/>
                </svg>
                Schedule
              </Link>
            </Nav>
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
