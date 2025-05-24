'use client'

import { useState } from 'react'
import AdminLayout from '@/components/layouts/AdminLayout'

export default function ConfigPage() {
  const [router, setRouter] = useState('')
  const [interfaceName, setInterfaceName] = useState('')
  const [action, setAction] = useState<'shut' | 'no shut'>('shut')
  const [output, setOutput] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setOutput(`Enviando comando "${action}" a la interfaz ${interfaceName} en el router ${router}...`)
    // Aquí iría una llamada real a una API que ejecuta el script
  }

  return (
    <AdminLayout>
      <div className="bg-white rounded p-6 shadow text-gray-800 max-w-lg mx-auto">
        <h2 className="text-2xl font-bold mb-4">Configuración de Puerto</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block mb-1 font-medium">Router</label>
            <input
              type="text"
              value={router}
              onChange={(e) => setRouter(e.target.value)}
              className="w-full border border-gray-300 rounded px-3 py-2"
              placeholder="Ej: PE-Router-01"
              required
            />
          </div>
          <div>
            <label className="block mb-1 font-medium">Interfaz</label>
            <input
              type="text"
              value={interfaceName}
              onChange={(e) => setInterfaceName(e.target.value)}
              className="w-full border border-gray-300 rounded px-3 py-2"
              placeholder="Ej: GigabitEthernet0/1"
              required
            />
          </div>
          <div>
            <label className="block mb-1 font-medium">Acción</label>
            <select
              value={action}
              onChange={(e) => setAction(e.target.value as 'shut' | 'no shut')}
              className="w-full border border-gray-300 rounded px-3 py-2"
            >
              <option value="shut">Shut</option>
              <option value="no shut">No Shut</option>
            </select>
          </div>
          <button
            type="submit"
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            Ejecutar
          </button>
        </form>
        {output && <div className="mt-4 p-3 bg-gray-100 rounded text-sm">{output}</div>}
      </div>
    </AdminLayout>
  )
}