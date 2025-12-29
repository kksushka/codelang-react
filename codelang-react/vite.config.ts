import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  base:'/codelang-react/',
  server: {
    proxy: {
      '/api': {
        target: 'https://codelang.vercel.app',
        changeOrigin: true,
        secure: true,
      }
    }
  }
})

