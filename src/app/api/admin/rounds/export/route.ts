import { prisma } from '@/lib/prisma'
import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

export async function GET() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const dbUser = await prisma.user.findUnique({ where: { email: user.email! } })
  if (!dbUser || dbUser.role !== 'ADMIN') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const rounds = await prisma.roundLog.findMany({
    orderBy: { createdAt: 'desc' },
  })

  const rows = [
    ['Member Name', 'Date', 'Guests', 'Guest Count', 'Notes'],
    ...rounds.map(r => [
      r.memberName,
      new Date(r.createdAt).toLocaleDateString('en-US'),
      r.guests.join('; '),
      String(r.guests.length),
      r.notes ?? '',
    ]),
  ]

  const csv = rows.map(row =>
    row.map(cell => `"${cell.replace(/"/g, '""')}"`).join(',')
  ).join('\n')

  return new NextResponse(csv, {
    headers: {
      'Content-Type': 'text/csv',
      'Content-Disposition': `attachment; filename="rounds-${new Date().toISOString().split('T')[0]}.csv"`,
    },
  })
}