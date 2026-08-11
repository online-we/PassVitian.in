/**
 * Fetch papers list from serverless API (Cloudinary Admin API server-side).
 * Vercel: /api/list-papers
 */
export async function fetchPapers() {
  const res = await fetch('/api/list-papers')
  if (!res.ok) throw new Error('Failed to load papers')
  return res.json()
}

/**
 * Fetch bicycle listings from serverless API.
 * Vercel: /api/list-bicycles
 */
export async function fetchBicycles() {
  const res = await fetch('/api/list-bicycles')
  if (!res.ok) throw new Error('Failed to load bicycle listings')
  return res.json()
}
