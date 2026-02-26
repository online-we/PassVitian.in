import { Link } from 'react-router-dom'
import heroCardImage from '../assets/hero-card.png'

export default function Home() {
  return (
    <section className="max-w-6xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
      <div className="grid md:grid-cols-2 gap-6 md:gap-0 items-stretch">
        {/* Left: Hero image card */}
        <div className="rounded-2xl md:rounded-l-2xl md:rounded-tr-none md:rounded-br-none overflow-hidden border border-gray-200 shadow-lg bg-gradient-to-r from-gray-50 to-white min-h-[280px] md:min-h-0 h-full flex items-center justify-center">
          <img
            src={heroCardImage}
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
          </div>
        </div>

        {/* Right: CTA card */}
        <div className="bg-white rounded-2xl md:rounded-r-2xl md:rounded-tl-none md:rounded-bl-none border border-gray-200 shadow-lg p-6 sm:p-8 h-full flex flex-col">
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
            className="mt-auto pt-6 inline-flex items-center justify-center px-6 py-3 bg-primary text-white font-medium rounded-lg hover:bg-primary-light transition shadow-md w-fit leading-none"
          >
            View Papers
          </Link>
        </div>
      </div>
    </section>
  )
}
