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

  const { title, content, severity, isMemberOnly } = await request.json()

  const announcement = await prisma.announcement.create({
    data: { title, content, severity, isMemberOnly },
  })

  return NextResponse.json(announcement)
}