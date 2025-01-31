'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'

interface NavProps {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
}

export default function Nav({ isOpen, setIsOpen }: NavProps) {
  const pathname = usePathname()
  const supabase = createClient()

  const handleSignOut = async () => {
    await supabase.auth.signOut()
  }

  return (
    <nav className={`
      w-64 h-screen bg-white border-r flex flex-col
      fixed inset-y-0 left-0
      transform transition-transform duration-200 ease-in-out
      ${isOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
    `}>
      {/* Logo */}
      <div className="p-4 pt-16 md:pt-4">
        <Link href="/" className="flex items-center">
          <div className="w-7 h-7 bg-black rounded-lg flex items-center justify-center">
            <span className="text-white font-bold">T</span>
          </div>
        </Link>
      </div>

      {/* Nav Links */}
      <div className="flex-1 p-4 space-y-1">
        <Link 
          href="/dashboard"
          className={`flex items-center px-3 py-2 rounded-lg ${
            pathname === '/dashboard' ? 'bg-gray-100 text-black' : 'text-gray-600 hover:bg-gray-50'
          }`}
          onClick={() => setIsOpen(false)}
        >
          <svg className="w-4 h-4 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
          </svg>
          Dashboard
        </Link>
        <Link 
          href="/tasks"
          className={`flex items-center px-3 py-2 rounded-lg ${
            pathname === '/tasks' ? 'bg-gray-100 text-black' : 'text-gray-600 hover:bg-gray-50'
          }`}
          onClick={() => setIsOpen(false)}
        >
          <svg className="w-4 h-4 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
          </svg>
          Tasks
        </Link>
        <Link 
          href="/ai-chat"
          className={`flex items-center px-3 py-2 rounded-lg ${
            pathname === '/ai-chat' ? 'bg-gray-100 text-black' : 'text-gray-600 hover:bg-gray-50'
          }`}
          onClick={() => setIsOpen(false)}
        >
          <svg className="w-4 h-4 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
          </svg>
          AI Chat
        </Link>
      </div>

      {/* Sign Out */}
      <div className="mt-auto p-4 border-t">
        <button
          onClick={handleSignOut}
          className="flex items-center w-full px-3 py-2 text-gray-600 hover:bg-gray-50 rounded-lg"
        >
          <svg className="w-4 h-4 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
          </svg>
          Sign Out
        </button>
      </div>
    </nav>
  )
}