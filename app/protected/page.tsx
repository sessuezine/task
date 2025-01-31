'use client'

import { getSupabase } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'

export default function ProtectedPage() {
  const router = useRouter()
  const supabase = getSupabase()

  useEffect(() => {
    const checkUser = async () => {
      const { data: { session } } = await supabase.auth.getSession()
      if (!session) {
        router.push('/login')
      }
    }

    checkUser()
  }, [router])

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold">Protected Page</h1>
      <p>You can only see this if you&apos;re logged in.</p>
    </div>
  )
}
