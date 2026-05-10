const trimTrailingSlashes = (value) => value.replace(/\/+$/, '');

/**
 * Public API origin without path (e.g. https://my-api.onrender.com).
 * When unset, the app uses relative `/api` (works with the Vite dev proxy).
 */
const apiOrigin = (import.meta.env.VITE_API_ORIGIN ?? '').trim();

/**
 * Base URL for every API request, including the `/api` prefix. No trailing slash.
 */
export const API_BASE_URL = apiOrigin
  ? `${trimTrailingSlashes(apiOrigin)}/api`
  : '/api';
