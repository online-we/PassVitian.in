/**
 * Cloudinary unsigned upload (no secret in frontend).
 * Requires VITE_CLOUDINARY_CLOUD_NAME and VITE_CLOUDINARY_UPLOAD_PRESET in .env
 * Optional: VITE_CLOUDINARY_UPLOAD_PRESET_RAW for PDFs if your preset is image-only
 */
const CLOUD_NAME = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME
const UPLOAD_PRESET_IMAGE = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET
const UPLOAD_PRESET_RAW = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET_RAW || import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET
const UPLOAD_URL_IMAGE = `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`
const UPLOAD_URL_RAW = `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/raw/upload`

export function getUploadUrl(isPdf) {
  return isPdf ? UPLOAD_URL_RAW : UPLOAD_URL_IMAGE
}

export async function uploadFile(file, metadata) {
  const isPdf = file.type === 'application/pdf'
  const url = getUploadUrl(isPdf)
  const preset = isPdf ? UPLOAD_PRESET_RAW : UPLOAD_PRESET_IMAGE
  const formData = new FormData()
  formData.append('file', file)
  formData.append('upload_preset', preset)
  formData.append('context', `subjectCode=${metadata.subjectCode}|subjectName=${encodeURIComponent(metadata.subjectName)}|paperType=${metadata.paperType}|paperName=${encodeURIComponent(metadata.paperName)}`)

  const res = await fetch(url, {
    method: 'POST',
    body: formData,
  })
  if (!res.ok) {
    const err = await res.text()
    throw new Error(err || 'Upload failed')
  }
  return res.json()
}
