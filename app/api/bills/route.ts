import { NextRequest, NextResponse } from 'next/server'
import { getBillHistory } from '@/lib/db'
import { getCurrentUser } from '@/lib/auth'

export async function GET(request: NextRequest) {
  try {
    const user = await getCurrentUser()

    if (!user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const bills = await getBillHistory(500)
    return NextResponse.json(bills)
  } catch (error) {
    console.error('[v0] Bills error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
