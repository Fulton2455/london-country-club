'use client'

import { useState } from 'react'
import { useRouter, useParams } from 'next/navigation'

export default function JoinPage() {
  const router = useRouter()
  const params = useParams()
  const token = params.token as string

  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
  })

  function set(field: string, value: string) {
    setForm(prev => ({ ...prev, [field]: value }))
  }

  async function handleSubmit() {
    if (!form.name || !form.email || !form.password) {
      setError('All fields are required.')
      return
    }
    if (form.password.length < 6) {
      setError('Password must be at least 6 characters.')
      return
    }
    setLoading(true)
    setError(null)

    const res = await fetch('/api/join', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...form, token }),
    })

    const data = await res.json()

    if (!res.ok) {
      setError(data.error || 'Something went wrong.')
      setLoading(false)
      return
    }

    router.push('/dashboard')
  }

  return (
    <div className="min-h-screen bg-[#1a2e1a] flex items-center justify-center px-4">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <p className="text-[#b5a06a] text-xs tracking-[0.2em] uppercase mb-1">You're invited</p>
          <h1 className="text-[#f0e8d0] text-3xl font-serif">London Country Club</h1>
          <p className="text-[#8fa88f] text-sm mt-1">Create your member account</p>
        </div>

        <div className="bg-white/5 border border-white/10 rounded-lg p-6 backdrop-blur-sm">
          <div className="space-y-4">
            <div>
              <label className="block text-[#8fa88f] text-xs uppercase tracking-widest mb-1.5">Full Name</label>
              <input
                value={form.name}
                onChange={e => set('name', e.target.value)}
                className="w-full bg-white/5 border border-white/10 rounded px-3 py-2.5 text-[#f0e8d0] text-sm placeholder:text-white/20 focus:outline-none focus:border-[#b5a06a] transition-colors"
                placeholder="James Whitfield"
              />
            </div>
            <div>
              <label className="block text-[#8fa88f] text-xs uppercase tracking-widest mb-1.5">Email</label>
              <input
                type="email"
                value={form.email}
                onChange={e => set('email', e.target.value)}
                className="w-full bg-white/5 border border-white/10 rounded px-3 py-2.5 text-[#f0e8d0] text-sm placeholder:text-white/20 focus:outline-none focus:border-[#b5a06a] transition-colors"
                placeholder="you@example.com"
              />
            </div>
            <div>
              <label className="block text-[#8fa88f] text-xs uppercase tracking-widest mb-1.5">Password</label>
              <input
                type="password"
                value={form.password}
                onChange={e => set('password', e.target.value)}
                onKeyDown={e => e.key === 'Enter' && handleSubmit()}
                className="w-full bg-white/5 border border-white/10 rounded px-3 py-2.5 text-[#f0e8d0] text-sm placeholder:text-white/20 focus:outline-none focus:border-[#b5a06a] transition-colors"
                placeholder="••••••••"
              />
            </div>

            {error && <p className="text-red-400 text-sm">{error}</p>}

            <button
              onClick={handleSubmit}
              disabled={loading}
              className="w-full bg-[#b5a06a] hover:bg-[#c9b47e] disabled:opacity-50 text-[#1a2e1a] font-semibold text-sm py-2.5 rounded transition-colors"
            >
              {loading ? 'Creating account...' : 'Create Account'}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}