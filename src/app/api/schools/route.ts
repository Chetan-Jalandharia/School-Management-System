import { NextRequest, NextResponse } from 'next/server'
import { createConnection } from '@/lib/database'
import cloudinary from '@/lib/cloudinary'
import { getAuthTokenFromRequest, verifyAuthToken, checkAdminPermission } from '@/lib/auth'

// GET - Fetch all schools (public - no auth required)
export async function GET() {
  try {
    const connection = await createConnection()
    
    const [rows] = await connection.execute(
      'SELECT id, name, address, city, state, contact, email_id, image FROM schools ORDER BY id DESC'
    )
    
    await connection.end()
    
    return NextResponse.json(rows)
  } catch (error) {
    console.error('Database error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch schools' },
      { status: 500 }
    )
  }
}

// POST - Add new school (requires authentication)
export async function POST(request: NextRequest) {
  try {
    // Check authentication
    const token = getAuthTokenFromRequest(request)
    if (!token) {
      return NextResponse.json(
        { error: 'Authentication required. Please log in to add schools.' },
        { status: 401 }
      )
    }

    const payload = verifyAuthToken(token)
    if (!payload) {
      return NextResponse.json(
        { error: 'Invalid authentication. Please log in again.' },
        { status: 401 }
      )
    }

    const formData = await request.formData()
    
    const name = formData.get('name') as string
    const address = formData.get('address') as string
    const city = formData.get('city') as string
    const state = formData.get('state') as string
    const contact = formData.get('contact') as string
    const email_id = formData.get('email_id') as string
    const image = formData.get('image') as File
    
    // Validate required fields
    if (!name || !address || !city || !state || !contact || !email_id) {
      return NextResponse.json(
        { error: 'All fields are required' },
        { status: 400 }
      )
    }
    
    let imageUrl = ''
    
    // Handle image upload to Cloudinary
    if (image && image.size > 0) {
      try {
        // Check file size (Vercel has limits)
        const maxSize = 10 * 1024 * 1024 // 10MB
        if (image.size > maxSize) {
          return NextResponse.json(
            { error: 'Image too large. Maximum size is 10MB.' },
            { status: 400 }
          )
        }
        
        // Verify Cloudinary config
        if (!process.env.CLOUDINARY_CLOUD_NAME || !process.env.CLOUDINARY_API_KEY || !process.env.CLOUDINARY_API_SECRET) {
          console.error('Missing Cloudinary environment variables')
          return NextResponse.json(
            { error: 'Image upload service not configured' },
            { status: 500 }
          )
        }
        
        const bytes = await image.arrayBuffer()
        const buffer = Buffer.from(bytes)
        
        // Convert buffer to base64 data URI
        const base64 = buffer.toString('base64')
        const dataURI = `data:${image.type};base64,${base64}`
        
        // Upload to Cloudinary with timeout
        const uploadResponse = await cloudinary.uploader.upload(dataURI, {
          folder: 'school_images',
          public_id: `school_${Date.now()}`,
          overwrite: true,
          resource_type: 'image',
          timeout: 30000 // 30 second timeout
        })
        
        imageUrl = uploadResponse.secure_url
      } catch (uploadError: any) {
        console.error('Cloudinary upload error:', uploadError)
        
        // More detailed error logging for debugging
        console.error('Error details:', {
          message: uploadError?.message || 'Unknown error',
          name: uploadError?.name || 'Unknown',
          http_code: uploadError?.http_code || 'No code',
          cloudName: process.env.CLOUDINARY_CLOUD_NAME,
          hasApiKey: !!process.env.CLOUDINARY_API_KEY,
          hasApiSecret: !!process.env.CLOUDINARY_API_SECRET,
          imageSize: image.size,
          imageType: image.type
        })
        
        return NextResponse.json(
          { 
            error: 'Failed to upload image',
            details: uploadError?.message || 'Unknown upload error'
          },
          { status: 500 }
        )
      }
    }
    
    // Insert into database
    const connection = await createConnection()
    
    const [result] = await connection.execute(
      'INSERT INTO schools (name, address, city, state, contact, email_id, image) VALUES (?, ?, ?, ?, ?, ?, ?)',
      [name, address, city, state, contact, email_id, imageUrl]
    )
    
    await connection.end()
    
    return NextResponse.json(
      { message: 'School added successfully', id: (result as any).insertId },
      { status: 201 }
    )
  } catch (error) {
    console.error('Database error:', error)
    return NextResponse.json(
      { error: 'Failed to add school' },
      { status: 500 }
    )
  }
}

// DELETE - Delete school (requires admin permission)
export async function DELETE(request: NextRequest) {
  try {
    // Check authentication
    const token = getAuthTokenFromRequest(request)
    if (!token) {
      return NextResponse.json(
        { error: 'Authentication required. Please log in.' },
        { status: 401 }
      )
    }

    const payload = verifyAuthToken(token)
    if (!payload) {
      return NextResponse.json(
        { error: 'Invalid authentication. Please log in again.' },
        { status: 401 }
      )
    }

    // Check admin permission
    if (!checkAdminPermission(payload.email)) {
      return NextResponse.json(
        { error: 'Admin access required. Only administrators can delete schools.' },
        { status: 403 }
      )
    }

    // Get school ID from request
    const { searchParams } = new URL(request.url)
    const schoolId = searchParams.get('id')

    if (!schoolId) {
      return NextResponse.json(
        { error: 'School ID is required' },
        { status: 400 }
      )
    }

    const connection = await createConnection()

    // Check if school exists and get image URL for cleanup
    const [existingSchool] = await connection.execute(
      'SELECT id, image FROM schools WHERE id = ?',
      [schoolId]
    ) as any

    if (existingSchool.length === 0) {
      await connection.end()
      return NextResponse.json(
        { error: 'School not found' },
        { status: 404 }
      )
    }

    // Delete from database
    const [deleteResult] = await connection.execute(
      'DELETE FROM schools WHERE id = ?',
      [schoolId]
    ) as any

    await connection.end()

    if (deleteResult.affectedRows === 0) {
      return NextResponse.json(
        { error: 'Failed to delete school' },
        { status: 500 }
      )
    }

    // Optional: Delete image from Cloudinary if exists
    if (existingSchool[0].image) {
      try {
        // Extract public_id from Cloudinary URL
        const imageUrl = existingSchool[0].image
        const publicIdMatch = imageUrl.match(/\/school_(\d+)\.[^/]+$/)
        if (publicIdMatch) {
          const publicId = `school_images/school_${publicIdMatch[1]}`
          await cloudinary.uploader.destroy(publicId)
        }
      } catch (cloudinaryError) {
        console.error('Cloudinary deletion error:', cloudinaryError)
        // Don't fail the whole operation if image deletion fails
      }
    }

    return NextResponse.json(
      { message: 'School deleted successfully', id: schoolId },
      { status: 200 }
    )

  } catch (error) {
    console.error('Delete school error:', error)
    return NextResponse.json(
      { error: 'Failed to delete school' },
      { status: 500 }
    )
  }
}
