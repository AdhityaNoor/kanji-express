import { useCallback, useEffect, useRef, useState } from 'react'

// Set VITE_TTS_MODE=server to route through /api/tts (Google Cloud TTS).
// Otherwise the browser's built-in Web Speech API is used (free, no setup).
const SERVER_MODE = import.meta.env.VITE_TTS_MODE === 'server'

// Natural-sounding ja-JP voices, in order of preference across platforms.
const PREFERRED = ['Kyoko', 'Google 日本語', 'Microsoft Nanami', 'Microsoft Haruka', 'O-ren', 'Hattori', 'Ayumi']

let cachedVoice: SpeechSynthesisVoice | null | undefined

function pickJaVoice(): SpeechSynthesisVoice | null {
  if (typeof window === 'undefined' || !window.speechSynthesis) return null
  const voices = window.speechSynthesis.getVoices()
  const ja = voices.filter((v) => v.lang?.toLowerCase().startsWith('ja'))
  if (ja.length === 0) return null
  for (const name of PREFERRED) {
    const match = ja.find((v) => v.name.includes(name))
    if (match) return match
  }
  return ja[0]
}

/**
 * Japanese text-to-speech. Uses the Web Speech API by default (free, offline,
 * no key). If VITE_TTS_MODE=server, plays audio from /api/tts and falls back to
 * the browser voice if that request fails.
 */
export function useSpeak() {
  const [speaking, setSpeaking] = useState(false)
  const audioRef = useRef<HTMLAudioElement | null>(null)

  const browserSupported = typeof window !== 'undefined' && 'speechSynthesis' in window
  const supported = SERVER_MODE || browserSupported

  useEffect(() => {
    if (!browserSupported) return
    const load = () => {
      cachedVoice = pickJaVoice()
    }
    load()
    // Voices often load asynchronously; refresh when they arrive.
    window.speechSynthesis.addEventListener('voiceschanged', load)
    return () => window.speechSynthesis.removeEventListener('voiceschanged', load)
  }, [browserSupported])

  const speakBrowser = useCallback(
    (text: string, rate = 0.95) => {
      if (!browserSupported) return
      window.speechSynthesis.cancel()
      const u = new SpeechSynthesisUtterance(text)
      u.lang = 'ja-JP'
      if (cachedVoice === undefined) cachedVoice = pickJaVoice()
      if (cachedVoice) u.voice = cachedVoice
      u.rate = rate
      u.onstart = () => setSpeaking(true)
      u.onend = () => setSpeaking(false)
      u.onerror = () => setSpeaking(false)
      window.speechSynthesis.speak(u)
    },
    [browserSupported],
  )

  const speakServer = useCallback(
    async (text: string) => {
      try {
        setSpeaking(true)
        const audio = audioRef.current ?? (audioRef.current = new Audio())
        audio.src = `/api/tts?text=${encodeURIComponent(text)}`
        audio.onended = () => setSpeaking(false)
        audio.onerror = () => {
          setSpeaking(false)
          speakBrowser(text) // graceful fallback
        }
        await audio.play()
      } catch {
        setSpeaking(false)
        speakBrowser(text)
      }
    },
    [speakBrowser],
  )

  const speak = useCallback(
    (text: string) => {
      if (!text) return
      if (SERVER_MODE) void speakServer(text)
      else speakBrowser(text)
    },
    [speakBrowser, speakServer],
  )

  const stop = useCallback(() => {
    if (browserSupported) window.speechSynthesis.cancel()
    audioRef.current?.pause()
    setSpeaking(false)
  }, [browserSupported])

  return { speak, stop, speaking, supported }
}
