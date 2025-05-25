import { prisma } from '@/lib/prisma'
import { NextRequest, NextResponse } from 'next/server'

export async function POST(req: NextRequest) {
  const { id, username } = await req.json()

  const updated = await prisma.alert.update({
    where: { id },
    data: { assignedTo: username },
  })

  return NextResponse.json(updated)
}