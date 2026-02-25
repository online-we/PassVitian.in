import { createContext, useContext, useCallback, useState, useEffect } from 'react'
import { fetchPapers } from '../services/api'
import { uploadFile } from '../services/cloudinary'

const PapersContext = createContext(null)

export function usePapers() {
  const ctx = useContext(PapersContext)
  if (!ctx) throw new Error('usePapers must be used within PapersProvider')
  return ctx
}

export function PapersProvider({ children }) {
  const [papers, setPapers] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const load = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const data = await fetchPapers()
      setPapers(data.papers || [])
    } catch (e) {
      setError(e.message)
      setPapers([])
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    load()
  }, [load])

  const upload = useCallback(async (file, metadata) => {
    const result = await uploadFile(file, metadata)
    await load()
    return result
  }, [load])

  const value = {
    papers,
    loading,
    error,
    refresh: load,
    upload,
  }

  return (
    <PapersContext.Provider value={value}>
      {children}
    </PapersContext.Provider>
  )
}
