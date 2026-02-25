import { useState, useRef, useEffect } from 'react'
import { X, Upload, Loader2 } from 'lucide-react'
import { usePapers } from '../context/PapersContext'

const PAPER_TYPES = ['MTE', 'TEE']

export default function UploadModal({ open, onClose, prefill = {} }) {
  const { upload, refresh } = usePapers()
  const [subjectCode, setSubjectCode] = useState(prefill.subjectCode ?? '')
  const [subjectName, setSubjectName] = useState(prefill.subjectName ?? '')
  const [paperType, setPaperType] = useState(prefill.paperType ?? 'MTE')
  const [paperName, setPaperName] = useState(prefill.paperName ?? '')
  const [file, setFile] = useState(null)
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState('')
  const fileInputRef = useRef(null)

  useEffect(() => {
    if (open) {
      setSubjectCode(prefill.subjectCode ?? '')
      setSubjectName(prefill.subjectName ?? '')
      setPaperType(prefill.paperType ?? 'MTE')
      setPaperName(prefill.paperName ?? '')
      setFile(null)
      setError('')
    }
  }, [open, prefill.subjectCode, prefill.subjectName, prefill.paperType, prefill.paperName])

  const handleClose = () => {
    if (!uploading) {
      setFile(null)
      onClose()
    }
  }

  const handleFileChange = (e) => {
    const f = e.target.files?.[0]
    if (!f) return
    const ok = f.type === 'application/pdf' || f.type.startsWith('image/')
    if (!ok) {
      setError('Please choose a PDF or image file.')
      setFile(null)
      return
    }
    setError('')
    setFile(f)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!file) {
      setError('Please select a file.')
      return
    }
    if (!subjectCode.trim()) {
      setError('Subject code is required.')
      return
    }
    if (!subjectName.trim()) {
      setError('Subject name is required.')
      return
    }
    if (!paperName.trim()) {
      setError('Paper name is required (e.g. MTE-PAPER 1).')
      return
    }
    setUploading(true)
    setError('')
    try {
      await upload(file, {
        subjectCode: subjectCode.trim(),
        subjectName: subjectName.trim(),
        paperType,
        paperName: paperName.trim(),
      })
      await refresh()
      handleClose()
    } catch (err) {
      setError(err.message || 'Upload failed. Try again.')
    } finally {
      setUploading(false)
    }
  }

  if (!open) return null

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50"
      onClick={handleClose}
      onKeyDown={(e) => e.key === 'Escape' && handleClose()}
      role="dialog"
      aria-modal="true"
      aria-labelledby="upload-modal-title"
    >
      <div
        className="bg-white rounded-xl shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
        onFocus={() => {}}
      >
        <div className="flex items-center justify-between p-4 border-b border-gray-200">
          <h2 id="upload-modal-title" className="text-lg font-semibold text-gray-900">
            Upload Papers
          </h2>
          <button
            type="button"
            onClick={handleClose}
            disabled={uploading}
            className="p-2 rounded-lg text-gray-500 hover:bg-gray-100 hover:text-gray-700 disabled:opacity-50"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        <form onSubmit={handleSubmit} className="p-4 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Subject Code</label>
            <input
              type="text"
              value={subjectCode}
              onChange={(e) => setSubjectCode(e.target.value)}
              placeholder="e.g. PHY1002"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Subject Name</label>
            <input
              type="text"
              value={subjectName}
              onChange={(e) => setSubjectName(e.target.value)}
              placeholder="e.g. Engineering Physics"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Paper Type</label>
            <select
              value={paperType}
              onChange={(e) => setPaperType(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary"
            >
              {PAPER_TYPES.map((t) => (
                <option key={t} value={t}>{t}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Paper Name</label>
            <input
              type="text"
              value={paperName}
              onChange={(e) => setPaperName(e.target.value)}
              placeholder="e.g. MTE-PAPER 1"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">File (PDF or image)</label>
            <input
              ref={fileInputRef}
              type="file"
              accept=".pdf,image/*"
              onChange={handleFileChange}
              className="w-full text-sm text-gray-600 file:mr-3 file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-primary file:text-white file:font-medium"
            />
            {file && <p className="mt-1 text-sm text-gray-500">{file.name}</p>}
          </div>
          {error && <p className="text-sm text-red-600">{error}</p>}
          <div className="flex gap-2 pt-2">
            <button
              type="button"
              onClick={handleClose}
              disabled={uploading}
              className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={uploading}
              className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-light disabled:opacity-50 font-medium"
            >
              {uploading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Upload className="w-5 h-5" />}
              Done
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
