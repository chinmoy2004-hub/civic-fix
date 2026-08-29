import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
   preview: {
    allowedHosts: ['civic-fix-1-h858.onrender.com'],
  },
})
