import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/api': {
        target: 'https://project-management-app-89n4.onrender.com/',
        changeOrigin: true,
        secure: false,
      },
      '/socket.io': {
        target: 'https://project-management-app-89n4.onrender.com/',
        ws: true,
      },
    },
  },
})
