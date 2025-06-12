// hooks/useDevices.ts
import { useState, useCallback } from 'react'

type DeviceStatus = 'ok' | 'error' | null

export function useDevices(initial: string[] = []) {
  const [devices] = useState<string[]>(initial)
  const [selected, setSelected] = useState<string[]>([])
  const [status, setStatus] = useState<Record<string, DeviceStatus>>({})

  const toggleDevice = useCallback((device: string) => {
    setSelected(prev => prev.includes(device) ? prev.filter(d => d !== device) : [...prev, device])
  }, [])

  const updateStatus = useCallback((updates: Record<string, DeviceStatus>) => {
    setStatus(prev => ({ ...prev, ...updates }))
  }, [])

  return { devices, selected, status, toggleDevice, updateStatus }
}