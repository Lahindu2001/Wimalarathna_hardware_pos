import { NextResponse } from 'next/server'
import { getAuthToken } from '@/lib/auth'

export async function GET() {
  const token = await getAuthToken()

  if (!token) {
    return NextResponse.json(
      { error: 'Not authenticated' },
      { status: 401 }
    )
  }

  return NextResponse.json({ authenticated: true })
}
