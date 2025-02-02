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
            <Nav isOpen={false} setIsOpen={setIsOpen} />
          </div>

          {/* Mobile Navigation */}
          {isOpen && (
            <Nav isOpen={isOpen} setIsOpen={setIsOpen} />
          )}

          {/* Main Content */}
          <main className="flex-1 min-h-screen">
            <div className="pt-16 md:pt-6 px-6">
              {children}
            </div>
          </main>
        </div>
      </body>
    </html>
  )
}
