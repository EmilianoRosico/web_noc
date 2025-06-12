import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET() {
  const snmp = await prisma.aclEntry.findMany({ where: { type: 'snmp' } })
  const ssh  = await prisma.aclEntry.findMany({ where: { type: 'ssh'  } })
  return NextResponse.json({ snmp, ssh })
}

export async function POST(req: NextRequest) {
  const { type, subnet, name } = await req.json()
  if (!['snmp','ssh'].includes(type) || !subnet || !name) {
    return NextResponse.json({ error: 'Invalid input' }, { status: 400 })
  }
  const entry = await prisma.aclEntry.create({
    data: { type, subnet, name }
  })
  return NextResponse.json(entry)
}

export async function DELETE(req: NextRequest) {
  const { type, ids } = await req.json()
  if (!['snmp','ssh'].includes(type) || !Array.isArray(ids)) {
    return NextResponse.json({ error: 'Invalid input' }, { status: 400 })
  }
  await prisma.aclEntry.deleteMany({ where: { type, id: { in: ids } } })
  return NextResponse.json({ success: true })
}
