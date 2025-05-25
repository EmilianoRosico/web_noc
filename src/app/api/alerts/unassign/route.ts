import { prisma } from '@/lib/prisma'
import { NextRequest, NextResponse } from 'next/server'

export async function POST(req: NextRequest) {
  try {
    const { id } = await req.json()

    const updated = await prisma.alert.update({
      where: { id },
      data: { assignedTo: null },
    })

    return NextResponse.json(updated)
  } catch (error) {
    console.error('Error desasignando alerta:', error)
    return NextResponse.json({ error: 'Error desasignando alerta' }, { status: 500 })
  }
}