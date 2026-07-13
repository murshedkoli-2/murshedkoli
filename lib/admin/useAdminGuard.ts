'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'

/**
 * Client-side admin guard shared by every manager page.
 * Redirects to /admin/login when the local session flag is absent.
 * Returns `ready` — render nothing until it is true to avoid a flash.
 */
export function useAdminGuard(): boolean {
  const router = useRouter()
  const [ready, setReady] = useState(false)

  useEffect(() => {
    if (typeof window === 'undefined') return
    if (localStorage.getItem('adminLoggedIn') !== 'true') {
      router.push('/admin/login')
      return
    }
    setReady(true)
  }, [router])

  return ready
}
