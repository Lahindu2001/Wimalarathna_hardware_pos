import { NextRequest, NextResponse } from 'next/server'
import { getUser } from '@/lib/db'
import { verifyPassword, createToken, setAuthCookie } from '@/lib/auth'

export async function POST(request: NextRequest) {
  try {
    const { username, password } = await request.json()

    if (!username || !password) {
      return NextResponse.json(
        { error: 'Username and password required' },
        { status: 400 }
      )
    }

    const user = await getUser(username)

    if (!user || !(await verifyPassword(password, user.password_hash))) {
      return NextResponse.json(
        { error: 'Invalid credentials' },
        { status: 401 }
      )
    }

    // Check if user account is approved
    if (user.status !== 'approved') {
      return NextResponse.json(
        { error: 'Your account is pending admin approval. Please wait for approval.' },
        { status: 403 }
      )
    }

    const token = await createToken(user.id, user.username)
    await setAuthCookie(token)

    return NextResponse.json({
      success: true,
      user: { id: user.id, username: user.username },
    })
  } catch (error) {
    console.error('[v0] Login error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
