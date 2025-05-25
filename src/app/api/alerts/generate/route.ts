import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

const severities = ['critical', 'warning', 'info']

export async function POST() {
  try {
    const res = await fetch('https://jsonplaceholder.typicode.com/posts?_limit=1')
    const data = await res.json()

    const message = data[0]?.title || 'Alerta sin mensaje'
    const severity = severities[Math.floor(Math.random() * severities.length)]

    const alert = await prisma.alert.create({
      data: {
        message,
        severity
      }
    })

    return NextResponse.json(alert)
  } catch (error) {
    console.error('Error generando alerta', error)
    return NextResponse.json({ error: 'No se pudo generar la alerta' }, { status: 500 })
  }
}