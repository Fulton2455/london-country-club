import { prisma } from '@/lib/prisma'
import Link from 'next/link'
import DeleteAnnouncementButton from './DeleteAnnouncementButton'

export default async function AdminAnnouncementsPage() {
  const announcements = await prisma.announcement.findMany({
    orderBy: { createdAt: 'desc' },
  })

  const severityStyles: Record<string, string> = {
    INFO: 'bg-green-100 text-green-700',
    WARNING: 'bg-amber-100 text-amber-700',
    ALERT: 'bg-red-100 text-red-600',
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="font-serif text-3xl text-[#1a2e1a]">Announcements</h2>
        <Link
          href="/admin/announcements/new"
          className="bg-[#b5a06a] text-[#1a2e1a] text-xs uppercase tracking-widest px-4 py-2.5 rounded font-semibold hover:bg-[#c9b47e] transition-colors"
        >
          + New Announcement
        </Link>
      </div>

      {announcements.length === 0 ? (
        <p className="text-gray-500 text-sm">No announcements yet.</p>
      ) : (
        <div className="bg-white border border-gray-200 rounded-lg divide-y divide-gray-100">
          {announcements.map(a => (
            <div key={a.id} className="px-5 py-4 flex items-start justify-between gap-4">
              <div className="flex gap-3 flex-1">
                <div className={`w-2 h-2 rounded-full mt-1.5 flex-shrink-0 ${
                  a.severity === 'INFO' ? 'bg-green-500' :
                  a.severity === 'WARNING' ? 'bg-amber-500' : 'bg-red-500'
                }`} />
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className={`text-[10px] uppercase tracking-widest px-2 py-0.5 rounded ${severityStyles[a.severity]}`}>
                      {a.severity}
                    </span>
                    {a.isMemberOnly && (
                      <span className="text-[10px] uppercase tracking-widest px-2 py-0.5 rounded bg-amber-100 text-amber-700">
                        Members only
                      </span>
                    )}
                  </div>
                  <p className="font-medium text-gray-900">{a.title}</p>
                  <p className="text-sm text-gray-600 mt-0.5">{a.content}</p>
                  <p className="text-xs text-gray-400 mt-1">
                    {new Date(a.createdAt).toLocaleDateString('en-US', {
                      month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit'
                    })}
                  </p>
                </div>
              </div>
              <DeleteAnnouncementButton announcementId={a.id} />
            </div>
          ))}
        </div>
      )}
    </div>
  )
}