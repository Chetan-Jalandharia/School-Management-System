import jwt from 'jsonwebtoken'
import { NextRequest } from 'next/server'

const JWT_SECRET = process.env.JWT_SECRET || 'fallback-secret'

export interface AuthTokenPayload {
  email: string
  iat: number
  exp: number
}

export function generateAuthToken(email: string): string {
  return jwt.sign(
    { email },
    JWT_SECRET,
    { expiresIn: '24h' }
  )
}

export function verifyAuthToken(token: string): AuthTokenPayload | null {
  try {
    return jwt.verify(token, JWT_SECRET) as AuthTokenPayload
  } catch (error) {
    return null
  }
}

export function getAuthTokenFromRequest(request: NextRequest): string | null {
  // Check Authorization header
  const authHeader = request.headers.get('authorization')
  if (authHeader && authHeader.startsWith('Bearer ')) {
    return authHeader.substring(7)
  }

  // Check cookies
  const token = request.cookies.get('auth-token')?.value
  return token || null
}

export function generateOTP(): string {
  return Math.floor(100000 + Math.random() * 900000).toString()
}

export function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

export function isAdminEmail(email: string): boolean {
  const adminEmail = process.env.ADMIN_EMAIL
  return adminEmail ? email.toLowerCase() === adminEmail.toLowerCase() : false
}

export function checkAdminPermission(email?: string): boolean {
  if (!email) return false
  return isAdminEmail(email)
}
