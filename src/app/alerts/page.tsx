'use client'

import { useEffect } from 'react'
import AdminLayout from '@/components/layouts/AdminLayout'
import AlertPanel from '@/components/AlertPanel'

export default function DashboardPage() {

  useEffect(() => {
    // This effect is no longer needed for language sync
  }, [])

  return (
    <AdminLayout>
      <div className="space-y-4">
        <AlertPanel />
      </div>
    </AdminLayout>
  )
}