'use client'

import { useForm } from 'react-hook-form'
import { useState } from 'react'
import Link from 'next/link'

interface SchoolFormData {
  name: string
  address: string
  city: string
  state: string
  contact: string
  email_id: string
  image: FileList
}

export default function AddSchool() {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitMessage, setSubmitMessage] = useState('')
  
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset
  } = useForm<SchoolFormData>()

  const onSubmit = async (data: SchoolFormData) => {
    setIsSubmitting(true)
    setSubmitMessage('')

    try {
      const formData = new FormData()
      formData.append('name', data.name)
      formData.append('address', data.address)
      formData.append('city', data.city)
      formData.append('state', data.state)
      formData.append('contact', data.contact)
      formData.append('email_id', data.email_id)
      
      if (data.image && data.image[0]) {
        formData.append('image', data.image[0])
      }

      const response = await fetch('/api/schools', {
        method: 'POST',
        body: formData,
      })

      if (response.ok) {
        setSubmitMessage('School added successfully!')
        reset()
      } else {
        setSubmitMessage('Error adding school. Please try again.')
      }
    } catch (error) {
      setSubmitMessage('Error adding school. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-2xl mx-auto px-4">
        <div className="bg-white rounded-lg shadow-md p-8">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-3xl font-bold text-gray-800">Add New School</h1>
            <Link 
              href="/" 
              className="bg-gray-600 hover:bg-gray-700 active:bg-gray-800 text-white px-4 py-2 rounded-lg transform active:scale-95"
            >
              Back to Home
            </Link>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {/* School Name */}
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                School Name *
              </label>
              <input
                type="text"
                id="name"
                {...register('name', { 
                  required: 'School name is required',
                  minLength: { value: 2, message: 'School name must be at least 2 characters' }
                })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Enter school name"
              />
              {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name.message}</p>}
            </div>

            {/* Address */}
            <div>
              <label htmlFor="address" className="block text-sm font-medium text-gray-700 mb-2">
                Address *
              </label>
              <textarea
                id="address"
                {...register('address', { 
                  required: 'Address is required',
                  minLength: { value: 5, message: 'Address must be at least 5 characters' }
                })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Enter complete address"
                rows={3}
              />
              {errors.address && <p className="text-red-500 text-sm mt-1">{errors.address.message}</p>}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* City */}
              <div>
                <label htmlFor="city" className="block text-sm font-medium text-gray-700 mb-2">
                  City *
                </label>
                <input
                  type="text"
                  id="city"
                  {...register('city', { 
                    required: 'City is required',
                    minLength: { value: 2, message: 'City must be at least 2 characters' }
                  })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Enter city"
                />
                {errors.city && <p className="text-red-500 text-sm mt-1">{errors.city.message}</p>}
              </div>

              {/* State */}
              <div>
                <label htmlFor="state" className="block text-sm font-medium text-gray-700 mb-2">
                  State *
                </label>
                <input
                  type="text"
                  id="state"
                  {...register('state', { 
                    required: 'State is required',
                    minLength: { value: 2, message: 'State must be at least 2 characters' }
                  })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Enter state"
                />
                {errors.state && <p className="text-red-500 text-sm mt-1">{errors.state.message}</p>}
              </div>
            </div>

            {/* Contact */}
            <div>
              <label htmlFor="contact" className="block text-sm font-medium text-gray-700 mb-2">
                Contact Number *
              </label>
              <input
                type="tel"
                id="contact"
                {...register('contact', { 
                  required: 'Contact number is required',
                  pattern: {
                    value: /^[0-9]{10}$/,
                    message: 'Contact number must be 10 digits'
                  }
                })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Enter 10-digit contact number"
              />
              {errors.contact && <p className="text-red-500 text-sm mt-1">{errors.contact.message}</p>}
            </div>

            {/* Email */}
            <div>
              <label htmlFor="email_id" className="block text-sm font-medium text-gray-700 mb-2">
                Email Address *
              </label>
              <input
                type="email"
                id="email_id"
                {...register('email_id', { 
                  required: 'Email is required',
                  pattern: {
                    value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                    message: 'Invalid email address'
                  }
                })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Enter email address"
              />
              {errors.email_id && <p className="text-red-500 text-sm mt-1">{errors.email_id.message}</p>}
            </div>

            {/* Image Upload */}
            <div>
              <label htmlFor="image" className="block text-sm font-medium text-gray-700 mb-2">
                School Image *
              </label>
              <input
                type="file"
                id="image"
                accept="image/*"
                {...register('image', { 
                  required: 'School image is required'
                })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              {errors.image && <p className="text-red-500 text-sm mt-1">{errors.image.message}</p>}
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-blue-600 hover:bg-blue-700 active:bg-blue-800 disabled:bg-blue-400 text-white font-medium py-3 px-4 rounded-lg transform active:scale-95 disabled:transform-none"
            >
              {isSubmitting ? 'Adding School...' : 'Add School'}
            </button>

            {/* Submit Message */}
            {submitMessage && (
              <div className={`text-center p-3 rounded-lg ${
                submitMessage.includes('successfully') ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
              }`}>
                {submitMessage}
              </div>
            )}
          </form>
        </div>
      </div>
    </div>
  )
}
