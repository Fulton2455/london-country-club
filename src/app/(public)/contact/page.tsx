export default function ContactPage() {
  return (
    <div className="max-w-4xl mx-auto px-6 py-16 space-y-12">
      <div>
        <p className="text-[#b5a06a] text-xs tracking-[0.2em] uppercase mb-2">Get in touch</p>
        <h2 className="font-serif text-5xl text-[#1a2e1a] mb-4">Contact Us</h2>
        <p className="text-gray-600 text-lg max-w-xl leading-relaxed">
          Have questions about membership, events, or catering? We'd love to hear from you.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Contact info */}
        <div className="space-y-4">
          <div className="bg-white border border-gray-200 rounded-lg px-6 py-5">
            <p className="text-xs uppercase tracking-widest text-[#b5a06a] mb-3">Address</p>
            <p className="text-gray-700 text-sm leading-relaxed">
              1199 Spring Valley Road<br />
              London, Ohio 43140
            </p>
          </div>
          <div className="bg-white border border-gray-200 rounded-lg px-6 py-5">
            <p className="text-xs uppercase tracking-widest text-[#b5a06a] mb-3">Phone</p>
            <a href="tel:7408521762" className="text-gray-700 text-sm hover:text-[#b5a06a] transition-colors">
              740-852-1762
            </a>
          </div>
          <div className="bg-white border border-gray-200 rounded-lg px-6 py-5">
            <p className="text-xs uppercase tracking-widest text-[#b5a06a] mb-3">Traditions Catering</p>
            <p className="text-gray-700 text-sm leading-relaxed mb-2">
              On-site and off-site catering available for any occasion.
            </p>
            
             <a href="https://www.facebook.com/Traditions-Catering-186295562190897"
              target="_blank"
              rel="noopener noreferrer"
              className="text-[#b5a06a] text-sm hover:underline"
            >
              Find us on Facebook →
            </a>
          </div>
        </div>

        {/* Map embed */}
        <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
          <iframe
            title="London Country Club location"
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3048!2d-83.44!3d39.88!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2s1199+Spring+Valley+Rd%2C+London%2C+OH+43140!5e0!3m2!1sen!2sus!4v1"
            width="100%"
            height="100%"
            style={{ minHeight: '300px', border: 0 }}
            allowFullScreen
            loading="lazy"
          />
        </div>
      </div>
    </div>
  )
}