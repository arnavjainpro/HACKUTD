'use client'

import { useUser } from '@auth0/nextjs-auth0/client'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'

export default function Home() {
  const { user, isLoading } = useUser()
  const router = useRouter()

  useEffect(() => {
    if (!isLoading && user) {
      router.push('/dashboard')
    }
  }, [user, isLoading, router])

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-2xl text-gray-600">Loading...</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-indigo-50">
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto text-center">
          <div className="mb-8">
            <div className="w-20 h-20 mx-auto mb-6 rounded-2xl bg-gradient-to-br from-pink-600 to-purple-600 flex items-center justify-center shadow-2xl">
              <span className="text-white font-bold text-3xl">T</span>
            </div>
            <h1 className="text-6xl font-bold bg-gradient-to-r from-pink-600 to-purple-600 bg-clip-text text-transparent mb-4">
              Customer Happiness Hub
            </h1>
            <p className="text-xl text-gray-600 mb-8">
              T-Mobile Customer Service Excellence Platform
            </p>
          </div>
          
          <div className="bg-white rounded-2xl shadow-2xl p-12 mb-8">
            <h2 className="text-3xl font-semibold text-gray-800 mb-6">
              Powered by AI Innovation
            </h2>
            
            <div className="grid md:grid-cols-2 gap-6 mb-8">
              <div className="p-6 bg-gradient-to-br from-pink-50 to-purple-50 rounded-xl border-2 border-pink-200">
                <h3 className="font-bold text-pink-900 mb-3 text-xl">📊 Happiness Index</h3>
                <p className="text-pink-700 text-sm leading-relaxed">
                  Real-time customer satisfaction tracking with AI-powered sentiment analysis from voice calls
                </p>
              </div>
              
              <div className="p-6 bg-gradient-to-br from-purple-50 to-indigo-50 rounded-xl border-2 border-purple-200">
                <h3 className="font-bold text-purple-900 mb-3 text-xl">🤖 AI Routing Agent</h3>
                <p className="text-purple-700 text-sm leading-relaxed">
                  NVIDIA Gemini-powered intelligent follow-up suggestions and automated action recommendations
                </p>
              </div>

              <div className="p-6 bg-gradient-to-br from-blue-50 to-cyan-50 rounded-xl border-2 border-blue-200">
                <h3 className="font-bold text-blue-900 mb-3 text-xl">🎙️ Voice Summaries</h3>
                <p className="text-blue-700 text-sm leading-relaxed">
                  ElevenLabs integration for AI-generated audio summaries of customer interactions
                </p>
              </div>

              <div className="p-6 bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl border-2 border-green-200">
                <h3 className="font-bold text-green-900 mb-3 text-xl">📈 Analytics Dashboard</h3>
                <p className="text-green-700 text-sm leading-relaxed">
                  Comprehensive performance metrics and trend analysis for data-driven decisions
                </p>
              </div>
            </div>

            <a
              href="/api/auth/login"
              className="inline-block px-10 py-4 text-lg rounded-xl bg-gradient-to-r from-pink-600 to-purple-600 text-white font-semibold hover:from-pink-700 hover:to-purple-700 transition-all shadow-xl hover:shadow-2xl hover:scale-105 transform"
            >
              Sign In to Dashboard
            </a>
          </div>

          <div className="text-center text-gray-500 text-sm">
            <p>Secure authentication powered by Auth0</p>
          </div>
        </div>
      </div>
    </div>
  )
}
