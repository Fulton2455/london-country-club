import { prisma } from '@/lib/prisma'
import Link from 'next/link'

export default async function PublicEventsPage() {
  const events = await prisma.event.findMany({
    where: { isPublic: true, dateTime: { gte: new Date() } },
    orderBy: { dateTime: 'asc' },
  })

  return (
    <div className="max-w-4xl mx-auto px-6 py-16 space-y-8">
      <div>
        <p className="text-[#b5a06a] text-xs tracking-[0.2em] uppercase mb-2">Open to everyone</p>
        <h2 className="font-serif text-5xl text-[#1a2e1a] mb-4">Upcoming Events</h2>
        <p className="text-gray-600 leading-relaxed max-w-xl">
          Browse our upcoming public events. Members can also access exclusive member-only events by logging into the member portal.
        </p>
      </div>

      {events.length === 0 ? (
        <div className="bg-white border border-gray-200 rounded-lg px-6 py-12 text-center">
          <p className="text-gray-500">No upcoming public events. Check back soon.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {events.map(event => (
            <div key={event.id} className="bg-white border border-gray-200 rounded-lg px-6 py-5">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-[#b5a06a] text-xs uppercase tracking-widest mb-1">
                    {new Date(event.dateTime).toLocaleDateString('en-US', {
                      weekday: 'long', month: 'long', day: 'numeric', hour: 'numeric', minute: '2-digit'
                    })}
                  </p>
                  <h3 className="font-serif text-xl text-[#1a2e1a] mb-1">{event.title}</h3>
                  {event.location && (
                    <p className="text-sm text-gray-500 mb-2">{event.location}</p>
                  )}
                  {event.description && (
                    <p className="text-sm text-gray-600 leading-relaxed">{event.description}</p>
                  )}
                </div>
                {event.capacity && (
                  <div className="text-right flex-shrink-0">
                    <p className="text-xs uppercase tracking-widest text-gray-400">Capacity</p>
                    <p className="text-lg font-serif text-[#1a2e1a]">{event.capacity}</p>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      <div className="bg-[#1a2e1a] rounded-lg px-6 py-5 flex items-center justify-between flex-wrap gap-4">
        <div>
          <p className="text-[#f0e8d0] font-medium text-sm">Are you a member?</p>
          <p className="text-[#8fa88f] text-xs mt-0.5">Log in to see member-only events and RSVP online.</p>
        </div>
        <Link
          href="/login"
          className="bg-[#b5a06a] text-[#1a2e1a] font-semibold px-5 py-2.5 rounded hover:bg-[#c9b47e] transition-colors text-sm"
        >
          Member Login →
        </Link>
      </div>
    </div>
  )
}