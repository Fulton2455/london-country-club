import { prisma } from '@/lib/prisma'
import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

export async function POST(request: Request) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

 const { eventId, userId, status, guestCount } = await request.json()

const rsvp = await prisma.rsvp.upsert({
  where: { userId_eventId: { userId, eventId } },
  update: { status, guestCount: status === 'NO' ? 1 : guestCount },
  create: { userId, eventId, status, guestCount: status === 'NO' ? 1 : guestCount },
})

  return NextResponse.json(rsvp)
}