import { prisma } from '@/lib/prisma'
import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

export async function POST(request: Request) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const dbUser = await prisma.user.findUnique({ where: { email: user.email! } })
  if (!dbUser || dbUser.role !== 'ADMIN') return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { adminId, email } = await request.json()

  const invite = await prisma.invite.create({
    data: {
      createdById: adminId,
      email: email || null,
    },
  })

  return NextResponse.json(invite)
}