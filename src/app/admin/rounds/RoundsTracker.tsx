'use client'

import { useState } from 'react'

type Summary = { name: string; count: number }
type Round = {
  id: string
  memberName: string
  guests: string[]
  notes: string | null
  createdAt: Date
}

const SOCIAL_LIMIT = 6

export default function RoundsTracker({
  summary,
  rounds,
}: {
  summary: Summary[]
  rounds: Round[]
}) {
  const [search, setSearch] = useState('')
  const [selected, setSelected] = useState<string | null>(null)

  const filteredSummary = summary.filter(s =>
    s.name.toLowerCase().includes(search.toLowerCase())
  )

  const selectedRounds = selected
    ? rounds.filter(r => r.memberName.toLowerCase() === selected.toLowerCase())
    : []

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

      {/* Summary table */}
      <div className="space-y-4">
        <div className="relative">
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search by name..."
            className="w-full border border-gray-200 rounded-lg px-4 py-3 pl-10 text-sm focus:outline-none focus:border-[#b5a06a] transition-colors bg-white"
          />
          <svg className="absolute left-3 top-3.5 w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          {search && (
            <button onClick={() => setSearch('')} className="absolute right-3 top-3.5 text-gray-400 hover:text-gray-600">✕</button>
          )}
        </div>

        {filteredSummary.length === 0 ? (
          <div className="bg-white border border-gray-200 rounded-lg px-5 py-8 text-center">
            <p className="text-gray-500 text-sm">No results found.</p>
          </div>
        ) : (
          <div className="bg-white border border-gray-200 rounded-lg divide-y divide-gray-100">
            {filteredSummary.map(member => {
              const isOver = member.count >= SOCIAL_LIMIT
              const isNear = member.count === SOCIAL_LIMIT - 1
              return (
                <button
                  key={member.name}
                  onClick={() => setSelected(selected === member.name ? null : member.name)}
                  className={`w-full px-4 py-3.5 flex items-center justify-between hover:bg-[#f5f2eb] transition-colors text-left ${
                    selected === member.name ? 'bg-[#f5f2eb]' : ''
                  }`}
                >
                  <div>
                    <p className="font-medium text-gray-900">{member.name}</p>
                    {isOver && (
                      <p className="text-xs text-red-500 mt-0.5">At or over limit ({SOCIAL_LIMIT} rounds)</p>
                    )}
                    {isNear && !isOver && (
                      <p className="text-xs text-amber-500 mt-0.5">1 round remaining</p>
                    )}
                  </div>
                  <div className="flex items-center gap-3">
                    <div className={`text-lg font-serif font-semibold ${
                      isOver ? 'text-red-500' : isNear ? 'text-amber-500' : 'text-[#1a2e1a]'
                    }`}>
                      {member.count}
                    </div>
                    <div className="w-20 bg-gray-100 rounded-full h-2">
                      <div
                        className={`h-2 rounded-full transition-all ${
                          isOver ? 'bg-red-400' : isNear ? 'bg-amber-400' : 'bg-[#1a2e1a]'
                        }`}
                        style={{ width: `${Math.min((member.count / SOCIAL_LIMIT) * 100, 100)}%` }}
                      />
                    </div>
                  </div>
                </button>
              )
            })}
          </div>
        )}
      </div>

      {/* Round history for selected member */}
      <div>
        {selected ? (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-serif text-xl text-[#1a2e1a]">{selected}</h3>
              <button
                onClick={() => setSelected(null)}
                className="text-xs text-gray-400 hover:text-gray-600 uppercase tracking-widest"
              >
                Close
              </button>
            </div>
            <div className="bg-white border border-gray-200 rounded-lg divide-y divide-gray-100">
              {selectedRounds.map((round, i) => (
                <div key={round.id} className="px-4 py-3">
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-900">
                        Round {selectedRounds.length - i}
                      </p>
                      {round.guests.length > 0 && (
                        <p className="text-xs text-gray-500 mt-0.5">
                          Guests: {round.guests.join(', ')}
                        </p>
                      )}
                      {round.notes && (
                        <p className="text-xs text-gray-400 italic mt-0.5">{round.notes}</p>
                      )}
                    </div>
                    <p className="text-xs text-gray-400 flex-shrink-0 ml-4">
                      {new Date(round.createdAt).toLocaleDateString('en-US', {
                        month: 'short', day: 'numeric', year: 'numeric'
                      })}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="bg-white border border-gray-200 rounded-lg px-5 py-12 text-center">
            <p className="text-gray-400 text-sm">Select a member to view their round history.</p>
          </div>
        )}
      </div>
    </div>
  )
}