import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

export default defineConfig({
  plugins: [vue()],
  preview: {
    port: process.env.PORT || 4173,
    host: '0.0.0.0'
  }
})