import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': '/src',
    },
  },
  server: {
    port: 5173,
    proxy: {
      '/ai': {
        target: 'http://localhost:8000',
        changeOrigin: true,
      },
      '/adapter-test': {
        target: 'http://localhost:8000',
        changeOrigin: true,
      },
    },
  },
})
