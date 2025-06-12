// components/security/AclSection.tsx
'use client'

import React, { useState } from 'react'
import { useLanguage } from '@/context/LanguageContext'
import { labels } from '@/locales'

type SubnetEntry = { id: string; subnet: string; name?: string }

interface AclSectionProps {
  label: string
  entries: SubnetEntry[]
  newValue: string
  onChange: (v: string) => void
  onAdd: (subnet: string, name: string) => void
  selected: string[]
  onToggle: (id: string) => void
  onDelete: () => void
}

export function AclSection({
  label,
  entries,
  newValue,
  onChange,
  onAdd,
  selected,
  onToggle,
  onDelete,
}: AclSectionProps) {
  const [entryName, setEntryName] = useState('')
  const [error, setError] = useState('')
  const { language } = useLanguage()

  const validateCidr = (cidr: string) => {
    const regex = /^([0-9]{1,3}\.){3}[0-9]{1,3}(\/(\d|[12]\d|3[0-2]))?$/
    return regex.test(cidr)
  }

  const handleAdd = () => {
    setError('')
    const cidr = newValue.trim()
    const name = entryName.trim()
    if (!validateCidr(cidr)) {
      setError(labels[language].invalidSubnet)
      return
    }
    if (!name) {
      setError(labels[language].nameRequired)
      return
    }
    if (entries.some(e => e.subnet === cidr)) {
      setError(labels[language].subnetExists)
      return
    }
    onAdd(cidr, name)
    setEntryName('')
  }

  return (
    <div className="bg-white p-6 rounded-lg shadow mb-8">
      <h3 className="text-2xl font-semibold mb-4">{label}</h3>

      {/* Form inputs */}
      <div className="flex flex-col sm:flex-row sm:items-end gap-3 mb-4">
        <div className="flex-1">
          <label className="block text-sm font-medium text-gray-700 mb-1">{labels[language].subnetHost}</label>
          <input
            type="text"
            value={newValue}
            onChange={e => onChange(e.target.value)}
            className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
            placeholder="Ej: 192.168.0.0/24"
          />
        </div>
        <div className="flex-1">
          <label className="block text-sm font-medium text-gray-700 mb-1">{labels[language].name}</label>
          <input
            type="text"
            value={entryName}
            onChange={e => setEntryName(e.target.value)}
            className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
            placeholder="Nombre de la subred"
          />
        </div>
        <div>
          <button
            onClick={handleAdd}
            className="inline-flex items-center px-4 py-2 bg-green-600 border border-transparent rounded-md shadow-sm text-white hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
          >
            {labels[language].add}
          </button>
        </div>
      </div>
      {error && <p className="text-red-600 text-sm mb-4">{error}</p>}

      {/* Entries table */}
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Select</th>
              <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Subnet/Host</th>
              <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Name</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {entries.map(item => (
              <tr key={item.id} className="hover:bg-gray-50">
                <td className="px-4 py-2">
                  <input
                    type="checkbox"
                    checked={selected.includes(item.id)}
                    onChange={() => onToggle(item.id)}
                    className="h-4 w-4 text-blue-600 border-gray-300 rounded"
                  />
                </td>
                <td className="px-4 py-2 text-sm text-gray-900">{item.subnet}</td>
                <td className="px-4 py-2 text-sm text-gray-700">{item.name || '—'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Delete button */}
      {selected.length > 0 && (
        <div className="mt-4 text-right">
          <button
            onClick={onDelete}
            className="inline-flex items-center px-4 py-2 bg-red-600 border border-transparent rounded-md shadow-sm text-white hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
          >
            {labels[language].deleteSelected}
          </button>
        </div>
      )}
    </div>
  )
}
