import { createClient } from '@/lib/supabase/server'
import { prisma } from '@/lib/prisma'
import Link from 'next/link'

export default async function DashboardPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  // Fetch upcoming events (public + member)
  const events = await prisma.event.findMany({
    where: { dateTime: { gte: new Date() } },
    orderBy: { dateTime: 'asc' },
    take: 3,
  })

  // Fetch latest announcements
  const announcements = await prisma.announcement.findMany({
    orderBy: { createdAt: 'desc' },
    take: 3,
  })

  // Fetch user's RSVPs
  const dbUser = await prisma.user.findUnique({
    where: { email: user!.email! },
    include: { rsvps: { include: { event: true } } },
  })

  const upcomingRsvps = dbUser?.rsvps.filter(
    r => r.status === 'YES' && r.event.dateTime >= new Date()
  ) ?? []

  return (
    <div className="space-y-8">
      {/* Welcome */}
      <div className="bg-[#1a2e1a] rounded-lg px-6 py-5 text-[#e8dfc8] flex items-center justify-between">
        <div>
          <p className="text-[#8fa88f] text-sm">Welcome back</p>
          <h2 className="font-serif text-2xl">{dbUser?.name ?? user?.email}</h2>
        </div>
        <div className="text-right">
          <p className="text-[#b5a06a] text-3xl font-serif">{upcomingRsvps.length}</p>
          <p className="text-[#8fa88f] text-xs uppercase tracking-widest">Upcoming RSVPs</p>
        </div>
      </div>

      {/* Upcoming events */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-[#1a2e1a] font-serif text-xl">Upcoming Events</h3>
          <Link href="/dashboard/events" className="text-[#b5a06a] text-xs uppercase tracking-widest hover:underline">
            View all
          </Link>
        </div>
        {events.length === 0 ? (
          <p className="text-gray-500 text-sm">No upcoming events.</p>
        ) : (
          <div className="grid gap-3">
            {events.map(event => (
              <div key={event.id} className="bg-white border border-gray-200 rounded-lg px-5 py-4 flex items-center justify-between">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className={`text-[10px] uppercase tracking-widest px-2 py-0.5 rounded ${
                      event.isPublic
                        ? 'bg-green-100 text-green-700'
                        : 'bg-amber-100 text-amber-700'
                    }`}>
                      {event.isPublic ? 'Public' : 'Members only'}
                    </span>
                  </div>
                  <p className="font-medium text-gray-900">{event.title}</p>
                  <p className="text-sm text-gray-500">
                    {new Date(event.dateTime).toLocaleDateString('en-US', {
                      weekday: 'short', month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit'
                    })}
                    {event.location && ` · ${event.location}`}
                  </p>
                </div>
                <Link
                  href={`/dashboard/events/${event.id}`}
                  className="text-xs uppercase tracking-widest bg-[#1a2e1a] text-[#e8dfc8] px-4 py-2 rounded hover:bg-[#2a3e2a] transition-colors"
                >
                  View
                </Link>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Announcements */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-[#1a2e1a] font-serif text-xl">Announcements</h3>
          <Link href="/dashboard/announcements" className="text-[#b5a06a] text-xs uppercase tracking-widest hover:underline">
            View all
          </Link>
        </div>
        {announcements.length === 0 ? (
          <p className="text-gray-500 text-sm">No announcements yet.</p>
        ) : (
          <div className="space-y-3">
            {announcements.map(a => {
              const dot: Record<string, string> = {
                INFO: 'bg-green-500',
                WARNING: 'bg-amber-500',
                ALERT: 'bg-red-500',
              }
              return (
                <div key={a.id} className="bg-white border border-gray-200 rounded-lg px-5 py-4 flex gap-3">
                  <div className={`w-2 h-2 rounded-full mt-1.5 flex-shrink-0 ${dot[a.severity]}`} />
                  <div>
                    <p className="font-medium text-gray-900">{a.title}</p>
                    <p className="text-sm text-gray-600 mt-0.5">{a.content}</p>
                    <p className="text-xs text-gray-400 mt-1">
                      {new Date(a.createdAt).toLocaleDateString('en-US', {
                        month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit'
                      })}
                    </p>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}