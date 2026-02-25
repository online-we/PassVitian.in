/**
 * Netlify serverless function: list all papers from Cloudinary.
 * Keeps API secret server-side. Set env: CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, CLOUDINARY_API_SECRET
 */

const CLOUD_NAME = process.env.CLOUDINARY_CLOUD_NAME
const API_KEY = process.env.CLOUDINARY_API_KEY
const API_SECRET = process.env.CLOUDINARY_API_SECRET

function parseContext(context) {
  if (!context || typeof context !== 'object') return {}
  const custom = context.custom || context
  const get = (key) => {
    const v = custom[key]
    if (typeof v !== 'string') return v || ''
    try { return decodeURIComponent(v) } catch { return v }
  }
  return {
    subjectCode: get('subjectCode'),
    subjectName: get('subjectName'),
    paperType: get('paperType'),
    paperName: get('paperName'),
  }
}

async function listResources(resourceType) {
  const url = `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/resources/${resourceType}/upload?max_results=500&context=true`
  const auth = Buffer.from(`${API_KEY}:${API_SECRET}`).toString('base64')
  const res = await fetch(url, {
    headers: { Authorization: `Basic ${auth}` },
  })
  if (!res.ok) throw new Error(`Cloudinary API error: ${res.status}`)
  const data = await res.json()
  return (data.resources || []).map((r) => ({
    id: r.public_id,
    secure_url: r.secure_url,
    format: r.format,
    resource_type: resourceType,
    ...parseContext(r.context || {}),
  }))
}

export async function handler() {
  if (!CLOUD_NAME || !API_KEY || !API_SECRET) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Cloudinary env not configured' }),
      headers: { 'Content-Type': 'application/json' },
    }
  }
  try {
    const [images, raws] = await Promise.all([
      listResources('image'),
      listResources('raw'),
    ])
    const papers = [...images, ...raws].filter(
      (p) => p.subjectCode && p.paperName
    )
    return {
      statusCode: 200,
      body: JSON.stringify({ papers }),
      headers: {
        'Content-Type': 'application/json',
        'Cache-Control': 'public, max-age=60',
      },
    }
  } catch (err) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: err.message }),
      headers: { 'Content-Type': 'application/json' },
    }
  }
}
