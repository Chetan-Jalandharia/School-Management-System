'use client'

import Link from 'next/link'
import { useAuth } from '@/lib/AuthContext'

export default function Home() {
  const { isAuthenticated, user, logout, isLoading, isAdmin } = useAuth()

  const handleLogout = async () => {
    await logout()
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center py-12">
      <div className="max-w-2xl w-full bg-white rounded-lg shadow-lg p-10 mx-4">
        <div className="flex justify-between items-center mb-10">
          <h1 className="text-4xl font-bold text-gray-800 leading-tight">
            School Management System
          </h1>
          {isAuthenticated && (
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 px-4 py-2 bg-red-50 hover:bg-red-100 text-red-600 hover:text-red-700 rounded-lg border border-red-200 hover:border-red-300 transition-all duration-200 transform hover:scale-105 active:scale-95"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
              </svg>
              <span className="text-sm font-medium">Logout</span>
            </button>
          )}
        </div>

        {isAuthenticated && (
          <div className="mb-8 p-4 bg-green-50 border border-green-200 rounded-lg">
            <p className="text-sm text-green-800">
              ✅ Logged in as: <strong>{user?.email}</strong>
              {isAdmin && <span className="ml-2 px-2 py-1 bg-red-100 text-red-800 text-xs rounded-full">👑 Admin</span>}
            </p>
          </div>
        )}
        
        <div className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Link 
              href="/addSchool" 
              className="bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white font-medium py-4 px-6 rounded-lg text-center block transform active:scale-95 transition-all duration-200"
            >
              Add New School {!isAuthenticated && '🔒'}
            </Link>
            
            <Link 
              href="/showSchools" 
              className="bg-green-600 hover:bg-green-700 active:bg-green-800 text-white font-medium py-4 px-6 rounded-lg text-center block transform active:scale-95 transition-all duration-200"
            >
              View All Schools
            </Link>
          </div>

          {!isAuthenticated && (
            <div className="mt-8 pt-6 border-t border-gray-200">
              <Link
                href="/login"
                className="w-full bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium py-4 px-6 rounded-lg text-center block transform active:scale-95 transition-all duration-200"
              >
                Login to Manage Schools
              </Link>
              <p className="text-sm text-gray-500 text-center mt-3">
                🔒 Login required to add or edit schools
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
