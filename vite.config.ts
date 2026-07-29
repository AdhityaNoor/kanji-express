import { defineConfig, type Plugin } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import path from 'node:path'

/**
 * The `api/` folder is Vercel serverless functions (Node-only: mongodb, bcrypt,
 * jwt). Plain `vite` can't run them, and if the browser hits `/api/*` on the
 * Vite dev server, Vite tries to transform the raw .ts and fails on the Node
 * imports. This guard short-circuits `/api/*` with a clear message.
 *
 * Under `vercel dev`, requests to `/api/*` are handled by the Vercel runtime
 * before they ever reach Vite, so this middleware never runs there.
 */
function apiDevGuard(): Plugin {
  return {
    name: 'ke-api-dev-guard',
    apply: 'serve',
    configureServer(server) {
      server.middlewares.use((req, res, next) => {
        if (req.url && req.url.startsWith('/api/')) {
          res.statusCode = 501
          res.setHeader('Content-Type', 'application/json')
          res.end(
            JSON.stringify({
              error:
                'The API only runs under `vercel dev`. Start the app with `vercel dev` (http://localhost:3000) instead of `npm run dev`.',
            }),
          )
          return
        }
        next()
      })
    },
  }
}

export default defineConfig({
  plugins: [react(), tailwindcss(), apiDevGuard()],
  resolve: {
    alias: { '@': path.resolve(__dirname, './src') },
  },
})
