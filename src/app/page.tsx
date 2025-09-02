import Link from 'next/link'

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center">
      <div className="max-w-md w-full bg-white rounded-lg shadow-md p-8">
        <h1 className="text-3xl font-bold text-center text-gray-800 mb-8">
          School Management System
        </h1>
        
        <div className="space-y-4">
          <Link 
            href="/addSchool" 
            className="w-full bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white font-medium py-3 px-4 rounded-lg text-center block transform active:scale-95"
          >
            Add New School
          </Link>
          
          <Link 
            href="/showSchools" 
            className="w-full bg-green-600 hover:bg-green-700 active:bg-green-800 text-white font-medium py-3 px-4 rounded-lg text-center block transform active:scale-95"
          >
            View All Schools
          </Link>
        </div>
      </div>
    </div>
  )
}
