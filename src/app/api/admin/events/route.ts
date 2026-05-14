import { prisma } from '@/lib/prisma'
import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

async function requireAdmin() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return null
  const dbUser = await prisma.user.findUnique({ where: { email: user.email! } })
  if (!dbUser || dbUser.role !== 'ADMIN') return null
  return dbUser
}

export async function POST(request: Request) {
  const admin = await requireAdmin()
  if (!admin) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { title, description, dateTime, location, isPublic, capacity } = await request.json()

  const event = await prisma.event.create({
    data: {
      title,
      description: description || null,
      dateTime: new Date(dateTime),
      location: location || null,
      isPublic,
      capacity: capacity || null,
    },
  })

  return NextResponse.json(event)
}