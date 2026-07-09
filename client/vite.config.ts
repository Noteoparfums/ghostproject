import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    host: '0.0.0.0',
    allowedHosts: true,
    hmr: {
      host: 'e7d841ba-5173-2-base.preview.verdent.ai',
      protocol: 'wss',
      clientPort: 443,
    },
  },
  preview: {
    host: '0.0.0.0',
    allowedHosts: true,
  },
})
