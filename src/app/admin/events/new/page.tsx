'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function NewEventPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const [form, setForm] = useState({
    title: '',
    description: '',
    dateTime: '',
    location: '',
    isPublic: true,
    capacity: '',
  })

  function set(field: string, value: any) {
    setForm(prev => ({ ...prev, [field]: value }))
  }

  async function handleSubmit() {
    if (!form.title || !form.dateTime) {
      setError('Title and date are required.')
      return
    }
    setLoading(true)
    setError(null)

    const res = await fetch('/api/admin/events', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        ...form,
        capacity: form.capacity ? parseInt(form.capacity) : null,
      }),
    })

    if (res.ok) {
      router.push('/admin/events')
      router.refresh()
    } else {
      setError('Something went wrong.')
      setLoading(false)
    }
  }

  return (
    <div className="max-w-2xl space-y-6">
      <h2 className="font-serif text-3xl text-[#1a2e1a]">New Event</h2>

      <div className="bg-white border border-gray-200 rounded-lg p-6 space-y-5">
        <Field label="Title *">
          <input
            value={form.title}
            onChange={e => set('title', e.target.value)}
            className="input"
            placeholder="Spring Member-Guest Tournament"
          />
        </Field>

        <Field label="Date & Time *">
          <input
            type="datetime-local"
            value={form.dateTime}
            onChange={e => set('dateTime', e.target.value)}
            className="input"
          />
        </Field>

        <Field label="Location">
          <input
            value={form.location}
            onChange={e => set('location', e.target.value)}
            className="input"
            placeholder="Main Course, Traditions Catering, etc."
          />
        </Field>

        <Field label="Description">
          <textarea
            value={form.description}
            onChange={e => set('description', e.target.value)}
            className="input min-h-[100px] resize-none"
            placeholder="Details about the event..."
          />
        </Field>

        <Field label="Capacity (optional)">
          <input
            type="number"
            value={form.capacity}
            onChange={e => set('capacity', e.target.value)}
            className="input"
            placeholder="Leave blank for unlimited"
          />
        </Field>

        <Field label="Visibility">
          <div className="flex gap-3">
            {[
              { label: 'Public', value: true },
              { label: 'Members only', value: false },
            ].map(opt => (
              <button
                key={String(opt.value)}
                onClick={() => set('isPublic', opt.value)}
                className={`flex-1 py-2 rounded text-sm font-medium transition-colors ${
                  form.isPublic === opt.value
                    ? 'bg-[#1a2e1a] text-[#e8dfc8]'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                {opt.label}
              </button>
            ))}
          </div>
        </Field>

        {error && <p className="text-red-500 text-sm">{error}</p>}

        <div className="flex gap-3 pt-2">
          <button
            onClick={handleSubmit}
            disabled={loading}
            className="flex-1 bg-[#b5a06a] text-[#1a2e1a] font-semibold py-2.5 rounded hover:bg-[#c9b47e] transition-colors disabled:opacity-40"
          >
            {loading ? 'Creating...' : 'Create Event'}
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

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="block text-xs uppercase tracking-widest text-gray-400 mb-1.5">{label}</label>
      {children}
    </div>
  )
}