import { prisma } from '@/lib/prisma'
import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

export async function POST(request: Request) {
  const { name, email, password, token } = await request.json()

  // Validate invite token
  const invite = await prisma.invite.findUnique({ where: { token } })

  if (!invite) {
    return NextResponse.json({ error: 'Invalid invite link.' }, { status: 400 })
  }
  if (invite.usedAt) {
    return NextResponse.json({ error: 'This invite has already been used.' }, { status: 400 })
  }
  if (invite.email && invite.email !== email) {
    return NextResponse.json({ error: 'This invite is for a different email address.' }, { status: 400 })
  }

  // Create Supabase auth user
  const supabase = await createClient()
  const { data: authData, error: authError } = await supabase.auth.signUp({ email, password })

  if (authError || !authData.user) {
    return NextResponse.json({ error: authError?.message ?? 'Failed to create account.' }, { status: 400 })
  }

  // Create User record in database
  await prisma.user.create({
    data: {
      id: authData.user.id,
      email,
      name,
      role: 'MEMBER',
    },
  })

  // Mark invite as used
  await prisma.invite.update({
    where: { token },
    data: { usedAt: new Date() },
  })

  return NextResponse.json({ success: true })
}