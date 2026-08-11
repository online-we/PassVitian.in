import { Link } from 'react-router-dom'
import { FileText, Home } from 'lucide-react'

export default function Footer() {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="mt-auto border-t border-gray-200 bg-gray-50/80">
      <div className="w-full px-4 sm:px-6 lg:px-10 xl:px-12 2xl:px-16 py-8">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <Link
            to="/"
            className="flex items-center gap-2 text-gray-700 hover:text-primary transition-colors"
          >
            <span className="font-semibold">
              <span className="text-pink-500">Pass</span>
              <span className="text-primary">Vitian</span>
            </span>
          </Link>
          <nav className="flex items-center gap-6 text-sm text-gray-600">
            <Link
              to="/"
              className="flex items-center gap-1.5 hover:text-primary transition-colors"
            >
              <Home className="w-4 h-4" />
              Home
            </Link>
            <Link
              to="/papers"
              className="flex items-center gap-1.5 hover:text-primary transition-colors"
            >
              <FileText className="w-4 h-4" />
              Papers
            </Link>
          </nav>
        </div>
        <div className="mt-6 pt-6 border-t border-gray-200 text-center sm:text-left space-y-2">
          <p className="text-sm text-gray-500">
            © {currentYear} PassVitian. Past papers for VIT Bhopal.
          </p>
          <p className="text-sm text-gray-500">
            Contact here:{' '}
            <a
              href="mailto:firojhere7s@gmail.com"
              className="text-primary hover:underline"
            >
              firojhere7s@gmail.com
            </a>
          </p>
        </div>
      </div>
    </footer>
  )
}
