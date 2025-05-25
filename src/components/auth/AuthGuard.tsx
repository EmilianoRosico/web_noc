'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { parseCookies } from 'nookies'

export default function AuthGuard({ children }: { children: React.ReactNode }) {
  const router = useRouter()

  useEffect(() => {
    const { noc_user } = parseCookies()

    if (!noc_user) {
      router.replace('/login')
    }
  }, [router])

  return <>{children}</>
}