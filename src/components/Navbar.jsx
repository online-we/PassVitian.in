import { Link, useLocation } from 'react-router-dom'
import { FileText, Menu } from 'lucide-react'

export default function Navbar({ toggleSidebar }) {
  const location = useLocation()
  const isPapers = location.pathname.startsWith('/papers')

  return (
    <header className="bg-primary text-white shadow-md sticky top-0 z-40">
      <nav className="w-full pl-2 pr-4 sm:pl-3 sm:pr-6 lg:pl-4 lg:pr-10 xl:pr-12 2xl:pr-16 flex items-center justify-between h-14 sm:h-16">
        <div className="flex items-center gap-2 sm:gap-3">
          <button
            onClick={toggleSidebar}
            className="p-1 rounded-lg text-white/90 hover:text-white hover:bg-white/10 transition focus:outline-none flex items-center justify-center -ml-0.5"
            aria-label="Open sidebar menu"
            title="Open menu"
          >
            <Menu className="w-6 h-6" />
          </button>
          <Link to="/" className="flex items-center gap-2 shrink-0">
            <span className="font-bold text-xl tracking-tight">
              <span className="text-pink-400">Pass</span>
              <span className="text-white">Vitian</span>
            </span>
          </Link>
        </div>
        <div className="flex items-center gap-1 sm:gap-2">
          <Link
            to="/papers"
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-sm font-medium transition ${
              isPapers ? 'bg-white/15 text-white' : 'text-white/90 hover:bg-white/10'
            }`}
          >
            <FileText className="w-4 h-4" />
            Papers
          </Link>
        </div>
      </nav>
    </header>
  )
}
