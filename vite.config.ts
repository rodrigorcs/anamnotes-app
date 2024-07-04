import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

export default defineConfig({
  define: {
    process: {
      env: {
        NODE_ENV: 'production',
      },
    },
  },
  plugins: [react()],
  build: {
    rollupOptions: {
      input: {
        main: path.resolve(__dirname, 'index.html'),
      },
    },
    target: 'es2015',
  },
})
