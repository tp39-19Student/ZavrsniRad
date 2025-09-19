import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      "/api": {
        target: "https://localhost:7245",
        changeOrigin: true,
        secure: false
      }
    }
  },
  css: {
    preprocessorOptions: {
      scss: {
        silenceDeprecations: [
            'import',
            'color-functions',
            'global-builtin',
        ]
      }
    }
  }
})
