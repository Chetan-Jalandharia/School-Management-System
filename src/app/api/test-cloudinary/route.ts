import { NextResponse } from 'next/server'
import cloudinary from '@/lib/cloudinary'

export async function GET() {
  try {
    // Test Cloudinary configuration
    const result = await cloudinary.api.ping()
    
    return NextResponse.json({
      success: true,
      status: result.status,
      cloudName: process.env.CLOUDINARY_CLOUD_NAME,
      hasApiKey: !!process.env.CLOUDINARY_API_KEY,
      hasApiSecret: !!process.env.CLOUDINARY_API_SECRET
    })
  } catch (error: any) {
    return NextResponse.json({
      success: false,
      error: error?.message || 'Unknown error',
      cloudName: process.env.CLOUDINARY_CLOUD_NAME,
      hasApiKey: !!process.env.CLOUDINARY_API_KEY,
      hasApiSecret: !!process.env.CLOUDINARY_API_SECRET
    }, { status: 500 })
  }
}
