import { Link, useLocation } from 'react-router-dom'
import { FileText } from 'lucide-react'

export default function Navbar() {
  const location = useLocation()
  const isHome = location.pathname === '/'
  const isPapers = location.pathname.startsWith('/papers')

  return (
    <header className="bg-primary text-white shadow-md sticky top-0 z-50">
      <nav className="max-w-6xl mx-auto px-4 sm:px-6 flex items-center justify-between h-14 sm:h-16">
        <Link to="/" className="flex items-center gap-2 shrink-0">
          <span className="font-bold text-lg">
            <span className="text-pink-400">Pass</span>
            <span className="text-white">Vitian</span>
          </span>
        </Link>
        <div className="flex items-center gap-1 sm:gap-2">
          <Link
            to="/"
            className={`px-3 py-2 rounded-md text-sm font-medium transition ${isHome ? 'bg-white/15 text-white' : 'text-white/90 hover:bg-white/10'}`}
          >
            Home
          </Link>
          <Link
            to="/papers"
            className={`flex items-center gap-1.5 px-3 py-2 rounded-md text-sm font-medium transition ${isPapers ? 'bg-white/15 text-white' : 'text-white/90 hover:bg-white/10'}`}
          >
            <FileText className="w-4 h-4" />
            Papers
          </Link>
        </div>
      </nav>
    </header>
  )
}
