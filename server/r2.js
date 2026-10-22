import { ListObjectsV2Command, PutObjectCommand, S3Client } from '@aws-sdk/client-s3'
import { getSignedUrl } from '@aws-sdk/s3-request-presigner'
import { randomUUID } from 'node:crypto'

const PAPER_MAX_BYTES = 20 * 1024 * 1024
const IMAGE_MAX_BYTES = 10 * 1024 * 1024

const IMAGE_TYPES = {
  'image/jpeg': 'jpg',
  'image/jpg': 'jpg',
  'image/png': 'png',
  'image/webp': 'webp',
  'image/gif': 'gif',
  'image/heic': 'heic',
  'image/heif': 'heif',
}

export function r2Config(env) {
  const accountId = (env.R2_ACCOUNT_ID || '').trim()
  const accessKeyId = (env.R2_ACCESS_KEY_ID || '').trim()
  const secretAccessKey = (env.R2_SECRET_ACCESS_KEY || '').trim()
  const bucket = (env.R2_BUCKET || '').trim()
  const publicBaseUrl = (env.R2_PUBLIC_BASE_URL || '').trim().replace(/\/$/, '')
  const missing = [
    !accountId && 'R2_ACCOUNT_ID',
    !accessKeyId && 'R2_ACCESS_KEY_ID',
    !secretAccessKey && 'R2_SECRET_ACCESS_KEY',
    !bucket && 'R2_BUCKET',
    !publicBaseUrl && 'R2_PUBLIC_BASE_URL',
  ].filter(Boolean)
  return { accountId, accessKeyId, secretAccessKey, bucket, publicBaseUrl, missing }
}

export function isR2Configured(env) {
  return r2Config(env).missing.length === 0
}

function clientFor(cfg) {
  return new S3Client({
    region: 'auto',
    endpoint: `https://${cfg.accountId}.r2.cloudflarestorage.com`,
    credentials: {
      accessKeyId: cfg.accessKeyId,
      secretAccessKey: cfg.secretAccessKey,
    },
    requestChecksumCalculation: 'WHEN_REQUIRED',
    responseChecksumValidation: 'WHEN_REQUIRED',
  })
}

function encodeMeta(meta) {
  return Buffer.from(JSON.stringify(meta), 'utf8').toString('base64url')
}

function decodeMeta(value) {
  try {
    const json = Buffer.from(value, 'base64url').toString('utf8')
    const data = JSON.parse(json)
    if (!data || typeof data !== 'object') return null
    return data
  } catch {
    return null
  }
}

function clip(value, max) {
  return String(value || '').trim().slice(0, max)
}

function publicUrl(cfg, key) {
  return `${cfg.publicBaseUrl}/${key}`
}

async function listKeys(env, prefix) {
  const cfg = r2Config(env)
  if (cfg.missing.length) return []
  const client = clientFor(cfg)
  const keys = []
  let token
  do {
    const out = await client.send(new ListObjectsV2Command({
      Bucket: cfg.bucket,
      Prefix: prefix,
      ContinuationToken: token,
    }))
    for (const item of out.Contents || []) {
      if (item.Key) keys.push(item.Key)
    }
    token = out.IsTruncated ? out.NextContinuationToken : undefined
  } while (token)
  return keys
}

export async function listR2Papers(env) {
  if (!isR2Configured(env)) return []
  const cfg = r2Config(env)
  const keys = await listKeys(env, 'papers/v1/')
  return keys.map((key) => parsePaperKey(key, cfg.publicBaseUrl)).filter(Boolean)
}

export async function listR2Bicycles(env) {
  if (!isR2Configured(env)) return []
  const cfg = r2Config(env)
  const keys = await listKeys(env, 'bicycles/v1/')
  return keys.map((key) => parseBicycleKey(key, cfg.publicBaseUrl)).filter(Boolean)
}

export function parsePaperKey(key, publicBaseUrl) {
  const parts = key.split('/')
  if (parts.length !== 4 || parts[0] !== 'papers' || parts[1] !== 'v1') return null
  const meta = decodeMeta(parts[2])
  if (!meta?.subjectCode || !meta?.paperName) return null
  const format = (parts[3].split('.').pop() || '').toLowerCase()
  return {
    id: `r2:${key}`,
    secure_url: `${publicBaseUrl.replace(/\/$/, '')}/${key}`,
    format,
    resource_type: format === 'pdf' ? 'raw' : 'image',
    subjectCode: meta.subjectCode,
    subjectName: meta.subjectName || '',
    paperType: meta.paperType || '',
    paperName: meta.paperName,
  }
}

export function parseBicycleKey(key, publicBaseUrl) {
  const parts = key.split('/')
  if (parts.length !== 4 || parts[0] !== 'bicycles' || parts[1] !== 'v1') return null
  const meta = decodeMeta(parts[2])
  if (!meta?.price || !meta?.contact || !meta?.usageDuration) return null
  const format = (parts[3].split('.').pop() || '').toLowerCase()
  return {
    id: `r2:${key}`,
    secure_url: `${publicBaseUrl.replace(/\/$/, '')}/${key}`,
    format,
    created_at: meta.createdAt || '',
    listingType: 'bicycle',
    price: meta.price,
    usageDuration: meta.usageDuration,
    contact: meta.contact,
  }
}

function assertUpload(file) {
  const contentType = String(file.contentType || '').toLowerCase()
  const size = Number(file.size)
  const isPdf = contentType === 'application/pdf'
  const extension = isPdf ? 'pdf' : IMAGE_TYPES[contentType]
  if (!extension) {
    throw new Error('Please choose a PDF or image file.')
  }
  if (!Number.isFinite(size) || size <= 0) {
    throw new Error('The selected file is empty.')
  }
  const max = isPdf ? PAPER_MAX_BYTES : IMAGE_MAX_BYTES
  if (size > max) {
    throw new Error(`File is too large. Maximum size is ${Math.round(max / (1024 * 1024))} MB.`)
  }
  return { contentType, size, extension }
}

export async function createSignedUpload(env, body) {
  const cfg = r2Config(env)
  if (cfg.missing.length) {
    const error = new Error('Cloudflare storage is not configured yet.')
    error.status = 503
    error.missing = cfg.missing
    throw error
  }

  const { contentType, size, extension } = assertUpload(body || {})
  const kind = body.kind
  const id = randomUUID()
  let key
  if (kind === 'paper') {
    const subjectCode = clip(body.metadata?.subjectCode, 40)
    const subjectName = clip(body.metadata?.subjectName, 160)
    const paperType = clip(body.metadata?.paperType, 20)
    const paperName = clip(body.metadata?.paperName, 40)
    if (!subjectCode || !subjectName || !paperType || !paperName) {
      throw new Error('Subject code, subject name, paper type, and exam date are required.')
    }
    const meta = encodeMeta({ subjectCode, subjectName, paperType, paperName })
    key = `papers/v1/${meta}/${id}.${extension}`
  } else if (kind === 'bicycle') {
    const price = clip(body.metadata?.price, 20)
    const usageDuration = clip(body.metadata?.usageDuration, 80)
    const contact = clip(body.metadata?.contact, 120)
    if (!price || !usageDuration || !contact) {
      throw new Error('Price, usage duration, and contact are required.')
    }
    const meta = encodeMeta({
      price,
      usageDuration,
      contact,
      createdAt: new Date().toISOString(),
    })
    key = `bicycles/v1/${meta}/${id}.${extension}`
  } else {
    throw new Error('Unknown upload type.')
  }

  const command = new PutObjectCommand({
    Bucket: cfg.bucket,
    Key: key,
    ContentType: contentType,
    ContentLength: size,
  })
  const uploadUrl = await getSignedUrl(clientFor(cfg), command, { expiresIn: 120 })
  return {
    uploadUrl,
    publicUrl: publicUrl(cfg, key),
    contentType,
  }
}
