import nodemailer from 'nodemailer'

const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST || 'smtp.gmail.com',
  port: parseInt(process.env.EMAIL_PORT || '587'),
  secure: false, // true for 465, false for other ports
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
})

export async function sendOTPEmail(email: string, otp: string): Promise<boolean> {
  try {
    const mailOptions = {
      from: `"School Management System" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: 'Your OTP Code - School Management System',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #333; text-align: center;">School Management System</h2>
          <div style="background-color: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h3 style="color: #007bff; margin-top: 0;">Your OTP Code</h3>
            <p style="font-size: 16px; color: #333;">
              Use the following OTP code to log in to your account:
            </p>
            <div style="text-align: center; margin: 30px 0;">
              <span style="
                background-color: #007bff;
                color: white;
                padding: 15px 30px;
                font-size: 24px;
                font-weight: bold;
                letter-spacing: 3px;
                border-radius: 8px;
                display: inline-block;
              ">${otp}</span>
            </div>
            <p style="color: #666; font-size: 14px;">
              This OTP will expire in <strong>10 minutes</strong>.
            </p>
            <p style="color: #666; font-size: 14px;">
              If you didn't request this OTP, please ignore this email.
            </p>
          </div>
          <p style="text-align: center; color: #888; font-size: 12px;">
            © ${new Date().getFullYear()} School Management System
          </p>
        </div>
      `,
    }

    await transporter.sendMail(mailOptions)
    return true
  } catch (error) {
    console.error('Email sending error:', error)
    return false
  }
}

export async function verifyEmailConfig(): Promise<boolean> {
  try {
    await transporter.verify()
    return true
  } catch (error) {
    console.error('Email configuration error:', error)
    return false
  }
}
