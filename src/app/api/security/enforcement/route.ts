import { NextRequest, NextResponse } from 'next/server'

export async function POST(req: NextRequest) {
  const { devices } = await req.json()

  console.log('[ENFORCEMENT] Ejecutando enforcement para dispositivos:', devices)

  // Aquí podrías aplicar enforcement real (aplicar reglas, comandos, etc.)

  return NextResponse.json({ success: true, action: 'enforcement', devices })
}