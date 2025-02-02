'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { getSupabase } from '@/lib/supabase/client'

interface NavProps {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  children?: React.ReactNode;
}

export default function Nav({ isOpen, setIsOpen, children }: NavProps) {
  const pathname = usePathname()
  const supabase = getSupabase()

  const handleSignOut = async () => {
    await supabase.auth.signOut()
  }

  return (
    <nav className={`
      fixed inset-y-0 left-0 
      w-64 h-screen bg-white border-r 
      flex flex-col z-50
      transform transition-transform duration-200 ease-in-out
      ${isOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
    `}>
      <div className="flex-1 overflow-y-auto">
        <div className="p-4">
          <Link href="/" className="text-2xl font-bold">T</Link>
        </div>
        
        <div className="space-y-1 px-3">
          <Link 
            href="/dashboard"
            className={`flex items-center px-3 py-2 rounded-lg ${
              pathname === '/dashboard' ? 'bg-gray-100 text-black' : 'text-gray-600 hover:bg-gray-50'
            }`}
            onClick={() => setIsOpen(false)}
          >
            Dashboard
          </Link>
          <Link 
            href="/tasks"
            className={`flex items-center px-3 py-2 rounded-lg ${
              pathname === '/tasks' ? 'bg-gray-100 text-black' : 'text-gray-600 hover:bg-gray-50'
            }`}
            onClick={() => setIsOpen(false)}
          >
            Tasks
          </Link>
          <Link 
            href="/habits"
            className={`flex items-center px-3 py-2 rounded-lg ${
              pathname === '/habits' ? 'bg-gray-100 text-black' : 'text-gray-600 hover:bg-gray-50'
            }`}
            onClick={() => setIsOpen(false)}
          >
            Habits
          </Link>
          <Link 
            href="/journal"
            className={`flex items-center px-3 py-2 rounded-lg ${
              pathname === '/journal' ? 'bg-gray-100 text-black' : 'text-gray-600 hover:bg-gray-50'
            }`}
            onClick={() => setIsOpen(false)}
          >
            Journal
          </Link>
          <Link 
            href="/schedule"
            className={`flex items-center px-3 py-2 rounded-lg ${
              pathname === '/schedule' ? 'bg-gray-100 text-black' : 'text-gray-600 hover:bg-gray-50'
            }`}
            onClick={() => setIsOpen(false)}
          >
            Schedule
          </Link>
          <Link 
            href="/ai-chat"
            className={`flex items-center px-3 py-2 rounded-lg ${
              pathname === '/ai-chat' ? 'bg-gray-100 text-black' : 'text-gray-600 hover:bg-gray-50'
            }`}
            onClick={() => setIsOpen(false)}
          >
            AI Chat
          </Link>
        </div>
      </div>

      {/* Sign Out */}
      <div className="mt-auto p-4 border-t">
        <button
          onClick={handleSignOut}
          className="flex items-center w-full px-3 py-2 text-gray-600 hover:bg-gray-50 rounded-lg"
        >
          Sign Out
        </button>
      </div>
    </nav>
  )
}