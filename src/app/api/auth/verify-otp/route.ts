import { NextRequest, NextResponse } from 'next/server'
import { createConnection } from '@/lib/database'
import { generateAuthToken, isValidEmail, isAdminEmail } from '@/lib/auth'

export async function POST(request: NextRequest) {
  try {
    const { email, otp } = await request.json()

    // Validate input
    if (!email || !isValidEmail(email)) {
      return NextResponse.json(
        { error: 'Please provide a valid email address' },
        { status: 400 }
      )
    }

    if (!otp || otp.length !== 6) {
      return NextResponse.json(
        { error: 'Please provide a valid 6-digit OTP' },
        { status: 400 }
      )
    }

    const connection = await createConnection()

    // Check OTP validity
    const [rows] = await connection.execute(
      `SELECT * FROM otp_verifications 
       WHERE email = ? AND otp_code = ? AND expires_at > NOW() AND is_verified = FALSE 
       ORDER BY created_at DESC LIMIT 1`,
      [email, otp]
    ) as any

    if (rows.length === 0) {
      await connection.end()
      return NextResponse.json(
        { error: 'Invalid or expired OTP. Please request a new one.' },
        { status: 400 }
      )
    }

    // Mark OTP as verified
    await connection.execute(
      'UPDATE otp_verifications SET is_verified = TRUE WHERE id = ?',
      [rows[0].id]
    )

    // Add or update user in authenticated_users table
    await connection.execute(
      `INSERT INTO authenticated_users (email, last_login) 
       VALUES (?, NOW()) 
       ON DUPLICATE KEY UPDATE last_login = NOW()`,
      [email]
    )

    // Clean up old OTPs for this email
    await connection.execute(
      'DELETE FROM otp_verifications WHERE email = ? AND id != ?',
      [email, rows[0].id]
    )

    await connection.end()

    // Generate JWT token
    const token = generateAuthToken(email)

    // Create response with token
    const response = NextResponse.json({
      message: 'Login successful',
      user: { 
        email,
        isAdmin: isAdminEmail(email)
      }
    })

    // Set HTTP-only cookie
    response.cookies.set('auth-token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 24 * 60 * 60, // 24 hours
      path: '/'
    })

    return response

  } catch (error) {
    console.error('Verify OTP error:', error)
    return NextResponse.json(
      { error: 'Failed to verify OTP. Please try again.' },
      { status: 500 }
    )
  }
}
