import type { VercelRequest, VercelResponse } from '@vercel/node'

// Optional server-side TTS via Google Cloud Text-to-Speech (natural ja-JP
// voices). Enabled only when GOOGLE_TTS_API_KEY is set. The response is a
// cacheable MP3 — because the app's text is a fixed vocabulary set, Vercel's
// CDN caches each clip and the Google free tier is effectively never spent.
//
// Enable on the client with VITE_TTS_MODE=server. Without the key/flag the app
// falls back to the browser's Web Speech API (no setup, no cost).

const DEFAULT_VOICE = 'ja-JP-Neural2-B'
const ALLOWED_VOICES = new Set([
  'ja-JP-Neural2-B',
  'ja-JP-Neural2-C',
  'ja-JP-Neural2-D',
  'ja-JP-Wavenet-A',
  'ja-JP-Wavenet-B',
  'ja-JP-Wavenet-C',
  'ja-JP-Wavenet-D',
  'ja-JP-Standard-A',
])

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'GET') {
    res.setHeader('Allow', 'GET')
    return res.status(405).json({ error: 'Method not allowed' })
  }

  const text = typeof req.query.text === 'string' ? req.query.text.trim() : ''
  const voiceParam = typeof req.query.voice === 'string' ? req.query.voice : DEFAULT_VOICE
  const voice = ALLOWED_VOICES.has(voiceParam) ? voiceParam : DEFAULT_VOICE

  if (!text) return res.status(400).json({ error: 'Missing text.' })
  if (text.length > 200) return res.status(400).json({ error: 'Text too long (200 char max).' })

  const key = process.env.GOOGLE_TTS_API_KEY
  if (!key) return res.status(501).json({ error: 'Server TTS is not configured (set GOOGLE_TTS_API_KEY).' })

  try {
    const r = await fetch(`https://texttospeech.googleapis.com/v1/text:synthesize?key=${key}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        input: { text },
        voice: { languageCode: 'ja-JP', name: voice },
        audioConfig: { audioEncoding: 'MP3', speakingRate: 0.95 },
      }),
    })

    if (!r.ok) {
      console.error('tts provider error', r.status, await r.text())
      return res.status(502).json({ error: 'TTS provider error.' })
    }

    const data = (await r.json()) as { audioContent?: string }
    if (!data.audioContent) return res.status(502).json({ error: 'No audio returned.' })

    const buffer = Buffer.from(data.audioContent, 'base64')
    res.setHeader('Content-Type', 'audio/mpeg')
    // Immutable per (text, voice) — cached by the browser and Vercel's CDN.
    res.setHeader('Cache-Control', 'public, max-age=31536000, immutable')
    return res.status(200).send(buffer)
  } catch (err) {
    console.error('tts error', err)
    return res.status(500).json({ error: 'TTS failed.' })
  }
}
