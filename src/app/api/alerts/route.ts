import { prisma } from '@/lib/prisma'
import { NextResponse } from 'next/server'

export async function GET() {
  const alerts = await prisma.alert.findMany()
  return NextResponse.json(alerts)
}