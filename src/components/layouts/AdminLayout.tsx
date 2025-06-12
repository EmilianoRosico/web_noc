'use client'

import { ReactNode, useEffect, useState } from 'react'
import Link from 'next/link'
import { labels } from '@/locales'
import { useLanguage } from '@/context/LanguageContext'
import { destroyCookie, parseCookies} from 'nookies'
import { useRouter } from 'next/navigation'


export default function AdminLayout({ children }: { children: ReactNode }) {
  const { language, setLanguage } = useLanguage()
  const router = useRouter()
  const [isVerified, setIsVerified] = useState(false)

  useEffect(() => {
    const { noc_user } = parseCookies()
    if (!noc_user) {
      router.replace('/login')
    } else {
      setIsVerified(true)
    }
  }, [router])

  if (!isVerified) {
    return null // ⛔️ evita renderizar el contenido protegido
  }

  const handleLogout = () => {
    destroyCookie(null, 'noc_user', { path: '/' })
    router.push('/login')
  }

  return (
    <div className="flex min-h-screen bg-gray-900 text-white">
      <aside className="w-64 bg-gray-800 p-4">
        <h2 className="text-xl font-bold mb-4">{labels[language].nocPanel ?? 'Panel NOC'}</h2>
        <nav className="flex flex-col space-y-2">
          <Link href="/dashboard" className="hover:underline">{labels[language].dashboard}</Link>
          <Link href="/config" className="hover:underline">{labels[language].config}</Link>
          <Link href="/security_module" className="hover:underline">{labels[language].security}</Link>
          <Link href="/alerts" className="hover:underline">{labels[language].alerts}</Link>
        </nav>
      </aside>
      <div className="flex-1 flex flex-col">
        <header className="w-full bg-gray-700 shadow p-4 flex justify-between items-center">
          <h1 className="text-xl font-bold">{labels[language].title}</h1>
          <div className="flex items-center">
            <select
              value={language}
              onChange={(e) => {
                const lang = e.target.value as 'es' | 'en' | 'fr'
                setLanguage(lang)
                if (typeof window !== 'undefined') {
                  localStorage.setItem('language', lang)
                }
              }}
              className="bg-gray-600 text-white px-2 py-1 rounded mr-4"
            >
              <option value="es">ES</option>
              <option value="en">EN</option>
              <option value="fr">FR</option>
            </select>
            <button
              onClick={handleLogout}
              className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
            >
              {labels[language].logout}
            </button>
          </div>
        </header>
        <main className="flex-1 p-6 bg-gray-800">
          {children}
        </main>
      </div>
    </div>
  )
}

