// components/security/DiffModal.tsx
'use client'

import React from 'react'
import { useLanguage } from '@/context/LanguageContext'
import { labels } from '@/locales'
import DiffViewer from './DiffViewer'

interface DiffModalProps {
  open: boolean
  original: string
  updated: string
  onClose: () => void
}

export function DiffModal({ open, original, updated, onClose }: DiffModalProps) {
  if (!open) return null
  const { language } = useLanguage()
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white p-6 rounded shadow-lg max-w-4xl w-full">
        <h4 className="text-lg font-semibold mb-4">{labels[language].configComparison}</h4>
        <DiffViewer original={original} updated={updated} />
        <div className="mt-6 text-right">
          <button
            onClick={onClose}
            className="bg-gray-600 text-white px-4 py-2 rounded hover:bg-gray-700"
          >
            {labels[language].close}
          </button>
        </div>
      </div>
    </div>
  )
}

