import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// GitHub Pages project site: https://<user>.github.io/Typing-simulator/
const repoName = 'Typing-simulator'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  base: process.env.GH_PAGES === 'true' ? `/${repoName}/` : '/',
})
