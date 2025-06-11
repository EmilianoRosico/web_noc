'use client'

import { useEffect, useState } from 'react'
import { CheckCircle, XCircle, FileDiff } from 'lucide-react'
import AdminLayout from '@/components/layouts/AdminLayout'
import DiffViewer from '@/components/DiffViewer'

type SubnetEntry = {
  id: string
  subnet: string
}

export default function SecurityModulePage() {
  const [snmpSubnets, setSnmpSubnets] = useState<SubnetEntry[]>([])
  const [sshSubnets, setSshSubnets] = useState<SubnetEntry[]>([])
  const [newSnmp, setNewSnmp] = useState('')
  const [newSsh, setNewSsh] = useState('')
  const [selectedSnmp, setSelectedSnmp] = useState<string[]>([])
  const [selectedSsh, setSelectedSsh] = useState<string[]>([])
  const [selectedDevices, setSelectedDevices] = useState<string[]>([])
  const [deviceStatus, setDeviceStatus] = useState<Record<string, 'ok' | 'error' | null>>({})
  const [showModal, setShowModal] = useState(false)
  const [diffData, setDiffData] = useState<{ original: string; updated: string }>({ original: '', updated: '' })

  useEffect(() => {
    fetch('/api/security/acls')
      .then(res => res.json())
      .then(data => {
        setSnmpSubnets(data.snmp || [])
        setSshSubnets(data.ssh || [])
      })
  }, [])

  const addSubnet = async (type: 'snmp' | 'ssh', subnet: string) => {
    const res = await fetch('/api/security/acls', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ type, subnet }),
    })
    const data = await res.json()
    if (type === 'snmp') {
      setSnmpSubnets([...snmpSubnets, data])
      setNewSnmp('')
    } else {
      setSshSubnets([...sshSubnets, data])
      setNewSsh('')
    }
  }

  const deleteSubnets = async (type: 'snmp' | 'ssh', ids: string[]) => {
    await fetch('/api/security/acls', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ type, ids }),
    })
    if (type === 'snmp') {
      setSnmpSubnets(snmpSubnets.filter(s => !ids.includes(s.id)))
      setSelectedSnmp([])
    } else {
      setSshSubnets(sshSubnets.filter(s => !ids.includes(s.id)))
      setSelectedSsh([])
    }
  }

  const renderSection = (
    label: string,
    entries: SubnetEntry[],
    newValue: string,
    onChange: (v: string) => void,
    onAdd: () => void,
    selected: string[],
    toggleSelected: (id: string) => void,
    onDelete: () => void
  ) => (
    <div className="bg-white p-4 rounded shadow mb-6">
      <h3 className="text-xl font-semibold mb-2">{label}</h3>
      <div className="flex gap-2 mb-2">
        <input
          type="text"
          value={newValue}
          onChange={(e) => onChange(e.target.value)}
          className="border px-3 py-2 rounded w-full"
          placeholder="Ej: 192.168.0.0/24"
        />
        <button
          onClick={onAdd}
          className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
        >
          Agregar
        </button>
      </div>
      <ul className="border rounded divide-y">
        {entries.map((item) => (
          <li key={item.id} className="flex items-center justify-between px-3 py-2">
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={selected.includes(item.id)}
                onChange={() => toggleSelected(item.id)}
              />
              <span>{item.subnet}</span>
            </label>
          </li>
        ))}
      </ul>
      {selected.length > 0 && (
        <button
          onClick={onDelete}
          className="mt-3 bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
        >
          Eliminar seleccionados
        </button>
      )}
    </div>
  )

  const handleCompliance = async () => {
    await fetch('/api/security/compliance', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ devices: selectedDevices }),
    })

    const updated: Record<string, 'ok' | 'error'> = {}
    selectedDevices.forEach(device => {
      updated[device] = Math.random() > 0.5 ? 'ok' : 'error'
    })
    setDeviceStatus(prev => ({ ...prev, ...updated }))
    alert('Compliance solicitado para los dispositivos seleccionados')
  }

  const handleEnforcement = async () => {
    await fetch('/api/security/enforcement', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ devices: selectedDevices }),
    })
    alert('Enforcement solicitado para los dispositivos seleccionados')
  }

  const showDiff = (device: string) => {
    const current = `
ip access-list standard MGMT-ACL
   10 permit 10.200.101.0/24
   15 permit 10.4.39.16/28
   20 permit 10.255.1.0/24
   30 permit 10.250.1.0/24
   40 permit 10.250.80.0/24
   50 permit 10.255.80.0/24
   60 permit 10.255.14.0/24
   70 permit 10.254.0.0/22
   71 permit host 10.250.99.2
   72 permit host 10.255.0.101
   80 deny any
    `.trim()

    const expected = `
ip access-list standard MGMT-ACL
   10 permit 10.200.101.0/24
   15 permit 10.4.39.16/28
   20 permit 10.254.0.0/22
   30 permit host 10.250.99.2
   40 permit host 10.255.0.101
   80 deny any
    `.trim()

    setDiffData({ original: current, updated: expected })
    setShowModal(true)
  }

  return (
    <AdminLayout>
      <div className="max-w-3xl mx-auto p-6 text-gray-800">
        <h2 className="text-2xl font-bold mb-6">Módulo de Seguridad</h2>
        {renderSection(
          'ACL ALLOWED_SNMP',
          snmpSubnets,
          newSnmp,
          setNewSnmp,
          () => addSubnet('snmp', newSnmp),
          selectedSnmp,
          (id) =>
            setSelectedSnmp(selectedSnmp.includes(id)
              ? selectedSnmp.filter(i => i !== id)
              : [...selectedSnmp, id]),
          () => deleteSubnets('snmp', selectedSnmp)
        )}
        {renderSection(
          'ACL ALLOWED_SSH',
          sshSubnets,
          newSsh,
          setNewSsh,
          () => addSubnet('ssh', newSsh),
          selectedSsh,
          (id) =>
            setSelectedSsh(selectedSsh.includes(id)
              ? selectedSsh.filter(i => i !== id)
              : [...selectedSsh, id]),
          () => deleteSubnets('ssh', selectedSsh)
        )}
        <div className="bg-white p-4 rounded shadow">
          <h3 className="text-xl font-semibold mb-2">Dispositivos</h3>
          <ul className="border rounded divide-y mb-4">
            {['device1', 'device2', 'device3'].map((device) => (
              <li key={device} className="flex items-center justify-between px-3 py-2">
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={selectedDevices.includes(device)}
                    onChange={() =>
                      setSelectedDevices(selectedDevices.includes(device)
                        ? selectedDevices.filter(d => d !== device)
                        : [...selectedDevices, device])
                    }
                  />
                  <span>{device}</span>
                </div>
                <div className="flex items-center gap-3">
                  {deviceStatus[device] === 'ok' && (
                    <CheckCircle className="text-green-600" size={20} />
                  )}
                  {deviceStatus[device] === 'error' && (
                    <XCircle className="text-red-600" size={20} />
                  )}
                  <button onClick={() => showDiff(device)} title="Ver diferencias">
                    <FileDiff className="text-gray-600 hover:text-gray-800" size={20} />
                  </button>
                </div>
              </li>
            ))}
          </ul>
          <div className="flex gap-4">
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
        </div>
      </div>
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded shadow-lg max-w-4xl w-full">
            <h4 className="text-lg font-semibold mb-4">Comparación de configuración</h4>
            <DiffViewer original={diffData.original} updated={diffData.updated} />
            <div className="mt-6 text-right">
              <button
                onClick={() => setShowModal(false)}
                className="bg-gray-600 text-white px-4 py-2 rounded hover:bg-gray-700"
              >
                Cerrar
              </button>
            </div>
          </div>
        </div>
      )}
    </AdminLayout>
  )
}
