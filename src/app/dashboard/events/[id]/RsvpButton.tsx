'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function RsvpButton({
  eventId,
  userId,
  currentStatus,
  spotsLeft,
}: {
  eventId: string
  userId: string
  currentStatus: string | null
  spotsLeft: number | null
}) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [status, setStatus] = useState(currentStatus)

  async function handleRsvp(newStatus: 'YES' | 'NO') {
    if (loading) return
    setLoading(true)

    const res = await fetch('/api/rsvp', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ eventId, userId, status: newStatus }),
    })

    if (res.ok) {
      setStatus(newStatus)
      router.refresh()
    }

    setLoading(false)
  }

  return (
    <div className="flex gap-3">
      <button
        onClick={() => handleRsvp('YES')}
        disabled={loading || (spotsLeft === 0 && status !== 'YES')}
        className={`flex-1 py-2.5 rounded text-sm font-medium transition-colors ${
          status === 'YES'
            ? 'bg-[#1a2e1a] text-[#b5a06a]'
            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
        } disabled:opacity-40`}
      >
        {status === 'YES' ? '✓ Going' : 'Going'}
      </button>
      <button
        onClick={() => handleRsvp('NO')}
        disabled={loading}
        className={`flex-1 py-2.5 rounded text-sm font-medium transition-colors ${
          status === 'NO'
            ? 'bg-red-50 text-red-600 border border-red-200'
            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
        } disabled:opacity-40`}
      >
        Not going
      </button>
    </div>
  )
}