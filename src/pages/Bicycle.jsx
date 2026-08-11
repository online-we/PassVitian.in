import { useCallback, useEffect, useState } from 'react'
import { Bike, ShoppingBag, Tag, Phone, Clock, IndianRupee, ArrowLeft } from 'lucide-react'
import PageContainer from '../components/PageContainer'
import SellBicycleModal from '../components/SellBicycleModal'
import { fetchBicycles } from '../services/api'

export default function Bicycle() {
  const [mode, setMode] = useState(null) // null | 'buy' | 'sell'
  const [sellOpen, setSellOpen] = useState(false)
  const [bicycles, setBicycles] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const loadListings = useCallback(async () => {
    setLoading(true)
    setError('')
    try {
      const data = await fetchBicycles()
      setBicycles(data.bicycles || [])
    } catch (e) {
      setError(e.message || 'Failed to load listings')
      setBicycles([])
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    if (mode === 'buy') loadListings()
  }, [mode, loadListings])

  useEffect(() => {
    if (mode === 'sell') setSellOpen(true)
  }, [mode])

  const handleSellClose = () => {
    setSellOpen(false)
    if (mode === 'sell') setMode(null)
  }

  const handleListed = async () => {
    setSellOpen(false)
    setMode('buy')
    await loadListings()
  }

  return (
    <div className="w-full py-8 sm:py-10">
      <PageContainer>
        {!mode && (
          <div className="max-w-3xl mx-auto">
            <div className="text-center mb-8">
              <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-primary/10 text-primary mb-4">
                <Bike className="w-7 h-7" />
              </div>
              <h1 className="text-3xl sm:text-4xl font-bold text-gray-900">Bicycle Marketplace</h1>
              <p className="mt-3 text-gray-600">
                list yours or find a deal.
              </p>
            </div>

            <div className="grid sm:grid-cols-2 gap-4 sm:gap-6">
              <div className="p-6 sm:p-8 rounded-2xl border border-gray-200 bg-white shadow-sm">
                <div className="inline-flex items-center justify-center w-11 h-11 rounded-xl bg-emerald-50 text-emerald-600 mb-4">
                  <ShoppingBag className="w-5 h-5" />
                </div>
                <p className="text-sm text-gray-600">
                  Browse bicycles listed by other students and contact sellers directly.
                </p>
                <button
                  type="button"
                  onClick={() => setMode('buy')}
                  className="mt-5 inline-flex items-center justify-center px-5 h-10 bg-black text-white text-sm font-medium rounded-lg hover:bg-slate-800 transition"
                >
                  Buy
                </button>
              </div>

              <div className="p-6 sm:p-8 rounded-2xl border border-gray-200 bg-white shadow-sm">
                <div className="inline-flex items-center justify-center w-11 h-11 rounded-xl bg-amber-50 text-amber-600 mb-4">
                  <Tag className="w-5 h-5" />
                </div>
                <p className="text-sm text-gray-600">
                  Upload a photo, set your price, usage duration, and contact details.
                </p>
                <button
                  type="button"
                  onClick={() => setMode('sell')}
                  className="mt-5 inline-flex items-center justify-center px-5 h-10 bg-black text-white text-sm font-medium rounded-lg hover:bg-slate-800 transition"
                >
                  Sell
                </button>
              </div>
            </div>
          </div>
        )}

        {mode === 'buy' && (
          <div>
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
              <div>
                <button
                  type="button"
                  onClick={() => setMode(null)}
                  className="inline-flex items-center gap-2 text-primary font-medium hover:underline mb-2"
                >
                  <ArrowLeft className="w-4 h-4" />
                  Back
                </button>
                <h1 className="text-2xl font-bold text-gray-900">Bicycles for Sale</h1>
                <p className="text-sm text-gray-600 mt-1">Contact sellers via phone or email from each listing.</p>
              </div>
              <button
                type="button"
                onClick={() => setSellOpen(true)}
                className="inline-flex items-center justify-center gap-2 px-4 py-2 bg-primary text-white rounded-lg font-medium hover:bg-primary-light transition shrink-0"
              >
                <Tag className="w-4 h-4" />
                Sell your Bicycle
              </button>
            </div>

            {error && (
              <div className="mb-4 p-4 bg-red-50 text-red-700 rounded-lg text-sm">{error}</div>
            )}

            {loading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="h-72 bg-gray-100 rounded-xl animate-pulse" />
                ))}
              </div>
            ) : bicycles.length === 0 ? (
              <div className="text-center py-16 text-gray-500 border border-dashed border-gray-200 rounded-2xl">
                <Bike className="w-12 h-12 mx-auto mb-3 opacity-40" />
                <p className="font-medium text-gray-700">No bicycles listed yet</p>
                <p className="text-sm mt-1">Be the first to sell yours.</p>
                <button
                  type="button"
                  onClick={() => setSellOpen(true)}
                  className="mt-4 inline-flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg text-sm font-medium hover:bg-primary-light transition"
                >
                  Sell your Bicycle
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {bicycles.map((bike) => (
                  <article
                    key={bike.id}
                    className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm"
                  >
                    <div className="aspect-[4/3] bg-gray-100">
                      <img
                        src={bike.secure_url}
                        alt="Bicycle for sale"
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="p-4 space-y-2">
                      <p className="flex items-center gap-1.5 text-lg font-bold text-gray-900">
                        <IndianRupee className="w-4 h-4" />
                        {Number(bike.price).toLocaleString('en-IN')}
                      </p>
                      <p className="flex items-center gap-2 text-sm text-gray-600">
                        <Clock className="w-4 h-4 shrink-0" />
                        Used: {bike.usageDuration}
                      </p>
                      <a
                        href={bike.contact.includes('@') ? `mailto:${bike.contact}` : `tel:${bike.contact.replace(/\s/g, '')}`}
                        className="flex items-center gap-2 text-sm text-primary font-medium hover:underline break-all"
                      >
                        <Phone className="w-4 h-4 shrink-0" />
                        {bike.contact}
                      </a>
                    </div>
                  </article>
                ))}
              </div>
            )}
          </div>
        )}

        <SellBicycleModal
          open={sellOpen}
          onClose={handleSellClose}
          onListed={handleListed}
        />
      </PageContainer>
    </div>
  )
}
