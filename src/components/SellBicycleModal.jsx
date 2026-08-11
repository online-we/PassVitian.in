import { useState, useRef, useEffect } from 'react'
import { X, Upload, Loader2 } from 'lucide-react'
import { uploadBicycle } from '../services/cloudinary'

function isValidContact(value) {
  const v = value.trim()
  const emailOk = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v)
  const phoneOk = /^[+\d][\d\s\-()]{7,}$/.test(v)
  return emailOk || phoneOk
}

export default function SellBicycleModal({ open, onClose, onListed }) {
  const [price, setPrice] = useState('')
  const [usageDuration, setUsageDuration] = useState('')
  const [contact, setContact] = useState('')
  const [file, setFile] = useState(null)
  const [preview, setPreview] = useState('')
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState('')
  const fileInputRef = useRef(null)

  useEffect(() => {
    if (!open) return
    setPrice('')
    setUsageDuration('')
    setContact('')
    setFile(null)
    setPreview('')
    setError('')
    if (fileInputRef.current) fileInputRef.current.value = ''
  }, [open])

  useEffect(() => {
    if (!file) {
      setPreview('')
      return
    }
    const url = URL.createObjectURL(file)
    setPreview(url)
    return () => URL.revokeObjectURL(url)
  }, [file])

  const handleClose = () => {
    if (!uploading) onClose()
  }

  const handleFileChange = (e) => {
    const f = e.target.files?.[0]
    if (!f) return
    if (!f.type.startsWith('image/')) {
      setError('Please choose an image file (any image format).')
      setFile(null)
      return
    }
    setError('')
    setFile(f)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!file) {
      setError('Bicycle image is required.')
      return
    }
    if (!price.trim()) {
      setError('Selling price is required.')
      return
    }
    if (Number.isNaN(Number(price)) || Number(price) <= 0) {
      setError('Enter a valid selling price.')
      return
    }
    if (!usageDuration.trim()) {
      setError('Usage duration is required.')
      return
    }
    if (!contact.trim()) {
      setError('Contact number or email is required.')
      return
    }
    if (!isValidContact(contact)) {
      setError('Enter a valid phone number or email address.')
      return
    }

    setUploading(true)
    setError('')
    try {
      await uploadBicycle(file, {
        price: price.trim(),
        usageDuration: usageDuration.trim(),
        contact: contact.trim(),
      })
      onListed?.()
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
      aria-labelledby="sell-bicycle-title"
    >
      <div
        className="bg-white rounded-xl shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between p-4 border-b border-gray-200">
          <h2 id="sell-bicycle-title" className="text-lg font-semibold text-gray-900">
            Sell your Bicycle
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

        <form onSubmit={handleSubmit} className="p-4 space-y-4" noValidate>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Bicycle Image <span className="text-red-500">*</span>
            </label>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              required
              onChange={handleFileChange}
              className="w-full text-sm text-gray-600 file:mr-3 file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-primary file:text-white file:font-medium"
            />
            {preview && (
              <img
                src={preview}
                alt="Bicycle preview"
                className="mt-3 w-full h-40 object-cover rounded-lg border border-gray-200"
              />
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Selling Price (₹) <span className="text-red-500">*</span>
            </label>
            <input
              type="number"
              min="1"
              step="1"
              required
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              placeholder="e.g. 2500"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              How long have you used it? <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              required
              value={usageDuration}
              onChange={(e) => setUsageDuration(e.target.value)}
              placeholder="e.g. 8 months"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Contact Number or Email <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              required
              value={contact}
              onChange={(e) => setContact(e.target.value)}
              placeholder="Phone or email"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary"
            />
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
              List Bicycle
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
