'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

interface NavProps {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  children?: React.ReactNode;
}

export default function Nav({ isOpen, setIsOpen }: NavProps) {
  const pathname = usePathname()
  
  return (
    <nav className={`
      fixed inset-y-0 left-0 
      w-64 h-screen bg-white border-r 
      flex flex-col z-50
      transform transition-transform duration-200 ease-in-out
      ${isOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
    `}>
      <div className="flex-1 overflow-y-auto">
        <div className="p-4 md:p-4 pl-16 md:pl-4">
          <Link href="/" className="text-2xl font-bold">T</Link>
        </div>
        
        <div className="space-y-1 px-3">
          <Link 
            href="/dashboard"
            className={`flex items-center gap-3 px-4 py-2 text-[--text-secondary] hover:bg-gray-50 rounded-lg transition-colors ${
              pathname === '/dashboard' ? 'bg-[--bg-hover] text-[--text]' : ''
            }`}
            onClick={() => setIsOpen(false)}
          >
            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
            </svg>
            Dashboard
          </Link>

          <Link 
            href="/tasks"
            className={`flex items-center gap-3 px-4 py-2 text-[--text-secondary] hover:bg-gray-50 rounded-lg transition-colors ${
              pathname === '/tasks' ? 'bg-[--bg-hover] text-[--text]' : ''
            }`}
            onClick={() => setIsOpen(false)}
          >
            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
            </svg>
            Tasks
          </Link>

          <Link 
            href="/habits"
            className={`flex items-center gap-3 px-4 py-2 text-[--text-secondary] hover:bg-gray-50 rounded-lg transition-colors ${
              pathname === '/habits' ? 'bg-[--bg-hover] text-[--text]' : ''
            }`}
            onClick={() => setIsOpen(false)}
          >
            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
            Habits
          </Link>

          <Link 
            href="/journal"
            className={`flex items-center gap-3 px-4 py-2 text-[--text-secondary] hover:bg-gray-50 rounded-lg transition-colors ${
              pathname === '/journal' ? 'bg-[--bg-hover] text-[--text]' : ''
            }`}
            onClick={() => setIsOpen(false)}
          >
            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
            </svg>
            Journal
          </Link>

          <Link 
            href="/schedule"
            className={`flex items-center gap-3 px-4 py-2 text-[--text-secondary] hover:bg-gray-50 rounded-lg transition-colors ${
              pathname === '/schedule' ? 'bg-[--bg-hover] text-[--text]' : ''
            }`}
            onClick={() => setIsOpen(false)}
          >
            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            Schedule
          </Link>

          <Link 
            href="/ai-chat"
            className={`flex items-center gap-3 px-4 py-2 text-[--text-secondary] hover:bg-gray-50 rounded-lg transition-colors ${
              pathname === '/ai-chat' ? 'bg-[--bg-hover] text-[--text]' : ''
            }`}
            onClick={() => setIsOpen(false)}
          >
            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
            </svg>
            AI Chat
          </Link>
        </div>
      </div>

      <div className="p-4 border-t">
        <button
          onClick={() => {/* Sign out logic */}}
          className="flex items-center gap-3 px-4 py-2 text-[--text-secondary] hover:bg-gray-50 rounded-lg transition-colors w-full"
        >
          <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
          </svg>
          Sign Out
        </button>
      </div>
    </nav>
  )
}