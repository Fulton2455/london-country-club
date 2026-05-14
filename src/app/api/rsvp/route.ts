import { prisma } from '@/lib/prisma'
import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

export async function POST(request: Request) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { eventId, userId, status } = await request.json()

  const rsvp = await prisma.rsvp.upsert({
    where: { userId_eventId: { userId, eventId } },
    update: { status },
    create: { userId, eventId, status },
  })

  return NextResponse.json(rsvp)
}