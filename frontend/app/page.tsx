'use client'

import { useUser } from '@auth0/nextjs-auth0/client'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { Sparkles, Brain, Zap, TrendingUp, Shield, Users, Phone, MessageSquare, BarChart3, Radio } from 'lucide-react'
import Image from 'next/image'

export default function Home() {
  const { user, isLoading } = useUser()
  const router = useRouter()
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })

  useEffect(() => {
    if (!isLoading && user) {
      router.push('/dashboard')
    }
  }, [user, isLoading, router])

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY })
    }
    window.addEventListener('mousemove', handleMouseMove)
    return () => window.removeEventListener('mousemove', handleMouseMove)
  }, [])

  if (isLoading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-pink-600/20 via-purple-600/20 to-indigo-600/20 animate-pulse"></div>
        <div className="text-2xl text-pink-400 flex items-center gap-3 z-10">
          <div className="w-8 h-8 border-4 border-pink-600 border-t-transparent rounded-full animate-spin"></div>
          Initializing A.U.R.A...
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-black text-white overflow-hidden relative">
      {/* Animated Background */}
      <div className="fixed inset-0 z-0">
        <div 
          className="absolute inset-0 opacity-30"
          style={{
            background: `radial-gradient(circle at ${mousePosition.x}px ${mousePosition.y}px, rgba(226, 0, 116, 0.15), transparent 50%)`
          }}
        ></div>
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-pink-600 rounded-full blur-[120px] opacity-20 animate-pulse"></div>
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-purple-600 rounded-full blur-[120px] opacity-20 animate-pulse delay-700"></div>
        <div className="absolute top-1/2 left-1/2 w-96 h-96 bg-indigo-600 rounded-full blur-[120px] opacity-20 animate-pulse delay-1000"></div>
      </div>

      {/* Floating Nav */}
      <nav className="fixed top-6 left-1/2 -translate-x-1/2 z-50 w-full max-w-4xl px-6">
        <div className="bg-black/40 backdrop-blur-xl border border-pink-600/30 rounded-2xl px-8 py-4 flex items-center justify-between shadow-2xl shadow-pink-600/10">
          <div className="flex items-center gap-3">
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-br from-pink-600 to-purple-600 rounded-xl blur-md opacity-75 animate-pulse"></div>
              <div className="relative w-10 h-10 rounded-xl overflow-hidden">
                <Image 
                  src="/aura-logo.png" 
                  alt="A.U.R.A." 
                  width={40} 
                  height={40} 
                  className="object-cover"
                />
              </div>
            </div>
            <div>
              <span className="text-xl font-bold bg-gradient-to-r from-pink-400 to-purple-400 bg-clip-text text-transparent">A.U.R.A.</span>
              <div className="text-[10px] text-pink-400/60 font-mono">SYSTEM.ACTIVE</div>
            </div>
          </div>
          <a
            href="/api/auth/login"
            className="px-6 py-2 rounded-xl bg-gradient-to-r from-pink-600 to-purple-600 text-white font-semibold hover:shadow-lg hover:shadow-pink-600/50 transition-all relative group overflow-hidden"
          >
            <span className="relative z-10">Access System</span>
            <div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-pink-600 opacity-0 group-hover:opacity-100 transition-opacity"></div>
          </a>
        </div>
      </nav>

      {/* Hero - Terminal Style */}
      <div className="relative z-10 container mx-auto px-6 pt-32 pb-20">
        <div className="max-w-6xl mx-auto">
          {/* Command Line Intro */}
          <div className="mb-16 font-mono text-sm">
            <div className="mb-4 text-pink-400/60">
              <span className="text-green-400">user@terminal</span>
              <span className="text-gray-500">:</span>
              <span className="text-blue-400">~</span>
              <span className="text-gray-500">$</span> ./init_aura.sh
            </div>
            <div className="space-y-2 text-gray-400 mb-8">
              <div>[<span className="text-green-400">✓</span>] Loading AI modules...</div>
              <div>[<span className="text-green-400">✓</span>] Connecting to Gemini neural network...</div>
              <div>[<span className="text-green-400">✓</span>] Initializing sentiment analysis...</div>
              <div>[<span className="text-pink-400">⚡</span>] <span className="text-pink-400">A.U.R.A. is now online</span></div>
            </div>
          </div>

          {/* Main Hero */}
          <div className="text-center mb-20">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-pink-600/30 bg-pink-600/10 mb-8 font-mono text-sm">
              <div className="w-2 h-2 rounded-full bg-pink-400 animate-pulse"></div>
              <span className="text-pink-400">Automated.Unified.Response.Agent</span>
            </div>
            
            <h1 className="text-8xl md:text-9xl font-black mb-6 relative">
              <span className="bg-gradient-to-r from-pink-400 via-purple-400 to-pink-400 bg-clip-text text-transparent animate-gradient">
                A.U.R.A.
              </span>
              <div className="absolute -inset-4 bg-gradient-to-r from-pink-600/20 to-purple-600/20 blur-3xl -z-10"></div>
            </h1>
            
            <p className="text-2xl md:text-3xl text-gray-300 mb-6 font-light max-w-3xl mx-auto">
              Where <span className="text-pink-400 font-semibold">Human Intelligence</span> meets <span className="text-purple-400 font-semibold">Artificial Genius</span>
            </p>
            
            <p className="text-lg text-gray-500 max-w-2xl mx-auto mb-12 font-mono">
              Real-time AI engine that doesn't just analyze customer feedback—it <span className="text-pink-400">predicts, acts, and evolves</span>
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href="/api/auth/login"
                className="group relative px-10 py-5 rounded-2xl bg-gradient-to-r from-pink-600 to-purple-600 text-white font-bold text-lg overflow-hidden"
              >
                <span className="relative z-10 flex items-center justify-center gap-2">
                  <Sparkles className="w-5 h-5" />
                  Launch Dashboard
                </span>
                <div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-pink-600 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform"></div>
              </a>
              <a
                href="#system"
                className="px-10 py-5 rounded-2xl border-2 border-pink-600/50 text-white font-bold hover:bg-pink-600/10 transition-all text-lg backdrop-blur-sm"
              >
                Explore System
              </a>
            </div>
          </div>

          {/* Live Stats Bar */}
          <div id="system" className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-20">
            {[
              { label: 'AI Models', value: '3', color: 'pink' },
              { label: 'Products Tracked', value: '6', color: 'purple' },
              { label: 'Avg Response', value: '<2s', color: 'indigo' },
              { label: 'Uptime', value: '99.9%', color: 'green' }
            ].map((stat, i) => (
              <div key={i} className="relative group">
                <div className="absolute inset-0 bg-gradient-to-br from-pink-600/20 to-purple-600/20 rounded-2xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity"></div>
                <div className="relative bg-black/60 backdrop-blur-xl border border-pink-600/30 rounded-2xl p-6 text-center">
                  <div className={`text-3xl font-black text-${stat.color}-400 mb-1`}>{stat.value}</div>
                  <div className="text-xs text-gray-400 font-mono uppercase tracking-wider">{stat.label}</div>
                </div>
              </div>
            ))}
          </div>

          {/* AI Capabilities - Card Layout */}
          <div className="grid md:grid-cols-3 gap-6 mb-20">
            {[
              {
                icon: Brain,
                title: 'Neural Analysis',
                desc: 'Gemini AI dissects feedback sentiment, extracts patterns, flags critical issues before they escalate',
                color: 'from-green-600 to-emerald-600',
                glow: 'green'
              },
              {
                icon: Zap,
                title: 'Instant Execution',
                desc: 'One-click generation: tech tickets, loyalty promos, outreach campaigns. No human bottleneck',
                color: 'from-yellow-600 to-orange-600',
                glow: 'yellow'
              },
              {
                icon: BarChart3,
                title: 'Predictive CHI',
                desc: 'Customer Happiness Index tracking with trend forecasting. See tomorrow\'s problems today',
                color: 'from-pink-600 to-purple-600',
                glow: 'pink'
              }
            ].map((card, i) => (
              <div key={i} className="group relative">
                <div className={`absolute inset-0 bg-gradient-to-br ${card.color} rounded-3xl blur-xl opacity-0 group-hover:opacity-30 transition-opacity`}></div>
                <div className="relative bg-black/80 backdrop-blur-xl border border-pink-600/30 rounded-3xl p-8 h-full">
                  <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${card.color} flex items-center justify-center mb-6 group-hover:scale-110 transition-transform`}>
                    <card.icon className="w-7 h-7 text-white" />
                  </div>
                  <h3 className="text-2xl font-bold mb-4 text-white">{card.title}</h3>
                  <p className="text-gray-400 leading-relaxed">{card.desc}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Tech Stack Showcase */}
          <div className="relative mb-20">
            <div className="absolute inset-0 bg-gradient-to-r from-pink-600/10 via-purple-600/10 to-indigo-600/10 rounded-3xl blur-2xl"></div>
            <div className="relative bg-black/60 backdrop-blur-xl border border-pink-600/30 rounded-3xl p-12">
              <h2 className="text-4xl font-black text-center mb-12 bg-gradient-to-r from-pink-400 to-purple-400 bg-clip-text text-transparent">
                Built Different
              </h2>
              <div className="grid md:grid-cols-2 gap-8">
                {[
                  { icon: Shield, title: 'Auto Tech Tickets', desc: 'Gemini extracts issues → generates support tickets with priority routing', color: 'red' },
                  { icon: Sparkles, title: 'Loyalty Engine', desc: 'AI crafts personalized promotions based on sentiment + engagement data', color: 'green' },
                  { icon: Phone, title: 'Voice Synthesis', desc: 'ElevenLabs transforms text strategies into human-like customer calls', color: 'purple' },
                  { icon: MessageSquare, title: 'Feedback Intelligence', desc: 'Real-time transcript analysis across 6 product lines with CHI scoring', color: 'blue' }
                ].map((item, i) => (
                  <div key={i} className="flex gap-5 group">
                    <div className={`w-12 h-12 rounded-xl bg-${item.color}-600/20 border border-${item.color}-600/30 flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform`}>
                      <item.icon className={`w-6 h-6 text-${item.color}-400`} />
                    </div>
                    <div>
                      <h4 className="text-xl font-bold text-white mb-2">{item.title}</h4>
                      <p className="text-gray-400 text-sm leading-relaxed">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Final CTA */}
          <div className="relative text-center">
            <div className="absolute inset-0 bg-gradient-to-r from-pink-600/20 via-purple-600/20 to-indigo-600/20 rounded-3xl blur-2xl animate-pulse"></div>
            <div className="relative bg-black/80 backdrop-blur-xl border border-pink-600/30 rounded-3xl p-16">
              <div className="mb-6 font-mono text-pink-400 text-sm">SYSTEM.READY</div>
              <h2 className="text-5xl font-black text-white mb-6">
                Stop Managing. Start <span className="bg-gradient-to-r from-pink-400 to-purple-400 bg-clip-text text-transparent">Automating</span>
              </h2>
              <p className="text-xl text-gray-300 mb-10 max-w-2xl mx-auto">
                A.U.R.A. handles the noise. You handle the strategy.
              </p>
              <a
                href="/api/auth/login"
                className="inline-flex items-center gap-3 px-12 py-5 rounded-2xl bg-gradient-to-r from-pink-600 to-purple-600 text-white font-bold text-xl hover:shadow-2xl hover:shadow-pink-600/50 transition-all group relative overflow-hidden"
              >
                <span className="relative z-10">Initialize A.U.R.A.</span>
                <Radio className="w-6 h-6 relative z-10 group-hover:animate-pulse" />
                <div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-pink-600 opacity-0 group-hover:opacity-100 transition-opacity"></div>
              </a>
              <p className="text-gray-500 text-xs mt-6 font-mono">AUTH0.SECURED | ENTERPRISE.GRADE</p>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="relative z-10 border-t border-pink-600/20 bg-black/60 backdrop-blur-xl py-8 mt-20">
        <div className="container mx-auto px-6">
          <div className="text-center">
            <p className="text-gray-500 text-sm font-mono">© 2025 A.U.R.A. | AUTOMATED.UNIFIED.RESPONSE.AGENT</p>
          </div>
        </div>
      </footer>

      <style jsx>{`
        @keyframes gradient {
          0%, 100% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
        }
        .animate-gradient {
          background-size: 200% auto;
          animation: gradient 3s ease infinite;
        }
      `}</style>
    </div>
  )
}
