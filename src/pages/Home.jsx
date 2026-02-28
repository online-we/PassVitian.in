import { Link } from 'react-router-dom'
import heroCardImage from '../assets/hero-card.png'

export default function Home() {
  return (
    <section className="max-w-6xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
      <div className="grid md:grid-cols-2 gap-0 items-stretch rounded-2xl overflow-hidden border border-gray-200 shadow-lg">
        {/* Left: Hero image card */}
        <div className="bg-gradient-to-r from-gray-50 to-white min-h-[200px] sm:min-h-[260px] md:min-h-0 flex items-center justify-center">
          <img
            src={heroCardImage}
            alt="Mid-term & Term-end for VIT Bhopal Campus"
            className="w-full h-full min-h-[200px] sm:min-h-[260px] md:min-h-0 object-contain object-center select-none"
            onError={(e) => {
              e.target.style.display = 'none'
              e.target.nextElementSibling?.classList.remove('hidden')
            }}
          />
          <div className="hidden text-center p-6 sm:p-8 text-gray-500">
            <p className="text-lg font-semibold text-primary">Mid-term & Term-end</p>
            <p className="text-primary underline mt-1">For VIT Bhopal Campus</p>
          </div>
        </div>

        {/* Right: CTA card */}
        <div className="bg-white border-t md:border-t-0 md:border-l border-gray-200 p-6 sm:p-8 h-full flex flex-col">
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
            className="mt-6 inline-flex items-center justify-center px-5 h-10 bg-primary text-white text-sm font-medium rounded-lg hover:bg-primary-light transition shadow-sm w-fit"
          >
            View Papers
          </Link>
        </div>
      </div>
    </section>
  )
}
