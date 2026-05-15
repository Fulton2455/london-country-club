'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

type Member = {
  id: string
  name: string
  email: string
  role: string
  createdAt: Date
  _count: { rsvps: number }
}

export default function MemberList({ members }: { members: Member[] }) {
  const router = useRouter()
  const [search, setSearch] = useState('')
  const [loadingId, setLoadingId] = useState<string | null>(null)

  const filtered = members.filter(m =>
    m.name.toLowerCase().includes(search.toLowerCase()) ||
    m.email.toLowerCase().includes(search.toLowerCase())
  )

  async function handleRoleChange(memberId: string, newRole: 'MEMBER' | 'ADMIN') {
    if (!confirm(`Change this user's role to ${newRole}?`)) return
    setLoadingId(memberId)
    await fetch(`/api/admin/members/${memberId}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ role: newRole }),
    })
    router.refresh()
    setLoadingId(null)
  }

  async function handleRemove(memberId: string, name: string) {
    if (!confirm(`Remove ${name} from the club? This cannot be undone.`)) return
    setLoadingId(memberId)
    await fetch(`/api/admin/members/${memberId}`, { method: 'DELETE' })
    router.refresh()
    setLoadingId(null)
  }

  return (
    <div className="space-y-4">
      {/* Search */}
      <div className="relative">
        <input
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder="Search by name or email..."
          className="w-full border border-gray-200 rounded-lg px-4 py-3 pl-10 text-sm text-gray-900 focus:outline-none focus:border-[#b5a06a] transition-colors bg-white"
        />
        <svg
          className="absolute left-3 top-3.5 w-4 h-4 text-gray-400"
          fill="none" stroke="currentColor" viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
        {search && (
          <button
            onClick={() => setSearch('')}
            className="absolute right-3 top-3.5 text-gray-400 hover:text-gray-600"
          >
            ✕
          </button>
        )}
      </div>

      {/* Results count */}
      {search && (
        <p className="text-sm text-gray-500">
          {filtered.length} result{filtered.length !== 1 ? 's' : ''} for "{search}"
        </p>
      )}

      {/* Member list */}
      {filtered.length === 0 ? (
        <div className="bg-white border border-gray-200 rounded-lg px-6 py-12 text-center">
          <p className="text-gray-500">No members found.</p>
        </div>
      ) : (
        <div className="bg-white border border-gray-200 rounded-lg divide-y divide-gray-100">
          {filtered.map(member => (
            <div key={member.id} className="px-4 py-4 flex items-center justify-between gap-4 flex-wrap">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <p className="font-medium text-gray-900 truncate">{member.name}</p>
                  <span className={`text-[10px] uppercase tracking-widest px-2 py-0.5 rounded flex-shrink-0 ${
                    member.role === 'ADMIN'
                      ? 'bg-[#1a2e1a] text-[#b5a06a]'
                      : 'bg-gray-100 text-gray-500'
                  }`}>
                    {member.role}
                  </span>
                </div>
                <p className="text-sm text-gray-500 truncate">{member.email}</p>
                <p className="text-xs text-gray-400 mt-0.5">
                  {member._count.rsvps} RSVPs · Joined {new Date(member.createdAt).toLocaleDateString('en-US', {
                    month: 'short', year: 'numeric'
                  })}
                </p>
              </div>

              <div className="flex items-center gap-2 flex-shrink-0">
                {member.role === 'MEMBER' ? (
                  <button
                    onClick={() => handleRoleChange(member.id, 'ADMIN')}
                    disabled={loadingId === member.id}
                    className="text-xs uppercase tracking-widest bg-gray-100 text-gray-700 px-3 py-1.5 rounded hover:bg-gray-200 transition-colors disabled:opacity-40"
                  >
                    Make Admin
                  </button>
                ) : (
                  <button
                    onClick={() => handleRoleChange(member.id, 'MEMBER')}
                    disabled={loadingId === member.id}
                    className="text-xs uppercase tracking-widest bg-gray-100 text-gray-700 px-3 py-1.5 rounded hover:bg-gray-200 transition-colors disabled:opacity-40"
                  >
                    Remove Admin
                  </button>
                )}
                <button
                  onClick={() => handleRemove(member.id, member.name)}
                  disabled={loadingId === member.id}
                  className="text-xs uppercase tracking-widest bg-red-50 text-red-600 px-3 py-1.5 rounded hover:bg-red-100 transition-colors disabled:opacity-40"
                >
                  Remove
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}