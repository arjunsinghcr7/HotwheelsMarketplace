import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    // Forward API calls to the local Express server during development so the
    // client can use same-origin '/api' paths (matching the Vercel setup).
    proxy: {
      '/api': 'http://localhost:5001',
    },
  },
})
