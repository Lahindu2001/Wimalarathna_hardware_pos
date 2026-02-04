import { NextRequest, NextResponse } from 'next/server'
import { getUser, createUser } from '@/lib/db'
import { hashPassword, createToken, setAuthCookie } from '@/lib/auth'

export async function POST(request: NextRequest) {
  try {
    const { username, password } = await request.json()

    if (!username || !password) {
      return NextResponse.json(
        { error: 'Username and password required' },
        { status: 400 }
      )
    }

    if (username.length < 3 || password.length < 6) {
      return NextResponse.json(
        { error: 'Username must be at least 3 characters, password at least 6' },
        { status: 400 }
      )
    }

    const existingUser = await getUser(username)

    if (existingUser) {
      return NextResponse.json(
        { error: 'Username already exists' },
        { status: 409 }
      )
    }

    const passwordHash = await hashPassword(password)
    const user = await createUser(username, passwordHash)

    return NextResponse.json({
      success: true,
      message: 'Registration successful! Your account is pending admin approval.',
      user: { id: user.id, username: user.username, status: user.status },
    })
  } catch (error) {
    console.error('[v0] Registration error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
