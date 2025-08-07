import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
const isNetlifyDev = !!process.env.NETLIFY_DEV || process.env.NETLIFY === 'true'

export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000,
    host: true,
    // Use secure HMR only when running through Netlify Dev live tunnel
    ...(isNetlifyDev
      ? { hmr: { protocol: 'wss', clientPort: 443 } }
      : {}),
    proxy: {
      '/api': {
        target: 'http://localhost:5000',
        changeOrigin: true,
        secure: false
      }
    }
  }
})
