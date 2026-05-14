import { prisma } from '@/lib/prisma'
import Link from 'next/link'
import DeleteEventButton from './DeleteEventButton'

export default async function AdminEventsPage() {
  const events = await prisma.event.findMany({
    orderBy: { dateTime: 'desc' },
    include: { _count: { select: { rsvps: { where: { status: 'YES' } } } } },
  })

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="font-serif text-3xl text-[#1a2e1a]">Events</h2>
        <Link
          href="/admin/events/new"
          className="bg-[#b5a06a] text-[#1a2e1a] text-xs uppercase tracking-widest px-4 py-2.5 rounded font-semibold hover:bg-[#c9b47e] transition-colors"
        >
          + New Event
        </Link>
      </div>

      {events.length === 0 ? (
        <p className="text-gray-500 text-sm">No events yet.</p>
      ) : (
        <div className="bg-white border border-gray-200 rounded-lg divide-y divide-gray-100">
          {events.map(event => (
            <div key={event.id} className="px-5 py-4 flex items-center justify-between gap-4">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <span className={`text-[10px] uppercase tracking-widest px-2 py-0.5 rounded ${
                    event.isPublic ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700'
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
                <p className="text-xs text-gray-400 mt-0.5">{event._count.rsvps} going</p>
              </div>
              <div className="flex items-center gap-2">
                <Link
                  href={`/admin/events/${event.id}/rsvps`}
                  className="text-xs uppercase tracking-widest text-[#b5a06a] hover:underline"
                >
                  RSVPs
                </Link>
                <Link
                  href={`/admin/events/${event.id}/edit`}
                  className="text-xs uppercase tracking-widest bg-gray-100 text-gray-700 px-3 py-1.5 rounded hover:bg-gray-200 transition-colors"
                >
                  Edit
                </Link>
                <DeleteEventButton eventId={event.id} />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}