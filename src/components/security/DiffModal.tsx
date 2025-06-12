// components/security/DiffModal.tsx
'use client'

import React from 'react'
import DiffViewer from './DiffViewer'

interface DiffModalProps {
  open: boolean
  original: string
  updated: string
  onClose: () => void
}

export function DiffModal({ open, original, updated, onClose }: DiffModalProps) {
  if (!open) return null
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white p-6 rounded shadow-lg max-w-4xl w-full">
        <h4 className="text-lg font-semibold mb-4">Comparación de configuración</h4>
        <DiffViewer original={original} updated={updated} />
        <div className="mt-6 text-right">
          <button
            onClick={onClose}
            className="bg-gray-600 text-white px-4 py-2 rounded hover:bg-gray-700"
          >
            Cerrar
          </button>
        </div>
      </div>
    </div>
  )
}