import { NextRequest, NextResponse } from 'next/server'
import { getAuthTokenFromRequest, verifyAuthToken, isAdminEmail } from '@/lib/auth'

export async function GET(request: NextRequest) {
  try {
    const token = getAuthTokenFromRequest(request)
    
    if (!token) {
      return NextResponse.json(
        { authenticated: false, user: null },
        { status: 200 }
      )
    }

    const payload = verifyAuthToken(token)
    
    if (!payload) {
      return NextResponse.json(
        { authenticated: false, user: null },
        { status: 200 }
      )
    }

    return NextResponse.json({
      authenticated: true,
      user: { 
        email: payload.email,
        isAdmin: isAdminEmail(payload.email)
      }
    })

  } catch (error) {
    console.error('Check auth error:', error)
    return NextResponse.json(
      { authenticated: false, user: null },
      { status: 200 }
    )
  }
}
