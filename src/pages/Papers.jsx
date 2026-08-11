import { useState, useMemo } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { Search, FileText, Upload } from 'lucide-react'
import { usePapers } from '../context/PapersContext'
import UploadModal from '../components/UploadModal'
import PageContainer from '../components/PageContainer'

const TYPE_TITLES = {
  'CAT 1': 'CAT 1 Papers',
  'CAT 2': 'CAT 2 Papers',
  MTE: 'Mid-term Papers (MTE)',
  TEE: 'Term-end Papers (TEE)',
}

function matchesPaperType(paperType, filterType) {
  if (!filterType) return true
  return (paperType || '').trim().toLowerCase() === filterType.trim().toLowerCase()
}

function getSubjectsFromPapers(papers) {
  const map = new Map()
  for (let i = papers.length - 1; i >= 0; i -= 1) {
    const p = papers[i]
    if (!p.subjectCode || !p.subjectName) continue
    const key = p.subjectCode.toUpperCase().trim()
    if (!map.has(key)) {
      map.set(key, { subjectCode: key, subjectName: p.subjectName.trim() })
    }
  }
  return Array.from(map.values()).sort((a, b) => a.subjectCode.localeCompare(b.subjectCode))
}

export default function Papers() {
  const { papers, loading, error } = usePapers()
  const [searchParams] = useSearchParams()
  const paperTypeFilter = searchParams.get('type')?.trim() || ''
  const [search, setSearch] = useState('')
  const [uploadOpen, setUploadOpen] = useState(false)

  const typedPapers = useMemo(
    () => papers.filter((p) => matchesPaperType(p.paperType, paperTypeFilter)),
    [papers, paperTypeFilter]
  )

  const subjects = useMemo(() => getSubjectsFromPapers(typedPapers), [typedPapers])

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase()
    if (!q) return subjects
    return subjects.filter(
      (s) =>
        s.subjectCode.toLowerCase().includes(q) ||
        s.subjectName.toLowerCase().includes(q)
    )
  }, [subjects, search])

  const pageTitle = paperTypeFilter
    ? TYPE_TITLES[paperTypeFilter] || `${paperTypeFilter} Papers`
    : 'All Subjects'

  const subjectLink = (subjectCode) => {
    const base = `/papers/${encodeURIComponent(subjectCode)}`
    return paperTypeFilter
      ? `${base}?type=${encodeURIComponent(paperTypeFilter)}`
      : base
  }

  return (
    <PageContainer className="py-6 sm:py-8">
      <div className="mb-4">
        <h1 className="text-xl sm:text-2xl font-bold text-gray-900">{pageTitle}</h1>
        {paperTypeFilter && (
          <p className="text-sm text-gray-600 mt-1">
            Showing subjects that have {paperTypeFilter} papers uploaded.
          </p>
        )}
      </div>

      <div className="flex flex-col sm:flex-row gap-4 sm:items-center sm:justify-between mb-6">
        <div className="flex flex-1 gap-2 max-w-md">
          <input
            type="search"
            placeholder="Search courses..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary"
          />
          <button
            type="button"
            className="px-4 py-2 bg-primary text-white rounded-lg font-medium flex items-center gap-2 shrink-0"
            aria-label="Search"
          >
            <Search className="w-5 h-5" />
            Search
          </button>
        </div>
        <button
          type="button"
          onClick={() => setUploadOpen(true)}
          className="flex items-center justify-center gap-2 px-4 py-2 bg-primary text-white rounded-lg font-medium hover:bg-primary-light transition shrink-0"
        >
          <Upload className="w-5 h-5" />
          Upload Papers
        </button>
      </div>

      {error && (
        <div className="mb-4 p-4 bg-red-50 text-red-700 rounded-lg text-sm">
          {error}
        </div>
      )}
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-4">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="h-40 bg-gray-100 rounded-xl animate-pulse" />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-4">
          {filtered.length === 0 ? (
            <div className="col-span-full text-center py-12 text-gray-500">
              <FileText className="w-12 h-12 mx-auto mb-3 opacity-50" />
              <p>
                {paperTypeFilter
                  ? `No ${paperTypeFilter} papers yet. Upload one to get started.`
                  : 'No subjects yet. Upload the first paper to create a subject.'}
              </p>
            </div>
          ) : (
            filtered.map((s) => (
              <div
                key={s.subjectCode}
                className="bg-white border border-primary/20 rounded-xl p-5 shadow-sm text-center"
              >
                <p className="font-bold text-gray-900">{s.subjectCode}</p>
                <p className="text-sm text-gray-600 mt-1 line-clamp-2">{s.subjectName}</p>
                <Link
                  to={subjectLink(s.subjectCode)}
                  className="mt-4 inline-block px-5 py-2 bg-primary text-white text-sm font-medium rounded-full hover:bg-primary-light transition"
                >
                  papers
                </Link>
              </div>
            ))
          )}
        </div>
      )}

      <UploadModal
        open={uploadOpen}
        onClose={() => setUploadOpen(false)}
        prefill={paperTypeFilter ? { paperType: paperTypeFilter } : {}}
      />
    </PageContainer>
  )
}
