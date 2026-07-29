/// <reference types="vite/client" />

interface ImportMetaEnv {
  /** 'server' routes TTS through /api/tts; anything else uses the Web Speech API. */
  readonly VITE_TTS_MODE?: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
