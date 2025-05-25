'use client'

import { useEffect, useState } from 'react'
import AdminLayout from '@/components/layouts/AdminLayout'
import { labels } from '@/locales'
import { useLanguage } from '@/context/LanguageContext'

interface Alert {
  id: number
  severity: string
  message: string
  timestamp: string
  assignedTo?: string
}

export default function DashboardPage() {
  const { language } = useLanguage()
  const [alerts, setAlerts] = useState<Alert[]>([])

  useEffect(() => {
    const fetchAlerts = async () => {
      try {
        const res = await fetch('/api/alerts')
        const data = await res.json()
        setAlerts(data)
      } catch (err) {
        console.error('Error fetching alerts:', err)
      }
    }

    fetchAlerts()
  }, [])

  const total = alerts.length
  const unassigned = alerts.filter(a => !a.assignedTo).length
  const assignedPerUser = alerts.reduce<Record<string, number>>((acc, alert) => {
    if (alert.assignedTo) {
      acc[alert.assignedTo] = (acc[alert.assignedTo] || 0) + 1
    }
    return acc
  }, {})

  return (
    <AdminLayout>
      <div className="space-y-4">
        <h2 className="text-2xl font-bold">{labels[language].dashboard}</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-gray p-4 rounded shadow">
            <h3 className="text-lg font-semibold">Total de alertas</h3>
            <p className="text-3xl font-bold text-blue-700">{total}</p>
          </div>
          <div className="bg-gray p-4 rounded shadow">
            <h3 className="text-lg font-semibold">Alertas sin asignar</h3>
            <p className="text-3xl font-bold text-red-700">{unassigned}</p>
          </div>
          <div className="bg-gray p-4 rounded shadow">
            <h3 className="text-lg font-semibold">Alertas por operador</h3>
            <ul className="mt-2 text-sm text-white-700 space-y-1">
              {Object.entries(assignedPerUser).map(([user, count]) => (
                <li key={user}>
                  <span className="font-medium">{user}</span>: {count}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </AdminLayout>
  )
}