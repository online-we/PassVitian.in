import { listBicycles } from '../server/listings.js'

function jsonResponse(data, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: {
      'Content-Type': 'application/json',
      'Cache-Control': 'public, max-age=30',
    },
  })
}

export async function GET() {
  try {
    const bicycles = await listBicycles(process.env)
    return jsonResponse({ bicycles })
  } catch (err) {
    return jsonResponse(
      { error: err.message || 'Server error', missing: err.missing },
      500
    )
  }
}
