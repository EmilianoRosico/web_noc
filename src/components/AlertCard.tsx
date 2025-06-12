'use client'

import React from 'react'
import { useLanguage } from '@/context/LanguageContext'
import { labels } from '@/locales'

interface Alert {
  id: number
  severity: 'critical' | 'warning' | 'info'
  message: string
  timestamp: string
  assignedTo?: string
}

interface AlertCardProps {
  alert: Alert
  currentOperator: string
  onSelect: (alert: Alert) => void
  onAssign: (updatedAlert: Alert) => void
}

export default function AlertCard({
  alert,
  currentOperator,
  onSelect,
  onAssign,
}: AlertCardProps) {
  const { language } = useLanguage()
  const handleAssign = async (e: React.MouseEvent) => {
    e.stopPropagation()
    try {
      const res = await fetch('/api/alerts/assign', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: alert.id, username: currentOperator }),
      })
      if (res.ok) {
        const updated = await res.json()
        onAssign(updated)
      }
    } catch (err) {
      console.error('Error asignando alerta', err)
    }
  }

  return (
    <li
      onClick={() => onSelect(alert)}
      className={`cursor-pointer p-4 rounded border-l-4 text-white grid grid-cols-1 sm:grid-cols-[2fr_1fr_1fr_auto] gap-4 items-center ${
        alert.severity === 'critical'
          ? 'bg-red-700 border-red-400'
          : alert.severity === 'warning'
          ? 'bg-yellow-700 border-yellow-400'
          : 'bg-blue-700 border-blue-400'
      }`}
    >
      <div>
        <p className="font-semibold text-base">{alert.message}</p>
      </div>
      <div>
        <p className="text-sm text-gray-300">{new Date(alert.timestamp).toLocaleString()}</p>
      </div>
      <div>
        <p className="text-sm italic text-gray-300">
          {alert.assignedTo || labels[language].unassigned}
        </p>
      </div>
      <div className="text-right">
        {!alert.assignedTo ? (
          <button
            onClick={handleAssign}
            className="text-xs px-3 py-1 bg-white text-gray-800 rounded shadow"
          >
            {labels[language].take}
          </button>
        ) : (
          <button
            onClick={async (e) => {
              e.stopPropagation()
              try {
                const res = await fetch('/api/alerts/unassign', {
                  method: 'POST',
                  headers: { 'Content-Type': 'application/json' },
                  body: JSON.stringify({ id: alert.id }),
                })
                if (res.ok) {
                  const updated = await res.json()
                  onAssign(updated)
                }
              } catch (err) {
                console.error('Error liberando alerta', err)
              }
            }}
            className="text-xs px-3 py-1 bg-white text-gray-800 rounded shadow"
          >
            {labels[language].release}
          </button>
        )}
      </div>
    </li>
  )
}

