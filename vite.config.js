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
      // ── Django Backend (Port 8000): Auth, Users, Database Adapters ──────
      '/api/django': {
        target: 'http://localhost:8000',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api\/django/, ''),
      },
      '/adapter-test': {
        target: 'http://localhost:8000',
        changeOrigin: true,
      },
      '/auth': {
        target: 'http://localhost:8000',
        changeOrigin: true,
      },
      
      // ── FastAPI AI Engine (Port 8001): Multi-Agent AI, Graph Intelligence ──
      '/api/fastapi': {
        target: 'http://localhost:8001',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api\/fastapi/, ''),
      },
      '/ai': {
        target: 'http://localhost:8001',
        changeOrigin: true,
      },
    },
  },
})
