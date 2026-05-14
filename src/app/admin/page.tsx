import { prisma } from '@/lib/prisma'
import Link from 'next/link'

export default async function AdminPage() {
  const [eventCount, userCount, announcementCount, pendingInvites] = await Promise.all([
    prisma.event.count(),
    prisma.user.count(),
    prisma.announcement.count(),
    prisma.invite.count({ where: { usedAt: null } }),
  ])

  const recentRsvps = await prisma.rsvp.findMany({
    orderBy: { createdAt: 'desc' },
    take: 5,
    include: { user: true, event: true },
  })

  return (
    <div className="space-y-8">
      <h2 className="font-serif text-3xl text-[#1a2e1a]">Overview</h2>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: 'Total Events', value: eventCount, href: '/admin/events' },
          { label: 'Members', value: userCount, href: '/admin/invites' },
          { label: 'Announcements', value: announcementCount, href: '/admin/announcements' },
          { label: 'Pending Invites', value: pendingInvites, href: '/admin/invites' },
        ].map(stat => (
          <Link key={stat.label} href={stat.href}>
            <div className="bg-white border border-gray-200 rounded-lg px-5 py-4 hover:border-[#b5a06a] transition-colors">
              <p className="text-3xl font-serif text-[#1a2e1a]">{stat.value}</p>
              <p className="text-xs uppercase tracking-widest text-gray-400 mt-1">{stat.label}</p>
            </div>
          </Link>
        ))}
      </div>

      {/* Recent RSVPs */}
      <div>
        <h3 className="font-serif text-xl text-[#1a2e1a] mb-4">Recent RSVPs</h3>
        {recentRsvps.length === 0 ? (
          <p className="text-gray-500 text-sm">No RSVPs yet.</p>
        ) : (
          <div className="bg-white border border-gray-200 rounded-lg divide-y divide-gray-100">
            {recentRsvps.map(rsvp => (
              <div key={rsvp.id} className="px-5 py-3 flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-900">{rsvp.user.name}</p>
                  <p className="text-xs text-gray-500">{rsvp.event.title}</p>
                </div>
                <span className={`text-xs uppercase tracking-widest px-2 py-0.5 rounded ${
                  rsvp.status === 'YES'
                    ? 'bg-green-100 text-green-700'
                    : 'bg-gray-100 text-gray-500'
                }`}>
                  {rsvp.status === 'YES' ? 'Going' : 'Not going'}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}