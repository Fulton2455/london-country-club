import { prisma } from '@/lib/prisma'
import RoundsTracker from './RoundsTracker'

export default async function RoundsPage() {
  const rounds = await prisma.roundLog.findMany({
    orderBy: { createdAt: 'desc' },
  })

  // Aggregate rounds per member (case-insensitive)
  const countMap = new Map<string, number>()
  for (const round of rounds) {
    const key = round.memberName.trim().toLowerCase()
    countMap.set(key, (countMap.get(key) ?? 0) + 1)
  }

  // Build summary sorted by most rounds
  const summary = Array.from(countMap.entries())
    .map(([key, count]) => ({
      name: key.replace(/\b\w/g, c => c.toUpperCase()),
      count,
    }))
    .sort((a, b) => b.count - a.count)

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h2 className="font-serif text-3xl text-[#1a2e1a]">Round Tracking</h2>
          <p className="text-gray-500 text-sm mt-1">{rounds.length} total rounds logged</p>
        </div>
        
          <a href="/api/admin/rounds/export"
          className="bg-[#1a2e1a] text-[#e8dfc8] text-xs uppercase tracking-widest px-4 py-2.5 rounded font-semibold hover:bg-[#2a3e2a] transition-colors"
        >
          Export CSV
        </a>
      </div>

      <RoundsTracker summary={summary} rounds={rounds} />
    </div>
  )
}