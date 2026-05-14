export default function AboutPage() {
  return (
    <div className="max-w-4xl mx-auto px-6 py-16 space-y-16">
      <div>
        <p className="text-[#b5a06a] text-xs tracking-[0.2em] uppercase mb-2">Our story</p>
        <h2 className="font-serif text-5xl text-[#1a2e1a] mb-6">Est. 1921</h2>
        <p className="text-gray-700 text-lg leading-relaxed max-w-2xl">
          London Country Club has been a cornerstone of the London, Ohio community for over a century. Founded in 1921, the club has provided generations of golfers with a welcoming place to play, connect, and enjoy the game.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <h3 className="font-serif text-2xl text-[#1a2e1a] mb-3">The Course</h3>
          <p className="text-gray-600 leading-relaxed">
            Our course offers a classic layout that rewards strategic play. With no tee times required, members enjoy the freedom to play at their own pace in a relaxed, friendly atmosphere.
          </p>
        </div>
        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <h3 className="font-serif text-2xl text-[#1a2e1a] mb-3">Traditions Catering</h3>
          <p className="text-gray-600 leading-relaxed">
            Our catering partner, Traditions, provides exceptional on-site dining and off-site catering services for club events, private parties, and special occasions throughout the community.
          </p>
        </div>
        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <h3 className="font-serif text-2xl text-[#1a2e1a] mb-3">The Community</h3>
          <p className="text-gray-600 leading-relaxed">
            More than just a golf club, LCC is a gathering place. From member tournaments to social events, we foster the kind of friendships that last well beyond the 18th hole.
          </p>
        </div>
        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <h3 className="font-serif text-2xl text-[#1a2e1a] mb-3">The Practice Range</h3>
          <p className="text-gray-600 leading-relaxed">
            Members have full access to our driving range — perfect for warming up before a round or working on your game between visits to the course.
          </p>
        </div>
      </div>
    </div>
  )
}