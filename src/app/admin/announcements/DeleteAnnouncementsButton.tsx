'use client'

import { useRouter } from 'next/navigation'
import { useState } from 'react'

export default function DeleteAnnouncementButton({ announcementId }: { announcementId: string }) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)

  async function handleDelete() {
    if (!confirm('Delete this announcement?')) return
    setLoading(true)
    await fetch(`/api/admin/announcements/${announcementId}`, { method: 'DELETE' })
    router.refresh()
    setLoading(false)
  }

  return (
    <button
      onClick={handleDelete}
      disabled={loading}
      className="text-xs uppercase tracking-widest bg-red-50 text-red-600 px-3 py-1.5 rounded hover:bg-red-100 transition-colors disabled:opacity-40 flex-shrink-0"
    >
      Delete
    </button>
  )
}