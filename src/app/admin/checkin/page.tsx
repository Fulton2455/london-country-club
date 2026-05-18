import { prisma } from '@/lib/prisma'
import { createClient } from '@/lib/supabase/server'
import CheckInKiosk from './CheckInKiosk'

export default async function CheckInPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  const dbUser = await prisma.user.findUnique({ where: { email: user!.email! } })

  const members = await prisma.user.findMany({
    orderBy: { name: 'asc' },
    select: { id: true, name: true, email: true },
  })

  // Today's check-ins
  const today = new Date()
  today.setHours(0, 0, 0, 0)

  const todayRounds = await prisma.roundLog.findMany({
    where: { createdAt: { gte: today } },
    orderBy: { createdAt: 'desc' },
  })

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="font-serif text-3xl text-[#1a2e1a]">Round Check-In</h2>
          <p className="text-gray-500 text-sm mt-1">
            {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })}
          </p>
        </div>
        <div className="bg-[#1a2e1a] rounded-lg px-5 py-3 text-center">
          <p className="text-[#b5a06a] text-2xl font-serif">{todayRounds.length}</p>
          <p className="text-[#8fa88f] text-xs uppercase tracking-widest">Today</p>
        </div>
      </div>

      <CheckInKiosk
        members={members}
        adminId={dbUser!.id}
        todayRounds={todayRounds}
      />
    </div>
  )
}