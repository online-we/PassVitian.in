import { createSignedUpload } from '../server/r2.js'

function jsonResponse(data, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { 'Content-Type': 'application/json' },
  })
}

export async function POST(request) {
  try {
    const body = await request.json()
    const signed = await createSignedUpload(process.env, body)
    return jsonResponse(signed)
  } catch (err) {
    return jsonResponse(
      { error: err.message || 'Could not start upload', missing: err.missing },
      err.status || 400
    )
  }
}
