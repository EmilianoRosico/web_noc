'use client'

import { useEffect, useState, useMemo } from 'react'
import AlertDetailModal from '@/components/AlertDetailModal'
import { useLanguage } from '@/context/LanguageContext'
import { labels } from '@/locales'

interface Alert {
  id: number
  severity: 'critical' | 'warning' | 'info'
  message: string
  timestamp: string
}

export default function AlertPanel() {
  const [alerts, setAlerts] = useState<Alert[]>([])
  const [currentPage, setCurrentPage] = useState(1)
  const [selectedSeverity, setSelectedSeverity] = useState<'all' | 'critical' | 'warning' | 'info'>('all')
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc')
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null)
  const [selectedAlert, setSelectedAlert] = useState<Alert | null>(null)
  const alertsPerPage = 10

  const { language, setLanguage } = useLanguage()

  const fetchAlerts = async () => {
    try {
      const res = await fetch('https://jsonplaceholder.typicode.com/posts')
      const data = await res.json()
      const parsed = data.slice(0, 50).map((item: any, index: number) => ({
        id: index + 1,
        severity: index % 3 === 0 ? 'critical' : index % 3 === 1 ? 'warning' : 'info',
        message: item.title,
        timestamp: new Date().toISOString(),
      }))
      setAlerts(parsed)
      setLastUpdated(new Date())
    } catch (err) {
      console.error('Error al obtener alertas', err)
    }
  }

  useEffect(() => {
    fetchAlerts()
    const interval = setInterval(fetchAlerts, 60000)
    return () => clearInterval(interval)
  }, [])

  const filteredAlerts = useMemo(() => {
    const filtered = selectedSeverity === 'all'
      ? alerts
      : alerts.filter(alert => alert.severity === selectedSeverity)

    return [...filtered].sort((a, b) => {
      const dateA = new Date(a.timestamp).getTime()
      const dateB = new Date(b.timestamp).getTime()
      return sortOrder === 'asc' ? dateA - dateB : dateB - dateA
    })
  }, [alerts, selectedSeverity, sortOrder])

  const totalPages = Math.ceil(filteredAlerts.length / alertsPerPage)

  const currentAlerts = useMemo(() => {
    const start = (currentPage - 1) * alertsPerPage
    return filteredAlerts.slice(start, start + alertsPerPage)
  }, [filteredAlerts, currentPage])

  return (
    <div className="bg-white rounded p-4 shadow text-gray-800">
      <div className="flex flex-wrap justify-between items-center gap-2 mb-3">
        <h3 className="text-lg font-semibold">
          {labels[language].alertsHeader}
          <span className="text-sm font-normal text-gray-500">
            ({filteredAlerts.length} {labels[language].total})
          </span>
          {lastUpdated && (
            <span className="text-xs text-gray-500 block">
              {labels[language].lastUpdated}: {lastUpdated.toLocaleTimeString()}
            </span>
          )}
        </h3>
        <div className="flex items-center gap-2">
          <select
            value={selectedSeverity}
            onChange={(e) => {
              setSelectedSeverity(e.target.value as any)
              setCurrentPage(1)
            }}
            className="border border-gray-300 rounded px-2 py-1 text-sm"
          >
            <option value="all">{labels[language].all}</option>
            <option value="critical">{labels[language].critical}</option>
            <option value="warning">{labels[language].warning}</option>
            <option value="info">{labels[language].info}</option>
          </select>
          <select
            value={language}
            onChange={(e) => setLanguage(e.target.value)}
            className="border border-gray-300 rounded px-2 py-1 text-sm"
          >
            <option value="en">English</option>
            <option value="es">Español</option>
            <option value="fr">Français</option>
          </select>
          <button
            onClick={fetchAlerts}
            className="px-2 py-1 text-sm border border-gray-300 rounded text-gray-800"
          >
            {labels[language].refresh}
          </button>
          <button
            onClick={() => setSortOrder((prev) => (prev === 'asc' ? 'desc' : 'asc'))}
            className="px-2 py-1 text-sm border border-gray-300 rounded text-gray-800"
          >
            {sortOrder === 'asc' ? labels[language].oldestFirst : labels[language].newestFirst}
          </button>
        </div>
      </div>

      {filteredAlerts.length === 0 ? (
        <p className="text-gray-400">{labels[language].noAlerts}</p>
      ) : (
        <>
          <ul className="space-y-2 mb-4">
            {currentAlerts.map((alert) => (
              <li
                onClick={() => setSelectedAlert(alert)}
                className={`cursor-pointer p-3 rounded border-l-4 text-white ${
                  alert.severity === 'critical'
                    ? 'bg-red-700 border-red-400'
                    : alert.severity === 'warning'
                    ? 'bg-yellow-700 border-yellow-400'
                    : 'bg-blue-700 border-blue-400'
                }`}
                key={alert.id}
              >
                <p className="font-medium">{alert.message}</p>
                <p className="text-sm text-gray-300">{alert.timestamp}</p>
              </li>
            ))}
          </ul>
          <div className="flex justify-between items-center">
            <button
              onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              className="px-4 py-2 bg-gray-300 text-gray-800 rounded disabled:opacity-50"
            >
              {labels[language].previous}
            </button>
            <span className="text-sm">
              {labels[language].page} {currentPage} {labels[language].of} {totalPages}
            </span>
            <button
              onClick={() =>
                setCurrentPage((prev) => Math.min(prev + 1, totalPages))
              }
              disabled={currentPage === totalPages}
              className="px-4 py-2 bg-gray-300 text-gray-800 rounded disabled:opacity-50"
            >
              {labels[language].next}
            </button>
          </div>
        </>
      )}
      {selectedAlert && (
        <AlertDetailModal alert={selectedAlert} onClose={() => setSelectedAlert(null)} />
      )}
    </div>
  )
}