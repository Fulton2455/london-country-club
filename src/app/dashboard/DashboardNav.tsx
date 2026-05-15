'use client'

import Link from 'next/link'
import { useState } from 'react'

export default function DashboardNav({ isAdmin }: { isAdmin?: boolean }) {
  const [open, setOpen] = useState(false)

  const links = [
    { label: 'Dashboard', href: '/dashboard' },
    { label: 'Events', href: '/dashboard/events' },
    { label: 'Announcements', href: '/dashboard/announcements' },
  ]

  return (
    <nav className="bg-[#1a2e1a] text-[#e8dfc8]">
      <div className="px-4 py-4 flex items-center justify-between">
        <div>
          <p className="text-[#b5a06a] text-[10px] tracking-[0.2em] uppercase">Member Portal</p>
          <h1 className="font-serif text-lg leading-tight">London Country Club</h1>
        </div>

        {/* Desktop links */}
        <div className="hidden md:flex items-center gap-6">
          {links.map(l => (
            <Link key={l.href} href={l.href} className="text-xs uppercase tracking-widest text-[#8fa88f] hover:text-[#b5a06a] transition-colors">
              {l.label}
            </Link>
          ))}
          {isAdmin && (
            <Link href="/admin" className="text-xs uppercase tracking-widest text-[#b5a06a] hover:text-[#c9b47e] transition-colors">
              Admin Panel →
            </Link>
          )}
          <form action="/api/auth/signout" method="POST">
            <button className="text-xs uppercase tracking-widest text-[#8fa88f] hover:text-red-400 transition-colors">
              Sign out
            </button>
          </form>
        </div>

        {/* Mobile hamburger */}
        <button
          className="md:hidden flex flex-col gap-1.5 p-2"
          onClick={() => setOpen(o => !o)}
          aria-label="Toggle menu"
        >
          <span className={`block w-6 h-0.5 bg-[#e8dfc8] transition-transform duration-200 ${open ? 'rotate-45 translate-y-2' : ''}`} />
          <span className={`block w-6 h-0.5 bg-[#e8dfc8] transition-opacity duration-200 ${open ? 'opacity-0' : ''}`} />
          <span className={`block w-6 h-0.5 bg-[#e8dfc8] transition-transform duration-200 ${open ? '-rotate-45 -translate-y-2' : ''}`} />
        </button>
      </div>

      {/* Mobile menu */}
      {open && (
        <div className="md:hidden border-t border-white/10 px-4 py-4 space-y-3">
          {links.map(l => (
            <Link
              key={l.href}
              href={l.href}
              onClick={() => setOpen(false)}
              className="block text-sm uppercase tracking-widest text-[#8fa88f] hover:text-[#b5a06a] py-2 transition-colors"
            >
              {l.label}
            </Link>
          ))}
          {isAdmin && (
            <Link
              href="/admin"
              onClick={() => setOpen(false)}
              className="block text-sm uppercase tracking-widest text-[#b5a06a] py-2"
            >
              Admin Panel →
            </Link>
          )}
          <form action="/api/auth/signout" method="POST">
            <button className="block text-sm uppercase tracking-widest text-[#8fa88f] hover:text-red-400 py-2 transition-colors">
              Sign out
            </button>
          </form>
        </div>
      )}
    </nav>
  )
}