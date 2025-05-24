'use client'

import { useEffect } from 'react'
import AdminLayout from '@/components/layouts/AdminLayout'
import AlertPanel from '@/components/AlertPanel'
import { labels } from '@/locales'
import { useLanguage } from '@/context/LanguageContext'

export default function DashboardPage() {
  const { language } = useLanguage()

  useEffect(() => {
    // This effect is no longer needed for language sync
  }, [])

  return (
    <AdminLayout>
      <div className="space-y-4">
        <h2 className="text-2xl font-bold">{labels[language].dashboard}</h2>
        <AlertPanel />
      </div>
    </AdminLayout>
  )
}