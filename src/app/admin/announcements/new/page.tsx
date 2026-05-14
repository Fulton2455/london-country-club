'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function NewAnnouncementPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const [form, setForm] = useState({
    title: '',
    content: '',
    severity: 'INFO',
    isMemberOnly: true,
  })

  function set(field: string, value: any) {
    setForm(prev => ({ ...prev, [field]: value }))
  }

  async function handleSubmit() {
    if (!form.title || !form.content) {
      setError('Title and content are required.')
      return
    }
    setLoading(true)
    setError(null)

    const res = await fetch('/api/admin/announcements', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form),
    })

    if (res.ok) {
      router.push('/admin/announcements')
      router.refresh()
    } else {
      setError('Something went wrong.')
      setLoading(false)
    }
  }

  return (
    <div className="max-w-2xl space-y-6">
      <h2 className="font-serif text-3xl text-[#1a2e1a]">New Announcement</h2>

      <div className="bg-white border border-gray-200 rounded-lg p-6 space-y-5">

        <div>
          <label className="block text-xs uppercase tracking-widest text-gray-400 mb-1.5">Title *</label>
          <input
            value={form.title}
            onChange={e => set('title', e.target.value)}
            className="input"
            placeholder="Course conditions — Cart paths only"
          />
        </div>

        <div>
          <label className="block text-xs uppercase tracking-widest text-gray-400 mb-1.5">Content *</label>
          <textarea
            value={form.content}
            onChange={e => set('content', e.target.value)}
            className="input min-h-[100px] resize-none"
            placeholder="Due to overnight rain, all carts must remain on paths through hole 9..."
          />
        </div>

        <div>
          <label className="block text-xs uppercase tracking-widest text-gray-400 mb-2">Severity</label>
          <div className="flex gap-3">
            {[
              { label: 'Info', value: 'INFO', color: 'bg-green-500' },
              { label: 'Warning', value: 'WARNING', color: 'bg-amber-500' },
              { label: 'Alert', value: 'ALERT', color: 'bg-red-500' },
            ].map(opt => (
              <button
                key={opt.value}
                onClick={() => set('severity', opt.value)}
                className={`flex-1 py-2 rounded text-sm font-medium transition-colors flex items-center justify-center gap-2 ${
                  form.severity === opt.value
                    ? 'bg-[#1a2e1a] text-[#e8dfc8]'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                <span className={`w-2 h-2 rounded-full ${opt.color}`} />
                {opt.label}
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className="block text-xs uppercase tracking-widest text-gray-400 mb-2">Visibility</label>
          <div className="flex gap-3">
            {[
              { label: 'Members only', value: true },
              { label: 'Public', value: false },
            ].map(opt => (
              <button
                key={String(opt.value)}
                onClick={() => set('isMemberOnly', opt.value)}
                className={`flex-1 py-2 rounded text-sm font-medium transition-colors ${
                  form.isMemberOnly === opt.value
                    ? 'bg-[#1a2e1a] text-[#e8dfc8]'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                {opt.label}
              </button>
            ))}
          </div>
        </div>

        {error && <p className="text-red-500 text-sm">{error}</p>}

        <div className="flex gap-3 pt-2">
          <button
            onClick={handleSubmit}
            disabled={loading}
            className="flex-1 bg-[#b5a06a] text-[#1a2e1a] font-semibold py-2.5 rounded hover:bg-[#c9b47e] transition-colors disabled:opacity-40"
          >
            {loading ? 'Posting...' : 'Post Announcement'}
          </button>
          <button
            onClick={() => router.back()}
            className="px-5 py-2.5 rounded bg-gray-100 text-gray-600 hover:bg-gray-200 transition-colors"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  )
}