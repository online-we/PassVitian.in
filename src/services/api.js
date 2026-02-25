/**
 * Fetch papers list from Netlify function (calls Cloudinary Admin API server-side).
 */
const API_BASE = import.meta.env.DEV
  ? ''
  : (import.meta.env.VITE_SITE_URL || '')

export async function fetchPapers() {
  const res = await fetch(`${API_BASE}/.netlify/functions/list-papers`)
  if (!res.ok) throw new Error('Failed to load papers')
  return res.json()
}
