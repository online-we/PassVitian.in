import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
import { listBicycles, listPapers } from './server/listings.js'
import { createSignedUpload } from './server/r2.js'

function readJson(req) {
  return new Promise((resolve, reject) => {
    const chunks = []
    req.on('data', (chunk) => chunks.push(chunk))
    req.on('end', () => {
      try {
        const raw = Buffer.concat(chunks).toString('utf8')
        resolve(raw ? JSON.parse(raw) : {})
      } catch (err) {
        reject(err)
      }
    })
    req.on('error', reject)
  })
}

function sendJson(res, status, data) {
  res.statusCode = status
  res.setHeader('Content-Type', 'application/json')
  res.end(JSON.stringify(data))
}

function localApiPlugin(env) {
  return {
    name: 'passvitian-local-api',
    configureServer(server) {
      server.middlewares.use('/api/list-papers', async (req, res) => {
        try {
          const papers = await listPapers(env)
          sendJson(res, 200, { papers })
        } catch (err) {
          sendJson(res, 500, { error: err.message || 'Server error', missing: err.missing })
        }
      })

      server.middlewares.use('/api/list-bicycles', async (req, res) => {
        try {
          const bicycles = await listBicycles(env)
          sendJson(res, 200, { bicycles })
        } catch (err) {
          sendJson(res, 500, { error: err.message || 'Server error', missing: err.missing })
        }
      })

      server.middlewares.use('/api/sign-upload', async (req, res) => {
        if (req.method !== 'POST') {
          sendJson(res, 405, { error: 'Method not allowed' })
          return
        }
        try {
          const body = await readJson(req)
          const signed = await createSignedUpload(env, body)
          sendJson(res, 200, signed)
        } catch (err) {
          sendJson(res, err.status || 400, {
            error: err.message || 'Could not start upload',
            missing: err.missing,
          })
        }
      })
    },
  }
}

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')
  return {
    plugins: [react(), localApiPlugin(env)],
  }
})
