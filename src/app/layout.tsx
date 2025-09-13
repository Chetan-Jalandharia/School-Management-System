import './globals.css'
import React from 'react'
import { AuthProvider } from '@/lib/AuthContext'

export const metadata = {
  title: 'School Management System',
  description: 'A system to manage school data',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className="font-sans">
        <AuthProvider>
          {children}
        </AuthProvider>
      </body>
    </html>
  )
}
