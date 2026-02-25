import { Link } from 'react-router-dom'

export default function Home() {
  return (
    <section className="max-w-6xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
      <div className="grid md:grid-cols-2 gap-6 md:gap-8 items-center">
        {/* Left: Hero image card – replace src with your uploaded image path */}
        <div className="rounded-2xl overflow-hidden border border-gray-200 shadow-lg bg-gradient-to-r from-gray-50 to-white min-h-[280px] flex items-center justify-center">
          <img
            src="/hero-card.png"
            alt="Mid-term & Term-end for VIT Bhopal Campus"
            className="w-full h-full object-cover object-center"
            onError={(e) => {
              e.target.style.display = 'none'
              e.target.nextElementSibling?.classList.remove('hidden')
            }}
          />
          <div className="hidden text-center p-8 text-gray-500">
            <p className="text-lg font-semibold text-primary">Mid-term & Term-end</p>
            <p className="text-primary underline mt-1">For VIT Bhopal Campus</p>
            <p className="text-sm mt-4">Upload your hero image as <code className="bg-gray-100 px-1 rounded">public/hero-card.png</code></p>
          </div>
        </div>

        {/* Right: CTA card */}
        <div className="bg-white rounded-2xl border border-gray-200 shadow-lg p-6 sm:p-8">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
            Previous Semester Papers
          </h1>
          <p className="mt-3 text-gray-600">
            Practicing past papers is the best way to prepare for any exam.
          </p>
          <ul className="mt-4 space-y-2">
            {['Mid-term papers', 'Term-end papers', 'Projects & Assignments'].map((item) => (
              <li key={item} className="flex items-center gap-2 text-gray-700">
                <span className="text-primary">✓</span>
                {item}
              </li>
            ))}
          </ul>
          <Link
            to="/papers"
            className="mt-6 inline-block px-6 py-3 bg-primary text-white font-medium rounded-lg hover:bg-primary-light transition shadow-md"
          >
            View Papers
          </Link>
        </div>
      </div>
    </section>
  )
}
