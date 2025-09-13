'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { useAuth } from '@/lib/AuthContext'

interface School {
  id: number
  name: string
  address: string
  city: string
  state: string
  contact: string
  email_id: string
  image: string
}

export default function ShowSchools() {
  const [schools, setSchools] = useState<School[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [deletingId, setDeletingId] = useState<number | null>(null)
  const { isAdmin, user } = useAuth()

  useEffect(() => {
    fetchSchools()
  }, [])

  const fetchSchools = async () => {
    try {
      const response = await fetch('/api/schools')
      if (response.ok) {
        const data = await response.json()
        setSchools(data)
      } else {
        setError('Failed to fetch schools')
      }
    } catch (error) {
      setError('Error fetching schools')
    } finally {
      setLoading(false)
    }
  }

  const deleteSchool = async (schoolId: number, schoolName: string) => {
    if (!confirm(`Are you sure you want to delete "${schoolName}"? This action cannot be undone.`)) {
      return
    }

    setDeletingId(schoolId)
    try {
      const response = await fetch(`/api/schools?id=${schoolId}`, {
        method: 'DELETE',
      })

      if (response.ok) {
        // Remove the deleted school from state
        setSchools(schools.filter(school => school.id !== schoolId))
        alert('School deleted successfully!')
      } else {
        const data = await response.json()
        alert(data.error || 'Failed to delete school')
      }
    } catch (error) {
      alert('Error deleting school')
    } finally {
      setDeletingId(null)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-xl text-gray-600">Loading schools...</div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-xl text-red-600">{error}</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-800">All Schools</h1>
            <p className="text-sm text-gray-600 mt-1">
              Manage your school database
            </p>
          </div>
          <div className="space-x-4">
            <Link 
              href="/addSchool" 
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition duration-200"
            >
              Add New School
            </Link>
            <Link 
              href="/" 
              className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-lg transform active:scale-95"
            >
              Back to Home
            </Link>
          </div>
        </div>

        {schools.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-gray-500 text-xl mb-4">No schools found</div>
            <Link 
              href="/addSchool" 
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg transform active:scale-95 inline-block"
            >
              Add First School
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {schools.map((school) => (
              <div key={school.id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-200">
                <div className="aspect-w-16 aspect-h-9 bg-gray-200">
                  {school.image ? (
                    <Image
                      src={school.image}
                      alt={school.name}
                      width={300}
                      height={200}
                      className="w-full h-48 object-cover"
                    />
                  ) : (
                    <div className="w-full h-48 bg-gray-300 flex items-center justify-center">
                      <span className="text-gray-500">No Image</span>
                    </div>
                  )}
                </div>
                
                <div className="p-4">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="text-lg font-semibold text-gray-800 line-clamp-2 flex-1">
                      {school.name}
                    </h3>
                    {isAdmin && (
                      <button
                        onClick={() => deleteSchool(school.id, school.name)}
                        disabled={deletingId === school.id}
                        className="ml-2 p-1 text-red-500 hover:text-red-700 hover:bg-red-50 rounded-full transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex-shrink-0"
                        title="Delete School"
                      >
                        {deletingId === school.id ? (
                          <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-red-500"></div>
                        ) : (
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                        )}
                      </button>
                    )}
                  </div>
                  
                  <div className="space-y-1 text-sm text-gray-600">
                    <p className="line-clamp-2">
                      <span className="font-medium">Address:</span> {school.address}
                    </p>
                    <p>
                      <span className="font-medium">City:</span> {school.city}
                    </p>
                  </div>
                  
                  <div className="mt-3 pt-3 border-t border-gray-200">
                    <div className="flex justify-between items-center text-xs text-gray-500">
                      <span>Contact: {school.contact}</span>
                      <span className="truncate ml-2">{school.email_id}</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
