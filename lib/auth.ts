import { hash, compare } from 'bcryptjs'
import { cookies } from 'next/headers'
import { jwtVerify, SignJWT } from 'jose'

const secret = new TextEncoder().encode(
  process.env.JWT_SECRET || 'your-secret-key-change-in-production'
)

export async function hashPassword(password: string): Promise<string> {
  return hash(password, 10)
}

export async function verifyPassword(
  password: string,
  hash: string
): Promise<boolean> {
  return compare(password, hash)
}

export async function createToken(userId: number, username: string) {
  return new SignJWT({ userId, username })
    .setProtectedHeader({ alg: 'HS256' })
    .setExpirationTime('24h')
    .sign(secret)
}

export async function verifyToken(token: string) {
  try {
    const verified = await jwtVerify(token, secret)
    return verified.payload
  } catch (err) {
    return null
  }
}

export async function setAuthCookie(token: string) {
  const cookieStore = await cookies()
  cookieStore.set('auth_token', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 86400,
  })
}

export async function getAuthToken() {
  const cookieStore = await cookies()
  return cookieStore.get('auth_token')?.value
}

export async function getCurrentUser() {
  const token = await getAuthToken()
  if (!token) return null
  return await verifyToken(token)
}

export async function clearAuthCookie() {
  const cookieStore = await cookies()
  cookieStore.delete('auth_token')
}
