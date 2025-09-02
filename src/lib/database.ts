import mysql from 'mysql2/promise'

// Database connection configuration
export const dbConfig = {
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT || '3306'),
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'school_management',
  ssl: process.env.DB_HOST?.includes('aivencloud.com') ? {
    rejectUnauthorized: false
  } : undefined,
  connectTimeout: 60000
}

// Create database connection
export async function createConnection() {
  try {
    return await mysql.createConnection(dbConfig)
  } catch (error) {
    console.error('Database connection failed:', error)
    throw error
  }
}

// Execute query with automatic connection management
export async function executeQuery(query: string, params: any[] = []) {
  const connection = await createConnection()
  try {
    const [results] = await connection.execute(query, params)
    return results
  } finally {
    await connection.end()
  }
}
