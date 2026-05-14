import { createClient } from '@/lib/supabase/server'
import { prisma } from '@/lib/prisma'
import Link from 'next/link'

export default async function EventsPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  const dbUser = await prisma.user.findUnique({
    where: { email: user!.email! },
  })

  const events = await prisma.event.findMany({
    orderBy: { dateTime: 'asc' },
    include: {
      _count: { select: { rsvps: { where: { status: 'YES' } } } },
      rsvps: { where: { userId: dbUser?.id ?? '' } },
    },
  })

  const upcoming = events.filter(e => e.dateTime >= new Date())
  const past = events.filter(e => e.dateTime < new Date())

  return (
    <div className="space-y-8">
      <h2 className="font-serif text-3xl text-[#1a2e1a]">Events</h2>

      <Section title="Upcoming" events={upcoming} dbUserId={dbUser?.id} />
      {past.length > 0 && <Section title="Past Events" events={past} dbUserId={dbUser?.id} faded />}
    </div>
  )
}

function Section({ title, events, dbUserId, faded = false }: {
  title: string
  events: any[]
  dbUserId?: string
  faded?: boolean
}) {
  if (events.length === 0) return (
    <div>
      <h3 className="font-serif text-xl text-[#1a2e1a] mb-3">{title}</h3>
      <p className="text-gray-500 text-sm">No events.</p>
    </div>
  )

  return (
    <div className={faded ? 'opacity-60' : ''}>
      <h3 className="font-serif text-xl text-[#1a2e1a] mb-3">{title}</h3>
      <div className="grid gap-3">
        {events.map(event => {
          const myRsvp = event.rsvps[0]
          const spotsLeft = event.capacity
            ? event.capacity - event._count.rsvps
            : null

          return (
            <div key={event.id} className="bg-white border border-gray-200 rounded-lg px-5 py-4">
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1.5 flex-wrap">
                    <span className={`text-[10px] uppercase tracking-widest px-2 py-0.5 rounded ${
                      event.isPublic ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700'
                    }`}>
                      {event.isPublic ? 'Public' : 'Members only'}
                    </span>
                    {myRsvp?.status === 'YES' && (
                      <span className="text-[10px] uppercase tracking-widest px-2 py-0.5 rounded bg-[#1a2e1a] text-[#b5a06a]">
                        ✓ Going
                      </span>
                    )}
                    {myRsvp?.status === 'NO' && (
                      <span className="text-[10px] uppercase tracking-widest px-2 py-0.5 rounded bg-gray-100 text-gray-500">
                        Not going
                      </span>
                    )}
                  </div>
                  <p className="font-medium text-gray-900 text-lg">{event.title}</p>
                  <p className="text-sm text-gray-500 mt-0.5">
                    {new Date(event.dateTime).toLocaleDateString('en-US', {
                      weekday: 'long', month: 'long', day: 'numeric',
                      hour: 'numeric', minute: '2-digit'
                    })}
                  </p>
                  {event.location && (
                    <p className="text-sm text-gray-500">{event.location}</p>
                  )}
                  {spotsLeft !== null && (
                    <p className="text-xs text-gray-400 mt-1">{spotsLeft} spots remaining</p>
                  )}
                </div>
                <Link
                  href={`/dashboard/events/${event.id}`}
                  className="text-xs uppercase tracking-widest bg-[#1a2e1a] text-[#e8dfc8] px-4 py-2 rounded hover:bg-[#2a3e2a] transition-colors flex-shrink-0"
                >
                  View
                </Link>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}