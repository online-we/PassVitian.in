import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'

function cloudinaryAuth(env) {
  const CLOUD_NAME = env.CLOUDINARY_CLOUD_NAME
  const API_KEY = env.CLOUDINARY_API_KEY
  const API_SECRET = env.CLOUDINARY_API_SECRET
  return { CLOUD_NAME, API_KEY, API_SECRET }
}

function missingEnv(env) {
  const { CLOUD_NAME, API_KEY, API_SECRET } = cloudinaryAuth(env)
  return [
    !CLOUD_NAME && 'CLOUDINARY_CLOUD_NAME',
    !API_KEY && 'CLOUDINARY_API_KEY',
    !API_SECRET && 'CLOUDINARY_API_SECRET',
  ].filter(Boolean)
}

function parsePaperContext(context) {
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

function parseBicycleContext(context) {
  if (!context || typeof context !== 'object') return {}
  const custom = context.custom || context
  const get = (key) => {
    const v = custom[key]
    if (typeof v !== 'string') return v || ''
    try { return decodeURIComponent(v) } catch { return v }
  }
  return {
    listingType: get('listingType'),
    price: get('price'),
    usageDuration: get('usageDuration'),
    contact: get('contact'),
  }
}

async function listCloudinary(env, resourceType, prefix) {
  const { CLOUD_NAME, API_KEY, API_SECRET } = cloudinaryAuth(env)
  let url = `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/resources/${resourceType}/upload?max_results=500&context=true`
  if (prefix) url += `&prefix=${encodeURIComponent(prefix)}`
  const auth = Buffer.from(`${API_KEY}:${API_SECRET}`).toString('base64')
  const apiRes = await fetch(url, { headers: { Authorization: `Basic ${auth}` } })
  if (!apiRes.ok) throw new Error(`Cloudinary API error: ${apiRes.status}`)
  const data = await apiRes.json()
  return data.resources || []
}

function listPapersDevPlugin(env) {
  return {
    name: 'list-papers-dev-api',
    configureServer(server) {
      server.middlewares.use('/api/list-papers', async (req, res) => {
        res.setHeader('Content-Type', 'application/json')
        const missing = missingEnv(env)
        if (missing.length) {
          res.statusCode = 500
          res.end(JSON.stringify({ error: 'Cloudinary env not configured', missing }))
          return
        }

        try {
          const [images, raws] = await Promise.all([
            listCloudinary(env, 'image'),
            listCloudinary(env, 'raw'),
          ])
          const papers = [...images, ...raws]
            .map((r) => ({
              id: r.public_id,
              secure_url: r.secure_url,
              format: r.format,
              resource_type: r.resource_type,
              ...parsePaperContext(r.context || {}),
            }))
            .filter((p) => p.subjectCode && p.paperName)
          res.end(JSON.stringify({ papers }))
        } catch (err) {
          res.statusCode = 500
          res.end(JSON.stringify({ error: err.message || 'Server error' }))
        }
      })

      server.middlewares.use('/api/list-bicycles', async (req, res) => {
        res.setHeader('Content-Type', 'application/json')
        const missing = missingEnv(env)
        if (missing.length) {
          res.statusCode = 500
          res.end(JSON.stringify({ error: 'Cloudinary env not configured', missing }))
          return
        }

        try {
          const images = await listCloudinary(env, 'image', 'bicycles')
          const bicycles = images
            .map((r) => ({
              id: r.public_id,
              secure_url: r.secure_url,
              format: r.format,
              created_at: r.created_at,
              ...parseBicycleContext(r.context || {}),
            }))
            .filter((b) => b.listingType === 'bicycle' && b.price && b.contact && b.usageDuration)
            .sort((a, b) => new Date(b.created_at || 0) - new Date(a.created_at || 0))
          res.end(JSON.stringify({ bicycles }))
        } catch (err) {
          res.statusCode = 500
          res.end(JSON.stringify({ error: err.message || 'Server error' }))
        }
      })
    },
  }
}

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')
  return {
    plugins: [react(), listPapersDevPlugin(env)],
  }
})
