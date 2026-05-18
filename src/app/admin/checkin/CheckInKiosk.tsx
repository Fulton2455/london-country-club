'use client'

import { useState, useRef, useEffect } from 'react'
import { useRouter } from 'next/navigation'

type Member = { id: string; name: string; email: string }
type RoundLog = {
  id: string
  memberName: string
  guests: string[]
  createdAt: Date
  notes: string | null
}

export default function CheckInKiosk({
  members,
  adminId,
  todayRounds,
}: {
  members: Member[]
  adminId: string
  todayRounds: RoundLog[]
}) {
  const router = useRouter()
  const [search, setSearch] = useState('')
  const [selected, setSelected] = useState<Member | null>(null)
  const [guests, setGuests] = useState<string[]>([])
  const [guestInput, setGuestInput] = useState('')
  const [notes, setNotes] = useState('')
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState<string | null>(null)
  const searchRef = useRef<HTMLInputElement>(null)

  // Filter members by search, case-insensitive
  const filtered = search.length > 0
    ? members.filter(m =>
        m.name.toLowerCase().includes(search.toLowerCase())
      ).slice(0, 6)
    : []

  // Auto-focus search on load
  useEffect(() => {
    searchRef.current?.focus()
  }, [])

  function selectMember(member: Member) {
    setSelected(member)
    setSearch('')
  }

  function addGuest() {
    const name = guestInput.trim()
    if (!name) return
    setGuests(prev => [...prev, name])
    setGuestInput('')
  }

  function removeGuest(index: number) {
    setGuests(prev => prev.filter((_, i) => i !== index))
  }

  function reset() {
    setSelected(null)
    setSearch('')
    setGuests([])
    setGuestInput('')
    setNotes('')
    setSuccess(null)
    setTimeout(() => searchRef.current?.focus(), 100)
  }

  async function handleCheckIn() {
    if (!selected) return
    setLoading(true)

    const res = await fetch('/api/admin/checkin', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        memberName: selected.name,
        guests,
        notes: notes.trim() || null,
        adminId,
      }),
    })

    if (res.ok) {
      const totalPeople = 1 + guests.length
      setSuccess(`${selected.name} checked in${guests.length > 0 ? ` with ${guests.length} guest${guests.length > 1 ? 's' : ''}` : ''} (${totalPeople} total)`)
      router.refresh()
      setTimeout(reset, 3000)
    }

    setLoading(false)
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

      {/* Check-in form */}
      <div className="space-y-4">
        {!selected ? (
          <div className="bg-white border border-gray-200 rounded-lg p-5 space-y-4">
            <p className="text-xs uppercase tracking-widest text-gray-400">Search Member</p>
            <div className="relative">
              <input
                ref={searchRef}
                value={search}
                onChange={e => setSearch(e.target.value)}
                placeholder="Start typing a name..."
                className="w-full border border-gray-200 rounded-lg px-4 py-3 text-base text-gray-900 focus:outline-none focus:border-[#b5a06a] transition-colors"
              />
              {search && (
                <button
                  onClick={() => setSearch('')}
                  className="absolute right-3 top-3.5 text-gray-400 hover:text-gray-600"
                >✕</button>
              )}
            </div>

            {/* Suggestions */}
            {filtered.length > 0 && (
              <div className="border border-gray-200 rounded-lg divide-y divide-gray-100 overflow-hidden">
                {filtered.map(member => (
                  <button
                    key={member.id}
                    onClick={() => selectMember(member)}
                    className="w-full px-4 py-3.5 text-left hover:bg-[#f5f2eb] transition-colors flex items-center justify-between"
                  >
                    <span className="font-medium text-gray-900">{member.name}</span>
                    <span className="text-xs text-gray-400">{member.email}</span>
                  </button>
                ))}
              </div>
            )}

            {search.length > 0 && filtered.length === 0 && (
              <p className="text-sm text-gray-500 text-center py-2">No members found.</p>
            )}
          </div>
        ) : (
          <div className="space-y-4">
            {/* Selected member */}
            <div className="bg-[#1a2e1a] rounded-lg px-5 py-4 flex items-center justify-between">
              <div>
                <p className="text-[#8fa88f] text-xs uppercase tracking-widest mb-0.5">Checking in</p>
                <p className="text-[#f0e8d0] font-serif text-2xl">{selected.name}</p>
              </div>
              <button
                onClick={reset}
                className="text-[#8fa88f] hover:text-[#e8dfc8] text-sm transition-colors"
              >
                Change
              </button>
            </div>

            {/* Guests */}
            <div className="bg-white border border-gray-200 rounded-lg p-5 space-y-3">
              <p className="text-xs uppercase tracking-widest text-gray-400">Guests (optional)</p>
              <div className="flex gap-2">
                <input
                  value={guestInput}
                  onChange={e => setGuestInput(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && addGuest()}
                  placeholder="Guest name..."
                  className="flex-1 border border-gray-200 rounded px-3 py-2.5 text-sm focus:outline-none focus:border-[#b5a06a] transition-colors"
                />
                <button
                  onClick={addGuest}
                  disabled={!guestInput.trim()}
                  className="bg-[#1a2e1a] text-[#e8dfc8] px-4 py-2.5 rounded text-sm hover:bg-[#2a3e2a] transition-colors disabled:opacity-40"
                >
                  Add
                </button>
              </div>
              {guests.length > 0 && (
                <div className="space-y-2">
                  {guests.map((g, i) => (
                    <div key={i} className="flex items-center justify-between bg-gray-50 rounded px-3 py-2">
                      <span className="text-sm text-gray-700">{g}</span>
                      <button
                        onClick={() => removeGuest(i)}
                        className="text-gray-400 hover:text-red-500 transition-colors text-xs"
                      >
                        Remove
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Notes */}
            <div className="bg-white border border-gray-200 rounded-lg p-5 space-y-3">
              <p className="text-xs uppercase tracking-widest text-gray-400">Notes (optional)</p>
              <textarea
                value={notes}
                onChange={e => setNotes(e.target.value)}
                placeholder="e.g. Social member, tournament play, etc."
                className="w-full border border-gray-200 rounded px-3 py-2.5 text-sm focus:outline-none focus:border-[#b5a06a] transition-colors resize-none min-h-[80px]"
              />
            </div>

            {/* Summary & submit */}
            <div className="bg-white border border-gray-200 rounded-lg p-5 space-y-3">
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-600">Member</span>
                <span className="font-medium">{selected.name}</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-600">Guests</span>
                <span className="font-medium">{guests.length}</span>
              </div>
              <div className="flex items-center justify-between text-sm font-semibold border-t border-gray-100 pt-3">
                <span className="text-gray-800">Total on course</span>
                <span className="text-[#1a2e1a] text-lg font-serif">{1 + guests.length}</span>
              </div>
            </div>

            {success ? (
              <div className="bg-green-50 border border-green-200 rounded-lg px-5 py-4 text-center">
                <p className="text-green-700 font-medium">✓ {success}</p>
                <p className="text-green-600 text-xs mt-1">Resetting in a moment...</p>
              </div>
            ) : (
              <button
                onClick={handleCheckIn}
                disabled={loading}
                className="w-full bg-[#b5a06a] text-[#1a2e1a] font-semibold py-4 rounded-lg text-base hover:bg-[#c9b47e] transition-colors disabled:opacity-40"
              >
                {loading ? 'Checking in...' : `Check In ${1 + guests.length > 1 ? `(${1 + guests.length} people)` : ''}`}
              </button>
            )}
          </div>
        )}
      </div>

      {/* Today's check-ins */}
      <div>
        <h3 className="font-serif text-xl text-[#1a2e1a] mb-3">
          Today's Rounds ({todayRounds.length})
        </h3>
        {todayRounds.length === 0 ? (
          <div className="bg-white border border-gray-200 rounded-lg px-5 py-8 text-center">
            <p className="text-gray-500 text-sm">No check-ins yet today.</p>
          </div>
        ) : (
          <div className="bg-white border border-gray-200 rounded-lg divide-y divide-gray-100 max-h-[600px] overflow-y-auto">
            {todayRounds.map(round => (
              <div key={round.id} className="px-4 py-3">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="font-medium text-gray-900">{round.memberName}</p>
                    {round.guests.length > 0 && (
                      <p className="text-xs text-gray-500 mt-0.5">
                        + {round.guests.join(', ')}
                      </p>
                    )}
                    {round.notes && (
                      <p className="text-xs text-gray-400 italic mt-0.5">{round.notes}</p>
                    )}
                  </div>
                  <div className="text-right flex-shrink-0 ml-4">
                    <p className="text-xs text-gray-400">
                      {new Date(round.createdAt).toLocaleTimeString('en-US', {
                        hour: 'numeric', minute: '2-digit'
                      })}
                    </p>
                    <p className="text-xs text-gray-400">
                      {1 + round.guests.length} {1 + round.guests.length === 1 ? 'person' : 'people'}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}