import { prisma } from '@/lib/prisma'
import { notFound } from 'next/navigation'
import Link from 'next/link'

export default async function RsvpListPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params

  const event = await prisma.event.findUnique({
    where: { id },
    include: {
      rsvps: {
        include: { user: true },
        orderBy: { createdAt: 'asc' },
      },
    },
  })

  if (!event) notFound()

  const going = event.rsvps.filter(r => r.status === 'YES')
  const notGoing = event.rsvps.filter(r => r.status === 'NO')

  return (
    <div className="max-w-2xl space-y-6">
      <div>
        <Link href="/admin/events" className="text-xs uppercase tracking-widest text-[#b5a06a] hover:underline">
          ← Back to events
        </Link>
        <h2 className="font-serif text-3xl text-[#1a2e1a] mt-2">{event.title}</h2>
        <p className="text-gray-500 text-sm mt-1">
          {new Date(event.dateTime).toLocaleDateString('en-US', {
            weekday: 'long', month: 'long', day: 'numeric', hour: 'numeric', minute: '2-digit'
          })}
        </p>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="bg-white border border-gray-200 rounded-lg px-5 py-4 text-center">
          <p className="text-3xl font-serif text-[#1a2e1a]">{going.length}</p>
          <p className="text-xs uppercase tracking-widest text-gray-400 mt-1">Going</p>
        </div>
        <div className="bg-white border border-gray-200 rounded-lg px-5 py-4 text-center">
          <p className="text-3xl font-serif text-[#1a2e1a]">{notGoing.length}</p>
          <p className="text-xs uppercase tracking-widest text-gray-400 mt-1">Not going</p>
        </div>
      </div>

      {going.length > 0 && (
        <div>
          <h3 className="font-serif text-xl text-[#1a2e1a] mb-3">Going ({going.length})</h3>
          <div className="bg-white border border-gray-200 rounded-lg divide-y divide-gray-100">
            {going.map(rsvp => (
              <div key={rsvp.id} className="px-5 py-3 flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-900">{rsvp.user.name}</p>
                  <p className="text-xs text-gray-400">{rsvp.user.email}</p>
                </div>
                <p className="text-xs text-gray-400">
                  {new Date(rsvp.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

      {notGoing.length > 0 && (
        <div>
          <h3 className="font-serif text-xl text-[#1a2e1a] mb-3">Not going ({notGoing.length})</h3>
          <div className="bg-white border border-gray-200 rounded-lg divide-y divide-gray-100 opacity-60">
            {notGoing.map(rsvp => (
              <div key={rsvp.id} className="px-5 py-3">
                <p className="text-sm font-medium text-gray-900">{rsvp.user.name}</p>
                <p className="text-xs text-gray-400">{rsvp.user.email}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}