'use client'

import { useState } from 'react'
import AdminLayout from '@/components/layouts/AdminLayout'
import { AclSection } from '@/components/security/AclSection'
import { DeviceList } from '@/components/security/DeviceList'
import { DiffModal } from '@/components/security/DiffModal'
import { useAcls } from '@/hooks/useAcls'
import { useDevices } from '@/hooks/useDevices'

type DiffData = { original: string; updated: string }

export default function SecurityModulePage() {
  const { snmp, ssh, addAcl, deleteAcl } = useAcls()
  const [newSnmp, setNewSnmp] = useState('')
  const [newSsh, setNewSsh] = useState('')
  const [selectedSnmp, setSelectedSnmp] = useState<string[]>([])
  const [selectedSsh, setSelectedSsh] = useState<string[]>([])
  const { devices, selected, status, toggleDevice, updateStatus } = useDevices([
    'device1',
    'device2',
    'device3',
  ])
  const [showModal, setShowModal] = useState(false)
  const [diffData, setDiffData] = useState<DiffData>({ original: '', updated: '' })

  // Simula compliance y actualiza estado
  const handleCompliance = async () => {
    await fetch('/api/security/compliance', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ devices: selected }),
    })
    const updates: Record<string, 'ok' | 'error'> = {}
    selected.forEach(device => {
      updates[device] = Math.random() > 0.5 ? 'ok' : 'error'
    })
    updateStatus(updates)
  }

  const handleEnforcement = async () => {
    await fetch('/api/security/enforcement', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ devices: selected }),
    })
  }

  const showDiff = (device: string) => {
    const current = `ip access-list standard MGMT-ACL
   10 permit 10.200.101.0/24
   15 permit 10.4.39.16/28
   20 permit 10.254.0.0/22
   30 permit host 10.250.99.2
   40 permit host 10.255.0.101
   80 deny any`.trim()
    const expected = `ip access-list standard MGMT-ACL
   10 permit 10.200.101.0/24
   15 permit 10.4.39.16/28
   20 permit 10.254.0.0/22
   30 permit host 10.250.99.2
   40 permit host 10.255.0.101
   80 deny any`.trim()
    setDiffData({ original: current, updated: expected })
    setShowModal(true)
  }

  return (
    <AdminLayout>
      <div className="max-w-3xl mx-auto p-6 text-gray-800">
        <h2 className="text-2xl font-bold mb-6">Módulo de Seguridad</h2>

        <AclSection
          label="ACL ALLOWED_SNMP"
          entries={snmp}
          newValue={newSnmp}
          onChange={setNewSnmp}
          onAdd={(subnet, name) => addAcl('snmp', subnet, name)}
          selected={selectedSnmp}
          onToggle={id =>
            setSelectedSnmp(prev =>
              prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
            )
          }
          onDelete={() => deleteAcl('snmp', selectedSnmp)}
        />

        <AclSection
          label="ACL ALLOWED_SSH"
          entries={ssh}
          newValue={newSsh}
          onChange={setNewSsh}
          onAdd={(subnet, name) => addAcl('ssh', subnet, name)}
          selected={selectedSsh}
          onToggle={id =>
            setSelectedSsh(prev =>
              prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
            )
          }
          onDelete={() => deleteAcl('ssh', selectedSsh)}
        />

        <DeviceList
          devices={devices}
          selected={selected}
          status={status}
          onToggle={toggleDevice}
          onShowDiff={showDiff}
        />

        <div className="flex gap-4 mt-4">
          <button
            onClick={handleCompliance}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            Compliance
          </button>
          <button
            onClick={handleEnforcement}
            className="bg-purple-600 text-white px-4 py-2 rounded hover:bg-purple-700"
          >
            Enforcement
          </button>
        </div>

        <DiffModal
          open={showModal}
          original={diffData.original}
          updated={diffData.updated}
          onClose={() => setShowModal(false)}
        />
      </div>
    </AdminLayout>
  )
}
