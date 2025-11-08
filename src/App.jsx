import { useAuth0 } from '@auth0/auth0-react'

function App() {
  const { loginWithRedirect, logout, user, isAuthenticated, isLoading } = useAuth0()

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
              {isAuthenticated ? `Hello, ${user?.name || user?.email}!` : 'Your app is ready with Auth0!'}
            </p>
          </header>
          
          <div className="bg-white rounded-lg shadow-lg p-8">
            {isAuthenticated ? (
              <div>
                <h2 className="text-2xl font-semibold text-gray-800 mb-4">
                  You're Logged In! 🎉
                </h2>
                
                <div className="mb-6 p-4 bg-green-50 rounded-md">
                  <h3 className="font-medium text-green-900 mb-2">User Profile</h3>
                  <p className="text-sm text-green-700"><strong>Name:</strong> {user?.name}</p>
                  <p className="text-sm text-green-700"><strong>Email:</strong> {user?.email}</p>
                </div>

                <button
                  onClick={() => logout({ logoutParams: { returnTo: window.location.origin } })}
                  className="w-full bg-red-600 hover:bg-red-700 text-white font-semibold py-3 px-6 rounded-lg transition duration-200"
                >
                  Log Out
                </button>
              </div>
            ) : (
              <div>
                <h2 className="text-2xl font-semibold text-gray-800 mb-4">
                  Getting Started
                </h2>
                <p className="text-gray-600 mb-6">
                  This is your React + Vite + Tailwind CSS application with Auth0 authentication integrated.
                </p>
                
                <div className="space-y-4 mb-6">
                  <div className="p-4 bg-blue-50 rounded-md">
                    <h3 className="font-medium text-blue-900 mb-2">✓ React 19</h3>
                    <p className="text-sm text-blue-700">Modern React with latest features</p>
                  </div>
                  
                  <div className="p-4 bg-indigo-50 rounded-md">
                    <h3 className="font-medium text-indigo-900 mb-2">✓ Vite</h3>
                    <p className="text-sm text-indigo-700">Lightning-fast build tool</p>
                  </div>
                  
                  <div className="p-4 bg-purple-50 rounded-md">
                    <h3 className="font-medium text-purple-900 mb-2">✓ Tailwind CSS</h3>
                    <p className="text-sm text-purple-700">Utility-first CSS framework</p>
                  </div>

                  <div className="p-4 bg-green-50 rounded-md">
                    <h3 className="font-medium text-green-900 mb-2">✓ Auth0</h3>
                    <p className="text-sm text-green-700">Secure authentication ready</p>
                  </div>
                </div>

                <button
                  onClick={() => loginWithRedirect()}
                  className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-3 px-6 rounded-lg transition duration-200"
                >
                  Log In with Auth0
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default App
