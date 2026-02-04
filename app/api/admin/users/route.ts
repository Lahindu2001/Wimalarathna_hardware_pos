import { NextRequest, NextResponse } from 'next/server'
import { getAllUsers, updateUserStatus } from '@/lib/db'
import { verifyToken } from '@/lib/auth'

export async function GET() {
  try {
    const users = await getAllUsers()
    return NextResponse.json(users)
  } catch (error) {
    console.error('[v0] Get users error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch users' },
      { status: 500 }
    )
  }
}

export async function PUT(request: NextRequest) {
  try {
    const { userId, status } = await request.json()

    if (!userId || !status) {
      return NextResponse.json(
        { error: 'User ID and status are required' },
        { status: 400 }
      )
    }

    if (!['pending', 'approved', 'rejected'].includes(status)) {
      return NextResponse.json(
        { error: 'Invalid status. Must be: pending, approved, or rejected' },
        { status: 400 }
      )
    }

    const user = await updateUserStatus(userId, status)

    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      )
    }

    return NextResponse.json({
      success: true,
      user,
    })
  } catch (error) {
    console.error('[v0] Update user status error:', error)
    return NextResponse.json(
      { error: 'Failed to update user status' },
      { status: 500 }
    )
  }
}
