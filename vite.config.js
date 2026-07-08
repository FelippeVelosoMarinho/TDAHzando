import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/api': 'http://localhost:3001',
      '/uploads': 'http://localhost:3001',
      '/maps': 'http://localhost:5174',
      '/hair': 'http://localhost:5175',
      '/cad': 'http://localhost:5176'
    }
  }
})
