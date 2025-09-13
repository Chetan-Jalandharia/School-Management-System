import { NextRequest, NextResponse } from 'next/server'
import { createConnection } from '@/lib/database'
import { generateOTP, isValidEmail } from '@/lib/auth'
import { sendOTPEmail } from '@/lib/email'

export async function POST(request: NextRequest) {
  try {
    const { email } = await request.json()

    // Validate email
    if (!email || !isValidEmail(email)) {
      return NextResponse.json(
        { error: 'Please provide a valid email address' },
        { status: 400 }
      )
    }

    // Generate OTP
    const otp = generateOTP()
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000) // 10 minutes from now

    // Save OTP to database
    const connection = await createConnection()

    // Clean up expired OTPs for this email
    await connection.execute(
      'DELETE FROM otp_verifications WHERE email = ? AND expires_at < NOW()',
      [email]
    )

    // Insert new OTP
    await connection.execute(
      'INSERT INTO otp_verifications (email, otp_code, expires_at) VALUES (?, ?, ?)',
      [email, otp, expiresAt]
    )

    await connection.end()

    // Send OTP email
    const emailSent = await sendOTPEmail(email, otp)
    
    if (!emailSent) {
      return NextResponse.json(
        { error: 'Failed to send OTP email. Please try again.' },
        { status: 500 }
      )
    }

    return NextResponse.json({
      message: 'OTP sent successfully to your email',
      email: email
    })

  } catch (error) {
    console.error('Send OTP error:', error)
    return NextResponse.json(
      { error: 'Failed to send OTP. Please try again.' },
      { status: 500 }
    )
  }
}
