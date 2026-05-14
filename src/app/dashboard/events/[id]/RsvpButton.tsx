'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function RsvpButton({
  eventId,
  userId,
  currentStatus,
  currentGuestCount,
  spotsLeft,
}: {
  eventId: string
  userId: string
  currentStatus: string | null
  currentGuestCount: number
  spotsLeft: number | null
}) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [status, setStatus] = useState(currentStatus)
  const [guestCount, setGuestCount] = useState(currentGuestCount || 1)

  async function handleRsvp(newStatus: 'YES' | 'NO') {
    if (loading) return
    setLoading(true)

    const res = await fetch('/api/rsvp', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ eventId, userId, status: newStatus, guestCount }),
    })

    if (res.ok) {
      setStatus(newStatus)
      router.refresh()
    }

    setLoading(false)
  }

  return (
    <div className="space-y-4">
      {/* Guest count selector — only shown when marking as going */}
      {status !== 'NO' && (
        <div>
          <label className="block text-xs uppercase tracking-widest text-gray-400 mb-2">
            Number of people attending
          </label>
          <div className="flex items-center gap-3">
            <button
              onClick={() => setGuestCount(c => Math.max(1, c - 1))}
              className="w-9 h-9 rounded bg-gray-100 text-gray-700 hover:bg-gray-200 transition-colors font-medium text-lg"
            >
              −
            </button>
            <span className="text-2xl font-serif text-[#1a2e1a] w-8 text-center">
              {guestCount}
            </span>
            <button
              onClick={() => setGuestCount(c => spotsLeft !== null ? Math.min(c + 1, spotsLeft) : c + 1)}
              className="w-9 h-9 rounded bg-gray-100 text-gray-700 hover:bg-gray-200 transition-colors font-medium text-lg"
            >
              +
            </button>
            <span className="text-sm text-gray-400 ml-1">
              {guestCount === 1 ? 'person' : 'people'}
            </span>
          </div>
          {spotsLeft !== null && (
            <p className="text-xs text-gray-400 mt-1">{spotsLeft} spots remaining</p>
          )}
        </div>
      )}

      {/* RSVP buttons */}
      <div className="flex gap-3">
        <button
          onClick={() => handleRsvp('YES')}
          disabled={loading || (spotsLeft !== null && spotsLeft < guestCount && status !== 'YES')}
          className={`flex-1 py-2.5 rounded text-sm font-medium transition-colors ${
            status === 'YES'
              ? 'bg-[#1a2e1a] text-[#b5a06a]'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          } disabled:opacity-40`}
        >
          {status === 'YES' ? `✓ Going (${guestCount} ${guestCount === 1 ? 'person' : 'people'})` : 'Going'}
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
    </div>
  )
}