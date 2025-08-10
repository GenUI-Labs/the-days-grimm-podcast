import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
const isNetlifyDev = !!process.env.NETLIFY_DEV || process.env.NETLIFY === 'true'

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')
  const backendPort = env.VITE_BACKEND_PORT || '5000'
  return {
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
          target: `http://localhost:${backendPort}`,
          changeOrigin: true,
          secure: false
        }
      }
    }
  }
})
