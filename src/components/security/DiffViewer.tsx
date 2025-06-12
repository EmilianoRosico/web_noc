// components/DiffViewer.tsx
'use client'

import { diffLines } from 'diff'
import React from 'react'

interface DiffViewerProps {
  original: string
  updated: string
}

export default function DiffViewer({ original, updated }: DiffViewerProps) {
  const diffResult = diffLines(original.trim(), updated.trim())

  const formatted = diffResult.map(part => {
    const prefix = part.added ? '+ ' : part.removed ? '- ' : '  '
    const colorClass = part.added
      ? 'text-green-600'
      : part.removed
      ? 'text-red-600'
      : 'text-gray-800'
    return part.value
      .split('\n')
      .filter(Boolean)
      .map((line, i) => (
        <div key={prefix + i + line} className={colorClass}>
          {prefix + line}
        </div>
      ))
  })

  return (
    <pre className="bg-gray-100 p-4 rounded text-sm font-mono whitespace-pre-wrap overflow-x-auto">
      {formatted}
    </pre>
  )
}