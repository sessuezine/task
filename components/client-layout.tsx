'use client'

import { useState } from 'react'
import { usePathname } from 'next/navigation'
import Nav from '@/components/nav'

export default function ClientLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <>
      {/* Mobile menu button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed top-4 left-4 z-[51] md:hidden"
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
          <div className="pt-16 md:pt-6 px-6">
            {children}
          </div>
        </main>
      </div>
    </>
  )
} 