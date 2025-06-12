// components/security/DeviceList.tsx
'use client'

import React from 'react'
import { CheckCircle, XCircle, FileDiff } from 'lucide-react'

interface DeviceListProps {
  devices: string[]
  selected: string[]
  status: Record<string, 'ok' | 'error' | null>
  onToggle: (device: string) => void
  onShowDiff: (device: string) => void
}

export function DeviceList({ devices, selected, status, onToggle, onShowDiff }: DeviceListProps) {
  return (
    <div className="bg-white p-4 rounded shadow">
      <h3 className="text-xl font-semibold mb-2">Dispositivos</h3>
      <ul className="border rounded divide-y mb-4">
        {devices.map(device => (
          <li key={device} className="flex items-center justify-between px-3 py-2">
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={selected.includes(device)}
                onChange={() => onToggle(device)}
              />
              <span>{device}</span>
            </div>
            <div className="flex items-center gap-3">
              {status[device] === 'ok' && <CheckCircle className="text-green-600" size={20} aria-label="OK" />}
              {status[device] === 'error' && <XCircle className="text-red-600" size={20} aria-label="Error" />}
              <button onClick={() => onShowDiff(device)} title="Ver diferencias">
                <FileDiff className="text-gray-600 hover:text-gray-800" size={20} aria-label="Diff" />
              </button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  )
}