import { createClient } from '@/lib/supabase/server'
import { prisma } from '@/lib/prisma'
import { redirect } from 'next/navigation'
import Link from 'next/link'

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) redirect('/login')

  const dbUser = await prisma.user.findUnique({ where: { email: user.email! } })
  const isAdmin = dbUser?.role === 'ADMIN'

  return (
    <div className="min-h-screen bg-[#f5f2eb]">
      <nav className="bg-[#1a2e1a] text-[#e8dfc8] px-6 py-4 flex items-center justify-between">
        <div>
          <p className="text-[#b5a06a] text-[10px] tracking-[0.2em] uppercase">Member Portal</p>
          <h1 className="font-serif text-lg leading-tight">London Country Club</h1>
        </div>
        <div className="flex items-center gap-6">
          <Link href="/dashboard" className="text-xs uppercase tracking-widest text-[#8fa88f] hover:text-[#b5a06a] transition-colors">
            Dashboard
          </Link>
          <Link href="/dashboard/events" className="text-xs uppercase tracking-widest text-[#8fa88f] hover:text-[#b5a06a] transition-colors">
            Events
          </Link>
          <Link href="/dashboard/announcements" className="text-xs uppercase tracking-widest text-[#8fa88f] hover:text-[#b5a06a] transition-colors">
            Announcements
          </Link>
          {isAdmin && (
            <Link href="/admin" className="text-xs uppercase tracking-widest text-[#b5a06a] hover:text-[#c9b47e] transition-colors">
              Admin Panel →
            </Link>
          )}
          <form action="/api/auth/signout" method="POST">
            <button type="submit" className="text-xs uppercase tracking-widest text-[#8fa88f] hover:text-red-400 transition-colors">
              Sign out
            </button>
          </form>
        </div>
      </nav>
      <main className="max-w-4xl mx-auto px-6 py-8">
        {children}
      </main>
    </div>
  )
}