import Link from 'next/link'

export default function MembershipPage() {
  return (
    <div className="max-w-4xl mx-auto px-6 py-16 space-y-12">
      <div>
        <p className="text-[#b5a06a] text-xs tracking-[0.2em] uppercase mb-2">Join the club</p>
        <h2 className="font-serif text-5xl text-[#1a2e1a] mb-4">Membership</h2>
        <p className="text-gray-600 text-lg max-w-2xl leading-relaxed">
          London Country Club offers flexible membership options for individuals, couples, and families. All members enjoy full course access with no tee times required.
        </p>
      </div>

      {/* Benefits */}
      <div>
        <h3 className="font-serif text-2xl text-[#1a2e1a] mb-6">Member Benefits</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[
            'Unlimited course access — no tee times',
            'Full driving range access',
            'Access to member-only events & tournaments',
            'Online RSVP through the member portal',
            'Real-time course condition updates',
            'Traditions Catering discounts',
            'Guest privileges',
            'A century of community tradition',
          ].map(benefit => (
            <div key={benefit} className="flex items-start gap-3 bg-white border border-gray-200 rounded-lg px-4 py-3">
              <span className="text-[#b5a06a] mt-0.5 flex-shrink-0">✓</span>
              <p className="text-gray-700 text-sm">{benefit}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Application download */}
      <div className="bg-[#1a2e1a] rounded-lg px-8 py-8 text-[#e8dfc8]">
        <p className="text-[#b5a06a] text-xs tracking-[0.2em] uppercase mb-2">Get started</p>
        <h3 className="font-serif text-2xl mb-3">Ready to apply?</h3>
        <p className="text-[#8fa88f] text-sm leading-relaxed mb-6 max-w-lg">
          Download our 2026 membership application, fill it out, and return it to the club in person or by mail. Our staff will be in touch shortly.
        </p>
        <div className="flex flex-wrap gap-4">
          
            <a href="https://img1.wsimg.com/blobby/go/0e303914-7f22-450d-b98d-477293d538bf/downloads/53fd67f5-8768-4f0f-828b-b9ae00d8688f/2026%20New%20Membership%20Applications%20LCC.pdf?ver=1775233453679"
            target="_blank"
            rel="noopener noreferrer"
            className="bg-[#b5a06a] text-[#1a2e1a] font-semibold px-5 py-2.5 rounded hover:bg-[#c9b47e] transition-colors text-sm"
          >
            Download 2026 Application (PDF)
          </a>
          <Link
            href="/contact"
            className="border border-[#8fa88f] text-[#e8dfc8] px-5 py-2.5 rounded hover:border-[#b5a06a] hover:text-[#b5a06a] transition-colors text-sm"
          >
            Contact Us
          </Link>
        </div>
      </div>

      <div className="bg-white border border-gray-200 rounded-lg px-6 py-5">
        <p className="text-sm text-gray-600">
          <span className="font-medium text-gray-900">Questions about membership?</span>{' '}
          Give us a call at{' '}
          <a href="tel:7408521762" className="text-[#b5a06a] hover:underline">740-852-1762</a>{' '}
          or stop by the club at 1199 Spring Valley Road, London, Ohio 43140.
        </p>
      </div>
    </div>
  )
}