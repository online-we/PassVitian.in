import { useState, useMemo } from 'react'
import { useParams, Link } from 'react-router-dom'
import { Upload, FileDown, ArrowLeft } from 'lucide-react'
import { usePapers } from '../context/PapersContext'
import UploadModal from '../components/UploadModal'

export default function SubjectPapers() {
  const { subjectCode } = useParams()
  const { papers, loading, error } = usePapers()
  const [uploadOpen, setUploadOpen] = useState(false)

  const subjectPapers = useMemo(() => {
    const code = subjectCode?.toUpperCase().trim()
    if (!code) return []
    return papers.filter(
      (p) => p.subjectCode?.toUpperCase().trim() === code
    )
  }, [papers, subjectCode])

  const subjectName = useMemo(() => {
    return subjectPapers[0]?.subjectName || ''
  }, [subjectPapers])

  const prefill = useMemo(
    () => ({
      subjectCode: subjectCode?.trim() ?? '',
      subjectName: subjectPapers[0]?.subjectName ?? '',
      paperType: 'MTE',
      paperName: '',
    }),
    [subjectCode, subjectPapers]
  )

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-6 sm:py-8">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <div>
          <Link
            to="/papers"
            className="inline-flex items-center gap-2 text-primary font-medium hover:underline mb-2"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to subjects
          </Link>
          <h1 className="text-xl font-bold text-gray-900">
            {subjectCode}
            {subjectName ? ` – ${subjectName}` : ''}
          </h1>
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
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
            <div key={i} className="h-36 bg-gray-100 rounded-xl animate-pulse" />
          ))}
        </div>
      ) : (
        <>
          {subjectPapers.length === 0 ? (
            <div className="text-center py-12 text-gray-500">
              <p>No papers for this subject yet. Upload the first one.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {subjectPapers.map((p) => {
                const suggestedName = (p.paperName || 'paper').replace(/[^a-zA-Z0-9._-]/g, '_') + ((p.secure_url || '').toLowerCase().endsWith('.pdf') ? '.pdf' : '')
                return (
                  <div
                    key={p.id}
                    className="bg-white border border-teal-200 rounded-xl p-5 shadow-sm hover:shadow-md transition text-center"
                  >
                    <p className="font-bold text-gray-900">{p.paperName || 'Paper'}</p>
                    <p className="text-sm text-gray-600 mt-1">{p.subjectName}</p>
                    <a
                      href={p.secure_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      download={suggestedName || undefined}
                      className="mt-4 inline-flex items-center justify-center gap-2 w-full px-4 py-2 bg-teal-600 text-white text-sm font-medium rounded-lg hover:bg-teal-700 transition"
                    >
                      <FileDown className="w-4 h-4" />
                      GET PDF
                    </a>
                  </div>
                )
              })}
            </div>
          )}
        </>
      )}

      <UploadModal
        open={uploadOpen}
        onClose={() => setUploadOpen(false)}
        prefill={prefill}
      />
    </div>
  )
}
