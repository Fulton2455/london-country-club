'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'

export default function LoginPage() {
  const router = useRouter()
  const supabase = createClient()

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  async function handleLogin() {
    setLoading(true)
    setError(null)

    const { error } = await supabase.auth.signInWithPassword({ email, password })

    if (error) {
      setError(error.message)
      setLoading(false)
      return
    }

    router.push('/dashboard')
    router.refresh()
  }

  return (
    <div className="min-h-screen bg-[#1a2e1a] flex items-center justify-center px-4">
      <div className="w-full max-w-sm">

        {/* Logo / Club name */}
        <div className="text-center mb-8">
          <p className="text-[#b5a06a] text-xs tracking-[0.2em] uppercase mb-1">
            Est. 1921
          </p>
          <h1 className="text-[#f0e8d0] text-3xl font-serif">
            London Country Club
          </h1>
          <p className="text-[#8fa88f] text-sm mt-1">Member Portal</p>
        </div>

        {/* Card */}
        <div className="bg-white/5 border border-white/10 rounded-lg p-6 backdrop-blur-sm">
          <h2 className="text-[#f0e8d0] text-lg font-medium mb-5">Sign in</h2>

          <div className="space-y-4">
            <div>
              <label className="block text-[#8fa88f] text-xs uppercase tracking-widest mb-1.5">
                Email
              </label>
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                className="w-full bg-white/5 border border-white/10 rounded px-3 py-2.5 text-[#f0e8d0] text-sm placeholder:text-white/20 focus:outline-none focus:border-[#b5a06a] transition-colors"
                placeholder="you@example.com"
              />
            </div>

            <div>
              <label className="block text-[#8fa88f] text-xs uppercase tracking-widest mb-1.5">
                Password
              </label>
              <input
                type="password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && handleLogin()}
                className="w-full bg-white/5 border border-white/10 rounded px-3 py-2.5 text-[#f0e8d0] text-sm placeholder:text-white/20 focus:outline-none focus:border-[#b5a06a] transition-colors"
                placeholder="••••••••"
              />
            </div>

            {error && (
              <p className="text-red-400 text-sm">{error}</p>
            )}

            <button
              onClick={handleLogin}
              disabled={loading}
              className="w-full bg-[#b5a06a] hover:bg-[#c9b47e] disabled:opacity-50 text-[#1a2e1a] font-semibold text-sm py-2.5 rounded transition-colors"
            >
              {loading ? 'Signing in...' : 'Sign in'}
            </button>
          </div>
        </div>

        <p className="text-center text-[#8fa88f] text-xs mt-6">
          Not a member?{' '}
          <span className="text-[#b5a06a]">Contact the club to request access.</span>
        </p>

      </div>
    </div>
  )
}