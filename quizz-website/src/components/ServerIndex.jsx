import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import fetch from 'node-fetch'

dotenv.config()

const app  = express()
const PORT = process.env.PORT || 5000

// ── Middleware ────────────────────────────────────────────────────
app.use(cors({ origin: 'http://localhost:5173' })) // Vite dev server
app.use(express.json())

// ── Health check ─────────────────────────────────────────────────
app.get('/api/health', (req, res) => {
  const hasKey = !!process.env.ANTHROPIC_API_KEY
  res.json({
    status : 'ok',
    apiKey : hasKey ? 'configured' : 'missing — add ANTHROPIC_API_KEY to .env',
  })
})

// ── Claude proxy endpoint ─────────────────────────────────────────
// Frontend calls POST /api/claude  →  server calls Anthropic  →  returns response
app.post('/api/claude', async (req, res) => {
  const apiKey = process.env.ANTHROPIC_API_KEY

  if (!apiKey) {
    return res.status(500).json({
      error: 'ANTHROPIC_API_KEY is not set in server/.env'
    })
  }

  const { messages, system, max_tokens = 600 } = req.body

  if (!messages || !Array.isArray(messages)) {
    return res.status(400).json({ error: 'messages array is required' })
  }

  try {
    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method : 'POST',
      headers: {
        'Content-Type'      : 'application/json',
        'x-api-key'         : apiKey,
        'anthropic-version' : '2023-06-01',
      },
      body: JSON.stringify({
        model      : 'claude-sonnet-4-20250514',
        max_tokens,
        system,
        messages,
      }),
    })

    const data = await response.json()

    if (!response.ok) {
      console.error('Anthropic error:', data)
      return res.status(response.status).json({
        error: data?.error?.message || 'Anthropic API error',
      })
    }

    // Extract plain text from response
    const text = data.content
      .map(c => (c.type === 'text' ? c.text : ''))
      .join('')

    res.json({ text })

  } catch (err) {
    console.error('Server error:', err.message)
    res.status(500).json({ error: 'Server failed to reach Anthropic: ' + err.message })
  }
})

app.listen(PORT, () => {
  console.log(`\n✅ QuizMind server running on http://localhost:${PORT}`)
  console.log(`   Claude proxy: http://localhost:${PORT}/api/claude`)
  console.log(`   Health check: http://localhost:${PORT}/api/health\n`)
})