# Collaborative Trip Planning — Frontend

SPA for collaborative trip planning. **React 18**, **Vite**, **Tailwind CSS v4**, **React Router**, **TanStack Query**, **react-hook-form** + **Zod**, **@dnd-kit** for drag-and-drop.

## Requirements

- Node.js 20+

## Setup

```bash
npm install
```

Copy `.env.example` if you want a template; committed defaults live in `.env.development` and `.env.production`.

## Environment variables

Vite only exposes variables prefixed with `VITE_`. The app reads them in `src/lib/env.js`.

| Variable | Mode | Purpose |
|----------|------|---------|
| `VITE_API_ORIGIN` | Usually production | Public backend origin **without** `/api`. When unset, requests use relative `/api`. |
| `VITE_DEV_PROXY_TARGET` | Development | Where Vite proxies `/api` (default `http://localhost:3000` if omitted). |

Production builds load `.env.production` (tracked example points at Render). Local overrides: create `.env.local` (gitignored).

All HTTP calls go through `src/lib/api.js`, which uses `API_BASE_URL` from `env.js`. Import `API_BASE_URL` from `lib/api.js` if you need the same base for a raw `fetch` (see `src/api/attachments.js`).

## Development

Start the **backend** (default proxy target is port `3000`), then:

```bash
npm run dev
```

The app loads at `http://localhost:5173`. With `VITE_API_ORIGIN` unset, the UI calls `/api`, and Vite forwards those requests to `VITE_DEV_PROXY_TARGET`.

## Production build

```bash
npm run build
npm run preview   # optional: local preview of dist/
```

Set `VITE_API_ORIGIN` in `.env.production` (or your host’s env) to your deployed API origin. Configure the backend **`CORS_ORIGIN`** to match your deployed frontend URL.

## Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Vite dev server |
| `npm run build` | Production bundle |
| `npm run preview` | Serve `dist/` locally |
| `npm run lint` / `npm run format` | ESLint / Prettier |

## Layout

- `src/api/` — Thin wrappers around `lib/api.js` per domain  
- `src/pages/` — Route screens  
- `src/components/` — Shared UI  
- `src/context/AuthContext.jsx` — Session state  
- `src/lib/env.js` — `API_BASE_URL` from `import.meta.env`  
- `src/lib/api.js` — HTTP client (`credentials: 'include'` for cookies)  
- `src/lib/ui.js` — Shared Tailwind class helpers  
- `src/styles/globals.css` — Tailwind entry + base styles  

For roles, API overview, and repo-wide docs, see the monorepo `README.md` one level up.
