import { createClient } from '@/lib/supabase/server'
import { prisma } from '@/lib/prisma'
import { notFound } from 'next/navigation'
import RsvpButton from './RsvpButton'

export default async function EventPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  const event = await prisma.event.findUnique({
    where: { id },
    include: {
      _count: { select: { rsvps: { where: { status: 'YES' } } } },
    },
  })

  if (!event) notFound()

  const dbUser = await prisma.user.findUnique({
    where: { email: user!.email! },
  })

  const myRsvp = dbUser ? await prisma.rsvp.findUnique({
    where: { userId_eventId: { userId: dbUser.id, eventId: event.id } },
  }) : null

  const spotsLeft = event.capacity
    ? event.capacity - event._count.rsvps
    : null

  const isPast = event.dateTime < new Date()

  return (
    <div className="max-w-2xl space-y-6">
      <div>
        <div className="flex items-center gap-2 mb-2">
          <span className={`text-[10px] uppercase tracking-widest px-2 py-0.5 rounded ${
            event.isPublic ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700'
          }`}>
            {event.isPublic ? 'Public' : 'Members only'}
          </span>
          {isPast && (
            <span className="text-[10px] uppercase tracking-widest px-2 py-0.5 rounded bg-gray-100 text-gray-500">
              Past event
            </span>
          )}
        </div>
        <h2 className="font-serif text-3xl text-[#1a2e1a]">{event.title}</h2>
      </div>

      <div className="bg-white border border-gray-200 rounded-lg divide-y divide-gray-100">
        <Row label="Date & Time">
          {new Date(event.dateTime).toLocaleDateString('en-US', {
            weekday: 'long', month: 'long', day: 'numeric',
            hour: 'numeric', minute: '2-digit'
          })}
        </Row>
        {event.location && <Row label="Location">{event.location}</Row>}
        {event.capacity && (
          <Row label="Capacity">
            {event._count.rsvps} going · {spotsLeft} spots left
          </Row>
        )}
        {event.description && (
          <div className="px-5 py-4">
            <p className="text-xs uppercase tracking-widest text-gray-400 mb-1">Details</p>
            <p className="text-gray-700 text-sm leading-relaxed">{event.description}</p>
          </div>
        )}
      </div>

      {!isPast && dbUser && (
        <div className="bg-white border border-gray-200 rounded-lg px-5 py-4">
          <p className="text-xs uppercase tracking-widest text-gray-400 mb-3">Your RSVP</p>
          <RsvpButton
            eventId={event.id}
            userId={dbUser.id}
            currentStatus={myRsvp?.status ?? null}
            spotsLeft={spotsLeft}
          />
        </div>
      )}
    </div>
  )
}

function Row({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="px-5 py-3 flex gap-4">
      <p className="text-xs uppercase tracking-widest text-gray-400 w-24 flex-shrink-0 mt-0.5">{label}</p>
      <p className="text-gray-700 text-sm">{children}</p>
    </div>
  )
}