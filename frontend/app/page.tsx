'use client'

import { useUser } from '@auth0/nextjs-auth0/client'

export default function Home() {
  const { user, isLoading } = useUser()

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-2xl text-gray-600">Loading...</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto">
          <header className="text-center mb-12">
            <h1 className="text-5xl font-bold text-gray-800 mb-4">
              Welcome to HackUTD
            </h1>
            <p className="text-xl text-gray-600">
              {user ? `Hello, ${user.name || user.email}!` : 'Your Next.js app with Auth0!'}
            </p>
          </header>
          
          <div className="bg-white rounded-lg shadow-lg p-8">
            {user ? (
              <div>
                <h2 className="text-2xl font-semibold text-gray-800 mb-4">
                  You're Logged In! 🎉
                </h2>
                
                <div className="mb-6 p-4 bg-green-50 rounded-md">
                  <h3 className="font-medium text-green-900 mb-2">User Profile</h3>
                  <p className="text-sm text-green-700"><strong>Name:</strong> {user.name}</p>
                  <p className="text-sm text-green-700"><strong>Email:</strong> {user.email}</p>
                </div>

                <a
                  href="/api/auth/logout"
                  className="block w-full text-center bg-red-600 hover:bg-red-700 text-white font-semibold py-3 px-6 rounded-lg transition duration-200"
                >
                  Log Out
                </a>
              </div>
            ) : (
              <div>
                <h2 className="text-2xl font-semibold text-gray-800 mb-4">
                  Getting Started
                </h2>
                <p className="text-gray-600 mb-6">
                  This is your Next.js + Tailwind CSS application with Auth0 authentication integrated.
                </p>
                
                <div className="space-y-4 mb-6">
                  <div className="p-4 bg-blue-50 rounded-md">
                    <h3 className="font-medium text-blue-900 mb-2">✓ Next.js 14</h3>
                    <p className="text-sm text-blue-700">Server-side rendering & API routes</p>
                  </div>
                  
                  <div className="p-4 bg-purple-50 rounded-md">
                    <h3 className="font-medium text-purple-900 mb-2">✓ Tailwind CSS</h3>
                    <p className="text-sm text-purple-700">Utility-first CSS framework</p>
                  </div>

                  <div className="p-4 bg-green-50 rounded-md">
                    <h3 className="font-medium text-green-900 mb-2">✓ Auth0</h3>
                    <p className="text-sm text-green-700">Secure server-side authentication</p>
                  </div>
                </div>

                <a
                  href="/api/auth/login"
                  className="block w-full text-center bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-3 px-6 rounded-lg transition duration-200"
                >
                  Log In with Auth0
                </a>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
