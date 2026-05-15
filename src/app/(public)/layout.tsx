'use client'

import Link from 'next/link'
import { useState } from 'react'

function Nav() {
  const [open, setOpen] = useState(false)

  const links = [
    { label: 'About', href: '/about' },
    { label: 'Membership', href: '/membership' },
    { label: 'Events', href: '/events' },
    { label: 'Contact', href: '/contact' },
  ]

  return (
    <nav className="bg-[#1a2e1a] text-[#e8dfc8]">
      <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
        <Link href="/" onClick={() => setOpen(false)}>
          <div>
            <p className="text-[#b5a06a] text-[10px] tracking-[0.2em] uppercase">Est. 1921</p>
            <h1 className="font-serif text-lg leading-tight">London Country Club</h1>
          </div>
        </Link>

        {/* Desktop links */}
        <div className="hidden md:flex items-center gap-6">
          {links.map(l => (
            <Link key={l.href} href={l.href} className="text-xs uppercase tracking-widest text-[#8fa88f] hover:text-[#b5a06a] transition-colors">
              {l.label}
            </Link>
          ))}
          <Link href="/login" className="text-xs uppercase tracking-widest bg-[#b5a06a] text-[#1a2e1a] px-4 py-2 rounded font-semibold hover:bg-[#c9b47e] transition-colors">
            Member Login
          </Link>
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
          <Link
            href="/login"
            onClick={() => setOpen(false)}
            className="block text-center text-sm uppercase tracking-widest bg-[#b5a06a] text-[#1a2e1a] px-4 py-2.5 rounded font-semibold hover:bg-[#c9b47e] transition-colors mt-2"
          >
            Member Login
          </Link>
        </div>
      )}
    </nav>
  )
}

export default function PublicLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-[#f5f2eb]">
      <Nav />
      {children}

      <footer className="bg-[#1a2e1a] text-[#8fa88f] mt-20">
        <div className="max-w-6xl mx-auto px-6 py-12 grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <p className="text-[#b5a06a] text-[10px] tracking-[0.2em] uppercase mb-2">Est. 1921</p>
            <h3 className="font-serif text-[#f0e8d0] text-lg mb-3">London Country Club</h3>
            <p className="text-sm leading-relaxed">
              Proud part of the London community for over a century.
            </p>
          </div>
          <div>
            <p className="text-[10px] uppercase tracking-widest text-[#b5a06a] mb-3">Quick Links</p>
            <div className="space-y-2">
              {[
                { label: 'About', href: '/about' },
                { label: 'Membership', href: '/membership' },
                { label: 'Events', href: '/events' },
                { label: 'Contact', href: '/contact' },
                { label: 'Member Login', href: '/login' },
              ].map(link => (
                <Link key={link.href} href={link.href} className="block text-sm hover:text-[#b5a06a] transition-colors">
                  {link.label}
                </Link>
              ))}
            </div>
          </div>
          <div>
            <p className="text-[10px] uppercase tracking-widest text-[#b5a06a] mb-3">Contact</p>
            <div className="space-y-2 text-sm">
              <p>1199 Spring Valley Road</p>
              <p>London, Ohio 43140</p>
              <a href="tel:7408521762" className="block hover:text-[#b5a06a] transition-colors">740-852-1762</a>
            </div>
          </div>
        </div>
        <div className="border-t border-white/10 max-w-6xl mx-auto px-6 py-4">
          <p className="text-xs text-center">© {new Date().getFullYear()} London Country Club. All rights reserved.</p>
        </div>
      </footer>
    </div>
  )
}