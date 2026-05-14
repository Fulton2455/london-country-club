import { prisma } from '@/lib/prisma'
import Link from 'next/link'

export default async function AnnouncementsPage() {
  const announcements = await prisma.announcement.findMany({
    orderBy: { createdAt: 'desc' },
  })

  const dot: Record<string, string> = {
    INFO: 'bg-green-500',
    WARNING: 'bg-amber-500',
    ALERT: 'bg-red-500',
  }

  const label: Record<string, string> = {
    INFO: 'bg-green-100 text-green-700',
    WARNING: 'bg-amber-100 text-amber-700',
    ALERT: 'bg-red-100 text-red-600',
  }

  return (
    <div className="space-y-6">
      <h2 className="font-serif text-3xl text-[#1a2e1a]">Announcements</h2>

      {announcements.length === 0 ? (
        <div className="bg-white border border-gray-200 rounded-lg px-6 py-12 text-center">
          <p className="text-gray-500">No announcements yet. Check back soon.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {announcements.map(a => (
            <div key={a.id} className="bg-white border border-gray-200 rounded-lg px-5 py-4 flex gap-3">
              <div className={`w-2 h-2 rounded-full mt-1.5 flex-shrink-0 ${dot[a.severity]}`} />
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1 flex-wrap">
                  <span className={`text-[10px] uppercase tracking-widest px-2 py-0.5 rounded ${label[a.severity]}`}>
                    {a.severity}
                  </span>
                  {a.isMemberOnly && (
                    <span className="text-[10px] uppercase tracking-widest px-2 py-0.5 rounded bg-amber-100 text-amber-700">
                      Members only
                    </span>
                  )}
                </div>
                <p className="font-medium text-gray-900">{a.title}</p>
                <p className="text-sm text-gray-600 mt-0.5 leading-relaxed">{a.content}</p>
                <p className="text-xs text-gray-400 mt-2">
                  {new Date(a.createdAt).toLocaleDateString('en-US', {
                    weekday: 'short', month: 'short', day: 'numeric',
                    hour: 'numeric', minute: '2-digit'
                  })}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}

      <div className="text-center pt-4">
        <Link href="/dashboard" className="text-xs uppercase tracking-widest text-[#b5a06a] hover:underline">
          ← Back to Dashboard
        </Link>
      </div>
    </div>
  )
}