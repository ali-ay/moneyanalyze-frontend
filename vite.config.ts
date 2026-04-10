import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  optimizeDeps: {
    exclude: ['styled-components'] // Bu satırı ekleyerek Vite'ın bu paketi kurcalamasını engelliyoruz
  }
})