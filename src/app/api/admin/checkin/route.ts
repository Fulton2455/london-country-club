import { prisma } from '@/lib/prisma'
import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

export async function POST(request: Request) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const dbUser = await prisma.user.findUnique({ where: { email: user.email! } })
  if (!dbUser || dbUser.role !== 'ADMIN') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { memberName, guests, notes, adminId } = await request.json()

  const round = await prisma.roundLog.create({
    data: {
      // Normalize capitalization — store as Title Case
      memberName: memberName.trim().toLowerCase().replace(
        /\b\w/g, (c: string) => c.toUpperCase()
      ),
      guests: guests.map((g: string) => g.trim()),
      notes: notes || null,
      loggedById: adminId,
    },
  })

  return NextResponse.json(round)
}