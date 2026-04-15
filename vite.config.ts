import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

/** Must match the GitHub repo name (project Pages URL segment). */
const GITHUB_PAGES_BASE = '/Typing-simulator/'

// https://vite.dev/config/
export default defineConfig(({ mode }) => ({
  plugins: [react()],
  /** Production builds target GitHub Pages; dev server uses `/`. */
  base: mode === 'production' ? GITHUB_PAGES_BASE : '/',
}))
