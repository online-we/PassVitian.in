import { Link, useLocation } from 'react-router-dom'
import { X, ClipboardList, Bike } from 'lucide-react'

const PAPER_NAV = [
  { label: 'All Papers', to: '/papers', type: null },
  { label: 'CAT 1 papers', to: '/papers?type=CAT%201', type: 'CAT 1' },
  { label: 'CAT 2 papers', to: '/papers?type=CAT%202', type: 'CAT 2' },
  { label: 'Mid-term Papers (MTE)', to: '/papers?type=MTE', type: 'MTE' },
  { label: 'Term-end Papers (TEE)', to: '/papers?type=TEE', type: 'TEE' },
]

export default function Sidebar({ isOpen, toggleSidebar }) {
  const location = useLocation()
  const currentType = new URLSearchParams(location.search).get('type')
  const onPapers = location.pathname.startsWith('/papers')

  const isPaperLinkActive = (type) => {
    if (!onPapers) return false
    if (!type) return !currentType
    return currentType === type
  }

  return (
    <>
      <div
        className={`fixed inset-0 bg-black/60 backdrop-blur-sm z-50 transition-opacity duration-300 ${
          isOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`}
        onClick={toggleSidebar}
        aria-hidden="true"
      />

      <aside
        className={`fixed top-0 left-0 bottom-0 w-72 bg-[#001845] text-white z-50 shadow-2xl transform transition-transform duration-300 ease-in-out flex flex-col ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="flex items-center justify-between h-16 px-5 border-b border-white/10">
          <Link to="/" onClick={toggleSidebar} className="flex items-center gap-2">
            <span className="font-bold text-xl tracking-tight">
              <span className="text-pink-400">Pass</span>
              <span className="text-white">Vitian</span>
            </span>
          </Link>
          <button
            onClick={toggleSidebar}
            className="p-1.5 rounded-lg text-white/70 hover:text-white hover:bg-white/10 transition focus:outline-none"
            aria-label="Close menu"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-3 py-4 space-y-6">
          <div className="space-y-1">
            {PAPER_NAV.map((item) => {
              const active = isPaperLinkActive(item.type)
              return (
                <Link
                  key={item.label}
                  to={item.to}
                  onClick={toggleSidebar}
                  className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition ${
                    active
                      ? 'bg-pink-500/20 text-pink-300 font-semibold'
                      : 'text-white/80 hover:text-white hover:bg-white/10'
                  }`}
                >
                  <ClipboardList className="w-4 h-4 text-emerald-400" />
                  {item.label}
                </Link>
              )
            })}
            <Link
              to="/bicycle"
              onClick={toggleSidebar}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition ${
                location.pathname.startsWith('/bicycle')
                  ? 'bg-pink-500/20 text-pink-300 font-semibold'
                  : 'text-white/80 hover:text-white hover:bg-white/10'
              }`}
            >
              <Bike className="w-4 h-4 text-lime-400" />
              Bicycle
            </Link>
          </div>
        </div>

        <div className="p-4 border-t border-white/10 bg-black/20 text-xs text-white/50 text-center">
          <p>© 2026 PassVitian</p>
          <p className="text-[11px] mt-0.5 text-white/30">VIT Bhopal Past Papers</p>
        </div>
      </aside>
    </>
  )
}
