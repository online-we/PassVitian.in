import { listPapers } from '../server/listings.js'

function jsonResponse(data, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: {
      'Content-Type': 'application/json',
      'Cache-Control': 'public, max-age=60',
    },
  })
}

export async function GET() {
  try {
    const papers = await listPapers(process.env)
    return jsonResponse({ papers })
  } catch (err) {
    return jsonResponse(
      { error: err.message || 'Server error', missing: err.missing },
      500
    )
  }
}
