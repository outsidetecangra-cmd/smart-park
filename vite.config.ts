import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  // GitHub Pages (repo: outsidetecangra-cmd/smart-park)
  base: "/smart-park/",
  build: {
    sourcemap: false,
  },
  plugins: [react()],
})
