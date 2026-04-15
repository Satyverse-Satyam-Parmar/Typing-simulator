# Typing simulator

A self-contained Vite + React + TypeScript demo that auto-types mocked code snippets using a small Zustand store and a typing engine hook. No backend is required.

Repository: [github.com/Satyverse-Satyam-Parmar/Typing-simulator](https://github.com/Satyverse-Satyam-Parmar/Typing-simulator)

## Setup

```bash
npm install
npm run dev
```

Then open the URL shown in the terminal (typically `http://localhost:5173`).

## Scripts

- `npm run dev` — start the Vite dev server
- `npm run build` — typecheck and production build
- `npm run lint` — run ESLint
- `npm run preview` — preview the production build locally

## GitHub Pages

The site deploys automatically when you push to `main` (see `.github/workflows/deploy-github-pages.yml`).

1. In the GitHub repo: **Settings → Pages → Build and deployment → Source**: select **GitHub Actions**.
2. After the first successful workflow run, the app is available at:

**https://satyverse-satyam-parmar.github.io/Typing-simulator/**

Production builds (`npm run build`) use the `/Typing-simulator/` base path automatically. Preview the GitHub Pages bundle locally:

```bash
npm run build
npm run preview
```

Then open the URL Vite prints — use the path **`/Typing-simulator/`** (e.g. `http://localhost:4173/Typing-simulator/`).
