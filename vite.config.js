import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  // Strip console.log and debugger statements from production builds
  esbuild: {
    drop: ['console', 'debugger'],
  },
  build: {
    target: 'es2020',
    chunkSizeWarningLimit: 500,
    rollupOptions: {
      output: {
        manualChunks: {
          'react-vendor': ['react', 'react-dom', 'react-router-dom'],
          'gsap': ['gsap'],
          'icons': ['react-icons'],
        },
      },
    },
  },
})
