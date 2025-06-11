import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET() {
  const snmp = await prisma.aclEntry.findMany({ where: { type: 'snmp' } })
  const ssh = await prisma.aclEntry.findMany({ where: { type: 'ssh' } })
  return NextResponse.json({ snmp, ssh })
}

export async function POST(req: NextRequest) {
  const { type, subnet } = await req.json()
  if (!['snmp', 'ssh'].includes(type) || !subnet) {
    return NextResponse.json({ error: 'Invalid input' }, { status: 400 })
  }
  const newEntry = await prisma.aclEntry.create({
    data: { type, subnet },
  })
  return NextResponse.json(newEntry)
}

export async function DELETE(req: NextRequest) {
  const { type, ids } = await req.json()
  if (!['snmp', 'ssh'].includes(type) || !Array.isArray(ids)) {
    return NextResponse.json({ error: 'Invalid input' }, { status: 400 })
  }
  await prisma.aclEntry.deleteMany({ where: { id: { in: ids }, type } })
  return NextResponse.json({ success: true })
}