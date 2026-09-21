'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'

/** UI readiness follows the server session; localStorage is never authorization. */
export function useAdminGuard(): boolean {
  const router = useRouter()
  const [ready, setReady] = useState(false)
  useEffect(() => {
    const controller = new AbortController()
    fetch('/api/auth/session', { cache: 'no-store', signal: controller.signal })
      .then((res) => {
        if (res.ok) setReady(true)
        else if (res.status === 401) router.replace('/admin/login')
      }).catch(() => {})
    return () => controller.abort()
  }, [router])
  return ready
}
