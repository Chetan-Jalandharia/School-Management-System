import { NextRequest, NextResponse } from 'next/server'
import { createConnection } from '@/lib/database'
import cloudinary from '@/lib/cloudinary'

// GET - Fetch all schools
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

// POST - Add new school
export async function POST(request: NextRequest) {
  try {
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
        const bytes = await image.arrayBuffer()
        const buffer = Buffer.from(bytes)
        
        // Convert buffer to base64 data URI
        const base64 = buffer.toString('base64')
        const dataURI = `data:${image.type};base64,${base64}`
        
        // Upload to Cloudinary
        const uploadResponse = await cloudinary.uploader.upload(dataURI, {
          folder: 'school_images',
          public_id: `school_${Date.now()}`,
          overwrite: true,
          resource_type: 'image'
        })
        
        imageUrl = uploadResponse.secure_url
      } catch (uploadError) {
        console.error('Cloudinary upload error:', uploadError)
        return NextResponse.json(
          { error: 'Failed to upload image' },
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
