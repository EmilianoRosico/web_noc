import { NextRequest, NextResponse } from 'next/server'

export async function POST(req: NextRequest) {
  const { devices } = await req.json()

  console.log('[COMPLIANCE] Solicitud recibida para dispositivos:', devices)

  // Aquí podrías aplicar lógica real de compliance (validación, análisis, etc.)

  return NextResponse.json({ success: true, action: 'compliance', devices })
}