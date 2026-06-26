import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    // Serve the dev client on 8080 (fail fast if it's taken rather than
    // silently picking another port).
    port: 8080,
    strictPort: true,
    // Forward API calls to the local Express server during development so the
    // client can use same-origin '/api' paths (matching the Vercel setup).
    proxy: {
      '/api': 'http://localhost:5001',
    },
  },
})
