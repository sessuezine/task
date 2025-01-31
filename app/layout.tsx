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
