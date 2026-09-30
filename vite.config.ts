import { fileURLToPath, URL } from 'node:url'
import vue from '@vitejs/plugin-vue'
import { defineConfig } from 'vite'

const WATCH_IGNORED = [
  '**/.tmpdir/**',
  '**/*.tmp',
  '**/.smoke/**',
  '**/dist/**',
  '**/.pnpm-store/**',
  '**/node_modules/**',
]

export default defineConfig({
  base: './',
  plugins: [vue()],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
  server: {
    host: '127.0.0.1',
    port: 5199,
    strictPort: true,
    watch: { ignored: WATCH_IGNORED },
  },
  preview: {
    host: '127.0.0.1',
    port: 5199,
    strictPort: true,
  },
  build: {
    sourcemap: true,
    chunkSizeWarningLimit: 900,
  },
})
