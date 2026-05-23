'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'

const AdminIndex = () => {
  const router = useRouter()

  useEffect(() => {
    // Check if user is already logged in
    const adminLoggedIn = localStorage.getItem('adminLoggedIn')
    if (adminLoggedIn === 'true') {
      router.push('/admin/dashboard')
    } else {
      router.push('/admin/login')
    }
  }, [router])

  return (
    <div className="min-h-screen bg-black flex flex-col items-center justify-center gap-4">
      {/* Premium minimal spinner */}
      <div className="relative w-8 h-8">
        <div className="absolute inset-0 rounded-full border border-white/[0.04]" />
        <div className="absolute inset-0 rounded-full border-t border-white/40 animate-spin" />
      </div>
      <div className="text-[10px] text-zinc-500 font-mono uppercase tracking-[0.2em] animate-pulse">
        Securing Session...
      </div>
    </div>
  )
}

export default AdminIndex