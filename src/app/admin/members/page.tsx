import { prisma } from '@/lib/prisma'
import MemberList from './MemberList'

export default async function AdminMembersPage() {
  const members = await prisma.user.findMany({
    orderBy: { name: 'asc' },
    include: {
      _count: { select: { rsvps: true } },
    },
  })

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="font-serif text-3xl text-[#1a2e1a]">Members</h2>
        <span className="text-sm text-gray-500">{members.length} total</span>
      </div>
      <MemberList members={members} />
    </div>
  )
}