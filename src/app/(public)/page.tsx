import { prisma } from '@/lib/prisma'
import Link from 'next/link'

export default async function HomePage() {
  const upcomingPublicEvents = await prisma.event.findMany({
    where: { isPublic: true, dateTime: { gte: new Date() } },
    orderBy: { dateTime: 'asc' },
    take: 3,
  })

  return (
    <div>
      {/* Hero */}
      <div className="bg-[#1a2e1a] text-[#e8dfc8]">
        <div className="max-w-6xl mx-auto px-6 py-24 md:py-36">
          <p className="text-[#b5a06a] text-xs tracking-[0.25em] uppercase mb-4">
            London, Ohio · Est. 1921
          </p>
          <h2 className="font-serif text-5xl md:text-7xl leading-tight mb-6 max-w-2xl">
            Golf the way it was meant to be played.
          </h2>
          <p className="text-[#8fa88f] text-lg max-w-xl leading-relaxed mb-10">
            No tee times. No hassle. Just wide open fairways, a welcoming community, and over a century of tradition in the heart of London, Ohio.
          </p>
          <div className="flex flex-wrap gap-4">
            <Link
              href="/membership"
              className="bg-[#b5a06a] text-[#1a2e1a] font-semibold px-6 py-3 rounded hover:bg-[#c9b47e] transition-colors"
            >
              Explore Membership
            </Link>
            <Link
              href="/contact"
              className="border border-[#8fa88f] text-[#e8dfc8] px-6 py-3 rounded hover:border-[#b5a06a] hover:text-[#b5a06a] transition-colors"
            >
              Contact Us
            </Link>
          </div>
        </div>
      </div>

      {/* At a glance */}
      <div className="max-w-6xl mx-auto px-6 py-16">
        <p className="text-[#b5a06a] text-xs tracking-[0.2em] uppercase mb-2 text-center">At a glance</p>
        <h3 className="font-serif text-3xl text-[#1a2e1a] text-center mb-12">
          Everything you need, nothing you don't.
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            {
              title: 'No Tee Times',
              description: 'Walk on whenever you want. Our open format means you play on your schedule, not ours.',
              icon: '⛳',
            },
            {
              title: 'Traditions Catering',
              description: 'On-site and off-site catering available for events, outings, and private gatherings.',
              icon: '🍽️',
            },
            {
              title: 'Community Since 1921',
              description: 'Over a century of golf, friendship, and tradition proudly rooted in London, Ohio.',
              icon: '🏌️',
            },
          ].map(item => (
            <div key={item.title} className="bg-white border border-gray-200 rounded-lg p-6">
              <div className="text-3xl mb-4">{item.icon}</div>
              <h4 className="font-serif text-xl text-[#1a2e1a] mb-2">{item.title}</h4>
              <p className="text-gray-600 text-sm leading-relaxed">{item.description}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Upcoming public events */}
      <div className="bg-white border-y border-gray-200">
        <div className="max-w-6xl mx-auto px-6 py-16">
          <div className="flex items-center justify-between mb-8">
            <div>
              <p className="text-[#b5a06a] text-xs tracking-[0.2em] uppercase mb-1">Open to everyone</p>
              <h3 className="font-serif text-3xl text-[#1a2e1a]">Upcoming Events</h3>
            </div>
            <Link href="/events" className="text-xs uppercase tracking-widest text-[#b5a06a] hover:underline hidden sm:block">
              View all →
            </Link>
          </div>

          {upcomingPublicEvents.length === 0 ? (
            <p className="text-gray-500 text-sm">No upcoming public events. Check back soon.</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {upcomingPublicEvents.map(event => (
                <div key={event.id} className="border border-gray-200 rounded-lg p-5">
                  <p className="text-xs uppercase tracking-widest text-[#b5a06a] mb-2">
                    {new Date(event.dateTime).toLocaleDateString('en-US', {
                      weekday: 'short', month: 'short', day: 'numeric'
                    })}
                  </p>
                  <h4 className="font-serif text-lg text-[#1a2e1a] mb-1">{event.title}</h4>
                  {event.location && (
                    <p className="text-sm text-gray-500 mb-3">{event.location}</p>
                  )}
                  {event.description && (
                    <p className="text-sm text-gray-600 leading-relaxed line-clamp-2">{event.description}</p>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* CTA */}
      <div className="max-w-6xl mx-auto px-6 py-16 text-center">
        <h3 className="font-serif text-3xl text-[#1a2e1a] mb-4">Ready to join the club?</h3>
        <p className="text-gray-600 max-w-md mx-auto mb-8">
          Membership is open to golfers of all skill levels. Download our membership application or give us a call.
        </p>
        <div className="flex flex-wrap gap-4 justify-center">
          <Link
            href="/membership"
            className="bg-[#1a2e1a] text-[#e8dfc8] font-semibold px-6 py-3 rounded hover:bg-[#2a3e2a] transition-colors"
          >
            View Membership Options
          </Link>
          
            <a href="tel:7408521762"
            className="border border-gray-300 text-gray-700 px-6 py-3 rounded hover:border-[#1a2e1a] transition-colors"
          >
            Call 740-852-1762
          </a>
        </div>
      </div>
    </div>
  )
}