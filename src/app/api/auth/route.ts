// app/api/auth/route.ts

import { NextRequest, NextResponse } from 'next/server'

const mockUsers = [
  { id: 1, email: 'admin@noc.com', password: 'admin123', role: 'admin' },
  { id: 2, email: 'user@noc.com', password: 'user123', role: 'user' },
]

export async function POST(req: NextRequest) {
  const { email, password } = await req.json()

  const user = mockUsers.find(
    (u) => u.email === email && u.password === password
  )

  if (!user) {
    return NextResponse.json({ message: 'Invalid credentials' }, { status: 401 })
  }
// eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { password: _, ...userWithoutPassword } = user
  return NextResponse.json({ user: userWithoutPassword })
}