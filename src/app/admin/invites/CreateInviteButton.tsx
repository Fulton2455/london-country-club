'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function CreateInviteButton({ adminId }: { adminId: string }) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)

  async function handleCreate() {
    setLoading(true)
    await fetch('/api/admin/invites', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ adminId }),
    })
    router.refresh()
    setLoading(false)
  }

  return (
    <button
      onClick={handleCreate}
      disabled={loading}
      className="bg-[#b5a06a] text-[#1a2e1a] text-xs uppercase tracking-widest px-4 py-2.5 rounded font-semibold hover:bg-[#c9b47e] transition-colors disabled:opacity-40"
    >
      {loading ? 'Generating...' : '+ Generate Invite'}
    </button>
  )
}