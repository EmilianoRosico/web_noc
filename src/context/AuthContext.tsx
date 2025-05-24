'use client'

import { createContext, useContext, useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { parseCookies, setCookie, destroyCookie } from 'nookies'

interface User {
  id: number
  email: string
  role: 'admin' | 'user'
}

interface AuthContextType {
  user: User | null
  login: (email: string, password: string) => Promise<boolean>
  logout: () => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null)
  const router = useRouter()

  useEffect(() => {
    const cookies = parseCookies()
    const storedUser = cookies['noc_user']
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser))
      } catch (err) {
        console.error('Error parsing cookie', err)
      }
    }
  }, [])

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      const res = await fetch('/api/auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      })

      if (!res.ok) return false

      const data = await res.json()
      setUser(data.user)

      setCookie(null, 'noc_user', JSON.stringify(data.user), {
        maxAge: 60 * 60 * 8,
        path: '/',
      })

      return true
    } catch (err) {
      console.error('Login error:', err)
      return false
    }
  }

  const logout = () => {
    destroyCookie(null, 'noc_user')
    setUser(null)
    router.push('/login')
  }

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) throw new Error('useAuth must be used within AuthProvider')
  return context
}