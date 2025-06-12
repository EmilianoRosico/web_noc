// hooks/useAcls.ts
import { useEffect, useState, useCallback } from 'react'

type SubnetEntry = { id: string; subnet: string; name: string }

export function useAcls() {
  const [snmp, setSnmp] = useState<SubnetEntry[]>([])
  const [ssh,  setSsh]  = useState<SubnetEntry[]>([])

  useEffect(() => {
    fetch('/api/security/acls')
      .then(r => r.json())
      .then(data => {
        setSnmp(data.snmp  || [])
        setSsh(data.ssh    || [])
      })
  }, [])

  const addAcl = useCallback(async (type: 'snmp'|'ssh', subnet: string, name: string) => {
    const res = await fetch('/api/security/acls', {
      method:  'POST',
      headers: { 'Content-Type': 'application/json' },
      body:    JSON.stringify({ type, subnet, name }),
    })
    const entry = await res.json()
    if (type === 'snmp') setSnmp(prev => [...prev, entry])
    else                setSsh(prev => [...prev, entry])
  }, [])

  const deleteAcl = useCallback(async (type: 'snmp'|'ssh', ids: string[]) => {
    await fetch('/api/security/acls', {
      method:  'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body:    JSON.stringify({ type, ids }),
    })
    if (type === 'snmp')
      setSnmp(prev => prev.filter(e => !ids.includes(e.id)))
    else
      setSsh(prev => prev.filter(e => !ids.includes(e.id)))
  }, [])

  return { snmp, ssh, addAcl, deleteAcl }
}
