/**
 * New uploads go to Cloudflare R2 through /api/sign-upload.
 * Existing Cloudinary files stay where they are and are still listed by the API.
 */

async function uploadToR2(file, kind, metadata) {
  const signRes = await fetch('/api/sign-upload', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      kind,
      contentType: file.type,
      size: file.size,
      metadata,
    }),
  })
  const signed = await signRes.json().catch(() => ({}))
  if (!signRes.ok) {
    throw new Error(signed.error || 'Could not start upload')
  }

  const putRes = await fetch(signed.uploadUrl, {
    method: 'PUT',
    headers: { 'Content-Type': signed.contentType || file.type },
    body: file,
  })
  if (!putRes.ok) {
    throw new Error('Upload to storage failed. Please try again.')
  }
  return { secure_url: signed.publicUrl }
}

export async function uploadFile(file, metadata) {
  return uploadToR2(file, 'paper', metadata)
}

export async function uploadBicycle(file, metadata) {
  return uploadToR2(file, 'bicycle', metadata)
}
