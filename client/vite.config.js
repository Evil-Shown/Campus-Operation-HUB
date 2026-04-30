import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import nodePolyfills from 'rollup-plugin-node-polyfills'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    nodePolyfills()
  ],
  server: {
    proxy: {
      '/api': {
        target: process.env.VITE_API_PROXY_TARGET || 'http://localhost:8080',
        changeOrigin: true,
      },
    },
  },
  resolve: {
    alias: {
      stream: 'stream-browserify',
      buffer: 'buffer',
      events: 'events',
      util: 'util',
      process: 'process/browser',
      path: 'path-browserify',
      os: 'os-browserify/browser',
      assert: 'assert',
    },
    dedupe: ['react', 'react-dom'],
  },
})
