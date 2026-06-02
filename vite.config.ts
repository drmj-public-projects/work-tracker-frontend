import path from 'path'
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig(({ mode }) => ({
  plugins: [react(), tailwindcss()],
  base: '/',
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  build: {
    outDir: 'dist',
    sourcemap: mode !== 'production',
    rollupOptions: {
      output: {
        manualChunks(id: string) {
          if (id.includes('node_modules')) {
            if (['react', 'react-dom', 'react-router-dom'].some((pkg) => id.includes(pkg))) return 'react'
            if (['axios', 'zustand', '@tanstack/react-query'].some((pkg) => id.includes(pkg))) return 'vendors'
            if (['lucide-react', 'recharts'].some((pkg) => id.includes(pkg))) return 'ui'
            if (['react-hook-form', '@hookform/resolvers', 'zod'].some((pkg) => id.includes(pkg))) return 'forms'
            if (['i18next', 'react-i18next', 'i18next-browser-languagedetector'].some((pkg) => id.includes(pkg))) return 'i18n'
            if (['leaflet', 'react-leaflet'].some((pkg) => id.includes(pkg))) return 'maps'
          }
        },
      },
    },
  },
}))
