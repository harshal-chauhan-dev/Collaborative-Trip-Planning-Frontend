# Collaborative Trip Planning — Frontend

SPA for collaborative trip planning. **React 18**, **Vite**, **Tailwind CSS v4**, **React Router**, **TanStack Query**, **react-hook-form** + **Zod**, **@dnd-kit** for drag-and-drop.

## Requirements

- Node.js 20+

## Setup

```bash
npm install
```

No env file is required for default local development.

## Development

Start the **backend** on port `3000`, then:

```bash
npm run dev
```

The app loads at `http://localhost:5173`. Vite proxies requests from `/api` to `http://localhost:3000` (see `vite.config.js`), and `src/lib/api.js` uses `/api` as the fetch base so cookies stay same-origin during dev.

## Production build

```bash
npm run build
npm run preview   # optional: local preview of dist/
```

`npm run build` outputs static assets under `dist/`. If you host the UI on a different origin than the API, you must either:

- Put a reverse proxy in front so browser requests still go to `/api` on the same host as the SPA, **or**
- Change the fetch base in `src/lib/api.js` (and any raw `fetch` URLs such as in `src/api/attachments.js`) to your deployed API URL, including the `/api` prefix (e.g. `https://your-api.example.com/api`).

Also set the backend `CORS_ORIGIN` to your deployed frontend URL.

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
- `src/lib/api.js` — HTTP client (`credentials: 'include'` for cookies)  
- `src/lib/ui.js` — Shared Tailwind class helpers  
- `src/styles/globals.css` — Tailwind entry + base styles  

For roles, API overview, and repo-wide docs, see the monorepo `README.md` one level up.
