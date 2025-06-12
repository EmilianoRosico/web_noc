

'use client'

import { useLanguage } from '@/context/LanguageContext'
import { labels } from '@/locales'

interface Alert {
  id: number
  severity: 'critical' | 'warning' | 'info'
  message: string
  timestamp: string
}

interface AlertDetailModalProps {
  alert: Alert
  onClose: () => void
}

export default function AlertDetailModal({ alert, onClose }: AlertDetailModalProps) {
  const { language } = useLanguage()
  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center z-50">
      <div className="bg-white text-gray-800 rounded p-6 w-full max-w-md shadow-lg relative">
        <button
          onClick={onClose}
          className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
        >
          ✕
        </button>
        <h4 className="text-xl font-bold mb-2">{labels[language].alertDetail}</h4>
        <p><strong>ID:</strong> {alert.id}</p>
        <p><strong>{labels[language].message}:</strong> {alert.message}</p>
        <p><strong>Severidad:</strong> {alert.severity}</p>
        <p><strong>Timestamp:</strong> {alert.timestamp}</p>

        <div className="mt-4">
          <h5 className="font-semibold mb-2">{labels[language].actions}</h5>
          <ul className="space-y-2">
            <li><button className="w-full bg-blue-600 text-white py-1 px-2 rounded hover:bg-blue-700">{labels[language].acknowledge}</button></li>
            <li><button className="w-full bg-green-600 text-white py-1 px-2 rounded hover:bg-green-700">{labels[language].assign}</button></li>
            <li><button className="w-full bg-gray-600 text-white py-1 px-2 rounded hover:bg-gray-700">{labels[language].markResolved}</button></li>
          </ul>
        </div>
      </div>
    </div>
  )
}

