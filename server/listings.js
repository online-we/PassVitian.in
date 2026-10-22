import { listR2Bicycles, listR2Papers } from './r2.js'

function cloudinaryAuth(env) {
  return {
    cloudName: env.CLOUDINARY_CLOUD_NAME,
    apiKey: env.CLOUDINARY_API_KEY,
    apiSecret: env.CLOUDINARY_API_SECRET,
  }
}

function missingCloudinary(env) {
  const { cloudName, apiKey, apiSecret } = cloudinaryAuth(env)
  return [
    !cloudName && 'CLOUDINARY_CLOUD_NAME',
    !apiKey && 'CLOUDINARY_API_KEY',
    !apiSecret && 'CLOUDINARY_API_SECRET',
  ].filter(Boolean)
}

function readContext(context) {
  if (!context || typeof context !== 'object') return {}
  const custom = context.custom || context
  const get = (key) => {
    const value = custom[key]
    if (typeof value !== 'string') return value || ''
    try {
      return decodeURIComponent(value)
    } catch {
      return value
    }
  }
  return {
    subjectCode: get('subjectCode'),
    subjectName: get('subjectName'),
    paperType: get('paperType'),
    paperName: get('paperName'),
    listingType: get('listingType'),
    price: get('price'),
    usageDuration: get('usageDuration'),
    contact: get('contact'),
  }
}

async function listCloudinary(env, resourceType, prefix) {
  const { cloudName, apiKey, apiSecret } = cloudinaryAuth(env)
  let url = `https://api.cloudinary.com/v1_1/${cloudName}/resources/${resourceType}/upload?max_results=500&context=true`
  if (prefix) url += `&prefix=${encodeURIComponent(prefix)}`
  const auth = Buffer.from(`${apiKey}:${apiSecret}`).toString('base64')
  const res = await fetch(url, { headers: { Authorization: `Basic ${auth}` } })
  if (!res.ok) throw new Error(`Cloudinary API error: ${res.status}`)
  const data = await res.json()
  return data.resources || []
}

async function cloudinaryPapers(env) {
  const [images, raws] = await Promise.all([
    listCloudinary(env, 'image'),
    listCloudinary(env, 'raw'),
  ])
  return [...images, ...raws]
    .map((resource) => ({
      id: resource.public_id,
      secure_url: resource.secure_url,
      format: resource.format,
      resource_type: resource.resource_type,
      ...readContext(resource.context || {}),
    }))
    .filter((paper) => paper.subjectCode && paper.paperName)
}

async function cloudinaryBicycles(env) {
  const images = await listCloudinary(env, 'image', 'bicycles')
  return images
    .map((resource) => ({
      id: resource.public_id,
      secure_url: resource.secure_url,
      format: resource.format,
      created_at: resource.created_at,
      ...readContext(resource.context || {}),
    }))
    .filter((bike) => bike.listingType === 'bicycle' && bike.price && bike.contact && bike.usageDuration)
}

async function addedPapers(env) {
  try {
    return await listR2Papers(env)
  } catch (err) {
    console.error('Cloudflare paper list skipped:', err.message)
    return []
  }
}

async function addedBicycles(env) {
  try {
    return await listR2Bicycles(env)
  } catch (err) {
    console.error('Cloudflare bicycle list skipped:', err.message)
    return []
  }
}

export async function listPapers(env) {
  const missing = missingCloudinary(env)
  if (missing.length) {
    const error = new Error('Cloudinary env not configured')
    error.missing = missing
    throw error
  }
  const [existing, fresh] = await Promise.all([
    cloudinaryPapers(env),
    addedPapers(env),
  ])
  return [...existing, ...fresh]
}

export async function listBicycles(env) {
  const missing = missingCloudinary(env)
  if (missing.length) {
    const error = new Error('Cloudinary env not configured')
    error.missing = missing
    throw error
  }
  const [existing, fresh] = await Promise.all([
    cloudinaryBicycles(env),
    addedBicycles(env),
  ])
  return [...existing, ...fresh].sort(
    (a, b) => new Date(b.created_at || 0) - new Date(a.created_at || 0)
  )
}
